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

    return {
      ...thread,
      comments: (await Promise.all(comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

        return {
          ...(this._normalizeComment(comment)),
          replies: replies.map((reply) => this._normalizeReply(reply)),
        };
      }))),
    };
  }

  _normalizeComment(comment) {
    const defaultComment = {
      id: comment.id,
      content: comment.content,
      username: comment.username,
      date: comment.date,
    };
    if (comment.is_delete) {
      return {
        ...defaultComment,
        content: '**komentar telah dihapus**',
      };
    }

    return defaultComment;
  }

  _normalizeReply(reply) {
    const defaultReply = {
      id: reply.id,
      content: reply.content,
      username: reply.username,
      date: reply.date,
    };
    if (reply.is_delete) {
      return {
        ...defaultReply,
        content: '**balasan telah dihapus**',
      };
    }

    return defaultReply;
  }
}

module.exports = GetThreadUseCase;
