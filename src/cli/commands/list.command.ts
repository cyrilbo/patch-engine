import { plugins } from '../../plugins/plugins';

export const listCommand = () => {
  Object.values(plugins).forEach((plugin) => console.log('- ' + plugin.id));
};
