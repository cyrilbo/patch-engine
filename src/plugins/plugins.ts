import { Plugin } from '../engine/Plugin/Plugin.type';
import { aPlugin } from './a/a.plugin';
import { bPlugin } from './b/b.plugin';

export const plugins: Record<string, Plugin> = {
  [aPlugin.id]: aPlugin,
  [bPlugin.id]: bPlugin,
};

export const ALL_PLUGINS_ID = Object.keys(plugins);
