import { chalk } from 'zx';

export const printPluginNotFound = (pluginId: string) => {
  console.log(chalk.red('Plugin', chalk.bold(pluginId), 'not found.'));
};

export const printPathDoesNotExist = (path: string) => {
  console.log(chalk.red('Path', chalk.bold(path), 'does not exist'));
};
