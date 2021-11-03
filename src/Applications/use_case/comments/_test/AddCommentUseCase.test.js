const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should throw error if use case payload given comment id not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      ownerId: 'ownerId',
      threadId: 'threadId',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('THREAD_REPOSITORY.PAYLOAD_NOT_FOUND')));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('THREAD_REPOSITORY.PAYLOAD_NOT_FOUND');
    expect(mockThreadRepository.checkAvailabilityThread)
      .toBeCalledWith(useCasePayload.threadId);
  });
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      ownerId: 'ownerId',
      threadId: 'threadId',
    };
    const expectedComment = {
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.ownerId,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    /** creating use case instance */
    const getAddCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getAddCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedComment);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      ownerId: useCasePayload.ownerId,
    }));
  });
});
