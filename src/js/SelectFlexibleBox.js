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