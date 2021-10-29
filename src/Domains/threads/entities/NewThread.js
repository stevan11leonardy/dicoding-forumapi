class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.ownerId = payload.ownerId;
    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload(payload) {
    const { ownerId, title, body } = payload;

    if (!ownerId) {
      throw new Error('NEW_THREAD.NOT_LOGIN');
    }

    if (!title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
