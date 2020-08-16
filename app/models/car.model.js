module.exports = (sequelize, Sequelize) => {
  const Cars = sequelize.define("cars", {
    model: {
      type: Sequelize.STRING
    },
    color: {
      type: Sequelize.STRING
    },
  });

  return Cars;
};
