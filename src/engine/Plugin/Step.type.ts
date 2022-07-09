export type Step = {
  /**
   * variable used in logs to identify the step
   */
  name: string;
  /**
   * Commit message used during commit phase after the step has successfully run.
   */
  commitMessage: string;
  /**
   * When a step fails during it's execution, the engine stops and the user
   * has to manually fix the step. The failureProcedure variable will be displayed
   * to give the user all the informations needed to fix the step.
   */
  failureProcedure: string[];
  /**
   * Asynchronous method run by the engine. If the promise is resolved, the step is considered
   * successful. If the promise is rejected, the step is considered failed.
   */
  run: () => Promise<void>;
};
