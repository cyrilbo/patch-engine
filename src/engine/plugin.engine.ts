import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { GitService } from './../services/git/git.service.impl';
import { createEngine } from './plugin.engine.machine';
import { printPluginListToApply } from './plugin.engine.print';
import { sortPlugins } from './core/sortPlugins.helper';
import { Plugin } from './Plugin/Plugin.type';
import { EngineIO } from './plugin.engine.io';

const run = async (plugins: Plugin[]) => {
  const sortedPlugins = sortPlugins(plugins);
  printPluginListToApply(sortedPlugins);

  const failureState = EngineIO.retrieveFailureState();

  const engine = createEngine(sortedPlugins, {
    onPrePluginRun: GitService.checkIsGitRepositoryClean,
  });
  const actor = interpret(engine).start(failureState);

  const finalState = await waitFor(actor, (state) =>
    state.matches(['failure'] || state.matches(['end'])),
  );

  if (finalState.matches('failure')) {
    EngineIO.persistFailureState(finalState);
  }
};

export const Engine = {
  run,
};
