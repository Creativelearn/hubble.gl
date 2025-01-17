// This file contains webpack configuration settings that allow
// examples to be built against the source code in this repo instead
// of building against their installed version of the modules.

const {resolve} = require('path');
const {getOcularConfig} = require('ocular-dev-tools');

// eslint-disable-next-line import/no-extraneous-dependencies
const ALIASES = getOcularConfig({
  root: resolve(__dirname, '..')
}).aliases;
const ROOT_DIR = resolve(__dirname, '..');
const LIB_DIR = resolve(__dirname, '..');

// Support for hot reloading changes to the deck.gl library:
function makeLocalDevConfig(EXAMPLE_DIR = LIB_DIR, linkToLuma, linkToMath) {
  const LUMA_LINK_ALIASES = {
    '@luma.gl/constants': `${ROOT_DIR}/../luma.gl/modules/constants/src`,
    '@luma.gl/core': `${ROOT_DIR}/../luma.gl/modules/core/src`,
    '@luma.gl/debug': `${ROOT_DIR}/../luma.gl/modules/debug/src`,
    '@luma.gl/engine': `${ROOT_DIR}/../luma.gl/modules/engine/src`,
    '@luma.gl/webgl': `${ROOT_DIR}/../luma.gl/modules/webgl/src`,
    '@luma.gl/gltools': `${ROOT_DIR}/../luma.gl/modules/gltools/src`,
    '@luma.gl/shadertools': `${ROOT_DIR}/../luma.gl/modules/shadertools/src`,
    '@luma.gl/experimental': `${ROOT_DIR}/../luma.gl/modules/experimental/src`
  };
  const LUMA_LOCAL_ALIASES = {
    '@luma.gl/constants': `${ROOT_DIR}/node_modules/@luma.gl/constants`,
    '@luma.gl/core': `${ROOT_DIR}/node_modules/@luma.gl/core`,
    '@luma.gl/engine': `${ROOT_DIR}/node_modules/@luma.gl/engine`,
    '@luma.gl/webgl': `${ROOT_DIR}/node_modules/@luma.gl/webgl`,
    '@luma.gl/gltools': `${ROOT_DIR}/node_modules/@luma.gl/gltools`,
    '@luma.gl/shadertools': `${ROOT_DIR}/node_modules/@luma.gl/shadertools`,
    '@luma.gl/experimental': `${ROOT_DIR}/node_modules/@luma.gl/experimental`,
    // @luma.gl/experimental is not available in the root node_modules, must be imported
    // where required.
    '@loaders.gl/core': `${ROOT_DIR}/node_modules/@loaders.gl/core`,
    '@loaders.gl/images': `${ROOT_DIR}/node_modules/@loaders.gl/images`
  };

  const LUMA_ALIASES = linkToLuma ? LUMA_LINK_ALIASES : LUMA_LOCAL_ALIASES;
  // console.warn(JSON.stringify(LUMA_ALIASES, null, 2)); // uncomment to debug config
  // require('fs').writeFileSync('/tmp/ocular.log', JSON.stringify(config, null, 2));

  const MATH_ALIASES = {};
  if (linkToMath) {
    const MATH_MODULES = [
      'core',
      'culling',
      'geoid',
      'geospatial',
      'main',
      'web-mercator',
      'polygon',
      'proj4',
      'sun',
      'web'
    ];
    for (const module of MATH_MODULES) {
      MATH_ALIASES[`@math.gl/${module}`] = `${ROOT_DIR}/../math.gl/modules/${module}/src`;
    }
  } else {
    MATH_ALIASES['math.gl'] = resolve(LIB_DIR, './node_modules/math.gl');
  }

  return {
    // TODO - Uncomment when all examples use webpack 4 for faster bundling
    // mode: 'development',

    // suppress warnings about bundle size
    devServer: {
      stats: {
        warnings: false
      }
    },

    devtool: 'source-map',

    resolve: {
      // mainFields: ['esnext', 'module', 'main'],

      alias: Object.assign({}, ALIASES, LUMA_ALIASES, MATH_ALIASES, {
        // Use luma.gl installed in parallel with deck.gl
        // Important: ensure shared dependencies come from the main node_modules dir
        // Versions will be controlled by the deck.gl top level package.json
        react: resolve(LIB_DIR, './node_modules/react')
      })
    },
    module: {
      rules: [
        {
          // Unfortunately, webpack doesn't import library sourcemaps on its own...
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre'
        },
        {
          // Compile source using babel. This is not necessary for src to run in the browser
          // However class inheritance cannot happen between transpiled/non-transpiled code
          // Which affects some examples
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-proposal-class-properties',
              [
                '@babel/plugin-transform-runtime',
                {
                  absoluteRuntime: false,
                  corejs: false,
                  helpers: false,
                  regenerator: true,
                  useESModules: false
                }
              ]
            ],
            presets: [['@babel/preset-env', {targets: '> 1%, not ie 11'}], '@babel/preset-react']
          },
          include: [resolve(ROOT_DIR, 'modules'), resolve(ROOT_DIR, '../luma.gl/modules')]
        }
      ]
    }
  };
}

function addLocalDevSettings(config, exampleDir, linkToLuma, linkToMath) {
  const LOCAL_DEV_CONFIG = makeLocalDevConfig(exampleDir, linkToLuma, linkToMath);
  config = Object.assign({}, LOCAL_DEV_CONFIG, config);
  config.resolve = Object.assign({}, LOCAL_DEV_CONFIG.resolve, config.resolve || {});
  config.resolve.alias = config.resolve.alias || {};
  Object.assign(config.resolve.alias, LOCAL_DEV_CONFIG.resolve.alias);

  config.module = config.module || {};
  Object.assign(config.module, {
    rules: (config.module.rules || []).concat(LOCAL_DEV_CONFIG.module.rules)
  });
  return config;
}

module.exports = (config, exampleDir) => env => {
  // npm run start-local now transpiles the lib
  if (!env) {
    return config;
  }

  if (env.local) {
    config = addLocalDevSettings(config, exampleDir, env['local-luma'], env['local-math']);
  }

  // npm run start-es6 does not transpile the lib
  if (env && env.es6) {
    config = addLocalDevSettings(config, exampleDir, env['local-luma'], env['local-math']);
  }

  if (env && env.production) {
    config.mode = 'production';
  }

  // console.warn(JSON.stringify(config, null, 2)); // uncomment to debug config
  return config;
};
