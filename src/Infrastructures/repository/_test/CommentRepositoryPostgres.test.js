const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist added comment and return comment correctly', async () => {
      // Arrange
      const addComment = new NewComment({
        content: 'content',
        ownerId: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });
  });
  describe('deleteComment function', () => {
    it('should change added comment is_delete to true', async () => {
      const addComment = new NewComment({
        content: 'content',
        ownerId: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const { id: commentId } = await commentRepositoryPostgres.addComment(addComment);
      await commentRepositoryPostgres.deleteComment(commentId);

      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });
  describe('checkAvailabilityComment function', () => {
    it('should throw error when comment not found', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      return expect(commentRepositoryPostgres.checkAvailabilityComment('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw error when comment is found', async () => {
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      return expect(commentRepositoryPostgres.checkAvailabilityComment('comment-123'))
        .resolves
        .not.toThrowError(NotFoundError);
    });
  });

  describe('checkOwnership function', () => {
    it('should throw error when not own the comment', async () => {
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      return expect(commentRepositoryPostgres.checkOwnership('comment-123', 'user-fake'))
        .rejects
        .toThrowError(AuthorizationError);
    });
    it('should not throw error when not own the comment', async () => {
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      return expect(commentRepositoryPostgres.checkOwnership('comment-123', 'user-123'))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });
});
