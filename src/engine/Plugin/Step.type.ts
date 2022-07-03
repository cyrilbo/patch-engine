export type Step = {
  name: string;
  commitMessage: string;
  run: () => Promise<void>;
};
