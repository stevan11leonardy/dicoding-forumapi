class DeleteReplyUseCase {
  constructor({
    replyRepository,
  }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { replyId, ownerId } = useCasePayload;
    await this._replyRepository.checkAvailabilityReply(replyId);
    await this._replyRepository.checkOwnership(replyId, ownerId);
    await this._replyRepository.deleteReply(replyId);
  }

  _validatePayload(payload) {
    const { replyId, ownerId } = payload;
    if (!replyId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_REPLY_ID');
    }
    if (!ownerId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_OWNER_ID');
    }

    if (typeof replyId !== 'string' || typeof ownerId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
