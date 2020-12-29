const utils = require('../../common/utils');
const libsignal = require('../../lib/libsignal-protocol');
const SenderKeyDistributionMessage = require('../protocol/SenderKeyDistributionMessage');

const { KeyHelper } = libsignal;

class GroupSessionBuilder {
  constructor(senderKeyStore) {
    this.senderKeyStore = senderKeyStore;
  }

  async process(senderKeyName, senderKeyDistributionMessage) {
    console.log('GroupSessionBuilder process', senderKeyName, senderKeyDistributionMessage);
    const senderKeyRecord = await this.senderKeyStore.loadSenderKey(senderKeyName);
    senderKeyRecord.addSenderKeyState(
      senderKeyDistributionMessage.getId(),
      senderKeyDistributionMessage.getIteration(),
      senderKeyDistributionMessage.getChainKey(),
      senderKeyDistributionMessage.getSignatureKey()
    );
    await this.senderKeyStore.storeSenderKey(senderKeyName, senderKeyRecord);
  }

  // [{"senderKeyId":1742199468,"senderChainKey":{"iteration":0,"seed":"yxMY9VFQcXEP34olRAcGCtsgx1XoKsHfDIh+1ea4HAQ="},"senderSigningKey":{"public":""}}]
  async create(senderKeyName) {
    try {
      const senderKeyRecord = await this.senderKeyStore.loadSenderKey(senderKeyName);
      console.log('GroupSessionBuilder create session', senderKeyName, senderKeyRecord);

      if (senderKeyRecord.isEmpty()) {
        const keyId = utils.generateSenderKeyId();
        const senderKey = utils.generateSenderKey();
        const signingKey = utils.generateSenderSigningKey();

        senderKeyRecord.setSenderKeyState(keyId, 0, senderKey, signingKey);
        await this.senderKeyStore.storeSenderKey(senderKeyName, senderKeyRecord);
      }

      const state = senderKeyRecord.getSenderKeyState();

      return new SenderKeyDistributionMessage(
        state.getKeyId(),
        state.getSenderChainKey().getIteration(),
        state.getSenderChainKey().getSeed(),
        state.getSigningKeyPublic()
      );
    } catch (e) {
      console.log(e.stack);
      throw new Error(e);
    }
  }
}
module.exports = GroupSessionBuilder;
