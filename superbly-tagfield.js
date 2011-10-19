/*!
 * superbly tagfield v0.1
 * http://www.superbly.ch
 *
 * Copyright 2011, Manuel Spierenburg
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.superbly.ch/licenses/mit-license.txt
 * http://www.superbly.ch/licenses/gpl-2.0.txt
 *
 * Date: Sun Apr 14 00:47:29 2011 -0500
 */
(function($){
    $.fn.superblyTagField = function(userOptions) {
        var settings = {
            allowNewTags:true,
            showTagsNumber:10,
			addItemOnBlur:false,
            preset:[],
            tags:[]
        };

        if(userOptions) {
            $.extend(settings, userOptions);
        }

        superblyTagField(this, settings);

        return this;
    };

    var keyMap = {
        downArrow:40,
        upArrow:38,
        enter:13,
        tab:9,
        backspace:8
    }
    function superblyTagField(tagField,settings) {

        var tags = settings.tags.sort();
        var preset = settings.preset;
        var allowNewTags = settings.allowNewTags;
        var showTagsNumber = settings.showTagsNumber;
		var addItemOnBlur = settings.addItemOnBlur;

        var tagstmp = tags.slice();

        // prepare needed vars
        var inserted = new Array();
        var selectedIndex = null;
        var currentValue = null;
        var currentItem = null;
        var hoverSuggestItems = false;

        tagField.css('display', 'none');

        var superblyMarkup = '<div class="superblyTagfieldDiv"><ul class="superblyTagItems"><li class="superblyTagInputItem"><input class="superblyTagInput" type="text" autocomplete="false"><ul class="superblySuggestItems"></ul></li></ul><div class="superblyTagfieldClearer"></div></div>';
        tagField.after(superblyMarkup);

        var tagInput = $(".superblyTagInput", tagField.next());
        var suggestList = tagInput.next();
        var inputItem = tagInput.parent();
        var tagList = inputItem.parent();

        // set presets
        for(i in preset){
            addItem(preset[i]);
        }

        // events
        suggestList.mouseover(function(e){
            hoverSuggestItems = true; 
        });

        suggestList.mouseleave(function(e){
            hoverSuggestItems = false; 
        });

        tagInput.keyup(function(e){
            suggest($(this).val());
        });

        tagInput.focusout(function(e){
            if(!hoverSuggestItems){
                suggestList.css('display', 'none');
            } 
        });

        tagInput.focus(function(e){
            currentValue = null;
        });

        tagInput.keydown(function(e){
            if(e.keyCode == keyMap.downArrow) {		
                selectDown();
            }else if(e.keyCode == keyMap.upArrow) {
                selectUp()
            }else if(e.keyCode == keyMap.enter || e.keyCode == keyMap.tab) {
                checkForItem();
                // prevent default action for enter
                return e.keyCode != keyMap.enter; 
            }else if(e.keyCode == keyMap.backspace){
                // backspace
                if(tagInput.val() == ''){
                    removeLastItem();
                }
                updateTagInputWidth();
            } else {
                updateTagInputWidth();
            }

        });

		if (addItemOnBlur) {
			tagInput.blur(function(e){
				checkForItem();
			});
		}

        tagList.parent().click(function(e){
            tagInput.focus();	
        });

        // functions 
        function setValue(){
            tagField.val(inserted.join(','));
        }

        function updateTagInputWidth()
        {
            /* 
            * To make tag wrapping behave as expected, dynamically adjust
            * the tag input's width to its content's width
            * The best way to get the content's width in pixels is to add it 
            * to the DOM, grab the width, then remove it from the DOM.
            */
            var temp = $("<span />").text(tagInput.val()).appendTo(inputItem);
            var width = temp.width();
            temp.remove();
            tagInput.width(width + 20);
        }

		function checkForItem(value){
			if(currentItem != null){
                addItem(currentItem);
            } else if(allowNewTags){
                var value = tagInput.val();
                if(value != null && value != ''){
                    addItem(value);
                }
            }
		}

        function addItem(value){
            var index = jQuery.inArray(value,tagstmp);
            if((jQuery.inArray(value,inserted) == -1) && ( index > -1 || allowNewTags)){
                //delete from tags
                if(index >-1){
                    tagstmp.splice(index,1);
                }
                inserted.push(value);
                inputItem.before("<li class='superblyTagItem'><span>" + value + "</span><a> x</a></li>");
                tagInput.val("");
                currentValue = null;
                currentItem = null;
                // add remove click event 
                var new_index = tagList.children('.superblyTagItem').size()-1;
                $(tagList.children('.superblyTagItem')[new_index]).children('a').click(function(e){
                    var value = $($(this).parent('.superblyTagItem').children('span')[0]).text();
                    removeItem(value);
                });
            }
            suggestList.css('display', 'none');
            updateTagInputWidth();
            tagInput.focus();
            setValue();
        }


        function removeItem(value){
            var index = jQuery.inArray(value,tags);
            var tmpIndex = jQuery.inArray(value,tagstmp);
            if(index > -1 && tmpIndex == -1){
                tagstmp.push(value);
            }
            index = jQuery.inArray(value,inserted);
            if(index > -1){
                inserted.splice(index,1);
                tagList.children(".superblyTagItem").filter(function(){return $('span', this).html() == value;}).remove();
            }
            tagstmp.sort();
            tagInput.focus();
            setValue();
        }

        function removeLastItem(){
            var last_index = inserted.length-1;
            var last_value = inserted[last_index];
            removeItem(last_value);
        }

        function getSuggestionsArray(value){
            var suggestions = new Array();
            var count = 0;
            for(key in tagstmp){
                if(showTagsNumber <= count){
                    break;
                }
                // if beginning is same
                var lower_case_tag = tagstmp[key].toLocaleLowerCase();
                var lower_cast_value = value.toLowerCase();
                if(lower_case_tag.indexOf(lower_cast_value) == 0){
                    suggestions.push(tagstmp[key]);
                    count++;
                }
            }
            return suggestions;
        }


        function suggest(value){
            suggestList.show();
            if(value == currentValue){
                return false;
            }
            currentValue = value;
            suggestList.empty();
            var suggestions = getSuggestionsArray(value);
            for(key in suggestions){
                suggestList.append("<li class='superblySuggestItem'>" + suggestions[key] + "</li>");
            }

            var suggestionItems = suggestList.children('.superblySuggestItem');

            // add click event to suggest items
            suggestionItems.click(function(e){
                addItem($(this).html());
            });

            selectedIndex=null;
            if(!allowNewTags){
                selectedIndex=0;
                $(suggestionItems[selectedIndex]).addClass("selected");	
                currentItem = $(suggestionItems[selectedIndex]).html();
            }
        }


        function selectDown(){
            var suggestions = suggestList.children('.superblySuggestItem');
            var size = suggestions.size();
            if(selectedIndex == null){
                selectedIndex=0;
            }else if(selectedIndex < size-1){
                $(suggestions[selectedIndex]).removeClass("selected");
                selectedIndex++;
            }
            $(suggestions[selectedIndex]).addClass("selected");
            currentItem = $(suggestions[selectedIndex]).html();
        }

        function selectUp(){
            if(selectedIndex == 0){
                selectedIndex=null;
                currentItem = null;
                tagInput.focus();
            } else if(selectedIndex >0){
                var suggestions = suggestList.children('.superblySuggestItem');
                $(suggestions[selectedIndex]).removeClass("selected");
                selectedIndex--;
                $(suggestions[selectedIndex]).addClass("selected");
                currentItem = $(suggestions[selectedIndex]).html();
            }
        }
    }
})(jQuery);