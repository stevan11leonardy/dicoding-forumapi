class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.ownerId = payload.ownerId;
    this.commentId = payload.commentId;
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    const {
      ownerId, threadId, commentId, content,
    } = payload;

    if (!ownerId) {
      throw new Error('NEW_REPLY.NOT_LOGIN');
    }

    if (!content || !commentId) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof ownerId !== 'string' || typeof commentId !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
