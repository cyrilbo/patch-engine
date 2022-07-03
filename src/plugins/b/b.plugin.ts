import { $ } from 'zx';
import { Plugin } from '../../engine/Plugin/Plugin.type';
import { Step } from '../../engine/Plugin/Step.type';

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
export const bPlugin: Plugin = {
  id: 'plugin-b',
  displayName: 'Plugin b',
  version: '1',
  steps: [firstStep],
  dependencies: [],
};
