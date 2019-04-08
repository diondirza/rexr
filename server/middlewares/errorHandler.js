async function errorHandlerMiddleware(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = process.env.NODE_ENV === 'development' ? err : 'Ooopss.. We could not process request';
    ctx.app.emit('error', err, ctx);
  }
}

module.exports = errorHandlerMiddleware;
