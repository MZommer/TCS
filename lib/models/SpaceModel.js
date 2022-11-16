const { DataTypes } = require('sequelize');
module.exports = (sequelize, EnviromentModel) =>
    sequelize.define("Space", {
        SpaceID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        EnvID: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: EnviromentModel,
                key: 'ID',
            },
        },
        InitialMoney: {
            type: DataTypes.INTEGER,
            defaultValue: 1000
        },
        VCT: {
            type: DataTypes.INTEGER,
            defaultValue: 2000
        },

    })