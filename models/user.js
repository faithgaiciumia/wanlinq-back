import mongoose from "mongoose";
import { composeWithMongoose } from "graphql-compose-mongoose";
import { Schema, model } from "mongoose";

const LinkSchema = new Schema(
  {
    siteName: String,
    siteLink: String,
  },
  { timestamps: true }
);
const UserSchema = new Schema({
  links: [LinkSchema],
  name: String,
  email: String,
  profileURL: String,
  themeColor: String,
  isPublic: { type: Boolean, default: true },
  bio: String,
});

const User = model("User", UserSchema);

const UserTC = composeWithMongoose(User);

export { User, UserTC };
