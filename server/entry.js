Meteor.startup(function() {
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };

  Accounts.urls.enrollAccount = function(token) {
    return Meteor.absoluteUrl('enroll-account/' + token);
  };

  AccountsEntry = {
    settings: {},
    config: function(appConfig) {
      this.settings = _.extend(this.settings, appConfig);
    }
  };
  this.AccountsEntry = AccountsEntry;

  Accounts.validateLoginAttempt(function(attemptInfo) {

    var requirePasswordConfirmation = AccountsEntry.settings.requirePasswordConfirmation || false;

    if ( requirePasswordConfirmation === true){

      if (attemptInfo.type == 'resume') {
        return true;
      } 

      if (attemptInfo.methodName == 'createUser') {
        return false;
      } 

      if (attemptInfo.methodName == 'login' && attemptInfo.allowed) {

        var verified = false;
        var email = attemptInfo.methodArguments[0].user.email;
        attemptInfo.user.emails.forEach(function(value, index) {
          if (email == value.address && value.verified) {
            verified = true;
          }
        });
        if (!verified) {
          throw new Meteor.Error(403, 'Verify Email first!');
        }
      }
    }
    return true;
  });

});
Meteor.methods({
  entryValidateSignupCode: function(signupCode) {
    check(signupCode, Match.OneOf(String, null, undefined));
    return !AccountsEntry.settings.signupCode || signupCode === AccountsEntry.settings.signupCode;
  },
  entryCreateUser: function(user) {
    var profile, userId;
    try{
      check(user, Object);
      profile = AccountsEntry.settings.defaultProfile || {};

      if (user.username) {
        userId = Accounts.createUser({
          username: user.username,
          email: user.email,
          password: user.password,
          profile: _.extend(profile, user.profile)
        });
      } else {
        userId = Accounts.createUser({email: user.email, password: user.password, profile: _.extend(profile, user.profile)});
      }
      if (user.email && Accounts._options.sendVerificationEmail) {
        Accounts.sendVerificationEmail(userId, user.email);
      }
    }catch(ex){
      console.log(ex)
      throw new Meteor.Error(403, ex.message);
    }

  }
});
