const mongoose = require("mongoose");
const voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama game harus diisi"],
    },
    status: {
      type: String,
      enum: {
        values: ["Y", "N"],
      },
      default: "Y",
    },
    thumbnail: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    nominals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nominal",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voucher", voucherSchema);
