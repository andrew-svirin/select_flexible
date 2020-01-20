Usage example:
```js
$(document).ready(function () {
    let $languagesSelect = $('#languages-select'),
        $languagesTags = $('#languages-tags');
    $languagesTags.handleTags({$select: $languagesSelect});
    $languagesSelect.selectFlexible({
        dimension: 'multi',
        eventClickOption: function () {
            $languagesTags.handleTags('rebuild');
        },
        eventClickResultOption: function () {
            $languagesTags.handleTags('rebuild');
        },
    });

});

(function ($) {
    $.fn.handleTags = function (options) {
        let $tags = $(this);
        if ('string' === typeof options) {
            switch (options) {
                case 'rebuild':
                    $tags.html('');
                    break;
                default:
                    console.error('Method does not allowed', options);
            }
        } else {
            options = $.extend({
                $select: null
            }, options);
            $tags.data('options', options);
        }
        let $options = $('option:selected', $tags.data('options').$select);
        if (0 === $options.length) {
            $tags.html('');
            return;
        }
        let $remove = $('<a class="select-tags-remove">')
            .text('Remove')
            .data('control', '#' + $tags.data('options').$select.attr('id'))
            .on('click', function (evt) {
                evt.preventDefault();
                let selectFlexibleSelector = $(this).data('control');
                $(selectFlexibleSelector).selectFlexible('values', []);
                $tags.html('');
            });
        $tags.append($remove).append($('<h3 class="select-tags-label">' + $tags.data('label') + '</h3>'));
        $options.each(function () {
            let $option = $(this);
            $tags.append($('<span class="select-tag" data-value="' + $option.attr('value') + '">' +
                $option.text() +
                '</span>'));
        });
    };
}(jQuery));
```

Build dest files:
```shell
gulp --gulpfile public/vendors/select_flexible/gulpfile.js
```
