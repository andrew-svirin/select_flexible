let SelectFlexible = function ($element, options) {
    this.$body = $(document.body);
    if ($element.data('select-flexible') != null) {
        this.$body.off('.select_flexible-' + this.id);
        this.$container.off('.select_flexible');
        $element.data('select-flexible').$container.remove();
        $element.removeData('select-flexible');
    }
    this.options = $.extend({
        multiple: false,
        dimension: 'single',
        eventClickOption: null,
        eventSelectOptions: null,
        eventClickResultOption: null,
    }, options);
    this.container = this.render();
    this.element = new SelectFlexibleElement(this.$container, this.options);
    this.element.render($element);
    this.id = this.element.generateId();
    this.placeContainer();
    $element.data('select-flexible', this);
};

SelectFlexible.prototype.triggerEvent = function () {
    let arguments_array = Array.from(arguments);
    let fn = this.options[arguments_array.shift()];
    if (typeof fn === "function") {
        fn.apply(null, arguments_array);
    }
};

SelectFlexible.prototype.placeContainer = function () {
    this.box = new SelectFlexibleBox(this.$container, this.options);
    $('.box-wrapper', this.$container).append(this.box.render());
    this.$container.insertAfter(this.$container.data('$element'));
    this.$container.css('width', this.$container.data('$element').outerWidth(false) + 'px');
    this.registerEvents();
};

SelectFlexible.prototype.render = function () {
    let $container = $(
        '<span class="select-flexible select-flexible-container"' +
        ' data-id="' + this.id + '">' +
        '<span class="box-wrapper"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
        '</span>'
    );
    this.$container = $container;
    return $container;
};

SelectFlexible.prototype.registerEvents = function () {
    this.$container.on('click_box.select_flexible click_box_arrow.select_flexible', (evt, $element, toggle) => {
        this.displayDropdown(toggle);
    }).on('input_search.select_flexible', (evt, $search) => {
        this.dropdown.results.filter($search.val());
    }).on('click_option.select_flexible', (evt, $result, toggle) => {
        let $option = this.element.getOptionsByValue($result.data('value'));

        this.dropdown.results.toggleSelectResults($result, toggle);
        this.element.toggleSelectOptions($option, toggle);
        this.triggerEvent('eventClickOption', $result, $option, toggle);
    }).on('toggle_select_options.select_flexible', (evt, $results, toggle) => {
        this.triggerEvent('eventSelectOptions', $results, toggle);
    }).on('click_result_option.select_flexible', (evt, $resultOption, toggle) => {
        let $option = this.element.getOptionByValue($resultOption.data('value'));

        this.dropdown.results.resultsOptions.toggleSelectResultsOptions($resultOption, toggle);
        this.element.toggleSelectOptions($option, toggle);
        // If was unselected last sub option, then unselect parent option.
        let resultValue = $option.val().split('][')[0],
            $result = this.dropdown.results.getResultByValue(resultValue);
        if (0 === this.dropdown.results.resultsOptions.getSelectedResultOptions($result).length) {
            $result.trigger('click.select_flexible');
        }
        this.triggerEvent('eventClickResultOption', $resultOption, $option, toggle);
    }).on('close.select_flexible', () => {
        this.displayDropdown(false);
    });
};

SelectFlexible.prototype.displayDropdown = function (toggle) {
    $('.select-flexible-box', this.$container).toggleClass('open', toggle);
    if (toggle) {
        // Place dropdown.
        this.dropdown = new SelectFlexibleDropdown(this.$container, this.options);
        this.$body.append(this.dropdown.render(this.id));
        this.$container.data('$search').focus();
        this.setSelected(this.element.getSelectedOptionsValues());

        this.$body.on('mousedown.select_flexible-' + this.id, (evt) => {
            // Check if click was inside current container.
            let $target = $(evt.target);
            if (!$target.closest(this.$container).length &&
                !$target.closest(this.$container.data('$dropdown')).length) {
                this.$container.trigger('close.select_flexible');
            }
        }).on('keydown.select_flexible-' + this.id, (evt) => {
            // On press escape - close the dropdown.
            if ('Escape' === evt.key) {
                this.$container.trigger('close.select_flexible');
            }
        });
    } else {
        this.$body.off('mousedown.select_flexible-' + this.id)
            .off('keydown.select_flexible-' + this.id);

        this.$container.data('$dropdown').remove();
        this.$container.removeData('$dropdown').removeData('$search').removeData('$results');
        delete this.dropdown;
    }
};

