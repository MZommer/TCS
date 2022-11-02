"use strict";

module.exports = function(app, routerPublic, routerPrivate)
{
	var db = app.get("db");	
	var Tempest = app.get("Tempest");
	routerPublic.get("/", Tempest.ClientMiddleware, async (req, res, next) => {
		const config = await db.getConfig(req.SpaceID).catch(next)
		res.json(config);
	})
	
}