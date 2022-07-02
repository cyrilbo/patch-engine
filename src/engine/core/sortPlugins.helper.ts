import { Plugin } from '../Plugin/Plugin.impl';
import { adaptPluginsToDependencyList } from './dependencyGraph/pluginsToDependencyList.adapter';
import { findTopologicalSort } from './dependencyGraph/topologicalSort.helper';

export const sortPlugins = (plugins: Plugin[]): Plugin[] => {
  const dependencyList = adaptPluginsToDependencyList(plugins);
  return findTopologicalSort(dependencyList).map((pluginId) =>
    plugins.find((plugin) => plugin.id === pluginId),
  );
};
