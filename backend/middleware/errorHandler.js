/** 404 handler for routes that don't match anything above. */
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

/**
 * Centralized error handler. Any error passed to next(err), or thrown in an
 * async handler wrapped by express-async-errors-style try/catch, ends up
 * here with a consistent JSON shape and appropriate status code.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Something went wrong on the server.",
  });
}

module.exports = { notFound, errorHandler };
