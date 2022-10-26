const Nominal = require("./model");

module.exports = {
  index: async function (req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const nominal = await Nominal.find();

      res.render("admin/nominal/view_nominal", {
        nominal,
        alert,
        title: "Halaman Nominal",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  viewCreate: async function (req, res, next) {
    try {
      res.render("admin/nominal/create", {
        title: "Halaman Tambah Nominal",
      });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async function (req, res, next) {
    try {
      const { coinName, coinQuantity, price } = req.body;
      const nominal = new Nominal({ coinName, coinQuantity, price });
      await nominal.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Create nominal success");
      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },

  viewUpdate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const nominal = await Nominal.findById(id);
      res.render("admin/nominal/edit", {
        nominal,
        title: "Halaman Edit Nominal",
      });
    } catch (err) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionUpdate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { coinName, coinQuantity, price } = req.body;
      await Nominal.findByIdAndUpdate(id, { coinName, coinQuantity, price });
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Update Nominal success");
      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionDelete: async function (req, res, next) {
    try {
      const { id } = req.params;
      await Nominal.findByIdAndDelete(id);
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Delete nominal success");
      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
};
