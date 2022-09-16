"use strict";

module.exports = function(app, routerPublic, routerPrivate)
{
	var db = app.get("db");	
	
	routerPublic.get("/", async (req, res) => {
		const SpaceID = req.query.spaceid || "UAT";
		res.json(await db.getConfig(EnvID));
	})
	
}