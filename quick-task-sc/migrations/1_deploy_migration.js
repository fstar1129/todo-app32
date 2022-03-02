//** Initial Migrate Script */
require("dotenv").config();

const todo = artifacts.require("todo");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(todo);
};




