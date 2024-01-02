/**
 * Importing npm packages
 */
import fs from 'fs';
import path from 'path';

import Handlebars, { type HelperOptions, type TemplateDelegate } from 'handlebars';
import { type Options as MinifierOptions, minify } from 'html-minifier';

/**
 * Importing user defined packages
 */
import { InternalError } from '@lib/errors';
import { Utils } from '@lib/internal.utils';

/**
 * Defining types
 */

export interface TemplateEngineOptions {
  /** Directory where templates are stored */
  dir?: string;

  /** Template file extension */
  ext?: string;

  /** Minify the template */
  minify?: boolean;
}

/**
 * Declaring the constants
 */
const compilerOptions = { preventIndent: true };
const minifierOptions: MinifierOptions = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  decodeEntities: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
};

Handlebars.registerHelper('includes', function (this: TemplateDelegate, array, value: any, options: HelperOptions) {
  if (arguments.length !== 3) throw new InternalError('#includes requires exactly 2 arguments');
  if (typeof array === 'function') array = array.call(this);
  if (typeof array !== 'string' && !Array.isArray(array)) throw new InternalError('#includes requires an array or string as the first argument');
  return array.includes(value) ? options.fn(this) : options.inverse(this);
});

export class TemplateEngine {
  private readonly templates = new Map<string, TemplateDelegate>();

  constructor(private readonly options: TemplateEngineOptions = {}) {}

  private loadTemplate(name: string): TemplateDelegate {
    const root = process.cwd();
    const dir = this.options.dir ?? '';
    const ext = this.options.ext ?? 'hbs';
    const templatePath = path.join(root, dir, `${name}.${ext}`);
    try {
      let content = fs.readFileSync(templatePath, 'utf-8');
      if (this.options.minify) content = minify(content, minifierOptions);
      const compiled = Handlebars.compile(content, compilerOptions);
      const Config = Utils.getGlobalRef('config');
      if (Config.isProd()) this.templates.set(name, compiled);
      return compiled;
    } catch (err) {
      throw new InternalError(`Failed to load template: ${name}`);
    }
  }

  registerTemplate(name: string, template: string): void {
    if (this.options.minify) template = minify(template, minifierOptions);
    const compiled = Handlebars.compile(template, compilerOptions);
    this.templates.set(name, compiled);
  }

  getTemplate(name: string): TemplateDelegate {
    const template = this.templates.get(name);
    if (template) return template;
    return this.loadTemplate(name);
  }

  render(name: string, data: object): string {
    const template = this.getTemplate(name);
    return template(data);
  }
}
