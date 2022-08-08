"use strict";

module.exports = function(app, routerPublic, routerPrivate)
{
	var db = app.get("db");
	routerPublic.get("/", (req, res) => {
		console.log("AER")
		res.json([]);
	});

	
}