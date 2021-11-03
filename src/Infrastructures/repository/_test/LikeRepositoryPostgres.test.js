const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterAll(async () => {
    await LikesTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  const ownerId = 'user-123';
  const commentId = 'comment-123';

  describe('getLikesByCommentId function', () => {
    it('should get like count', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      expect(likeRepositoryPostgres.getLikesByCommentId(commentId)).resolves.toEqual(0);
    });
  });

  describe('addLike function', () => {
    it('should persist added like', async () => {
      // Arrange
      const payload = {
        ownerId,
        commentId,
      };

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(payload);

      // Assert
      expect(likeRepositoryPostgres.getLikesByCommentId(commentId)).resolves.toEqual(1);
    });
    describe('checkHasLiked function on liked', () => {
      it('should return true when comment is liked', async () => {
        const fakeIdGenerator = () => '123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        return expect(likeRepositoryPostgres.checkHasLiked(commentId, ownerId))
          .resolves
          .toEqual(true);
      });
    });
  });
  describe('deleteLike function', () => {
    it('should delete liked comment', async () => {
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.deleteLike(commentId, ownerId);

      expect(likeRepositoryPostgres.getLikesByCommentId(commentId)).resolves.toEqual(0);
    });
    describe('checkHasLiked function on unliked', () => {
      it('should return false when comment unliked', async () => {
        const fakeIdGenerator = () => '123'; // stub!
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

        return expect(likeRepositoryPostgres.checkHasLiked(commentId, ownerId))
          .resolves
          .toEqual(false);
      });
    });
  });
});
