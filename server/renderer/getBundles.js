import config from '@config';

const publicPath = config.get('PUBLIC_PATH');

/**
 * source https://github.com/jamiebuilds/react-loadable/blob/master/src/webpack.js
 * to eliminate dependencies to react-loadable in this package
 */
function loadableGetBundles(manifest, moduleIds) {
  return moduleIds.reduce((bundles, moduleId) => bundles.concat(manifest[moduleId]), []);
}

export default function getBundles(stats, modules) {
  return (
    loadableGetBundles(stats, modules)
      // Create <script defer> tags from bundle objects
      .map(bundle => `${publicPath}${bundle.file.replace(/\.map$/, '')}`)
      // Make sure only unique bundles are included
      .filter((value, index, self) => self.indexOf(value) === index)
  );
}
