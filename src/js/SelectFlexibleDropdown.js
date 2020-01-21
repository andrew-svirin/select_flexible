function SelectFlexibleDropdown($container, options) {
    this.$container = $container;
    this.options = options;
    this.search = new SelectFlexibleSearch(this.$container, this.options);
    this.results = new SelectFlexibleResults(this.$container, this.options);
}

SelectFlexibleDropdown.prototype.render = function (id) {
    let $dropdown = $(
        '<span class="select-flexible-container"' +
        ' data-container-id="' + id + '">' +
        '<span class="select-flexible-dropdown">' +
        '<span class="select-flexible-results ' + this.options.dimension + '"></span>' +
        '</span>' +
        '</span>'
    );
    this.$container.data('$dropdown', $dropdown);

    // Calculate absolute position for dropdown.
    let offset = this.$container.offset();
    let css = {
        position: 'absolute',
        left: offset.left + 'px',
        top: offset.top + this.$container.outerHeight(false) + 'px',
        width: this.$container.outerWidth(false) + 'px',
    };
    $dropdown.css(css);

    $('.select-flexible-dropdown', $dropdown).prepend(this.search.render());

    $('.select-flexible-results', $dropdown).append(this.results.render());

    return $dropdown;
};

SelectFlexibleDropdown.prototype.destroy = function () {
    this.$container.data('$dropdown').remove();
};