/**
 * Set selected element options and results.
 * @param values Array of element option values.
 */
SelectFlexible.prototype.setSelected = function (values) {
    this.element.setSelectedOptions(values);
    if (undefined !== this.dropdown) {
        // If dropdown is shown.
        this.dropdown.results.setSelectedResults(values);
    }
};
function SelectFlexibleBox($container, options) {
    this.$container = $container;
    this.options = options;
    this.boxArrow = new SelectFlexibleBoxArrow($container, options);
}

SelectFlexibleBox.prototype.render = function () {
    let label = this.resolveLabel();
    let $box = $(
        '<span class="select-flexible-box" title="' + label + '">' +
        '<span class="select-flexible-box-label">' + label + '</span>' +
        '</span>'
    );
    this.$container.data('$box', $box);
    $box.append(this.boxArrow.render());
    this.registerEvents();
    return $box;
};

SelectFlexibleBox.prototype.resolveLabel = function () {
    return this.$container.data('$element').data('label');
};

SelectFlexibleBox.prototype.registerEvents = function () {
    this.$container.data('$box').on('click.select_flexible', (evt) => {
        this.$container.trigger('click_box.select_flexible', [
            $(evt.currentTarget),
            !$('.select-flexible-box', this.$container).hasClass('open'),
        ]);
    });
};
function SelectFlexibleBoxArrow($container, options) {
    this.$container = $container;
    this.options = options;
}

SelectFlexibleBoxArrow.prototype.render = function () {
    let $boxArrow = $('<span class="select-flexible-box-arrow" role="presentation">' +
        '<b role="presentation"></b>' +
        '</span>'
    );
    this.$container.data('$boxArrow', $boxArrow);
    this.registerEvents();
    return $boxArrow;
};

SelectFlexibleBoxArrow.prototype.registerEvents = function () {
    this.$container.data('$boxArrow').on('click.select_flexible', (evt) => {
        evt.stopPropagation();
        this.$container.trigger('click_box_arrow.select_flexible', [
            $(evt.currentTarget),
            !$('.select-flexible-box', this.$container).hasClass('open'),
        ]);
    });
};
function SelectFlexibleDropdown($container, options) {
    this.$container = $container;
    this.options = options;
    this.search = new SelectFlexibleSearch(this.$container, this.options);
    this.results = new SelectFlexibleResults(this.$container, this.options);
}

SelectFlexibleDropdown.prototype.render = function (id) {
    let $dropdown = $(
        '<span class="select-flexible-container"' +
        ' data-container-id="' + id + '">' +
        '<span class="select-flexible-dropdown">' +
        '<span class="select-flexible-results ' + this.options.dimension + '"></span>' +
        '</span>' +
        '</span>'
    );
    this.$container.data('$dropdown', $dropdown);

    // Calculate absolute position for dropdown.
    let offset = this.$container.offset();
    let css = {
        position: 'absolute',
        left: offset.left + 'px',
        top: offset.top + this.$container.outerHeight(false) + 'px',
        width: this.$container.outerWidth(false) + 'px',
    };
    $dropdown.css(css);

    $('.select-flexible-dropdown', $dropdown).prepend(this.search.render());

    $('.select-flexible-results', $dropdown).append(this.results.render());

    return $dropdown;
};

SelectFlexibleDropdown.prototype.destroy = function () {
    this.$container.data('$dropdown').remove();
};
let SelectFlexibleElement = function ($container, options) {
    this.$container = $container;
    this.options = options;
};

