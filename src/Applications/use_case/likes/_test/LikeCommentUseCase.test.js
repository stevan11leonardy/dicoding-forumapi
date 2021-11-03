const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like action correctly', async () => {
    const useCasePayload = {
      ownerId: 'ownerId',
      commentId: 'commentId',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.checkHasLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getLikeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await getLikeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkHasLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.ownerId,
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload);
  });

  it('should orchestrating the unlike action correctly', async () => {
    const useCasePayload = {
      ownerId: 'ownerId',
      commentId: 'commentId',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockLikeRepository = new LikeRepository();

    mockLikeRepository.checkHasLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getLikeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    await getLikeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkHasLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.ownerId,
    );
    expect(mockLikeRepository.deleteLike).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.ownerId,
    );
  });
});
