import { Plugin } from '../../engine/types/Plugin';

export const aPlugin = new Plugin({
  id: 'plugin-a',
  displayName: 'Plugin a',
  version: '1',
  steps: [],
  dependencies: ['plugin-b'],
});
