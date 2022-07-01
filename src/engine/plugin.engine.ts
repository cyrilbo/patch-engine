import { chalk } from 'zx';
import { sortPlugins } from './core/sortPlugins.helper';
import { Plugin } from './types/Plugin';


const run = (plugins: Plugin[]) => {
  const sortedPlugins = sortPlugins(plugins);
  console.log(chalk.blueBright('The following plugins will be applied :'));
  sortedPlugins.forEach((plugin) => {
    console.log(chalk.blueBright(' - ' + plugin.displayName));
  });
};

export const Engine = {
  run,
};
