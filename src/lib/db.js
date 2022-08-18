const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sql.db',
    logging: console.log,
  });

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error))
// Connection

const ProductModel = sequelize.define("Product", {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Description: {
        type: DataTypes.STRING,
    },
    Price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Thumb: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Cover: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    EnvID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    timestamps: true,
})
const Ingridient = {
    type: DataTypes.STRING,
    defaultValue: "0g",
}
const Ingridients = ["TotalFat", "SaturatedFat", "TransFat", "Cholesterol", "Sodium", "Sugar", "AddedSugar", "Protein", "Fiber", "Calcium", "Iron", "VitaminA", "VitaminB", "VitaminD", "Potassium", "ServingSize"]

const NutritionalTableModel = sequelize.define("NutritionalTable", {
    ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductModel,
            key: "ID",
        },
    },
    Calories: {
        type: DataTypes.STRING,
        defaultValue: "0kcal",
    },
    ...Ingridients.reduce((obj, ing) => obj[ing] = Ingridient, {})
})
// Loading models

await sequelize.sync({ force: true });
console.log("All models were synchronized successfully.");
// Syncronizing models

module.exports = class DB {
    
}