function on (el, type, handler) {
    el.addEventListener(type, handler);
}

if (!Element.prototype.on) {
    Element.prototype.on = function (type, handler) {
        return on(this, type, handler);
    };
}

function off (el, type, handler) {
    el.removeEventListener(type, handler);
}

if (!Element.prototype.off) {
    Element.prototype.off = function (type, handler) {
        return off(this, type, handler);
    };
}

function live (event, selector, callback, context) {
    on(context || document, event, function (e) {
        var found, el = e.target || e.srcElement;
        while (el && el.matches && el !== context && !(found = el.matches(selector))) {
            el = el.parentElement;
        }

        if (found) { callback.call(el, e); }
    });
}

if (!Element.prototype.live) {
    Document.prototype.live = 
    Element.prototype.live = function (event, selector, callback) {
        var context = this;
        return live(event, selector, callback, context);
    };
}

if (!Element.prototype.parse) {
    Element.prototype.parse = function () {
        if (!(this instanceof Element) && this.tagName != 'FORM') {
            throw new Error('The first @param must be an <FROM> elemenet');
        }

        var Form = this;

        var Inputs = Array.from(Form.elements).filter((e) => {
            if (e.name && ((['checkbox', 'radio'].indexOf(e.type) === -1) || e.checked)) {
                return e;
            }
        });

        var contains_file = el('[type="file"]', Form);

        if (contains_file) { return new FormData(Form); }

        var params = {};

        for (var i = 0, len = Inputs.length; i < len; i++) {
            var Input = Inputs[i];

            var Arr = Input.name.split(/\[]/);

            if (Arr.length === 1) {
                params[Arr[0]] = Input.value;
            }

            else if (Arr.length === 2 && !Arr[1]) {
                if (!params[Arr[0]]) { params[Arr[0]] = []; }
                params[Arr[0]].push(Input.value); 
            }

            else {

                if (!params[Arr[0]]) { params[Arr[0]] = []; }

                var temp = {};

                if (!params[Arr[0]].length) {
                    temp[Arr[1]] = Input.value;
                    params[Arr[0]].push(temp);
                }

                else {
                    params[Arr[0]].forEach((e) => {
                        if (e && !e[Arr[1]]) {
                            e[Arr[1]] = Input.value;
                        }

                        else {
                            temp[Arr[1]] = Input.value;
                            params[Arr[0]].push(temp);
                        }
                    });
                }
            }
        }

        return params;
    };
}

function debounce (func, wait, immediate) {
    var timeout;

    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
    
        var callNow = immediate && !timeout;
    
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

if (!String.prototype.parse) {
    String.prototype.parse = function () {
        var hashes = this.slice(this.indexOf("?") + 1).split("&");
        return hashes.reduce(function (params, hash) {
            var arr = hash.split("="), item = {};
            item[arr[0]] = decodeURIComponent(arr[1]);
            return Object.assign(params, item);
        }, {});
    };
}

function el (sel, context) {
    if (sel.charAt(0) == '#' && sel.indexOf(' ') === -1) {
        return (context || document).getElementById(sel.slice(1));
    }
    return (context || document).querySelector(sel);
}

function one (el, type, handler) {
    var handle  = {},
        handler = handler;

    var _handler = function () {
        off(el, type, _handler);
        handler.apply(this, arguments);
    };

    on(el, type, _handler);

    handle.cancel = () => {
        off(el, type, _handler);
    };

    return handle;
}

function isValidJSON (text) {
    try {
        JSON.parse(text);
        return true;
    } catch (e) {
        return false;
    }
}

var Component = function () {

    const Make  = new Requests({});
    const Store = {};

    var parse = (str, array) => {
        var $string = str;

        if ('string' !== typeof $string) {
            throw new Error('');
        }

        if (!Array.isArray(array)) {
            throw new Error('');
        }

        for (var i = 0, len = array.length; i < len; i++) {
            var item = array[i];
            var find = 'undefined' !== typeof item.name ? item.name : '';
            var reg = new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}', 'g');

            if ((/[a-zA-Z\_]+/g).test($string)) {
                $string = $string.replace(reg, item.value);
            }

            else {
                throw new Error('Find statement does not match regular expression: /[a-zA-Z\_]+/');
            }
        }

        return $string;
    };

    var transform = (str) => {
        return document.createRange().createContextualFragment(str);
    };

    var get = (Name, fn) => {

        if ('string' !== typeof Name) {
            throw new Error();
        }

        var Index = Object.keys(Store).indexOf(Name);

        if (Index !== -1) {
            if ('function' === typeof fn) { fn(Store[Index]); }
            return Store[Index];
        }

        let Request = {
            url: `/components/${Name}.html`,
            method: 'GET',
        };

        Request.success = (Response) => {
            Store[Name] = Response;
            if ('function' === typeof fn) { fn(Response); }
        };

        Make.http(Request);
    };

    return { get, parse, transform };
}();