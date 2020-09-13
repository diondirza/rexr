import serialize from 'serialize-javascript';
import { HelmetData } from 'react-helmet-async';
import { ChunkExtractor } from '@loadable/server';

import config from '@config';
import { GlobalState } from '@context/global/types';
import { normalizeCSS, criticalCSS } from '../../utils/html/critical-css';
import { ifElse } from '../../utils/logic';

const ifProd = ifElse(__PROD__);
const { GTM_CONTAINER_ID = '' } = constants;

export type HTMLState = {
  extractor?: ChunkExtractor;
  helmet?: HelmetData;
  initialGlobalState?: GlobalState;
  initialCacheState?: any;
};

export default function template({
  extractor,
  helmet,
  initialGlobalState,
  initialCacheState,
}: HTMLState): [string, string] {
  const gtmContainerId = GTM_CONTAINER_ID;
  const gtmTrackingScript = `
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}" height="0" width="0" style="display: none; visibility: hidden;"></iframe></noscript>
    <script type="text/javascript">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmContainerId}');</script>
  `;

  const scriptTags = extractor ? extractor.getScriptTags() : '';
  const styleTags = extractor ? extractor.getStyleTags() : '';
  const linkTags = extractor ? extractor.getLinkTags() : '';

  return [
    `
<html ${helmet?.htmlAttributes.toString() ?? ''}>
  <head>
    ${helmet?.base.toString() ?? ''}${helmet?.title.toString() ?? ''}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="RexR">
    <meta name="theme-color" content="#42b549">
    <style type="text/css">${normalizeCSS}</style>
    <style type="text/css">${criticalCSS}</style>
    ${linkTags}
    ${helmet?.meta.toString() ?? ''}
    ${helmet?.link.toString() ?? ''}
    ${helmet?.style.toString() ?? ''}
  </head>
  <body ${helmet?.bodyAttributes.toString() ?? ''}>
    <noscript>This website need to enable Javascript to view.</noscript>
    <div id="app">`,
    `</div>
    <script type="text/javascript">
      window.csr = ${!config.get('SSR_STATUS')};
      window.constants=${serialize(constants)};
      window.ENV="${config.get('ENV')}";
      window.initialGlobalState=${serialize(initialGlobalState)};
      window.__cache=${serialize(initialCacheState)};
      window.version="${__GITREV__}";
    </script>
    ${ifProd(styleTags, '')}
    ${scriptTags}
    ${helmet?.script.toString() ?? ''}
    ${ifProd(gtmTrackingScript, '')}
  </body>
</html>`,
  ];
}
