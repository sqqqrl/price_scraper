#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CliSitemapOptions } from './types';

export const argv = yargs(hideBin(process.argv))
  .option('coveragePath', {
    alias: 'p',
    describe: 'Provide a path to coverage index file.',
    string: true,
  })
  .option('headless', {
    alias: 'h',
    describe: 'headless mode for puppeteer',
    boolean: true,
  })
  .strictOptions()
  .demandOption(
    ['coveragePath'],
    'Please provide --coveragePath( -p ) option to work with this tool'
  ).argv as CliSitemapOptions;
