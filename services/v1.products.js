"use strict";
const XLSX = require("xlsx");

module.exports = function(app, routerPublic, routerPrivate) {
    var upload = app.get("upload");
    var db = app.get("db");
    var Tempest = app.get("Tempest");

    routerPublic.post(["/upload/xlsx", "/upload/csv"], upload.single("sheet"), (req, res) => {
        const dropTable = req.query.dropTable || true;
        const wb = XLSX.read(req.file.buffer);
        const data = wb.SheetNames.map(SheetName => XLSX.utils.sheet_to_json(wb.Sheets[SheetName]));
        data.forEach(sheet => db.loadProducts(sheet, null, dropTable));
        res.sendStatus(200);
    });

    routerPublic.get("/", Tempest.ClientMiddleware, async (req, res, next) => {
        const products = await db.getProducts(req.EnvID).catch(console.error)
        res.send(products)
    })

    routerPublic.get("/:id", Tempest.ClientMiddleware, async (req, res, next) => {
        const productid = req.params.id
        const product = await db.getProductDetails(req.EnvID, productid).catch(next)
        res.send(product)
    })

}