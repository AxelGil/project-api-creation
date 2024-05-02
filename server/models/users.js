const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = function UserModelGenerator(connection) {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      lastname: DataTypes.STRING,
      firstname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: 8,
          is: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/,
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
      },
    },
    {
      sequelize: connection,
    }
  );

  User.addHook("beforeCreate", async (user) => {
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
  });
  User.addHook("beforeUpdate", async (user, options) => {
    if (options.fields.includes("password"))
      user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
  });

  return User;
};
