export type Step = {
  name: string;
  run: () => Promise<boolean>;
};
