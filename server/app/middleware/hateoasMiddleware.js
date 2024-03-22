module.exports = function hateoasMiddleware(itemhateoas) {
    return (req, res, next) => {
      const baseUrl =
        req.protocol + "://" + req.get("host") + "" + req.originalUrl;
      const links = Object.entries(itemhateoas)
        .map(([key, value]) => {
          const link = {
            rel: key,
          };
          let path;
          if (typeof value === "boolean") {
            switch (key) {
              case "self":
                link.method = "GET";
                path = baseUrl;
                break;
              case "all":
                link.method = "GET";
                path = baseUrl.replace(/\/[^/]+$/, "");
                break;
            }
          } else if (typeof value === "object") {
            link.method = value.method;
            link.type = value.method;
            path = baseUrl + value.path;
          } else if (typeof value === "string") {
            link.method = "GET";
            path = baseUrl + value;
          }
          link.path = path;
          let result = "<" + link.path + '>; rel="' + link.rel + '"';
          if (link.type) {
            result += '; type="' + link.type + '"';
          }
          return result;
        })
        .join(", ");
      res.setHeader("Link", links);
      next();
    };
  };
  