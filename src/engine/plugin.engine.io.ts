import fs from 'fs-extra';
import { State } from 'xstate';
import { MachineContext } from './plugin.engine.machine';

const persistFailureState = (state: State<MachineContext>) => {
  const jsonState = JSON.stringify(state);
  fs.outputFileSync('.plugin-engine/failure-state.json', jsonState);
};
};

export const EngineIO = {
  persistFailureState,
};
