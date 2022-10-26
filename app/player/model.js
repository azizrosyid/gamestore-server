const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your email"],
    },
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    username: {
      type: String,
      required: [true, "Please enter your username"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    avatar: {
      type: String,
      default: "default.jpg",
    },
    fileName: {
      type: String,
      default: "default.jpg",
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

playerSchema.path("email").validate(async (value) => {
  const emailCount = await mongoose.models.Player.countDocuments({
    email: value,
  });
  return !emailCount;
}, "Email already exists");

playerSchema.pre("save", function (next) {
  this.password = bcryptjs.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("Player", playerSchema);
