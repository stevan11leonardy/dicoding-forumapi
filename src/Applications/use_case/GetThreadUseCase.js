class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkAvailabilityThread(useCasePayload.threadId);
    const thread = await this._threadRepository.getThreadById(useCasePayload.threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload.threadId);

    return {
      ...thread,
      comments: (await Promise.all(comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        const likeCount = await this._likeRepository.getLikesByCommentId(comment.id);

        return {
          ...comment,
          likeCount,
          replies,
        };
      }))),
    };
  }
}

module.exports = GetThreadUseCase;
