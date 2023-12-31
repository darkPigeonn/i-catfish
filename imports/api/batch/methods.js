import { Batch } from "./batch";
import { check } from "meteor/check";
Meteor.methods({
  "batch.getAll"() {
    const thisUser = Meteor.users.findOne({ _id: this.userId });
    if (!thisUser) {
      throw new Meteor.Error("Access Forbidden");
    }
    let filter = {};

    console.log(thisUser);

    if (!thisUser.roles.includes["superadmin"]) {
      filter = {
        farmCode: thisUser.farmCode,
      };
    }

    return Batch.find(filter).fetch();
  },
  "batch.getBy"(id) {
    check(id, String);
    return Batch.findOne({ _id: id });
  },
  async "batch.insert"(name, startDate, amountBroodStock) {
    const thisUser = Meteor.users.findOne({ _id: this.userId });
    if (!thisUser) {
      throw new Meteor.Error("Access Forbidden");
    }

    check(name, String);
    check(startDate, String);
    check(amountBroodStock, String);

    startDate = new Date(startDate);
    amountBroodStock = parseInt(amountBroodStock);

    const dataSave = {
      name,
      startDate,
      amountBroodStock,
      createdAt: new Date(),
      createdBy: "Admin Bulk",
      isActive: true,
      farmCode: thisUser.farmCode,
    };

    return await Batch.insert(dataSave);
  },
  async "batch.feedInsert"(id, feedDate, feedCategory, feedAmount, feedPrices) {
    feedAmount = parseFloat(feedAmount);
    feedPrices = parseFloat(feedPrices);
    const total = feedAmount * feedPrices;
    const dataSave = {
      feedDate,
      feedCategory,
      feedAmount,
      feedPrices,
      total,
      createdAt: new Date(),
      createdBy: "Admin Bulk",
    };

    return await Batch.update(
      { _id: id },
      { $addToSet: { feedsDetails: dataSave } }
    );
  },
});
