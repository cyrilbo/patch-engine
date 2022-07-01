import { Plugin } from '../../engine/types/Plugin';
import { Step } from '../../engine/types/Step';

const firstStep: Step = {
  name: 'first step of plugin a',
  run: async () => {
    console.log('doing something');
    return true;
  },
};

export const aPlugin = new Plugin({
  id: 'plugin-a',
  displayName: 'Plugin a',
  version: '1',
  steps: [firstStep],
  dependencies: ['plugin-b'],
});
