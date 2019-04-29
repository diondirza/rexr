import { IncomingMessage } from 'http';
import { FastifyRequest, FastifyError } from 'fastify';

export default function handleError(error: FastifyError, request: FastifyRequest<IncomingMessage>) {
  const { statusCode } = error;

  if (statusCode && statusCode >= 400 && statusCode < 500) {
    request.log.info(error);
  } else {
    request.log.error(error);
  }
}
