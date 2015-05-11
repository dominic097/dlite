 globalTracker = {};
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
        var eventLst = ["mouseup", "mouseover", "mouseout", "mouseleave", "mouseenter", "mousedown", " keyup", "keypress", "keydown", "focus", "dblclick", "click", "blur"],
            tagLst = ["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h6","head","header","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"],
            _tracker = {};
        globalTracker = _tracker;
        // console.log('tracker');
        dG(tagLst.join(',')).on(eventLst.join(','), function(e){
            // debugger;
            console.log();
            if(!_tracker.hasOwnProperty(e.type)) {
                _tracker[e.type] = {};
            }
            if(!_tracker[e.type].hasOwnProperty(e.timeStamp)) {
                _tracker[e.type][e.timeStamp] = e;
            }
            else {
                console.log('timeStamp conflict');
            }

            // e.stopPropagation();
        }).attr('data-tracker-id', 'n/a', function(vObj){ vObj.attrValue = dG.random(0, 10000000000, [])}); 
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
        * @method getJqueryStr
        */ 
        _tracker.getJqueryStr =  function(el) {
            debugger;
            console.log('');
            var _this = this,
                breakLoop = false,
                iterator = 0,
                queryStr = [];

            if(el && el.hasOwnProperty('path')) {
                while(!breakLoop && el.path.length - 1 >= iterator ) {
                    (function(e) {
                        var id,
                            className;
                        id =  _this.getId(e);
                        className = _this.getClass(e);
                        if(id) {
                            queryStr.push(e.tagName + '#' + id);
                            breakLoop = true;
                        }
                        else if(className) {
                            queryStr.push(e.tagName + '.' + className.replace(/ /g, '.'));
                        }
                        else if (!id && !className) {
                            queryStr.push(e.tagName);
                        }
                    })(el.path[iterator]);

                    iterator++;
                }

                return queryStr.reverse().join(' ');
            }
        }
        }
});
