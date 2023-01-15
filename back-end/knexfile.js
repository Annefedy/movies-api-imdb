module.exports = {
      client: "mysql",
      connection: {
        database: "movies",
        user: "root",
        password: "",
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: "movies_imdb"
      }
    };