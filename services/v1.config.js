"use strict";

module.exports = function(app, routerPublic, routerPrivate)
{
	var db = app.get("db");	
	var Tempest = app.get("Tempest");
	routerPublic.get("/", async (req, res, next) => {
		const config = await db.getConfig(req.query.SpaceID).catch(err => res.send(401))
		res.json(config);
	})

	routerPublic.post("/createEnv", async (req, res, next) => {
		await db.createEnv(req.query.EnvID).catch(err => res.send(401))
	})
	routerPublic.post("/createSpace", async (req, res, next) => {
		await db.createSpace(req.body).catch(err => res.send(401))
	})
	
}