SelectFlexibleElement.prototype.render = function ($element) {
    $element.attr('hidden', 'true');
    this.$container.data('$element', $element);

    let optionsValues = this.getOptionsValues(this.getOptions());
    this.$container.data('options-values', optionsValues);

    return $element;
};

SelectFlexibleElement.prototype.generateId = function () {
    let id = '';
    if (this.$container.data('$element').attr('id') != null) {
        id = this.$container.data('$element').attr('id');
    } else if (this.$container.data('$element').attr('name') != null) {
        id = this.$container.data('$element').attr('name') + '-' + Utils.generateChars(2);
    }
    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = 'select-flexible-' + id;
    return id;
};

SelectFlexibleElement.prototype.getOptions = function () {
    return $('option', this.$container.data('$element'));
};

SelectFlexibleElement.prototype.getSelectedOptions = function () {
    return $('option:selected', this.$container.data('$element'));
};

SelectFlexibleElement.prototype.getSelectedOptionsValues = function () {
    return this.getSelectedOptions().map(function () {
        return $(this).attr('value');
    }).toArray();
};

SelectFlexibleElement.prototype.getOptionsSelector = function (values) {
    return '[value=\'' + values.join('\'],[value=\'') + '\']';
};

/**
 * @param values Array of element option values.
 */
SelectFlexibleElement.prototype.setSelectedOptions = function (values) {
    if (0 === values.length) {
        this.toggleSelectOptions(this.getSelectedOptions(), false);
        return;
    }

    let optionSelector = this.getOptionsSelector(values);

    this.toggleSelectOptions($('option' + optionSelector, this.$container.data('$element')), true);
    this.toggleSelectOptions($('option:not(' + optionSelector + ')', this.$container.data('$element')), false);
};

SelectFlexibleElement.prototype.toggleSelectOptions = function ($options, toggle) {
    $options.prop('selected', toggle);
};

SelectFlexibleElement.prototype.getOptionsValues = function ($option) {
    let optionsValues = {};
    if ('multi' === this.options.dimension) {
        $option.each(function () {
            let $option = $(this),
                value = $option.val().split(']['),
                name = $option.data('name').split('][');
            if (undefined === optionsValues[value[0]]) {
                optionsValues[value[0]] = {
                    title: name[0],
                    values: {},
                };
            }
            optionsValues[value[0]].values[value[1]] = {
                title: name[1],
            };
        });
    } else {
        $option.each(function () {
            let $option = $(this);
            optionsValues[$option.val()] = {
                title: $option.text(),
            };
        });
    }

    return optionsValues;
};

SelectFlexibleElement.prototype.getOptionsByValue = function (value) {
    let $options = null;
    if ('multi' === this.options.dimension) {
        $options = $('option[value=\'' + value + '][' +
            Object.keys(this.$container.data('options-values')[value].values)
                .join('\'],[value=\'' + value + '][') + '\']', this.$container.data('$element'));
    } else {
        $options = this.getOptionByValue(value);
    }
    return $options;
};

SelectFlexibleElement.prototype.getOptionByValue = function (value) {
    return $('option[value=\'' + value + '\']', this.$container.data('$element'));
};
function SelectFlexibleResults($container, options) {
    this.$container = $container;
    this.options = options;
    if ('multi' === this.options.dimension) {
        this.resultsOptions = new SelectFlexibleResultsOptions($container, options);
    }
}

SelectFlexibleResults.prototype.render = function () {
    let $results = $(
        '<ul class="select-flexible-results-container" role="tree"></ul>'
    );
    this.$container.data('$results', $results);

    if (this.options.multiple) {
        $results.attr('aria-multiselectable', 'true');
    }

    $.each(this.$container.data('options-values'), (key, value) => {
        $results.append(this.renderResult(key, value));
    });

    this.registerEvents();

    return $results;
};

