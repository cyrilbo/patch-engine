import { Plugin } from '../../engine/Plugin/Plugin.type';
import { Step } from '../../engine/Plugin/Step.type';

const firstStep: Step = {
  name: 'first step of plugin b',
  commitMessage: 'chore(b): doing something',
  failureProcedure: ['run the command aaa', 'run the command bbb'],
  run: async () => {
    console.log('first step run successfully');
  },
};

const secondStep: Step = {
  name: 'second step of plugin b',
  commitMessage: 'chore(b): doing something else',
  failureProcedure: ['run the command aaa', 'run the command bbb'],
  run: async () => {
    console.log('Oops, something really bad happened');
    throw new Error('Something ba happened');
  },
};

const thirdStep: Step = {
  name: 'third step of plugin b',
  commitMessage: 'chore(b): doing nothing',
  failureProcedure: ['run the command aaa', 'run the command bbb'],
  run: async () => {
    console.log('third step run successfully');
  },
};

export const bPlugin: Plugin = {
  id: 'plugin-b',
  displayName: 'Plugin b',
  version: '1',
  steps: [firstStep, secondStep, thirdStep],
  dependencies: [],
};
