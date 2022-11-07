/**
 * Wordfind.js 0.0.1
 * (c) 2012 Bill, BunKat LLC.
 * Wordfind is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/wordfind
 */
(function () {
    "use strict";
    ("undefined" != typeof exports && null !== exports ? exports : window).wordfind = function () {
        let t = "abcdefghijklmnoprstuvwy";
        var n = ["horizontal", "horizontalBack", "vertical", "verticalUp", "diagonal", "diagonalUp", "diagonalBack", "diagonalUpBack"],
            r = {
                horizontal: function (t, n, r) {
                    return {
                        x: t + r,
                        y: n
                    }
                },
                horizontalBack: function (t, n, r) {
                    return {
                        x: t - r,
                        y: n
                    }
                },
                vertical: function (t, n, r) {
                    return {
                        x: t,
                        y: n + r
                    }
                },
                verticalUp: function (t, n, r) {
                    return {
                        x: t,
                        y: n - r
                    }
                },
                diagonal: function (t, n, r) {
                    return {
                        x: t + r,
                        y: n + r
                    }
                },
                diagonalBack: function (t, n, r) {
                    return {
                        x: t - r,
                        y: n + r
                    }
                },
                diagonalUp: function (t, n, r) {
                    return {
                        x: t + r,
                        y: n - r
                    }
                },
                diagonalUpBack: function (t, n, r) {
                    return {
                        x: t - r,
                        y: n - r
                    }
                }
            },
            e = {
                horizontal: function (t, n, r, e, o) {
                    return e >= t + o
                },
                horizontalBack: function (t, n, r, e, o) {
                    return t + 1 >= o
                },
                vertical: function (t, n, r, e, o) {
                    return r >= n + o
                },
                verticalUp: function (t, n, r, e, o) {
                    return n + 1 >= o
                },
                diagonal: function (t, n, r, e, o) {
                    return e >= t + o && r >= n + o
                },
                diagonalBack: function (t, n, r, e, o) {
                    return t + 1 >= o && r >= n + o
                },
                diagonalUp: function (t, n, r, e, o) {
                    return e >= t + o && n + 1 >= o
                },
                diagonalUpBack: function (t, n, r, e, o) {
                    return t + 1 >= o && n + 1 >= o
                }
            },
            o = {
                horizontal: function (t, n, r) {
                    return {
                        x: 0,
                        y: n + 1
                    }
                },
                horizontalBack: function (t, n, r) {
                    return {
                        x: r - 1,
                        y: n
                    }
                },
                vertical: function (t, n, r) {
                    return {
                        x: 0,
                        y: n + 100
                    }
                },
                verticalUp: function (t, n, r) {
                    return {
                        x: 0,
                        y: r - 1
                    }
                },
                diagonal: function (t, n, r) {
                    return {
                        x: 0,
                        y: n + 1
                    }
                },
                diagonalBack: function (t, n, r) {
                    return {
                        x: r - 1,
                        y: t >= r - 1 ? n + 1 : n
                    }
                },
                diagonalUp: function (t, n, r) {
                    return {
                        x: 0,
                        y: n < r - 1 ? r - 1 : n + 1
                    }
                },
                diagonalUpBack: function (t, n, r) {
                    return {
                        x: r - 1,
                        y: t >= r - 1 ? n + 1 : n
                    }
                }
            },
            a = function (t, n) {
                var r, e, o, a = [];
                for (r = 0; r < n.height; r++)
                    for (a.push([]), e = 0; e < n.width; e++) a[r].push("");
                for (r = 0, o = t.length; r < o; r++)
                    if (!i(a, n, t[r])) return null;
                return a
            },
            i = function (t, n, e) {
                var o = l(t, n, e);
                if (0 === o.length) return !1;
                var a = o[Math.floor(Math.random() * o.length)];
                return f(t, e, a.x, a.y, r[a.orientation]), !0
            },
            l = function (t, n, a) {
                for (var i = [], l = n.height, f = n.width, d = a.length, c = 0, h = 0, v = n.orientations.length; h < v; h++)
                    for (var g = n.orientations[h], p = e[g], $ = r[g], P = o[g], S = 0, x = 0; x < l;)
                        if (p(S, x, l, f, d)) {
                            var w = u(a, t, S, x, $);
                            (w >= c || !n.preferOverlap && w > -1) && (c = w, i.push({
                                x: S,
                                y: x,
                                orientation: g,
                                overlap: w
                            })), ++S >= f && (S = 0, x++)
                        } else {
                            var z = P(S, x, d);
                            S = z.x, x = z.y
                        } return n.preferOverlap ? s(i, c) : i
            },
            u = function (t, n, r, e, o) {
                for (var a = 0, i = 0, l = t.length; i < l; i++) {
                    var u = o(r, e, i),
                        s = n[u.y][u.x];
                    if (s === t[i]) a++;
                    else if ("" !== s) return -1
                }
                return a
            },
            s = function (t, n) {
                for (var r = [], e = 0, o = t.length; e < o; e++) t[e].overlap >= n && r.push(t[e]);
                return r
            },
            f = function (t, n, r, e, o) {
                for (var a = 0, i = n.length; a < i; a++) {
                    var l = o(r, e, a);
                    t[l.y][l.x] = n[a]
                }
            };
        return {
            validOrientations: n,
            orientations: r,
            newPuzzle: function (r, e) {
                if (!r.length) throw Error("Zero words provided");
                for (var o, i, l = 0, u = 0, s = e || {}, f = (o = r.slice(0).sort())[0].length, d = {
                        height: s.height || f,
                        width: s.width || f,
                        orientations: s.orientations || n,
                        fillBlanks: void 0 === s.fillBlanks || s.fillBlanks,
                        allowExtraBlanks: void 0 === s.allowExtraBlanks || s.allowExtraBlanks,
                        maxAttempts: s.maxAttempts || 3,
                        maxGridGrowth: void 0 !== s.maxGridGrowth ? s.maxGridGrowth : 10,
                        preferOverlap: void 0 === s.preferOverlap || s.preferOverlap
                    }; !i;) {
                    for (; !i && l++ < d.maxAttempts;) i = a(o, d);
                    if (!i) {
                        if (++u > d.maxGridGrowth) throw Error(`No valid ${d.width}x${d.height} grid found and not allowed to grow more`);
                        console.log(`No valid ${d.width}x${d.height} grid found after ${l-1} attempts, trying with bigger grid`), d.height++, d.width++, l = 0
                    }
                }
                if (d.fillBlanks) {
                    var c, h, v = 0;
                    "function" == typeof d.fillBlanks ? h = d.fillBlanks : "string" == typeof d.fillBlanks ? (c = d.fillBlanks.toLowerCase().split(""), h = () => c.pop() || v++ && "") : h = () => t[Math.floor(Math.random() * t.length)];
                    var g = this.fillBlanks({
                        puzzle: i,
                        extraLetterGenerator: h
                    });
                    if (c && c.length) throw Error(`Some extra letters provided were not used: ${c}`);
                    if (c && v && !d.allowExtraBlanks) throw Error(`${v} extra letters were missing to fill the grid`);
                    var p = 100 * (1 - g / (d.width * d.height));
                    console.log(`Blanks filled with ${g} random letters - Final grid is filled at ${p.toFixed(0)}%`)
                }
                return i
            },
            newPuzzleLax: function (t, n) {
                try {
                    return this.newPuzzle(t, n)
                } catch (r) {
                    if (!n.allowedMissingWords) throw r;
                    var n = Object.assign({}, n);
                    n.allowedMissingWords--;
                    for (var e = 0; e < t.length; e++) {
                        var o = t.slice(0);
                        o.splice(e, 1);
                        try {
                            return this.newPuzzleLax(o, n)
                        } catch (a) {}
                    }
                    throw r
                }
            },
            fillBlanks: function ({
                puzzle: t,
                extraLetterGenerator: n
            }) {
                for (var r = 0, e = 0, o = t.length; e < o; e++)
                    for (var a = t[e], i = 0, l = a.length; i < l; i++) !t[e][i] && (t[e][i] = n(), r++);
                return r
            },
            solve: function (t, r) {
                for (var e = {
                        height: t.length,
                        width: t[0].length,
                        orientations: n,
                        preferOverlap: !0
                    }, o = [], a = [], i = 0, u = r.length; i < u; i++) {
                    var s = r[i],
                        f = l(t, e, s);
                    f.length > 0 && f[0].overlap === s.length ? (f[0].word = s, o.push(f[0])) : a.push(s)
                }
                return {
                    found: o,
                    notFound: a
                }
            },
            print: function (t) {
                for (var n = "", r = 0, e = t.length; r < e; r++) {
                    for (var o = t[r], a = 0, i = o.length; a < i; a++) n += ("" === o[a] ? " " : o[a]) + " ";
                    n += "\n"
                }
                return console.log(n), n
            }
        }
    }()
}).call(this),
    function (t, n, r) {
        "use strict";
        var e = function (t, r) {
                for (var e = "", o = 0, a = r.length; o < a; o++) {
                    var i = r[o];
                    e += "<div>";
                    for (var l = 0, u = i.length; l < u; l++) e += '<button class="SPP-PuzzleSquare" x="' + l + '" y="' + o + '">', e += i[l] || "&nbsp;", e += "</button>";
                    e += "</div>"
                }
                n(t).html(e)
            },
            o = function (t, n, e, o) {
                for (var a in r.orientations) {
                    var i = (0, r.orientations[a])(t, n, 1);
                    if (i.x === e && i.y === o) return a
                }
                return null
            },
            a = function (a, i) {
                var l, u, s, f, d, c = [],
                    h = "",
                    v = function (t) {
                        t.preventDefault(), n(this).addClass("selected"), f = this, c.push(this), h = n(this).text()
                    },
                    g = function (n) {
                        n.preventDefault();
                        var r = n.originalEvent.touches[0] || n.originalEvent.changedTouches[0],
                            e = r.clientX,
                            o = r.clientY;
                        $(t.elementFromPoint(e, o))
                    },
                    p = function (t) {
                        t.preventDefault(), $(this)
                    },
                    $ = function (t) {
                        if (f) {
                            var r, e = c[c.length - 1];
                            if (e != t) {
                                for (var a = 0, i = c.length; a < i; a++)
                                    if (c[a] == t) {
                                        r = a + 1;
                                        break
                                    } for (; r < c.length;) n(c[c.length - 1]).removeClass("selected"), c.splice(r, 1), h = h.substr(0, h.length - 1);
                                var l = o(n(f).attr("x") - 0, n(f).attr("y") - 0, n(t).attr("x") - 0, n(t).attr("y") - 0);
                                l && (c = [f], h = n(f).text(), e !== f && (n(e).removeClass("selected"), e = f), d = l);
                                var u = o(n(e).attr("x") - 0, n(e).attr("y") - 0, n(t).attr("x") - 0, n(t).attr("y") - 0);
                                u && (d && d !== u || (d = u, P(t)))
                            }
                        }
                    },
                    P = function (t) {
                        for (var r = 0, e = l.length; r < e; r++)
                            if (0 === l[r].indexOf(h + n(t).text())) {
                                n(t).addClass("selected"), c.push(t), h += n(t).text();
                                break
                            }
                    },
                    S = function (t) {
                        t.preventDefault();
                        for (var r = "", e = 0, o = 0, a = l.length; o < a; o++) {
                            if (l[o] === h) {
                                for (var i = 0; i < s.length; i++) s[i].toLowerCase() == h && (r = s[i], e = i);
                                if($eXeSopa && typeof $eXeSopa.updateScore=="function"){
                                    n(".selected").addClass("found"), $eXeSopa.updateScore(s.length - l.length, r, e), l.splice(o, 1)
                                }
                            }
                            0 === l.length && ($eXeSopa.gameOver(0), n(".SPP-PuzzleSquare").addClass("complete"))
                        }
                        n(".selected").removeClass("selected"), f = null, c = [], h = "", d = null
                    };
                n("input.SSP-Word").removeClass("SPP-WordFound"), l = n("input.SSP-Word").toArray().map(t => t.value.toLowerCase()).filter(t => t).sort(), s = n("input.SSP-Word").toArray().map(t => t.value).filter(t => t), e(a, u = r.newPuzzleLax(l, $eXeSopa.optionsPuzzle)), n(".SPP-PuzzleSquare").click(function (t) {
                    t.preventDefault()
                }), window.navigator.msPointerEnabled ? (n(".SPP-PuzzleSquare").on("MSPointerDown", v), n(".SPP-PuzzleSquare").on("MSPointerOver", $), n(".SPP-PuzzleSquare").on("MSPointerUp", S)) : (n(".SPP-PuzzleSquare").mousedown(v), n(".SPP-PuzzleSquare").mouseenter(p), n(".SPP-PuzzleSquare").mouseup(S), n(".SPP-PuzzleSquare").on("touchstart", v), n(".SPP-PuzzleSquare").on("touchmove", g), n(".SPP-PuzzleSquare").on("touchend", S)), this.solve = function () {
                    for (var t = r.solve(u, l).found, e = 0, o = t.length; e < o; e++) {
                        var a = t[e].word,
                            i = t[e].orientation,
                            s = t[e].x,
                            f = t[e].y,
                            d = r.orientations[i],
                            c = n('input.SSP-Word[value="' + a + '"]');
                        if (!c.hasClass("SPP-WordFound")) {
                            for (var h = 0, v = a.length; h < v; h++) {
                                var g = d(s, f, h);
                                n('[x="' + g.x + '"][y="' + g.y + '"]').addClass("solved")
                            }
                            c.addClass("SPP-WordFound")
                        }
                    }
                }
            };
        a.emptySquaresCount = function () {
            var t = n(".SPP-PuzzleSquare").toArray();
            return t.length - t.filter(t => t.textContent.trim()).length
        }, a.insertWordBefore = function (t, r) {
            n('<li><input class="SSP-Word" value="' + (r || "") + '"></li>').insertBefore(t)
        }, a.append = function (t, r, e, o, a, i) {
            n('<li class="Sopa-Li"><span>' + (o + 1) + ".-  </span>" + (a ? '<a href="#" data-mnumber="' + o + '" class="SPP-LinkImage" title="">      <div class="SopaIcons SopaIcon-Image SPP-Activo"></div>      </a>' : "") + " " + (i ? '<a href="#" data-mnumber="' + o + '" class="SPP-LinkSound" title="">      <div class="SopaIcons SopaIcon-Audio SPP-Activo"></div>      </a>' : "") + "<span>" + (e || "") + '</span><input class="SSP-Word SPP-WordsHide" value="' + (r || "") + '"></li>').appendTo(t)
        }, window.WordFindGame = a
    }(document, jQuery, wordfind);