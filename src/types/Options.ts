import { Suite } from '../liba/wrappers/suite';

export type CliOptions = {
  suite: string;
  headless?: boolean;
};

export type Exports = { default: { [suite: string]: Suite } } & {
  [k: string]: unknown;
};
