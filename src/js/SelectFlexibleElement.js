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