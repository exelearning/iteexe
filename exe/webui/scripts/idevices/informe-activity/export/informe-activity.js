/**
 * Evaluation activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeInforme = {
  idevicePath: "",
  borderColors: {
    black: "#1c1b1b",
    blue: "#5877c6",
    green: "#00a300",
    red: "#b3092f",
    white: "#ffffff",
    yellow: "#f3d55a",
  },
  colors: {
    black: "#1c1b1b",
    blue: "#dfe3f1",
    green: "#caede8",
    red: "#fbd2d6",
    white: "#ffffff",
    yellow: "#fcf4d3",
  },
  options: {},
  hasSCORMbutton: false,
  isInExe: false,
  data: null,
  menusNav: [],
  objeMenuNav: [],
  init: function () {
    this.activities = $(".informe-IDevice");
    if (this.activities.length == 0) {
      $(".informe-IDevice").hide();
      return;
    }
    if (!$eXeInforme.supportedBrowser("informe")) return;
    if (
      typeof $exeAuthoring != "undefined" &&
      $("#exe-submitButton").length > 0
    ) {
      this.activities.hide();
      if (typeof _ != "undefined")
        this.activities.before("<p>" + _("Progress report") + "</p>");
      return;
    }
    if (typeof $exeAuthoring != "undefined") this.isInExe = true;
    this.idevicePath = this.isInExe
      ? "/scripts/idevices/informe-activity/export/"
      : "";
    this.enable();
  },

  enable: function () {
    $eXeInforme.loadGame();
  },
  loadGame: function () {
    $eXeInforme.options = {};
    $eXeInforme.activities.each(function (i) {
      if (i == 0) {
        var dl = $(".informe-DataGame", this),
          mOption = $eXeInforme.loadDataGame(dl);
        $eXeInforme.options = mOption;
        var informe = $eXeInforme.createInterfaceinforme();
        dl.before(informe).remove();
        $eXeInforme.addEvents();
        $eXeInforme.menusNav = $eXeInforme.menusRead();
        var data = $eXeInforme.getDataStorage(mOption.evaluationID);
        $eXeInforme.generateTable1(data, mOption.number);
      }
    });
  },

  loadDataGame: function (data) {
    var json = data.text();
    var mOptions = $eXeInforme.isJsonString(json);
    mOptions.activeLinks =
      !$("body").hasClass("exe-scorm") &&
      typeof mOptions.activeLinks != "undefined"
        ? mOptions.activeLinks
        : false;
    return mOptions;
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
  createInterfaceinforme: function () {
    $("#informeMessage").html(
      "<p>" +
        $eXeInforme.options.msgs.msgNoCompletedActivities +
        "</p><p>" +
        $eXeInforme.options.msgs.msgNoPendientes.replace(
          "%s",
          $eXeInforme.options.number
        ) +
        "</p>"
    );

    var html = "";
    html = "";
    html +=
      '<div class="INFMP-MainContainer">\
        <div class="INFMP-Message" id="informeMessage"><p>' +
      $eXeInforme.options.msgs.msgNoCompletedActivities +
      "</p><p>" +
      $eXeInforme.options.msgs.msgNoPendientes.replace(
        "%s",
        $eXeInforme.options.number
      ) +
      '</p></div>\
            <div class="INFMP-GameContainer" id="informeGameContainer">\
                <div id="informeData" class="INFMP-Data" ></div>\
            </div>\
            <a id="informeDownloadLink" href="#" download="imagen.jpg" style="display: none;">Descargar imagen</a>\
        </div>\
    </div>';
    return html;
  },
  menusRead: function () {
    var menus = [];
    if ($eXeInforme.isInExe) {
      menus = $eXeInforme.generateNavArrayExe();
    } else {
      menus = $eXeInforme.generateNavArray();
    }
    return menus;
  },

  generateNavArrayExe: function () {
    var sbody = $("body", window.parent.document)
        .find('[id^="treepanel"][id$="body"]')
        .find(".x-grid-table .x-grid-row"),
      results = [],
      position = "",
      index1 = 1,
      index2 = 0,
      index3 = 0,
      index4 = 0,
      index5 = 0;
    index6 = 0;
    sbody.each(function (i) {
      var text = $(this).find(".x-grid-cell-inner").text().trim();
      var link = "";
      if (i == 0) {
        position = "1.";
      } else {
        var imgs = $(this).find(".x-grid-cell-inner img").length;
        if (imgs == 3) {
          index1++;
          index2 = 0;
          index3 = 0;
          index4 = 0;
          index5 = 0;
          index6 = 0;
        } else if (imgs == 4) {
          index2++;
          index3 = 0;
          index4 = 0;
          index5 = 0;
          index6 = 0;
        } else if (imgs == 5) {
          index3++;
          index4 = 0;
          index5 = 0;
          index6 = 0;
        } else if (imgs == 6) {
          index4++;
          index5 = 0;
          index6 = 0;
        } else if (imgs == 7) {
          index5++;
          index6 = 0;
        } else if (imgs == 8) {
          index6++;
        }
        position =
          index1 +
          "." +
          index2 +
          "." +
          index3 +
          "." +
          index4 +
          "." +
          index5 +
          "." +
          index6 +
          ".";
        position = position.replace(/\.0\..*/, "");
        if (position.slice(-1) !== ".") {
          position += ".";
        }
      }
      results.push({
        text: text,
        link: link,
        position: position,
      });
    });
    return results;
  },
  generateNavArray: function () {
    var arr = [];
    function processListItems(listItems, prefix) {
      listItems.each(function (index) {
        var position = prefix + (index + 1),
          linkElement = $(this).children("a").first(),
          obj = {
            text: linkElement.text(),
            link: linkElement.attr("href"),
            position: position.toString() + ".",
          };
        arr.push(obj);
        var subListItems = $(this).find("> ul > li");
        if (subListItems.length > 0) {
          processListItems(subListItems, position + ".");
        }
      });
    }
    processListItems($("#siteNav > ul > li"), "");
    return arr;
  },

  createLinkNode: function (node) {
    var link = node.text;
    if (!$eXeInforme.isInExe && $eXeInforme.options.activeLinks) {
      link =
        '<a href="' +
        node.link +
        '" style="color:#333333">' +
        node.text +
        "</a>";
    }
    return link;
  },

  linkNode: function (texto_link, numnod) {
    var texto_link_sanitized = texto_link
      .replace(/ /g, "_")
      .replace(/[^\w\s]/gi, "");
    var url = texto_link_sanitized.toLowerCase() + ".html";
    if (numnod == 0) {
      url = "index.html";
    }
    return url;
  },

  createRowIdevice: function (
    idevice,
    bcolor,
    color,
    type,
    date,
    node,
    margin
  ) {
    var txtIdevice = "";
    if (!$eXeInforme.isInExe && $eXeInforme.options.activeLinks) {
      txtIdevice +=
        '<div class="INFMP-Activity" style="background-color:' +
        bcolor +
        "; margin-left:" +
        margin +
        '">\
            <div><span id="informeName" style="color:' +
        color +
        ';"><a href="' +
        node.link +
        "#ac-" +
        idevice.id +
        '" style="color:' +
        color +
        ';" title="' +
        $eXeInforme.options.msgs.msgSeeActivity +
        '">' +
        idevice.name +
        "</a></span>" +
        type +
        '</div>\
            <div class="INFMP-DateScore"></span>' +
        date +
        ' </span><span style="color:' +
        color +
        ';">' +
        idevice.score +
        "</span>\
            </div>\
            </div>";
    } else {
      txtIdevice +=
        '<div class="INFMP-Activity" style="background-color:' +
        bcolor +
        "; margin-left:" +
        margin +
        '">\
            <div ><span id="informeName" style="color:' +
        color +
        ';">' +
        idevice.name +
        "</span>" +
        type +
        '</div>\
            <div class="INFMP-DateScore"><span>' +
        date +
        '</span><span style="color:' +
        color +
        ';">' +
        idevice.score +
        "</span>\
            </div>\
            </div>";
    }
    return txtIdevice;
  },

  generateTable1: function (data, number) {
    var num = number;
    var scoretotal = 0;
    const nodes = {};
    var cabecera = "";
    var table = "";
    var z = 0;
    var ud = $eXeInforme.options.userData ? "flex" : "none";
    if (data) {
      $("#informeMessage").text(
        $eXeInforme.options.msgs.msgCompletedActivities
      );
    } else {
      $("#informeMessage").html(
        "<p>" +
          $eXeInforme.options.msgs.msgNoCompletedActivities +
          "</p><p>" +
          $eXeInforme.options.msgs.msgNoPendientes.replace(
            "%s",
            $eXeInforme.options.number
          ) +
          "</p>"
      );
    }
    table +=
      '<div class="INFMP-Node">' +
      $eXeInforme.options.msgs.mgsSections +
      ":</div>";
    for (var nod = 0; nod < $eXeInforme.menusNav.length; nod++) {
      var node = $eXeInforme.menusNav[nod],
        margin = (node.position.split(".").length - 2) * 16 + "px";

      table +=
        '<div class="INFMP-Node" style="margin-left:' +
        margin +
        '">' +
        node.position +
        "&nbsp;" +
        $eXeInforme.createLinkNode(node) +
        "</div>";
      var j = 0,
        bcolor = "#dddddd",
        color = "#007F5F";
      if (data) {
        for (var acts = 0; acts < data.length; acts++) {
          if ($eXeInforme.menusNav[nod].text == data[acts].node) {
            var date = $eXeInforme.options.showDate
              ? '<span id="informeDate">(' + data[acts].date + ") </span>"
              : "";
            var type = $eXeInforme.options.showTypeGame
              ? '<span id="informeType">. ' +
                $eXeInforme.options.msgs.msgType +
                ":&nbsp" +
                data[acts].type +
                " </span>"
              : "";
            color = parseFloat(data[acts].score) < 5 ? "#B61E1E" : "#007F5F";
            table += $eXeInforme.createRowIdevice(
              data[acts],
              bcolor,
              color,
              type,
              date,
              node,
              margin
            );
            j++;
            z++;
            scoretotal += parseFloat(data[acts].score);
            if (j % 2 == 0) {
              bcolor = "#dddddd";
            } else {
              bcolor = "#f9f9f9";
            }
          }
        }
      }
    }
    var scorepartial = z > 0 ? (scoretotal / z).toFixed(2) : "0.00";
    scoretotal = (scoretotal / num).toFixed(2);
    var bgc = scoretotal < 5 ? "#B61E1E" : "#007F5F";
    table +=
      '<div class="INFMP-GameScore" style="background-color:' +
      bgc +
      ';"><div>' +
      $eXeInforme.options.msgs.msgAverageScore +
      "</div><div>" +
      scoretotal +
      "</div></div>";
    table += "</div>";
    table +=
      '<div id="informeButtons" class="INFMP-LinksInforme" style="background-color:white; text-align:right">\
                        <a id="informeReboot" href="#">' +
      $eXeInforme.options.msgs.msgReboot +
      '</a>\
                        <a id="informeCapture" href="#">' +
      $eXeInforme.options.msgs.msgSave +
      "</a>\
                  </div>";
    table += "</div>";
    cabecera =
      '<div class="INFMP-Table" id="informeTable">\
                        <div id="informeTitleProyect" class="INFMP-Title">' +
      $eXeInforme.options.msgs.msgReportTitle +
      '</div>\
      <div id="informeUserData" class="INFMP-UserData" style="display:' + ud +';">\
                  <div id="informeUserNameDiv" class="INFMP-UserName">\
                    <label for=""informeUserName">' + $eXeInforme.options.msgs.msgName +': </label><input type="text" id="informeUserName">\
                  </div>\
                  <div id="informeUserDateDiv" class="INFMP-UserDate">\
                    <label for="informeUserDate">' +  $eXeInforme.options.msgs.msgDate +': </label><input type="text" id="informeUserDate" disabled>\
                  </div>\
                </div>\
                        <div class="INFMP-Header">\
                            <div id="informeTotalActivities">' +
      $eXeInforme.options.msgs.mssActivitiesNumber.replace("%s", number) +
      '</div>\
                            <div id="informeCompletedActivities">' +
      $eXeInforme.options.msgs.msgActivitiesCompleted.replace("%s", z) +
      '</div>\
                            <div id="informeTotalScoreA">' +
      $eXeInforme.options.msgs.msgAverageScoreCompleted.replace(
        "%s",
        scorepartial
      ) +
      '</div>\
                            <div id="informeTotalScore">' +
      $eXeInforme.options.msgs.msgAverageScore1.replace("%s", scoretotal) +
      '</div>\
                        </div>\
                        <div id="informePlusDiv" class="INFMP-Plus">';
    table = cabecera + table;
    $("#informeData").empty();
    $("#informeData").append(table);
    $("#informeUserDate").val( $eXeInforme.getDateNow());
    if (!$eXeInforme.isInExe) {
      var headerContent = $("#headerContent").text();
      if (headerContent && headerContent.length > 0) {
        $("#informeTitleProyect").text(headerContent);
      }
    }
  },

  getDataStorage: function (id) {
    var id = "dataEvaluation-" + id,
      data = $eXeInforme.isJsonString(localStorage.getItem(id));
    return data.activities;
  },

  addEvents: function () {
    $("#informeGameContainer").on("click", "#informeLinkPlus", function (e) {
      e.preventDefault();
      $("#informePlusDiv").slideToggle();
    });

    $("#informeGameContainer").on("click", "#informeReboot", function (e) {
      e.preventDefault();
      if (confirm($eXeInforme.options.msgs.msgDelete)) {
        localStorage.removeItem(
          "dataEvaluation-" + $eXeInforme.options.evaluationID
        );
        $eXeInforme.generateTable1(false, $eXeInforme.options.number);
      }
    });
    $("#informeGameContainer").on("click", "#informeCapture", function (e) {
      e.preventDefault();
      $eXeInforme.saveReport();
    });
  },
  saveReport: function () {
    if($eXeInforme.options.userData){
      if($('#informeUserName').val().trim() === ""){
        var msg= $eXeInforme.options.msgs.msgNotCompleted+': '+ $eXeInforme.options.msgs.msgName;
        alert(msg);
        return;
      }
    }
    var divElement = document.getElementById("informeTable");
    if (!divElement) {
      console.error("No se encontró el elemento con el ID proporcionado.");
      return;
    }
    $("#informeButtons").hide();
    html2canvas(divElement)
      .then(function (canvas) {
        var imageData = canvas.toDataURL("image/png");
        var link = document.createElement("a");
        link.href = imageData;
        link.download = $eXeInforme.options.msgs.msgReport + ".png";
        link.click();
      })
      .catch(function (error) {
        $("#informeButtons").show();
        console.error("Error al generar la captura: ", error);
      });
    $("#informeButtons").show();
  },

  showMessage: function (type, message) {
    var colors = [
        "#555555",
        $eXeInforme.borderColors.red,
        $eXeInforme.borderColors.green,
        $eXeInforme.borderColors.blue,
        $eXeInforme.borderColors.yellow,
      ],
      color = colors[type];
    $("#informePAuthor-" + instance).text(message);
    $("#informePAuthor-" + instance).css({
      color: color,
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
   getDateNow: function() {
    var dateNow = new Date();
    var dia = $eXeInforme.addZero(dateNow.getDate());
    var mes = $eXeInforme.addZero(dateNow.getMonth() + 1); // Los meses van de 0 a 11
    var anio = dateNow.getFullYear();
    var hora = $eXeInforme.addZero(dateNow.getHours());
    var minutos = $eXeInforme.addZero(dateNow.getMinutes());
    var segundos = $eXeInforme.addZero(dateNow.getSeconds());

    return dia + "/" + mes + "/" + anio + " " + hora + ":" + minutos + ":" + segundos;
  },
  addZero: function(number) {
     return number < 10 ? "0" + number : number;
  }
};
$(function () {
  $eXeInforme.init();
});
