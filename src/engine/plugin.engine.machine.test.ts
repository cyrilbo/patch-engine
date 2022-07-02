import { createEngine } from './plugin.engine.machine';
import { createPluginMock } from './Plugin/Plugin.mock';

describe('PluginEngine', () => {
  it('should begin with the initialization step', () => {
    const engine = createEngine([]);
    expect(engine.initialState.matches('init')).toBeTruthy();
  });
  it('should end if no plugins are passed', () => {
    const engine = createEngine([]);
    const initState = engine.initialState;
    const newState = engine.transition(initState, 'always');
    expect(newState.matches('end')).toBeTruthy();
  });
  it('should run a plugin when a plugin is passed', () => {
    const pluginMock = createPluginMock();
    const engine = createEngine([pluginMock]);
    const initState = engine.initialState;
    const newState = engine.transition(initState, 'always');
    expect(newState.matches('runPlugin')).toBeTruthy();
  });
});
