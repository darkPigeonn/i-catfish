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
    console.log(thisUser);
    if(!thisUser){
      return;
    }  
    if (thisUser.roles) {
      const roles = thisUser.roles;
      let access = {};

      if (thisUser.roles.includes["superadmin"]) {
        access.usersList = true;
      }
      return access;
    } else {
      return;
    }
  },

  async 'users.register'(name, nameFarm, address, whatsapp, username, password){
     // Validasi input dan simpan pengguna baru ke database
   
     if (password.length < 8) {
      throw new Meteor.Error('password-too-short', 'Password harus minimal 8 karakter');
    }

    Accounts.createUser({
      username,
      password,
      profile: {
        name,
        nameFarm,
        address,
        whatsapp,
      },
    });
  }
});
