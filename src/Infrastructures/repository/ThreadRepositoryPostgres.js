const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, ownerId } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, date',
      values: [id, ownerId, title, body, date],
    };

    const result = await this._pool.query(query);

    const queryUsername = {
      text: 'select username from users where id = $1',
      values: [ownerId],
    };

    return {
      id,
      title,
      owner: ownerId,
    };
  }
}

module.exports = ThreadRepositoryPostgres;
