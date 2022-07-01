import { $, chalk } from 'zx';

export const checkIsGitRepositoryClean = async (): Promise<boolean> => {
  const gitDiff = await $`git diff --stat`;
  const isGitDirectoryClean = gitDiff.stdout === '';
  if (!isGitDirectoryClean) {
    console.log(
      chalk.red(
        'Your repository is dirty, please commit your changes before continuing.',
      ),
    );
  }
  return isGitDirectoryClean;
};
