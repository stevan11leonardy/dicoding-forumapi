const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads where id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('thread tidak tersedia');
    }
  }

  async addThread(newThread) {
    const { title, body, ownerId } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, ownerId, title, body, date],
    };

    await this._pool.query(query);

    return {
      id,
      title,
      owner: ownerId,
    };
  }
}

module.exports = ThreadRepositoryPostgres;
