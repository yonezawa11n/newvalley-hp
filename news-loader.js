/**
 * news-loader.js
 * 静的 NEWS_DATA + /api/news-admin の動的記事をマージして日付降順で返す
 * 使い方: NewsLoader.load().then(function(articles){ ... })
 */
window.NewsLoader = (function(){
  var _cache = null;
  return {
    load: function() {
      if (_cache) return Promise.resolve(_cache);
      return fetch('/api/news-admin')
        .then(function(r){ return r.json(); })
        .then(function(data){
          var dynamic = data.articles || [];
          var all = dynamic.concat(typeof NEWS_DATA !== 'undefined' ? NEWS_DATA : []);
          all.sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
          _cache = all;
          return all;
        })
        .catch(function(){
          var all = (typeof NEWS_DATA !== 'undefined' ? NEWS_DATA.slice() : []);
          all.sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
          _cache = all;
          return all;
        });
    },
    invalidate: function(){ _cache = null; }
  };
})();
