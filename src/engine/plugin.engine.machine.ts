import { createMachine, assign } from 'xstate';
import { Plugin } from './Plugin/Plugin.impl';

const hasPluginToRun = ({ pluginsList }: { pluginsList: string[] }) =>
  pluginsList.length > 0;

const runStep = async () => {
  console.log('run step');
};

const hasStepToRun = () => {
  return false;
};

const pluginExecutionValid = (context: {
  currentPluginError: string | undefined;
}) => {
  return !context.currentPluginError;
};

const fallback = async () => {
  return Promise.resolve(true);
};

type MachineContext = {
  pluginsList: string[];
  currentPluginId: string | undefined;
  currentPluginError: string | undefined;
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
            {
              target: 'runningPlugin',
              cond: hasPluginToRun,
              actions: assign<MachineContext>({
                currentPluginId: (context) => context.pluginsList[0],
              }),
            },
            { target: 'end' },
          ],
        },
        runningPlugin: {
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
                  target: 'loadingNextStep',
                },
              },
            },
            loadingNextStep: {
              always: [
                { target: 'runningStep', cond: hasStepToRun },
                { target: 'success' },
              ],
            },
            runningStep: {
              invoke: {
                id: 'runningStep',
                src: runStep,
                onError: {
                  target: 'failure',
                },
                onDone: {
                  target: 'loadingNextStep',
                },
              },
            },
            success: {
              type: 'final',
              entry: assign<MachineContext>({
                pluginsList: (context) => context.pluginsList.slice(1),
              }),
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
