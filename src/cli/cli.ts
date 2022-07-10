import { runCommand } from './commands/run.command';
import { Command } from 'commander';
import { listCommand } from './commands/list.command';

export const runCli = () => {
  const program = new Command();

  program
    .name('plugin-engine')
    .description('CLI to apply some plugins to a JS/TS project')
    .version('0.0.0');

  program
    .command('run <pluginId>')
    .description('Run a plugin on a given project')
    .option('-p, --path <string>', 'path to the project', '.')
    .action(runCommand);

  program
    .command('list')
    .description('List all available plugins')
    .action(listCommand);
  program.parse();
};
