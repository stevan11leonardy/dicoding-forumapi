class DeleteCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { commentId, ownerId } = useCasePayload;
    await this._commentRepository.checkAvailabilityComment(commentId);
    await this._commentRepository.checkOwnership(commentId, ownerId);
    await this._commentRepository.deleteComment(commentId);
  }

  _validatePayload(payload) {
    const { commentId, ownerId } = payload;
    if (!commentId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
    }
    if (!ownerId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_OWNER_ID');
    }

    if (typeof commentId !== 'string' || typeof ownerId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
