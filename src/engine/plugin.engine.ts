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
  let failureStateAfterResume = !!failureState;
  const actor = interpret(engine)
    .onTransition((state) => {
      if (state.matches('runningPlugin.failure') && !failureStateAfterResume) {
        // TODO: Remove this line
        // we remove these actions because they are re-run on the next start
        // we need to find a way to handle these actions correctly by relying only
        // on the machine configuration
        state.actions = [];
        EngineIO.persistFailureState(state);
        process.exit();
      }
      failureStateAfterResume = false;
    })
    .onDone(() => {})
    .start(failureState);
  if (failureState) {
    actor.send('ERROR_MANUALLY_HANDLED');
  }
  await waitFor(
    actor,
    (state) => state.matches('end') || state.matches('failure'),
  );
  EngineIO.clearFailureState();
};

export const Engine = {
  run,
};
