import { createMachine } from 'xstate';
import { Plugin } from './Plugin/Plugin.impl';

const hasPluginToRun = ({ pluginsList }: { pluginsList: string[] }) =>
  pluginsList.length > 0;
const doesNotHavePluginToRun = ({ pluginsList }: { pluginsList: string[] }) => {
  return pluginsList.length <= 0;
};

const preRun = async () => {
  console.log('pre run');
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

export const createEngine = (plugins: Plugin[]) => {
  const pluginsList = plugins.map((plugin) => plugin.id);
  return createMachine(
    {
      id: 'engine',
      initial: 'init',
      context: {
        pluginsList,
        currentPluginId: undefined,
        currentPluginError: undefined,
      },
      states: {
        init: {
          on: {
            always: [
              { target: 'runPlugin', cond: hasPluginToRun },
              { target: 'end', cond: doesNotHavePluginToRun },
            ],
          },
        },
        runPlugin: {
          type: 'compound',
          initial: 'preRun',
          states: {
            preRun: {
              invoke: {
                id: 'preRun',
                src: preRun,
                onError: {
                  target: 'failure',
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
              target: 'end',
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
