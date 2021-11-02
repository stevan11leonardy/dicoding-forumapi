const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/replies/entities/NewReply');

describe('AddReplyUseCase', () => {
  it('should throw error if use case payload given comment id not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      ownerId: 'ownerId',
      threadId: 'threadId',
      commentId: 'commentId',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('COMMENT_REPOSITORY.PAYLOAD_NOT_FOUND')));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.PAYLOAD_NOT_FOUND');
    expect(mockThreadRepository.checkAvailabilityThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
  });
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      ownerId: 'ownerId',
      threadId: 'threadId',
      commentId: 'commentId',
    };
    const expectedReply = {
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.ownerId,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReply));

    /** creating use case instance */
    const getAddReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await getAddReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedReply);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      ownerId: useCasePayload.ownerId,
      commentId: useCasePayload.commentId,
    }));
  });
});
