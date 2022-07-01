import {
  printPluginListToApply,
  printPluginBeeingApplied,
} from './plugin.engine.print';
import { sortPlugins } from './core/sortPlugins.helper';
import { Plugin } from './types/Plugin';

const run = async (plugins: Plugin[]) => {
  const sortedPlugins = sortPlugins(plugins);
  printPluginListToApply(sortedPlugins);

  for (const plugin of sortedPlugins) {
    printPluginBeeingApplied(plugin);
    const isPluginRunSuccessful = await plugin.run();
    if (!isPluginRunSuccessful) {
      return false;
    }
  }
};

export const Engine = {
  run,
};
