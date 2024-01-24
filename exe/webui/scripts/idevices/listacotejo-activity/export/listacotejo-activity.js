/**
 * Lista cotejo activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez y Javier Cayetano Rodríguez
 * Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeListaCotejo = {
  idevicePath: "",
  options: [],
  hasSCORMbutton: false,
  isInExe: false,
  data: null,
  hasLATEX: false,
  init: function () {
    this.activities = $(".listacotejo-IDevice");
    if (this.activities.length == 0) {
      $(".ctj-IDevice").hide();
      return;
    }
    if (!$eXeListaCotejo.supportedBrowser("Lista de cotejo")) return;
    if (
      typeof $exeAuthoring != "undefined" &&
      $("#exe-submitButton").length > 0
    ) {
      this.activities.hide();
      if (typeof _ != "undefined")
        this.activities.before("<p>" + _("Checklist") + "</p>");
      return;
    }
    if (typeof $exeAuthoring != "undefined") this.isInExe = true;
    this.idevicePath = this.isInExe
      ? "/scripts/idevices/listacotejo-activity/export/"
      : "";
    this.enable();
  },

  enable: function () {
    $eXeListaCotejo.loadGame();
  },
  loadGame: function () {
    $eXeListaCotejo.options = [];
    $eXeListaCotejo.activities.each(function (i) {
      var dl = $(".listacotejo-DataGame", this);
      var img = $(".listacotejo-LinkCommunity", this);
      if (img.length == 1) {
        img = img.attr("src") || "";
      } else {
        img = "";
      }
      var img1 = $(".listacotejo-LinkLogo", this);
      if (img1.length == 1) {
        img1 = img1.attr("src") || "";
      } else {
        img1 = "";
      }
      var img2 = $(".listacotejo-LinkDecorative", this);
      if (img2.length == 1) {
        img2 = img2.attr("src") || "";
      } else {
        img2 = "";
      }
      mOption = $eXeListaCotejo.loadDataGame(dl, img, img1, img2);
      $eXeListaCotejo.options.push(mOption);
      var ctj = $eXeListaCotejo.createInterfaceListaCotejo(i);
      dl.before(ctj).remove();
      $eXeListaCotejo.addEvents(i);
    });
    if ($eXeListaCotejo.hasLATEX && typeof MathJax == "undefined") {
      $eXeListaCotejo.loadMathJax();
    }
  },
  Decrypt: function (str) {
    if (!str) str = "";
    str = str == "undefined" || str == "null" ? "" : str;
    str = unescape(str);
    try {
      var key = 146,
        pos = 0,
        ostr = "";
      while (pos < str.length) {
        ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
        pos += 1;
      }

      return ostr;
    } catch (ex) {
      return "";
    }
  },
  loadDataGame: function (data, imglink, imglink1, imglink2) {
    var json = data.text();
    json = $eXeListaCotejo.Decrypt(json);
    var mOptions = $eXeListaCotejo.isJsonString(json),
      hasLatex = /(?:\\\(|\\\[|\\begin\{.*?})/.test(json);
    if (hasLatex) {
      $eXeListaCotejo.hasLATEX = true;
    }
    mOptions.urlCommunity = imglink;
    mOptions.urlLogo = imglink1;
    mOptions.urlDecorative = imglink2;
    mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;
    mOptions.useScore = typeof mOptions.useScore == "undefined" ? false : mOptions.useScore;
    mOptions.save = true;
    mOptions.showCounter = true;
    mOptions.points = 0
    mOptions.totalPoints = 0
    for (var i = 0; i < mOptions.levels.length; i++) {
      mOptions.levels[i].points = typeof mOptions.levels[i].points == 'undefined' ? '' : mOptions.levels[i].points;
      var parsedPoints = parseInt(mOptions.levels[i].points);
      if (!isNaN(parsedPoints)) {
          mOptions.totalPoints += parsedPoints;
      }
    }
    return mOptions;
  },

  saveCotejo: function (instance) {
    var mOptions = $eXeListaCotejo.options[instance];
    if (mOptions.id && mOptions.saveData && mOptions.save) {
      var name = $("#ctjUserName-" + instance).val() || '',
        date = $("#ctjUserDate-" + instance).val() || '',
        data = {
          name: name,
          date: date,
          items: [],
        },
        arr = [];
      $(".CTJP-Item").each(function () {
        var obj = {};
        var $checkbox = $(this).find("input[type='checkbox']");
        var $inputText = $(this).find("input[type='text']");
        var $select = $(this).find("select");
        if ($checkbox.length > 0 && $inputText.length > 0) {
          obj.type = 1;
          obj.state = $checkbox.is(":checked") ? 1 : 0;
          obj.text = $inputText.val();
        } else if ($checkbox.length > 0) {
          obj.type = 0;
          obj.state = $checkbox.is(":checked") ? 1 : 0;
          obj.text = "";
        } else if ($select.length > 0) {
          obj.type = 2;
          obj.state = $select.val();
          obj.text = $select.find("option:selected").text();
        } else {
          obj.type = 3;
          obj.state = false;
          obj.text = "";
        }
        arr.push(obj);
      });
      data.items = arr;

      data = JSON.stringify(data);
      localStorage.setItem("dataCotejo-" + mOptions.id, data);
    }
  },
  updateItems: function (id, instance) {
   
    var data = $eXeListaCotejo.getDataStorage(id);
    if (!data) return;
    var  arr = data.items || [];
    $("#ctjUserName-" + instance).val(data.name || '');
    $("#ctjUserDate-" + instance).val(data.date || '');
    $("#ctjItems-" + instance)
      .find(".CTJP-Item")
      .each(function (index) {
        var obj = arr[index];
        if (!obj) return;
        var $checkbox = $(this).find("input[type='checkbox']");
        var $inputText = $(this).find("input[type='text']");
        var $select = $(this).find("select");
        switch (obj.type) {
          case 0:
            if ($checkbox.length > 0) {
              $checkbox.prop("checked", obj.state === 1);
            }
            break;
          case 1:
            if ($checkbox.length > 0) {
              $checkbox.prop("checked", obj.state === 1);
            }
            if ($inputText.length > 0) {
              $inputText.val(obj.text);
            }
            break;
          case 2:
            if ($select.length > 0) {
              $select.val(obj.state);
            }
            break;
          case 3:
            break;
        }
      });
  },

  getDataStorage: function (id) {
    var id = "dataCotejo-" + id,
      data = $eXeListaCotejo.isJsonString(localStorage.getItem(id));
     return data;
  },

  isJsonString: function (str) {
    try {
      var o = JSON.parse(str, null, 2);
      if (o && typeof o === "object") {
        return o;
      }
    } catch (e) {}
    return false;
  },

  createInterfaceListaCotejo: function (instance) {
    var mOptions = $eXeListaCotejo.options[instance],
      urll = mOptions.urlLogo || $eXeListaCotejo.idevicePath + "cotejologo.png",
      urlc = mOptions.urlCommunity ||  $eXeListaCotejo.idevicePath + "cotejologocomunidad.png", 
      urld = mOptions.urlDecorative || $eXeListaCotejo.idevicePath + "cotejoicon.png",
      isMobile =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent),
      dl = mOptions.hasLogo ? "block" : "none",
      dc = mOptions.hasCommunity ? "block" : "none",
      dd = mOptions.hasDecorative && !isMobile ? "block" : "none",
      footer = mOptions.footer || "",
      df = footer ? "block" : "none",
      ud = mOptions.userData ? "flex" : "none",
      us= mOptions.userScore ? "block" : "none",
      html = "";
    html +=
      '<div class="CTJP-MainContainer">\
          <div class="CTJP-GameContainer" id="ctjGameContainer-' +  instance + '">\
            <div id="ctjList-' + instance + '" class="CTJP-List">\
              <div class="CTJP-Header">\
                <div class="CTJP-Images" style="background-image:url(' + urlc + ");display:" +  dc +  ';"></div>\
                <div class="CTJP-Images" style="background-image:url(' + urll + ");display:" +  dl +  ';"></div>\
              </div>\
              <div id="ctjTitle-' +  instance + '" class="CTJP-Title">' +  mOptions.title +  '</div>\
              <div id="ctjSubTitle-' +  instance +  '" class="CTJP-SubTitle">' + mOptions.subtitle +  '</div>\
              <div id="ctjUserData-' + instance + '" class="CTJP-UserData" style="display:' + ud + ';">\
              <div id="ctjUserNameDiv-' + instance + '" class="CTJP-UserName">\
                <label for=""ctjUserName-' + instance + '">' + mOptions.msgs.msgName + ': </label><input type="text" id="ctjUserName-' + instance + '">\
              </div>\
              <div id="ctjUserDateDiv-' + instance + '"  class="CTJP-UserDate">\
                  <label for="ctjUserDate-' + instance + '">' +  mOptions.msgs.msgDate + ': </label><input type="text" id="ctjUserDate-' +  instance +'">\
              </div>\
            </div>\
            <hr class="CTJP-Line"/>\
            <div class="CTJP-Counters">\
              <div id="ctjCounter-' +  instance +'" class="">' +  mOptions.msgs.msgComplit + '</div>\
              <div id="ctjScore-' +  instance +'" class="" style="display:'+ us +'">' +  mOptions.msgs.msgScore + '</div>\
            </div>\
            <div class="CTJP-Data">\
                <div id="ctjItems-' +instance + '" class="CTJP-Items" >' + $eXeListaCotejo.createItems(instance) + '</div>\
                <div class="CTJP-ImgDecorative" style="background-image:url(' + urld + ");display:" +  dd + ';"></div>\
            </div>\
            <div class="CTJP-Footer" style="display:' + df + '">' + footer +  '</div>\
          </div>\
          <div class="CTJP-Capture">\
              <a id="ctjCapture-' +  instance + '" href="#">' +  mOptions.msgs.msgSave + "</a>\
          </div>\
        </div>\
      </div>";
    return html;
  },

  addEvents: function (instance) {
    var mOptions = $eXeListaCotejo.options[instance];
    $("#ctjCapture-" + instance).on("click", function (e) {
      e.preventDefault();
      $eXeListaCotejo.saveReport(instance);
    });
    $('#ctjItems-'+instance).find(".CTJP-Item").on(
      "input",
      "input[type='checkbox'], input[type='text']",
      function () {
        $eXeListaCotejo.saveCotejo(instance);
        $eXeListaCotejo.counter(instance);
      }
    );
    $('#ctjItems-'+instance).find(".CTJP-Item").on("change", "select", function () {
      $eXeListaCotejo.saveCotejo(instance);
      $eXeListaCotejo.counter(instance);
    });

    $("#ctjUserName-"+instance).on("change", function () {
      $eXeListaCotejo.saveCotejo(instance);

    });

    $("#ctjUserDate-"+instance).on("change", function () {
      $eXeListaCotejo.saveCotejo(instance);

    });
    mOptions.save = false;
    if (mOptions.saveData && mOptions.id) {
      $eXeListaCotejo.updateItems(mOptions.id, instance);
      mOptions.save = true;
    }
    $eXeListaCotejo.counter(instance);
    $eXeListaCotejo.updateLatex("ctjGameContainer-" + instance);
  },
  counter: function (instance) {
    var mOptions = $eXeListaCotejo.options[instance];
    var completados = 0;
    var en_proceso = 0;
    var total_items = 0;
    var points = 0
    $(".CTJP-Item").each(function (i) {
      if ($(this).find('input[type="checkbox"], select').length > 0) {
        total_items++;
      }
      if ($(this).find('input[type="checkbox"]:checked').length > 0) {
        completados++;
        points +=  $eXeListaCotejo.convertToNumber(mOptions.levels[i].points)
      }
      if ($(this).find('select option[value="1"]:selected').length > 0) {
        completados++;
        points +=  $eXeListaCotejo.convertToNumber(mOptions.levels[i].points)

      }
      if ($(this).find('select option[value="2"]:selected').length > 0) {
        en_proceso++;
        points +=  $eXeListaCotejo.convertToNumber(mOptions.levels[i].points)/2

      }
    });
    mOptions.points = points;
    $("#ctjCounter-" + instance).hide();
    if (mOptions.showCounter) {
      var ct =mOptions.msgs.msgComplit +": " + completados + "/" +  total_items + ". ";
      if (en_proceso > 0) {
        ct += mOptions.msgs.msgInProgress + ": " + en_proceso + "/" +  total_items + ".";
      }
      if (completados == 0 && en_proceso == 0) {
        ct = mOptions.msgs.msgtaskNumber + ": " + total_items;
      }
      $("#ctjCounter-" + instance).text(ct);
      $("#ctjCounter-" + instance).show();
    }
    $("#ctjScore-" + instance).hide();
    if (mOptions.useScore && mOptions.totalPoints > 0){
        var ctj = mOptions.msgs.msgScore + ": " + mOptions.points + "/" +   mOptions.totalPoints + ".";
        $("#ctjScore-" + instance).text(ctj);
        $("#ctjScore-" + instance).show();
    }
  },
  convertToNumber:function (str) {
    var num = parseInt(str);  // O puedes usar parseInt(str) si solo quieres números enteros
    return isNaN(num) ? 0 : num;
  },
  loadMathJax: function () {
    if (!window.MathJax) {
      window.MathJax = $exe.math.engineConfig;
    }
    var script = document.createElement("script");
    script.src = $exe.math.engine;
    script.async = true;
    document.head.appendChild(script);
  },
  updateLatex: function (mnodo) {
    setTimeout(function () {
      if (typeof MathJax != "undefined") {
        try {
          if (MathJax.Hub && typeof MathJax.Hub.Queue == "function") {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "#" + mnodo]);
          } else if (typeof MathJax.typeset == "function") {
            var nodo = document.getElementById(mnodo);
            MathJax.typesetClear([nodo]);
            MathJax.typeset([nodo]);
          }
        } catch (error) {
          console.log("Error al refrescar cuestiones");
        }
      }
    }, 100);
  },
  saveReport: function (instance) {
    var mOptions = $eXeListaCotejo.options[instance];
    var divElement = document.getElementById("ctjList-" + instance);
    if (!divElement) {
      console.error("No se encontró el elemento con el ID proporcionado.");
      return;
    }
    var opacity = $("#ctjList-" + instance)
      .find("mjx-assistive-mml")
      .eq(0)
      .css("opacity");
    var mmls = $("#ctjList-" + instance).find("mjx-assistive-mml");
    mmls.each(function () {
      $(this).css("opacity", "0.0");
    });
    html2canvas(divElement)
      .then(function (canvas) {
        var imageData = canvas.toDataURL("image/png");
        var link = document.createElement("a");
        link.href = imageData;
        link.download = mOptions.msgs.msgList + ".png";
        link.click();
      })
      .catch(function (error) {
        mmls.each(function () {
          $(this).css("opacity", opacity);
        });
        console.error("Error al generar la captura: ", error);
      });
    mmls.each(function () {
      $(this).css("opacity", opacity);
    });
  },
  supportedBrowser: function (idevice) {
    var ua = window.navigator.userAgent,
      msie = ua.indexOf("MSIE "),
      sp = true;
    if (msie > 0) {
      var ie = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
      if (ie < 10) {
        var bns =
          $("." + idevice + "-bns")
            .eq(0)
            .text() || "Your browser is not compatible with this tool.";
        $("." + idevice + "-instructions").text(bns);
        sp = false;
      }
    }
    return sp;
  },
  createItems: function (instance) {
    var mOptions = $eXeListaCotejo.options[instance];
    var html = "";
    for (var level of mOptions.levels) {
      var marginLeft = 1.5 * parseInt(level.nivel) + 0.5;
      var msgp =  level.points.trim() == '1'? mOptions.msgs.msgPoint : mOptions.msgs.msgPoints;
      var msg = '('+level.points + ' ' + msgp +')';
      var points = mOptions.useScore && level.points.trim().length > 0 ? msg : '';
      if (level.type === "0") {
        html += `<div class="CTJP-Item"><input type="checkbox" style="margin-left: ${marginLeft}em" /><span style="">${level.item}</span></span><span class= "CTJP-Points">${points}</span></div>`;
      } else if (level.type === "1") {
        html += `<div class="CTJP-Item"><input type="checkbox" style="margin-left: ${marginLeft}em" /><span>${level.item}</span></span><span class= "CTJP-Points">${points}</span><input type="text" /></div>`;
      } else if (level.type === "2") {
        html += `<div class="CTJP-Item"><select  style="margin-left: ${marginLeft}em"  class="CTJ-Select"><option value="0" selected></option><option value="1">${mOptions.msgs.msgDone}</option><option value="2">${mOptions.msgs.msgInProgress}</option><option value="3">${mOptions.msgs.msgUnrealized}</option></select><span>${level.item}</span></span><span class= "CTJP-Points">${points}</span></div>`;
      } else if (level.type === "3") {
        html += `<div class="CTJP-Item"><span style="display:inlin-block;margin-left: ${marginLeft}em">${level.item}</span><span class= "CTJP-Points">${points}</span></div>`;
      }
    }

    return html;
  },
};
$(function () {
  $eXeListaCotejo.init();
});
