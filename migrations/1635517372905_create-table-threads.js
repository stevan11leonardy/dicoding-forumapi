/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'DATE',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'threads',
    'fk_threads.users.id',
    'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('threads', 'fk_threads.users.id');
  pgm.dropTable('threads');
};
