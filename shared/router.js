var exclusions;

Router.route("entrySignIn", {
  path: "/sign-in",
  name: 'entrySignIn',
  template: 'entrySignIn',
  onBeforeAction: function() {
    Alerts.clear();
    Session.set('buttonText', 'in');
    this.next();
  },
  onRun: function() {
    var pkgRendered, userRendered;
    if (Meteor.userId()) {
      Router.go(AccountsEntry.settings.dashboardRoute);
    }
    if (AccountsEntry.settings.signInTemplate) {
      this.template = AccountsEntry.settings.signInTemplate;
      pkgRendered = Template.entrySignIn.rendered;
      userRendered = Template[this.template].rendered;
      if (userRendered) {
        Template[this.template].rendered = function() {
          pkgRendered.call(this);
          return userRendered.call(this);
        };
      } else {
        Template[this.template].rendered = pkgRendered;
      }
      Template[this.template].events(AccountsEntry.entrySignInEvents);
      Template[this.template].helpers(AccountsEntry.entrySignInHelpers);
    }
    this.next();
  }
});
Router.route("entrySignUp", {
  path: "/sign-up",
  name: 'entrySignUp',
  template: 'entrySignUp',
  onBeforeAction: function() {
    Alerts.clear();
    Session.set('buttonText', 'up');
    this.next();
  },
  onRun: function() {
    var pkgRendered, userRendered;
    if (AccountsEntry.settings.signUpTemplate) {
      this.template = AccountsEntry.settings.signUpTemplate;
      pkgRendered = Template.entrySignUp.rendered;
      userRendered = Template[this.template].rendered;
      if (userRendered) {
        Template[this.template].rendered = function() {
          pkgRendered.call(this);
          userRendered.call(this);
        };
      } else {
        Template[this.template].rendered = pkgRendered;
      }
      Template[this.template].events(AccountsEntry.entrySignUpEvents);
      Template[this.template].helpers(AccountsEntry.entrySignUpHelpers);
    }
    this.next();
  }
});
Router.route("entryForgotPassword", {
  path: "/forgot-password",
  name: 'entryForgotPassword',
  template: 'entryForgotPassword',
  onBeforeAction: function() {
    Alerts.clear();
    this.next();
  }
});
Router.route('entrySignOut', {
  path: '/sign-out',
  name: 'entrySignOut',
  template: 'entrySignOut',
  onBeforeAction: function() {
    Alerts.clear();
    if (AccountsEntry.settings.homeRoute) {
      Meteor.logout();
      Router.go(AccountsEntry.settings.homeRoute);
    }
    this.next();
  }
});
Router.route('entryResetPassword', {
  path: 'reset-password/:resetToken',
  name: 'entryResetPassword',
  template: 'entryResetPassword',
  onBeforeAction: function() {
    Alerts.clear();
    Session.set('resetToken', this.params.resetToken);
    this.next();
  }
});

Router.route('entryEmailVerificationPending', {
  path: '/verification-pending',
  name: 'entryEmailVerificationPending',
  template: 'entryEmailVerificationPending',
  onBeforeAction: function() {
    Alerts.clear();
    this.next();
  }
});

exclusions = [];

_.each(Router.routes, function(route) {
  return exclusions.push(route.name);
});

Router.onStop(function() {
  if (!_.contains(exclusions, (Router.current().route) !== null ? Router.current().path : undefined)) {
    Session.set('fromWhere', Router.current().path);
  }
});