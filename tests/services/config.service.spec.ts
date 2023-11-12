/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */
import { Utils } from '@lib/internal.utils';
import { ConfigService, type ConfigRecords } from '@lib/services/config.service';
import { TestUtils } from '@tests/test.utils';

/**
 * Defining types
 */

interface CustomConfigRecords extends ConfigRecords {
  'custom.key': string;
}

/**
 * Declaring the constants
 */

class CustomConfigService extends ConfigService<CustomConfigRecords> {
  constructor() {
    super('custom-test-app');
    this.set('custom.key', { defaultValue: 'value', isProdRequired: true });
  }
}

describe('Config Service', () => {
  let config: ConfigService<ConfigRecords>;

  beforeAll(() => {
    Utils.exit = (err: string | Error) => TestUtils.throw(err);
    config = new ConfigService<ConfigRecords>('test-app');
  });

  describe('get', () => {
    it('should return the correct value for a given key', () => {
      expect(config.get('app.name')).toBe('test-app');
    });

    it("should return the 'undefined' if the key is not found", () => {
      expect(config.get('app.invalid')).toBeUndefined();
    });
  });

  describe('getOrThrow', () => {
    it('should throw an error if the key is not found', () => {
      expect(() => config.getOrThrow('app.invalid')).toThrow();
    });
  });

  describe('invalid initialization', () => {
    beforeAll(() => (process.env.NODE_ENV = 'production'));
    afterAll(() => (process.env.NODE_ENV = 'test'));

    it("should throw an error if 'custom.key' is not provided in production", () => {
      console.log(process.env.NODE_ENV);
      expect(() => new CustomConfigService()).toThrow();
    });
  });
});