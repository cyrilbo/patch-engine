import { interpret } from 'xstate';
import { createEngine } from './plugin.engine.machine';
import { createPluginMock } from './Plugin/Plugin.mock';

describe('PluginEngine', () => {
  it('should end if no plugins are passed', () => {
    const engine = createEngine([]);
    const initState = engine.initialState;
    expect(initState.matches('end')).toBeTruthy();
  });
  it('should run a plugin when a plugin is passed', () => {
    const pluginMock = createPluginMock();
    const engine = createEngine([pluginMock]);
    expect(engine.initialState.matches('runningPlugin')).toBeTruthy();
  });
  it('should fail if prePluginRun hook fails', (done) => {
    const pluginMock = createPluginMock();
    const onPrePluginRunMock = jest
      .fn()
      .mockRejectedValue('Dirty Git Repository');
    const engine = createEngine([pluginMock], {
      onPrePluginRun: onPrePluginRunMock,
    });
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('failure')) {
          expect(state.context.currentPluginError).toEqual(
            'Dirty Git Repository',
          );
          done();
        }
      })
      .start();
  });

  it('should set currentPluginId when running the plugin', (done) => {
    const pluginMock = createPluginMock();
    const engine = createEngine([pluginMock]);
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('runningPlugin')) {
          expect(state.context.currentPluginId).toEqual(pluginMock.id);
          done();
        }
      })
      .start();
  });

  it('should remove the plugin from the list once it has been run', (done) => {
    const pluginMock = createPluginMock();
    const engine = createEngine([pluginMock]);
    expect(engine.initialState.context.pluginsList).toEqual([pluginMock.id]);
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('end')) {
          expect(state.context.pluginsList).toEqual([]);
          done();
        }
      })
      .start();
  });
});
