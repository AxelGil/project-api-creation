module.exports = function apiVersions(versions, defaultVersion){
    return (req, res, next) => {
        const apiVersion = req.headers['accept-version'] || defaultVersion;
        if (!versions[apiVersion]) {
            return res.status(400).send("Version d'API non prise en charge");
        }
        versions[apiVersion](req, res);
    };
};