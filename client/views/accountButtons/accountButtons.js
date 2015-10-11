var entryAccountButtonsHelpers;

entryAccountButtonsHelpers = {
  profileUrl: function() {
    if (!AccountsEntry.settings.profileRoute) {
      return false;
    }
    return AccountsEntry.settings.profileRoute;
  },
  wrapLinksLi: function() {
    if (AccountsEntry.settings.wrapLinks) {
      return Template.wrapLinks;
    } else {
      return Template.noWrapLinks;
    }
  },
  wrapLinks: function() {
    return AccountsEntry.settings.wrapLinks;
  },
  beforeSignIn: function() {
    return AccountsEntry.settings.beforeSignIn;
  },
  beforeSignUp: function() {
    return AccountsEntry.settings.beforeSignUp;
  },
  beforeSignOut: function() {
    return AccountsEntry.settings.beforeSignOut;
  },
  beforeSignedInAs: function() {
    return AccountsEntry.settings.beforeSignedInAs;
  },
  entrySignUp: function() {
    return AccountsEntry.settings.entrySignUp;
  },
  profile: function() {
    return Meteor.user().profile;
  }
};

Template.entryAccountButtons.helpers(entryAccountButtonsHelpers);

Template.entryAccountButtons.helpers({
  signedInTemplate: function() {
    if (AccountsEntry.settings.signedInTemplate) {
      Template[AccountsEntry.settings.signedInTemplate].helpers(entryAccountButtonsHelpers);
      return Template[AccountsEntry.settings.signedInTemplate];
    } else {
      return Template.entrySignedIn;
    }
  }
});
Template.entrySignedIn.helpers(entryAccountButtonsHelpers);