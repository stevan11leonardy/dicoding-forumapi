class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.ownerId = payload.ownerId;
    this.threadId = payload.threadId;
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    const { ownerId, threadId, content } = payload;

    if (!ownerId) {
      throw new Error('NEW_COMMENT.NOT_LOGIN');
    }

    if (!content || !threadId) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof ownerId !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
