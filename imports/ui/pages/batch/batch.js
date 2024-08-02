import "./batch.html";
import "../../components/card/card";
import "../../components/tables/tables";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
export const startSelect2 = function () {
  setTimeout(() => {
    $(".select2").select2();
  }, 200);
};
Template.batch_page.onCreated(function () {
  const self = this;

  self.batchs = new ReactiveVar();

  Meteor.call("batch.getAll", function (error, result) {
    if (result) {
      self.batchs.set(result);
    } else {
      console.log(error);
    }
  });
});
Template.batch_page.helpers({
  batchs() {
    return Template.instance().batchs.get();
  },
});
Template.batch_create.events({
  "click #btn_save"(e, t) {
    e.preventDefault();

    const name = $("#input_name").val();
    const startDate = $("#input_startDate").val();
    const amountBroodStock = $("#input_amountBroodStock").val();

    Meteor.call(
      "batch.insert",
      name,
      startDate,
      amountBroodStock,
      function (error, result) {
        if (result) {
          alert("Sukses");
          location.reload();
        } else {
          alert("Insert batch error");
          console.log(error);
        }
      }
    );
  },
});

Template.batch_detail.onCreated(function () {
  const self = this;

  self.batch = new ReactiveVar();
  self.viewMode = new ReactiveVar("1");
  const id = FlowRouter.getParam("_id");
  Meteor.call("batch.getBy", id, function (error, result) {
    if (result) {
      self.batch.set(result);
      if (!result.isActive) {
        $("button").prop("disabled", true);
      }
    } else {
      console.log(error);
    }
  });
  startSelect2();

  //ini untuk nyimpan hasil panen
  self.items = new ReactiveVar();

  self.categories = new ReactiveVar()
  Meteor.call("categories.getAll", function(error,result){
    if(error){
      console.log(error);      
    }else{
      self.categories.set(result)
     
    }
  })
});
Template.batch_detail.helpers({
  batch() {
    return Template.instance().batch.get();
  },
  categories(){
    return Template.instance().categories.get()
  },
  itemsInput() {
    return Template.instance().items.get();
  },
  viewMode() {
    return Template.instance().viewMode.get();
  },
});
Template.batch_detail.events({
  "click .btn-finish"(e, t) {
    e.preventDefault();
    $("#modalPanen").modal("show");

  },
  "click .btn-add-feed"(e, t) {
    startSelect2();
    e.preventDefault();

    const mode = $(e.target).attr("milik");
    let value = "0";
    if (mode == "1") {
      value = "2";
    } else {
      value = "1";
    }

    t.viewMode.set(value);
  },
  "click #btn_save"(e, t) {
    e.preventDefault();

    const feedDate = $("#input_feedDate").val();
    const feedCategory = $("#input_feedCategory").val();
    const feedAmount = $("#input_feedAmount").val();
    console.log($("#input_feedPrices").val());
    
    const feedPrices = convert2number($("#input_feedPrices").val());
console.log(feedPrices);

    const id = FlowRouter.getParam("_id");

    Meteor.call(
      "batch.feedInsert",
      id,
      feedDate,
      feedCategory,
      feedAmount,
      feedPrices,
      function (error, result) {
        if (result) {
          location.reload();
        }
      }
    );
  },
  "click #btn-remove"(e, t) {
    e.preventDefault();
    const thisItem = this;
    const milik = e.target.getAttribute("milik");

    const batch = t.batch.get();

    Meteor.call("batch.deleteFeed", batch._id, milik, function (error, result) {
      if (result) {
        alert("Berhasil");
        location.reload();
      } else {
        alert("Gagal");
      }
    });
  },
  "click #btn-add-items"(e, t) {
    e.preventDefault();
    const size = $("#input-size").val();
    const amount = convert2number($("#input-amount").val());
    const price = convert2number($("#input-price").val());
    const subTotal = amount * price;
    const thisItem = {
      size,
      amount,
      price,
      subTotal,
    };
    let thisItems = t.items.get();
    if (thisItems) {
      thisItems.items.push(thisItem);
    } else {
      thisItems = {
        items: [thisItem],
      };
    }
    t.items.set(thisItems);
    $("#input-size").val("");
    $("#input-amount").val("");
    $("#input-price").val("");
  },
  "click #btn-save-panen"(e, t) {
    e.preventDefault();
    const timeStamp = $("#date-panen").val();
    const buyer = $("#input-buyer").val();
    const amount = convert2number($("#input-total-amount").val());
    const items = t.items.get();
    const id = FlowRouter.current().params._id;

    Meteor.call(
      "batch.panen",
      id,
      timeStamp,
      buyer,
      amount,
      items,
      function (error, result) {
        if (result) {
          // successAlert("Berhasil");
          alert("Berhasil");
          location.reload();
        } else {
          failAlert("Gagal", error);
        }
      }
    );
  },
  "keyup #input-total-amount"(e, t) {
    e.target.value = formatRupiah($("#input-total-amount").val(), "Rp. ");
  },
  "keyup #input-amount"(e, t) {
    e.target.value = formatRupiah($("#input-amount").val(), "Rp. ");
  },
  "keyup #input-price"(e, t) {
    e.target.value = formatRupiah($("#input-price").val(), "Rp. ");
  },
  "keyup #input_feedPrices"(e, t) {
    e.target.value = formatRupiah($("#input_feedPrices").val(), "Rp. ");
  },
});
