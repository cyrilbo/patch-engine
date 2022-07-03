export interface IGitService {
  checkIsGitRepositoryClean: () => Promise<void>;
  commitChanges: (commitMessage: string) => Promise<boolean>;
}
