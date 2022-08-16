"use strict";
const XLSX = require("XLSX");

module.exports = function(app, routerPublic, routerPrivate)
{
	var upload = app.get("upload");
	var db = app.get("db");	
	routerPublic.post(["/upload/xlsx", "/upload/csv"], upload.single("sheet"), (req, res) => {
		const wb = XLSX.read(req.file.buffer);
		const data = wb.SheetNames.map(SheetName => XLSX.utils.sheet_to_json(wb.Sheets[SheetName]));
		data.forEach(sheet => db.loadProducts(sheet));
		res.send(200);
	});

	
}