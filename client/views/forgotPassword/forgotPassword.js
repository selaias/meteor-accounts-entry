Template.entryForgotPassword.helpers({
  error: function() {
    return i18n(Session.get('entryError'));
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  }
});

Template.entryForgotPassword.events({
  'submit #forgotPassword': function(event) {
    event.preventDefault();
    Alerts.clear();
    Session.set('email', $('input[name="forgottenEmail"]').val());
    if (Session.get('email').length === 0) {
       Alerts.add(i18n('error.emailRequired'), 'danger');
      return;
    }
    Accounts.forgotPassword({email: Session.get('email')}, function(error) {
      if (error) {
         Alerts.add(error.reason, 'danger');
      } else {
        Router.go(AccountsEntry.settings.homeRoute);
        Alerts.add(i18n('info.emailSent'), 'success');
      }
    });
  }
});