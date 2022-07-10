import { getPluginById } from '../../plugins/plugins';
import { Plugin } from '../Plugin/Plugin.type';

export const loadAllAssociatedPlugins = (plugins: Plugin[]): Plugin[] => {
  const loadedPlugins: Record<string, Plugin> = {};

  const loadDependencies = (dependency: Plugin) => {
    if (loadedPlugins[dependency.id]) {
      return;
    }

    loadedPlugins[dependency.id] = dependency;

    dependency.dependencies.forEach((dependencyId) => {
      if (loadedPlugins[dependencyId]) {
        return;
      }
      const dependency = getPluginById(dependencyId);
      loadedPlugins[dependency.id] = dependency;
      loadDependencies(dependency);
    });
  };

  plugins.forEach((plugin) => {
    loadedPlugins[plugin.id] = plugin;
    plugin.dependencies.forEach((dependencyId) => {
      loadDependencies(getPluginById(dependencyId));
    });
  });

  return Object.values(loadedPlugins);
};
