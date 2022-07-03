import { IPlugin } from './Plugin.interface';
import { Step } from './Step.type';

const stepMock: Step = {
  name: 'step of a mocked plugin',
  commitMessage: 'chore(step-mock): doing something',
  run: async () => {
    return true;
  },
};

export const createStepMock = (params?: Partial<Step>) => {
  return { ...stepMock, ...params };
};

export const pluginMock: IPlugin = {
  id: 'plugin-mock-id',
  displayName: 'Plugin mock',
  version: '1',
  steps: [stepMock],
  dependencies: [],
  run: async () => true,
};

export const createPluginMock = (params?: Partial<IPlugin>) => {
  return { ...pluginMock, ...params };
};
