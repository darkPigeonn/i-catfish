const generator = require("generate-password");
import { check } from "meteor/check";
Meteor.methods({
  async "add-breeder"(fullName, farmName, telp, password, username) {
    check(fullName, String);
    check(telp, String);
    check(password, String);
    check(username, String);

    const dataUser = {
      username: username,
      password: password,
    };

    const newUserId = await Accounts.createUser(dataUser);
    const extraData = {
      fullName: fullName,
      telp: telp,
      createdAt: new Date(),
      createdBy: this.userId,
      roles: ["breeder"],
    };
    return Meteor.users.update(
      {
        _id: newUserId,
      },
      {
        $set: extraData,
      }
    );
  },

  async "users.getAll"() {
    return Meteor.users.find({}).fetch();
  },
  async thisUserAccess() {
    const thisUser = Meteor.users.findOne({ _id: this.userId });
    const roles = thisUser.roles;
    let access = {};

    if (thisUser.roles.includes["superadmin"]) {
      access.usersList = true;
    }
    console.log(access);
    return access;
  },
});
