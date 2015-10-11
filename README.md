

[![Build Status](https://travis-ci.org/selaias/accounts-entry.png)](https://travis-ci.org/selaias/accounts-entry)


# accounts-entry

**NOTE:** This is forked from [https://github.com/Differential/accounts-entry] (https://github.com/Differential/accounts-entry) eliminated coffeescript, simpleForm and t9n (replaced by [anti:i18n] (https://github.com/anticoders/meteor-i18n))

accounts-entry is a meteorite package that relies on Iron Router and provides an
alternative interface to accounts-ui, with whole pages for sign up
and sign in.


## Compatibility

accounts-entry is presently compatible with Iron Router 1.0.0 and above. Since meteorite doesn't support semantic version locking.

## Getting started

Run:

For Meteor 1.2.0.1 version
```
meteor add selaias:accounts-entry
```

For 1.1.0.3 and below 
```
meteor add selaias:accounts-entry@=0.5.0
```
You can install the `accounts-ui` package, as it is still used for OAuth setup.

## Provided routes

You will get routes and the necessary templates for:

```
/sign-in
/sign-out
/sign-up
/forgot-password
/verification-pending
```


You can then either add links to those directly, or use the <code>`{{>accountButtons }}`</code> helper to give you the apppropriate links for signed-in/signed-out users.  The <code>`{{>accountButtons }}`</code> helper will display a sign-out link and the user's email address when they are signed-in.

## Ensuring signed in users for routes

Simply add the following line of code: `AccountsEntry.signInRequired(this);` to require users be signed in for a route and to redirect the user to the included sign-in page and stop any rendering. Accounts-entry also tracks where the user was trying to go and will route them back after sign in.

Here is an Iron-Router route example:

````js
  Router.route('userProfile', {
    path: '/profile',
    template: 'profile',
    onBeforeAction: function () {
      AccountsEntry.signInRequired(this);
      this.next();
    }
  });
````

## Setting up password login

Use `meteor add accounts-password` if you want to have email/username login authentication options. This is now optional and will only display if installed. You need to configure an OAuth option if you choose not to have password logins.

## Setting up OAuth/social integrations


Use `accounts-ui` to configure your social/OAuth integrations (or manually create records in your database, if you have those skills). We don't have the nice instructions on how to configure the services built into this package, but if you choose to use <code>`{{>loginButtons }}`</code> elsewhere in your application (even temporarily), you can configure OAuth logins there.

## Configuration

### Signup codes

We have added support for a signupCode in case you want to have a special code to handout to keep signups at a pace you want. This code is checked if you turn on the client and server side options listed below.

**The signup code is only checked for accounts-password logins, so know that OAuth logins will still allow people in.**

### In CLIENT code only

Since this is a young package, we are maintaining compatibility with accounts-ui (so if in a pinch accounts-entry is broken for you, you could easily switch to accounts-ui). We also use the UI for oauth configs from accounts-ui.

```js
  Meteor.startup(function () {
    AccountsEntry.config({
      logo: 'logo.png',                          // if set displays logo above sign-in options
      privacyUrl: '/privacy-policy',             // if set adds link to privacy policy and 'you agree to ...' on sign-up page
      termsUrl: '/terms-of-use',                 // if set adds link to terms  'you agree to ...' on sign-up page
      homeRoute: '/',                            // mandatory - path to redirect to after sign-out
      dashboardRoute: '/dashboard',              // mandatory - path to redirect to after successful sign-in
      profileRoute: 'profile',                   // if set adds link to User Profile
      passwordSignupFields: 'EMAIL_ONLY',        // One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
      showSignupCode: true,                      // when true you need to set the 'signupCode' setting in the server (see below)
      showOtherLoginServices: true,              // Set to false to hide oauth login buttons on the signin/signup pages. Useful if you are using something like accounts-meld or want to oauth for api access
      passwordminLength: 7,                      // Password minimun lenght
      requireOneAlpha: true,                     // enforce the use of at least 1 char [a-z] while building the password
      requireOneDigit: true,                     // enforce the use of at least 1 digit while building the password
      requirePasswordConfirmation: true,         // enforce user to confirm password on signUp and resetPassword templates
      waitEmailVerification: true                // Set to true to wait until newly created user's email has been verified. 
      extraSignUpFields: [{                      // Add extra signup fields on the signup page
        field: "name",                           // The database property you want to store the data in
        name: "This Will Be The Initial Value",  // An initial value for the field, if you want one
        label: "Full Name",                      // The html lable for the field
        placeholder: "John Doe",                 // A placeholder for the field
        type: "text",                            // The type of field you want
        required: true                           // Adds html 5 required property if true
       }]
    });
  });
```

### In SERVER code only

Call `AccountsEntry.config` with a hash of optional configuration:

```js
  Meteor.startup(function () {
    AccountsEntry.config({
      signupCode: 's3cr3t',         // only restricts username+password users, not OAuth
      showSignupCode: true,         // place it also on server for extra security
      waitEmailVerification: true   // will not allow users to login until their email is verified.
      defaultProfile:{
          someDefault: 'default'
          }
    });
  });
```

*Note: only set a signupCode if you want to use that feature.*

The default configuration includes:

```js
  wrapLinks: true                   // wraps accounts-entry links in <li> for bootstrap compatability purposes
  homeRoute: '/'                    // MUST BE SET - redirect to this path after sign-out
  dashboardRoute: '/dashboard'      // MUST BE SET - redirect to this path after sign-in
```

Remember, you must provide a route for home (used when signing out) and
dashboard (used after signing in).
