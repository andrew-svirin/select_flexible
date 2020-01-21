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