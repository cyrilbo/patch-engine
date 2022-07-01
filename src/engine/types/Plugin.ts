import {
  printStepFailed,
  printStepIsRunning,
  printStepSucceeded,
} from './Plugin.print';
import { Step } from './Step';

export class Plugin {
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
    const isGitRepositoryClean = await checkIsGitRepositoryClean();
    if (!isGitRepositoryClean) return false;
    for (const step of this.steps) {
    for (const [index, step] of this.steps.entries()) {
      printStepIsRunning(step, index);
      const isStepSuccessful = await step.run();
      if (!isStepSuccessful) {
        printStepFailed();
        return false;
      }
      printStepSucceeded();
    }
    return true;
  }
}
