const { Sequelize, DataTypes } = require('sequelize');
const {EnviromentModelFactory, SpaceModelFactory, ProductModelFactory, NutritionalTableModelFactory} = require("./models")
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sql.db',
    logging: null,  // TODO add a logging class cause flooding the console is not an option and we need to have a track of the sql querys
  });

sequelize.authenticate()
    .finally(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error))
// Connection

const EnviromentModel = EnviromentModelFactory(sequelize);
const SpaceModel = SpaceModelFactory(sequelize, EnviromentModel);
const ProductModel = ProductModelFactory(sequelize);
const NutritionalTableModel = NutritionalTableModelFactory(sequelize, ProductModel);
// Loading models

// TODO add the sync to foce/alter the tables for the first run of the server
sequelize.sync()
    .then(() => {if (!module.exports.getEnv("DEV")) module.exports.createEnv("DEV", "ARS", 1000).then(() => module.exports.createSpace("UAT", "DEV").then(() => console.log("DEV Enviroment created")))})
    .finally(() => console.log("All models were synchronized successfully."))
    .catch(error => console.error('Unable to synchronize the models:', error))
// Syncronizing models


// TODO Add object offuscator to not send sensible information eg: IDs
module.exports = class DB {
    static async getEnv(ID){
        return EnviromentModel.findOne({
            where: {ID},
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        });
    }
    static async getSpace(SpaceID) {
        return SpaceModel.findOne({
            where: {SpaceID},
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        });
    }
    static async getConfig(SpaceID) {
        const space = await this.getSpace(SpaceID);
        if (!space) throw new Error("Space does not exist");
        const env = await this.getEnv(space.EnvID);

        env.SpaceID = SpaceID

        return {...env, ...space};
    }
    static async createEnv(ID, Currency, InitialMoney){
        return EnviromentModel.create({ID, InitialMoney, Currency})
    }
    static async createSpace(SpaceID, EnvID){
        return SpaceModel.create({SpaceID, EnvID})
    }
    static async loadProducts(products, env, dropTable){
        function endsWithNumber(str) {
            return /[0-9]+$/.test(str);
          }
        const units = {
            Carbohydrates: "g",
            Protein: "g",
            TotalFat: "g",
            Fiber: "g",
            Sodium: "mg",
            Calcium: "mg",
            Iron: "mg",
            NetWeight: "g",
        }
        env = {
            ID: "DEV",
        }// Hard codding the env
        products.forEach(async product => {
            for (const [key, value] of Object.entries(units)) {
                if (endsWithNumber(product[key]))
                    product[key] += value;
            }
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
        if (!product) throw new Error("Error product not found")
        const NutritionalTable = await NutritionalTableModel.findOne({
            attributes: { exclude: ["id", "ProductID", "createdAt", "updatedAt"] },
            where: {ProductID},
        })

        return {
            ...product.toJSON(),
            NutritionalTable,
        }
        
    }
}
