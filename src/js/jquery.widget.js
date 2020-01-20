(function ($) {
    $.fn.selectFlexible = function (options) {
        let arguments_array = Array.from(arguments);
        let $this = $(this);
        $this.each(function () {
            if ('string' === typeof options) {
                switch (options) {
                    case 'values':
                        $(this).data('select-flexible').setSelected(arguments_array[1]);
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