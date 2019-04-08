function skipMiddleware(ctx, next) {
  return next();
}

module.exports = skipMiddleware;
