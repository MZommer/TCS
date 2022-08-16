"use strict";
const XLSX = require("XLSX");

module.exports = function(app, routerPublic, routerPrivate)
{
	var upload = app.get("upload");
	routerPublic.post("/", upload.single("sheet"), (req, res) => {
		const wb = XLSX.read(req.file.buffer);
		const data = wb.SheetNames.map(SheetName => XLSX.utils.sheet_to_json(wb.Sheets[SheetName]));
		res.send(200);
	});

	
}