const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist added thread and return thread correctly', async () => {
      // Arrange
      const addThread = new NewThread({
        title: 'title',
        body: 'body',
        ownerId: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });
  describe('checkAvailabilityThread function', () => {
    it('should throw error when not found', async () => {
      // Arrange
      const fakeThreadId = 'fake-thread';
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread(fakeThreadId),
      ).rejects.toThrowError(NotFoundError);
    });
  });
  describe('getThreadById function', () => {
    it('should return thread', async () => {
      const thread = await ThreadsTableTestHelper.addThread({});
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-123'),
      ).resolves.toEqual({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: thread.date,
        username: 'dicoding',
      });
    });
  });
});
