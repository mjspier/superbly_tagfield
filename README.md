superbly fields
===============

* &copy; 2013, Manuel Spierenburg, manuel@spierenburg.ch
* Licenced under [GNU General Public License, Version 3.0]
[GNU General Public License, Version 3.0]: http://www.gnu.org/licenses/gpl-3.0-standalone.html

description
-----------
this is a delicious like tag field which allows to add and delete tags to a input form field.

* allows new tags or only tags from array
* allow only a certain amount of tags
* can set preset tags
* adding tags by mouse or by keyboard input
* doesn’t allow duplicated entries
* input field acts like a normal input field

installation
------------
* add resources to your page:

    <script type="text/javascript" src=" https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
    <script src="superbly-tagfield.min.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="superbly-tagfield.css">

usage
-----
* add an input field
* add tagfield support to the input field

example:
    <script type="text/javascript">
        $(function() {
            $("#tagfield1").superblyTagField({
                allowNewTags: false,
                showTagsNumber: 10,
                preset: ['Audi','Bentley'],
                tags: ['Alfa Romeo','Aston Martin','Audi','Bentley','Bugatti']
            });
        });
    </script>
    ...
    <input type="text" id="tagfield1" />

options
-------

allowNewTags: 		true or false (default true)
addItemOnBlur:  	true or false (default false)
caseSensitive: 		true or false (default true)
allowTagsNumber:	number of allowed tags (default infinite)
showTagsNumber: 	number of shown suggestions tags (default 10)
preset:      		  array of preset tags
tags:           	array of tags
onRemove:         a function that runs before a tag is removed and discontinues with removal if the return value is false

changelog
---------
version 0.1
- removed the car list from the minified version
- moved the project to github

version 0.2
- fixed bug found by noah

version 0.3 (thanks to waf)
- refactor into jquery extension
- make tag input dynamically resize to fix wrapping

version 0.4 (thanks romeroadrian)
- add items by tab

version 0.5
- add allowed tags number attribute

version 0.6
- add case sensitive attribute
