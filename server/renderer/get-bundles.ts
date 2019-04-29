import config from '@config';

const publicPath = config.get('PUBLIC_PATH');

/**
 * source https://github.com/jamiebuilds/react-loadable/blob/master/src/webpack.js
 * to eliminate dependencies to react-loadable in this package
 */
function loadableGetBundles(manifest: any, moduleIds: string[]): any[] {
  return moduleIds.reduce((bundles: string[], moduleId: string) => bundles.concat(manifest[moduleId]), []);
}

export default function getBundles(stats: any, modules: string[]) {
  return (
    loadableGetBundles(stats, modules)
      // Create <script defer> tags from bundle objects
      .map((bundle: any) => `${publicPath}${bundle.file.replace(/\.map$/, '')}`)
      // Make sure only unique bundles are included
      .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
  );
}