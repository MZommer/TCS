const { DataTypes } = require('sequelize');

const Ingridients = ["TotalFat", "SaturatedFat", "TransFat", "Cholesterol", "Sodium", "Sugar", "AddedSugar", "Protein", "Fiber", "Calcium", "Iron", "VitaminA", "VitaminB", "VitaminD", "Potassium", "ServingSize", "Carbohydrates", "NetWeight"]

const NutritionalTable_TPL = {
    ProductID: null,
    Calories:  "0kcal",
    ...Ingridients.reduce((obj, ing) => {obj[ing] = "0g"; return obj}, {}),
}
module.exports = (sequelize, ProductModel) =>
    sequelize.define("NutritionalTable", {
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ProductModel,
                key: 'ID',
            },
        },
        Calories: {
            type: DataTypes.STRING,
            defaultValue: '0kcal',
        },
        TotalFat: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        SaturatedFat: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        TransFat: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        Cholesterol: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        Sodium: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        Sugar: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        AddedSugar: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        Protein: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        Fiber: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        Calcium: {
            type: DataTypes.STRING,
            defaultValue: '0mg',
        },
        Iron: {
            type: DataTypes.STRING,
            defaultValue: '0mg',
        },
        VitaminA: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        VitaminB: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        VitaminD: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        Potassium: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        Carbohydrates: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        ServingSize: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
        NetWeight: {
            type: DataTypes.STRING,
            defaultValue: '0g',
        },
    })