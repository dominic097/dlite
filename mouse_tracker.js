var globalTracker = {},
     jQstr = {
        'click': [],
        'focus': [],
        'blur': [],
        'val': [],
        'text': []
     };

 (function (source, callback) {
        var script = document.createElement('script');
        var prior = document.getElementsByTagName('script')[0];
        script.async = 1;
        prior.parentNode.insertBefore(script, prior);
        script.src = source;

        script.onload = script.onreadystatechange = function( _, isAbort ) {
            if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
                script.onload = script.onreadystatechange = null;
                script = undefined;

                if(!isAbort) { if(callback) callback(); }
            }
        };
    })('https://rawgit.com/dominic097/dlite/master/dlite.js', function(){
        var eventLst = ["keyup", "keypress", "keydown", "focus", "click", "blur"],
            tagLst = ["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","br","button","canvas","caption","center","cite","code","col","colgroup","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h6","header","hr","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"],
            _tracker = {};

        _tracker['mouseEvents'] = {};       

        globalTracker.mouseEvents = _tracker.mouseEvents;

        /**
        * A global function exposed to start Mouse tracking 
        * @method start
        */
        globalTracker.start = function() {
            _tracker.getTrackerHistory();
            _tracker.init();
        }

        /**
        * A global function exposed to end Mouse tracking 
        * @method end
        */
        globalTracker.end = function() {
            _tracker.terminate();
            _tracker.genrateCssSelectors();
            _tracker.clearHistory();
        }

        /**
        * Initiate the tracker by binding listener to DOM
        * @method init
        */
        _tracker.init = function() {
            dG(tagLst.join(',')).on(eventLst.join(','), _tracker.evCallback);
            console.log('')
            dG('form, input[type=submit], a, button').on('click', _tracker.handelRedirect);
        }        


         _tracker.terminate = function() {
            dG(tagLst.join(',')).off(eventLst.join(','), _tracker.evCallback);
         }

         _tracker.evCallback = function(e){
            if(!_tracker.mouseEvents.hasOwnProperty(e.type)) {
                _tracker.mouseEvents[e.type] = {};
            }
            if(!_tracker.mouseEvents[e.type].hasOwnProperty(e.timeStamp)) {
                _tracker.mouseEvents[e.type][e.timeStamp] = e;
            }
        }

        _tracker.handelRedirect = function(e) {
            _tracker.genrateCssSelectors();
            _tracker.storeTrackerHistory();
        }



        /**
        * Get's the ID Attribute of an element
        * @method getId
        * @param {Object} DOM Object whose id attribute to return
        */
        _tracker.getId = function(el) {
            return dG(el).attr('id') || false;
        }

        /**
        * Get's the ID Attribute of an element
        * @method getClass
        * @param {Object} DOM Object whose class attribute to return
        */
        _tracker.getClass = function(el) {
            return dG(el).attr('class') || false;
        }

        /**
        * return's the jquery selector's as a string
        * @method getJcssQueryStr
        */ 
        _tracker.getJcssQueryStr = function(el) {
            // debugger;
            // console.log('');
            var _this = this,
                breakLoop = false,
                iterator = 0,
                cssQueryStr = [];

            if(el && el.hasOwnProperty('path')) {
                while(!breakLoop && el.path.length - 1 >= iterator ) {
                    (function(e) {
                        var id,
                            className;
                        id =  _this.getId(e);
                        className = _this.getClass(e);
                        if(id) {
                            cssQueryStr.push(e.tagName + '#' + id);
                            breakLoop = true;
                        }
                        else if(className) {
                            cssQueryStr.push(e.tagName + '.' + className.trim().replace( /\s+/g, '.' ));
                        }
                        else if (!id && !className) {
                            cssQueryStr.push(e.tagName);
                        }
                    })(el.path[iterator]);

                    iterator++;
                }

                return cssQueryStr.reverse().join(' ');
            }
        }

        /**
        * Genrate jQuery CSS selector for all mouse actions
        * @method genrateCssSelectors
        */ 
        _tracker.genrateCssSelectors = function() {
            var _this = this;
            dG.iterator(Object.keys(_tracker.mouseEvents), function(evt) {
                if(!_tracker.mouseEvents[evt].hasOwnProperty('jQ')) {
                    _tracker.mouseEvents[evt]['jQ'] = {};   
                }
                dG.iterator(Object.keys(_tracker.mouseEvents[evt]), function(e) {
                    if(e !== 'jQ') {
                        var qStr = '',
                            $qStr;
                        if($) {
                            qStr = _this.getJcssQueryStr(_tracker.mouseEvents[evt][e]);
                            $qStr = $(qStr);
                            if($qStr.length > 1) {
                                dG.iterator($qStr, function(q, i){
                                    if(q.getAttribute('data-tracker-id') == _tracker.mouseEvents[evt][e].target.getAttribute('data-tracker-id')) {
                                        _tracker.mouseEvents[evt]['jQ'][e] = {
                                            'cssQueryStr' : _this.getJcssQueryStr(_tracker.mouseEvents[evt][e]),
                                            '__DOM__' :  q,
                                        }
                                    }
                                });
                            }
                            else {
                                _tracker.mouseEvents[evt]['jQ'][e] = {
                                    'cssQueryStr' : _this.getJcssQueryStr(_tracker.mouseEvents[evt][e]),
                                    '__DOM__' :  $qStr,
                                }
                            }
                        }
                        else {
                            _tracker.mouseEvents[evt]['jQ'][e] = {
                                    'cssQueryStr' : _this.getJcssQueryStr(_tracker.mouseEvents[evt][e]),
                                    '__DOM__':  $qStr,
                                }
                        }
                        _tracker.mouseEvents[evt]['jQ'][e]['jQSelectors'] = _this.genratejQStatement(['click', 'focus', 'blur', 'val', 'text'], _tracker.mouseEvents[evt].jQ[e].cssQueryStr, _tracker.mouseEvents[evt].jQ[e]);
                        _tracker.jQStatementDispatcher(_tracker.mouseEvents[evt]['jQ'][e]['jQSelectors']);
                    }
                }); 
            });
        }

        _tracker.genratejQStatement = function(type, str, eObj) {
            var qArr = [];
            if(!Array.isArray(type)) {
                type = [type];
            }
            dG.iterator(type, function(t){
                switch(t) {
                    case 'click':
                        qArr.push('$(\'' + str + '\').trigger(\'click\')');
                    break;
                    case 'focus':
                         qArr.push('$(\'' + str + '\').focus()');
                    break;
                    case 'blur':
                        qArr.push('$(\'' + str + '\').blur()');
                    break;
                    case 'val':
                        qArr.push('$(\'' + str + '\').val().trim()');
                    break;
                    case 'text':
                        qArr.push('$(\'' + str + '\').text().trim()');
                    break;
                    
                }
            });
            return qArr;
        }

        _tracker.jQStatementDispatcher = function(jQArr) {
            dG.iterator(jQArr, function(j){
                if(j.indexOf('click') >=0 && jQstr.click.indexOf(j) < 0) {
                    jQstr.click.push(j);
                }
                else if(j.indexOf('blur') >=0 && jQstr.blur.indexOf(j) < 0) {
                    jQstr.blur.push(j);
                }
                else if(j.indexOf('focus') >=0 && jQstr.focus.indexOf(j) < 0) {
                    jQstr.focus.push(j);
                }
                else if(j.indexOf('val') >=0 && jQstr.val.indexOf(j) < 0) {
                    jQstr.val.push(j);
                }
                else if(j.indexOf('text') >=0 && jQstr.text.indexOf(j) < 0) {
                    jQstr.text.push(j);
                } 

            });
            _tracker.storeTrackerHistory();
        }

        _tracker.storeTrackerHistory = function() {
            localStorage.setItem('tracker', JSON.stringify(jQstr));
        }

        _tracker.getTrackerHistory = function() {
            jQstr = JSON.parse(localStorage.getItem('tracker')) || jQstr;
        }

        _tracker.clearHistory = function() {
            localStorage.removeItem('tracker');
        }
});
