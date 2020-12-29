const HKDFv3 = require('../../kdf/hkdfv3');

class SenderMessageKey {
  iteration = 0;

  iv = Buffer.alloc(0);

  cipherKey = Buffer.alloc(0);

  seed = Buffer.alloc(0);

  constructor(iteration, seed) {
    const derivative = new HKDFv3().deriveSecrets(seed, Buffer.from('WhisperGroup'), 48);
    this.iteration = iteration;
    this.seed = seed;
    this.iv = derivative.slice(0, 16);
    this.cipherKey = derivative.slice(16);
  }

  getIteration() {
    return this.iteration;
  }

  getIv() {
    return this.iv;
  }

  getCipherKey() {
    return this.cipherKey;
  }

  getSeed() {
    return this.seed;
  }
}
module.exports = SenderMessageKey;