SelectFlexibleResults.prototype.renderResult = function (value, optionValue) {
    let $result = null;
    if ('multi' === this.options.dimension) {
        $result = $('<li class="select-flexible-result"' +
            ' data-value="' + value + '"' +
            ' data-title="' + optionValue.title.toLowerCase() + '">' +
            '<span class="result-label">' + optionValue.title + '</span>' +
            '<span class="result-options"></span>' +
            '</li>');
    } else {
        $result = $('<li class="select-flexible-result"' +
            ' data-value="' + value + '"' +
            ' data-title="' + optionValue.title.toLowerCase() + '">' + optionValue.title +
            '</li>');
    }

    return $result;
};

SelectFlexibleResults.prototype.registerEvents = function () {
    $('li.select-flexible-result', this.$container.data('$results')).on('click.select_flexible', (evt) => {
        let $result = $(evt.currentTarget);
        this.$container.trigger('click_option.select_flexible', [$result, !$result.hasClass('highlighted')]);
    });
};

SelectFlexibleResults.prototype.filter = function (text) {
    const textLC = text.toLowerCase();
    if ('' === text) {
        $('li.select-flexible-result:hidden', this.$container.data('$results')).show();
        return;
    }
    $('li.select-flexible-result[data-title*=\'' + textLC + '\']', this.$container.data('$results')).show();
    $('li.select-flexible-result:not([data-title*=\'' + textLC + '\'])', this.$container.data('$results')).hide();
};

SelectFlexibleResults.prototype.getResultsSelector = function (values) {
    let selector = '';
    if ('multi' === this.options.dimension) {
        let multiValues = [];
        $.each(values, function () {
            let value = this.split('][');
            if (!multiValues.includes(value[0])) {
                multiValues.push(value[0]);
            }
        });
        selector = '[data-value=\'' + multiValues.join('\'],[data-value=\'') + '\']';
    } else {
        selector = '[data-value=\'' + values.join('\'],[data-value=\'') + '\']';
    }
    return selector;
};

SelectFlexibleResults.prototype.getResultByValue = function (value) {
    return $('li.select-flexible-result[data-value=\'' + value + '\']', this.$container.data('$results'));
};

SelectFlexibleResults.prototype.toggleSelectResults = function ($results, toggle) {
    $results.toggleClass('highlighted', toggle);
    if ('multi' === this.options.dimension) {
        if (toggle) {
            // Show sub-select.
            $results.each((key, result) => {
                let $result = $(result),
                    resultsOptionsValues = this.resultsOptions.getResultOptionsValues(
                        $result.data('value'),
                        this.$container.data('options-values')[$result.data('value')].values
                    );

                $('.result-options', $result).append(this.resultsOptions.render(resultsOptionsValues));
            });
        } else {
            // Destroy sub-select.
            $results.each((key, value) => {
                $('.result-options', $(value)).html('');
            });
        }
    }
    this.$container.trigger('toggle_select_options.select_flexible', [$results, toggle])
};

SelectFlexibleResults.prototype.getSelectedResults = function () {
    return $('li.select-flexible-result.highlighted', this.$container.data('$results'));
};

/**
 * @param values Array of element option values.
 */
SelectFlexibleResults.prototype.setSelectedResults = function (values) {
    if (0 === values.length) {
        this.toggleSelectResults(this.getSelectedResults(), false);
        return;
    }

    let resultSelector = this.getResultsSelector(values);
    this.toggleSelectResults($('li.select-flexible-result' + resultSelector, this.$container.data('$results')), true);
    this.toggleSelectResults($('li.select-flexible-result:not(' + resultSelector + ')', this.$container.data('$results')), false);

    if ('multi' === this.options.dimension) {
        this.resultsOptions.setSelectedResultsOptions(values);
    }
};
function SelectFlexibleResultsOptions($container, options) {
    this.$container = $container;
    this.options = options;
}

