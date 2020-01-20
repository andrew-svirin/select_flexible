function SelectFlexibleResults($container, options) {
    this.$container = $container;
    this.options = options;
    if ('multi' === this.options.dimension) {
        this.resultsOptions = new SelectFlexibleResultsOptions($container, options);
    }
}

SelectFlexibleResults.prototype.render = function () {
    let $results = $(
        '<ul class="select-flexible-results" role="tree"></ul>'
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
    $('li.select-flexible-result', this.$container.data('$results')).on('click', (evt) => {
        this.$container.trigger('select_flexible:click_option', [evt]);
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