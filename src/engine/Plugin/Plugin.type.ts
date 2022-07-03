import { Step } from './Step.type';

export type Plugin = {
  id: string;
  displayName: string;
  version: string;
  steps: Step[];
  dependencies: string[];
};
