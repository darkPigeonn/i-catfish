import "./navbar.html";

Template.navbar.events({
  "click #btn_logout"(e, t) {
    return Meteor.logout();
  },
});
