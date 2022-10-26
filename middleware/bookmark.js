const { literal } = require('sequelize');
const includeBookmark = (user_id, col = 'Item.item_id') => (
  [
    literal(
      `(
       SELECT COUNT(bookmark.item_id)
       FROM
         bookmarks AS bookmark
       WHERE
         bookmark.user_id = ${user_id}
         AND
         bookmark.item_id = ${col}
      )`.replace(/\s+/g, ' ')
    ),
    'Bookmark'
  ]
);

module.exports = includeBookmark;
