const { User } = require("../models");

module.exports = {
  cget: async (req, res, next) => {
    const users = await User.findAll();
    res.status(200).json(users);
  },
  post: async (req, res, next) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
  iget: async (req, res, next) => {
    const user = await User.findByPk(req.params.id);
    if (user) res.json(user);
    else res.sendStatus(404);
  },
  patch: async (req, res, next) => {
    // UPDATE table SET col=value WHERE col=value RETURNING *;
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const [_, users] = await User.update(req.body, {
        where: {
          id: req.params.id,
        },
        individualHooks: true,
        returning: true,
      });

      if (users.length) res.json(users[0]);
      else res.sendStatus(404);
    } catch (error) {
      next(error);
    }
  },
  put: async (req, res, next) => {
    const nbDeleted = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    try {
      req.body.id = req.params.id;
      const user = await User.create(req.body);
      res.status(!nbDeleted ? 201 : 200).json(user);
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    const nbDeleted = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!nbDeleted) res.sendStatus(404);
    else res.sendStatus(204);
  },
};
