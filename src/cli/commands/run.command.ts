import { Engine } from './../../engine/plugin.engine';
import fs from 'fs-extra';
import { plugins } from './../../plugins/plugins';
import {
  printPathDoesNotExist,
  printPluginNotFound,
} from './run.command.print';
import { $ } from 'zx';

export const runCommand = async (
  pluginId: string,
  options: { path: string },
) => {
  const plugin = plugins[pluginId];
  if (!plugin) {
    printPluginNotFound(pluginId);
    return;
  }
  if (!fs.existsSync(options.path)) {
    printPathDoesNotExist(options.path);
    return;
  }
  await $`cd ${options.path}`;
  await Engine.run([plugin]);
};
