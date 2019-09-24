const resolvableExtensions = () => [`.phi`];

function onCreateWebpackConfig({ actions, loaders }) {
  const jsLoader = loaders.js();
  if (!jsLoader) {
    return;
  }
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.phi$/,
          use: [jsLoader, require.resolve("./dist/js-loader")]
        }
      ]
    }
  });
}

exports.resolvableExtensions = resolvableExtensions;
exports.onCreateWebpackConfig = onCreateWebpackConfig;
