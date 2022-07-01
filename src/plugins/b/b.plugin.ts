import { Plugin } from '../../engine/types/Plugin';
import { Step } from '../../engine/types/Step';

const firstStep: Step = {
  name: 'first step of plugin b',
  run: async () => {
    console.log('doing something else');
    return true;
  },
};
export const bPlugin = new Plugin({
  id: 'plugin-b',
  displayName: 'Plugin b',
  version: '1',
  steps: [firstStep],
});
