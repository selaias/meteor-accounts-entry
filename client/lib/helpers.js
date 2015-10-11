if (typeof Handlebars !== "undefined") {
  UI.registerHelper("signedInAs", function(date) {
    if (Meteor.user().username) {
      return Meteor.user().username;
    } else if (Meteor.user().profile && Meteor.user().profile.name) {
      return Meteor.user().profile.name;
    } else if (Meteor.user().emails && Meteor.user().emails[0]) {
      return Meteor.user().emails[0].address;
    } else {
      return "Signed In";
    }
  });
}

UI.registerHelper('accountButtons', function() {
  return Template.entryAccountButtons;
});

UI.registerHelper('capitalize', function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

UI.registerHelper('signupClass', function() {
  if (AccountsEntry.settings.showOtherLoginServices && Accounts.oauth && Accounts.oauth.serviceNames().length > 0) {
    return "collapse";
  }
});

UI.registerHelper('signedIn', function() {
  if (Meteor.user()) {
    return true;
  }
});

UI.registerHelper('otherLoginServices', function() {
  return AccountsEntry.settings.showOtherLoginServices && Accounts.oauth && Accounts.oauth.serviceNames().length > 0;
});

UI.registerHelper('loginServices', function() {
  return Accounts.oauth.serviceNames();
});

UI.registerHelper('showSignupCode', function() {
  return AccountsEntry.settings.showSignupCode === true;
});

UI.registerHelper('showPasswordConfirmation', function() {
  return AccountsEntry.settings.requirePasswordConfirmation === true;
});


UI.registerHelper('passwordLoginService', function() {
  return !!Package['accounts-password'];
});

UI.registerHelper('showCreateAccountLink', function() {
  return !Accounts._options.forbidClientAccountCreation;
});