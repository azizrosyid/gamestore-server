const Player = require("./model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Bank = require("../bank/model");
const Transaction = require("../transaction/model");

module.exports = {
  landingPage: async function (req, res) {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({
        message: "Success get data",
        data: voucher,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
  detailPage: async function (req, res) {
    try {
      const { id } = req.params;
      console.log(await Voucher.find());
      const voucher = await Voucher.findById(id)
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      if (!voucher) {
        return res.status(404).json({
          message: `Voucher with id ${id} not found`,
        });
      }

      res.status(200).json({
        message: "Success get data",
        data: voucher,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
  category: async function (req, res) {
    try {
      const category = await Category.find().select("_id name");

      res.status(200).json({
        message: "Success get data",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
  checkout: async function (req, res) {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      const voucherData = await Voucher.findById(voucher)
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");

      console.log("voucherData", voucherData);

      if (!voucherData) {
        return res.status(404).json({
          message: `Voucher with id ${voucher} not found`,
        });
      }

      const nominalData = await Nominal.findById(nominal);

      console.log("nominalData", nominalData);

      if (!nominalData) {
        return res.status(404).json({
          message: `Nominal with id ${nominal} not found`,
        });
      }

      const paymentData = await Payment.findById(payment);

      console.log("paymentData", paymentData);

      if (!paymentData) {
        return res.status(404).json({
          message: `Payment with id ${payment} not found`,
        });
      }

      const bankData = await Bank.findById(bank);

      console.log("bankData", bankData);

      if (!bankData) {
        return res.status(404).json({
          message: `Bank with id ${bank} not found`,
        });
      }

      const tax = (10 / 100) * nominalData.price;
      const value = nominalData.price - tax;

      const payloadTransaction = {
        historyVoucherTopup: {
          gameName: voucherData.name,
          category: voucherData.category.name,
          thumbnail: voucherData.thumbnail,
          coinName: nominalData.coinName,
          coinQuantity: nominalData.coinQuantity,
          price: nominalData.price,
        },
        historyPayment: {
          name: bankData.accountName,
          type: paymentData.type,
          bankName: bankData.bankName,
          accountNumber: bankData.accountNumber,
        },
        name: name,

        accountUser: accountUser,

        tax: tax,

        value: value,

        player: req.player?._id,

        category: voucherData.category._id,

        user: voucherData.user?._id,

        historyUser: {
          name: voucherData.user?.name,
          phoneNumber: voucherData.user?.phoneNumber,
        },
      };

      const transaction = await Transaction.create(payloadTransaction);
      await transaction.save();

      res.status(200).json({
        message: "Success get data",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
        stack: error.stack,
      });
    }
  },
  history: async function (req, res) {
    try {
      const { status = "" } = req.query;

      let criteria = {};

      if (status && req.player) {
        criteria = {
          ...criteria,
          status: { $regex: status, $options: "i" },
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria).populate("category");
      const totalValue = await Transaction.aggregate([
        {
          $match: criteria,
        },
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$historyVoucherTopup.price" },
          },
        },
      ]);

      res.status(200).json({
        message: "Success get data",
        data: history,
        totalValue: totalValue[0]?.totalValue,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
  detailHistory: async function (req, res) {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findById(id);

      if (transaction.player.toString() !== req.player._id.toString()) {
        console.log(transaction.user, req.player._id);
        return res.status(403).json({
          message: "Forbidden",
        });
      }

      if (!transaction) {
        return res.status(404).json({
          message: `Transaction with id ${id} not found`,
        });
      }

      res.status(200).json({
        message: "Success get data",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
  dashboard: async function (req, res) {
    try {
      const count = await Transaction.aggregate([
        {
          $match: {
            player: req.player._id,
          },
        },
        {
          $group: {
            _id: "$category",
            category: { $first: "$historyVoucherTopup.category" },
            count: { $sum: "$historyVoucherTopup.price" },
          },
        },
      ]);

      // last 5 transaction
      const lastTransaction = await Transaction.find({
        player: req.player._id,
      })
        .sort({ createdAt: -1 })
        .limit(5);

      res.status(200).json({
        message: "Success get data",
        data: {
          count,
          lastTransaction,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
  getPlayer: async function (req, res) {
    try {
      const player = await Player.findById(req.player._id).select("-password");
      res.status(200).json({
        message: "Success get data",
        data: player,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
  editPlayer: async function (req, res) {
    try {
      const { name = "", phoneNumber = "" } = req.body;
      const payload = {};

      if (name.trim()) payload.name = name;
      if (phoneNumber.trim()) payload.phoneNumber = phoneNumber;

      if (req.file) payload.avatar = req.file.path;

      const player = await Player.findByIdAndUpdate(req.player._id, payload, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.status(200).json({
        message: "Success get data",
        data: player,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  },
};
