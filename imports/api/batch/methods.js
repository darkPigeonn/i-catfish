import { Batch } from "./batch";
import { check } from "meteor/check";
Meteor.methods({
  "batch.getAll"() {
    const thisUser = Meteor.users.findOne({ _id: this.userId });
    if (!thisUser) {
      throw new Meteor.Error("Access Forbidden");
    }
    let filter = {};

    if (!thisUser.roles.includes["superadmin"]) {
      filter = {
        farmCode: thisUser.farmCode,
      };
    }
    const batchs = Batch.find(filter, { sort: { createdAt: -1 } }).fetch();

    console.log(batchs);
    return batchs;
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
  async "batch.deleteFeed"(id, feedId) {
    feedId = parseInt(feedId);
    const batch = Batch.findOne({ _id: id });
    if (!batch) {
      throw new Meteor.Error("Batch not found");
    }
    let feed = batch.feedsDetails;

    feed = feed.splice(feedId, 1);
    const fruits = ["apple"];

    // Remove the only element in the array
    fruits.splice(0, 1);
    console.log(fruits);
    const result = Batch.update({ _id: id }, { $set: { feedsDetails: feed } });
    return result;
  },
});
