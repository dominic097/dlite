(function() {
    "use strict";

    var d = {},
        D = {};

    /** constructor function
     *   @constructor 
     *   @param {String} _className className of the element 
     *   @param {Object} _el DOM Object - option argument, if passed then DOM search is made only inside the given document object
     */
    d = window.d = function(_className, _el) {
        return new d.utils.init(_className, _el);
    };

    /** constructor function
     *   @constructor that can memorize parameter and return faster results
     *   @param {String} _className className of the element 
     *   @param {Object} _el DOM Object - option argument, if passed then DOM search is made only inside the given document object
     */

    D = window.D = function(_className, _el) {

        var _id;

        if (!D.hasOwnProperty('__cache__')) {
            D['__cache__'] = {};
            D.__cache__['uIds'] = [];
        }

        _id = getUniqueId(_className, _el);

        if (!D.__cache__.hasOwnProperty(_id)) {
            D.__cache__[_id] = new d.utils.init(_className, _el);
        }

        return D.__cache__[_id];

        function getUniqueId(clName, elObj) {

            var _str = clName + ':';

            if (elObj) {
                if (elObj['id']) {
                    _str += elObj['id'];
                } else {
                    var _dId = d.utils.attrGetter.call(elObj, 'dId')
                    if (_dId) {
                        _str += d.utils.attrGetter.call(elObj, 'dId');
                    } else {
                        var _uniqueId = d.random(0, 1000000000, D.__cache__.uIds);
                        D.__cache__.uIds.push(_uniqueId);
                        _str += _uniqueId;
                        d.utils.attrSetter.call(elObj, 'dId', _uniqueId);
                    }
                }
            }

            return _str.replace(/ /g, '');
        }
    };

    d.utils = d.prototype = {


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
         * Attribute Setter function for DOM Manipulation
         * @method attrSetter
         * @param {String} attrName Name of the Attribute to set
         */
        attrSetter: function(attrName, atVal) {
            if (this.setAttribute) {
                this.setAttribute(attrName, atVal);
            } else if (this.attr) {
                this.attr(attrName, atVal);
            } else if (typeof this === "object") {
                this[attrName] = atVal;
            }
        },

        /**
         * Attribute Getter function for DOM Manipulation
         * @method attrGetter
         * @param {String} attrName Name of the Attribute to fetch
         */
        attrGetter: function(attrName) {
            if (this.getAttribute) {
                return this.getAttribute(attrName);
            } else if (this.attr) {
                return this.attr(attrName);
            } else if (typeof this === "object") {
                return this[attrName];
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

            this.iterator(_this, function(el) {
                if (set) {
                    if (callBack) {
                        callBack.call(el, props);
                    }

                    _this.attrSetter.call(el, props.attrName, props.attrValue);
                }
            });
            return set ? this : (this.hasOwnProperty('length') && this.length > 0 && _this.length > 0 ? _this.attrGetter.call(_this[0], _attrName) : '');
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
                    if (d(el).hasClass(_class)) {
                        siblingNode.push(d(el));
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
                        d.iterator(eventName.split(','), function(e) {
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
                        d.iterator(eventName.split(','), function(e) {
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
                        arr[index] = d.deepExtend({}, _this[key]);
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

    // core functionality comes under the 'core namespace'
    d.core = {};

    d.utils.init = function(__, _el) {
        var _that = [],
            _selector = [];

        // check for an Object / Array
        if (typeof __ !== "string") {

            if (!Array.isArray(__)) {
                _that = arguments[0] ? [arguments[0]] : [];
            } else if (Array.isArray(__)) {
                _that = arguments[0] ? arguments[0] : [];
            }
            return [].push.apply(this, _that);
        } else {

            if (_el) {
                _that = window.Sizzle(__, _el); //(_el.querySelectorAll ? _el.querySelectorAll(s) : (_el.find ? _el.find(s) : [])); //this.selector(s, _el);
            } else {
                _that = window.Sizzle(__); //document.querySelectorAll(s); //this.selector(s);
            }
            return [].push.apply(this, _that);
        }
    };

    d.utils.selector = function(clStr, domObj) {

        var results = [];

        this.booleans = /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i;
        this.classX = /^\.((?:\\.|[\w-]|[^\x00-\xa0])+)/g;
        this.idX = /^#((?:\\.|[\w-]|[^\x00-\xa0])+)/g;
        this.tag = /^((?:\\.|[\w-]|[^\x00-\xa0])+|[*])/g;
        this.attr = /^\[[\x20\t\r\n\f]*((?:\\.|[\w-]|[^\x00-\xa0])+)(?:[\x20\t\r\n\f]*([*^$|!~]?=)[\x20\t\r\n\f]*(?:'((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)"|((?:\\.|[\w-]|[^\x00-\xa0])+))|)[\x20\t\r\n\f]*\]/g;
        this.pseudos = /:((?:\\.|[\w-]|[^\x00-\xa0])+)(?:\((('((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)")|((?:\\.|[^\\()[\]]|\[[\x20\t\r\n\f]*((?:\\.|[\w-]|[^\x00-\xa0])+)(?:[\x20\t\r\n\f]*([*^$|!~]?=)[\x20\t\r\n\f]*(?:'((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)"|((?:\\.|[\w-]|[^\x00-\xa0])+))|)[\x20\t\r\n\f]*\])*)|.*)\)|)/g;
        this.nthContext = /^[\x20\t\r\n\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\([\x20\t\r\n\f]*((?:-\d)?\d*)[\x20\t\r\n\f]*\)|)(?=[^-]|$)/i;
        this.whitespace = /[\x20\t\r\n\f]+/g;

        if (!selector || typeof selector !== "string") {
            return results;
        }

        if (nodeType !== 1 && nodeType !== 9) {
            return [];
        }

        if (clStr.charAt(0) === "<" && clStr.charAt(clStr.length - 1) === ">" && clStr.length >= 3) {

        } else {

            var sel = tokenize(clStr);

            this.iterator(sel, function(sel, i) {
                switch (validate(sel)) {
                    case 'id':

                        break;
                    case 'class':
                        break;
                }
            }, true);
        }

        return res;

        function tokenize(cs) {
            return cs.replace(/ {1,}/g, ' ').split(' ');

        }

        function validate(sel) {
            //avoid spaces
            sel.replace(this.whitespace, '');

            return (sel.indexOf('#') === 0 ? 'id' :
                (sel.indexOf('.') === 0 ? 'class' : false));
        }

        function getElementById(s, c) {
            return document.getElementById
        }
    };

    /**
     * Helper function to merge two or more Objects. NOTE: will not do deep extend instead use deepExtend function\
     * @method extend
     * @param {Object} out An Object in which properties of another object will be copied
     */
    d.extend = function(out) {
        // var _iterator = this.iterator;
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var _obj = arguments[i];
            if (!_obj) {
                continue;
            }
            d.iterator(Object.keys(_obj), function(key) {
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
    d.deepExtend = function(out) {
        var _this = this;
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj)
                continue;

            d.iterator(Object.keys(obj), function(key) {
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
    d.ajax = function(proxy) {
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

            uID = d.random(0, 1000000000, Object.keys(_this.responsePool));

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
            d.iterator(proxy, function(_proxy) {
                var _requestUID = d.random(0, 1000000000, Object.keys(_this.responsePool));
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
                _uID = d.random(0, 1000000000, d._xhrRequestPoolUID);
            _xhr.onreadystatechange = xhr_success;
            _xhr.open((_proxy.type || 'POST'), (_proxy.url || ''), (_proxy.hasOwnProperty('async') && typeof _proxy.async !== 'undefined' ? _proxy.async : true));
            _xhr.setRequestHeader("Content-Type", 'application/json');
            _xhr['uID'] = _uID;
            d._xhrRequestPoolUID.push(_uID);
            d._xhrRequestPool.push(_xhr);
            d._xhrRequestStack.push(_xhr);

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
                } else if (_xhr.status === 200 && d._xhrRequestPoolUID.indexOf(_xhr.uID) >= 0) {
                    var _response = {};
                    if (_xhr.response && typeof _xhr.response !== "object" && isJsonRepsonse(_xhr.response)) {
                        _response = JSON.parse(_xhr.response);
                    }
                    _proxy.callBack(_response);
                    d._xhrRequestPool = d._xhrRequestPool.filter(function(_x, i) {
                        if (_x.uID != _xhr.uID) {
                            return _x;
                        }
                    });
                }

                if (d._xhrRequestPool.length === 0) {
                    if (d.ajax.hasOwnProperty('__end__') && d.ajax.__end__) {
                        d.ajax.__end__();
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
    d.ajax.abort = function(xhrToDelete) {
        if (xhrToDelete && xhrToDelete.hasOwnProperty('uID')) {
            d._xhrRequestPool = d._xhrRequestPool.filter(function(_xhr, i) {
                if (_xhr.uID == xhrToDelete.uID) {
                    _xhr.abort();
                    delete d._xhrRequestPool[i]
                } else {
                    return _xhr;
                }
            });
        } else if (Array.isArray(xhrToDelete) && xhrToDelete.length > 0) {
            d.iterator(xhrToDelete, function(_xhr) {
                d._xhrRequestPool = d._xhrRequestPool.filter(function(_x, i) {
                    if (_x.uID == _xhr.uID) {
                        _x.abort();
                        delete d._xhrRequestPool[i]
                    } else {
                        return _x;
                    }
                });
            });
        } else {
            d.iterator(d._xhrRequestPool, function(_xhr) {
                _xhr.abort();
            });
            d._xhrRequestPool = [];
        }
        if (d._xhrRequestPool.length === 0) {
            if (d.ajax.hasOwnProperty('__end__') && d.ajax.__end__) {
                d.ajax.__end__();
            }
        }
    };

    /**
     * AJAX callback function. will be called before any AJAX request is made. part of AJAX life cycle.
     * @method start
     * @param {Object} __ Callback function to be called on start of / before the first AJAX request.
     */
    d.ajax.start = function(__) {
        if (__) {
            this['__start__'] = __;
        }
    };

    /**
     * AJAX callback function. will be called at the end of all AJAX request is made. part of AJAX life cycle.
     * @method end
     * @param {Object} __ Callback function to be called at the end of the last AJAX request.
     */
    d.ajax.end = function(__) {
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
    d.random = function(min, max, discard) {
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
    d.iterator = function(arr, callBack, fromTop) {
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

    d.utils.init.prototype = d.utils;

    d.extend(Array.prototype, d.utils);

})();

! function(e) {
    function t(e, t, n, r) {
        var o, u, i, l, a, c, s, p = t && t.ownerDocument,
            h = t ? t.nodeType : 9;
        if (n = n || [], "string" != typeof e || !e || 1 !== h && 9 !== h && 11 !== h) return n;
        if (!r && ((t ? t.ownerDocument || t : z) !== B && q(t), t = t || B, $)) {
            if (11 !== h && (a = yt.exec(e)))
                if (o = a[1]) {
                    if (9 === h) {
                        if (!(i = t.getElementById(o))) return n;
                        if (i.id === o) return n.push(i), n
                    } else if (p && (i = p.getElementById(o)) && H(t, i) && i.id === o) return n.push(i), n
                } else {
                    if (a[2]) return Z.apply(n, t.getElementsByTagName(e)), n;
                    if ((o = a[3]) && x.getElementsByClassName && t.getElementsByClassName) return Z.apply(n, t.getElementsByClassName(o)), n
                }
            if (!(!x.qsa || V[e + " "] || P && P.test(e))) {
                if (1 !== h) p = t, s = e;
                else if ("object" !== t.nodeName.toLowerCase()) {
                    for ((l = t.getAttribute("id")) ? l = l.replace(wt, "\\$&") : t.setAttribute("id", l = O), c = D(e), u = c.length; u--;) c[u] = "[id='" + l + "'] " + d(c[u]);
                    s = c.join(","), p = vt.test(e) && f(t.parentNode) || t
                }
                if (s) try {
                    return Z.apply(n, p.querySelectorAll(s)), n
                } catch (g) {} finally {
                    l === O && t.removeAttribute("id")
                }
            }
        }
        return A(e.replace(lt, "$1"), t, n, r)
    }

    function n() {
        function e(n, r) {
            return t.push(n + " ") > b.cacheLength && delete e[t.shift()], e[n + " "] = r
        }
        var t = [];
        return e
    }

    function r(e) {
        return e[O] = !0, e
    }

    function o(e) {
        var t = B.createElement("div");
        try {
            return !!e(t)
        } catch (n) {
            return !1
        } finally {
            t.parentNode && t.parentNode.removeChild(t), t = null
        }
    }

    function u(e, t) {
        for (var n = e.split("|"), r = e.length; r--;) b.attrHandle[n[r]] = t
    }

    function i(e, t) {
        var n = t && e,
            r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || J) - (~e.sourceIndex || J);
        if (r) return r;
        if (n)
            for (; n = n.nextSibling;)
                if (n === t) return -1;
        return e ? 1 : -1
    }

    function l(e) {
        return function(t) {
            var n = t.nodeName.toLowerCase();
            return "input" === n && t.type === e
        }
    }

    function a(e) {
        return function(t) {
            var n = t.nodeName.toLowerCase();
            return ("input" === n || "button" === n) && t.type === e
        }
    }

    function c(e) {
        return r(function(t) {
            return t = +t, r(function(n, r) {
                for (var o, u = e([], n.length, t), i = u.length; i--;) n[o = u[i]] && (n[o] = !(r[o] = n[o]))
            })
        })
    }

    function f(e) {
        return e && "undefined" != typeof e.getElementsByTagName && e
    }

    function s() {}

    function d(e) {
        for (var t = 0, n = e.length, r = ""; n > t; t++) r += e[t].value;
        return r
    }

    function p(e, t, n) {
        var r = t.dir,
            o = n && "parentNode" === r,
            u = j++;
        return t.first ? function(t, n, u) {
            for (; t = t[r];)
                if (1 === t.nodeType || o) return e(t, n, u)
        } : function(t, n, i) {
            var l, a, c, f = [F, u];
            if (i) {
                for (; t = t[r];)
                    if ((1 === t.nodeType || o) && e(t, n, i)) return !0
            } else
                for (; t = t[r];)
                    if (1 === t.nodeType || o) {
                        if (c = t[O] || (t[O] = {}), a = c[t.uniqueID] || (c[t.uniqueID] = {}), (l = a[r]) && l[0] === F && l[1] === u) return f[2] = l[2];
                        if (a[r] = f, f[2] = e(t, n, i)) return !0
                    }
        }
    }

    function h(e) {
        return e.length > 1 ? function(t, n, r) {
            for (var o = e.length; o--;)
                if (!e[o](t, n, r)) return !1;
            return !0
        } : e[0]
    }

    function g(e, n, r) {
        for (var o = 0, u = n.length; u > o; o++) t(e, n[o], r);
        return r
    }

    function m(e, t, n, r, o) {
        for (var u, i = [], l = 0, a = e.length, c = null != t; a > l; l++)(u = e[l]) && (!n || n(u, r, o)) && (i.push(u), c && t.push(l));
        return i
    }

    function y(e, t, n, o, u, i) {
        return o && !o[O] && (o = y(o)), u && !u[O] && (u = y(u, i)), r(function(r, i, l, a) {
            var c, f, s, d = [],
                p = [],
                h = i.length,
                y = r || g(t || "*", l.nodeType ? [l] : l, []),
                v = !e || !r && t ? y : m(y, d, e, l, a),
                w = n ? u || (r ? e : h || o) ? [] : i : v;
            if (n && n(v, w, l, a), o)
                for (c = m(w, p), o(c, [], l, a), f = c.length; f--;)(s = c[f]) && (w[p[f]] = !(v[p[f]] = s));
            if (r) {
                if (u || e) {
                    if (u) {
                        for (c = [], f = w.length; f--;)(s = w[f]) && c.push(v[f] = s);
                        u(null, w = [], c, a)
                    }
                    for (f = w.length; f--;)(s = w[f]) && (c = u ? et(r, s) : d[f]) > -1 && (r[c] = !(i[c] = s))
                }
            } else w = m(w === i ? w.splice(h, w.length) : w), u ? u(null, i, w, a) : Z.apply(i, w)
        })
    }

    function v(e) {
        for (var t, n, r, o = e.length, u = b.relative[e[0].type], i = u || b.relative[" "], l = u ? 1 : 0, a = p(function(e) {
                return e === t
            }, i, !0), c = p(function(e) {
                return et(t, e) > -1
            }, i, !0), f = [function(e, n, r) {
                var o = !u && (r || n !== S) || ((t = n).nodeType ? a(e, n, r) : c(e, n, r));
                return t = null, o
            }]; o > l; l++)
            if (n = b.relative[e[l].type]) f = [p(h(f), n)];
            else {
                if (n = b.filter[e[l].type].apply(null, e[l].matches), n[O]) {
                    for (r = ++l; o > r && !b.relative[e[r].type]; r++);
                    return y(l > 1 && h(f), l > 1 && d(e.slice(0, l - 1).concat({
                        value: " " === e[l - 2].type ? "*" : ""
                    })).replace(lt, "$1"), n, r > l && v(e.slice(l, r)), o > r && v(e = e.slice(r)), o > r && d(e))
                }
                f.push(n)
            }
        return h(f)
    }

    function w(e, n) {
        var o = n.length > 0,
            u = e.length > 0,
            i = function(r, i, l, a, c) {
                var f, s, d, p = 0,
                    h = "0",
                    g = r && [],
                    y = [],
                    v = S,
                    w = r || u && b.find.TAG("*", c),
                    N = F += null == v ? 1 : Math.random() || .1,
                    x = w.length;
                for (c && (S = i === B || i || c); h !== x && null != (f = w[h]); h++) {
                    if (u && f) {
                        for (s = 0, i || f.ownerDocument === B || (q(f), l = !$); d = e[s++];)
                            if (d(f, i || B, l)) {
                                a.push(f);
                                break
                            }
                        c && (F = N)
                    }
                    o && ((f = !d && f) && p--, r && g.push(f))
                }
                if (p += h, o && h !== p) {
                    for (s = 0; d = n[s++];) d(g, y, i, l);
                    if (r) {
                        if (p > 0)
                            for (; h--;) g[h] || y[h] || (y[h] = W.call(a));
                        y = m(y)
                    }
                    Z.apply(a, y), c && !r && y.length > 0 && p + n.length > 1 && t.uniqueSort(a)
                }
                return c && (F = N, S = v), g
            };
        return o ? r(i) : i
    }
    var N, x, b, C, E, D, T, A, S, L, I, q, B, R, $, P, M, k, H, O = "sizzle" + 1 * new Date,
        z = e.document,
        F = 0,
        j = 0,
        G = n(),
        U = n(),
        V = n(),
        X = function(e, t) {
            return e === t && (I = !0), 0
        },
        J = 1 << 31,
        K = {}.hasOwnProperty,
        Q = [],
        W = Q.pop,
        Y = Q.push,
        Z = Q.push,
        _ = Q.slice,
        et = function(e, t) {
            for (var n = 0, r = e.length; r > n; n++)
                if (e[n] === t) return n;
            return -1
        },
        tt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        nt = "[\\x20\\t\\r\\n\\f]",
        rt = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        ot = "\\[" + nt + "*(" + rt + ")(?:" + nt + "*([*^$|!~]?=)" + nt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + rt + "))|)" + nt + "*\\]",
        ut = ":(" + rt + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ot + ")*)|.*)\\)|)",
        it = new RegExp(nt + "+", "g"),
        lt = new RegExp("^" + nt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + nt + "+$", "g"),
        at = new RegExp("^" + nt + "*," + nt + "*"),
        ct = new RegExp("^" + nt + "*([>+~]|" + nt + ")" + nt + "*"),
        ft = new RegExp("=" + nt + "*([^\\]'\"]*?)" + nt + "*\\]", "g"),
        st = new RegExp(ut),
        dt = new RegExp("^" + rt + "$"),
        pt = {
            ID: new RegExp("^#(" + rt + ")"),
            CLASS: new RegExp("^\\.(" + rt + ")"),
            TAG: new RegExp("^(" + rt + "|[*])"),
            ATTR: new RegExp("^" + ot),
            PSEUDO: new RegExp("^" + ut),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + nt + "*(even|odd|(([+-]|)(\\d*)n|)" + nt + "*(?:([+-]|)" + nt + "*(\\d+)|))" + nt + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + tt + ")$", "i"),
            needsContext: new RegExp("^" + nt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + nt + "*((?:-\\d)?\\d*)" + nt + "*\\)|)(?=[^-]|$)", "i")
        },
        ht = /^(?:input|select|textarea|button)$/i,
        gt = /^h\d$/i,
        mt = /^[^{]+\{\s*\[native \w/,
        yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        vt = /[+~]/,
        wt = /'|\\/g,
        Nt = new RegExp("\\\\([\\da-f]{1,6}" + nt + "?|(" + nt + ")|.)", "ig"),
        xt = function(e, t, n) {
            var r = "0x" + t - 65536;
            return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
        },
        bt = function() {
            q()
        };
    try {
        Z.apply(Q = _.call(z.childNodes), z.childNodes), Q[z.childNodes.length].nodeType
    } catch (Ct) {
        Z = {
            apply: Q.length ? function(e, t) {
                Y.apply(e, _.call(t))
            } : function(e, t) {
                for (var n = e.length, r = 0; e[n++] = t[r++];);
                e.length = n - 1
            }
        }
    }
    x = t.support = {}, E = t.isXML = function(e) {
        var t = e && (e.ownerDocument || e).documentElement;
        return t ? "HTML" !== t.nodeName : !1
    }, q = t.setDocument = function(e) {
        var t, n, r = e ? e.ownerDocument || e : z;
        return r !== B && 9 === r.nodeType && r.documentElement ? (B = r, R = B.documentElement, $ = !E(B), B.documentMode && (n = B.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", bt, !1) : n.attachEvent && n.attachEvent("onunload", bt)), x.attributes = o(function(e) {
            return e.className = "i", !e.getAttribute("className")
        }), x.getElementsByTagName = o(function(e) {
            return e.appendChild(B.createComment("")), !e.getElementsByTagName("*").length
        }), x.getElementsByClassName = mt.test(B.getElementsByClassName), x.getById = o(function(e) {
            return R.appendChild(e).id = O, !B.getElementsByName || !B.getElementsByName(O).length
        }), x.getById ? (b.find.ID = function(e, t) {
            if ("undefined" != typeof t.getElementById && $) {
                var n = t.getElementById(e);
                return n ? [n] : []
            }
        }, b.filter.ID = function(e) {
            var t = e.replace(Nt, xt);
            return function(e) {
                return e.getAttribute("id") === t
            }
        }) : (delete b.find.ID, b.filter.ID = function(e) {
            var t = e.replace(Nt, xt);
            return function(e) {
                var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                return n && n.value === t
            }
        }), b.find.TAG = x.getElementsByTagName ? function(e, t) {
            return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : x.qsa ? t.querySelectorAll(e) : void 0
        } : function(e, t) {
            var n, r = [],
                o = 0,
                u = t.getElementsByTagName(e);
            if ("*" === e) {
                for (; n = u[o++];) 1 === n.nodeType && r.push(n);
                return r
            }
            return u
        }, b.find.CLASS = x.getElementsByClassName && function(e, t) {
            return "undefined" != typeof t.getElementsByClassName && $ ? t.getElementsByClassName(e) : void 0
        }, M = [], P = [], (x.qsa = mt.test(B.querySelectorAll)) && (o(function(e) {
            R.appendChild(e).innerHTML = "<a id='" + O + "'></a><select id='" + O + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && P.push("[*^$]=" + nt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || P.push("\\[" + nt + "*(?:value|" + tt + ")"), e.querySelectorAll("[id~=" + O + "-]").length || P.push("~="), e.querySelectorAll(":checked").length || P.push(":checked"), e.querySelectorAll("a#" + O + "+*").length || P.push(".#.+[+~]")
        }), o(function(e) {
            var t = B.createElement("input");
            t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && P.push("name" + nt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || P.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), P.push(",.*:")
        })), (x.matchesSelector = mt.test(k = R.matches || R.webkitMatchesSelector || R.mozMatchesSelector || R.oMatchesSelector || R.msMatchesSelector)) && o(function(e) {
            x.disconnectedMatch = k.call(e, "div"), k.call(e, "[s!='']:x"), M.push("!=", ut)
        }), P = P.length && new RegExp(P.join("|")), M = M.length && new RegExp(M.join("|")), t = mt.test(R.compareDocumentPosition), H = t || mt.test(R.contains) ? function(e, t) {
            var n = 9 === e.nodeType ? e.documentElement : e,
                r = t && t.parentNode;
            return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
        } : function(e, t) {
            if (t)
                for (; t = t.parentNode;)
                    if (t === e) return !0;
            return !1
        }, X = t ? function(e, t) {
            if (e === t) return I = !0, 0;
            var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
            return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !x.sortDetached && t.compareDocumentPosition(e) === n ? e === B || e.ownerDocument === z && H(z, e) ? -1 : t === B || t.ownerDocument === z && H(z, t) ? 1 : L ? et(L, e) - et(L, t) : 0 : 4 & n ? -1 : 1)
        } : function(e, t) {
            if (e === t) return I = !0, 0;
            var n, r = 0,
                o = e.parentNode,
                u = t.parentNode,
                l = [e],
                a = [t];
            if (!o || !u) return e === B ? -1 : t === B ? 1 : o ? -1 : u ? 1 : L ? et(L, e) - et(L, t) : 0;
            if (o === u) return i(e, t);
            for (n = e; n = n.parentNode;) l.unshift(n);
            for (n = t; n = n.parentNode;) a.unshift(n);
            for (; l[r] === a[r];) r++;
            return r ? i(l[r], a[r]) : l[r] === z ? -1 : a[r] === z ? 1 : 0
        }, B) : B
    }, t.matches = function(e, n) {
        return t(e, null, null, n)
    }, t.matchesSelector = function(e, n) {
        if ((e.ownerDocument || e) !== B && q(e), n = n.replace(ft, "='$1']"), !(!x.matchesSelector || !$ || V[n + " "] || M && M.test(n) || P && P.test(n))) try {
            var r = k.call(e, n);
            if (r || x.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
        } catch (o) {}
        return t(n, B, null, [e]).length > 0
    }, t.contains = function(e, t) {
        return (e.ownerDocument || e) !== B && q(e), H(e, t)
    }, t.attr = function(e, t) {
        (e.ownerDocument || e) !== B && q(e);
        var n = b.attrHandle[t.toLowerCase()],
            r = n && K.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !$) : void 0;
        return void 0 !== r ? r : x.attributes || !$ ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
    }, t.error = function(e) {
        throw new Error("Syntax error, unrecognized expression: " + e)
    }, t.uniqueSort = function(e) {
        var t, n = [],
            r = 0,
            o = 0;
        if (I = !x.detectDuplicates, L = !x.sortStable && e.slice(0), e.sort(X), I) {
            for (; t = e[o++];) t === e[o] && (r = n.push(o));
            for (; r--;) e.splice(n[r], 1)
        }
        return L = null, e
    }, C = t.getText = function(e) {
        var t, n = "",
            r = 0,
            o = e.nodeType;
        if (o) {
            if (1 === o || 9 === o || 11 === o) {
                if ("string" == typeof e.textContent) return e.textContent;
                for (e = e.firstChild; e; e = e.nextSibling) n += C(e)
            } else if (3 === o || 4 === o) return e.nodeValue
        } else
            for (; t = e[r++];) n += C(t);
        return n
    }, b = t.selectors = {
        cacheLength: 50,
        createPseudo: r,
        match: pt,
        attrHandle: {},
        find: {},
        relative: {
            ">": {
                dir: "parentNode",
                first: !0
            },
            " ": {
                dir: "parentNode"
            },
            "+": {
                dir: "previousSibling",
                first: !0
            },
            "~": {
                dir: "previousSibling"
            }
        },
        preFilter: {
            ATTR: function(e) {
                return e[1] = e[1].replace(Nt, xt), e[3] = (e[3] || e[4] || e[5] || "").replace(Nt, xt), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
            },
            CHILD: function(e) {
                return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
            },
            PSEUDO: function(e) {
                var t, n = !e[6] && e[2];
                return pt.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && st.test(n) && (t = D(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
            }
        },
        filter: {
            TAG: function(e) {
                var t = e.replace(Nt, xt).toLowerCase();
                return "*" === e ? function() {
                    return !0
                } : function(e) {
                    return e.nodeName && e.nodeName.toLowerCase() === t
                }
            },
            CLASS: function(e) {
                var t = G[e + " "];
                return t || (t = new RegExp("(^|" + nt + ")" + e + "(" + nt + "|$)")) && G(e, function(e) {
                    return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                })
            },
            ATTR: function(e, n, r) {
                return function(o) {
                    var u = t.attr(o, e);
                    return null == u ? "!=" === n : n ? (u += "", "=" === n ? u === r : "!=" === n ? u !== r : "^=" === n ? r && 0 === u.indexOf(r) : "*=" === n ? r && u.indexOf(r) > -1 : "$=" === n ? r && u.slice(-r.length) === r : "~=" === n ? (" " + u.replace(it, " ") + " ").indexOf(r) > -1 : "|=" === n ? u === r || u.slice(0, r.length + 1) === r + "-" : !1) : !0
                }
            },
            CHILD: function(e, t, n, r, o) {
                var u = "nth" !== e.slice(0, 3),
                    i = "last" !== e.slice(-4),
                    l = "of-type" === t;
                return 1 === r && 0 === o ? function(e) {
                    return !!e.parentNode
                } : function(t, n, a) {
                    var c, f, s, d, p, h, g = u !== i ? "nextSibling" : "previousSibling",
                        m = t.parentNode,
                        y = l && t.nodeName.toLowerCase(),
                        v = !a && !l,
                        w = !1;
                    if (m) {
                        if (u) {
                            for (; g;) {
                                for (d = t; d = d[g];)
                                    if (l ? d.nodeName.toLowerCase() === y : 1 === d.nodeType) return !1;
                                h = g = "only" === e && !h && "nextSibling"
                            }
                            return !0
                        }
                        if (h = [i ? m.firstChild : m.lastChild], i && v) {
                            for (d = m, s = d[O] || (d[O] = {}), f = s[d.uniqueID] || (s[d.uniqueID] = {}), c = f[e] || [], p = c[0] === F && c[1], w = p && c[2], d = p && m.childNodes[p]; d = ++p && d && d[g] || (w = p = 0) || h.pop();)
                                if (1 === d.nodeType && ++w && d === t) {
                                    f[e] = [F, p, w];
                                    break
                                }
                        } else if (v && (d = t, s = d[O] || (d[O] = {}), f = s[d.uniqueID] || (s[d.uniqueID] = {}), c = f[e] || [], p = c[0] === F && c[1], w = p), w === !1)
                            for (;
                                (d = ++p && d && d[g] || (w = p = 0) || h.pop()) && ((l ? d.nodeName.toLowerCase() !== y : 1 !== d.nodeType) || !++w || (v && (s = d[O] || (d[O] = {}), f = s[d.uniqueID] || (s[d.uniqueID] = {}), f[e] = [F, w]), d !== t)););
                        return w -= o, w === r || w % r === 0 && w / r >= 0
                    }
                }
            },
            PSEUDO: function(e, n) {
                var o, u = b.pseudos[e] || b.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                return u[O] ? u(n) : u.length > 1 ? (o = [e, e, "", n], b.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                    for (var r, o = u(e, n), i = o.length; i--;) r = et(e, o[i]), e[r] = !(t[r] = o[i])
                }) : function(e) {
                    return u(e, 0, o)
                }) : u
            }
        },
        pseudos: {
            not: r(function(e) {
                var t = [],
                    n = [],
                    o = T(e.replace(lt, "$1"));
                return o[O] ? r(function(e, t, n, r) {
                    for (var u, i = o(e, null, r, []), l = e.length; l--;)(u = i[l]) && (e[l] = !(t[l] = u))
                }) : function(e, r, u) {
                    return t[0] = e, o(t, null, u, n), t[0] = null, !n.pop()
                }
            }),
            has: r(function(e) {
                return function(n) {
                    return t(e, n).length > 0
                }
            }),
            contains: r(function(e) {
                return e = e.replace(Nt, xt),
                    function(t) {
                        return (t.textContent || t.innerText || C(t)).indexOf(e) > -1
                    }
            }),
            lang: r(function(e) {
                return dt.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(Nt, xt).toLowerCase(),
                    function(t) {
                        var n;
                        do
                            if (n = $ ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                        while ((t = t.parentNode) && 1 === t.nodeType);
                        return !1
                    }
            }),
            target: function(t) {
                var n = e.location && e.location.hash;
                return n && n.slice(1) === t.id
            },
            root: function(e) {
                return e === R
            },
            focus: function(e) {
                return e === B.activeElement && (!B.hasFocus || B.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
            },
            enabled: function(e) {
                return e.disabled === !1
            },
            disabled: function(e) {
                return e.disabled === !0
            },
            checked: function(e) {
                var t = e.nodeName.toLowerCase();
                return "input" === t && !!e.checked || "option" === t && !!e.selected
            },
            selected: function(e) {
                return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
            },
            empty: function(e) {
                for (e = e.firstChild; e; e = e.nextSibling)
                    if (e.nodeType < 6) return !1;
                return !0
            },
            parent: function(e) {
                return !b.pseudos.empty(e)
            },
            header: function(e) {
                return gt.test(e.nodeName)
            },
            input: function(e) {
                return ht.test(e.nodeName)
            },
            button: function(e) {
                var t = e.nodeName.toLowerCase();
                return "input" === t && "button" === e.type || "button" === t
            },
            text: function(e) {
                var t;
                return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
            },
            first: c(function() {
                return [0]
            }),
            last: c(function(e, t) {
                return [t - 1]
            }),
            eq: c(function(e, t, n) {
                return [0 > n ? n + t : n]
            }),
            even: c(function(e, t) {
                for (var n = 0; t > n; n += 2) e.push(n);
                return e
            }),
            odd: c(function(e, t) {
                for (var n = 1; t > n; n += 2) e.push(n);
                return e
            }),
            lt: c(function(e, t, n) {
                for (var r = 0 > n ? n + t : n; --r >= 0;) e.push(r);
                return e
            }),
            gt: c(function(e, t, n) {
                for (var r = 0 > n ? n + t : n; ++r < t;) e.push(r);
                return e
            })
        }
    }, b.pseudos.nth = b.pseudos.eq;
    for (N in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) b.pseudos[N] = l(N);
    for (N in {
            submit: !0,
            reset: !0
        }) b.pseudos[N] = a(N);
    s.prototype = b.filters = b.pseudos, b.setFilters = new s, D = t.tokenize = function(e, n) {
        var r, o, u, i, l, a, c, f = U[e + " "];
        if (f) return n ? 0 : f.slice(0);
        for (l = e, a = [], c = b.preFilter; l;) {
            (!r || (o = at.exec(l))) && (o && (l = l.slice(o[0].length) || l), a.push(u = [])), r = !1, (o = ct.exec(l)) && (r = o.shift(), u.push({
                value: r,
                type: o[0].replace(lt, " ")
            }), l = l.slice(r.length));
            for (i in b.filter) !(o = pt[i].exec(l)) || c[i] && !(o = c[i](o)) || (r = o.shift(), u.push({
                value: r,
                type: i,
                matches: o
            }), l = l.slice(r.length));
            if (!r) break
        }
        return n ? l.length : l ? t.error(e) : U(e, a).slice(0)
    }, T = t.compile = function(e, t) {
        var n, r = [],
            o = [],
            u = V[e + " "];
        if (!u) {
            for (t || (t = D(e)), n = t.length; n--;) u = v(t[n]), u[O] ? r.push(u) : o.push(u);
            u = V(e, w(o, r)), u.selector = e
        }
        return u
    }, A = t.select = function(e, t, n, r) {
        var o, u, i, l, a, c = "function" == typeof e && e,
            s = !r && D(e = c.selector || e);
        if (n = n || [], 1 === s.length) {
            if (u = s[0] = s[0].slice(0), u.length > 2 && "ID" === (i = u[0]).type && x.getById && 9 === t.nodeType && $ && b.relative[u[1].type]) {
                if (t = (b.find.ID(i.matches[0].replace(Nt, xt), t) || [])[0], !t) return n;
                c && (t = t.parentNode), e = e.slice(u.shift().value.length)
            }
            for (o = pt.needsContext.test(e) ? 0 : u.length; o-- && (i = u[o], !b.relative[l = i.type]);)
                if ((a = b.find[l]) && (r = a(i.matches[0].replace(Nt, xt), vt.test(u[0].type) && f(t.parentNode) || t))) {
                    if (u.splice(o, 1), e = r.length && d(u), !e) return Z.apply(n, r), n;
                    break
                }
        }
        return (c || T(e, s))(r, t, !$, n, !t || vt.test(e) && f(t.parentNode) || t), n
    }, x.sortStable = O.split("").sort(X).join("") === O, x.detectDuplicates = !!I, q(), x.sortDetached = o(function(e) {
        return 1 & e.compareDocumentPosition(B.createElement("div"))
    }), o(function(e) {
        return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
    }) || u("type|href|height|width", function(e, t, n) {
        return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
    }), x.attributes && o(function(e) {
        return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
    }) || u("value", function(e, t, n) {
        return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
    }), o(function(e) {
        return null == e.getAttribute("disabled")
    }) || u(tt, function(e, t, n) {
        var r;
        return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
    }), "function" == typeof define && define.amd ? define(function() {
        return t
    }) : "undefined" != typeof module && module.exports ? module.exports = t : e.Sizzle = t
}(window);
