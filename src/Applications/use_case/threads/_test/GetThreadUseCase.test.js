const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedThread = {
      id: threadId,
      title: 'title',
      body: 'body',
      date: new Date().toISOString(),
      username: 'username',
      likeCount: 0,
      comments: [],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.getLikesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(0));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Actionx
    const thread = await getThreadUseCase.execute({ threadId });

    // Assert
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledTimes(0);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledTimes(0);
  });

  it('should orchestrating the get thread action correctly when there is a comment', async () => {
    // Arrange
    const threadId = 'thread-123';
    const comment = {
      id: 'comment-123',
      content: 'content',
      username: 'username',
      date: new Date().toISOString(),
      likeCount: 0,
      replies: [],
    };
    const expectedThread = {
      id: threadId,
      title: 'title',
      body: 'body',
      date: new Date().toISOString(),
      username: 'username',
      comments: [comment],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{ ...comment, is_delete: false }]));

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.getLikesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(0));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute({ threadId });

    // Assert
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledTimes(1);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(comment.id);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledTimes(1);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledWith(comment.id);
  });

  it('should orchestrating the get thread action correctly when there is a comment and a reply', async () => {
    // Arrange
    const threadId = 'thread-123';
    const reply = {
      id: 'reply',
      content: 'content',
      username: 'username',
      date: new Date().toISOString(),
    };
    const comment = {
      id: 'comment-123',
      content: 'content',
      username: 'username',
      date: new Date().toISOString(),
      likeCount: 0,
      replies: [reply],
    };
    const expectedThread = {
      id: threadId,
      title: 'title',
      body: 'body',
      date: new Date().toISOString(),
      username: 'username',
      comments: [comment],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        { ...comment, is_delete: false },
      ]));

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([{ ...reply, is_delete: false }]));

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.getLikesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(0));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute({ threadId });

    // Assert
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledTimes(1);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(comment.id);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledTimes(1);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledWith(comment.id);
  });

  it('should orchestrating the get thread action correctly when there is a deleted comment', async () => {
    // Arrange
    const threadId = 'thread-123';
    const comment = {
      id: 'comment-123',
      content: 'content',
      username: 'username',
      date: new Date().toISOString(),
      likeCount: 0,
      replies: [],
    };
    const expectedThread = {
      id: threadId,
      title: 'title',
      body: 'body',
      date: new Date().toISOString(),
      username: 'username',
      comments: [{ ...comment, content: '**komentar telah dihapus**' }],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{ ...comment, is_delete: true }]));

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.getLikesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(0));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute({ threadId });

    // Assert
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledTimes(1);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(comment.id);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledTimes(1);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledWith(comment.id);
  });

  it('should orchestrating the get thread action correctly when there is a deleted comment and a deleted reply', async () => {
    // Arrange
    const threadId = 'thread-123';
    const reply = {
      id: 'reply',
      content: 'content',
      username: 'username',
      date: new Date().toISOString(),
    };
    const comment = {
      id: 'comment-123',
      content: 'content',
      username: 'username',
      date: new Date().toISOString(),
      likeCount: 0,
      replies: [],
    };
    const expectedThread = {
      id: threadId,
      title: 'title',
      body: 'body',
      date: new Date().toISOString(),
      username: 'username',
      comments: [
        {
          ...comment,
          content: '**komentar telah dihapus**',
          replies: [{ ...reply, content: '**balasan telah dihapus**' }],
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        { ...comment, is_delete: true },
      ]));

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([{ ...reply, is_delete: true }]));

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.getLikesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(0));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute({ threadId });

    // Assert
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledTimes(1);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(comment.id);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledTimes(1);
    expect(mockLikeRepository.getLikesByCommentId).toBeCalledWith(comment.id);
  });
});
