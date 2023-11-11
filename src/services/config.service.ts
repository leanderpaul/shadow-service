/**
 * Importing npm packages
 */
import os from 'os';

/**
 * Importing user defined packages
 */
import { Utils } from '@lib/internal.utils';

/**
 * Defining types
 */

interface ConfigOptions {
  isProdRequired?: boolean;
  validateType?: 'number' | 'boolean';
  validator?: (value: string) => boolean;
  defaultValue?: string;
  allowedValues?: string[];
  transform?: (value: string) => any;
}

type NodeEnv = 'development' | 'production' | 'test';

type LogLevel = 'silly' | 'debug' | 'http' | 'info' | 'warn' | 'error';

type Nullable<T> = T | null;

export interface ConfigRecords extends Record<string, any> {
  /** Application configs */
  'app.env': NodeEnv;
  'app.name': string;

  /** Log configs */
  'log.level': LogLevel;
  'log.dir': string;

  /** Mail service configs */
  'mail.sendgrid.apikey': Nullable<string>;

  /** AWS configs */
  'aws.region': string;
  'aws.cloudwatch.log-group': string;
  'aws.cloudwatch.log-stream': string;
  'aws.cloudwatch.upload-rate': number;
}

/**
 * Declaring the constants
 */
const isProd = process.env.NODE_ENV === 'production';

export class ConfigService<Configs extends ConfigRecords> {
  private readonly cache = new Map<keyof Configs, any>();

  protected set(name: string, opts: ConfigOptions = {}): void {
    let value = process.env[name]?.trim();
    if (!value) {
      if (isProd && opts.isProdRequired) Utils.exit(`Environment Variable '${name}' not set`);
      else if (opts.defaultValue) value = opts.defaultValue;
    }
    if (!value) return;

    if (opts.allowedValues && !opts.allowedValues.includes(value)) {
      const allowedValues = opts.allowedValues.map(val => `'${val}'`).join(', ');
      Utils.exit(`Environment Variable '${name}' is invalid, must be one of [${allowedValues}]`);
    }
    if (opts.validator && !opts.validator(value)) Utils.exit(`Environment Variable '${name}' is invalid, validator failed`);
    if (!opts.validateType) this.cache.set(name, opts.transform ? opts.transform(value) : value);

    let typedValue: number | boolean;
    if (opts.validateType === 'number') {
      typedValue = Number(value);
      if (isNaN(typedValue)) Utils.exit(`Environment Variable '${name}' is invalid, must be a number`);
    } else {
      if (!['true', 'false'].includes(value)) Utils.exit(`Environment Variable '${name}' is invalid, must be a boolean`);
      typedValue = value === 'true';
    }
    this.cache.set(name, typedValue);
  }

  constructor(defaultAppName: string) {
    this.set('NODE_ENV', { allowedValues: ['development', 'production', 'test'], defaultValue: 'development', isProdRequired: true });
    this.set('APP_NAME', { defaultValue: defaultAppName });

    this.set('LOG_LEVEL', { allowedValues: ['silly', 'debug', 'http', 'info', 'warn', 'error'], defaultValue: 'info' });
    this.set('LOG_DIR', { defaultValue: 'logs' });

    this.set('MAIL_SENDGRID_APIKEY');

    this.set('AWS_REGION', { defaultValue: 'ap-south-1' });
    this.set('AWS_CLOUDWATCH_LOG_GROUP', { defaultValue: defaultAppName });
    this.set('AWS_CLOUDWATCH_LOG_STREAM', { defaultValue: os.networkInterfaces().eth0?.find(info => info.family === 'IPv4')?.address ?? 'unknown-ip' });
    this.set('AWS_CLOUDWATCH_UPLOAD_RATE', { defaultValue: '2000', validateType: 'number' });
  }

  isProd(): boolean {
    return this.cache.get('app.env') === 'production';
  }

  isDev(): boolean {
    return this.cache.get('app.env') === 'development';
  }

  isTest(): boolean {
    return this.cache.get('app.env') === 'test';
  }

  get<T extends keyof Configs>(key: T): Configs[T] {
    return this.cache.get(key);
  }

  getOrThrow<T extends keyof Configs>(key: T): Exclude<Configs[T], null> {
    const value = this.cache.get(key);
    if (value == null) throw new Error(`Expected config value for '${key.toString()}' to be set`);
    return value;
  }
}
