const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres", 
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Synchronize models
    // await sequelize.sync({ alter: true }); // Use `force: true` to drop and recreate tables during dev
    // console.log("Models synchronized successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

module.exports = sequelize;
