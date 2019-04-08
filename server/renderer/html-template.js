import serialize from 'serialize-javascript';
import { get } from 'lodash';
import config from '@config';

import { createLinkTag, createPreloadTag, createScriptTag, preconnectTags } from '../../utils/html';
import { ifElse } from '../../utils/logic';
import getClientAssets from './getClientAssets';

import { normalizeCSS, criticalCSS } from '../../utils/html/critical-css';

const ifProd = ifElse(__PROD__);
const assets = getClientAssets();
const { GTM_CONTAINER_ID = '' } = constants;

export const getHeader = ({
  bundles = [],
  scripts = [],
  helmet = {
    base: [],
    bodyAttributes: [],
    htmlAttributes: [],
    link: [],
    meta: [],
    script: [],
    style: [],
    title: [],
  },
} = {}) => {
  const bundleScripts = bundles.filter(src => /[.]js$/i.test(src)) || [];
  const preloadedAssetScripts = scripts
    .map(script => createPreloadTag({ as: 'script', href: get(assets, `[${script}].js`) }))
    .join('\n\t');
  const preloadedBundleScripts = bundleScripts.map(src => createPreloadTag({ as: 'script', href: src })).join('\n\t');

  return `<!DOCTYPE html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.base.toString()}${helmet.title.toString()}
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width">
    ${ifProd(preconnectTags, '')}
    <link rel="manifest" href="/manifest.json">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Tokopedia">
    <meta name="theme-color" content="#42b549">
    <style type="text/css">${normalizeCSS}</style>
    <style type="text/css">${criticalCSS}</style>
    ${preloadedAssetScripts}
    ${preloadedBundleScripts}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.style.toString()}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <noscript>This website need to enable Javascript to view.</noscript>
    <div id="content">`;
};

export const getFooter = ({
  initPageviewInitial = {},
  initialGlobalState,
  xdevice,
  bundles = [],
  helmet = {
    base: [],
    bodyAttributes: [],
    htmlAttributes: [],
    link: [],
    meta: [],
    script: [],
    style: [],
    title: [],
  },
} = {}) => {
  const isMobileApp = /^(ios|android)-+/.test(xdevice);
  const gtmContainerId = GTM_CONTAINER_ID;
  const bundleScripts = bundles.filter(src => /[.]js$/i.test(src)) || [];
  const bundleStyles = bundles.filter(src => /[.]css$/i.test(src)) || [];
  const gtmTrackingScript = `
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}" height="0" width="0" style="display: none; visibility: hidden;"></iframe></noscript>
    <script type="text/javascript">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmContainerId}');</script>
  `;

  return `</div>
    <script type="text/javascript">
      window.initialGlobalState=${serialize(initialGlobalState)};
      window.__ismobileapp =${isMobileApp};
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(${serialize(initPageviewInitial)});
      window.NODE_ENV="${config.get('ENV')}";
      window.version="${__GITREV__}";
      window.xdevice="${xdevice}";
    </script>
    ${ifProd(bundleStyles.map(src => createLinkTag({ src })).join('\n\t'), '')}
    ${createScriptTag({ src: assets['vendor~client'].js })}
    ${bundleScripts.map(src => createScriptTag({ src })).join('\n\t')}
    ${createScriptTag({ src: assets.client.js })}
    ${helmet.script.toString()}
    ${ifProd(gtmTrackingScript, '')}
  </body>
</html>`;
};
