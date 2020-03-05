(function ($) {
    $.fn.selectFlexible = function (options) {
        let arguments_array = Array.from(arguments);
        let $this = $(this);
        $this.each(function () {
            let $select = $(this);
            if ('string' === typeof options) {
                switch (options) {
                    case 'values':
                        // Argument 1 - values
                        $select.data('select-flexible').setSelected(arguments_array[1]);
                        break;
                    case 'selectResultOptions':
                        // Argument 1 - $resultOptions
                        // Argument 2 - toggle
                        arguments_array[1].each((id, resultOption) => {
                            $select.data('select-flexible').$container.trigger('click_result_option.select_flexible', [
                                $(resultOption),
                                arguments_array[2],
                            ]);
                        });
                        break;
                    default:
                        console.error('Method does not allowed', options);
                }
            } else {
                // Check if select has attribute multiple and set default.
                options.multiple = options.multiple ||
                    (options.multiple === undefined && typeof $select.attr('multiple') !== 'undefined');
                new SelectFlexible($select, options);
            }
        });
        return $this;
    };
}(jQuery));