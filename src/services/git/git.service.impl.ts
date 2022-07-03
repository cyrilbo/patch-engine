import { $, chalk } from 'zx';
import { IGitService } from './git.service.interface';

const checkIsGitRepositoryClean = async () => {
  const gitDiff = await $`git diff HEAD`;
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

const commitChanges = async (commitMessage: string) => {
  await $`git add .`;
  await $`git commit -m "${commitMessage}"`;
  return true;
};

export const GitService: IGitService = {
  checkIsGitRepositoryClean,
  commitChanges,
};
