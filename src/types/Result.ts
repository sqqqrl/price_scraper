import { Result } from 'true-myth';

type ParseOk = {
  data: any;
};

type ParseErr = {
  error: any;
};

export type ParseResult<T> = Result<ParseOk, ParseErr>;

export type PuppeteerParserResult<T> = Promise<Result<ParseOk, ParseErr>>;
