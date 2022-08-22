"use strict";
const XLSX = require("xlsx");

module.exports = function(app, routerPublic, routerPrivate)
{
	var upload = app.get("upload");
	var db = app.get("db");	
	routerPublic.post(["/upload/xlsx", "/upload/csv"], upload.single("sheet"), (req, res) => {
		const wb = XLSX.read(req.file.buffer);
		const data = wb.SheetNames.map(SheetName => XLSX.utils.sheet_to_json(wb.Sheets[SheetName]));
		data.forEach(sheet => db.loadProducts(sheet));
		res.sendStatus(200);
	});

	routerPublic.get("/", async (req, res) => {
		const env = req.query.env || "DEV" // by now we getting like this the env, to implement the TempestENV and the authentication lib
		const products = await db.getProducts(env)
		res.send(products)
	})

	routerPublic.get("/:id", async (req, res) {
		const env = req.query.env || "DEV" // by now we getting like this the env, to implement the TempestENV and the authentication lib
		const productid = req.params.id
		const product = await db.getProductDetails(env, productid)
		res.send(product)
	})
	
}