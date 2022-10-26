const mongoose = require("mongoose");
const nominalSchema = mongoose.Schema(
  {
    coinQuantity: {
      type: Number,
      default: 0,
    },
    coinName: {
      type: String,
      required: [true, "Name coin is required"],
    },
    price: {
      type: Number,
      required: [true, "Price coin is required"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Nominal", nominalSchema);
