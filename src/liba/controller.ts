import { Suite } from './wrappers/suite';

type SuiteResult = any;

const start = (suite: Suite): SuiteResult => {
  //   suite.actions
  const { actions } = suite.flow;

  const result = actions.flatMap(action => action(suite.props));

  console.log(result);
};

export const controller = (suite: Suite): SuiteResult => {
  const res = start(suite);
  return res;
};
