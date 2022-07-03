import { interpret } from 'xstate';
import { GitService } from './../services/git/git.service.impl';
import { createEngine } from './plugin.engine.machine';
import { printPluginListToApply } from './plugin.engine.print';
import { sortPlugins } from './core/sortPlugins.helper';
import { Plugin } from './Plugin/Plugin.type';

const run = async (plugins: Plugin[]) => {
  const sortedPlugins = sortPlugins(plugins);
  printPluginListToApply(sortedPlugins);

  const engine = createEngine(sortedPlugins, {
    onPrePluginRun: GitService.checkIsGitRepositoryClean,
  });
  interpret(engine).start();
};

export const Engine = {
  run,
};
