module.exports = class Tempest {
    static ClientMiddleware (req, res, next) {
        req.EnvID = req.headers.X_EnvID || req.params.EnvID || req.params.Env || "DEV";
        req.SpaceID = req.headers.X_SpaceID || req.params.SpaceID || req.params.Space || "UAT";
        next();
    }
}