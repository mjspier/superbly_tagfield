/*!
 * superbly tagfield v0.1
 * http://www.superbly.ch
 *
 * Copyright 2011, Manuel Spierenburg
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.superbly.ch/licenses/mit-license.txt
 * http://www.superbly.ch/licenses/gpl-2.0.txt
 *
 * Date: Sun Mar 6 13:55:29 2011 -0500
 */
(function($){
    $.fn.superblyTagField = function(userOptions) {
        var settings = {
            "allowNewTags":true,
            "showTagsNumber":10,
            "preset":[],
            "tags":[],
        };
        if(userOptions) {
            $.extend(settings, userOptions);
        }
        superblyTagField(this, settings);
        return this;
    };

    function superblyTagField(tagField,settings) {

        var tags = settings.tags.sort();
        var preset = settings.preset;
        var allowNewTags = settings.allowNewTags;
        var showTagsNumber = settings.showTagsNumber;

        var tagstmp = tags.slice();

        // prepare needed vars
        var inserted = new Array();
        var selectedIndex = null;
        var currentValue = null;
        var currentItem = null;
        var hoverSuggestItems = false;


        tagField.css('display', 'none');
        tagField.wrap('<li class="superblyTagInputItem" />');
        tagField.after('<ul class="superblySuggestItems" />');
        tagField.after('<input class="superblyTagInput" type="text" autocomplete="false" />');
        tagField.parent('.superblyTagInputItem').wrap('<ul class="superblyTagItems" />');
        tagField.parent('.superblyTagInputItem').parent('.superblyTagItems').wrap('<div class="superblyTagfieldDiv" />');
        tagField.parent('.superblyTagInputItem').parent('.superblyTagItems').parent('.superblyTagfieldDiv').append('<div class="superblyTagfieldClearer" />');


        // set presets
        for(i in preset){
            addItem(preset[i]);
        }

        // events
        tagField.siblings('.superblySuggestItems').mouseover(function(e){
            hoverSuggestItems = true; 
        });

        tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').mouseleave(function(e){
            hoverSuggestItems = false; 
        });

        tagField.siblings('.superblyTagInput').keyup(function(e){
            suggest($(this).val());
        });

        tagField.siblings('.superblyTagInput').focusout(function(e){
            if(!hoverSuggestItems){
                tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').css('display', 'none');
            } 
        });

        tagField.siblings('.superblyTagInput').focus(function(e){
            currentValue = null;
        });

        tagField.parent('.superblyTagInputItem').keydown(function(e){
            if(e.keyCode == 40) {		
                // arrow key down
                selectDown();
            }else if(e.keyCode == 38) {
                // arrow key up
                selectUp()
            }else if(e.keyCode == 13) {
                // enter
                if(currentItem != null){
                    addItem(currentItem);
                } else if(allowNewTags){
                    var value = tagField.siblings('.superblyTagInput').val();
                    if(value != null && value != ''){
                        addItem(value);
                    }
                }
                return false;
            }else if(e.keyCode == 8){
                // backspace
                if(tagField.siblings('.superblyTagInput').val() == ''){
                    removeLastItem();
                }
            }

        });

        tagField.parent('.superblyTagInputItem').parent('.superblyTagItems').parent('.superblyTagfieldDiv').click(function(e){
            tagField.siblings('.superblyTagInput').focus();	
        });


        // functions 
        function setValue(){
            tagField.val(inserted.join(','));
        }

        function addItem(value){
            var index = jQuery.inArray(value,tagstmp);
            if((jQuery.inArray(value,inserted) == -1) && ( index > -1 || allowNewTags)){
                //delete from tags
                if(index >-1){
                    tagstmp.splice(index,1);
                }
                inserted.push(value);
                tagField.parent('.superblyTagInputItem') .before("<li class='superblyTagItem'><span>" + value + "</span><a>  x</a></li>");
                tagField.siblings('.superblyTagInput').val("");
                currentValue = null;
                currentItem = null;
                // add remove clicke event 
                var new_index = tagField.parent('.superblyTagInputItem').parent('.superblyTagItems').children('.superblyTagItem').size()-1;
                $(tagField.parent('.superblyTagInputItem').parent('.superblyTagItems').children('.superblyTagItem')[new_index]).children('a').click(function(e){
                    var value = $($(this).parent('.superblyTagItem').children('span')[0]).text();
                    removeItem(value);
                });
                $(tagField.parent('.superblyTagInputItem').parent('.superblyTagItems').children('.superblyTagItem')[new_index]).children('a').hover(function(e){
                    $(this).addClass('hover');
                },function(e){
                    $(this).removeClass('hover');
                });
            }
            tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').css('display', 'none');
            tagField.siblings('.superblyTagInput').focus();
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
                tagField.parent('.superblyTagInputItem').parent('.superblyTagItems').children(".superblyTagItem:contains('" + value + "')").remove();
            }
            tagstmp.sort();
            tagField.siblings('.superblyTagInput').focus();
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
            tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').show();
            if(value == currentValue){
                return false;
            }
            currentValue = value;
            tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem').remove();
            var suggestions = getSuggestionsArray(value);
            for(key in suggestions){
                tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').append("<li class='superblySuggestItem'>" + suggestions[key] + "</li>");
            }

            // add click event to suggest items
            tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem').click(function(e){
                addItem($(this).html());
            });

            selectedIndex=null;
            if(!allowNewTags){
                selectedIndex=0;
                $(tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem')[selectedIndex]).addClass("selected");	
                currentItem = $(tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem')[selectedIndex]).html();
            }
        }


        function selectDown(){
            var size = tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem').size();
            if(selectedIndex == null){
                selectedIndex=0;
            }else if(selectedIndex < size-1){
                $(tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem')[selectedIndex]).removeClass("selected");
                selectedIndex++;
            }
            $(tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem')[selectedIndex]).addClass("selected");
            currentItem = $(tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem')[selectedIndex]).html();

        }

        function selectUp(){
            if(selectedIndex == 0){
                selectedIndex=null;
                currentItem = null;
                tagField.siblings('.superblyTagInput').focus();
            } else if(selectedIndex >0){
                $(tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem')[selectedIndex]).removeClass("selected");
                selectedIndex--;
                $(tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem')[selectedIndex]).addClass("selected");
                currentItem = $(tagField.siblings('.superblyTagInput').siblings('.superblySuggestItems').children('.superblySuggestItem')[selectedIndex]).html();

            }
        }
    }
})(jQuery);
