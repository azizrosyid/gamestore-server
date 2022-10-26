const Bank = require("./model");

module.exports = {
  index: async function (req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const bank = await Bank.find();

      res.render("admin/bank/view_bank", {
        bank,
        alert,
        title: "Halaman Bank",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  viewCreate: async function (req, res, next) {
    try {
      res.render("admin/bank/create", {
        title: "Halaman Tambah Bank",
      });
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async function (req, res, next) {
    try {
      const { accountName, bankName, accountNumber } = req.body;
      const bank = new Bank({ accountName, bankName, accountNumber });
      await bank.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Create bank success");
      res.redirect("/bank");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  viewUpdate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const bank = await Bank.findById(id);
      res.render("admin/bank/edit", { bank, title: "Halaman Edit Bank" });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionUpdate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { accountName, bankName, accountNumber } = req.body;
      await Bank.findByIdAndUpdate(id, {
        accountName,
        bankName,
        accountNumber,
      });

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Update bank success");
      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionDelete: async function (req, res, next) {
    try {
      const { id } = req.params;
      await Bank.findByIdAndDelete(id);
      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Delete bank success");
      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
};
