import { Plugin } from '../../types/Plugin';

export const adaptPluginsToDependencyList = (
  plugins: Plugin[],
): Record<string, string[]> => {
  const dependencyList: Record<string, string[]> = {};

  plugins.forEach((plugin) => {
    dependencyList[plugin.id] = plugin.dependencies;
  });
  return dependencyList;
};
