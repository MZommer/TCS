const { DataTypes } = require('sequelize');

const Product_TPL = {
    Name: "default",
    Brand: "default",
    Description: "TBA",
    Price: 0,
    Stock: 10,
    Thumb: "generic_thumb.jpg",
    Cover: "generic_cover.jpg",
    EnvID: "DEV",
}

module.exports = sequelize => 
    sequelize.define("Product", {
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
        Stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0xffff,
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
