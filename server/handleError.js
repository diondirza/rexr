export default function handleError(error, request, _reply) {
  const { statusCode } = error;

  if (statusCode >= 500) {
    request.log.error(error);
  } else if (statusCode >= 400) {
    request.log.info(error);
  } else {
    request.log.error(error);
  }
}
