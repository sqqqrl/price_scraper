import { configs } from './puppeteer.config';
import { getExport } from './utils';
import { controller } from './liba/controller';
import { argv } from './liba/cli';
import { CliOptions } from './types/Options';

(async (cliArgs: CliOptions): Promise<undefined> => {
  const { suite, headless = false } = cliArgs;
  // TODO: add the ability to import multiple suites
  const importedSuite = (await getExport(suite)).default.suite;
  configs.headless = headless;

  const start = await controller([importedSuite]);
  console.log(start);

  return;
})(argv);
