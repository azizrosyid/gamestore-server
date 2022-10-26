const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");

module.exports = {
  index: async function (req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const voucher = await Voucher.find()
        .populate("category")
        .populate("nominals");

      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
        title: "Halaman Voucher",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  viewCreate: async function (req, res, next) {
    try {
      const category = await Category.find();
      const nominal = await Nominal.find();
      res.render("admin/voucher/create", {
        category,
        nominal,
        title: "Halaman Tambah Voucher",
      });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async function (req, res, next) {
    try {
      const { name, category, nominals } = req.body;
      console.log(req.session.user);
      const image = req.file.filename;
      const voucher = new Voucher({
        name,
        category,
        thumbnail: image,
        nominals,
        user: req.session.user.id,
      });
      await voucher.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Create nominal success");
      res.redirect("/voucher");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },

  viewUpdate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.find();
      const nominal = await Nominal.find();
      const voucher = await Voucher.findById(id)
        .populate("category")
        .populate("nominals");
      res.render("admin/voucher/edit", {
        voucher,
        category,
        nominal,
        title: "Halaman Edit Voucher",
      });
    } catch (err) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionUpdate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;
      const voucher = await Voucher.findById(id);
      voucher.name = name;
      voucher.category = category;
      voucher.nominals = nominals;

      if (req.file) {
        const image = req.file.filename;
        voucher.thumbnail = image;
      }

      await voucher.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Update voucher success");
      res.redirect("/voucher");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionDelete: async function (req, res, next) {
    try {
      const { id } = req.params;
      await Voucher.findByIdAndDelete(id);

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Delete voucher success");
      res.redirect("/voucher");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionStatus: async function (req, res, next) {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findById(id);
      const newStatus = voucher.status === "Y" ? "N" : "Y";
      voucher.status = newStatus;
      await voucher.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Update voucher success");
      res.redirect("/voucher");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
};
