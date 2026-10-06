function friendly(err) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'value';
    return `That ${field} is already in use. Please choose another.`;
  }
  if (err.name === 'ValidationError') {
    return Object.values(err.errors).map(e => e.message).join(' ');
  }
  if (err.name === 'CastError') {
    return 'The requested record could not be found.';
  }
  return err.message;
}

module.exports = { friendly };
