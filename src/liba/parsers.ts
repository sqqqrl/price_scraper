import { ElementHandle } from 'puppeteer';
import { Result } from 'true-myth';
import { ParseResult } from '../types/Result';

export const parseTagA = async <T>(
  li: ElementHandle<HTMLLIElement>
): Promise<ParseResult<T>> => {
  try {
    const result = await li.$eval('a', node => ({
      name: node.text.replace(/\n/g, '').trim(),
      link: node.href,
    }));

    return Result.ok({
      data: result,
    });
  } catch (err) {
    return Result.err({
      error: err,
    });
  }
};
