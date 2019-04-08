/**
 * This file resolves the entry assets available from our client bundle.
 */

const fs = require('fs');
const path = require('path');
const appRootDir = require('app-root-dir');

let resultCache;

/**
 * Retrieves the js/css for the named chunks that belong to our client bundle.
 *
 * Note: the order of the chunk names is important. The same ordering will be
 * used when rendering the scripts.
 *
 * This is useful to us for a couple of reasons:
 *   - It allows us to target the assets for a specific chunk, thereby only
 *     loading the assets we know we will need for a specific request.
 *   - The assets are hashed, and therefore they can't be "manually" added
 *     to the render logic.  Having this method allows us to easily fetch
 *     the respective assets simply by using a chunk name. :)
 */
export default function getClientAssets() {
  let baseDir = `./build/client`;

  if (process.env.NODE_ENV !== 'development') {
    baseDir = `./client`;
  }

  // Return the assets json cache if it exists.
  // In development mode we always read the assets json file from disk to avoid
  // any cases where an older version gets cached.
  if (process.env.NODE_ENV !== 'development' && resultCache) {
    return resultCache;
  }

  const assetsPath = path.resolve(appRootDir.get(), baseDir, './assets.json');

  if (!fs.existsSync(assetsPath)) {
    throw new Error(
      `We could not find the "${assetsPath}" file, which contains a list of the assets of the client bundle.  Please ensure that the client bundle has been built.`,
    );
  }

  const readAssetsFile = () => JSON.parse(fs.readFileSync(assetsPath, 'utf8'));
  const assetsJson = readAssetsFile();

  if (typeof assetsJson === 'undefined') {
    throw new Error('No asset data found for client bundle.');
  }

  resultCache = assetsJson;

  return resultCache;
}