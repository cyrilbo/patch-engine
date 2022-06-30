import { Step } from "./Step";

export class Plugin {
  id: string;
  displayName: string;
  version: string;
  steps: Step[];
  constructor(params: {
    id: string;
    displayName: string;
    version: string;
    steps: Step[];
  }) {
    this.id = params.id;
    this.displayName = params.displayName;
    this.version = params.version;
    this.steps = params.steps;
  }

  async run() {
    for (const step of this.steps) {
      await step.run();
    }
  }
}
