const handleError = (err, ctx) => {
  // TODO: implement datadog
  ctx.log.error(err);
};

export default handleError;
