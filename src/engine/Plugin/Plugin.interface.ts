import { Step } from './Step.type';

export interface IPlugin {
  id: string;
  displayName: string;
  version: string;
  steps: Step[];
  dependencies: string[];
  run: () => Promise<boolean>;
}
