const { DataTypes } = require('sequelize');

module.exports = sequelize => 
    sequelize.define("Enviroment", {
        ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        Currency: {
            type: DataTypes.STRING,
            defaultValue: 'ARS',
        },
    })
