import { $ } from "zx";
import { Plugin } from "../Plugin";

export const applyPlugin = async (plugin: Plugin) => {
  const gitDiff = await $`git diff --stat`;
  if (gitDiff.stdout !== "") {
    console.log("working dir is not clean");
  }
  await plugin.run();
};
