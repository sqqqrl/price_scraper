import * as yargs from 'yargs';
import { readFileSync } from 'fs';
import { CliOptions } from '../types/Options';

export const argv = yargs(process.argv.slice(2))
  .option('siteConfigFile', {
    alias: 'file',
    describe: 'provide a path to site config file',
  })
  .option('headless', {
    alias: 'h',
    describe: 'headless mode for puppeteer',
    boolean: true,
  })
  .strictOptions()
  .demandOption(
    ['siteConfigFile'],
    'Please provide path arguments to work with this tool'
  )
  .coerce('siteConfigFile', function(arg) {
    try {
      return JSON.parse(readFileSync(arg, 'utf8'));
    } catch (err) {
      throw new Error(
        `
            Provided site config path incorrect
            ${err}
        `
      );
    }
  }).argv as CliOptions;
