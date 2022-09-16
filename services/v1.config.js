"use strict";

module.exports = function(app, routerPublic, routerPrivate)
{
	var db = app.get("db");	
	
	routerPublic.get("/", async (req, res) => {
		const EnvID = req.query.env || "DEV";
		res.json(await db.getEnvConfig(EnvID));
	})
	
}