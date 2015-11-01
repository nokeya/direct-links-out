// ==UserScript==
// @name        Direct links out
// @name:ru     Прямые ссылки наружу
// @description Removes all "You are leaving our site" and redirection stuff from links in social networks
// @description:ru Убирает "Бла-бла-бла, Вы покидаете наш сайт" и переадресации из ссылок наружу из соц. сетей
// @namespace   https://github.com/nokeya
//deviantart
// @match       *://deviantart.com/*
// @match       *://*.deviantart.com/*
//joyreactor
// @match       *://joyreactor.cc/*
// @match       *://*.joyreactor.cc/*
// @match       *://reactor.cc/*
// @match       *://*.reactor.cc/*
//vk
// @match       *://vk.com/*
// @match       *://m.vk.com/*
//ok
// @match       *://ok.ru/*
// @match       *://*.ok.ru/*
//steam
// @match       *://steamcommunity.com/*
// @match       *://*.steamcommunity.com/*
//fb
// @match       *://facebook.com/*
// @match       *://*.facebook.com/*
//twitter
// @match       *://twitter.com/*
// @match       *://*.twitter.com/*
//
// @update      https://github.com/nokeya/direct-links-out/raw/master/direct-links-out.user.js
// @icon        https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @version     2.1
// @grant       none
// ==/UserScript==
(function() {
    // anchors and functions
    var anchor;
    var after;
    var rewriteLink = function(){};
    var rewriteAll = function(){};

    // simple rewrite link -  based on anchors
    function rewriteLinkSimple(link){
        var ndx = link.href.indexOf(anchor);
        if (ndx != -1){
            link.href = unescape(link.href.substring(ndx + anchor.length));
            if (after){
                ndx = link.href.indexOf(after);
                if (ndx != -1)
                    link.href = link.href.substring(0, ndx);
            }
        }
    }
    function rewriteAllLinksSimple(){
        var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; ++i)
            rewriteLink(links[i]);
    }

    // twitter special
    function rewriteLinkTwitter(link){
        if (link.hasAttribute('data-expanded-url')){
            link.href = link.getAttribute('data-expanded-url');
            link.removeAttribute('data-expanded-url');
        }
    }
    function rewriteAllLinksTwitter(){
        var links = document.getElementsByClassName('twitter-timeline-link');
        for (var i = 0; i < links.length; ++i)
            rewriteLink(links[i]);
    }

    //facebook special
    //TODO: find better solution
    function rewriteLinkFacebook(link){
        LinkshimAsyncLink.swap = function() {};
        LinkshimAsyncLink.referrer_log = function() {};
        rewriteLinkSimple(link);
    }

    // determine anchors
    (function ()
    {
        rewriteLink = rewriteLinkSimple;
        rewriteAll = rewriteAllLinksSimple;

        if (window.location.hostname.indexOf('facebook') != -1) {
            anchor = 'u=';
            after = '&h=';
            rewriteLink = rewriteLinkFacebook;
        }
        else if (window.location.hostname.indexOf('vk') != -1) {
            anchor = 'to=';
            after = '&post=';
        }
        else if (window.location.hostname.indexOf('ok') != -1) {
            anchor = 'st.link=';
            after = '&st.name=';
        }
        else if (window.location.hostname.indexOf('deviantart') != -1)
            anchor = 'outgoing?';
        else if (window.location.hostname.indexOf('reactor') != -1)
            anchor = 'url=';
        else if (window.location.hostname.indexOf('steam') != -1)
            anchor = 'url=';
        else if (window.location.hostname.indexOf('twitter') != -1){
            rewriteLink = rewriteLinkTwitter;
            rewriteAll = rewriteAllLinksTwitter;
        }
    })();

    // rewrite all existing links and subscribe to changes
    rewriteAll();
    document.addEventListener('DOMNodeInserted', function(event){
        var node = event.target;
        if (node.tagName === 'A')
            rewriteLink(node);
        var all = node.getElementsByTagName('a');
        for (var i = 0; i < all.length; ++i){
            rewriteLink(all[i]);
        }
    }, false);
})();
