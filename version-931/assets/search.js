(function () {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = document.getElementById('searchInput');
    var title = document.getElementById('searchTitle');
    var container = document.getElementById('searchResults');

    if (input) {
        input.value = query;
    }

    function card(item) {
        var tags = item.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
            '<article class="movie-card">',
            '<a class="poster" href="movie/' + item.file + '">',
            '<img src="./' + item.cover + '.jpg" alt="' + escapeHtml(item.title) + '" loading="lazy">',
            '<span class="poster-badge">' + escapeHtml(item.year) + '</span>',
            '</a>',
            '<div class="card-body">',
            '<a class="card-title" href="movie/' + item.file + '">' + escapeHtml(item.title) + '</a>',
            '<p class="card-meta">' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + ' · ' + escapeHtml(item.genre) + '</p>',
            '<p class="card-line">' + escapeHtml(item.line) + '</p>',
            '<div class="card-tags">' + tags + '</div>',
            '<a class="card-category" href="category/' + item.categorySlug + '.html">' + escapeHtml(item.categoryName) + '</a>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    if (!container || !window.SEARCH_INDEX) {
        return;
    }

    var normalized = query.toLowerCase();
    var results = window.SEARCH_INDEX.filter(function (item) {
        if (!normalized) {
            return true;
        }

        return item.search.indexOf(normalized) !== -1;
    }).slice(0, 120);

    if (title) {
        title.textContent = query ? '“' + query + '”相关影片' : '热门影片';
    }

    container.innerHTML = results.map(card).join('');
})();
