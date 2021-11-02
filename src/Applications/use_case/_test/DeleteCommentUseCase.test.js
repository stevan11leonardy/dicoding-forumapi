const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain commentId', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
  });

  it('should throw error if use case payload not provide correct type', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 123,
      ownerId: 'ownerId',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if use case payload not contain ownerId', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_OWNER_ID');
  });

  it('should throw error if use case payload given comment id not found', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'commentId',
      ownerId: 'ownerId',
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('COMMENT_REPOSITORY.PAYLOAD_NOT_FOUND')));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.PAYLOAD_NOT_FOUND');
    expect(mockCommentRepository.checkAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
  });

  it('should throw error if use case payload given owner id not authorized', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'commentId',
      ownerId: 'ownerId',
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkOwnership = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('COMMENT_REPOSITORY.PAYLOAD_FORBIDDEN')));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('COMMENT_REPOSITORY.PAYLOAD_FORBIDDEN');
    expect(mockCommentRepository.checkAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkOwnership)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.ownerId);
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'commentId',
      ownerId: 'ownerId',
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkOwnership = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    // Action & Assert
    expect(mockCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkOwnership)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.ownerId);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
