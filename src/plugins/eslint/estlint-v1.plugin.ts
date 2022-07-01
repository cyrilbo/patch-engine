// import { $ } from "zx";
import { Plugin } from '../../engine/types/Plugin';
import { Step } from '../../engine/types/Step';

const installStep: Step = {
  run: async () => {
    console.log('install step');
    return true;
    // $`yarn add eslint@^8.18.0 --dev`;
  },
};

const applyPatchStep: Step = {
  run: async () => {
    console.log('Apply patch step');
    return true;
    // $`yarn add eslint@^8.18.0 --dev`;
  },
};

export const eslintPlugin = new Plugin({
  id: 'estlint-v1',
  displayName: 'ESLint v1',
  version: '1',
  steps: [installStep, applyPatchStep],
});
