const helmet = require('koa-helmet');

function addSecurity(app) {
  // Don't expose any software information to hackers.
  app.use(helmet.hidePoweredBy());

  // TODO: Prevent HPP for koa (below example is for express)
  // Prevent HTTP Parameter pollution.
  // app.use(hpp());

  // The xssFilter middleware sets the X-XSS-Protection header to prevent
  // reflected XSS attacks.
  // @see https://helmetjs.github.io/docs/xss-filter/
  app.use(helmet.xssFilter());

  app.use(helmet.dnsPrefetchControl());

  // Frameguard mitigates clickjacking attacks by setting the X-Frame-Options header.
  // @see https://helmetjs.github.io/docs/frameguard/
  app.use(helmet.frameguard('deny'));

  // Sets the X-Download-Options to prevent Internet Explorer from executing
  // downloads in your site’s context.
  // @see https://helmetjs.github.io/docs/ienoopen/
  app.use(helmet.ieNoOpen());

  // Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
  // to guess (“sniff”) the MIME type, which can have security implications. It
  // does this by setting the X-Content-Type-Options header to nosniff.
  // @see https://helmetjs.github.io/docs/dont-sniff-mimetype/
  app.use(helmet.noSniff());
}

module.exports = addSecurity;
