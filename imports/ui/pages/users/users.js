import "./users.html";
import "../../components/modal/modal";
Template.users_list.onCreated(function () {
  const self = this;

  self.listUsers = new ReactiveVar();

  Meteor.call("users.getAll", function (error, result) {
    if (result) {
      self.listUsers.set(result);
    } else {
      console.log(error);
    }
  });
});
Template.users_list.helpers({
  listUsers() {
    return Template.instance().listUsers.get();
  },
  fieldUsers() {
    const fields = [
      {
        label: "Nama Lengkap",
        name: "fullName",
        type: "text",
      },
      {
        label: "Nama Perternakan",
        name: "farm",
        type: "text",
      },
      {
        label: "Nomor Telephone",
        name: "telp",
        type: "number",
      },
    ];
    return fields;
  },
});
Template.users_list.events({
  "click #btn-add"(e, t) {
    e.preventDefault();
  },
});
