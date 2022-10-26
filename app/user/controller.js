const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async function (req, res, next) {
    try {
      if (req.session.user) {
        res.redirect("/dashboard");
      }

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render("admin/users/view_signin", {
        alert,
        title: "Halaman Signin",
      });
    } catch (err) {
      console.log(err);
    }
  },
  actionSignin: async function (req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (!user) {
        req.flash("alertMessage", "User not found");
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }

      if (user.status === "N") {
        req.flash("alertMessage", "User is not active");
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        req.flash("alertMessage", "Wrong password");
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }

      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        phoneNumber: user.phoneNumber,
      };

      req.flash("alertMessage", "Success login");
      req.flash("alertStatus", "success");
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
  actionLogout: async function (req, res, next) {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
};
