# jQuery plugin that allows to handle multidimensional selectbox

Select HTML:
```html
<select name="languages[]" 
    id="languages-select" 
    class="candidates-filter-form-select" 
    multiple="multiple" data-label="Languages">
        <option value="af][1" data-name="Afrikaans][Basic">
            Afrikaans Basic
        </option>
        <option value="af][2" data-name="Afrikaans][Intermediate">
            Afrikaans Intermediate
        </option>
        <option value="en][1" data-name="English][Basic">
            English Basic
        </option>
        <option value="en][2" data-name="English][Intermediate">
            English Intermediate
        </option>
</select>
```

Usage example:
```js
    let $select = $('#select');
    $select.selectFlexible({
        dimension: 'multi', // or 'single'
        eventClickOption: function () {
            // hook.
        },
        eventSelectOptions: function ($results, toggle) {
              // hook.
        },
        eventClickResultOption: function () {
              // hook.
        },
    });
```

Select with display tags:
```js
$(document).ready(function () {
    let $languagesSelect = $('#languages-select'),
        $languagesTags = $('#languages-tags');
    $languagesTags.handleTags({
        dimension: 'multi',
        $select: $languagesSelect,
    });
    $languagesSelect.selectFlexible({
        dimension: 'multi',
        eventClickOption: function () {
            $languagesTags.handleTags('rebuild');
        },
        eventSelectOptions: function ($results, toggle) {
            $results.selectRiser(false === toggle ? 'destroy' : {
                $select: $languagesSelect,
            });
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
                    options = $tags.data('options');
                    $tags.html('');
                    break;
                default:
                    console.error('Method does not allowed', options);
            }
        } else {
            options = $.extend({
                $select: null,
                dimension: 'single',
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
        if ('multi' === options.dimension) {
            console.log('multi');
            let values = {};
            $options.each(function () {
                let $option = $(this),
                    value = $option.attr('value').split(']['),
                    name = $option.data('name').split('][');

                if (undefined === values[value[0]]) {
                    values[value[0]] = {
                        title: name[0],
                        values: {},
                    };
                }
                values[value[0]].values[value[1]] = {
                    title: name[1],
                };
            });
            $.each(values, function (key) {
                let keys = Object.keys(this.values);
                if (1 === keys.length) {
                    $tags.append($('<span class="select-tag" data-value="' + key + '">' +
                        this.title + ' ' + this.values[keys[0]].title +
                        '</span>'));
                } else {
                    $tags.append($('<span class="select-tag" data-value="' + key + '">' +
                        this.title + ' ' + this.values[keys[0]].title + '-' + this.values[keys[keys.length - 1]].title +
                        '</span>'));
                }
            });
        } else {
            $options.each(function () {
                let $option = $(this);
                $tags.append($('<span class="select-tag" data-value="' + $option.attr('value') + '">' +
                    $option.text() +
                    '</span>'));
            });
        }
        $tags.data('options', options);
    };

    $.fn.selectRiser = function (options) {
        $(this).each(function () {
            let $result = $(this),
                $resultOptionsContainer = $('.result-options', $result),
                $resultOptions = $('li.select-flexible-result-option', $result);

            if ('string' === typeof options) {
                switch (options) {
                    case 'destroy':
                        if ($result.hasClass('select-riser')) {
                            $resultOptionsContainer.trigger('mouseout').off('.select_riser');
                            $resultOptions.off('.select_riser');
                            $result.removeClass('select-riser');
                        }
                        break;
                    default:
                        console.error('Method does not allowed', options);
                }
            } else {
                options = $.extend({$select: null}, options);
                $resultOptionsContainer.on('mouseover.select_riser', () => {
                    $resultOptionsContainer.addClass('hover');
                }).on('mouseout.select_riser', () => {
                    $resultOptionsContainer.add($resultOptions).removeClass('hover');
                });
                $resultOptions.on('mouseover.select_riser', function () {
                    let resultOptionId = $resultOptions.index($(this));
                    $resultOptions.each(function (id, resultOption) {
                        let $resultOption = $(resultOption);
                        $resultOption.toggleClass('hover', !$resultOption.hasClass('hover') && id >= resultOptionId);
                    });
                }).off('click.select_flexible').on('click.select_riser', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    options.$select.selectFlexible('selectResultOptions', $resultOptions.filter(function () {
                        return $(this).hasClass('hover');
                    }), true).selectFlexible('selectResultOptions', $resultOptions.filter(function () {
                        return !$(this).hasClass('hover');
                    }), false);
                });
                $result.addClass('select-riser');
            }
        });
    };
}(jQuery));
```

Build dest files:
```
gulp --gulpfile public/vendors/select_flexible/gulpfile.js
```