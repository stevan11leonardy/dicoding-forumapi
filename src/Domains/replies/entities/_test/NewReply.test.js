const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error when not contain owner id', () => {
    // Arrange
    const payload = {
      content: 'content',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_LOGIN');
  });
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      ownerId: 'ownerId',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      ownerId: 'title',
      commentId: 'commentId',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply entities correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      ownerId: 'ownerId',
      commentId: 'commentId',
    };

    // Action
    const newComment = new NewReply(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewReply);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.ownerId).toEqual(payload.ownerId);
    expect(newComment.commentId).toEqual(payload.commentId);
  });
});
