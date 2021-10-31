class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkAvailabilityThread(useCasePayload.threadId);
    const thread = await this._threadRepository.getThreadById(useCasePayload.threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload.threadId);

    console.log();

    return {
      ...thread,
      comments: (await Promise.all(comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

        return {
          ...comment,
          replies,
        };
      }))),
    };
  }
}

module.exports = GetThreadUseCase;
