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