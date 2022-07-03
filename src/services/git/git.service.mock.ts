import { IGitService } from './git.service.interface';

export const GitServiceMock: IGitService = {
  checkIsGitRepositoryClean: jest.fn(),
  commitChanges: jest.fn(),
};
