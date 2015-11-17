
Element.prototype.isVisible = function() {
    'use strict';
    /**
     * Author: Jason Farrell
     * Author URI: http://useallfive.com/
     *
     * Description: Checks if a DOM element is truly visible.
     * Package URL: https://github.com/UseAllFive/true-visibility
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     * @param (el)      the DOM element to check if is visible
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param (t)       Top corner position number
     * @param (r)       Right corner position number
     * @param (b)       Bottom corner position number
     * @param (l)       Left corner position number
     * @param (w)       Element width number
     * @param (h)       Element height number
     */
    function _isVisible(el, t, r, b, l, w, h) {
        var p = el.parentNode, VISIBLE_PADDING = 2;
        if ( !_elementInDocument(el) ) {return false; }
        //-- Return true for document node
        if ( 9 === p.nodeType ) {return true; }
        //-- Return false if our element is invisible
        if ('0' === _getStyle(el, 'opacity') || 'none' === _getStyle(el, 'display') || 'hidden' === _getStyle(el, 'visibility') ) {return false; }
        if ('undefined' === typeof(t) || 'undefined' === typeof(r) || 'undefined' === typeof(b) || 'undefined' === typeof(l) || 'undefined' === typeof(w) || 'undefined' === typeof(h) ) {t = el.offsetTop; l = el.offsetLeft; b = t + el.offsetHeight; r = l + el.offsetWidth; w = el.offsetWidth; h = el.offsetHeight; }
        //-- If we have a parent, let's continue:
        if ( p ) {
            //-- Check if the parent can hide its children.
            if ( ('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow')) ) {
                //-- Only check if the offset is different for the parent
                if (
                    //-- If the target element is to the right of the parent elm
                    l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
                    //-- If the target element is to the left of the parent elm
                    l + w - VISIBLE_PADDING < p.scrollLeft ||
                    //-- If the target element is under the parent elm
                    t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
                    //-- If the target element is above the parent elm
                    t + h - VISIBLE_PADDING < p.scrollTop
                ) {
                    //-- Our target element is out of bounds:
                    return false;
                }
            }
            //-- Add the offset parent's left/top coords to our element's offset:
            if ( el.offsetParent === p ) {l += p.offsetLeft; t += p.offsetTop; } //-- Let's recursively check upwards:
            return _isVisible(p, t, r, b, l, w, h);
        }
        return true;
    }

    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {if ( window.getComputedStyle ) {return document.defaultView.getComputedStyle(el,null)[property]; } if ( el.currentStyle ) {return el.currentStyle[property]; } }
    function _elementInDocument(element) {while (element = element.parentNode) {if (element == document) {return true; } } return false; } return _isVisible(this);
};

function sendData(){
	var request = new XMLHttpRequest();
	request.open('POST', '/my/url', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send(data);
}

function lowest(x,y){
    return (x>y)?y:x;
}

function greatest(x,y){
    return (x>y)?x:y;
}

var initialDelayMs = 500
var intervalMs = 200

window.setTimeout(function(){
    window.setInterval((function(){
        var out = document.getElementById("out")
        var out2 = document.getElementById("out2")

        var diffE = document.getElementById("diff")

        var adE = document.getElementById("ad")
        if (adE != null){
            var wH = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight; 
            var wW = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth; 

            // ad.t.l.x == ad top left x coordinate
            var ad = { 
                t: {
                    l: {x: adE.getBoundingClientRect().left, y: adE.getBoundingClientRect().top }, 
                    r: {x: adE.getBoundingClientRect().right, y: adE.getBoundingClientRect().top } 
                }, b : {
                    l: {x: adE.getBoundingClientRect().left, y: adE.getBoundingClientRect().bottom }, 
                    r: {x: adE.getBoundingClientRect().right, y: adE.getBoundingClientRect().bottom } 
                } 
            }
            var view = {
                t: {
                    l: {x: 0, y: 0 }, 
                    r: {x: wW, y: 0 } 
                }, b : {
                    l: {x: 0, y: wH }, 
                    r: {x: wW, y: wH } 
                } 
            }
            var diff = {
                t: {
                    l: {x: greatest(ad.t.l.x, view.t.l.x), y: greatest(ad.t.l.y, view.t.l.y) }, 
                    r:{x: lowest(ad.t.r.x, view.t.r.x), y: greatest(ad.t.r.y, view.t.r.y) }
                }, b: {
                    l: {x: greatest(ad.b.l.x, view.b.l.x), y: lowest(ad.b.l.y, view.b.l.y) }, 
                    r:{x: lowest(ad.b.r.x, view.b.r.x), y: lowest(ad.b.r.y, view.b.r.y) }
                } 
            }

             // ad.offsetWidth, adstyle.height.slice(0, adstyle.height.length-2)
            ad.width = (ad.t.r.x - ad.t.l.x)
            ad.height =  (ad.b.l.y - ad.t.l.y)
            ad.area = ad.height *  ad.width // we could also access the height from element style but.... meh
           
            view.width = (view.t.r.x - view.t.l.x)
            view.height = (view.b.l.y - view.t.l.y)
            view.area = view.height *  view.width

            diff.width = (diff.t.r.x - diff.t.l.x) > 0 ? (diff.t.r.x - diff.t.l.x)  : 0
            diff.height = (diff.b.l.y - diff.t.l.y) > 0 ? (diff.b.l.y - diff.t.l.y) : 0
            diff.area = diff.height *  diff.width

            out.innerHTML = JSON.stringify({
                v: adE.isVisible(ad),
                // diff: diff,
                percVis: (diff.area / ad.area)*100
            }, null, "\t")
            out2.innerHTML = JSON.stringify({
                // ad: ad,
                // view: view
            }, null, "\t")

            // console.log(vis);
        } else console.log('null');
    }), intervalMs)
}, initialDelayMs)

