import { FlowRouter } from "meteor/ostrio:flow-router-extra";

// Import needed templates
import "../../ui/layouts/body/body.js";
import "../../ui/pages/home/home.js";
import "../../ui/pages/not-found/not-found.js";
import "../../ui/pages/batch/batch.js";
// Set up all routes in the app
FlowRouter.route("/", {
  name: "App.home",
  action() {
    this.render("App_body", "App_home");
  },
});

FlowRouter.notFound = {
  action() {
    this.render("App_body", "App_notFound");
  },
};

FlowRouter.route("/batch", {
  name: "batch",
  action() {
    this.render("App_body", "batch_page");
  },
});
FlowRouter.route("/batch/create", {
  name: "batch create",
  action() {
    this.render("App_body", "batch_create");
  },
});
FlowRouter.route("/batch/detail/:_id", {
  name: "batch update",
  action() {
    this.render("App_body", "batch_detail");
  },
});
