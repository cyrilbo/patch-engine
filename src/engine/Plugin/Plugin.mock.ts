import { Plugin } from './Plugin.type';
import { Step } from './Step.type';

const stepMock: Step = {
  name: 'step of a mocked plugin',
  commitMessage: 'chore(step-mock): doing something',
  failureProcedure: ['do this'],
  run: async () => {},
};

export const createStepMock = (params?: Partial<Step>) => {
  return { ...stepMock, ...params };
};

export const pluginMock: Plugin = {
  id: 'plugin-mock-id',
  displayName: 'Plugin mock',
  version: '1',
  steps: [stepMock],
  dependencies: [],
};

export const createPluginMock = (params?: Partial<Plugin>) => {
  return { ...pluginMock, ...params };
};
