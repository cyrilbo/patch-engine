// import { $ } from "zx";
import { Plugin } from "../Plugin";
import { Step } from "../Step";

const installStep: Step = {
  run: async () => {
    console.log("install step");
    // $`yarn add eslint@^8.18.0 --dev`;
  },
};

const applyPatchStep: Step = {
  run: async () => {
    console.log("Apply patch step");
    // $`yarn add eslint@^8.18.0 --dev`;
  },
};

export const eslintPlugin = new Plugin({
  id: "estlint-v1",
  displayName: "ESLint v1",
  version: "1",
  steps: [installStep, applyPatchStep],
});
