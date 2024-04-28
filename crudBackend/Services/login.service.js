const db = require('../db');


module.exports = class User {
    constructor(username, password, role) {
      this.username = username;
      this.password = password;
      this.role = role;
    }

    static find(username) {
        return db.execute('SELECT * FROM users WHERE username = ?', [username]);
      }

      static save(user) {
        return db.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [user.username, user.password, user.role]
        );
      }
};



module.exports.deleteUser = async (id) => {
  const [{ affectedRows }] = await db.query("DELETE FROM users WHERE id = ?", [id])
  return affectedRows;
}



