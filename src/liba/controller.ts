import { Suite } from './wrappers/suite';

type SuiteReport = Promise<any>;

const start = async (suite: Suite): SuiteReport => {
  const { actions } = suite.flow;

  for (const action of actions) {
    const result = await action(suite.props);
    console.log(result);
  }
};

export const controller = async (suites: Suite[]): Promise<SuiteReport[]> => {
  const suiteReports: SuiteReport[] = [];
  for (const suite of suites) {
    const report = await start(suite);
    suiteReports.push(report);
  }

  return suiteReports;
};
