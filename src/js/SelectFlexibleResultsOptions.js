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
    $resultOptions.on('click', (evt) => {
        evt.stopPropagation();
        this.$container.trigger('select_flexible:click_result_option', [evt]);
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