const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain replyId', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_REPLY_ID');
  });

  it('should throw error if use case payload not provide correct type', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 123,
      ownerId: 'ownerId',
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if use case payload not contain ownerId', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'reply-123',
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_OWNER_ID');
  });

  it('should throw error if use case payload given reply id not found', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'replyId',
      ownerId: 'ownerId',
    };

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.checkAvailabilityReply = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('REPLY_REPOSITORY.PAYLOAD_NOT_FOUND')));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REPLY_REPOSITORY.PAYLOAD_NOT_FOUND');
    expect(mockReplyRepository.checkAvailabilityReply)
      .toBeCalledWith(useCasePayload.replyId);
  });

  it('should throw error if use case payload given owner id not authorized', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'replyId',
      ownerId: 'ownerId',
    };

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.checkAvailabilityReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkOwnership = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('REPLY_REPOSITORY.PAYLOAD_FORBIDDEN')));

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REPLY_REPOSITORY.PAYLOAD_FORBIDDEN');
    expect(mockReplyRepository.checkAvailabilityReply)
      .toBeCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.checkOwnership)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.ownerId);
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replyId: 'replyId',
      ownerId: 'ownerId',
    };

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.checkAvailabilityReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkOwnership = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    // Action & Assert
    expect(mockReplyRepository.checkAvailabilityReply)
      .toHaveBeenCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.checkOwnership)
      .toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.ownerId);
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
