const resolvableExtensions = () => [`.neptune`];

console.log("Gatsby neptune plugin");

function onCreateWebpackConfig({ actions, loaders }) {
  const jsLoader = loaders.js();
  console.log(loaders);

  if (!jsLoader) {
    return;
  }
  console.log("Inside gatsby neptune plugin");
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.neptune$/,
          use: [jsLoader, require.resolve("./js-loader")]
        }
      ]
    }
  });
}

exports.resolvableExtensions = resolvableExtensions;
exports.onCreateWebpackConfig = onCreateWebpackConfig;
