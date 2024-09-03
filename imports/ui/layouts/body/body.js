import "./body.html";
import "../../components/navbar/navbar.js";
import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.App_body.onCreated(function () {
  const self = this;
  self.accessUser = new ReactiveVar();
  self.isLoading = new ReactiveVar(true)

  Meteor.call("thisUserAccess", function (error, result) {
    if (result) {
      self.accessUser.set(result);
      self.isLoading.set(false)
    } else {
    }
  });
});
Template.App_body.helpers({
  isLoading(){
    return Template.instance().isLoading.get()
  },
  accessUser() {
    return Template.instance().accessUser.get();
  },
  currentUser() {
    return Meteor.userId();
  },

});
Template.login_page.events({
  "click .submit"(e, t) {
    e.preventDefault();
    const email = $("#input_username").val();
    const password = $("#input_password").val();
    if (email && password) {
      Meteor.loginWithPassword(email, password, function (error) {
        if (error) {
          alert(error);
        } else {
          FlowRouter.go("/");
        }
      });
    } else {
      alert("silahkan isi form dengan lengkap");
    }
  },
  'click #togglePassword'(event) {
    const passwordInput = document.querySelector('#input_password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    const icon = event.currentTarget.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  },
});


Template.register.events({
  'submit #signUp'(e,t){
    e.preventDefault();

    const passwordInput = document.getElementById('input-password');
    const passwordError = document.getElementById('password-error');

    // Cek panjang password
    if (passwordInput.value.length < 8) {
      // Tampilkan pesan error
      passwordError.style.display = 'block';
    } else {
      // Sembunyikan pesan error jika panjang password valid
      passwordError.style.display = 'none';

      // Kirim form atau lakukan tindakan lain
      // Misalnya, panggil metode Meteor untuk mendaftar pengguna
      const name = document.getElementById('input-name').value;
      const nameFarm = document.getElementById('input-name-farm').value;
      const address = document.getElementById('input-address').value;
      const whatsapp = document.getElementById('input-whatsapp').value;
      const username = document.getElementById('input-username').value;
      const password = passwordInput.value;

      // Contoh metode Meteor untuk mendaftar pengguna
      Meteor.call('users.register',  name, nameFarm, address, whatsapp, username, password , (error) => {
        if (error) {
          alert(error.reason);
        } else {
          alert('Pendaftaran berhasil!');
          FlowRouter.go("/");
        }
      });
    }


  }
})