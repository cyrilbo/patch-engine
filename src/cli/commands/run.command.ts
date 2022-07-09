import { Engine } from './../../engine/plugin.engine';
import fs from 'fs-extra';
import { plugins } from './../../plugins/plugins';
import {
  printPathDoesNotExist,
  printPluginNotFound,
} from './run.command.print';

export const runCommand = (pluginId: string, options: { path: string }) => {
  const plugin = plugins[pluginId];
  if (!plugin) {
    printPluginNotFound(pluginId);
    return;
  }
  if (!fs.existsSync(options.path)) {
    printPathDoesNotExist(options.path);
    return;
  }
  Engine.run([plugin]);
};
