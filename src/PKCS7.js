const _byte_padding_update = (buffer, data, blockSize) => {
  buffer = Buffer.concat([Buffer.from(buffer), Buffer.from(data)]);
  const per = Math.floor(blockSize / 8);

  const finished_blocks = Math.floor(buffer.length / per);

  const result = buffer.slice(0, finished_blocks * per);
  buffer = buffer.slice(finished_blocks * per);
  return [buffer, result];
};

const _byte_padding_pad = (buffer, blockSize, paddingfn) => {
  const per = Math.floor(blockSize / 8);
  const pad_size = per - buffer.length;
  return Buffer.concat([buffer, paddingfn(pad_size)]);
};

const _byte_unpadding_update = (buffer, data, blockSize) => {
  buffer = Buffer.concat([Buffer.from(buffer), Buffer.from(data)]);
  const per = Math.floor(blockSize / 8);
  const finished_blocks = Math.max(Math.floor(buffer.length / per) - 1, 0);

  const result = buffer.slice(0, finished_blocks * per);
  buffer = buffer.slice(finished_blocks * per);
  return [buffer, result];
};

const _byte_unpadding_check = buffer => {
  const pad_size = buffer[buffer.length - 1];
  return buffer.slice(0, -1 * pad_size);
};

class _PKCS7PaddingContext {
  constructor(blockSize) {
    this.blockSize = blockSize;
    this._buffer = Buffer.alloc(0);
  }

  update(data) {
    const [buffer, result] = _byte_padding_update(this._buffer, data, this.blockSize);
    this._buffer = buffer;
    return result;
  }

  _padding(size) {
    return Buffer.alloc(size).fill(size);
  }

  finalize() {
    const result = _byte_padding_pad(this._buffer, this.blockSize, this._padding);
    this._buffer = Buffer.alloc(0);
    return result;
  }
}

class _PKCS7UnpaddingContext {
  constructor(blockSize) {
    this.blockSize = blockSize;
    this._buffer = Buffer.alloc(0);
  }

  update(data) {
    const [buffer, result] = _byte_unpadding_update(this._buffer, data, this.blockSize);
    this._buffer = buffer;
    return result;
  }

  finalize() {
    const result = _byte_unpadding_check(this._buffer);
    this._buffer = Buffer.alloc(0);
    return result;
  }
}

class PKCS7 {
  constructor(blockSize) {
    this.blockSize = blockSize;
  }

  padder() {
    return new _PKCS7PaddingContext(this.blockSize);
  }

  unpadder() {
    return new _PKCS7UnpaddingContext(this.blockSize);
  }
}

module.exports = PKCS7;
