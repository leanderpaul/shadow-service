/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */
import { ConfigService, TemplateEngine } from 'shadow-service';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */
describe('Template Engine', () => {
  let templateEngine: TemplateEngine;

  beforeAll(() => {
    const globalRef = global as any;
    globalRef.configService = new ConfigService('tester');
  });

  describe('init', () => {
    it('should initialize the template engine', () => {
      templateEngine = new TemplateEngine({ dir: 'tests/sample', minify: true });
      expect(templateEngine).toBeInstanceOf(TemplateEngine);
    });
  });

  describe('registerTemplate', () => {
    it('should register the template', () => {
      templateEngine.registerTemplate('test', 'Hello, {{name}}!');
      const template = templateEngine.getTemplate('test');
      expect(template).toBeDefined();
    });
  });

  describe('render', () => {
    it('should render the template', () => {
      const result = templateEngine.render('test', { name: 'World' });
      expect(result).toBe('Hello, World!');
    });

    it('should render template from directory', () => {
      const result = templateEngine.render('template', { username: 'Tester', roles: ['admin'] });
      expect(result).toBe('<h1>Hello, Tester</h1><h2>You are an admin</h2>');
    });

    it('should throw error if template is not registered', () => {
      expect(() => templateEngine.render('invalid', { name: 'World' })).toThrow();
    });
  });
});
