/**
 * Importing npm packages
 */
import { cyan, gray, yellow } from '@colors/colors/safe';
import { type TransformableInfo } from 'logform';
import { LEVEL } from 'triple-beam';
import { format } from 'winston';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
const globalRef = global as any;
let timestamp: number;

function padLevel(info: TransformableInfo) {
  const level = info[LEVEL];
  const padding = '   '.substring(0, 5 - (level?.length ?? 0));
  return info.level + padding;
}

/** Formats and print the logs to the console */
export const consoleFormat = format.printf(info => {
  const level = info[LEVEL];
  const prevTime = timestamp;
  timestamp = Date.now();
  const timeTaken = prevTime ? gray(` +${timestamp - prevTime}ms`) : '';
  const stack = info.stack ? '\n' + (Array.isArray(info.stack) ? info.stack.join('\n') : info.stack) : '';

  if (level != 'http') return `${padLevel(info)} ${yellow(`[${info.label || '-'}]`)} ${info.message} ${timeTaken} ${stack}`;
  return cyan(`HTTP  [REST] ${info.method} ${info.url} - ${info.timeTaken}ms`);
});

/** Appends the time and the request ID to the log metadata */
export const contextFormat = format(info => {
  const rid = globalRef.Context?.getOptional('RID');
  if (rid) info.rid = rid;
  return info;
});
