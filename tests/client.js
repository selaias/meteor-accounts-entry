var renderToDiv;

renderToDiv = function(comp) {
  var div;
  div = document.createElement("DIV");
  Blaze.render(comp, div);
  return div;
};

Tinytest.add("Accounts Entry - {{accountButtons}} helper", function(test) {
  var div, html;
  div = renderToDiv(Template.test_helper_account_buttons);
  html = canonicalizeHtml(div.innerHTML);
  test.include(html, "Sign In");
  return test.include(html, "Register");
});

Tinytest.add("Accounts Entry - wrapLinks setting on should wrap links in li elements", function(test) {
  var div, html;
  AccountsEntry.settings.wrapLinks = true;
  div = renderToDiv(Template.test_helper_account_buttons);
  html = canonicalizeHtml(div.innerHTML);
  return test.include(html, '<li><a href="/sign-in">Sign In</a></li>');
});

Tinytest.add("Accounts Entry - wrapLinks setting on should not show 'or span'", function(test) {
  var div, html, scan;
  AccountsEntry.settings.wrapLinks = true;
  div = renderToDiv(Template.test_helper_account_buttons);
  html = canonicalizeHtml(div.innerHTML);
  scan = html.indexOf('<span>or</span>');
  return test.equal(scan, -1, "Html output includes or span but shouldn't");
});

Tinytest.add("Accounts Entry - wrapLinks setting off should not wrap links in li elements", function(test) {
  var div, html, scan;
  AccountsEntry.settings.wrapLinks = false;
  div = renderToDiv(Template.test_helper_account_buttons);
  html = canonicalizeHtml(div.innerHTML);
  scan = html.indexOf('<li>');
  return test.equal(scan, -1, "Html output shouldn't have li tags");
});

Tinytest.add("Accounts Entry - wrapLinks setting off should show 'or span'", function(test) {
  var div, html;
  AccountsEntry.settings.wrapLinks = false;
  div = renderToDiv(Template.test_helper_account_buttons);
  html = canonicalizeHtml(div.innerHTML);
   test.include(html, '<span>or</span>');
});

Tinytest.add("Accounts Entry - forgot password link should not show up if username only is set", function(test) {
  var div, html, scan;
  AccountsEntry.settings.passwordSignupFields = "USERNAME_ONLY";
  div = renderToDiv(Template.test_helper_sign_in);
  html = canonicalizeHtml(div.innerHTML);
  scan = html.indexOf('<a href="/forgot-password">');
  return test.equal(scan, -1, "Forgot password link should not show up if username only is set");
});