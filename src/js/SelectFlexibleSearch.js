function SelectFlexibleSearch($container, options) {
    this.$container = $container;
    this.options = options;
}

SelectFlexibleSearch.prototype.render = function () {
    let $search = $(
        '<li class="select-flexible-search">' +
        '<input class="select-flexible-search__field" type="search"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
        ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
        '</li>'
    );
    this.$container.data('$search', $('input', $search));
    this.registerEvents();
    return $search;
};

SelectFlexibleSearch.prototype.registerEvents = function () {
    this.$container.data('$search').on('input', (evt) => {
        evt.stopPropagation();
        this.$container.trigger('select_flexible:input_search', [evt]);
    });
};