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