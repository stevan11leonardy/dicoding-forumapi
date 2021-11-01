const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  const commentId = 'comment-123';

  describe('addReply function', () => {
    it('should persist added reply and return reply correctly', async () => {
      // Arrange
      const addReply = new NewReply({
        content: 'content',
        ownerId: 'user-123',
        commentId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply.id).toStrictEqual('reply-123');
      expect(addedReply.content).toStrictEqual('content');
      expect(addedReply.owner).toStrictEqual('user-123');
    });
  });
  describe('deleteReply function', () => {
    it('should change added reply is_delete to true', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.deleteReply('reply-123');

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toEqual(true);
    });
  });
  describe('checkAvailabilityReply function', () => {
    it('should throw error when reply not found', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      return expect(replyRepositoryPostgres.checkAvailabilityReply('reply-fake'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw error when reply is found', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      return expect(replyRepositoryPostgres.checkAvailabilityReply('reply-123'))
        .resolves
        .not.toThrowError(NotFoundError);
    });
  });

  describe('checkOwnership function', () => {
    it('should throw error when not own the comment', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      return expect(replyRepositoryPostgres.checkOwnership('reply-123', 'user-fake'))
        .rejects
        .toThrowError(AuthorizationError);
    });
    it('should not throw error when not own the comment', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      return expect(replyRepositoryPostgres.checkOwnership('reply-123', 'user-123'))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return comment replies', async () => {
      await RepliesTableTestHelper.cleanTable();
      const result = await RepliesTableTestHelper.addReplies({});

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(commentId);
      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({
        id: 'reply-123',
        content: 'content',
        username: 'dicoding',
        date: result.date,
      });
    });
    it('should return deleted comment replies', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.deleteReply('reply-123');

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(commentId);
      expect(replies).toHaveLength(1);
      expect(replies[0].content).toEqual('**balasan telah dihapus**');
    });
  });
});
