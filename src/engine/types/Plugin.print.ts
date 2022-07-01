import { chalk } from 'zx';
import { Step } from './Step';

export const printStepIsRunning = (step: Step, index: number) => {
  console.log(
    chalk.blueBright(
      `${index + 1} - Running ` + chalk.underline(step.name) + ' ...',
    ),
  );
};

export const printStepFailed = () => {
  console.log(chalk.red(' --> ') + chalk.bgRed(' --> Failure ❌'));
  console.log();
};

export const printStepSucceeded = () => {
  console.log(chalk.green(' --> ') + chalk.bgGreen('Success ✅'));
  console.log();
};
