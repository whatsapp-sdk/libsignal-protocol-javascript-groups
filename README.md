### libsignal-protocol-javascript-groups

signal protocol 是真正的端到端的通讯加密协议，号称是世界上最安全的通讯协议，任何第三方包括服务器都无法查看通讯内容，热门应用 facebook messenger，whatsapp，singal app 都采用的此协议。

此协议已有多种语言版本的实现，如下：

- https://github.com/signalapp/libsignal-protocol-java
- https://github.com/signalapp/libsignal-protocol-javascript
- https://github.com/tgalal/python-axolotl
- https://github.com/privacyresearchgroup/libsignal-protocol-typescript

但在 javascript 的实现中，缺少了群组相关部分的功能，本项目参考 python 的开源代码，完善了群组相关功能，包括：

- GroupSessionBuilder
- GroupCipher

目前部分代码还在整理中，暂不可用。

此外，本项目只支持 nodejs，不支持浏览器端运行。

### Session

```javascript
const groupSession = new GroupSessionBuilder();
groupSession.create(senderKeyName);
// or
groupSession.process(senderKeyName, senderkeydistributionmessage);
```

### Cipher

```javascript
const groupCipher = new GroupCipher(store, senderKeyName);

groupCipher.encrypt(plainText); // 加密消息

groupCipher.decrypt(cipherText); // 解密消息
```

### License

MIT
