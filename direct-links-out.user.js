// ==UserScript==
// @name        Direct links out
// @name:ru     Прямые ссылки наружу
// @description Removes all "You are leaving our site" and redirection stuff from links
// @description:ru Убирает "Бла-бла-бла, Вы покидаете наш сайт" и переадресации из ссылок
// @namespace   https://github.com/nokeya
// @author      nokeya
// @update      https://github.com/nokeya/direct-links-out/raw/master/direct-links-out.user.js
// @icon        https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @version     2.6
// @grant       none
//google
// @include     *://google.*
// @include     *://www.google.*
// @include     *://encrypted.google.*
//youtube
// @match       *://youtube.com/*
// @match       *://*.youtube.com/*
//deviantart
// @match       *://deviantart.com/*
// @match       *://*.deviantart.com/*
//joyreactor
// @match       *://joyreactor.cc/*
// @match       *://*.joyreactor.cc/*
// @match       *://reactor.cc/*
// @match       *://*.reactor.cc/*
// @match       *://joyreactor.com/*
// @match       *://*.joyreactor.com/*
//vk
// @match       *://vk.com/*
// @match       *://*.vk.com/*
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
//4pda
// @match       *://4pda.ru/*
// @match       *://*.4pda.ru/*
//kickass
// @match       *://kat.cr/*
// @match       *://kickassto.co/*
// @match       *://katproxy.is/*
// @match       *://thekat.tv/*
// @match       *://*.kat.cr/*
// @match       *://*.kickassto.co/*
// @match       *://*.katproxy.is/*
// @match       *://*.thekat.tv/*
// ==/UserScript==
(function() {
    // anchors and functions
    var anchor;
    var after;
    var rwLink = function(){};
    var rwAll = function(){};

    // simple rewrite link -  based on anchors
    function rwSimple(link){
        if (anchor){
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
    }
    function rwaSimple(){
        var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; ++i)
            rwLink(links[i]);
    }

    // twitter special
    function rwTwitter(link){
        if (link.hasAttribute('data-expanded-url')){
            link.href = link.getAttribute('data-expanded-url');
            link.removeAttribute('data-expanded-url');
        }
    }
    function rwaTwitter(){
        var links = document.getElementsByClassName('twitter-timeline-link');
        for (var i = 0; i < links.length; ++i)
            rwLink(links[i]);
    }

    // kickass special
    function rwKickass(link){
        var ndx = link.href.indexOf(anchor);
        if (ndx != -1){
            link.href = window.atob(unescape(link.href.substring(ndx + anchor.length, link.href.length - 1)));
            link.className = '';
        }
    }
    // youtube special
    function rwYoutube(link){
        if (/redirect/i.test(link.className))
            link.setAttribute('data-redirect-href-updated', 'true');
        rwSimple(link);
    }

    // facebook special
    function rwFacebook(link){
        if (/referrer_log/i.test(link.onclick)){
            link.removeAttribute('onclick');
            link.removeAttribute('onmouseover');
        }
        rwSimple(link);
    }
    // google special
    function rwGoogle(link){
        if (link.hasAttribute('onmousedown')){
            link.removeAttribute('onmousedown');
        }
    }

    // determine anchors, functions and listeners
    (function ()
    {
        rwLink = rwSimple;
        rwAll = rwaSimple;

        var loc = window.location.hostname;
        if (/google/i.test(loc)) {
            rwLink = rwGoogle;
        }
        if (/facebook/i.test(loc)) {
            anchor = 'u=';
            after = '&h=';
            rwLink = rwFacebook;
        }
        else if (/youtube/i.test(loc)) {
            anchor = 'redirect?q=';
            after = '&redir_token=';
            rwLink = rwYoutube;
        }
        else if (/vk/i.test(loc)) {
            anchor = 'to=';
            after = '&post=';
        }
        else if (/ok/i.test(loc)) {
            anchor = 'st.link=';
            after = '&st.name=';
        }
        else if (/4pda/i.test(loc))
            anchor = 'go/?u=';
        else if (/deviantart/i.test(loc))
            anchor = 'outgoing?';
        else if (/reactor/i.test(loc))
            anchor = 'url=';
        else if (/steam/i.test(loc))
            anchor = 'url=';
        else if (/twitter/i.test(loc)){
            rwLink = rwTwitter;
            rwAll = rwaTwitter;
        }
        else if (/(kat|kickass)/i.test(loc))
        {
            anchor = 'confirm/url/';
            rwLink = rwKickass;
        }

        document.addEventListener('DOMNodeInserted', function(event){
            var node = event.target;
            if (node instanceof HTMLAnchorElement)
                rwLink(node);
            var links = node.getElementsByTagName('a');
            for (var i = 0; i < links.length; ++i)
                rwLink(links[i]);
        }, false);
    })();
    rwAll();
})();
