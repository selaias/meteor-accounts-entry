Package.describe({
  summary: "Make signin and signout their own pages with routes (in javascript)",
  version: '0.6.0',
  name: "selaias:accounts-entry",
  githubUrl: 'https://github.com/selaias/accounts-entry',
});

Package.onUse(function(api) {
  api.versionsFrom("1.2.0.1");

  api.use('selaias:alerts@0.3.1', 'client');
  
  api.use(['iron:router@1.0.3', 'anti:i18n@0.4.3'], ['client', 'server']);
  // CLIENT
  api.use([
    'deps',
    'service-configuration',
    'accounts-base',
    'underscore',
    'templating',
    'handlebars',
    'session',
    'less',
    'sha@1.0.3'], 'client');


  api.addFiles([
    'client/lib/entry.js',
    'client/lib/simpleform.js',
    'client/css/entry.less',
    'client/lib/helpers.js',
    'client/views/signIn/signIn.html',
    'client/views/signIn/signIn.js',
    'client/views/signUp/signUp.html',
    'client/views/signUp/signUp.js',
    'client/views/signUp/extraSignUpFields.html',
    'client/views/signUp/extraSignUpFields.js',
    'client/views/forgotPassword/forgotPassword.html',
    'client/views/forgotPassword/forgotPassword.js',
    'client/views/resetPassword/resetPassword.html',
    'client/views/resetPassword/resetPassword.js',
    'client/views/verifyEmail/emailVerificationPending.html',
    'client/views/verifyEmail/emailVerificationPending.js',
    'client/views/social/social.html',
    'client/views/social/social.js',
    'client/views/accountButtons/accountButtons.html',
    'client/views/accountButtons/_wrapLinks.html',
    'client/views/accountButtons/signedIn.html',
    'client/views/accountButtons/accountButtons.js'
  ], 'client');
  // SERVER
  api.use([
    'deps',
    'service-configuration',
    'accounts-base',
    'underscore'], 'server');

  api.addFiles(['server/entry.js'], 'server');

  // CLIENT and SERVER
  api.imply('accounts-base', ['client', 'server']);

  api.export('AccountsEntry', ['client', 'server']);
  api.export('SimpleForm', ['client', 'server']);

  api.addFiles([
    'shared/router.js',

    'shared/i18n/i18n_ar.js',
    'shared/i18n/i18n_de.js',
    'shared/i18n/i18n_el.js',
    'shared/i18n/i18n_en.js',
    'shared/i18n/i18n_es.js',
    'shared/i18n/i18n_fr.js',
    'shared/i18n/i18n_it.js',
    'shared/i18n/i18n_pl.js',
    'shared/i18n/i18n_pt.js',
    'shared/i18n/i18n_ru.js',
    'shared/i18n/i18n_sl.js',
    'shared/i18n/i18n_sv.js'
  ], ['client', 'server']);

});

Package.onTest(function (api) {
  api.use(['tinytest',
           'underscore',
           'handlebars',
           'test-helpers',
           'templating',
           'mongo-livedata']);
  api.use(['iron:router', 'anti:i18n@0.4.3', 'selaias:alerts@0.2.1'], ['client', 'server']);
  api.use('selaias:accounts-entry');

  api.addFiles(['tests/route.js', 'tests/client.html', 'tests/client.js'], 'client');
});
