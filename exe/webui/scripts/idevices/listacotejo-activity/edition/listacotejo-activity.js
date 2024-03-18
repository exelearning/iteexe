/**
/**
 * informe Activity iDevice (edition code)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narvaez Martinez y Javier Cayetano Rodríguez
 * Ana María Zamora Moreno
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 */
var $exeDevice = {
  i18n: {
    category: _("Other Contents"),
    name: _("Checklist"),
  },
  msgs: {},
  id: false,
  iDevicePath: "/scripts/idevices/listacotejo-activity/edition/",
  ci18n: {
    msgComplit: _("Completed"),
    msgDone: _("Done"),
    msgInProgress: _("In progress"),
    msgUnrealized: _("Not completed"),
    msgtaskNumber: _("Number of tasks"),
    msgName: _("Name"),
    msgDate: _("Date"),
    msgSave: _("Download"),
    msgList: _("checklist"),
    msgScore: _("Score"),
    msgPoints: _("points"),
    msgPoint: _("point"),
    msgReboot: _("Restart"),
    msgDelete: _("Are you sure you want clear all form fields?"),

  },
  init: function () {
    this.createForm();
    this.addEvents();
  },
  setMessagesInfo: function () {
    var msgs = this.msgs;
    msgs.msgEProvideID = _("Please provide the ID of this report");
  },
  createForm: function () {
    var html =
      '<div id="gameQEIdeviceForm">\
            <div class="exe-idevice-info">' + _("You can use a checklist as a structured and easy way to understand the suggested activities in this educational resource. It will be a useful instrument for student self-assessment, allowing you to monitor the completed activities.") +  ' <a href="https://descargas.intef.es/cedec/exe_learning/Manuales/manual_exe29/lista_de_cotejo.html" hreflang="es" target="_blank">' + _("Use Instructions") + '</a></div>\
            <div class="exe-form-tab" title="' +  _("General settings") + '">\
            ' +   $exeAuthoring.iDevice.gamification.instructions.getFieldset(_("Complete the checklist ticking the boxes for all finished activities.")) + '\
              <fieldset class="exe-fieldset">\
              <legend><a href="#">' + _("Options") + '</a></legend>\
                  <div>\
                      <p style="display: flex; justify-content: space-between; width: 100%">\
                        <label for="ctjTitle">'+_("Title")+':</label>\
                        <input id="ctjTitle" type="text"  style="flex-grow: 1; margin-left: 10px" />\
                      </p>\
                      <p style="display: flex;justify-content: space-between; width: 100%;margin-top: 10px;">\
                        <label for="ctjSubTitle">'+_("Caption")+':</label>\
                          <input id="ctjSubTitle" type="text" style="flex-grow: 1; margin-left: 10px"/>\
                      </p>\
                      <p>\
                        <label for="ctjUserData"><input type="checkbox" id="ctjUserData" /> ' + _("User data") +  '. </label>\
                      </p>\
                      <p>\
                        <label for="ctjSaveData"><input type="checkbox" id="ctjSaveData" /> ' + _("Remember marked options") + '. </label>\
                      </p>\
                      <p>\
                        <label for="ctjUseScore"><input type="checkbox" id="ctjUseScore" /> ' + _("Assign scores") + '. </label>\
                      </p>\
                      <p>'+_("(*) Cells support formatted text") + '.</p>\
                      <p class="CTJ-table-container">\
                        <table class="CTJ-Table">\
                          <thead>\
                            <tr class="CTJ-header-row">\
                              <th class="CTJ-TypeColumn">'+_("Type") +'</th>\
                              <th class="CTJ-Points-column" data-points="0">'+_("Points") +'</th>\
                              <th class="CTJ-Level1-column" data-nivel="0">'+_("Level") +' 1</th>\
                              <th class="CTJ-Level2-column" data-nivel="1">'+_("Level") +' 2</th>\
                              <th class="CTJ-Level3-column" data-nivel="2">'+_("Level") +' 3</th>\
                              <th class="CTJ-Level4-column" data-nivel="3">'+_("Level") +' 4</th>\
                              <th class="CTJ-editar-column">'+_("Edit") +'</th>\
                            </tr>\
                          </thead>\
                          <tbody>\
                            <tr class="CTJ-data-row">\
                              <td class="CTJ-Types">\
                                <select class="CTJ-Select">\
                                  <option value="0" selected>'+_("Box") +'</option>\
                                  <option value="1">'+_("Text") +'</option>\
                                  <option value="2">'+_("Selection") +'</option>\
                                  <option value="3">'+_("Do not mark") +'</option>\
                                </select>\
                              </td>\
                              <td class="CTJ-Points" contenteditable="true"></td>\
                              <td class="CTJ-Level1 CTJ-Levels" contenteditable="true"></td>\
                              <td class="CTJ-Level2 CTJ-Levels" contenteditable="true"></td>\
                              <td class="CTJ-Level3 CTJ-Levels" contenteditable="true"></td>\
                              <td class="CTJ-Level4 CTJ-Levels" contenteditable="true"></td>\
                              <td class="CTJ-Editions">\
                                <button class="CTJ-Add">'+_("Add")+'</button>\
                                <button class="CTJ-Delete">'+_("Delete")+'</button>\
                              </td>\
                            </tr>\
                          </tbody>\
                        </table>\
                      </p>\
                      <p>\
                        <div><label for="ctjCommunity"><input type="checkbox" id="ctjCommunity" /> ' + _("(Left) Logo") +  '. </label> </div>\
                        <div id="ctjcommunitylogo" class="CTJ-Logo">\
                          <div class="CTJ-Images">\
                            <img class="CTJ-EMedia" src="' +   $exeDevice.iDevicePath + 'codejocomunidad.png" id="ctjEImageCommunity" alt="' + _("Image") + '" />\
                            <img class="CTJ-EMedia" src="' +  $exeDevice.iDevicePath + 'codejocomunidad.png" id="ctjEImageNoCommunity" alt="' + _("No image") +'" />\
                          </div>\
                          <div class="CTJ-InputImage">\
                              <label class="sr-av" for="ctjEURLCommunity">' +  _("Community") + ':</label>\
                              <input type="text" class="exe-file-picker CTJ-EURLImage"  id="ctjEURLCommunity"/>\
                              <a href="#" id="ctjEPlayCommunity" class="CTJ-ENavigationButton CTJ-EPlayVideo" title="' +  _("Show") + '"><img src="' +  $exeDevice.iDevicePath + 'quextIEPlay.png" alt="' +  _("Show") + '" class="CTJ-EButtonImage b-play" /></a>\
                          </div>\
                        </div>\
                      </p>\
                      <p>\
                        <div><label for="ctjLogo"><input type="checkbox" id="ctjLogo" /> ' +  _("(Right) Logo") + '. </label> </div>\
                        <div id="ctjlogologo"  class="CTJ-Logo">\
                          <div class="CTJ-Images">\
                            <img class="CTJ-EMedia" src="' +  $exeDevice.iDevicePath + 'cotejologo.png" id="ctjEImageLogo" alt="' +  _("Image") +  '" />\
                            <img class="CTJ-EMedia" src="' +  $exeDevice.iDevicePath + 'cotejologo.png" id="ctjEImageNoLogo" alt="' +  _("No image") + '" />\
                          </div>\
                          <div class="CTJ-InputImage">\
                              <label class="sr-av" for="ctjEURLLogo">' +  _("Logo") + ':</label>\
                              <input type="text" class="exe-file-picker CTJ-EURLImage"  id="ctjEURLLogo"/>\
                              <a href="#" id="ctjEPlayLogo" class="CTJ-ENavigationButton CTJ-EPlayVideo" title="' +  _("Show") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEPlay.png" alt="' +  _("Show") + '" class="CTJ-EButtonImage b-play" /></a>\
                          </div>\
                        </div>\
                      </p>\
                      <p>\
                          <div><label for="ctjDecorative"><input type="checkbox" id="ctjDecorative" /> ' +  _("Decorative image") + '. </label> </div>\
                          <div id="ctjdecorativelogo"  class="CTJ-Logo">\
                            <div class="CTJ-Images">\
                              <img class="CTJ-EMedia" src="' +  $exeDevice.iDevicePath + 'cotejodecorative.png" id="ctjEImageDecorative" alt="' + _("Image") + '" />\
                              <img class="CTJ-EMedia" src="' + $exeDevice.iDevicePath + 'cotejodecorative.png" id="ctjEImageNoDecorative" alt="' + _("No image") +  '" />\
                            </div>\
                            <div class="CTJ-InputImage">\
                                <label class="sr-av" for="ctjEURLDecorative">' +   _("Community") + ':</label>\
                                <input type="text" class="exe-file-picker CTJ-EURLImage"  id="ctjEURLDecorative"/>\
                                <a href="#" id="ctjEPlayDecorative" class="CTJ-ENavigationButton CTJ-EPlayVideo" title="' + _("Show") + '"><img src="' + $exeDevice.iDevicePath + 'quextIEPlay.png" alt="' + _("Show") + '" class="CTJ-EButtonImage b-play" /></a>\
                            </div>\
                          </div>\
                      </p>\
                      <p>\
                          <label for="ctjFooter">' +  _("Footer") + '</label>\
                          <input id="ctjFooter" style="width:500px" type="text" CTJ-EURLImage" value="Esta <a href=https://es.wikipedia.org/wiki/Lista_de_comprobaci%C3%B3n>lista de cotejo</a> se encuentra bajo una licencia</br><a href=http://creativecommons.org/licenses/by-sa/4.0>Creative Commons Reconocimiento-Compartir igual 4.0 International License</a>"/>\
                      </p>\
                  </div>\
              </fieldset>\
          ' + $exeAuthoring.iDevice.common.getTextFieldset("after") + "\
        </div>\
        " +  $exeAuthoring.iDevice.gamification.common.getLanguageTab(this.ci18n) +  "\
      </div>\
      ";

    var field = $("textarea.jsContentEditor").eq(0);
    field.before(html);
    $exeAuthoring.iDevice.tabs.init("gameQEIdeviceForm");
    $(".CTJ-Table .CTJ-Points-column, .CTJ-Table .CTJ-Points").hide();
    $exeDevice.loadPreviousValues(field);
  },


  loadPreviousValues: function (field) {
    var originalHTML = field.val();
    if (originalHTML != "") {
      var wrapper = $("<div></div>");
      wrapper.html(originalHTML);
      var json = $(".listacotejo-DataGame", wrapper).text();
      json = $exeDevice.Decrypt(json);
      var dataGame = $exeDevice.isJsonString(json);
      var img = $(".listacotejo-LinkLogo", wrapper);
      if (img.length == 1) {
        img = img.attr("src") || "";
        dataGame.urlLogo = img;
      }
      img = $(".listacotejo-LinkCommunity", wrapper);
      if (img.length == 1) {
        img = img.attr("src") || "";
        dataGame.urlCommunity = img;
      }
      img = $(".listacotejo-LinkDecorative", wrapper);
      if (img.length == 1) {
        img = img.attr("src") || "";
        dataGame.urlDecorative = img;
      }
      $exeDevice.updateFieldGame(dataGame);
      var instructions = $(".listacotejo-instructions", wrapper);
      if (instructions.length == 1) {
        instructions = instructions.html() || "";
        if (tinyMCE.get("eXeGameInstructions")) {
          tinyMCE.get("eXeGameInstructions").setContent(instructions);
        } else {
          $("#eXeGameInstructions").val(instructions);
        }
      }
      var textAfter = $(".listacotejo-extra-content", wrapper);
      if (textAfter.length == 1) {
        textAfter = textAfter.html() || "";
        if (tinyMCE.get("eXeIdeviceTextAfter")) {
          tinyMCE.get("eXeIdeviceTextAfter").setContent(textAfter);
        } else {
          $("#eXeIdeviceTextAfter").val(textAfter);
        }
      }
      $exeAuthoring.iDevice.gamification.common.setLanguageTabValues(
        dataGame.msgs
      );
    }
  },
  actualizeTable: function (arrayLevels) {
    const tbody = $(".CTJ-Table tbody");
    const useScore = $("#ctjUseScore").is(":checked");
    tbody.empty();
    arrayLevels.forEach((obj) => {
      const row = $("<tr></tr>").addClass("CTJ-data-row");
      const select = $("<select></select>").addClass("CTJ-Select");
      [_("Box"), _("Text"), _("Choose"),_("Do not mark")].forEach((option, index) => {
        const optElement = $("<option></option>")
          .attr("value", index)
          .html(option);
        if (index == obj.type) {
          optElement.prop("selected", true);
        }
        select.append(optElement);
      });
      const selectCell = $("<td></td>").append(select);
      row.append(selectCell);
      let edit = obj.type != 3;
      edit = edit.toString();
      const text = obj.type != 3 ? obj.points : '';
      const points =$("<td></td>")
            .addClass('CTJ-Points')
            .attr("contenteditable", edit)
      points.html(text)
      row.append(points);

      for (let i = 0; i < 4; i++) {
        const cell = $("<td></td>")
          .addClass(`CTJ-Level${i + 1} CTJ-Levels`)
          .attr("contenteditable", "true");
        if (i == obj.nivel) {
          cell.html(obj.item);
        }
        row.append(cell);
      }
      const addButton = $("<button>"+_("Add")+"</button>").addClass("CTJ-Add");
      const deleteButton = $("<button>"+_("Delete")+"</button>").addClass(
        "CTJ-Delete"
      );
      const editCell = $("<td></td>")
        .addClass("CTJ-Editions")
        .append(addButton, deleteButton);
      row.append(editCell);

      tbody.append(row);
    });
    if(useScore) {
        $(".CTJ-Table .CTJ-Points-column, .CTJ-Table .CTJ-Points").show();
    } else {
        $(".CTJ-Table .CTJ-Points-column, .CTJ-Table .CTJ-Points").hide();
    }
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
  save: function () {
    var dataGame = $exeDevice.validateData();
    if (!dataGame) {
      return false;
    }
    var fields = this.ci18n,
      i18n = fields;
    for (var i in fields) {
      var fVal = $("#ci18n_" + i).val();
      if (fVal != "") i18n[i] = fVal;
    }
    dataGame.msgs = i18n;
    var json = JSON.stringify(dataGame),
      divContent = "",
      json = $exeDevice.Encrypt(json),
      html = '<div class="listacotejo-IDevice">';
    var instructions = tinyMCE.get("eXeGameInstructions").getContent();
    if (instructions != "") {
      divContent = '<div class="ctj-instructions CTJ-instructions">' + instructions + "</div>";
    }
    html += divContent;
    html += '<div class="listacotejo-DataGame js-hidden">' + json + "</div>";
    html += '<div class="listacotejo-bns js-hidden">' +  _("Unsupported browser") + "</div>";
    var textAfter = tinyMCE.get("eXeIdeviceTextAfter").getContent();
    if (textAfter != "") {
      html += '<div class="listacotejo-extra-content">' + textAfter + "</div>";
    }
    var img = $("#ctjEURLLogo").val();
    if (img.trim().length > 0) {
      img = '<img src="' +  img + '" class="js-hidden listacotejo-LinkLogo" alt="logo" />';
      html += img;
    }
    var img = $("#ctjEURLCommunity").val();
    if (img.trim().length > 0) {
      img = '<img src="' +  img +'" class="js-hidden listacotejo-LinkCommunity" alt="Community" />';
      html += img;
    }
    var img = $("#ctjEURLDecorative").val();
    if (img.trim().length > 0) {
      img ='<img src="' + img + '" class="js-hidden listacotejo-LinkDecorative" alt="Decorative" />';
      html += img;
    }
    html += "</div>";
    return html;
  },

  showMessage: function (msg) {
    eXe.app.alert(msg);
  },

  validateData: function () {
    var title = $("#ctjTitle").val().trim(),
      subtitle = $("#ctjSubTitle").val().trim(),
      hasLogo = $("#ctjLogo").is(":checked"),
      urlLogo = $("#ctjEURLLogo").val().trim(),
      hasCommunity = $("#ctjCommunity").is(":checked"),
      urlCommunity = $("#ctjEURLCommunity").val().trim(),
      hasDecorative = $("#ctjDecorative").is(":checked"),
      urlDecorative = $("#ctjEURLDecorative").val().trim(),
      footer = $("#ctjFooter").val().trim(),
      saveData = $("#ctjSaveData").is(":checked");
      userData = $("#ctjUserData").is(":checked");
      useScore = $("#ctjUseScore").is(":checked");
    (isLevelComplete = false), (isMoreThanOneLevelFilled = false);
    if (title === "") {
      $exeDevice.showMessage(_("Indicate a title for the checklist"));
      return false;
    }
    $(".CTJ-data-row").each(function () {
      var $row = $(this);
      var filledLevels = $row
        .find(".CTJ-Level1, .CTJ-Level2, .CTJ-Level3, .CTJ-Level4")
        .filter(function () {
          return $(this).text().trim() !== "";
        }).length;

      if (filledLevels === 0) {
        $exeDevice.showMessage(_("No empty items can be left"));
        return false;
      }
      if (filledLevels > 0) {
        isLevelComplete = true;
      }

      if (filledLevels > 1) {
        isMoreThanOneLevelFilled = true;
        return false;
      }
    });

    if (!isLevelComplete) {
      return false;
    }
    if (isMoreThanOneLevelFilled) {
      $exeDevice.showMessage(
        _("You can only use text at this item\'s level")
      );
      return false;
    }
    var arrayLevels = [];
    var scoreError = 0;
    $(".CTJ-Table .CTJ-data-row").each(function () {
      var $fila = $(this);
      var type = $fila.find(".CTJ-Select option:selected").val();
      var nivel = "";
      var item = "";
      var points = $fila.find('.CTJ-Points').eq(0).text()
      $fila.find('.CTJ-Levels').each(function () {
        if ($(this).text().trim() !== "") {
          nivel = $(".CTJ-Table th").eq($(this).index()).attr("data-nivel");
          item = $(this).html();
          return false;
        }
      });
      if (useScore){
        if(type == 3  && points.trim().length > 0){
          scoreError = 2;
          return false;
        }
      }
      var obj={
        type: type,
        nivel: nivel,
        item: item,
        points: points
      }

      arrayLevels.push(obj);
      
    });
    if(scoreError == 1){
      $exeDevice.showMessage(_("You must indicate the number of points for each item to be assesed"));
      return false;
    } else if(scoreError == 2){
      $exeDevice.showMessage(_("You cannot indicate a score for this type of boxes"));
      return false;
    }
    var data = {
      typeGame: "Cotejo",
      id : $exeDevice.id ? $exeDevice.id : $exeDevice.generarID(),
      title: title,
      subtitle: subtitle,
      levels: arrayLevels,
      hasLogo: hasLogo,
      urlLogo: urlLogo,
      hasCommunity: hasCommunity,
      urlCommunity: urlCommunity,
      hasDecorative: hasDecorative,
      urlDecorative: urlDecorative,
      saveData: saveData,
      userData: userData,
      footer: footer,
      useScore: useScore
    };

    return data;
  },
  isNumberInteger:function(str) {
    var num = Number(str);
    return num >= 0 && num === parseInt(str, 10);
  },
  generarID: function () {
    var fecha = new Date(),
        a = fecha.getUTCFullYear(),
        m = fecha.getUTCMonth() + 1,
        d = fecha.getUTCDate(),
        h = fecha.getUTCHours(),
        min = fecha.getUTCMinutes(),
        s = fecha.getUTCSeconds(),
        o = fecha.getTimezoneOffset();

    var IDE = `${a}${m}${d}${h}${min}${s}${o}`;
    return IDE;
},
  addEvents: function () {
    $(".CTJ-Add").click(function (e) {
      e.preventDefault();
      var parentRow = $(this).closest(".CTJ-data-row"),
        clonedRow = parentRow.clone(true);
      clonedRow
        .find(".CTJ-Level1, .CTJ-Level2, .CTJ-Level3, .CTJ-Level4")
        .html("");
      clonedRow.insertAfter(parentRow);
    });
    $(".CTJ-Delete").click(function (e) {
      e.preventDefault();
      if ($(".CTJ-data-row").length > 1) {
        if (confirm("¿Desea eliminar esta fila?")) {
          $(this).closest(".CTJ-data-row").remove();
        }
      } else {
        $exeDevice.showMessage(_("There must be at least one row."));
      }
    });
    $("#ctjEURLLogo").on("change", function () {
      var validExt = ["jpg", "png", "gif", "jpeg", "svg"],
        selectedFile = $(this).val(),
        ext = selectedFile.split(".").pop().toLowerCase();
      if (
        (selectedFile.indexOf("resources") == 0 ||
          selectedFile.indexOf("/previews/") == 0) &&
        validExt.indexOf(ext) == -1
      ) {
        $exeDevice.showMessage(
          _("Supported formats") + ": jpg, jpeg, gif, png, svg"
        );
        return false;
      }
      var url = selectedFile,
        alt = _("Project logo");
      $exeDevice.showImage("#ctjEImageLogo", "#ctjEImageNoLogo", url, alt);
    });
    $("#ctjEPlayLogo").on("click", function (e) {
      e.preventDefault();
      var validExt = ["jpg", "png", "gif", "jpeg", "svg"],
        selectedFile = $("#ctjEURLLogo").val(),
        ext = selectedFile.split(".").pop().toLowerCase();
      if (
        (selectedFile.indexOf("resources") == 0 ||
          selectedFile.indexOf("/previews/") == 0) &&
        validExt.indexOf(ext) == -1
      ) {
        $exeDevice.showMessage(
          _("Supported formats") + ": jpg, jpeg, gif, png, svg"
        );
        return false;
      }
      var url = selectedFile,
        alt = _("Project logo");
      $exeDevice.showImage("#ctjEImageLogo", "#ctjEImageNoLogo", url, alt);
    });

    $("#ctjEURLCommunity").on("change", function () {
      var validExt = ["jpg", "png", "gif", "jpeg", "svg"],
        selectedFile = $(this).val(),
        ext = selectedFile.split(".").pop().toLowerCase();
      if (
        (selectedFile.indexOf("resources") == 0 ||
          selectedFile.indexOf("/previews/") == 0) &&
        validExt.indexOf(ext) == -1
      ) {
        $exeDevice.showMessage(
          _("Supported formats") + ": jpg, jpeg, gif, png, svg"
        );
        return false;
      }
      var url = selectedFile,
        alt = _("Community/Company");
      $exeDevice.showImage("#ctjEImageCommunity", "#ctjEImageNoCommunity", url, alt);
    });
    $("#ctjEPlayCommunity").on("click", function (e) {
      e.preventDefault();
      var validExt = ["jpg", "png", "gif", "jpeg", "svg"],
        selectedFile = $("#ctjEURLCommunity").val(),
        ext = selectedFile.split(".").pop().toLowerCase();
      if (
        (selectedFile.indexOf("resources") == 0 ||
          selectedFile.indexOf("/previews/") == 0) &&
        validExt.indexOf(ext) == -1
      ) {
        $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
        return false;
      }
      var url = selectedFile,
        alt = _("Community/Company");
      $exeDevice.showImage("#ctjEImageCommunity", "#ctjEImageNoCommunity", url, alt);
    });

    $("#ctjEURLDecorative").on("change", function () {
      var validExt = ["jpg", "png", "gif", "jpeg", "svg"],
        selectedFile = $(this).val(),
        ext = selectedFile.split(".").pop().toLowerCase();
      if (
        (selectedFile.indexOf("resources") == 0 ||
          selectedFile.indexOf("/previews/") == 0) &&
        validExt.indexOf(ext) == -1
      ) {
        $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
        return false;
      }
      var url = selectedFile,
          alt = _("Decoration");
      $exeDevice.showImage("#ctjEImageDecorative", "#ctjEImageNoDecorative", url, alt);
    });
    $("#ctjEPlayDecorative").on("click", function (e) {
      e.preventDefault();
      var validExt = ["jpg", "png", "gif", "jpeg", "svg"],
        selectedFile = $("#ctjEURLDecorative").val(),
        ext = selectedFile.split(".").pop().toLowerCase();
      if (
        (selectedFile.indexOf("resources") == 0 ||
          selectedFile.indexOf("/previews/") == 0) &&
        validExt.indexOf(ext) == -1
      ) {
        $exeDevice.showMessage(_("Supported formats") + ": jpg, jpeg, gif, png, svg");
        return false;
      }
      var url = selectedFile,
        alt = _("Decoration");
      $exeDevice.showImage("#ctjEImageDecorative", "#ctjEImageNoDecorative",  url, alt);
    });

    $("#ctjCommunity").change(function () {
      if ($(this).is(":checked")) {
        $("#ctjcommunitylogo").show();
      } else {
        $("#ctjcommunitylogo").hide();
      }
    });
    $("#ctjLogo").change(function () {
      if ($(this).is(":checked")) {
        $("#ctjlogologo").show();
      } else {
        $("#ctjlogologo").hide();
      }
    });
    $("#ctjDecorative").change(function () {
      if ($(this).is(":checked")) {
        $("#ctjdecorativelogo").show();
      } else {
        $("#ctjdecorativelogo").hide();
      }
    });
    $("#ctjUseScore").change(function () {
      if ($(this).is(":checked")) {
        $(".CTJ-Table .CTJ-Points-column, .CTJ-Table .CTJ-Points").show();
      } else {
          $(".CTJ-Table .CTJ-Points-column, .CTJ-Table .CTJ-Points").hide();
      }
    });
    $(".CTJ-Table").on('change','select.CTJ-Select', function() {
      const selectedOptionIndex = $(this).val();
      const pointsCell = $(this).closest('tr').find('.CTJ-Points');
      if (selectedOptionIndex == '3') {  
        pointsCell.text(''); 
        pointsCell.attr('contenteditable', 'false'); 
      } else {
        pointsCell.attr('contenteditable', 'true'); 
      }
    }).trigger('change');
    $(".CTJ-Table").on('keypress','.CTJ-Points', function(event) {
      var charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    });
  },


  showImage: function (img, noimg, url, alt) {
    var $image = $(img);
    $image.hide();
    $image.attr("alt", alt);
    $(noimg).show();
    url = $exeDevice.extractURLGD(url);
    $image
      .prop("src", url)
      .on("load", function () {
        if (
          !this.complete ||
          typeof this.naturalWidth == "undefined" ||
          this.naturalWidth == 0
        ) {
          return false;
        } else {
          var mData = $exeDevice.placeImageWindows(
            this,
            this.naturalWidth,
            this.naturalHeight
          );
          $exeDevice.drawImage(this, mData);
          $image.show();
          $(noimg).hide();
          return true;
        }
      })
      .on("error", function () {
        return false;
      });
  },
  placeImageWindows: function (image, naturalWidth, naturalHeight) {
    var wDiv = $(image).parent().width() > 0 ? $(image).parent().width() : 1,
      hDiv = $(image).parent().height() > 0 ? $(image).parent().height() : 1,
      varW = naturalWidth / wDiv,
      varH = naturalHeight / hDiv,
      wImage = wDiv,
      hImage = hDiv,
      xImagen = 0,
      yImagen = 0;
    if (varW > varH) {
      wImage = parseInt(wDiv);
      hImage = parseInt(naturalHeight / varW);
      yImagen = parseInt((hDiv - hImage) / 2);
    } else {
      wImage = parseInt(naturalWidth / varH);
      hImage = parseInt(hDiv);
      xImagen = parseInt((wDiv - wImage) / 2);
    }
    return {
      w: wImage,
      h: hImage,
      x: xImagen,
      y: yImagen,
    };
  },

  Encrypt: function (str) {
    if (!str) str = "";
    str = str == "undefined" || str == "null" ? "" : str;
    try {
      var key = 146;
      var pos = 0;
      var ostr = "";
      while (pos < str.length) {
        ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
        pos += 1;
      }
      return escape(ostr);
    } catch (ex) {
      return "";
    }
  },
  Decrypt: function (str) {
    if (!str) str = "";
    str = str == "undefined" || str == "null" ? "" : str;
    str = unescape(str);
    try {
      var key = 146;
      var pos = 0;
      var ostr = "";
      while (pos < str.length) {
        ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
        pos += 1;
      }

      return ostr;
    } catch (ex) {
      return "";
    }
  },

  updateFieldGame: function (game) {
    game.userData= typeof  game.userData=="undefined"?false: game.userData;
    game.useScore= typeof  game.useScore=="undefined"?false: game.useScore;

    $("#ctjTitle").val(game.title);
    $("#ctjSubTitle").val(game.subtitle);
    $("#ctjSaveData").prop("checked", game.saveData);
    $("#ctjUserData").prop("checked", game.userData);
    $("#ctjLogo").prop("checked", game.hasLogo);
    $("#ctjCommunity").prop("checked", game.hasCommunity);
    $("#ctjDecorative").prop("checked", game.hasDecorative);
    $("#ctjEURLCommunity").val(game.urlCommunity);
    $("#ctjEURLLogo").val(game.urlLogo);
    $("#ctjEURLDecorative").val(game.urlDecorative);
    $("#ctjFooter").val(game.footer);
    $("#ctjUseScore").prop("checked", game.useScore);

    $exeDevice.id = typeof game.id != "undefined" ? game.id : false;
    if (game.hasLogo) {
      $("#ctjlogologo").show();
    }
    if (game.hasCommunity) {
      $("#ctjcommunitylogo").show();
    }
    if (game.hasDecorative) {
      $("#ctjdecorativelogo").show();
    }
    for (let i = 0, len = game.levels.length; i < len; i++) {
      game.levels[i].points = game.levels[i].points === undefined ? '' : game.levels[i].points;
    }
    $exeDevice.actualizeTable(game.levels);
    $exeDevice.showImage(
      "#ctjEImageLogo",
      "#ctjEImageNoLogo",
      game.urlLogo,
      _("Project logo")
    );
    $exeDevice.showImage(
      "#ctjEImageCommunity",
      "#ctjEImageNoCommunity",
      game.urlCommunity,
      _("Community/Company")
    );
    $exeDevice.showImage(
      "#ctjEImageDecorative",
      "#ctjEImageNoDecorative",
      game.urlDecorative,
      _("Decorative image")
    );
  },
  drawImage: function (image, mData) {
    $(image).css({
      left: mData.x + "px",
      top: mData.y + "px",
      width: mData.w + "px",
      height: mData.h + "px",
    });
  },
  extractURLGD: function (urlmedia) {
    var sUrl = urlmedia;
    if (
      typeof urlmedia != "undefined" &&
      urlmedia.length > 0 &&
      urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 &&
      urlmedia.toLowerCase().indexOf("sharing") != -1
    ) {
      sUrl = sUrl.replace(
        /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g,
        "https://docs.google.com/uc?export=open&id=$1"
      );
    } else if (
      typeof urlmedia != "undefined" &&
      urlmedia.length > 10 &&
      $exeDevice.getURLAudioMediaTeca(urlmedia)
    ) {
      sUrl = $exeDevice.getURLAudioMediaTeca(urlmedia);
    }
    return sUrl;
  },
  getURLAudioMediaTeca: function (url) {
    if (url) {
      var matc = url.indexOf("https://mediateca.educa.madrid.org/audio/") != -1;
      var matc1 =
        url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;

      if (matc) {
        var id = url
          .split("https://mediateca.educa.madrid.org/audio/")[1]
          .split("?")[0];
        id = "https://mediateca.educa.madrid.org/streaming.php?id=" + id;
        return id;
      }
      if (matc1) {
        var id = url
          .split("https://mediateca.educa.madrid.org/video/")[1]
          .split("?")[0];
        id = "https://mediateca.educa.madrid.org/streaming.php?id=" + id;
        return id;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
};
