let SelectFlexible=function(e,t){this.$body=$(document.body),null!=e.data("select-flexible")&&(this.$body.off(".select_flexible-"+this.id),this.$container.off(".select_flexible"),e.data("select-flexible").$container.remove(),e.removeData("select-flexible")),this.options=$.extend({multiple:!1,dimension:"single",eventClickOption:null,eventSelectOptions:null,eventClickResultOption:null},t),this.container=this.render(),this.element=new SelectFlexibleElement(this.$container,this.options),this.element.render(e),this.id=this.element.generateId(),this.placeContainer(),e.data("select-flexible",this)};function SelectFlexibleBox(e,t){this.$container=e,this.options=t,this.boxArrow=new SelectFlexibleBoxArrow(e,t)}function SelectFlexibleBoxArrow(e,t){this.$container=e,this.options=t}function SelectFlexibleDropdown(e,t){this.$container=e,this.options=t,this.search=new SelectFlexibleSearch(this.$container,this.options),this.results=new SelectFlexibleResults(this.$container,this.options)}SelectFlexible.prototype.triggerEvent=function(){let e=Array.from(arguments),t=this.options[e.shift()];"function"==typeof t&&t.apply(null,e)},SelectFlexible.prototype.placeContainer=function(){this.box=new SelectFlexibleBox(this.$container,this.options),$(".box-wrapper",this.$container).append(this.box.render()),this.$container.insertAfter(this.$container.data("$element")),this.$container.css("width",this.$container.data("$element").outerWidth(!1)+"px"),this.registerEvents()},SelectFlexible.prototype.render=function(){let e=$('<span class="select-flexible select-flexible-container" data-id="'+this.id+'"><span class="box-wrapper"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return this.$container=e,e},SelectFlexible.prototype.registerEvents=function(){this.$container.on("click_box.select_flexible click_box_arrow.select_flexible",(e,t,l)=>{this.displayDropdown(l)}).on("input_search.select_flexible",(e,t)=>{this.dropdown.results.filter(t.val())}).on("click_option.select_flexible",(e,t,l)=>{let i=this.element.getOptionsByValue(t.data("value"));this.dropdown.results.toggleSelectResults(t,l),this.element.toggleSelectOptions(i,l),this.triggerEvent("eventClickOption",t,i,l)}).on("toggle_select_options.select_flexible",(e,t,l)=>{this.triggerEvent("eventSelectOptions",t,l)}).on("click_result_option.select_flexible",(e,t,l)=>{let i=this.element.getOptionByValue(t.data("value"));this.dropdown.results.resultsOptions.toggleSelectResultsOptions(t,l),this.element.toggleSelectOptions(i,l);let s=i.val().split("][")[0],n=this.dropdown.results.getResultByValue(s);0===this.dropdown.results.resultsOptions.getSelectedResultOptions(n).length&&n.trigger("click.select_flexible"),this.triggerEvent("eventClickResultOption",t,i,l)}).on("close.select_flexible",()=>{this.displayDropdown(!1)})},SelectFlexible.prototype.displayDropdown=function(e){$(".select-flexible-box",this.$container).toggleClass("open",e),e?(this.dropdown=new SelectFlexibleDropdown(this.$container,this.options),this.$body.append(this.dropdown.render(this.id)),this.$container.data("$search").focus(),this.setSelected(this.element.getSelectedOptionsValues()),this.$body.on("mousedown.select_flexible-"+this.id,e=>{let t=$(e.target);t.closest(this.$container).length||t.closest(this.$container.data("$dropdown")).length||this.$container.trigger("close.select_flexible")}).on("keydown.select_flexible-"+this.id,e=>{"Escape"===e.key&&this.$container.trigger("close.select_flexible")})):(this.$body.off("mousedown.select_flexible-"+this.id).off("keydown.select_flexible-"+this.id),this.$container.data("$dropdown").remove(),this.$container.removeData("$dropdown").removeData("$search").removeData("$results"),delete this.dropdown)},SelectFlexible.prototype.setSelected=function(e){this.element.setSelectedOptions(e),void 0!==this.dropdown&&this.dropdown.results.setSelectedResults(e)},SelectFlexibleBox.prototype.render=function(){let e=this.resolveLabel(),t=$('<span class="select-flexible-box" title="'+e+'"><span class="select-flexible-box-label">'+e+"</span></span>");return this.$container.data("$box",t),t.append(this.boxArrow.render()),this.registerEvents(),t},SelectFlexibleBox.prototype.resolveLabel=function(){return this.$container.data("$element").data("label")},SelectFlexibleBox.prototype.registerEvents=function(){this.$container.data("$box").on("click.select_flexible",e=>{this.$container.trigger("click_box.select_flexible",[$(e.currentTarget),!$(".select-flexible-box",this.$container).hasClass("open")])})},SelectFlexibleBoxArrow.prototype.render=function(){let e=$('<span class="select-flexible-box-arrow" role="presentation"><b role="presentation"></b></span>');return this.$container.data("$boxArrow",e),this.registerEvents(),e},SelectFlexibleBoxArrow.prototype.registerEvents=function(){this.$container.data("$boxArrow").on("click.select_flexible",e=>{e.stopPropagation(),this.$container.trigger("click_box_arrow.select_flexible",[$(e.currentTarget),!$(".select-flexible-box",this.$container).hasClass("open")])})},SelectFlexibleDropdown.prototype.render=function(e){let t=$('<span class="select-flexible-container" data-container-id="'+e+'"><span class="select-flexible-dropdown"><span class="select-flexible-results '+this.options.dimension+'"></span></span></span>');this.$container.data("$dropdown",t);let l=this.$container.offset(),i={position:"absolute",left:l.left+"px",top:l.top+this.$container.outerHeight(!1)+"px",width:this.$container.outerWidth(!1)+"px"};return t.css(i),$(".select-flexible-dropdown",t).prepend(this.search.render()),$(".select-flexible-results",t).append(this.results.render()),t},SelectFlexibleDropdown.prototype.destroy=function(){this.$container.data("$dropdown").remove()};let SelectFlexibleElement=function(e,t){this.$container=e,this.options=t};function SelectFlexibleResults(e,t){this.$container=e,this.options=t,"multi"===this.options.dimension&&(this.resultsOptions=new SelectFlexibleResultsOptions(e,t))}function SelectFlexibleResultsOptions(e,t){this.$container=e,this.options=t}function SelectFlexibleSearch(e,t){this.$container=e,this.options=t}SelectFlexibleElement.prototype.render=function(e){e.attr("hidden","true"),this.$container.data("$element",e);let t=this.getOptionsValues(this.getOptions());return this.$container.data("options-values",t),e},SelectFlexibleElement.prototype.generateId=function(){let e="";return null!=this.$container.data("$element").attr("id")?e=this.$container.data("$element").attr("id"):null!=this.$container.data("$element").attr("name")&&(e=this.$container.data("$element").attr("name")+"-"+Utils.generateChars(2)),e="select-flexible-"+(e=e.replace(/(:|\.|\[|\]|,)/g,""))},SelectFlexibleElement.prototype.getOptions=function(){return $("option",this.$container.data("$element"))},SelectFlexibleElement.prototype.getSelectedOptions=function(){return $("option:selected",this.$container.data("$element"))},SelectFlexibleElement.prototype.getSelectedOptionsValues=function(){return this.getSelectedOptions().map(function(){return $(this).attr("value")}).toArray()},SelectFlexibleElement.prototype.getOptionsSelector=function(e){return"[value='"+e.join("'],[value='")+"']"},SelectFlexibleElement.prototype.setSelectedOptions=function(e){if(0===e.length)return void this.toggleSelectOptions(this.getSelectedOptions(),!1);let t=this.getOptionsSelector(e);this.toggleSelectOptions($("option"+t,this.$container.data("$element")),!0),this.toggleSelectOptions($("option:not("+t+")",this.$container.data("$element")),!1)},SelectFlexibleElement.prototype.toggleSelectOptions=function(e,t){e.prop("selected",t),!this.options.multiple&&t&&this.$container.data("$element").find("option").not(e).prop("selected",!t)},SelectFlexibleElement.prototype.getOptionsValues=function(e){let t={};return"multi"===this.options.dimension?e.each(function(){let e=$(this),l=e.val().split("]["),i=e.data("name").split("][");void 0===t[l[0]]&&(t[l[0]]={title:i[0],values:{}}),t[l[0]].values[l[1]]={title:i[1]}}):e.each(function(){let e=$(this);t[e.val()]={title:e.text()}}),t},SelectFlexibleElement.prototype.getOptionsByValue=function(e){let t=null;return t="multi"===this.options.dimension?$("option[value='"+e+"]["+Object.keys(this.$container.data("options-values")[e].values).join("'],[value='"+e+"][")+"']",this.$container.data("$element")):this.getOptionByValue(e)},SelectFlexibleElement.prototype.getOptionByValue=function(e){return $("option[value='"+e+"']",this.$container.data("$element"))},SelectFlexibleResults.prototype.render=function(){let e=$('<ul class="select-flexible-results-container" role="tree"></ul>');return this.$container.data("$results",e),this.options.multiple&&e.attr("aria-multiselectable","true"),$.each(this.$container.data("options-values"),(t,l)=>{""!==t&&e.append(this.renderResult(t,l))}),this.registerEvents(),e},SelectFlexibleResults.prototype.renderResult=function(e,t){let l=null;return l="multi"===this.options.dimension?$('<li class="select-flexible-result" data-value="'+e+'" data-title="'+t.title.toLowerCase()+'"><span class="result-label">'+t.title+'</span><span class="result-options"></span></li>'):$('<li class="select-flexible-result" data-value="'+e+'" data-title="'+t.title.toLowerCase()+'">'+t.title+"</li>")},SelectFlexibleResults.prototype.registerEvents=function(){$("li.select-flexible-result",this.$container.data("$results")).on("click.select_flexible",e=>{let t=$(e.currentTarget);this.$container.trigger("click_option.select_flexible",[t,!t.hasClass("highlighted")])})},SelectFlexibleResults.prototype.filter=function(e){const t=e.toLowerCase();""!==e?($("li.select-flexible-result[data-title*='"+t+"']",this.$container.data("$results")).show(),$("li.select-flexible-result:not([data-title*='"+t+"'])",this.$container.data("$results")).hide()):$("li.select-flexible-result:hidden",this.$container.data("$results")).show()},SelectFlexibleResults.prototype.getResultsSelector=function(e){let t="";if("multi"===this.options.dimension){let l=[];$.each(e,function(){let e=this.split("][");l.includes(e[0])||l.push(e[0])}),t="[data-value='"+l.join("'],[data-value='")+"']"}else t="[data-value='"+e.join("'],[data-value='")+"']";return t},SelectFlexibleResults.prototype.getResultByValue=function(e){return $("li.select-flexible-result[data-value='"+e+"']",this.$container.data("$results"))},SelectFlexibleResults.prototype.toggleSelectResults=function(e,t){0!==e.length&&(e.toggleClass("highlighted",t),!this.options.multiple&&t&&this.$container.data("$results").find("li").not(e).toggleClass("highlighted",!t),"multi"===this.options.dimension&&(t?e.each((e,t)=>{let l=$(t),i=this.resultsOptions.getResultOptionsValues(l.data("value"),this.$container.data("options-values")[l.data("value")].values);$(".result-options",l).append(this.resultsOptions.render(i))}):e.each((e,t)=>{$(".result-options",$(t)).html("")})),this.$container.trigger("toggle_select_options.select_flexible",[e,t]))},SelectFlexibleResults.prototype.getSelectedResults=function(){return $("li.select-flexible-result.highlighted",this.$container.data("$results"))},SelectFlexibleResults.prototype.setSelectedResults=function(e){if(0===e.length)return void this.toggleSelectResults(this.getSelectedResults(),!1);let t=this.getResultsSelector(e);this.toggleSelectResults($("li.select-flexible-result"+t,this.$container.data("$results")),!0),this.toggleSelectResults($("li.select-flexible-result:not("+t+")",this.$container.data("$results")),!1),"multi"===this.options.dimension&&this.resultsOptions.setSelectedResultsOptions(e)},SelectFlexibleResultsOptions.prototype.render=function(e){let t=$('<ul class="select-flexible-result-options" role="tree"></ul>');$.each(e,function(e,l){t.append($('<li class="select-flexible-result-option" data-value="'+e+'"  title="'+l.title+'">'+l.title+"</li>"))});let l=this.getResultOptions(t);return this.registerEvents(l),this.toggleSelectResultsOptions(l,!0),t},SelectFlexibleResultsOptions.prototype.getResultOptions=function(e){return $("li.select-flexible-result-option",e)},SelectFlexibleResultsOptions.prototype.registerEvents=function(e){e.on("click.select_flexible",e=>{e.stopPropagation();let t=$(e.currentTarget);this.$container.trigger("click_result_option.select_flexible",[t,!t.hasClass("highlighted")])})},SelectFlexibleResultsOptions.prototype.getResultOptionsValues=function(e,t){let l={};return $.each(t,function(t,i){l[e+"]["+t]=i}),l},SelectFlexibleResultsOptions.prototype.getResultsOptionsSelector=function(e){return"[data-value='"+e.join("'],[data-value='")+"']"},SelectFlexibleResultsOptions.prototype.toggleSelectResultsOptions=function(e,t){e.toggleClass("highlighted",t)},SelectFlexibleResultsOptions.prototype.setSelectedResultsOptions=function(e){let t=this.getResultsOptionsSelector(e);this.toggleSelectResultsOptions($("li.select-flexible-result-option"+t,this.$container.data("$results")),!0),this.toggleSelectResultsOptions($("li.select-flexible-result-option:not("+t+")",this.$container.data("$results")),!1)},SelectFlexibleResultsOptions.prototype.getSelectedResultOptions=function(e){return $("li.select-flexible-result-option.highlighted",e)},SelectFlexibleSearch.prototype.render=function(){let e=$('<li class="select-flexible-search"><input class="select-flexible-search__field" type="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');return this.$container.data("$search",$("input",e)),this.registerEvents(),e},SelectFlexibleSearch.prototype.registerEvents=function(){this.$container.data("$search").on("input.select_flexible",e=>{e.stopPropagation(),this.$container.trigger("input_search.select_flexible",[$(e.currentTarget)])})},function(e){e.fn.selectFlexible=function(t){let l=Array.from(arguments),i=e(this);return i.each(function(){let i=e(this);if("string"==typeof t)switch(t){case"values":i.data("select-flexible").setSelected(l[1]);break;case"selectResultOptions":l[1].each((t,s)=>{i.data("select-flexible").$container.trigger("click_result_option.select_flexible",[e(s),l[2]])});break;default:console.error("Method does not allowed",t)}else t.multiple=t.multiple||void 0===t.multiple&&void 0!==i.attr("multiple"),new SelectFlexible(i,t)}),i}}(jQuery);