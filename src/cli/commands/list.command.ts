import { availablePlugins } from '../../plugins/plugins';

export const listCommand = () => {
  Object.values(availablePlugins).forEach((plugin) =>
    console.log('- ' + plugin.id),
  );
};
