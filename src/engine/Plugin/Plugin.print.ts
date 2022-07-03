import { chalk } from 'zx';
import { Step } from './Step.type';

export const printStepIsRunning = (step: Step, index: number) => {
  console.log(
    chalk.blueBright(
      `${index + 1} - Running ` + chalk.underline(step.name) + ' ...',
    ),
  );
};

const printSeparator = () =>
  console.log(
    chalk.red('\n---------------------------------------------------------\n'),
  );

export const printStepFailed = (step: Step) => {
  console.log(chalk.red(' --> ') + chalk.bgRed('Failure ❌'));
  printSeparator();
  console.log(
    chalk.red(
      'The task ' +
        chalk.underline(step.name) +
        ' has failed.\n\nFollow the procedure to fix this step before continuing :\n',
    ),
  );
  step.failureProcedure.forEach((bulletPoint) => {
    console.log(' - ', chalk.red(bulletPoint));
  });
  console.log(
    chalk.red(
      "\nOnce it's done, don't forget to " +
        chalk.bgRedBright.bold('commit') +
        ' your changes.',
    ),
  );
  printSeparator();
};

export const printStepSucceeded = () => {
  console.log(chalk.green(' --> ') + chalk.bgGreen('Success ✅'));
  console.log();
};
