module.exports = (i18next) => {
    return function (req, res, next) {
      const language = req.headers["accept-language"];
  
      if (language) {
        i18next.changeLanguage(language)
          .then(() => {
            res.t = i18next.t.bind(i18next);
            next();
          })
          .catch(err => {
            console.error('Error changing language:', err);
            next(err);
          });
      } else {
        console.warn('Accept-Language header is missing');
        res.t = i18next.t.bind(i18next);
        next();
      }
    }
  }
  