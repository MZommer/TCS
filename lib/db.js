const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sql.db',
    logging: null,  // TODO add a logging class cause flooding the console is not an option and we need to have a track of the sql querys
  });

sequelize.authenticate()
    .finally(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error))
// Connection
const EnviromentModel = sequelize.define("Envirement", {
    ID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    InitialMoney: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Currency: {
        type: DataTypes.STRING,
        defaultValue: 'ARS',
    },
})

const SpaceModel = sequelize.define("Envirement", {
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
})
// Enviroments and Spaces Not implemented yet

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

const Ingridients = ["TotalFat", "SaturatedFat", "TransFat", "Cholesterol", "Sodium", "Sugar", "AddedSugar", "Protein", "Fiber", "Calcium", "Iron", "VitaminA", "VitaminB", "VitaminD", "Potassium", "ServingSize"]

const NutritionalTableModel = sequelize.define("NutritionalTable",{
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
        defaultValue: '0g',
    },
    Iron: {
        type: DataTypes.STRING,
        defaultValue: '0g',
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
    ServingSize: {
        type: DataTypes.STRING,
        defaultValue: '0g',
    }
})
// Loading models

// TODO add the sync to foce/alter the tables for the first run of the server
sequelize.sync()
    .finally(() => console.log("All models were synchronized successfully."))
    .catch(error => console.error('Unable to synchronize the models:', error))
// Syncronizing models

const Product_TPL = {
    Name: "default",
    Brand: "default",
    Description: "TBA",
    Price: 0,
    Thumb: 0,
    Cover: "generic_cover.jpg",
    EnvID: "DEV",
}

const NutritionalTable_TPL = {
    ProductID: null,
    Calories:  "0kcal",
    ...Ingridients.reduce((obj, ing) => {obj[ing] = "0g"; return obj}, {}),
}
// Define Templates


// TODO Add object offuscator to not send sensible information eg: IDs
module.exports = class DB {
    static async loadProducts(products, env){
        env = {
            ID: "DEV",
        }// Hard codding the env
        products.forEach(async product => {
            // TODO Add merging to the template
            product.EnvID = env.ID
            const _product = await ProductModel.create(product).catch(console.error)
            product.ProductID = _product.ID
            const _ingridients = await NutritionalTableModel.create(product).catch(console.error)
        })
    }
    static async getProducts(EnvID){
        return ProductModel.findAll({
            attributes: { exclude: ["createdAt", "updatedAt", "EnvID"] },
            where: {EnvID},
        })
    }
    static async getProductDetails(EnvID, ProductID){
        const product = await ProductModel.findOne({
            attributes: { exclude: ["ID", "createdAt", "updatedAt", "EnvID"] },
            where: {EnvID, ID: ProductID},
        })
        const NutritionalTable = await NutritionalTableModel.findOne({
            attributes: { exclude: ["ProductID", "createdAt", "updatedAt"] },
            where: {ProductID},
        })

        return {
            ...product.toJSON(),
            NutritionalTable,
        }
        
    }
}