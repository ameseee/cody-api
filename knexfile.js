module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/rides',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true,
    seeds: {
      directory: './data/seeds'
    }
  }

};

