import fs from 'fs-extra';
import { State } from 'xstate';
import { MachineContext } from './plugin.engine.machine';

const persistFailureState = (state: State<MachineContext>) => {
  const jsonState = JSON.stringify(state);
  fs.outputFileSync('.plugin-engine/failure-state.json', jsonState);
};

const retrieveFailureState = (): State<MachineContext> | undefined => {
  if (fs.existsSync('.plugin-engine/failure-state.json')) {
    const buffer = fs.readFileSync('.plugin-engine/failure-state.json');
    const stateDefinition = JSON.parse(buffer.toString());
    return State.create(stateDefinition);
  }
};

const clearFailureState = () => {
  if (fs.existsSync('.plugin-engine/failure-state.json')) {
    fs.unlinkSync('.plugin-engine/failure-state.json');
  }
};

export const EngineIO = {
  persistFailureState,
  retrieveFailureState,
  clearFailureState,
};
