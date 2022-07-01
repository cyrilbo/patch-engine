export type Step = {
  run: () => Promise<boolean>;
};
