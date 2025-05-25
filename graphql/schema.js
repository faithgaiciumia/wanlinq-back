import { schemaComposer } from "graphql-compose";
import { UserTC, User } from "../models/user.js";

// Queries
schemaComposer.Query.addFields({
  getUsers: UserTC.getResolver("findMany"),
  getUserById: UserTC.getResolver("findById"),
  getUserByEmail: {
    type: UserTC,
    args: { email: "String!" },
    resolve: async (_, { email }) => {
      console.log("Resolver args:", email);
      return await User.findOne({ email: email });
    },
  },
});

// Mutations
schemaComposer.Mutation.addFields({
  updateUser: UserTC.getResolver("updateById"),
  deleteUser: UserTC.getResolver("removeById"),

  addUserLink: {
    type: UserTC,
    args: {
      userId: "ID!",
      siteName: "String!",
      siteLink: "String!",
    },
    resolve: async ({ args }) => {
      const user = await User.findById(args.userId);
      if (!user) throw new Error("User not found");
      user.links.push({ siteName: args.siteName, siteLink: args.siteLink });
      await user.save();
      return user;
    },
  },

  editUserLink: {
    type: UserTC,
    args: {
      userId: "ID!",
      linkId: "ID!",
      siteName: "String",
      siteLink: "String",
    },
    resolve: async ({ args }) => {
      const user = await User.findById(args.userId);
      if (!user) throw new Error("User not found");

      const link = user.links.id(args.linkId);
      if (!link) throw new Error("Link not found");

      if (args.siteName !== undefined) link.siteName = args.siteName;
      if (args.siteLink !== undefined) link.siteLink = args.siteLink;

      await user.save();
      return user;
    },
  },

  deleteUserLink: {
    type: UserTC,
    args: {
      userId: "ID!",
      linkId: "ID!",
    },
    resolve: async ({ args }) => {
      const user = await User.findById(args.userId);
      if (!user) throw new Error("User not found");

      const link = user.links.id(args.linkId);
      if (!link) throw new Error("Link not found");

      link.remove();
      await user.save();
      return user;
    },
  },
});

export default schemaComposer.buildSchema();
