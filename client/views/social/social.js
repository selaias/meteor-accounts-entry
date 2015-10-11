var capitalize;

Template.entrySocial.helpers({
  buttonText: function() {
    var buttonText;
    buttonText = Session.get('buttonText');
    if (buttonText === 'up') {
      return i18n('signUp');
    } else {
      return i18n('signIn');
    }
  },
  unconfigured: function() {
    return ServiceConfiguration.configurations.find({service: this.toString()}).fetch().length === 0;
  },
  google: function() {
    if (this[0] === 'g' && this[1] === 'o') {
      return true;
    }
  },
  isSocial: function(){
    var s = this.toString();
    console.log(s)
    if(s=='strava' || s=='runkeeper' || s=='underArmour'){
      return false
    }else{
      return true
    }
  },
  icon: function() {
    switch (this.toString()) {
      case 'google':
        return 'google-plus';
      case 'meteor-developer':
        return 'rocket';
      default:
        return this;
    }
  }
});

Template.entrySocial.events({
  'click .btn': function(event) {
    var callback, loginWithService, options, serviceName;
    event.preventDefault();
    serviceName = $(event.target).attr('id').replace('entry-', '');
    callback = function(err) {
      if (!err) {
        if (Session.get('fromWhere')) {
          Router.go(Session.get('fromWhere'));
          Session.set('fromWhere', void 0);
        } else {
          Router.go(AccountsEntry.settings.dashboardRoute);
        }
      } else if (err instanceof Accounts.LoginCancelledError) {

      } else if (err instanceof ServiceConfiguration.ConfigError) {
        Accounts._loginButtonsSession.configureService(serviceName);
      } else {
        Accounts._loginButtonsSession.errorMessage(err.reason || i18n("error.unknown"));
      }
    };
    if (serviceName === 'meteor-developer') {
      loginWithService = Meteor["loginWithMeteorDeveloperAccount"];
    } else {
      loginWithService = Meteor["loginWith" + capitalize(serviceName)];
    }
    options = {};
    if (Accounts.ui._options.requestPermissions[serviceName]) {
      options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
    }
    if (Accounts.ui._options.requestOfflineToken && Accounts.ui._options.requestOfflineToken[serviceName]) {
      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
    }
    return loginWithService(options, callback);
  }
});

capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};