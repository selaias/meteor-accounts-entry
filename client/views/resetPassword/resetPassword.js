Template.entryResetPassword.helpers({
  error: function() {
    return Session.get('entryError');
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  }
});

Template.entryResetPassword.events({
  'submit #resetPassword': function(event) {
    var password, passwordErrors;
    event.preventDefault();
    Alerts.clear();
    password = $('input[name="new-password"]').val()
    passwordErrors = (function(password) {
      var errMsg, msg, minLength, passwordConfirmed;
      errMsg = [];
      msg = false;

      minLength = AccountsEntry.settings.minLength !== null ? AccountsEntry.settings.minLength : 7;

      if (AccountsEntry.settings.requirePasswordConfirmation) {
        passwordConfirmed = $('input[name="new-passwordConfirmed"]').val();
        if (password !== passwordConfirmed) {
          errMsg.push(i18n("error.pwNoMatch"));
        }
      }
      if (password.length < minLength) {
        errMsg.push(i18n("error.minChar"));
      }
      if (password.search(/[a-z]/i) < 0 && AccountsEntry.settings.requireOneAlpha) {
        errMsg.push(i18n("error.pwOneLetter"));
      }
      if (password.search(/[0-9]/) < 0 && AccountsEntry.settings.requireOneDigit) {
        errMsg.push(i18n("error.pwOneDigit"));
      }
      if (errMsg.length > 0) {
        msg = "";
        errMsg.forEach(function(e) {
          msg +=msg.concat(e + "\r\n");
          Alerts.add(e, 'danger')
        });
        return true;
      }
      return false;
    })(password);
    if (passwordErrors) {
      return;
    }
    Accounts.resetPassword(Session.get('resetToken'), password, function(error) {
      if (error) {
        Alerts.add(error.reason || "Unknown error", 'danger')
      } else {
        Session.set('resetToken', null);
        Router.go(AccountsEntry.settings.dashboardRoute);
        Alerts.add(i18n('info.passwordReset'), 'success');
      }
    });
  }
});