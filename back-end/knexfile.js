const credentials = require ("./config/db_config")
module.exports = {
      client: "mysql",
      connection: {
        database: credentials.database,
        user: credentials.user,
        password: credentials.password,
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: "movies_imdb"
      }
    };