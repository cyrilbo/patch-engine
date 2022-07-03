import { printStepFailed, printStepSucceeded } from './Plugin/Plugin.print';
import { printPluginBeeingApplied } from './plugin.engine.print';
import { createMachine, assign } from 'xstate';
import { Plugin } from './Plugin/Plugin.type';
import { printStepIsRunning } from './Plugin/Plugin.print';

const hasPluginToRun = ({ pluginsList }: { pluginsList: string[] }) =>
  pluginsList.length > 0;

const hasStepToRun = (
  context: MachineContext,
  getPluginById: (id: string) => Plugin,
) => {
  const plugin = getPluginById(context.currentPluginId);
  if (plugin.steps.length <= 0) {
    return false;
  }
  if (context.currentPluginStepIndex === undefined) return true;
  if (context.currentPluginStepIndex >= plugin.steps.length - 1) return false;
  return true;
};

const pluginExecutionValid = (context: {
  currentPluginError: string | undefined;
}) => {
  return !context.currentPluginError;
};

const fallback = async () => {
  return Promise.resolve(true);
};

export type MachineContext = {
  pluginsList: string[];
  currentPluginId: string | undefined;
  currentPluginStepIndex: number | undefined;
  currentPluginError: string | undefined;
};

export type CreateEngineOptions = {
  onPrePluginRun?: () => Promise<void>;
};

export const createEngine = (
  plugins: Plugin[],
  options?: CreateEngineOptions,
) => {
  const onPrePluginRun = options?.onPrePluginRun ?? fallback;
  const getPluginById = (id: string) => {
    const plugin = plugins.find((p) => p.id === id);
    if (plugin) return plugin;
    throw new Error(`Plugin ${id} not found`);
  };

  const pluginsList = plugins.map((plugin) => plugin.id);
  return createMachine(
    {
      id: 'engine',
      initial: 'loadingNextPlugin',
      context: {
        pluginsList,
        currentPluginId: undefined,
        currentPluginStepIndex: undefined,
        currentPluginError: undefined,
      },
      states: {
        loadingNextPlugin: {
          always: [
            {
              target: 'runningPlugin',
              cond: hasPluginToRun,
              actions: [
                assign<MachineContext>({
                  currentPluginId: (context) => context.pluginsList[0],
                }),
                'printPluginBeeingApplied',
              ],
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
                {
                  target: 'runningStep',
                  cond: (context) => hasStepToRun(context, getPluginById),
                  actions: assign<MachineContext>({
                    currentPluginStepIndex: (context) =>
                      context.currentPluginStepIndex === undefined
                        ? 0
                        : context.currentPluginStepIndex + 1,
                  }),
                },
                { target: 'success' },
              ],
            },
            runningStep: {
              entry: ['printStepIsRunning'],
              invoke: {
                id: 'runningStep',
                src: async (context) => {
                  const plugin = getPluginById(context.currentPluginId);
                  await plugin.steps[context.currentPluginStepIndex].run();
                },
                onError: {
                  target: 'failure',
                  actions: assign({
                    currentPluginError: (_, event) => event.data,
                  }),
                },
                onDone: {
                  target: 'loadingNextStep',
                  actions: 'printStepSucceeded',
                },
              },
            },
            success: {
              type: 'final',
              entry: assign<MachineContext>({
                pluginsList: (context) => context.pluginsList.slice(1),
                currentPluginId: undefined,
                currentPluginStepIndex: undefined,
              }),
            },
            failure: {
              entry: 'printStepFailed',
              on: {
                ERROR_MANUALLY_HANDLED: {
                  target: 'loadingNextStep',
                  actions: assign({
                    currentPluginError: undefined,
                  }),
                },
              },
            },
          },
          onDone: [
            {
              target: 'loadingNextPlugin',
              cond: pluginExecutionValid,
            },
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
      actions: {
        printPluginBeeingApplied: (context) => {
          const plugin = getPluginById(context.currentPluginId);
          printPluginBeeingApplied(plugin);
        },
        printStepIsRunning: (context) => {
          const plugin = getPluginById(context.currentPluginId);
          const step = plugin.steps[context.currentPluginStepIndex];
          printStepIsRunning(step, context.currentPluginStepIndex);
        },
        printStepFailed,
        printStepSucceeded,
      },
    },
  );
};
