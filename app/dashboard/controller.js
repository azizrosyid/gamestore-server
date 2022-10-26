const Transaction = require("../transaction/model");
const Category = require("../category/model");
const Player = require("../player/model");
const Voucher = require("../voucher/model");

module.exports = {
  index: async function (req, res, next) {
    const transaction = await Transaction.countDocuments();
    const category = await Category.countDocuments();
    const voucher = await Voucher.countDocuments();
    const player = await Player.countDocuments();

    res.render("admin/dashboard/view_dashboard", {
      name: req.session.user.name,
      title: "Halaman Dashboard",
      count: {
        transaction,
        category,
        voucher,
        player,
      },
    });
  },
};
