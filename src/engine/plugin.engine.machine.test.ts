import { interpret } from 'xstate';
import { createEngine, MachineContext } from './plugin.engine.machine';
import { createPluginMock, createStepMock } from './Plugin/Plugin.mock';

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
  it('should track the running step for the current plugin', (done) => {
    const pluginMock = createPluginMock();
    const engine = createEngine([pluginMock]);
    expect(engine.initialState.context.pluginsList).toEqual([pluginMock.id]);
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('runningPlugin.runningStep')) {
          const expectedContext: MachineContext = {
            pluginsList: [pluginMock.id],
            currentPluginId: pluginMock.id,
            currentPluginStepIndex: 0,
            currentPluginError: undefined,
          };
          expect(state.context).toEqual(expectedContext);
        }
        if (state.matches('end')) {
          const expectedContext: MachineContext = {
            pluginsList: [],
            currentPluginId: undefined,
            currentPluginStepIndex: undefined,
            currentPluginError: undefined,
          };
          expect(state.context).toEqual(expectedContext);
          done();
        }
      })
      .start();
  });

  it('should run plugin one plugin step', (done) => {
    const stepRunMock = jest.fn();
    const stepMock = createStepMock({ run: stepRunMock });
    const pluginMock = createPluginMock({ steps: [stepMock] });

    const engine = createEngine([pluginMock]);
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('end')) {
          expect(stepRunMock).toHaveBeenCalledTimes(1);
          done();
        }
      })
      .start();
  });
  it("should stop if a plugin's step fails", (done) => {
    const stepRunMock = jest.fn().mockRejectedValue('Oops, an error occured');
    const stepMock = createStepMock({ run: stepRunMock });
    const pluginMock = createPluginMock({ steps: [stepMock] });

    const engine = createEngine([pluginMock]);
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('failure')) {
          expect(stepRunMock).toHaveBeenCalledTimes(1);
          const expectedContext: MachineContext = {
            pluginsList: [pluginMock.id],
            currentPluginId: pluginMock.id,
            currentPluginStepIndex: 0,
            currentPluginError: 'Oops, an error occured',
          };
          expect(state.context).toEqual(expectedContext);
          done();
        }
      })
      .start();
  });

  it('should run multiple plugin steps', (done) => {
    const step1RunMock = jest.fn();
    const step1Mock = createStepMock({ run: step1RunMock });
    const step2RunMock = jest.fn();
    const step2Mock = createStepMock({ run: step2RunMock });
    const pluginMock = createPluginMock({ steps: [step1Mock, step2Mock] });

    const engine = createEngine([pluginMock]);
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('end')) {
          expect(step1RunMock).toHaveBeenCalledTimes(1);
          expect(step2RunMock).toHaveBeenCalledTimes(1);
          done();
        }
      })
      .start();
  });

  it.only('should not run all steps and plugins if one step has failed', (done) => {
    const step1RunMock = jest.fn();
    const step1Mock = createStepMock({ run: step1RunMock });
    const step2RunMock = jest.fn().mockRejectedValue('Oops, an error occured');
    const step2Mock = createStepMock({ run: step2RunMock });
    const step3RunMock = jest.fn();
    const step3Mock = createStepMock({ run: step3RunMock });
    const step4RunMock = jest.fn();
    const step4Mock = createStepMock({ run: step4RunMock });
    const plugin1Mock = createPluginMock({
      id: 'plugin-mock-id-1',
      steps: [step1Mock, step2Mock, step3Mock],
    });
    const plugin2Mock = createPluginMock({
      id: 'plugin-mock-id-2',
      steps: [step4Mock],
    });
    const engine = createEngine([plugin1Mock, plugin2Mock]);
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('failure')) {
          expect(step1RunMock).toHaveBeenCalledTimes(1);
          expect(step2RunMock).toHaveBeenCalledTimes(1);
          expect(step3RunMock).not.toHaveBeenCalled();
          expect(step4RunMock).not.toHaveBeenCalled();
          const expectedContext: MachineContext = {
            pluginsList: [plugin1Mock.id, plugin2Mock.id],
            currentPluginId: plugin1Mock.id,
            currentPluginStepIndex: 1,
            currentPluginError: 'Oops, an error occured',
          };
          expect(state.context).toEqual(expectedContext);
          done();
        }
      })
      .start();
  });

  it('should run multiple plugins', (done) => {
    const step1RunMock = jest.fn();
    const step1Mock = createStepMock({ run: step1RunMock });
    const plugin1Mock = createPluginMock({
      id: 'plugin-mock-id-1',
      steps: [step1Mock],
    });
    const step2RunMock = jest.fn();

    const step2Mock = createStepMock({ run: step2RunMock });
    const plugin2Mock = createPluginMock({
      id: 'plugin-mock-id-2',
      steps: [step2Mock],
    });

    const engine = createEngine([plugin1Mock, plugin2Mock]);
    interpret(engine)
      .onTransition((state) => {
        if (state.matches('end')) {
          expect(step1RunMock).toHaveBeenCalledTimes(1);
          expect(step2RunMock).toHaveBeenCalledTimes(1);
          done();
        }
      })
      .start();
  });
});
