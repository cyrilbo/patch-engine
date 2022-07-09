import { $, chalk } from 'zx';
import { Plugin } from '../../engine/Plugin/Plugin.type';
import { Step } from '../../engine/Plugin/Step.type';

const firstStep: Step = {
  name: 'first step of plugin c',
  commitMessage: 'chore(c): create a temporary file',
  failureProcedure: [`run : ${chalk.bgGray('touch tmp.txt')}`],
  run: async () => {
    await $`touch tmp.txt`;
  },
};

export const cPlugin: Plugin = {
  id: 'plugin-c',
  displayName: 'Plugin c',
  version: '1',
  steps: [firstStep],
  dependencies: [],
};
