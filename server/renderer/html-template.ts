import serialize from 'serialize-javascript';

import config from '@config';
import { GlobalState } from '@context/global/types';
import { createLinkTag, createPreloadTag, createScriptTag, preconnectTags } from '../../utils/html';
import { ifElse } from '../../utils/logic';
import getClientAssets from './get-client-assets';

import { normalizeCSS, criticalCSS } from '../../utils/html/critical-css';
import { HelmetData } from 'react-helmet';

const ifProd = ifElse(__PROD__);
const assets = getClientAssets();
const { GTM_CONTAINER_ID = '' } = constants;

export type HTMLState = {
  bundles?: string[];
  helmet?: HelmetData;
  initialGlobalState?: GlobalState;
  initialCacheState?: any;
};

export default function template({
  bundles = [],
  helmet,
  initialGlobalState,
  initialCacheState,
}: HTMLState): [string, string] {
  const bundleScripts = bundles.filter(src => /[.]js$/i.test(src)) || [];
  const bundleStyles = bundles.filter(src => /[.]css$/i.test(src)) || [];
  const preloadedBundleScripts = bundleScripts.map(src => createPreloadTag({ as: 'script', href: src })).join('\n\t');
  const gtmContainerId = GTM_CONTAINER_ID;
  const gtmTrackingScript = `
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}" height="0" width="0" style="display: none; visibility: hidden;"></iframe></noscript>
    <script type="text/javascript">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmContainerId}');</script>
  `;

  return [
    `
<html ${helmet && helmet.htmlAttributes.toString()}>
  <head>
    ${helmet && helmet.base.toString()}${helmet && helmet.title.toString()}
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width">
    ${ifProd(preconnectTags, '')}
    <link rel="manifest" href="/manifest.json">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Tokopedia">
    <meta name="theme-color" content="#42b549">
    <style type="text/css">${normalizeCSS}</style>
    <style type="text/css">${criticalCSS}</style>
    ${preloadedBundleScripts}
    ${helmet && helmet.meta.toString()}
    ${helmet && helmet.link.toString()}
    ${helmet && helmet.style.toString()}
  </head>
  <body ${helmet && helmet.bodyAttributes.toString()}>
    <noscript>This website need to enable Javascript to view.</noscript>
    <div id="app">`,
    `</div>
    <script type="text/javascript">
      window.initialGlobalState=${serialize(initialGlobalState)};
      window.__cache=${serialize(initialCacheState)};
      window.NODE_ENV="${config.get('ENV')}";
      window.version="${__GITREV__}";
    </script>
    ${ifProd(bundleStyles.map(src => createLinkTag({ src })).join('\n\t'), '')}
    ${createScriptTag({ src: assets['vendor~client'].js })}
    ${bundleScripts.map(src => createScriptTag({ src })).join('\n\t')}
    ${createScriptTag({ src: assets.client.js })}
    ${helmet && helmet.script.toString()}
    ${ifProd(gtmTrackingScript, '')}
  </body>
</html>`,
  ];
}
