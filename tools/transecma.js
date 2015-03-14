/*!
 * Transecma, a javaScript i18n library v0.2
 * http://code.google.com/p/bag/
 *
 * Copyright 2012, Nando Florestan
 *
 * Usage:

// Above this code there must be a translation map called "translations", e.g.:

translations = {
    'I think we must review our processes.':
        'Who the hell was so stupid as to cause this #$%&*???',
    "If you don't know why I'm mad at you, do you think I'm going to tell you?":
        "I am your girlfriend and I am extremely anxious!",
    'I came, I saw, I conquered!': 'Veni, vidi, vici!',
    'Item [0] of [1]':
        'We have [1] items (really, [1]) and this is item number [0].'
}

// Here are some demonstrations:
tests = [
    _('I came, I saw, I conquered!'),
    _('Item [0] of [1]').interpol(8, 9)
];
alert(tests.join('\n'));

*/

String.prototype.interpol = function () {
    // String interpolation for format strings like "Item [0] of [1]".
    // May receive strings or numbers as arguments.
    // For usage, see the test function below.
    var args = arguments;
    try {
        return this.replace(/\[(\d+)\]/g, function () {
            // The replacement string is given by the nth element in the list,
            // where n is the second group of the regular expression:
            return args[arguments[1]];
        });
    } catch (e) {
        if (window.console) console.log(['Exception on interpol() called on',
            this, 'with arguments', arguments]);
        throw (e);
    }
};
String.prototype.interpol.test = function () {
    if ('Item #[0] of [1]. Really, item [0].'.interpol(5, 7)
        != "Item #5 of 7. Really, item 5.")  throw('Blimey -- oh no!');
};

if (!window.translations)  translations = {};

gettext = tr = _ = function (msg1, msg2, n) {
    if (n == null || n == 1)
        return translations[msg1] || msg1;
    else
        return translations[msg2] || msg2;
};
