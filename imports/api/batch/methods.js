import { Batch, Kategori, KategoriHardcode, Panen } from "./batch";
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
  async "batch.getBy"(id) {
    check(id, String);
    let thisBatch = await Batch.findOne({ _id: id });
   
    
    const kategori = Kategori.find().fetch();
    for (let index = 0; index < kategori.length; index++) {
      let element = kategori[index];

      if(thisBatch.feedsDetails){
        const findData = thisBatch.feedsDetails.filter(
          (item) => item.feedCategory === element.code
        );
        if (findData) {
          const qty = findData.reduce(
            (accumulator, currentValue) => accumulator + currentValue.feedAmount,
            0
          );
          const amount = findData.reduce(
            (accumulator, currentValue) => accumulator + currentValue.total,
            0
          );
          element.qty = qty;
          element.amount = amount;
        }
      }
    }
    thisBatch.rekapKategori = kategori;

    const amountTotal = kategori.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );
    thisBatch.expensesTotal = amountTotal;

    if (thisBatch.status == 60) {
      const panen = await Panen.findOne({ _id: thisBatch.panenId });
      thisBatch = { ...thisBatch, ...panen };
    }
    return thisBatch;
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
    console.log(batch);

    const feedSlice = feed.splice(feedId, 1);
    console.log("feed");
    console.log(feedSlice);

    const result = Batch.update({ _id: id }, { $set: { feedsDetails: feed } });
    return result;
  },
  async "batch.panen"(id, timeStamp, buyer, amount, items) {
    check(id, String);
    check(timeStamp, String);
    check(buyer, String);

    check(items, Object);

    const thisUser = await Meteor.users.findOne({ _id: Meteor.userId() });
    if (!thisUser) {
      throw new Meteor.Error(404, "No access");
    }

    const thisBatch = Batch.findOne({ _id: id });
    if (!thisBatch) {
      throw new Meteor.Error(404, "Data Pemijahan tidak ditemukan");
    }
    if (!thisUser.farmCode) {
      thisUser.farmCode = "none";
    }
    const totalFish = items.items.reduce(
      (accumulator, currentValue) => accumulator + currentValue.amount,
      0
    );
    const dataPanen = {
      date: timeStamp,
      buyer,
      income: amount,
      amount: totalFish,
      items: items.items,
      batchId: id,
      createdAt: new Date(),
      createdBy: thisUser._id,
      updatedAt: new Date(),
      farmCode: thisUser.farmCode,
    };
    const createdPanen = await Panen.insert(dataPanen);

    return Batch.update(
      { _id: id },
      {
        $set: {
          status: 60,
          isActive: false,
          panenId: createdPanen,
          panenTotalFish: totalFish,
          panenIncome: amount,
          panenDate: new Date(),
          updatedAt: new Date(),
          updatedBy: thisUser._id,
        },
      }
    );
  },

  //create kategories
  'categories.create'(){
    const kategori = KategoriHardcode;

    for (let index = 0; index < kategori.length; index++) {
      const element = kategori[index];
      Kategori.insert(element)
      
    }
  },
  'categories.getAll'(){
    return Kategori.find().fetch()
  }
});
