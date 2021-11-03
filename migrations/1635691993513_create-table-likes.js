/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'likes',
    'fk_likes.users.id',
    'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'likes',
    'fk_likes.comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes.comments.id');
  pgm.dropConstraint('likes', 'fk_likes.users.id');
  pgm.dropTable('likes');
};
