import { $ } from 'zx';

export const commitChanges = async (
  commitMessage: string,
): Promise<boolean> => {
  await $`git add .`;
  await $`git commit -m "${commitMessage}"`;
  return true;
};
