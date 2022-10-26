const jwt = require("jsonwebtoken");
const config = require("../../config");
const Player = require("../player/model");

module.exports = {
  isLoginAdmin: async function (req, res, next) {
    try {
      if (req.session.user == null || req.session.user == undefined) {
        req.flash(
          "alertMessage",
          "Your session is expired. Please login again"
        );
        req.flash("alertStatus", "danger");
        res.redirect("/");
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
    }
  },
  isLoginPlayer: async function (req, res, next) {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : null;

      if (token) {
        const decoded = jwt.verify(token, config.jwtSecret);
        const player = await Player.findOne({ _id: decoded.player.id });

        if (!player) {
          return res.status(404).json({
            message: `Player with id ${decoded.id} not found`,
          });
        }
        req.player = player;
        next();
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({
        message: "You are not authorized",
      });
    }
  },
};
