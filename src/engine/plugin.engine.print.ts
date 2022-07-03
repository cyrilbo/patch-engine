import { chalk } from 'zx';
import { Plugin } from './Plugin/Plugin.type';

const printSeparator = () =>
  console.log(
    chalk.yellow(
      '\n---------------------------------------------------------\n',
    ),
  );

export const printPluginListToApply = (plugins: Plugin[]) => {
  printSeparator();
  console.log(
    chalk.yellow('The following plugins will be applied sequentially :'),
  );
  plugins.forEach((plugin) => {
    console.log(chalk.yellow(' - ' + plugin.displayName));
  });
  printSeparator();
};

export const printPluginBeeingApplied = (plugin: Plugin) => {
  console.log(
    chalk.greenBright(
      'Applying plugin ' + chalk.bold.underline(plugin.displayName),
    ),
  );
  console.log();
};
