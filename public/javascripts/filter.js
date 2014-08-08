var g=[].slice;String.prototype.autoLink=function(){var e,b,d,a,c,f;c=1<=arguments.length?g.call(arguments,0):[];d="";a=c[0];f=/(^|\s)(\b(https?|ftp):\/\/[\-A-Z0-9+\u0026@#\/%?=~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~_|])/gi;if(!(0<c.length))return this.replace(f,"$1<a href='$2'>$2</a>");null!=a.callback&&"function"===typeof a.callback&&(e=a.callback,delete a.callback);for(b in a)c=a[b],d+=" "+b+"='"+c+"'";return this.replace(f,function(a,c,b){a=e&&e(b);return""+c+(a||"<a href='"+b+"'"+d+">"+b+"</a>")})};

/*! http://mths.be/visibility v1.0.5 by @mathias */
;(function(g,h,$,b){var e,i,f='onfocusin' in h&&'hasFocus' in h?'focusin focusout':'focus blur',d=['','moz','ms','o','webkit'],c=$.support,a=$.event;while((i=e=d.pop())!=b){i=(e?e+'H':'h')+'idden';if(c.pageVisibility=typeof h[i]=='boolean'){f=e+'visibilitychange';break}}$(/blur$/.test(f)?g:h).on(f,function(m){var l=m.type,j=m.originalEvent,k=j.toElement;if(!/^focus./.test(l)||(k==b&&j.fromElement==b&&j.relatedTarget==b)){a.trigger((i&&h[i]||/^(?:blur|focusout)$/.test(l)?'hide':'show')+'.visibility')}})}(this,document,jQuery));

(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);


// "hello world".score("axl") //=> 0.0
// "hello world".score("ow") //=> 0.6
// "hello world".score("hello world") //=> 1.0

(function( $ ) {
  var radioCheck = /radio|checkbox/i,
  keyBreaker = /[^\[\]]+/g,
    numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;

    var isNumber = function( value ) {
      if ( typeof value == 'number' ) {
        return true;
      }

      if ( typeof value != 'string' ) {
        return false;
      }

      return value.match(numberMatcher);
    };

    $.fn.extend({
    /**
     * @parent dom
     * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/form_params/form_params.js
     * @plugin jquery/dom/form_params
     * @test jquery/dom/form_params/qunit.html
     * 
     * Returns an object of name-value pairs that represents values in a form.  
     * It is able to nest values whose element's name has square brackets.
     * 
     * When convert is set to true strings that represent numbers and booleans will
     * be converted and empty string will not be added to the object. 
     * 
     * Example html:
     * @codestart html
     * &lt;form>
     *   &lt;input name="foo[bar]" value='2'/>
     *   &lt;input name="foo[ced]" value='4'/>
     * &lt;form/>
     * @codeend
     * Example code:
     * 
     *     $('form').formParams() //-> { foo:{bar:'2', ced: '4'} }
     * 
     * 
     * @demo jquery/dom/form_params/form_params.html
     * 
     * @param {Object} [params] If an object is passed, the form will be repopulated
     * with the values of the object based on the name of the inputs within
     * the form
     * @param {Boolean} [convert=false] True if strings that look like numbers 
     * and booleans should be converted and if empty string should not be added 
     * to the result. Defaults to false.
     * @return {Object} An object of name-value pairs.
*/
      formParams: function( params, convert ) {

        // Quick way to determine if something is a boolean
        if ( !! params === params ) {
          convert = params;
          params = null;
        }

        if ( params ) {
          return this.setParams( params );
        } else if ( this[0].nodeName.toLowerCase() == 'form' && this[0].elements ) {
          return jQuery(jQuery.makeArray(this[0].elements)).getParams(convert);
        }
        return jQuery("input[name], textarea[name], select[name]", this[0]).getParams(convert);
      },
      setParams: function( params ) {

        // Find all the inputs
        this.find("[name]").each(function() {

          var value = params[ $(this).attr("name") ],
          $this;

          // Don't do all this work if there's no value
          if ( value !== undefined ) {
            $this = $(this);

            // Nested these if statements for performance
            if ( $this.is(":radio") ) {
              if ( $this.val() == value ) {
                $this.attr("checked", true);
              }
            } else if ( $this.is(":checkbox") ) {
              // Convert single value to an array to reduce
              // complexity
              value = $.isArray( value ) ? value : [value];
              if ( $.inArray( $this.val(), value ) > -1) {
                $this.attr("checked", true);
              }
            } else {
              $this.val( value );
            }
          }
        });
      },
      getParams: function( convert ) {
        var data = {},
        current;

        convert = convert === undefined ? false : convert;

        this.each(function() {
          var el = this,
          type = el.type && el.type.toLowerCase();
          //if we are submit, ignore
          if ((type == 'submit') || !el.name ) {
            return;
          }

          var key = el.name,
          value = $.data(el, "value") || $.fn.val.call([el]),
          isRadioCheck = radioCheck.test(el.type),
          parts = key.match(keyBreaker),
          write = !isRadioCheck || !! el.checked,
          //make an array of values
          lastPart;

          if ( convert ) {
            if ( isNumber(value) ) {
              value = parseFloat(value);
            } else if ( value === 'true') {
              value = true;
            } else if ( value === 'false' ) {
              value = false;
            }
            if(value === '') {
              value = undefined;
            }
          }

          // go through and create nested objects
          current = data;
          for ( var i = 0; i < parts.length - 1; i++ ) {
            if (!current[parts[i]] ) {
              current[parts[i]] = {};
            }
            current = current[parts[i]];
          }
          lastPart = parts[parts.length - 1];

          //now we are on the last part, set the value
          if (current[lastPart]) {
            if (!$.isArray(current[lastPart]) ) {
              current[lastPart] = current[lastPart] === undefined ? [] : [current[lastPart]];
            }
            if ( write ) {
              current[lastPart].push(value);
            }
          } else if ( write || !current[lastPart] ) {

            current[lastPart] = write ? value : undefined;
          }

        });
        return data;
      }
    });

})(jQuery);

var sort_by;
(function() {
  // utility functions
  var default_cmp = function(a, b) {
    if (a == b) return 0;
    return a < b ? -1 : 1;
  },
  getCmpFunc = function(primer, reverse) {
    var cmp = default_cmp;
    if (primer) {
      cmp = function(a, b) {
        return default_cmp(primer(a), primer(b));
      };
    }
    if (reverse) {
      return function(a, b) {
        return -1 * cmp(a, b);
      };
    }
    return cmp;
  };

  // actual implementation
  sort_by = function() {
    var fields = [],
    n_fields = arguments.length,
    field, name, reverse, cmp;

    // preprocess sorting options
    for (var i = 0; i < n_fields; i++) {
      field = arguments[i];
      if (typeof field === 'string') {
        name = field;
        cmp = default_cmp;
      }
      else {
        name = field.name;
        cmp = getCmpFunc(field.primer, field.reverse);
      }
      fields.push({
        name: name,
        cmp: cmp
      });
    }

    return function(A, B) {
      var a, b, name, cmp, result;
      for (var i = 0, l = n_fields; i < l; i++) {
        result = 0;
        field = fields[i];
        name = field.name;
        cmp = field.cmp;

        result = cmp(A[name], B[name]);
        if (result !== 0) break;
      }
      return result;
    }
  }
}());


String.prototype.score = function(abbreviation, offset) {
  offset = offset || 0;

  if(abbreviation.length == 0) {
    return 0.9
  };

  if (abbreviation.length > this.length) {
    return 0.0
  };

  for (var i = abbreviation.length; i > 0; i--) {

    var sub_abbreviation = abbreviation.substring(0,i);

    var index = this.indexOf(sub_abbreviation);

    if (index < 0) {
      continue;
    };

    if (index + abbreviation.length > this.length + offset) {
      continue;
    };

    var next_string = this.substring(index+sub_abbreviation.length);
    var next_abbreviation = null;

    if (i >= abbreviation.length) {
      next_abbreviation = '';
    } else {
      next_abbreviation = abbreviation.substring(i);
    };

    var remaining_score = next_string.score(next_abbreviation,offset+index);

    if (remaining_score > 0) {
      var score = this.length-next_string.length;

      if (index != 0) {
        var j = 0;

        var c = this.charCodeAt(index-1);

        if (c==32 || c == 9) {

          for(var j=(index-2); j >= 0; j--) {
            c = this.charCodeAt(j);
            score -= ((c == 32 || c == 9) ? 1 : 0.15);
          };

        } else {
          score -= index;
        };

      };

      score += remaining_score * next_string.length;
      score /= this.length;
      return score;
    };
  };

  return 0.0;
};

(function($) {

  $.fn.filterItems = function(options) {

    $(this).on('keyup', function(e) {
      var search = $(this).val();

      if (!search || (search === "")) { $(options.parent).show() };

      if (search.length >= (options.delay || 1)) {
        $(options.by).each(function() {
          // var score = $.trim($(this).text().toLowerCase()).score(search);
          var score = $(this).text().toUpperCase().indexOf(search.toUpperCase()) >= 0;

          if (!score) {
            $(this).parents(options.parent).hide();
          } else {
            $(this).parents(options.parent).show();
          };

        });
      } else {
        $(options.parent).show();
      }


    });

    $(this).keypress(function(event) {
      if (event.keyCode == 13) {
        return false;
      }
    });

    return this;
  };

})(jQuery);

/*!
* TableSorter 2.7 min - Client-side table sorting with ease!
* Copyright (c) 2007 Christian Bach
*/
!function(g){g.extend({tablesorter:new function(){function d(c){"undefined"!==typeof console&&"undefined"!==typeof console.log?console.log(c):alert(c)}function v(c,b){d(c+" ("+((new Date).getTime()-b.getTime())+"ms)")}function p(c,b,a){if(!b)return"";var f=c.config,h=f.textExtraction,e="",e="simple"===h?f.supportsTextContent?b.textContent:g(b).text():"function"===typeof h?h(b,c,a):"object"===typeof h&&h.hasOwnProperty(a)?h[a](b,c,a):f.supportsTextContent?b.textContent:g(b).text();return g.trim(e)} function k(c){var b=c.config,a=g(c.tBodies).filter(":not(."+b.cssInfoBlock+")"),f,h,s,j,m,l,n="";if(0===a.length)return b.debug?d("*Empty table!* Not building a parser cache"):"";a=a[0].rows;if(a[0]){f=[];h=a[0].cells.length;for(s=0;s<h;s++){j=b.$headers.filter(":not([colspan])");j=j.add(b.$headers.filter('[colspan="1"]')).filter('[data-column="'+s+'"]:last');m=b.headers[s];l=e.getParserById(e.getData(j,m,"sorter"));b.empties[s]=e.getData(j,m,"empty")||b.emptyTo||(b.emptyToBottom?"bottom":"top"); b.strings[s]=e.getData(j,m,"string")||b.stringTo||"max";if(!l)a:{j=c;m=a;l=-1;for(var v=s,r=void 0,t=e.parsers.length,y=!1,q="",r=!0;""===q&&r;)l++,m[l]?(y=m[l].cells[v],q=p(j,y,v),j.config.debug&&d("Checking if value was empty on row "+l+", column: "+v+": "+q)):r=!1;for(r=1;r<t;r++)if(e.parsers[r].is(q,j,y)){l=e.parsers[r];break a}l=e.parsers[0]}b.debug&&(n+="column:"+s+"; parser:"+l.id+"; string:"+b.strings[s]+"; empty: "+b.empties[s]+"\n");f.push(l)}}b.debug&&d(n);return f}function q(c){var b= c.tBodies,a=c.config,f,h,s=a.parsers,j,m,l,n,k,r,q,y=[];a.cache={};if(!s)return a.debug?d("*Empty table!* Not building a cache"):"";a.debug&&(q=new Date);a.showProcessing&&e.isProcessing(c,!0);for(n=0;n<b.length;n++)if(a.cache[n]={row:[],normalized:[]},!g(b[n]).hasClass(a.cssInfoBlock)){f=b[n]&&b[n].rows.length||0;h=b[n].rows[0]&&b[n].rows[0].cells.length||0;for(m=0;m<f;++m)if(k=g(b[n].rows[m]),r=[],k.hasClass(a.cssChildRow))a.cache[n].row[a.cache[n].row.length-1]=a.cache[n].row[a.cache[n].row.length- 1].add(k);else{a.cache[n].row.push(k);for(l=0;l<h;++l)if(j=p(c,k[0].cells[l],l),j=s[l].format(j,c,k[0].cells[l],l),r.push(j),"numeric"===(s[l].type||"").toLowerCase())y[l]=Math.max(Math.abs(j),y[l]||0);r.push(a.cache[n].normalized.length);a.cache[n].normalized.push(r)}a.cache[n].colMax=y}a.showProcessing&&e.isProcessing(c);a.debug&&v("Building cache for "+f+" rows",q)}function t(c,b){var a=c.config,f=c.tBodies,h=[],d=a.cache,j,m,l,n,k,r,p,q,t,u,x;if(d[0]){a.debug&&(x=new Date);for(q=0;q<f.length;q++)if(j= g(f[q]),!j.hasClass(a.cssInfoBlock)){k=e.processTbody(c,j,!0);j=d[q].row;m=d[q].normalized;n=(l=m.length)?m[0].length-1:0;for(r=0;r<l;r++)if(u=m[r][n],h.push(j[u]),!a.appender||!a.removeRows){t=j[u].length;for(p=0;p<t;p++)k.append(j[u][p])}e.processTbody(c,k,!1)}a.appender&&a.appender(c,h);a.debug&&v("Rebuilt table",x);b||e.applyWidget(c);g(c).trigger("sortEnd",c)}}function C(c){var b,a,f,h=c.config,e=h.sortList,d=[h.cssAsc,h.cssDesc],m=g(c).find("tfoot tr").children().removeClass(d.join(" "));h.$headers.removeClass(d.join(" ")); f=e.length;for(b=0;b<f;b++)if(2!==e[b][1]&&(c=h.$headers.not(".sorter-false").filter('[data-column="'+e[b][0]+'"]'+(1===f?":last":"")),c.length))for(a=0;a<c.length;a++)c[a].sortDisabled||(c.eq(a).addClass(d[e[b][1]]),m.length&&m.filter('[data-column="'+e[b][0]+'"]').eq(a).addClass(d[e[b][1]]))}function E(c){var b=0,a=c.config,f=a.sortList,h=f.length,e=c.tBodies.length,d,m,l,n,k,r,p,q,t;if(!a.serverSideSorting&&a.cache[0]){a.debug&&(d=new Date);for(l=0;l<e;l++)k=a.cache[l].colMax,t=(r=a.cache[l].normalized)&& r[0]?r[0].length-1:0,r.sort(function(e,d){for(m=0;m<h;m++){n=f[m][0];q=f[m][1];p=/n/i.test(a.parsers&&a.parsers[n]?a.parsers[n].type||"":"")?"Numeric":"Text";p+=0===q?"":"Desc";/Numeric/.test(p)&&a.strings[n]&&(b="boolean"===typeof a.string[a.strings[n]]?(0===q?1:-1)*(a.string[a.strings[n]]?-1:1):a.strings[n]?a.string[a.strings[n]]||0:0);var j=g.tablesorter["sort"+p](c,e[n],d[n],n,k[n],b);if(j)return j}return e[t]-d[t]});a.debug&&v("Sorting on "+f.toString()+" and dir "+q+" time",d)}}function D(c, b){c.trigger("updateComplete");"function"===typeof b&&b(c[0])}function F(c,b,a){!1!==b?c.trigger("sorton",[c[0].config.sortList,function(){D(c,a)}]):D(c,a)}var e=this;e.version="2.7";e.parsers=[];e.widgets=[];e.defaults={theme:"default",widthFixed:!1,showProcessing:!1,headerTemplate:"{content}",onRenderTemplate:null,onRenderHeader:null,cancelSelection:!0,dateFormat:"mmddyyyy",sortMultiSortKey:"shiftKey",sortResetKey:"ctrlKey",usNumberFormat:!0,delayInit:!1,serverSideSorting:!1,headers:{},ignoreCase:!0, sortForce:null,sortList:[],sortAppend:null,sortInitialOrder:"asc",sortLocaleCompare:!1,sortReset:!1,sortRestart:!1,emptyTo:"bottom",stringTo:"max",textExtraction:"simple",textSorter:null,widgets:[],widgetOptions:{zebra:["even","odd"]},initWidgets:!0,initialized:null,tableClass:"tablesorter",cssAsc:"tablesorter-headerAsc",cssChildRow:"tablesorter-childRow",cssDesc:"tablesorter-headerDesc",cssHeader:"tablesorter-header",cssHeaderRow:"tablesorter-headerRow",cssIcon:"tablesorter-icon",cssInfoBlock:"tablesorter-infoOnly", cssProcessing:"tablesorter-processing",selectorHeaders:"> thead th, > thead td",selectorSort:"th, td",selectorRemove:".remove-me",debug:!1,headerList:[],empties:{},strings:{},parsers:[]};e.benchmark=v;e.construct=function(c){return this.each(function(){if(!this.tHead||0===this.tBodies.length||!0===this.hasInitialized)return this.config.debug?d("stopping initialization! No thead, tbody or tablesorter has already been initialized"):"";var b=g(this),a,f,h,s="",j,m,l,n,D=g.metadata;this.hasInitialized= !1;this.config={};a=g.extend(!0,this.config,e.defaults,c);g.data(this,"tablesorter",a);a.debug&&g.data(this,"startoveralltimer",new Date);a.supportsTextContent="x"===g("<span>x</span>")[0].textContent;a.supportsDataObject=1.4<=parseFloat(g.fn.jquery);a.string={max:1,min:-1,"max+":1,"max-":-1,zero:0,none:0,"null":0,top:!0,bottom:!1};/tablesorter\-/.test(b.attr("class"))||(s=""!==a.theme?" tablesorter-"+a.theme:"");b.addClass(a.tableClass+s);var r=[],P={},y=g(this).find("thead:eq(0), tfoot").children("tr"), I,J,x,z,N,B,K,Q,R,G;for(I=0;I<y.length;I++){N=y[I].cells;for(J=0;J<N.length;J++){z=N[J];B=z.parentNode.rowIndex;K=B+"-"+z.cellIndex;Q=z.rowSpan||1;R=z.colSpan||1;"undefined"===typeof r[B]&&(r[B]=[]);for(x=0;x<r[B].length+1;x++)if("undefined"===typeof r[B][x]){G=x;break}P[K]=G;g(z).attr({"data-column":G});for(x=B;x<B+Q;x++){"undefined"===typeof r[x]&&(r[x]=[]);K=r[x];for(z=G;z<G+R;z++)K[z]="x"}}}var L,A,O,S,M,H,T,w=this.config;w.headerList=[];w.headerContent=[];w.debug&&(T=new Date);S=w.cssIcon?'<i class="'+ w.cssIcon+'"></i>':"";r=g(this).find(w.selectorHeaders).each(function(a){A=g(this);L=w.headers[a];w.headerContent[a]=this.innerHTML;M=w.headerTemplate.replace(/\{content\}/g,this.innerHTML).replace(/\{icon\}/g,S);w.onRenderTemplate&&(O=w.onRenderTemplate.apply(A,[a,M]))&&"string"===typeof O&&(M=O);this.innerHTML='<div class="tablesorter-header-inner">'+M+"</div>";w.onRenderHeader&&w.onRenderHeader.apply(A,[a]);this.column=P[this.parentNode.rowIndex+"-"+this.cellIndex];var b=e.getData(A,L,"sortInitialOrder")|| w.sortInitialOrder;this.order=/^d/i.test(b)||1===b?[1,0,2]:[0,1,2];this.count=-1;"false"===e.getData(A,L,"sorter")?(this.sortDisabled=!0,A.addClass("sorter-false")):A.removeClass("sorter-false");this.lockedOrder=!1;H=e.getData(A,L,"lockedOrder")||!1;"undefined"!==typeof H&&!1!==H&&(this.order=this.lockedOrder=/^d/i.test(H)||1===H?[1,1,1]:[0,0,0]);A.addClass((this.sortDisabled?"sorter-false ":" ")+w.cssHeader);w.headerList[a]=this;A.parent().addClass(w.cssHeaderRow)});this.config.debug&&(v("Built headers:", T),d(r));a.$headers=r;a.parsers=k(this);a.delayInit||q(this);a.$headers.find("*").andSelf().filter(a.selectorSort).unbind("mousedown.tablesorter mouseup.tablesorter").bind("mousedown.tablesorter mouseup.tablesorter",function(c,d){var k=(this.tagName.match("TH|TD")?g(this):g(this).parents("th, td").filter(":last"))[0];if(1!==(c.which||c.button))return!1;if("mousedown"===c.type)return n=(new Date).getTime(),"INPUT"===c.target.tagName?"":!a.cancelSelection;if(!0!==d&&250<(new Date).getTime()-n)return!1; a.delayInit&&!a.cache&&q(b[0]);if(!k.sortDisabled){b.trigger("sortStart",b[0]);s=!c[a.sortMultiSortKey];k.count=c[a.sortResetKey]?2:(k.count+1)%(a.sortReset?3:2);a.sortRestart&&(f=k,a.$headers.each(function(){if(this!==f&&(s||!g(this).is("."+a.cssDesc+",."+a.cssAsc)))this.count=-1}));f=k.column;if(s){a.sortList=[];if(null!==a.sortForce){j=a.sortForce;for(h=0;h<j.length;h++)j[h][0]!==f&&a.sortList.push(j[h])}l=k.order[k.count];if(2>l&&(a.sortList.push([f,l]),1<k.colSpan))for(h=1;h<k.colSpan;h++)a.sortList.push([f+ h,l])}else if(a.sortAppend&&1<a.sortList.length&&e.isValueInArray(a.sortAppend[0][0],a.sortList)&&a.sortList.pop(),e.isValueInArray(f,a.sortList))for(h=0;h<a.sortList.length;h++)m=a.sortList[h],l=a.headerList[m[0]],m[0]===f&&(m[1]=l.order[l.count],2===m[1]&&(a.sortList.splice(h,1),l.count=-1));else if(l=k.order[k.count],2>l&&(a.sortList.push([f,l]),1<k.colSpan))for(h=1;h<k.colSpan;h++)a.sortList.push([f+h,l]);if(null!==a.sortAppend){j=a.sortAppend;for(h=0;h<j.length;h++)j[h][0]!==f&&a.sortList.push(j[h])}b.trigger("sortBegin", b[0]);setTimeout(function(){C(b[0]);E(b[0]);t(b[0])},1)}});a.cancelSelection&&a.$headers.each(function(){this.onselectstart=function(){return!1}});b.unbind("sortReset update updateCell addRows sorton appendCache applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave").bind("sortReset",function(){a.sortList=[];C(this);E(this);t(this)}).bind("update",function(c,f,h){g(a.selectorRemove,this).remove();a.parsers=k(this);q(this);F(b,f,h)}).bind("updateCell",function(c,f,h,e){var d,j,s;d=g(this).find("tbody"); c=d.index(g(f).parents("tbody").filter(":last"));var k=g(f).parents("tr").filter(":last");f=g(f)[0];d.length&&0<=c&&(j=d.eq(c).find("tr").index(k),s=f.cellIndex,d=this.config.cache[c].normalized[j].length-1,this.config.cache[c].row[this.config.cache[c].normalized[j][d]]=k,this.config.cache[c].normalized[j][s]=a.parsers[s].format(p(this,f,s),this,f,s),F(b,h,e))}).bind("addRows",function(c,f,e,d){var j=f.filter("tr").length,s=[],l=f[0].cells.length,m=g(this).find("tbody").index(f.closest("tbody")); a.parsers||(a.parsers=k(this));for(c=0;c<j;c++){for(h=0;h<l;h++)s[h]=a.parsers[h].format(p(this,f[c].cells[h],h),this,f[c].cells[h],h);s.push(a.cache[m].row.length);a.cache[m].row.push([f[c]]);a.cache[m].normalized.push(s);s=[]}F(b,e,d)}).bind("sorton",function(a,b,c,f){g(this).trigger("sortStart",this);var h,e,d,j=this.config;a=b||j.sortList;j.sortList=[];g.each(a,function(a,b){h=[parseInt(b[0],10),parseInt(b[1],10)];if(d=j.headerList[h[0]])j.sortList.push(h),e=g.inArray(h[1],d.order),d.count=0<= e?e:h[1]%(j.sortReset?3:2)});C(this);E(this);t(this,f);"function"===typeof c&&c(this)}).bind("appendCache",function(a,b,c){t(this,c);"function"===typeof b&&b(this)}).bind("applyWidgetId",function(b,c){e.getWidgetById(c).format(this,a,a.widgetOptions)}).bind("applyWidgets",function(a,b){e.applyWidget(this,b)}).bind("refreshWidgets",function(a,b,c){e.refreshWidgets(this,b,c)}).bind("destroy",function(a,b,c){e.destroy(this,b,c)});a.supportsDataObject&&"undefined"!==typeof b.data().sortlist?a.sortList= b.data().sortlist:D&&(b.metadata()&&b.metadata().sortlist)&&(a.sortList=b.metadata().sortlist);e.applyWidget(this,!0);0<a.sortList.length?b.trigger("sorton",[a.sortList,{},!a.initWidgets]):a.initWidgets&&e.applyWidget(this);if(this.config.widthFixed&&0===g(this).find("colgroup").length){var U=g("<colgroup>"),V=g(this).width();g("tr:first td",this.tBodies[0]).each(function(){U.append(g("<col>").css("width",parseInt(1E3*(g(this).width()/V),10)/10+"%"))});g(this).prepend(U)}a.showProcessing&&b.unbind("sortBegin sortEnd").bind("sortBegin sortEnd", function(a){e.isProcessing(b[0],"sortBegin"===a.type)});this.hasInitialized=!0;a.debug&&e.benchmark("Overall initialization time",g.data(this,"startoveralltimer"));b.trigger("tablesorter-initialized",this);"function"===typeof a.initialized&&a.initialized(this)})};e.isProcessing=function(c,b,a){var f=c.config;c=a||g(c).find("."+f.cssHeader);b?(0<f.sortList.length&&(c=c.filter(function(){return this.sortDisabled?!1:e.isValueInArray(parseFloat(g(this).attr("data-column")),f.sortList)})),c.addClass(f.cssProcessing)): c.removeClass(f.cssProcessing)};e.processTbody=function(c,b,a){if(a)return b.before('<span class="tablesorter-savemyplace"/>'),c=g.fn.detach?b.detach():b.remove();c=g(c).find("span.tablesorter-savemyplace");b.insertAfter(c);c.remove()};e.clearTableBody=function(c){g(c.tBodies).filter(":not(."+c.config.cssInfoBlock+")").empty()};e.destroy=function(c,b,a){var f=g(c),h=c.config,d=f.find("thead:first");c.hasInitialized=!1;d.find("tr:not(."+h.cssHeaderRow+")").remove();d.find(".tablesorter-resizer").remove(); e.refreshWidgets(c,!0,!0);f.removeData("tablesorter").unbind("sortReset update updateCell addRows sorton appendCache applyWidgetId applyWidgets refreshWidgets destroy mouseup mouseleave").find("."+h.cssHeader).unbind("click mousedown mousemove mouseup").removeClass(h.cssHeader+" "+h.cssAsc+" "+h.cssDesc).find(".tablesorter-header-inner").each(function(){""!==h.cssIcon&&g(this).find("."+h.cssIcon).remove();g(this).replaceWith(g(this).contents())});!1!==b&&f.removeClass(h.tableClass);"function"===typeof a&& a(c)};e.regex=[/(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,/(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,/^0x[0-9a-f]+$/i];e.sortText=function(c,b,a,f){if(b===a)return 0;var h=c.config,d=h.string[h.empties[f]||h.emptyTo],j=e.regex;if(""===b&&0!==d)return"boolean"===typeof d?d?-1:1:-d||-1;if(""===a&&0!==d)return"boolean"===typeof d?d?1:-1:d||1;if("function"===typeof h.textSorter)return h.textSorter(b,a,c,f);c=b.replace(j[0], "\\0$1\\0").replace(/\\0$/,"").replace(/^\\0/,"").split("\\0");f=a.replace(j[0],"\\0$1\\0").replace(/\\0$/,"").replace(/^\\0/,"").split("\\0");b=parseInt(b.match(j[2]),16)||1!==c.length&&b.match(j[1])&&Date.parse(b);if(a=parseInt(a.match(j[2]),16)||b&&a.match(j[1])&&Date.parse(a)||null){if(b<a)return-1;if(b>a)return 1}h=Math.max(c.length,f.length);for(b=0;b<h;b++){a=isNaN(c[b])?c[b]||0:parseFloat(c[b])||0;j=isNaN(f[b])?f[b]||0:parseFloat(f[b])||0;if(isNaN(a)!==isNaN(j))return isNaN(a)?1:-1;typeof a!== typeof j&&(a+="",j+="");if(a<j)return-1;if(a>j)return 1}return 0};e.sortTextDesc=function(c,b,a,f){if(b===a)return 0;var d=c.config,g=d.string[d.empties[f]||d.emptyTo];return""===b&&0!==g?"boolean"===typeof g?g?-1:1:g||1:""===a&&0!==g?"boolean"===typeof g?g?1:-1:-g||-1:"function"===typeof d.textSorter?d.textSorter(a,b,c,f):e.sortText(c,a,b)};e.getTextValue=function(c,b,a){if(b){var f=c.length,d=b+a;for(b=0;b<f;b++)d+=c.charCodeAt(b);return a*d}return 0};e.sortNumeric=function(c,b,a,f,d,g){if(b=== a)return 0;c=c.config;f=c.string[c.empties[f]||c.emptyTo];if(""===b&&0!==f)return"boolean"===typeof f?f?-1:1:-f||-1;if(""===a&&0!==f)return"boolean"===typeof f?f?1:-1:f||1;isNaN(b)&&(b=e.getTextValue(b,d,g));isNaN(a)&&(a=e.getTextValue(a,d,g));return b-a};e.sortNumericDesc=function(c,b,a,f,d,g){if(b===a)return 0;c=c.config;f=c.string[c.empties[f]||c.emptyTo];if(""===b&&0!==f)return"boolean"===typeof f?f?-1:1:f||1;if(""===a&&0!==f)return"boolean"===typeof f?f?1:-1:-f||-1;isNaN(b)&&(b=e.getTextValue(b, d,g));isNaN(a)&&(a=e.getTextValue(a,d,g));return a-b};e.characterEquivalents={a:"\u00e1\u00e0\u00e2\u00e3\u00e4\u0105\u00e5",A:"\u00c1\u00c0\u00c2\u00c3\u00c4\u0104\u00c5",c:"\u00e7\u0107\u010d",C:"\u00c7\u0106\u010c",e:"\u00e9\u00e8\u00ea\u00eb\u011b\u0119",E:"\u00c9\u00c8\u00ca\u00cb\u011a\u0118",i:"\u00ed\u00ec\u0130\u00ee\u00ef\u0131",I:"\u00cd\u00cc\u0130\u00ce\u00cf",o:"\u00f3\u00f2\u00f4\u00f5\u00f6",O:"\u00d3\u00d2\u00d4\u00d5\u00d6",ss:"\u00df",SS:"\u1e9e",u:"\u00fa\u00f9\u00fb\u00fc\u016f", U:"\u00da\u00d9\u00db\u00dc\u016e"};e.replaceAccents=function(c){var b,a="[",d=e.characterEquivalents;if(!e.characterRegex){e.characterRegexArray={};for(b in d)"string"===typeof b&&(a+=d[b],e.characterRegexArray[b]=RegExp("["+d[b]+"]","g"));e.characterRegex=RegExp(a+"]")}if(e.characterRegex.test(c))for(b in d)"string"===typeof b&&(c=c.replace(e.characterRegexArray[b],b));return c};e.isValueInArray=function(c,b){var a,d=b.length;for(a=0;a<d;a++)if(b[a][0]===c)return!0;return!1};e.addParser=function(c){var b, a=e.parsers.length,d=!0;for(b=0;b<a;b++)e.parsers[b].id.toLowerCase()===c.id.toLowerCase()&&(d=!1);d&&e.parsers.push(c)};e.getParserById=function(c){var b,a=e.parsers.length;for(b=0;b<a;b++)if(e.parsers[b].id.toLowerCase()===c.toString().toLowerCase())return e.parsers[b];return!1};e.addWidget=function(c){e.widgets.push(c)};e.getWidgetById=function(c){var b,a,d=e.widgets.length;for(b=0;b<d;b++)if((a=e.widgets[b])&&a.hasOwnProperty("id")&&a.id.toLowerCase()===c.toLowerCase())return a};e.applyWidget= function(c,b){var a=c.config,d=a.widgetOptions,h=a.widgets.sort().reverse(),k,j,m,l=h.length;j=g.inArray("zebra",a.widgets);0<=j&&(a.widgets.splice(j,1),a.widgets.push("zebra"));a.debug&&(k=new Date);for(j=0;j<l;j++)(m=e.getWidgetById(h[j]))&&(!0===b&&m.hasOwnProperty("init")?m.init(c,m,a,d):!b&&m.hasOwnProperty("format")&&m.format(c,a,d));a.debug&&v("Completed "+(!0===b?"initializing":"applying")+" widgets",k)};e.refreshWidgets=function(c,b,a){var f,h=c.config,k=h.widgets,j=e.widgets,m=j.length; for(f=0;f<m;f++)if(j[f]&&j[f].id&&(b||0>g.inArray(j[f].id,k)))h.debug&&d("Refeshing widgets: Removing "+j[f].id),j[f].hasOwnProperty("remove")&&j[f].remove(c,h,h.widgetOptions);!0!==a&&e.applyWidget(c,b)};e.getData=function(c,b,a){var d="";c=g(c);var e,k;if(!c.length)return"";e=g.metadata?c.metadata():!1;k=" "+(c.attr("class")||"");"undefined"!==typeof c.data(a)||"undefined"!==typeof c.data(a.toLowerCase())?d+=c.data(a)||c.data(a.toLowerCase()):e&&"undefined"!==typeof e[a]?d+=e[a]:b&&"undefined"!== typeof b[a]?d+=b[a]:" "!==k&&k.match(" "+a+"-")&&(d=k.match(RegExp(" "+a+"-(\\w+)"))[1]||"");return g.trim(d)};e.formatFloat=function(c,b){if("string"!==typeof c||""===c)return c;var a;c=(b&&b.config?!1!==b.config.usNumberFormat:"undefined"!==typeof b?b:1)?c.replace(/,/g,""):c.replace(/[\s|\.]/g,"").replace(/,/g,".");/^\s*\([.\d]+\)/.test(c)&&(c=c.replace(/^\s*\(/,"-").replace(/\)/,""));a=parseFloat(c);return isNaN(a)?g.trim(c):a};e.isDigit=function(c){return isNaN(c)?/^[\-+(]?\d+[)]?$/.test(c.toString().replace(/[,.'"\s]/g, "")):!0}}});var k=g.tablesorter;g.fn.extend({tablesorter:k.construct});k.addParser({id:"text",is:function(){return!0},format:function(d,v){var p=v.config;d=g.trim(p.ignoreCase?d.toLocaleLowerCase():d);return p.sortLocaleCompare?k.replaceAccents(d):d},type:"text"});k.addParser({id:"currency",is:function(d){return/^\(?\d+[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]|[\u00a3$\u20ac\u00a4\u00a5\u00a2?.]\d+\)?$/.test(d)},format:function(d,g){return k.formatFloat(d.replace(/[^\w,. \-()]/g,""),g)},type:"numeric"}); k.addParser({id:"ipAddress",is:function(d){return/^\d{1,3}[\.]\d{1,3}[\.]\d{1,3}[\.]\d{1,3}$/.test(d)},format:function(d,g){var p,u=d.split("."),q="",t=u.length;for(p=0;p<t;p++)q+=("00"+u[p]).slice(-3);return k.formatFloat(q,g)},type:"numeric"});k.addParser({id:"url",is:function(d){return/^(https?|ftp|file):\/\//.test(d)},format:function(d){return g.trim(d.replace(/(https?|ftp|file):\/\//,""))},type:"text"});k.addParser({id:"isoDate",is:function(d){return/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(d)}, format:function(d,g){return k.formatFloat(""!==d?(new Date(d.replace(/-/g,"/"))).getTime()||"":"",g)},type:"numeric"});k.addParser({id:"percent",is:function(d){return/(\d\s?%|%\s?\d)/.test(d)},format:function(d,g){return k.formatFloat(d.replace(/%/g,""),g)},type:"numeric"});k.addParser({id:"usLongDate",is:function(d){return/^[A-Z]{3,10}\.?\s+\d{1,2},?\s+(\d{4})(\s+\d{1,2}:\d{2}(:\d{2})?(\s+[AP]M)?)?$/i.test(d)},format:function(d,g){return k.formatFloat((new Date(d.replace(/(\S)([AP]M)$/i,"$1 $2"))).getTime()|| "",g)},type:"numeric"});k.addParser({id:"shortDate",is:function(d){return/^(\d{1,2}|\d{4})[\/\-\,\.\s+]\d{1,2}[\/\-\.\,\s+](\d{1,2}|\d{4})$/.test(d)},format:function(d,g,p,u){p=g.config;var q=p.headerList[u],t=q.shortDateFormat;"undefined"===typeof t&&(t=q.shortDateFormat=k.getData(q,p.headers[u],"dateFormat")||p.dateFormat);d=d.replace(/\s+/g," ").replace(/[\-|\.|\,]/g,"/");"mmddyyyy"===t?d=d.replace(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/,"$3/$1/$2"):"ddmmyyyy"===t?d=d.replace(/(\d{1,2})[\/\s](\d{1,2})[\/\s](\d{4})/, "$3/$2/$1"):"yyyymmdd"===t&&(d=d.replace(/(\d{4})[\/\s](\d{1,2})[\/\s](\d{1,2})/,"$1/$2/$3"));return k.formatFloat((new Date(d)).getTime()||"",g)},type:"numeric"});k.addParser({id:"time",is:function(d){return/^(([0-2]?\d:[0-5]\d)|([0-1]?\d:[0-5]\d\s?([AP]M)))$/i.test(d)},format:function(d,g){return k.formatFloat((new Date("2000/01/01 "+d.replace(/(\S)([AP]M)$/i,"$1 $2"))).getTime()||"",g)},type:"numeric"});k.addParser({id:"digit",is:function(d){return k.isDigit(d)},format:function(d,g){return k.formatFloat(d.replace(/[^\w,. \-()]/g, ""),g)},type:"numeric"});k.addParser({id:"metadata",is:function(){return!1},format:function(d,k,p){d=k.config;d=!d.parserMetadataName?"sortValue":d.parserMetadataName;return g(p).metadata()[d]},type:"numeric"});k.addWidget({id:"zebra",format:function(d,v,p){var u,q,t,C,E,D,F=RegExp(v.cssChildRow,"i"),e=g(d).children("tbody:not(."+v.cssInfoBlock+")");v.debug&&(E=new Date);for(d=0;d<e.length;d++)u=g(e[d]),D=u.children("tr").length,1<D&&(t=0,u=u.children("tr:visible"),u.each(function(){q=g(this);F.test(this.className)|| t++;C=0===t%2;q.removeClass(p.zebra[C?1:0]).addClass(p.zebra[C?0:1])}));v.debug&&k.benchmark("Applying Zebra widget",E)},remove:function(d,k){var p,u,q=g(d).children("tbody:not(."+k.cssInfoBlock+")"),t=(k.widgetOptions.zebra||["even","odd"]).join(" ");for(p=0;p<q.length;p++)u=g.tablesorter.processTbody(d,g(q[p]),!0),u.children().removeClass(t),g.tablesorter.processTbody(d,u,!1)}})}(jQuery);
