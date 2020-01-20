let SelectFlexible = function ($element, options) {
    if ($element.data('select-flexible') != null) {
        $element.data('select-flexible').$container.remove();
        $element.removeData('select-flexible');
    }
    this.options = $.extend({
        multiple: false,
        dimension: 'single',
        eventClickOption: null,
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
        '<span class="select-flexible select-flexible-container">' +
        '<span class="box-wrapper"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
        '</span>'
    );
    this.$container = $container;
    return $container;
};

SelectFlexible.prototype.registerEvents = function () {
    this.$container.on('select_flexible:click_box select_flexible:click_box_arrow', () => {
        let toggle = $('.select-flexible-box', this.$container).hasClass('open');
        this.displayDropdown(!toggle);
    }).on('select_flexible:input_search', (evt, pEvt) => {
        this.dropdown.results.filter($(pEvt.currentTarget).val());
    }).on('select_flexible:click_option', (evt, pEvt) => {
        let $result = $(pEvt.currentTarget),
            toggle = !$result.hasClass('highlighted'),
            $option = this.element.getOptionsByValue($result.data('value'));

        this.dropdown.results.toggleSelectResults($result, toggle);
        this.element.toggleSelectOptions($option, toggle);
        this.triggerEvent('eventClickOption', $result, $option, toggle);
    }).on('select_flexible:click_result_option', (evt, pEvt) => {
        let $resultOption = $(pEvt.currentTarget),
            toggle = !$resultOption.hasClass('highlighted'),
            $option = this.element.getOptionByValue($resultOption.data('value'));

        this.dropdown.results.resultsOptions.toggleSelectResultsOptions($resultOption, toggle);
        this.element.toggleSelectOptions($option, toggle);
        this.triggerEvent('eventClickResultOption', $resultOption, $option, toggle);
        // If was unselected last sub option, then unselect parent option.
        let resultValue = $option.val().split('][')[0],
            $result = this.dropdown.results.getResultByValue(resultValue);
        if (0 === this.dropdown.results.resultsOptions.getSelectedResultOptions($result).length) {
            $result.trigger('click');
        }
    }).on('close', () => {
        this.displayDropdown(false);
    });

    $(document.body).on('mousedown', (evt) => {
        this.$container.trigger('select_flexible:mousedown:' + this.id, [evt]);
    }).on('keydown', (evt) => {
        this.$container.trigger('select_flexible:keydown:' + this.id, [evt]);
    });
};

SelectFlexible.prototype.displayDropdown = function (toggle) {
    $('.select-flexible-box', this.$container).toggleClass('open', toggle);
    let $body = $(document.body);
    if (toggle) {
        // Place dropdown.
        this.dropdown = new SelectFlexibleDropdown(this.$container, this.options);
        $body.append(this.dropdown.render());
        this.$container.data('$search').focus();
        this.setSelected(this.element.getSelectedOptionsValues());

        $body.on('select_flexible:mousedown:' + this.id, (evt, pEvt) => {
            // Check if click was inside current container.
            let $target = $(pEvt.target);
            if (!$target.closest(this.$container).length &&
                !$target.closest(this.$container.data('$dropdown')).length) {
                this.$container.trigger('close');
            }
        }).on('select_flexible:keydown:' + this.id, (evt, pEvt) => {
            // On press escape - close the dropdown.
            if ('Escape' === pEvt.key) {
                this.$container.trigger('close');
            }
        });
    } else {
        $body.off('select_flexible:mousedown:' + this.id)
            .off('select_flexible:keydown:' + this.id);

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