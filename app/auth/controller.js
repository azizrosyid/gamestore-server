const Player = require("../player/model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = {
  signup: async function (req, res, next) {
    try {
      const { email, name, username, password, favorite, phoneNumber } =
        req.body;

      const player = await Player.create({
        email,
        name,
        username,
        password,
        favorite,
        phoneNumber,
        avatar: req.file.filename,
        fileName: req.file.originalname,
      });

      delete player._doc.password;

      res.status(201).json({
        message: "Success create user",
        data: player,
      });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        res.status(422).json({
          message: error.message,
        });
      }
      next(error);
    }
  },
  signin: async function (req, res, next) {
    try {
      const { email, password } = req.body;
      const player = await Player.findOne({ email });

      if (!player) {
        return res.status(404).json({
          message: "Email or password is wrong",
        });
      }

      const isPasswordValid = bcryptjs.compareSync(password, player.password);

      if (!isPasswordValid) {
        return res.status(404).json({
          message: "Email or password is wrong",
        });
      }

      delete player._doc.password;

      const token = jwt.sign(
        {
          player: {
            id: player._id,
            email: player.email,
            name: player.name,
            username: player.username,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        },
        config.jwtSecret,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Success login",
        data: { player, token },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
};
