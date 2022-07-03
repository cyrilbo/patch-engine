import { $ } from 'zx';
import { Plugin } from '../../engine/Plugin/Plugin.type';
import { Step } from '../../engine/Plugin/Step.type';

const firstStep: Step = {
  name: 'first step of plugin a',
  commitMessage: 'chore(a): doing something',
  run: async () => {
    const random = Math.floor(Math.random() * 1000);
    await $`touch tmp/${random}.txt`;
    await $`echo "${random}" > tmp/${random}.txt`;
  },
};

export const aPlugin: Plugin = {
  id: 'plugin-a',
  displayName: 'Plugin a',
  version: '1',
  steps: [firstStep],
  dependencies: ['plugin-b'],
};
