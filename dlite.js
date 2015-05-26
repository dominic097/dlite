(function() {
   "use strict";
    /** @namespace 
     *   @property {object} utils Will have all the jquery alternative utility functions
     *   @property {object} ajax An ajax utility similar to jquery ajax
     */
    var dG;

    /** constructor function
     *   @constructor 
     *   @param {String} _className className of the element 
     *   @param {Object} _el DOM Object - option argument, if passed then DOM search is made only inside the given document object
     */
    dG = window.dG = function(_className, _el) {
        return new dG.utils.init(_className, _el);
    };

    dG.utils = dG.prototype = {

        /**
         * Internal function that returns an efficient (for current engines) version
         * of the passed-in callback, to be repeatedly applied in other dG
         * functions.
         * @method optimizeCb
         * @param {function}
         * @param {Object}
         * @param {Number}
         */
        optimizeCb: function(func, context, argCount) {
            switch (argCount == null ? 1 : argCount) {
                case 1:
                    return function(value) {
                        return func.call(context, value);
                    };
                case 2:
                    return function(value, other) {
                        return func.call(context, value, other);
                    };
                case 3:
                    return function(value, index, collection) {
                        return func.call(context, value, index, collection);
                    };
                case 4:
                    return function(accumulator, value, index, collection) {
                        return func.call(context, accumulator, value, index, collection);
                    };
            }
            return function() {
                return func.apply(context, arguments);
            };
        },

        /**
         *   An iterator function alternative for foreach
         *   @method iterator
         *   @param {array} arr list of elements to iterate
         *   @param {function} a callback function which will be called at each iteration
         *   @param {bool} boolean, if passed true then iteration will happen from top to bottom, for false it will be vice versa. Note: bottom to top iteration will be always faster
         **/
        iterator: function(arr, callBack, fromTop) {
            var len = 0;
            if (!fromTop) {
                len = arr.length;
                while (len--) {
                    callBack(arr[len], len, this);
                }
            } else {
                len = 0;
                while (len < arr.length) {
                    callBack(arr[len], len, this);
                    len++;
                }
            }
        },

        /**
         * Helper function to hiding DOM by making display property as "none"
         * @method hide
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         */
        hide: function() {

            this.iterator(this.length ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]), function(_this) {
                if (typeof _this == 'object' && _this.style) {
                    _this.style.display = 'none';
                }
            });

            return this;
        },

        /**
         * Helper function to show hidden DOM by making display property as "block"
         * @method show
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         */
        show: function() {
            this.iterator(this.length ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]), function(_this) {
                if (typeof _this == 'object' && _this.style) {
                    _this.style.display = 'block';
                }
            });
        },

        /**
         * Helper function to add Class to the respective DOM
         * @method addClass
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} className class name to be added
         */
        addClass: function(className) {
            var _this = this;
            _this.iterator(_this.length ? _this : [_this], function(obj) {
                if (obj.classList) {
                    var _classNameArr = className.split(' ');
                    if (_classNameArr.length > 0) {
                        _this.iterator(_classNameArr, function(_class) {
                            if (_class != undefined && _class.length > 0) {
                                obj.classList.add(_class);
                            }
                        });
                    }
                } else if (obj.hasOwnProperty('className')) {
                    obj.className += ' ' + className;
                }
            });
            return this;
        },

        /**
         * Helper function to remove Class
         * @method removeClass
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} className class name to be removed
         */
        removeClass: function(className) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
            _this.iterator(_this, function(obj) {
                if (obj.classList) {
                    var _classNameArr = className.split(' ');
                    if (_classNameArr.length > 0) {
                        _this.iterator(_classNameArr, function(_class) {
                            if (_class != undefined && _class.length > 0) {
                                obj.classList.remove(_class);
                            }
                        });
                    }
                } else if (obj.hasOwnProperty('className')) {
                    obj.className = obj.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            });
            return _this;
        },

        /**
         * Helper function to check the presence of class
         * @method hasClass
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} _className class name to be validated against
         */
        hasClass: function(_className) {
            var _this = this.length && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
            if (_this[0] && _this[0].classList) {
                return _this[0].classList.contains(_className);
            } else if (_this[0]) {
                return new RegExp('(^| )' + _className + '( |$)', 'gi').test(_this[0].className);
            } else {
                return false;
            }
        },

        /**
         * Helper function to append an HTML String after the current element as a sibling
         * @method after
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} htmlString HTML String needed to be appended
         */
        after: function(node, clone) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this[0] : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
            if (clone) {
                node = node.html().join();
            }
            this.iterator((this.length && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? [] : [this])), function(d) {
                if (typeof node === 'string') {
                    d.insertAdjacentHTML('afterend', node);
                } else {
                    _this.iterator((node.hasOwnProperty('length') && node.length > 0 ? node : [node]), function(_n) {
                        d.parentNode.insertBefore(_n, d.nextSibling);
                    });
                }
            });
            return _this;
        },

        /**
         * Helper function to append an HTML String before the current element as a sibling
         * @method before
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} htmlString HTML String needed to be appended
         */
        before: function(node, clone) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this[0] : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
            if (clone) {
                node = node.html().join();
            }
            this.iterator(_this, function(d) {
                if (typeof node === 'string') {
                    d.insertAdjacentHTML('beforebegin', node);
                } else {
                    _this.iterator((node.hasOwnProperty('length') && node.length > 0 ? node : [node]), function(_n) {
                        d.parentNode.insertBefore(_n, d);
                    });
                }
            });
            return _this;
        },

        /**
         * Helper function to get the children of a parent
         * @method children
         * @param {Object/Array} selector DOM element or first entity of array element
         */
        children: function() {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? [this[0]] : (this.hasOwnProperty('length') && this.length === 0 ? [] : [this]),
                children = [];
            this.iterator(_this, function(d) {
                for (var i = d.children.length; i--;) {
                    // Skip comment nodes on IE8
                    if (d.children[i].nodeType != 8)
                        children.unshift(d.children[i]);
                }
            });
            return new this.init(children);
        },

        /**
         * Helper function to clone the DOM Object
         * @method clone
         * @param {Object/Array} selector DOM element or first entity of array element
         */
        clone: function() {
            return _this[0] ? _this[0].cloneNode(true) : [];
        },

        /**
         * Helper function to find an HTML element using css selector
         * @method find
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         */
        find: function(selector) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]),
                __ = [];
            this.iterator(_this, function(obj) {
                _this.iterator((obj ? obj.querySelectorAll(selector ? selector : '') : []), function(o) {
                    __.push(o);
                });
            });
            return new this.init(__);

        },

        /**
         * Helper function to remove the children of the selected DOM
         * @method empty
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         */
        empty: function() {
            this.iterator(this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]), function(d) {
                while (d.firstChild) {
                    d.removeChild(d.firstChild);
                }
            });
            return this;
        },

        /**
         * Helper function to set or get an attribute for the DOM
         * @method attr
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} _attrName attribute key name
         * @param {String} _attrValue attribute value
         */
        attr: function(_attrName, _attrValue, callBack) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]),
                set = _attrValue && _attrName,
                props = typeof _attrName === 'object' ? _attrName : {
                    'attrName': _attrName,
                    'attrValue': _attrValue
                };
            this.iterator(_this, function(d) {
                if (set) {
                    if (callBack) {
                        callBack.call(this, props);
                    }
                    d.setAttribute(props.attrName, props.attrValue);
                }
            });
            return set ? this : (this.hasOwnProperty('length') && this.length > 0 && _this.length > 0 ? _this[0].getAttribute(_attrName) : '');
        },

        /**
         * Helper function that set/get HTML string of the appropriate DOM
         * @method html
         * @param {Object/Array} selector DOM element or first entity of array element
         * @param {String} htmlString if passed HTML string will be set to the selected DOM
         */
        html: function(htmlString) {
            if (!htmlString) {
                var _tempStrArr = [];
                this.iterator(this, function(obj) {
                    _tempStrArr.push(obj.outerHTML ? obj.outerHTML : '');
                });
                return _tempStrArr.length > 0 ? _tempStrArr : '';
            } else if (htmlString.length > 0 && this.length > 0) {
                this[0].innerHTML = htmlString;
                return this;
            }
            return this;
        },

        /**
         * Helper function to set/get text content
         * @method val
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} _txt text string to be set
         */
        val: function(_txt) {
            this.iterator((this.length && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? [] : [this])), function(d) {
                if (_txt) {
                    if (d.textContent !== undefined) {
                        d.textContent = _txt;
                    } else {
                        d.innerText = _txt;
                    }
                }
            });
            return this;
        },

        /**
         * Helper function that return offsetHeight of DOM
         * @method outerHeight
         * @param {Object/Array} selector DOM element or first entity of array element
         */
        outerHeight: function() {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]),
                _width = 0;
            this.iterator(_this, function(obj) {
                if (_width < obj.offsetHeight) {
                    _width = obj.offsetHeight;
                }
            });
            return _width;
        },

        /**
         * Helper function that return offsetHeight of DOM
         * @method outerWidth
         * @param {Object/Array} selector DOM element or first entity of array element
         */
        outerWidth: function() {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]),
                _width = 0;
            this.iterator(_this, function(obj) {
                if (_width < obj.offsetWidth) {
                    _width = obj.offsetWidth;
                }
            });
            return _width;
        },

        /**
         * Helper function that return parent of the DOM
         * @method parent
         * @param {Object/Array} selector DOM element or first entity of array element
         */
        parent: function() {
            return this[0] ? new this.init(this[0].parentNode) : null;
        },

        /**
         * Helper function which will return an array of parent node, parent className also can be passed to get a particular parent node
         * @method parents
         * @param {Object/String} wrapper DOM element class/DOM Object whose parent node to be found
         * @param {String} pClassName className of the parent element. To get/check the parent node exist pass the className of the parent Node as an option parameter
         */
        parents: function(wrapper, pClassName) {
            wrapper = wrapper.parentNode;
            while (wrapper && wrapper.className && wrapper.className.indexOf(pClassName) < 0) {
                if (wrapper.parentNode) {
                    wrapper = wrapper.parentNode;
                } else {
                    return wrapper.className.indexOf(pClassName) >= 0 ? wrapper : null;
                }
            }
            return wrapper.className && wrapper.className.indexOf(pClassName) >= 0 ? new this.init(wrapper) : null;
        },

        /**
         * Helper function to append an HTML DOM
         * @method append
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {Object} _el DOM Object needed to be appended
         */
        append: function(_el) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
            this.iterator(_this, function(d) {
                if (_el.hasOwnProperty('length') && _el.length > 0) {
                    _this.iterator(_el, function(_e) {
                        d.appendChild(_e);
                    });
                } else {
                    d.appendChild(_el);
                }
            });
            return _this;
        },


        /**
         * Helper function to prepend HTML elements
         * @method prepend
         * @param {Object/Array} selector DOM element or first entity of array element
         * @param {Object} _el DOM Object needed to be prepend
         */
        prepend: function(_el) {
            if (this.hasOwnProperty('length') && this.length > 0 && this.length > 0) {
                this[0].insertBefore(_el, this[0].firstChild);
            } else if (!this.hasOwnProperty('length') && this.length > 0) {
                this.insertBefore(_el, this.firstChild);
            }
        },

        /**
         * Helper function to remove particular DOM
         * @method remove
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         */
        remove: function() {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
            this.iterator(_this, function(d) {
                var pNode = d.parentNode;
                pNode.removeChild(d);
            });
            return _this;
        },

        /**
         * Helper function that return the siblings of selected DOM
         * @method siblings
         * @param {Object/Array} selector DOM element or first entity of array element
         */
        siblings: function(_class) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]),
                siblings = Array.prototype.slice.call(_this[0].parentNode.children),
                siblingNode = [];
            for (var i = siblings.length; i--;) {
                if (siblings[i] === _this[0]) {
                    siblings.splice(i, 1);
                    break;
                }
            }
            if (_class) {
                siblings.filter(function(el) {
                    if (dG(el).hasClass(_class)) {
                        siblingNode.push(dG(el));
                    }
                });
                return siblingNode;
            } else {
                return siblings;
            }
        },

        /**
         * Helper function to toggle class name
         * @method toggleClass
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         */
        toggleClass: function(className) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
            if (_this[0].classList) {
                _this[0].classList.toggle(className);
            } else {
                var classes = _this[0].className.split(' ');
                var existingIndex = -1;
                for (var i = classes.length; i--;) {
                    if (classes[i] === className)
                        existingIndex = i;
                }
                if (existingIndex >= 0) {
                    classes.splice(existingIndex, 1);
                } else {
                    classes.push(className);
                }
                this.className = classes.join(' ');
            }
            return _this;
        },

        /**
         * Helper function to set css properties
         * @method css
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {Object/String} _classRule Object to apply multiple styles or string to apply particular style. NOTE: value should be in "px" and javaScript style property notation should be used.
         */
        css: function(_classRule) {
            var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
            if (typeof _classRule === "string") {
                var key = arguments[0],
                    value = (arguments[1] ? arguments[1] : []);
                _classRule = {};
                _classRule[key] = typeof value === "number" ? value + "px" : value;
            }

            this.iterator(Object.keys(_classRule), function(k) {
                _this.iterator(_this, function(domObj) {
                    domObj.style[k] = typeof _classRule[k] === "number" ? _classRule[k] + "px" : _classRule[k];
                });
            });
            return _this;
        },

        /**
         * Helper function to remove event listener
         * @method off
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} eventName type of event
         * @param {String} eventHandler function ref
         */
        off: function(eventName, eventHandler) {
            if (this !== window && this.hasOwnProperty('length') && this.length <= 0) {
                return this;
            }
            this.iterator(this.length ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]), function(_this) {
                (function(el, eventName, handler, _data) {
                    this.data = _data;
                    if (eventName.split(',').length > 1) {
                        dG.iterator(eventName.split(','), function(e) {
                            if (el.removeEventListener) {
                                el.removeEventListener(e, handler, false);
                            } else {
                                el.detachEvent('on' + e, handler);
                            }
                        });
                    } else {
                        if (el.removeEventListener) {
                            el.removeEventListener(eventName, handler, false);
                        } else {
                            el.detachEvent('on' + eventName, handler);
                        }
                    }
                })(_this, eventName, eventHandler);
            });
            return this;
        },

        /**
         * Helper function to add event listener
         * @method off
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} eventName type of event
         * @param {String} eventHandler event callback function 
         * @param {String} payLoad receive arguments. can be accessed inside event callback as this.data<Object>
         */
        on: function(eventName, eventHandler, payLoad) {
            var _this = this;
            if (this !== window && this.hasOwnProperty('length') && this.length <= 0) {
                return this;
            }
            this.iterator(this.length ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]), function(_this) {
                (function(el, eventName, handler, _data) {
                    _this['data'] = _data ? _data : {};
                    if (eventName.split(',').length > 1) {
                        dG.iterator(eventName.split(','), function(e) {
                            if (el.addEventListener) {
                                el.addEventListener(e, handler, false);
                            } else {
                                el.attachEvent('on' + e, handler);
                            }
                        });
                    } else {
                        if (el.addEventListener) {
                            el.addEventListener(eventName, handler, false);
                        } else {
                            el.attachEvent('on' + eventName, handler);
                        }
                    }
                })(_this, eventName, eventHandler, payLoad);
            });
            return this;
        },

        /**
         * stimulates document ready
         * @method ready
         * @param {function} ready callback function to be called on document ready state
         */
        ready: function(fn) {
            (function(fn) {
                if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', fn);
                } else {
                    document.attachEvent('onreadystatechange', function() {
                        if (document.readyState === 'interactive')
                            fn();
                    });
                }
            })(fn);
            return this;
        },

        /**
         * Helper function to get or set scroll Left Prop
         * @method left
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} argument[0] type of event
         */
        left: function(pt) {
            if (pt !== undefined) {
                this.iterator(this.length ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]), function(d) {
                    d.scrollLeft = pt;
                });
            } else {
                var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
                return _this.length > 0 ? _this[0].scrollLeft : _this;
            }
        },

        /**
         * Helper function to get or set scroll Top Prop
         * @method top
         * @param {Object/Array} selector can be an array of DOM elements or single DOM elements
         * @param {String} argument[0] type of event
         */
        top: function(pt) {
            if (pt !== undefined) {
                this.iterator(this.length ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]), function(_this) {
                    _this.scrollTop = pt;
                });
            } else {
                var _this = this.hasOwnProperty('length') && this.length > 0 ? this : (this.hasOwnProperty('length') && this.length === 0 ? this : [this]);
                return _this.length > 0 ? _this[0].scrollTop : _this;
            }
        },

        max: function(attr, fn) {
            var _this = this,
                __ = [];
            if (Array.isArray(this) && this.length > 0) {
                if (arguments.length === 1 && attr !== undefined) {

                    return new this.init(__);
                } else if (argument.length === 2) {
                    return new this.init(__);
                } else {
                    return this;
                }
            }
        },


        /**
        * Sort the object's values by a criterion produced by an callback function or the attr specified
        * @method sort
        * @param {Boolean} isAsc
        * @param {String} dataType
        * @param {String} attr
        * @param {function} func 
        */

        sort: function(isAsc, dataType, attr, func) {
            var _this = this,
                __ = this.toArray(),
                _func,
                isAsc = isAsc ? isAsc : true,
                dataType = dataType ? dataType : "string";

            if (attr && typeof attr === "string") {
                func = function(obj) {
                    if (obj.hasOwnProperty('getAttribute') && obj.getAttribute(attr)) {
                        return obj.getAttribute(attr);
                    } else if (obj[attr]) {
                        return obj[attr];
                    }
                }
            } else if (attr && typeof attr === "function") {
                _func = attr;
            }

            return new this.init(__.sort(_this.__utils__.sortcb(isAsc, dataType, func)));

        },

        toArray: function(clone, sorted) {
            var _this = this,
                arr = [];
            _this.iterator(Object.keys(_this), function(key, index) {
                if (typeof _this[key] === "object") {
                    _this[key].key = key;
                    _this[key].index = _this[key].hasOwnProperty('index') ? _this[key].index : index;
                    if (clone) { /* To avoid unnecessary call to extend function, if condition handled */
                        arr[index] = dG.deepExtend({}, _this[key]);
                    } else {
                        arr[index] = _this[key];
                    }
                }
            }, true);
            return sorted ? arr : arr;
        },

        __utils__: {
            sortcb: function(isAsc, dataType, cb) {

                if (cb === undefined) {
                    cb = function(a) {
                        return a;
                    }
                }

                return function(a, b) {
                    var _a = cb(a),
                        _b = cb(b),
                        tempObj = document.createElement('div');
                    if (dataType === 'currency') {
                        _a = _a ? parseFloat(_a.toString().replace(/\$|\,/g, ''), 10) : 0;
                        _b = _b ? parseFloat(_b.toString().replace(/\$|\,/g, ''), 10) : 0;
                    } else if (dataType === 'number' || dataType === 'int') {
                        _a = _a ? parseInt(_a, 10) : 0;
                        _b = _b ? parseInt(_b, 10) : 0;
                    } else if (dataType === 'float') {
                        _a = _a ? parseFloat(_a, 10) : 0;
                        _b = _b ? parseFloat(_b, 10) : 0;
                    } else if (dataType === 'string' || dataType === 'char') {
                        _a = _a ? _a.toLowerCase() : '';
                        _b = _b ? _b.toLowerCase() : '';
                    } else if (dataType === 'csn') {
                        _a = _a ? parseFloat(_a.toString().replace(',', '')) : 0;
                        _b = _b ? parseFloat(_b.toString().replace(',', '')) : 0;
                    } else if (dataType === 'percentage') {
                        _a = _a ? parseFloat(_a.toString().replace('%', '')) : 0;
                        _b = _b ? parseFloat(_b.toString().replace('%', '')) : 0;
                    } else if (dataType === 'xml') {
                        tempObj.innerHTML = _a;
                        _a = tempObj.textContent;
                        tempObj.innerHTML = _b;
                        _b = tempObj.textContent;
                    }

                    if ((!_a || _a === -Infinity) && _a !== 0) {
                        return 1;
                    } else if ((!_b || _b === -Infinity) && _b !== 0) {
                        return -1;
                    } else return _a === _b ? 0 : isAsc ? ((_a < _b) ? -1 : 1) : ((_a > _b) ? -1 : 1);
                };
            }
        }
    }


    dG.utils.init = function(__, _el) {
        var _that = [],
            _selector = [];

        if (typeof __ !== "string") {
            if (!Array.isArray(__)) {
                _that = arguments[0] ? [arguments[0]] : [];
            } else if (Array.isArray(__)) {
                _that = arguments[0] ? arguments[0] : [];
            }
            return [].push.apply(this, _that);
        } else {
            if (__.split(',').length > 1) {
                _selector = __.split(',');
            } else {
                _selector = [__];
            }
            dG.iterator(_selector, function(s) {
                if (_el) {
                    var res = _el.querySelectorAll(s);
                    if (res.length > 0) {
                        _that = Array.prototype.slice.call(res).concat(_that);
                    }
                } else if (typeof s === "string") {
                    var res = document.querySelectorAll(s);
                    if (res.length > 0) {
                        _that = Array.prototype.slice.call(res).concat(_that);
                    }

                }
            });
            return [].push.apply(this, _that);
        }
    };

    /**
     * Helper function to merge two or more Objects. NOTE: will not do deep extend instead use deepExtend function\
     * @method extend
     * @param {Object} out An Object in which properties of another object will be copied
     */
    dG.extend = function(out) {
        // var _iterator = this.iterator;
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var _obj = arguments[i];
            if (!_obj) {
                continue;
            }
            dG.iterator(Object.keys(_obj), function(key) {
                if (_obj.hasOwnProperty(key))
                    out[key] = _obj[key];
            });
            return out;
        }
    };

    /**
     * Helper function to merge two or more Objects. NOTE: to performe deepExtend use extend function for improved performance
     * @method deepExtend
     * @param {Object} out An Object in which properties of another object will be copied
     */
    dG.deepExtend = function(out) {
        var _this = this;
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj)
                continue;

            dG.iterator(Object.keys(obj), function(key) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && obj[key] && !obj[key].hasOwnProperty('length'))
                        out[key] = _this.deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            });
        }

        return out;
    };

    /**
     * Helper function to raise AJAX request. This AJAX utility will also support defer call's.
     * @method ajax
     * @param {Object} proxy An Object in which all the information required to raise ajax request will be passed
     * @param {function} anonymous callback function, option parameter will be used only in defer state.
     */
    dG.ajax = function(proxy) {
        var _this = this;
        if (!_this.hasOwnProperty('_xhrRequestPool')) {
            _this['_xhrRequestPool'] = [];
        }
        if (!_this.hasOwnProperty('_xhrRequestPoolUID')) {
            _this['_xhrRequestPoolUID'] = [];
        }
        if (!_this.hasOwnProperty('_xhrRequestStack')) {
            _this['_xhrRequestStack'] = [];
        }

        if (_this._xhrRequestPool.length === 0) {
            if (_this.ajax.hasOwnProperty('__start__') && _this.ajax.__start__) {
                _this.ajax.__start__();
            }
        }

        if (Array.isArray(proxy) && proxy.length > 0) {
            var uID,
                _xhrStack = [];

            if (!_this.hasOwnProperty('responsePool')) {
                _this.responsePool = {};
            }

            uID = dG.random(0, 1000000000, Object.keys(_this.responsePool));

            if (!_this.responsePool.hasOwnProperty(uID)) {
                _this.responsePool[uID] = {};
            }
            _this.responsePool[uID]['requestCount'] = 0;
            _this.responsePool[uID]['responseCount'] = 0;
            _this.responsePool[uID]['length'] = proxy.length;
            _this.responsePool[uID]['response'] = {};
            _this.responsePool[uID]['callBack'] = arguments[1] ? arguments[1] : new Function();
            _this.responsePool[uID]['requestStack'] = [];
            _this.responsePool[uID]['deferredResponse'] = true;
            dG.iterator(proxy, function(_proxy) {
                var _requestUID = dG.random(0, 1000000000, Object.keys(_this.responsePool));
                _proxy['uID'] = _requestUID;
                _this.responsePool[uID]['requestStack'].push(_proxy);
                _proxy.callBack = function(_response) {
                    _this.responsePool[uID]['responseCount'] = parseInt(_this.responsePool[uID]['responseCount']) + 1;
                    _this.responsePool[uID].response[_requestUID] = _response;
                    if (_this.responsePool[uID]['responseCount'] === _this.responsePool[uID]['length']) {
                        _this.responsePool[uID]['callBack'](_this.responsePool[uID]);
                    } else {
                        console.log(_this.responsePool[uID]['responseCount']);
                    }
                }
                _this.responsePool[uID]['requestCount'] = parseInt(_this.responsePool[uID]['requestCount']) + 1;
                _xhrStack.push(_sendRequest(_proxy));
            });
            return _xhrStack;
        } else if (typeof proxy === "object") {
            return _sendRequest(proxy);
        }

        function _sendRequest(_proxy) {
            var _xhr = getXMLHttpRequest(),
                _uID = dG.random(0, 1000000000, dG._xhrRequestPoolUID);
            _xhr.onreadystatechange = xhr_success;
            _xhr.open((_proxy.type || 'POST'), (_proxy.url || ''), (_proxy.hasOwnProperty('async') && typeof _proxy.async !== 'undefined' ? _proxy.async : true));
            _xhr.setRequestHeader("Content-Type", 'application/json');
            _xhr['uID'] = _uID;
            dG._xhrRequestPoolUID.push(_uID);
            dG._xhrRequestPool.push(_xhr);
            dG._xhrRequestStack.push(_xhr);

            if (_proxy.type && _proxy.type.toLowerCase() === 'post') {
                _xhr.send(JSON.stringify(_proxy.param || {}));
                return _xhr;
            } else {
                _xhr.send();
                return _xhr;
            }

            function xhr_success(response) {
                if (_xhr.readyState != 4) {
                    return false;
                } else if (_xhr.status !== 200) {
                    if (_proxy.hasOwnProperty('error')) {
                        _proxy.error(this);
                    } else {
                        console.log("Response Error...");
                    }
                } else if (_xhr.status === 200 && dG._xhrRequestPoolUID.indexOf(_xhr.uID) >= 0) {
                    var _response = {};
                    if (_xhr.response && typeof _xhr.response !== "object" && isJsonRepsonse(_xhr.response)) {
                        _response = JSON.parse(_xhr.response);
                    }
                    _proxy.callBack(_response);
                    dG._xhrRequestPool = dG._xhrRequestPool.filter(function(_x, i) {
                        if (_x.uID != _xhr.uID) {
                            return _x;
                        }
                    });
                }

                if (dG._xhrRequestPool.length === 0) {
                    if (dG.ajax.hasOwnProperty('__end__') && dG.ajax.__end__) {
                        dG.ajax.__end__();
                    }
                }
            }
        }

        function getXMLHttpRequest() {
            if (window.XMLHttpRequest) {
                return new window.XMLHttpRequest;
            } else {
                try {
                    return new ActiveXObject("MSXML2.XMLHTTP.3.0");
                } catch (ex) {
                    return null;
                }
            }
        }

        function isJsonRepsonse(res) {
            return ((res.indexOf("{") > -1) && (res.indexOf("}") > -1))
        }
    };


    /**
     * will abort all the pending AJAX request / if the xhr obj is passed only that particular AJAX request will be terminated
     * @method abort
     * @param {Object} Object xhr Object.
     */
    dG.ajax.abort = function(xhrToDelete) {
        if (xhrToDelete && xhrToDelete.hasOwnProperty('uID')) {
            dG._xhrRequestPool = dG._xhrRequestPool.filter(function(_xhr, i) {
                if (_xhr.uID == xhrToDelete.uID) {
                    _xhr.abort();
                    delete dG._xhrRequestPool[i]
                } else {
                    return _xhr;
                }
            });
        } else if (Array.isArray(xhrToDelete) && xhrToDelete.length > 0) {
            dG.iterator(xhrToDelete, function(_xhr) {
                dG._xhrRequestPool = dG._xhrRequestPool.filter(function(_x, i) {
                    if (_x.uID == _xhr.uID) {
                        _x.abort();
                        delete dG._xhrRequestPool[i]
                    } else {
                        return _x;
                    }
                });
            });
        } else {
            dG.iterator(dG._xhrRequestPool, function(_xhr) {
                _xhr.abort();
            });
            dG._xhrRequestPool = [];
        }
        if (dG._xhrRequestPool.length === 0) {
            if (dG.ajax.hasOwnProperty('__end__') && dG.ajax.__end__) {
                dG.ajax.__end__();
            }
        }
    };

    /**
     * AJAX callback function. will be called before any AJAX request is made. part of AJAX life cycle.
     * @method start
     * @param {Object} __ Callback function to be called on start of / before the first AJAX request.
     */
    dG.ajax.start = function(__) {
        if (__) {
            this['__start__'] = __;
        }
    };

    /**
     * AJAX callback function. will be called at the end of all AJAX request is made. part of AJAX life cycle.
     * @method end
     * @param {Object} __ Callback function to be called at the end of the last AJAX request.
     */
    dG.ajax.end = function(__) {
        if (__) {
            this['__end__'] = __;
        }
    };

    /**
     * Returns an random integer number 
     * @method random
     * @param {Number/Float} min minimum range for genrating random number
     * @param {Number/Float} max maximum range for genrating random number
     * @param {Array} discard Array of number's to be discarded
     */
    dG.random = function(min, max, discard) {
        if (discard === 'undefined') {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else if (discard !== 'undefined' && Array.isArray(discard)) {
            var randomNumber = 0;
            do {
                randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            } while (!discard.indexOf(randomNumber) < 0);
            return randomNumber;
        }
    };

    /**
     *   An iterator function alternative for foreach
     *   @method iterator
     *   @param {array} arr list of elements to iterate
     *   @param {function} a callback function which will be called at each iteration
     *   @param {bool} boolean, if passed true then iteration will happen from top to bottom, for false it will be vice versa. Note: bottom to top iteration will be always faster
     **/
    dG.iterator = function(arr, callBack, fromTop) {
        var len = 0;
        if (!fromTop) {
            len = arr.length;
            while (len--) {
                callBack(arr[len], len, this);
            }
        } else {
            len = 0;
            while (len < arr.length) {
                callBack(arr[len], len, this);
                len++;
            }
        }
    };

    dG.utils.init.prototype = dG.utils;

})();
