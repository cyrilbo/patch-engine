import { Plugin } from '../../engine/Plugin/Plugin.type';
import { Step } from '../../engine/Plugin/Step.type';

const firstStep: Step = {
  name: 'first step of plugin a',
  commitMessage: 'chore(a): doing something',
  failureProcedure: ['run the command xxx', 'run the command yyy'],
  run: async () => {
    console.log('first step run successfully');
  },
};

export const aPlugin: Plugin = {
  id: 'plugin-a',
  displayName: 'Plugin a',
  version: '1',
  steps: [firstStep],
  dependencies: ['plugin-b'],
};
