const Category = require("./model");

module.exports = {
  index: async function (req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const category = await Category.find();

      console.log(alert);
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Halaman Category",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
  viewCreate: async function (req, res, next) {
    try {
      res.render("admin/category/create", {
        title: "Halaman Tambah Category",
      });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async function (req, res, next) {
    try {
      const { name } = req.body;
      const category = new Category({ name });
      await category.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Create category success");
      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  viewUpdate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      res.render("admin/category/edit", {
        category,
        title: "Halaman Edit Category",
      });
    } catch (err) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
  actionUpdate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Category.findByIdAndUpdate(id, { name });
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Update category success");
      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
  actionDelete: async function (req, res, next) {
    try {
      const { id } = req.params;
      await Category.findByIdAndDelete(id);
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Delete category success");
      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
};
