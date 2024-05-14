module.exports = (i18next) => {
    return function(req, res, next) {
        i18next.changeLanguage(req.headers["accept-language"]);
        res.t = i18next.t;
        next();
    }
}