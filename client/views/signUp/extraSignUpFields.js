Template.entryExtraSignUpFields.helpers({
  extraSignUpFields: function() {
    return AccountsEntry.settings.extraSignUpFields;
  }
});

Template._entryExtraSignUpField.helpers({
  isTextField: function() {
    return this.type !== "check_box";
  },
  isCheckbox: function() {
    return this.type === "check_box";
  },
  label_words: function(){
    var label_words='';
    if(_.isString(this.label)) {
      label_words = this.label
    } else {
      label_words = _.humanize(this.label)
    }
    return label_words
  },
  isChecked: function(){
    if (this.checked) {
      return " checked"
    } else {
      return ""
    }
  },
  htmlText:function(){
    var req = ''
    if (this.required) {
      req = " required";
    }
    var str =  "<label for='"+ this.field +"'>" + this.field + "</label><input type='"+ this.type +"' id='" + this.field + "' name='"+ this.field +"' value='"+ this.name +"' class='form-control "+ this.html_class +"' placeholder='" + this.placeholder +"'" + req +">";

    return new Spacebars.SafeString(str); 
  },
  htmlCheckBox:function(){
    var req = ''
    if (this.required) {
      req = " required";
    }
    var check='';
    if (this.checked) {
      return " checked"
    } 
    var str = "<label for='"+ this.field +"'><input id='"+ this.field +"' name='" + this.field + "' type='hidden' value='false'><input name='" + this.field + "' class='"+ this.html_class +"' type='checkbox' value='true' " + check + req + ">" + this.label + "</label>";

    return new Spacebars.SafeString(str); 
  }
});