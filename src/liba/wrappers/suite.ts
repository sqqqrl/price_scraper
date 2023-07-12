export type SuiteProperties = {
  url: string;
  sitemapUrl: string;
};

type Action = any;

export class Suite {
  private _actions: Action[] = [];
  props: SuiteProperties;

  constructor(props: SuiteProperties) {
    this.props = props;
  }

  actions(actions: Action[]): Suite {
    this._actions.push(...actions);
    return this;
  }

  get flow(): { actions: Action[] } {
    return {
      actions: this._actions,
    };
  }
}
