import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({
  path: "server/.env",
});
const sellerSchema = new Schema(
  {
    s_username: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      index: true,
    },
    s_email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    s_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    s_address: {
      type: String,
      required: true,
    },
    s_shopName: {
      type: String,
      required: true,
    },
    s_avatar: {
      type: String,
      required: true,
    },
    s_coverImage: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

sellerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

sellerSchema.methods.generateAccessToken = function () {
  // const exin=process.env.ACCESS_TOKEN_EXPIREY;
  // console.log(exin, process.env.ACCESS_TOKEN_EXPIREY);

  return jwt.sign(
    {
      //  data to add in token
      _id: this._id,
      s_email: this.s_email,
      s_username: this.s_username,
      s_name: this.s_name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIREY,
    }
  );
};

sellerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      //  data to add in token
      _id: this._id,
    },
    process.env.REFERSH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFERSH_TOKEN_EXPIRY,
    }
  );
};

export const Seller = mongoose.model("Seller", sellerSchema);
