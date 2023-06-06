const fs = require('fs');
const path = require('path');
const deepmerge = require('deepmerge');

const sass = require("sass");
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssMediaMinMax = require('postcss-media-minmax');
const postcssSortMediaQueries = require('postcss-sort-media-queries');
const autoprefixer = require('autoprefixer');
const postcssCsso = require('postcss-csso'); // TODO: Fix issue with minified css
const cssnano = require('cssnano'); // TODO: Replace with module without security issues

const esbuild = require('esbuild');

const Image = require('@11ty/eleventy-img');

const svgo = require('svgo');
const svgSprite = require('svg-sprite');

module.exports = function(eleventyConfig) {

	// Add custom {% view "^component", { data } %} tag
	// eleventyConfig.addNunjucksTag('view', function(nunjucksEngine) {
	// 	return new function() {
  //     this.tags = ['view'];

  //     this.parse = function(parser, nodes, lexer) {
  //       var tok = parser.nextToken();

  //       var args = parser.parseSignature(null, true);
  //       parser.advanceAfterBlockEnd(tok.value);

  //       return new nodes.CallExtension(this, 'run', args);
  //     };

  //     this.run = function(context, component, data = {}) {
	// 			console.log(component);
	// 			const atomicMap = {
	// 				'@': '@atoms',
	// 				'&': '&molecules',
	// 				'^': '^organisms'
	// 			};

	// 			const componentType = atomicMap[component.slice(0, 1)];
	// 			const componentName = component.slice(1);
	// 			const componentPath = `${eleventyConfig.dir.input}/${eleventyConfig.dir.includes}/${componentType}/${componentName}/${componentName}.njk`;
	// 			// const renderResult = nunjucksEngine.renderString(`{% include "${componentPath}" %}`, { [componentName]: data });
	// 			const renderResult = nunjucksEngine.render(componentPath, { [componentName]: data });

	// 			return (new nunjucksEngine.runtime.SafeString(renderResult));
  //     };
  //   }();
	// });

	// Implementation of merge twig filter in nunjucks
	eleventyConfig.addNunjucksFilter('merge', function(firstObject, secondObject) {
		return deepmerge(firstObject, secondObject);
	});

	// Implementation of split twig filter in nunjucks
	eleventyConfig.addNunjucksFilter('split', function(target, separator) {
		return target.split(separator);
	});

	// Experiments
	eleventyConfig.addAsyncShortcode('style', async function(stylesheetName, inline = false, minify = true, media = '') {
		const stylesheetExt = path.extname(stylesheetName);

		const stylesheetPath = path.resolve(path.join(
			eleventyConfig.dir.input,
			eleventyConfig.dir.styles,
			stylesheetName
		));

		let stylesheet = fs.readFileSync(stylesheetPath).toString();

		if (stylesheetExt === '.scss') {
			stylesheet = sass.compileString(stylesheet, {
				loadPaths: [
					'node_modules',
					path.join(eleventyConfig.dir.input, eleventyConfig.dir.includes),
					path.parse(stylesheetPath).dir
				]
			}).css;
		}

		const postcssPlugins = [autoprefixer, postcssSortMediaQueries];

		let resultStylesheetName = '';

		if (minify) {
			resultStylesheetName = stylesheetName.replace('.scss', '.min.css');
			postcssPlugins.push(postcssCsso);
		} else {
			resultStylesheetName = stylesheetName.replace('.scss', '.css');
		}

		const postcssCompileResult = await postcss(postcssPlugins).process(stylesheet, {
			from: stylesheetPath
		});

		if (inline) {
			return `<style>\r\n${postcssCompileResult.css}\r\n</style>`;
		} else {
			const outputDir = path.resolve(path.join(
				eleventyConfig.dir.output,
				eleventyConfig.dir.styles,
			));

			if (! fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir);
			}

			const outputPath = path.resolve(path.join(
				outputDir,
				resultStylesheetName
			));
			
			fs.writeFile(
				path.join(outputDir, resultStylesheetName), 
				postcssCompileResult.css, 
				() => undefined
			);

			const hrefAttr = `${eleventyConfig.dir.styles}/${path.basename(outputPath)}`;
			const mediaAttr = media === '' ? media : ` media="${media}"`;

			return `<link rel="stylesheet" href="${hrefAttr}"${mediaAttr}>`;
		}
	});

	// sass/scss compile
	// eleventyConfig.addTemplateFormats('scss');

	// eleventyConfig.addExtension('scss', {
	// 	outputFileExtension: "css",

	// 	compile: async function(inputContent, inputPath) {
	// 		const parsedInputPath = path.parse(inputPath);

	// 		if (parsedInputPath.name.startsWith('_')) return;

	// 		const resolvedInputPath = path.resolve(parsedInputPath.dir);
	// 		const resolvedStylePath = path.resolve(path.join('./', eleventyConfig.dir.input, 'styles')); 

	// 		if (resolvedInputPath !== resolvedStylePath) return;

	// 		let sassCompileResult = await sass.compileString(inputContent, {
	// 			loadPaths: [
	// 				'node_modules',
	// 				path.join(this.config.dir.input, this.config.dir.includes),
	// 				parsedInputPath.dir
	// 			]
	// 		});

	// 		this.addDependencies(inputPath, sassCompileResult.loadedUrls);

	// 		// TODO: postcss plugin configuration
	// 		// TODO: not minify in development mode
	// 		// TODO: sourcemaps
	// 		// TODO: check browserlist and autoprefixer
	// 		// TODO: critical css*
	// 		// TODO: conditionaly adaptive*
	// 		// TODO: a11y css*
	// 		const postcssCompileResult = await postcss([
	// 			autoprefixer,
	// 			postcssSortMediaQueries,
	// 			postcssCsso
	// 		]).process(sassCompileResult.css, {
	// 			from: inputPath
	// 		});

	// 		return async (data) => {
	// 			return postcssCompileResult.css;
	// 		}
	// 	},

	// 	compileOptions: {
	// 		cache: false // TODO: Chech cache problem
	// 	}
	// });

	// css postpocess
	eleventyConfig.addTemplateFormats('css');

	eleventyConfig.addExtension('css', {
		outputFileExtension: "css",

		compile: async function(inputContent, inputPath) {
			const parsedInputPath = path.parse(inputPath);

			const resolvedInputPath = path.resolve(parsedInputPath.dir);
			const resolvedStylePath = path.resolve(path.join('./', eleventyConfig.dir.input, 'styles')); 

			if (resolvedInputPath !== resolvedStylePath) return;

			const postcssCompileResult = await postcss([
				postcssImport({
					path: [
						path.join('./', eleventyConfig.dir.input, eleventyConfig.dir.includes),
						parsedInputPath.dir,
					]
				}),
				autoprefixer,
				postcssSortMediaQueries,
				postcssCsso
			]).process(inputContent, {
				from: inputPath
			});

			return async (data) => {
				return postcssCompileResult.css;
			}
		}
	});

	// js processing
	eleventyConfig.addTemplateFormats('js');

	eleventyConfig.addExtension('js', {
		outputFileExtension: "js",

		compile: async function(inputContent, inputPath) {
			const resolvedInputPath = path.resolve(inputPath);
			const resolvedScriptPath = path.resolve(path.join('./', eleventyConfig.dir.input, 'scripts/index.js'));

			if (resolvedInputPath !== resolvedScriptPath) return;

			const esbuildCompiledResult = await esbuild.build({
				entryPoints: [inputPath],
				target: 'es2020', // TODO: browserlist
				minify: true,
				bundle: true,
				write: false
			});

			return async (data) => {
				return esbuildCompiledResult.outputFiles[0].text;
			}
		},

		compileOptions: {
			permalink: function(contents, inputPath) {
				const resolvedInputPath = path.resolve(inputPath);
				const resolvedScriptPath = path.resolve(path.join('./', eleventyConfig.dir.input, 'scripts/index.js'));

				if (resolvedInputPath !== resolvedScriptPath) return;
			
				return 'scripts/main.js'; // TODO: Replace magic strings
			},

			cache: false // TODO: Chech cache problem
		}
	});

	// Raster images processing
	eleventyConfig.addTemplateFormats(['jpg', 'jpeg', 'png']);

	eleventyConfig.addExtension(['jpg', 'jpeg', 'png'], {
		read: false, // Don't read images

		compile: async function(inputContent, inputPath) {
			if (inputPath.includes('resources')) return;

			const inputExt = path.parse(inputPath).ext;

			await Image(inputPath, {
				width: ['auto'],
				formats: ['auto', 'webp', 'avif'],
				outputDir: path.parse(inputPath).dir.replace('app', 'dist/assets'),
				filenameFormat: function (id, src, width, format, options) {
					format = format === 'jpeg' ? 'jpg' : format;

					return `${path.parse(src).name}.${format}`;
				},
				statsOnly: false,
				// TODO: Sharp config options
				// sharpJpegOptions: {

				// },
				// sharpPngOptions: {

				// },
				// sharpWebpOptions: {

				// },
				// sharpAvifOptions: {

				// }
			});
		},

		compileOptions: {
			cache: false // TODO: Chech cache problem
		}
	});

	// Vector images processing
	let svgSpriteMono = null;
	let svgSpriteMulti = null;

	eleventyConfig.addTemplateFormats('svg');

	eleventyConfig.addExtension('svg', {
		init: function() {
			svgSpriteMono = new svgSprite({
				mode: {
					stack: {
						dest: eleventyConfig.dir.output,
						sprite: 'assets/sprites/sprite-mono.svg',
					},
				},
			});

			svgSpriteMulti = new svgSprite({
				mode: {
					stack: {
						sprite: 'assets/sprites/sprite-multi.svg',
					},
				},
			});
		},

		compile: async function(inputContent, inputPath) {
			if (inputPath.includes('resources')) return;

			if (inputPath.includes('icons/mono')) {
				inputContent = svgo.optimize(inputContent, {
					plugins: [
						'preset-default',
						{
							name: 'removeAttrs',
							params: {
								attrs: ['class', 'data-name', 'fill.*', 'stroke.*']
							}
						}
					]
				}).data;

				svgSpriteMono.add(
					inputPath,
					`${path.parse(inputPath).dir}/${path.parse(inputPath).base}`,
					inputContent
				);

				return;
			}

			if (inputPath.includes('icons/multi')) {
				inputContent = svgo.optimize(inputContent, {
					plugins: [
						{
							name: 'preset-default',
							params: {
								overrides: {
									removeUselessStrokeAndFill: false,
									inlineStyles: true
								}
							}
						},
						{
							name: 'removeAttrs',
							params: {
								attrs: ['class', 'data-name']
							}
						},
					]
				}).data;
				
				svgSpriteMulti.add(
					inputPath,
					`${path.parse(inputPath).dir}/${path.parse(inputPath).base}`,
					inputContent
				);

				return;
			}

			await Image(inputPath, {
				formats: ['svg'],
				outputDir: path.parse(inputPath).dir.replace('app', 'dist/assets'),
				filenameFormat: function (id, src, width, format, options) {
					return `${path.parse(src).name}.${format}`;
				},
				statsOnly: false
			})
		},

		compileOptions: {
			cache: false // TODO: Chech cache problem
		}
	});

	eleventyConfig.on('eleventy.after', async (event) => {
		svgSpriteMono.compile((error, result, data) => {
			for (const mode of Object.values(result)) {
				for (const resource of Object.values(mode)) {
					fs.mkdirSync(path.dirname(resource.path), { recursive: true });
          fs.writeFileSync(resource.path, resource.contents);
				}
			}
	});
		// svgSpriteMulti.compile();
	});

	// Copy static assets
	eleventyConfig.addPassthroughCopy({
		'app/resources': 'assets'
	});

	return {
		dir: {
			input: 'app',
			includes: 'blocks',
			layouts: 'blocks/layout',
			data: 'data',
			output: 'dist',
			styles: 'styles' // non-standart
		},
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		templateFormats: ['njk', 'html', 'md']
	}
}