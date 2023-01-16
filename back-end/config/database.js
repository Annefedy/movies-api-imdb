const config = require("../knexfile");
const knex = require("knex")(config);
const { Model } = require("objection");

Model.knex(knex);
module.exports = knex;