// ==UserScript==
// @name        Direct links out
// @name:ru     Прямые ссылки наружу
// @description Removes all "You are leaving our site" stuff from links in social networks
// @description:ru Убирает "Бла-бла-бла, Вы покидаете наш сайт" из ссылок наружу из соц. сетей
// @namespace   https://github.com/nokeya
//deviantart
// @include     http://deviantart.com/*
// @include     https://deviantart.com/*
// @include     http://*.deviantart.com/*
// @include     https://*.deviantart.com/*
// @match       http://deviantart.com/*
// @match       https://deviantart.com/*
// @match       http://*.deviantart.com/*
// @match       https://*.deviantart.com/*
//joyreactor
// @include     http://joyreactor.cc/*
// @include     https://joyreactor.cc/*
// @include     http://reactor.cc/*
// @include     https://reactor.cc/*
// @include     http://*.joyreactor.cc/*
// @include     https://*.joyreactor.cc/*
// @include     http://*.reactor.cc/*
// @include     https://*.reactor.cc/*
// @match       http://joyreactor.cc/*
// @match       https://joyreactor.cc/*
// @match       http://reactor.cc/*
// @match       https://reactor.cc/*
// @match       http://*.joyreactor.cc/*
// @match       https://*.joyreactor.cc/*
// @match       http://*.reactor.cc/*
// @match       https://*.reactor.cc/*
// @update      https://github.com/nokeya/direct-links-out/raw/master/direct-links-out.user.js
// @icon        https://raw.githubusercontent.com/nokeya/direct-links-out/master/icon.png
// @version     1.0
// @grant       none
// ==/UserScript==
function rewriteLinks(anchor)
{
  var links = document.getElementsByTagName('a');
  for (var i = 0; i < links.length; ++i)
  {
    var ndx = links[i].href.indexOf(anchor);
    if (ndx != - 1)
    {
      links[i].href = unescape(links[i].href.substring(ndx + anchor.length));
    }
  }
}
function makeDirect() {
  if (window.location.hostname.indexOf('deviantart') != - 1) {
    rewriteLinks('outgoing?');
  }
  else if (window.location.hostname.indexOf('reactor') != - 1) {
    rewriteLinks('redirect?url=');
  }
}
document.addEventListener('DOMNodeInserted', makeDirect, true);
makeDirect();
