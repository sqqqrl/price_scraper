import yargs from 'yargs';
import { CliOptions } from '../types/Options';

export const argv = yargs(process.argv.slice(2))
  .option('suite', {
    alias: 's',
    describe: 'provide a path to site suite',
    string: true,
  })
  .option('headless', {
    alias: 'h',
    describe: 'headless mode for puppeteer',
    boolean: true,
  })
  .strictOptions()
  .demandOption(
    ['suite'],
    'Please provide --suite( -s ) argument to work with this tool'
  ).argv as CliOptions;
