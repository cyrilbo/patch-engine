export interface IGitService {
  checkIsGitRepositoryClean: () => Promise<boolean>;
  commitChanges: (commitMessage: string) => Promise<boolean>;
}
