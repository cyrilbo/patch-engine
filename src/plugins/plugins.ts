import { Plugin } from '../engine/Plugin/Plugin.type';
import { aPlugin } from './a/a.plugin';
import { bPlugin } from './b/b.plugin';
import { cPlugin } from './c/c.plugin';

export const availablePlugins: Record<string, Plugin> = {
  [aPlugin.id]: aPlugin,
  [bPlugin.id]: bPlugin,
  [cPlugin.id]: cPlugin,
};

export const AVAILABLE_PLUGINS_ID = Object.keys(availablePlugins);

export const getPluginById = (id: string) => {
  const plugin = availablePlugins[id];
  if (plugin) return plugin;
  throw new Error(`Plugin ${id} does not exist.`);
};
