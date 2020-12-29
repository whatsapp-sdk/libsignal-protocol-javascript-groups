const HKDF = require('./hkdf');

class HKDFv2 extends HKDF {
  getIterationStartOffset() {
    return 0;
  }
}
module.exports = HKDFv2;
