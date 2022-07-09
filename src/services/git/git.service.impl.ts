import { $ } from 'zx';
import { IGitService } from './git.service.interface';

const checkIsGitRepositoryClean = async () => {
  const gitDiff = await $`git diff HEAD`;
  return gitDiff.stdout === '';
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
