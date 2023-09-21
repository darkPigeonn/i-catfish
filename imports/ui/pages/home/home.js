import "./home.html";

import "../../components/hello/hello.js";
import "../../components/info/info.js";

Template.App_home.onCreated(function () {
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
Template.App_home.helpers({
  batchs() {
    return Template.instance().batchs.get();
  },
});
