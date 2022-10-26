const Transaction = require("./model");

module.exports = {
  index: async function (req, res, next) {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const transaction = await Transaction.find().populate("player");

      res.render("admin/transaction/view_transaction", {
        transaction,
        alert,
        title: "Halaman Payment",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      console.log(error);
      res.redirect("/");
    }
  },
  actionStatus: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.query;

      const transaction = await Transaction.findOne({ _id: id });
      transaction.status = status;

      await transaction.save();

      req.flash("alertStatus", "success");
      req.flash("alertMessage", "Success update status");
      res.redirect("/transaction");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  // viewCreate: async function (req, res, next) {
  //   try {
  //     const banks = await Bank.find();
  //     res.render("admin/payment/create", {
  //       banks,
  //       title: "Halaman Tambah Payment",
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // actionCreate: async function (req, res, next) {
  //   try {
  //     const { type, banks } = req.body;
  //     const payment = new Payment({ type, status: "Y", banks });
  //     await payment.save();

  //     req.flash("alertStatus", "success");
  //     req.flash("alertMessage", "Create payment success");
  //     res.redirect("/payment");
  //   } catch (err) {
  //     req.flash("alertMessage", `${err.message}`);
  //     req.flash("alertStatus", "danger");
  //     res.redirect("/payment");
  //   }
  // },

  // viewUpdate: async function (req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const payment = await Payment.findById(id).populate("banks");
  //     const banks = await Bank.find();
  //     res.render("admin/payment/edit", {
  //       payment,
  //       banks,
  //       title: "Halaman Edit Payment",
  //     });
  //   } catch (err) {
  //     req.flash("alertMessage", `${error.message}`);
  //     req.flash("alertStatus", "danger");
  //     res.redirect("/nominal");
  //   }
  // },
  // actionUpdate: async function (req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const { type, banks } = req.body;
  //     await Payment.findByIdAndUpdate(id, { type, banks });
  //     req.flash("alertStatus", "success");
  //     req.flash("alertMessage", "Update Nominal success");
  //     res.redirect("/payment");
  //   } catch (err) {
  //     req.flash("alertMessage", `${err.message}`);
  //     req.flash("alertStatus", "danger");
  //     res.redirect("/payment");
  //   }
  // },
  // actionDelete: async function (req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     await Payment.findByIdAndDelete(id);
  //     req.flash("alertStatus", "success");
  //     req.flash("alertMessage", "Delete payment success");
  //     res.redirect("/payment");
  //   } catch (err) {
  //     req.flash("alertMessage", `${err.message}`);
  //     req.flash("alertStatus", "danger");
  //     res.redirect("/payment");
  //   }
  // },
};
