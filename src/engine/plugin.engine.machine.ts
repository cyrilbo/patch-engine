import { createMachine, assign } from 'xstate';
import { Plugin } from './Plugin/Plugin.impl';

const hasPluginToRun = ({ pluginsList }: { pluginsList: string[] }) =>
  pluginsList.length > 0;

const doesNotHavePluginToRun = ({ pluginsList }: { pluginsList: string[] }) => {
  return pluginsList.length <= 0;
};

const runStep = async () => {
  console.log('run step');
};

const getCurrentPlugin = (id: string) => {
  console.log(id);
  return true;
};

const hasStepToRun = ({
  currentPluginId,
}: {
  currentPluginId: string | undefined;
}) => {
  return !!currentPluginId && getCurrentPlugin(currentPluginId);
};

const doesNotHaveStepToRun = ({
  currentPluginId,
}: {
  currentPluginId: string | undefined;
}) => {
  return !currentPluginId || !getCurrentPlugin(currentPluginId);
};

const pluginExecutionValid = (context: {
  currentPluginError: string | undefined;
}) => {
  return !context.currentPluginError;
};

const fallback = async () => {
  return true;
};

export const createEngine = (
  plugins: Plugin[],
  options?: {
    onPrePluginRun?: () => Promise<boolean>;
  },
) => {
  const onPrePluginRun = options?.onPrePluginRun ?? fallback;
  const pluginsList = plugins.map((plugin) => plugin.id);
  return createMachine(
    {
      id: 'engine',
      initial: 'loadingNextPlugin',
      context: {
        pluginsList,
        currentPluginId: undefined,
        currentPluginError: undefined,
      },
      states: {
        loadingNextPlugin: {
          always: [
            { target: 'runPlugin', cond: hasPluginToRun },
            { target: 'end', cond: doesNotHavePluginToRun },
          ],
        },
        runPlugin: {
          type: 'compound',
          initial: 'preRun',
          states: {
            preRun: {
              invoke: {
                id: 'preRun',
                src: onPrePluginRun,
                onError: {
                  target: 'failure',
                  actions: assign({
                    currentPluginError: (_, event) => event.data,
                  }),
                },
                onDone: {
                  target: 'checkNextStep',
                },
              },
            },
            checkNextStep: {
              on: {
                always: [
                  { target: 'running', cond: hasStepToRun },
                  { target: 'success', cond: doesNotHaveStepToRun },
                ],
              },
            },
            running: {
              invoke: {
                id: 'running',
                src: runStep,
                onError: {
                  target: 'failure',
                },
                onDone: {
                  target: 'checkNextStep',
                },
              },
            },
            success: {
              type: 'final',
            },
            failure: {
              type: 'final',
            },
          },
          onDone: [
            {
              target: 'loadingNextPlugin',
              cond: pluginExecutionValid,
            },
            // If the condition is false, validation failed, so go to invalid
            {
              target: 'failure',
            },
          ],
        },
        failure: {},
        end: {},
      },
    },
    {
      actions: {},
      delays: {},
      guards: {},
      services: {
        /* ... */
      },
    },
  );
};
