import { IPlugin } from './Plugin.interface';
import {
  printStepFailed,
  printStepIsRunning,
  printStepSucceeded,
} from './Plugin.print';
import { GitService } from '../../services/git/git.service.impl';
import { Step } from './Step.type';

export class Plugin implements IPlugin {
  id: string;
  displayName: string;
  version: string;
  steps: Step[];
  dependencies: string[];
  constructor(params: {
    id: string;
    displayName: string;
    version: string;
    steps: Step[];
    dependencies?: string[];
  }) {
    this.id = params.id;
    this.displayName = params.displayName;
    this.version = params.version;
    this.steps = params.steps;
    this.dependencies = params.dependencies ?? [];
  }

  async run(): Promise<boolean> {
    const isGitRepositoryClean = await GitService.checkIsGitRepositoryClean();
    if (!isGitRepositoryClean) return false;
    for (const [index, step] of this.steps.entries()) {
      printStepIsRunning(step, index);
      const isStepSuccessful = await step.run();
      if (!isStepSuccessful) {
        printStepFailed();
        return false;
      }
      printStepSucceeded();
      await GitService.commitChanges(step.commitMessage);
    }
    return true;
  }
}
