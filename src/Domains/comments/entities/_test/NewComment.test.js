const NewComment = require('../NewComment');

describe('NewThread entities', () => {
  it('should throw error when not contain owner id', () => {
    // Arrange
    const payload = {
      content: 'content',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_LOGIN');
  });
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      ownerId: 'ownerId',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      ownerId: 'title',
      threadId: 'threadId',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      ownerId: 'ownerId',
      threadId: 'threadId',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.ownerId).toEqual(payload.ownerId);
  });
});
