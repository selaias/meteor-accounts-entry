if (typeof AccountsEntry === "undefined") {
  AccountsEntry = {};
}

AccountsEntry = {
  settings: {
    wrapLinks: true,
    homeRoute: '/home',
    dashboardRoute: '/dashboard',
    passwordSignupFields: 'EMAIL_ONLY',
    emailToLower: true,
    usernameToLower: false,
    entrySignUp: '/sign-up',
    emailVerificationPendingRoute: '/verification-pending',
    extraSignUpFields: [],
    showOtherLoginServices: true,
    requirePasswordConfirmation: true,
    waitEmailVerification: true
  },
  isStringEmail: function(email) {
    var emailPattern;
    emailPattern = /^([\w.-]+)@([\w.-]+)\.([a-zA-Z.]{2,6})$/i;
    if (email.match(emailPattern)) {
      return true;
    } else {
      return false;
    }
  },
  config: function(appConfig) {
    var signUpRoute;
    this.settings = _.extend(this.settings, appConfig);
    i18n.setDefaultLanguage = "en";
    if (appConfig.language) {
      i18n.setLanguage = appConfig.language;
    }
    if (appConfig.signUpTemplate) {
      signUpRoute = Router.routes['entrySignUp'];
      return signUpRoute.options.template || appConfig.signUpTemplate;
    }
  },
  signInRequired: function(router, extraCondition) {
    if (extraCondition === null) {
      extraCondition = true;
    }
    if (!Meteor.user()){
      Session.set('fromWhere', router.url);
      Router.go('entrySignIn');
      Session.set('entryError', i18n('error.signInRequired'));
    }
  }
};
