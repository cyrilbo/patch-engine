import { Engine } from './../../engine/plugin.engine';
import fs from 'fs-extra';
import { availablePlugins } from './../../plugins/plugins';
import {
  printPathDoesNotExist,
  printPluginNotFound,
} from './run.command.print';
import { cd } from 'zx';

export const runCommand = async (
  pluginId: string,
  options: { path: string },
) => {
  const plugin = availablePlugins[pluginId];
  if (!plugin) {
    printPluginNotFound(pluginId);
    return;
  }

  if (!fs.existsSync(options.path)) {
    printPathDoesNotExist(options.path);
    return;
  }

  cd(options.path);

  await Engine.run([plugin]);
};