SelectFlexibleResultsOptions.prototype.render = function (resultsOptionsValues) {
    let $resultOptionsContainer = $(
        '<ul class="select-flexible-result-options" role="tree"></ul>'
    );

    $.each(resultsOptionsValues, function (optionKey, option) {
            $resultOptionsContainer.append($('<li class="select-flexible-result-option"' +
                ' data-value="' + optionKey + '" ' +
                ' title="' + option.title + '">' + option.title +
                '</li>'));
        }
    );

    let $resultOptions = this.getResultOptions($resultOptionsContainer);
    this.registerEvents($resultOptions);
    this.toggleSelectResultsOptions($resultOptions, true);

    return $resultOptionsContainer;
};

SelectFlexibleResultsOptions.prototype.getResultOptions = function ($resultOptionsContainer) {
    return $('li.select-flexible-result-option', $resultOptionsContainer);
};

SelectFlexibleResultsOptions.prototype.registerEvents = function ($resultOptions) {
    $resultOptions.on('click.select_flexible', (evt) => {
        evt.stopPropagation();
        let $resultOption = $(evt.currentTarget);
        this.$container.trigger('click_result_option.select_flexible', [$resultOption, !$resultOption.hasClass('highlighted')]);
    });
};

SelectFlexibleResultsOptions.prototype.getResultOptionsValues = function (result, options) {
    let resultOptionsValues = {};
    $.each(options, function (optionKey, resultOption) {
        resultOptionsValues[result + '][' + optionKey] = resultOption;
    });
    return resultOptionsValues;
};

SelectFlexibleResultsOptions.prototype.getResultsOptionsSelector = function (values) {
    return '[data-value=\'' + values.join('\'],[data-value=\'') + '\']';
};

SelectFlexibleResultsOptions.prototype.toggleSelectResultsOptions = function ($resultOptions, toggle) {
    $resultOptions.toggleClass('highlighted', toggle);
};

/**
 * Set selected result options.
 * @param values Array of element option values.
 */
SelectFlexibleResultsOptions.prototype.setSelectedResultsOptions = function (values) {
    let resultSelector = this.getResultsOptionsSelector(values);
    this.toggleSelectResultsOptions($('li.select-flexible-result-option' + resultSelector, this.$container.data('$results')), true);
    this.toggleSelectResultsOptions($('li.select-flexible-result-option:not(' + resultSelector + ')', this.$container.data('$results')), false);
};

SelectFlexibleResultsOptions.prototype.getSelectedResultOptions = function ($result) {
    return $('li.select-flexible-result-option.highlighted', $result);
};
function SelectFlexibleSearch($container, options) {
    this.$container = $container;
    this.options = options;
}

SelectFlexibleSearch.prototype.render = function () {
    let $search = $(
        '<li class="select-flexible-search">' +
        '<input class="select-flexible-search__field" type="search"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
        ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
        '</li>'
    );
    this.$container.data('$search', $('input', $search));
    this.registerEvents();
    return $search;
};

SelectFlexibleSearch.prototype.registerEvents = function () {
    this.$container.data('$search').on('input.select_flexible', (evt) => {
        evt.stopPropagation();
        this.$container.trigger('input_search.select_flexible', [$(evt.currentTarget)]);
    });
};
(function ($) {
    $.fn.selectFlexible = function (options) {
        let arguments_array = Array.from(arguments);
        let $this = $(this);
        $this.each(function () {
            if ('string' === typeof options) {
                switch (options) {
                    case 'values':
                        // Argument 1 - values
                        $(this).data('select-flexible').setSelected(arguments_array[1]);
                        break;
                    case 'selectResultOptions':
                        // Argument 1 - $resultOptions
                        // Argument 2 - toggle
                        arguments_array[1].each((id, resultOption) => {
                            $(this).data('select-flexible').$container.trigger('click_result_option.select_flexible', [
                                $(resultOption),
                                arguments_array[2],
                            ]);
                        });
                        break;
                    default:
                        console.error('Method does not allowed', options);
                }
            } else {
                new SelectFlexible($(this), options);
            }
        });
        return $this;
    };
}(jQuery));