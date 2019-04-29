import appRootDir from 'app-root-dir';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

const dir = process.env.DIR;
const paths = path.resolve(appRootDir.get(), `./${dir}/webpack.config.babel.js`);
const webpackConfig = require(paths).default;

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    console.error(err);
  } else {
    const anaylzeFilePath = path.resolve(appRootDir.get(), webpackConfig.output.path, '__analyze__.json');

    // Write out the json stats file.
    fs.writeFileSync(anaylzeFilePath, JSON.stringify(stats.toJson('verbose'), null, 2));
    execSync(`webpack-bundle-analyzer ${anaylzeFilePath} ${webpackConfig.output.path}`, {
      stdio: 'inherit',
      cwd: appRootDir.get(),
    });
  }
});
