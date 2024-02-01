const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return v.toString().length >= 10;
        },
        message: "myNumber must have at least 10 digits",
      },
      required: [true, "Please enter your phone number"],
    },

    password: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    role: { type: String, enum: ["CREATOR", "VIEW_ALL"], default: "VIEW_ALL" },
    
    books : [{type: mongoose.Schema.Types.ObjectId, ref : "book", }]
  },
  { timestamps: true }
);

const User = new mongoose.model("user", userSchema);

module.exports = { User };
