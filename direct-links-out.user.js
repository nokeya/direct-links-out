// ==UserScript==
// @name        Direct links out
// @name:ru     Прямые ссылки наружу
// @description Removes all "You are leaving our site" and redirection stuff from links
// @description:ru Убирает "Бла-бла-бла, Вы покидаете наш сайт" и переадресации из ссылок
// @namespace   https://github.com/nokeya
// @author      nokeya
// @update      https://github.com/nokeya/direct-links-out/raw/master/direct-links-out.user.js
// @icon        https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @version     2.4
// @grant       none
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
    var rewriteLink = function(){};
    var rewriteAll = function(){};

    // simple rewrite link -  based on anchors
    function rewriteLinkSimple(link){
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

    // kickass special
    function rewriteLinkKickass(link){
        var ndx = link.href.indexOf(anchor);
        if (ndx != -1){
            link.href = windows.atob(unescape(link.href.substring(ndx + anchor.length, link.href.length - 1)));
            link.className = '';
        }
    }
    // youtube special
    function rewriteLinkYoutube(link){
        if (link.className.indexOf('redirect') != -1)
            link.setAttribute('data-redirect-href-updated', 'true');
        rewriteLinkSimple(link);
    }

    //facebook special
    function rewriteLinkFacebook(link){
        if (link.onclick && /referrer_log/i.test(link.onclick)){
            link.removeAttribute('onclick');
            link.removeAttribute('onmouseover');
        }
        rewriteLinkSimple(link);
    }

    // determine anchors, functions and listeners
    (function ()
    {
        rewriteLink = rewriteLinkSimple;
        rewriteAll = rewriteAllLinksSimple;

        var loc = window.location.hostname;
        if (loc.indexOf('facebook') != -1) {
            anchor = 'u=';
            after = '&h=';
            rewriteLink = rewriteLinkFacebook;

            document.addEventListener('mouseover', function (event) {
                var node = event.target;
                if (node instanceof HTMLAnchorElement && node.onclick && /referrer_log/i.test(node.onclick)){
                    node.removeAttribute('onclick');
                    node.removeAttribute('onmouseover');
                }
            }, false);
        }
        else if (loc.indexOf('youtube') != -1) {
            anchor = 'redirect?q=';
            after = '&redir_token=';
            rewriteLink = rewriteLinkYoutube;
        }
        else if (loc.indexOf('vk') != -1) {
            anchor = 'to=';
            after = '&post=';
        }
        else if (loc.indexOf('ok') != -1) {
            anchor = 'st.link=';
            after = '&st.name=';
        }
        else if (loc.indexOf('4pda') != -1)
            anchor = 'go/?u=';
        else if (loc.indexOf('deviantart') != -1)
            anchor = 'outgoing?';
        else if (loc.indexOf('reactor') != -1)
            anchor = 'url=';
        else if (loc.indexOf('steam') != -1)
            anchor = 'url=';
        else if (loc.indexOf('twitter') != -1){
            rewriteLink = rewriteLinkTwitter;
            rewriteAll = rewriteAllLinksTwitter;
        }
        else if (loc.indexOf('kat') != -1 || loc.indexOf('kickass') != -1)
        {
            anchor = 'confirm/url/';
            rewriteLink = rewriteLinkKickass;
        }

        document.addEventListener('DOMNodeInserted', function(event){
            var node = event.target;
            if (node instanceof HTMLAnchorElement)
                rewriteLink(node);
            var links = node.getElementsByTagName('a');
            for (var i = 0; i < links.length; ++i)
                rewriteLink(links[i]);
        }, false);
    })();
    rewriteAll();
})();
