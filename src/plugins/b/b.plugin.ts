import { $ } from 'zx';
import { Plugin } from '../../engine/types/Plugin';
import { Step } from '../../engine/types/Step';

const firstStep: Step = {
  name: 'first step of plugin b',
  commitMessage: 'chore(b): doing something else',
  run: async () => {
    const random = Math.floor(Math.random() * 1000);
    await $`touch tmp/${random}.txt`;
    await $`echo "${random}" > tmp/${random}.txt`;
    return true;
  },
};
export const bPlugin = new Plugin({
  id: 'plugin-b',
  displayName: 'Plugin b',
  version: '1',
  steps: [firstStep],
});
