AccountsEntry.hashPassword = function(password) {
  return {
    digest: SHA256(password),
    algorithm: "sha-256"
  };
};

AccountsEntry.entrySignUpHelpers = {
  showEmail: function() {
    var fields;
    fields = AccountsEntry.settings.passwordSignupFields;
    return _.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'EMAIL_ONLY'], fields);
  },
  showUsername: function() {
    var fields;
    fields = AccountsEntry.settings.passwordSignupFields;
    return _.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY'], fields);
  },
  showSignupCode: function() {
    return AccountsEntry.settings.showSignupCode;
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  },
  privacyUrl: function() {
    return AccountsEntry.settings.privacyUrl;
  },
  termsUrl: function() {
    return AccountsEntry.settings.termsUrl;
  },
  both: function() {
    return AccountsEntry.settings.privacyUrl && AccountsEntry.settings.termsUrl;
  },
  neither: function() {
    return !AccountsEntry.settings.privacyUrl && !AccountsEntry.settings.termsUrl;
  },
  emailIsOptional: function() {
    var fields;
    fields = AccountsEntry.settings.passwordSignupFields;
    return _.contains(['USERNAME_AND_OPTIONAL_EMAIL'], fields);
  },
  emailAddress: function() {
    return Session.get('email');
  },

};

AccountsEntry.entrySignUpEvents = {
  'submit #signUp': function(event, t) {
    var email, emailRequired, extraFields, fields, filteredExtraFields, formValues, password, passwordErrors, signupCode, trimInput, username, usernameRequired;
    event.preventDefault();
    Alerts.clear();
    username = t.find('input[name="username"]') ? t.find('input[name="username"]').value.toLowerCase() : undefined;
    if (username && AccountsEntry.settings.usernameToLower) {
      username = username.toLowerCase();
    }
    signupCode = t.find('input[name="signupCode"]') ? t.find('input[name="signupCode"]').value :undefined;
    trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    };
    email = t.find('input[type="email"]') ? trimInput(t.find('input[type="email"]').value) : undefined;
    if (AccountsEntry.settings.emailToLower && email) {
      email = email.toLowerCase();
    }
    formValues = SimpleForm.processForm(event.target);

    extraFields = _.pluck(AccountsEntry.settings.extraSignUpFields, 'field');
    filteredExtraFields = _.pick(formValues, extraFields);

    password = t.find('input[name="password1"]').value;

    fields = AccountsEntry.settings.passwordSignupFields;
    passwordErrors = (function(password) {
      var errMsg, msg, minLength, password2;
      errMsg = [];
      msg = false;

      minLength = AccountsEntry.settings.minLength !== null ? AccountsEntry.settings.minLength : 7;

      if (AccountsEntry.settings.requirePasswordConfirmation) {
        password2 = $('input[name="password2"]').val();
        if (password !== password2) {
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
    emailRequired = _.contains(['USERNAME_AND_EMAIL', 'EMAIL_ONLY'], fields);
    usernameRequired = _.contains(['USERNAME_AND_EMAIL', 'USERNAME_ONLY'], fields);
    if (usernameRequired && username.length === 0) {
      Alerts.add(i18n("error.usernameRequired"), 'danger');
      return;
    }
    if (username && AccountsEntry.isStringEmail(username)) {
      Alerts.add(i18n("error.usernameIsEmail"), 'danger');
      return;
    }
    if (emailRequired && email.length === 0) {
      Alerts.add(i18n("error.emailRequired"), 'danger');
      return;
    }
    if (AccountsEntry.settings.showSignupCode && signupCode.length === 0) {
      Alerts.add(i18n("error.signupCodeRequired"), 'danger');
      return;
    }
    Meteor.call('entryValidateSignupCode', signupCode, function(err, valid) {
      var newUserData;
      if (valid) {
        newUserData = {
          username: username,
          email: email,
          password: AccountsEntry.hashPassword(password),
          profile: filteredExtraFields
        };
        Meteor.call('entryCreateUser', newUserData, function(err, data) {
          var isEmailSignUp, userCredential;
          if (err) {
            Alerts.add(err.reason, 'danger');
            return;
          }
          isEmailSignUp = _.contains(['USERNAME_AND_EMAIL', 'EMAIL_ONLY'], AccountsEntry.settings.passwordSignupFields);
          userCredential = isEmailSignUp ? email : username;
          if (AccountsEntry.settings.waitEmailVerification === true && isEmailSignUp) {
            Router.go(AccountsEntry.settings.emailVerificationPendingRoute);
          }
          else {
            Meteor.loginWithPassword(userCredential, password, function(error) {
              if (error) {
                Alerts.add(error.reason, 'danger');
              } else if (Session.get('fromWhere')) {
                Router.go(Session.get('fromWhere'));
                Session.set('fromWhere', null);
              } else {
                Router.go(AccountsEntry.settings.dashboardRoute);
              }
            });
          }
        });
      } else {
        Alerts.add(i18n("error.signupCodeIncorrect"), 'danger');
      }
    });
  }
};

Template.entrySignUp.helpers(AccountsEntry.entrySignUpHelpers);

Template.entrySignUp.events(AccountsEntry.entrySignUpEvents);
