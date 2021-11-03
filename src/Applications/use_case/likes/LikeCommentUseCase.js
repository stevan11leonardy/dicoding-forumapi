class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkAvailabilityThread(useCasePayload.threadId);
    await this._commentRepository.checkAvailabilityComment(useCasePayload.commentId);

    const isLiked = await this._likeRepository.checkHasLiked(
      useCasePayload.commentId,
      useCasePayload.ownerId,
    );

    if (isLiked) {
      return this._likeRepository.deleteLike(useCasePayload.commentId, useCasePayload.ownerId);
    }

    return this._likeRepository.addLike(useCasePayload);
  }
}

module.exports = LikeCommentUseCase;
