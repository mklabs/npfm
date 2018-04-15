const bufferHelper = module.exports = (obj, options) => {
  const { encoding } = options;

  const buffer = (b) => Buffer.from(b);
  const string = (s) => Buffer.from(s, encoding || this.encoding);

  const number = (n) => {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(n);
    return buffer;
  };

  const api = {
    string,
    buffer,
    number
  };

  if (typeof obj === 'string') return string(obj);
  else if (typeof obj === 'number') return number(n);
  else if (Buffer.isBuffer(obj)) return buffer(obj)
  // nothing passed, return the chained API
  else if (!obj) return api;
  // not a valid type, just throw
  else {
    throw new Error('Passed object is not supported');
  }
};
