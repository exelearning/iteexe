/**
 * Relaciona activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeRelaciona = {
  idevicePath: "",
  borderColors: {
    black: "#1c1b1b",
    blue: "#007bff",
    green: "#28a745",
    red: "#ff4d4d",
    white: "#ffffff",
    yellow: "#f3d55a",
  },
  colors: {
    black: "#1c1b1b",
    blue: "#3334a1",
    green: "#006641",
    red: "#a2241a",
    white: "#ffffff",
    yellow: "#fcf4d3",
  },
  options: [],
  hasSCORMbutton: false,
  isInExe: false,
  userName: "",
  scorm: "",
  mScorm: null,
  previousScore: "",
  initialScore: "",
  hasLATEX: false,
  init: function () {
    this.activities = $(".relaciona-IDevice");
    if (this.activities.length == 0) return;
    if (!$eXeRelaciona.supportedBrowser("rlc")) return;
    if (typeof $exeAuthoring != "undefined" && $("#exe-submitButton").length > 0) {
      this.activities.hide();
      if (typeof _ != "undefined") this.activities.before("<p>" + _("Word Guessing") + "</p>");
      return;
    }
    if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
    if (typeof $exeAuthoring != "undefined") this.isInExe = true;
    this.idevicePath = this.isInExe ? "/scripts/idevices/relaciona-activity/export/" : "";
    if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
    else this.enable();
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

  loadSCORM_API_wrapper: function () {
    if (typeof pipwerks == "undefined") $exe.loadScript("SCORM_API_wrapper.js", "$eXeRelaciona.loadSCOFunctions()");
    else this.loadSCOFunctions();
  },
  loadSCOFunctions: function () {
    if (typeof exitPageStatus == "undefined") $exe.loadScript("SCOFunctions.js", "$eXeRelaciona.enable()");
    else this.enable();
    $eXeRelaciona.mScorm = scorm;
    var callSucceeded = $eXeRelaciona.mScorm.init();
    if (callSucceeded) {
      $eXeRelaciona.userName = $eXeRelaciona.getUserName();
      $eXeRelaciona.previousScore = $eXeRelaciona.getPreviousScore();
      $eXeRelaciona.mScorm.set("cmi.core.score.max", 10);
      $eXeRelaciona.mScorm.set("cmi.core.score.min", 0);
      $eXeRelaciona.initialScore = $eXeRelaciona.previousScore;
    }
  },
  updateScorm: function (prevScore, repeatActivity, instance) {
    var mOptions = $eXeRelaciona.options[instance],
      text = "";
    $("#rlcSendScore-" + instance).hide();
    if (mOptions.isScorm === 1) {
      if (repeatActivity && prevScore !== "") {
        text = mOptions.msgs.msgSaveAuto + " " + mOptions.msgs.msgYouLastScore + ": " + prevScore;
      } else if (repeatActivity && prevScore === "") {
        text = mOptions.msgs.msgSaveAuto + " " + mOptions.msgs.msgPlaySeveralTimes;
      } else if (!repeatActivity && prevScore === "") {
        text = mOptions.msgs.msgOnlySaveAuto;
      } else if (!repeatActivity && prevScore !== "") {
        text = mOptions.msgs.msgActityComply + " " + mOptions.msgs.msgYouLastScore + ": " + prevScore;
      }
    } else if (mOptions.isScorm === 2) {
      $("#rlcSendScore-" + instance).show();
      if (repeatActivity && prevScore !== "") {
        text = mOptions.msgs.msgPlaySeveralTimes + " " + mOptions.msgs.msgYouLastScore + ": " + prevScore;
      } else if (repeatActivity && prevScore === "") {
        text = mOptions.msgs.msgPlaySeveralTimes;
      } else if (!repeatActivity && prevScore === "") {
        text = mOptions.msgs.msgOnlySaveScore;
      } else if (!repeatActivity && prevScore !== "") {
        $("#rlcSendScore-" + instance).hide();
        text = mOptions.msgs.msgActityComply + " " + mOptions.msgs.msgYouScore + ": " + prevScore;
      }
    }
    $("#rlcRepeatActivity-" + instance).text(text);
    $("#rlcRepeatActivity-" + instance).fadeIn(1000);
  },

  getUserName: function () {
    if ($eXeRelaciona.mScorm) {
      var user = $eXeRelaciona.mScorm.get("cmi.core.student_name");
      return user;
    }
    return "";
  },

  getPreviousScore: function () {
    if ($eXeRelaciona.mScorm) {
      var score = $eXeRelaciona.mScorm.get("cmi.core.score.raw");
      return score;
    }
    return "";
  },

  endScorm: function () {
    if ($eXeRelaciona.mScorm) {
      $eXeRelaciona.mScorm.quit();
    }
  },

  enable: function () {
    $eXeRelaciona.loadGame();
  },

  loadGame: function () {
    $eXeRelaciona.options = [];
    $eXeRelaciona.activities.each(function (i) {
      var dl = $(".relaciona-DataGame", this),
        mOption = $eXeRelaciona.loadDataGame(dl, this);
      $eXeRelaciona.options.push(mOption);
      var rlc = $eXeRelaciona.createInterfaceCards(i);
      dl.before(rlc).remove();
      $("#rlcGameMinimize-" + i).hide();
      $("#rlcGameContainer-" + i).hide();
      $("#rlcCubierta-" + i).hide();
      if (mOption.showMinimize) {
        $("#rlcGameMinimize-" + i)
          .css({
            cursor: "pointer",
          })
          .show();
      } else {
        $("#rlcGameContainer-" + i).show();
      }

      if (mOption.type == 2 && mOption.time > 0) {
        $("#rlcImgTime-" + i).show();
        $("#rlcPTime-" + i).show();
        $("#rlcStartGame-" + i).show();
        $("#rlcMessage-" + i).hide();
        $eXeRelaciona.updateTime(mOption.time * 60, i);
      }

      $eXeRelaciona.createCards(i);
      $eXeRelaciona.addEvents(i);
    });
    if ($eXeRelaciona.hasLATEX && typeof MathJax == "undefined") {
      $eXeRelaciona.loadMathJax();
    }
  },

  loadDataGame: function (data, sthis) {
    var json = data.text(),
      mOptions = $eXeRelaciona.isJsonString(json),
      $imagesLink = $(".relaciona-LinkImages", sthis),
      $audiosLink = $(".relaciona-LinkAudios", sthis),
      $imagesLinkBack = $(".relaciona-LinkImagesBack", sthis),
      $audiosLinkBack = $(".relaciona-LinkAudiosBack", sthis);
    mOptions.playerAudio = "";
    mOptions.gameStarted = false;
    $imagesLink.each(function () {
      var iq = parseInt($(this).text());
      if (!isNaN(iq) && iq < mOptions.cardsGame.length) {
        var flipcard = mOptions.cardsGame[iq];
        flipcard.url = $(this).attr("href");
        if (flipcard.url.length < 4) {
          flipcard.url = "";
        }
      }
    });
    $imagesLinkBack.each(function () {
      var iq = parseInt($(this).text());
      if (!isNaN(iq) && iq < mOptions.cardsGame.length) {
        var flipcard = mOptions.cardsGame[iq];
        flipcard.urlBk = $(this).attr("href");
        if (flipcard.urlBk.length < 4) {
          flipcard.urlBk = "";
        }
      }
    });
    $audiosLink.each(function () {
      var iqa = parseInt($(this).text());
      if (!isNaN(iqa) && iqa < mOptions.cardsGame.length) {
        var flipcard = mOptions.cardsGame[iqa];
        flipcard.audio = $(this).attr("href");
        if (flipcard.audio.length < 4) {
          flipcard.audio = "";
        }
      }
    });
    $audiosLinkBack.each(function () {
      var iqa = parseInt($(this).text());
      if (!isNaN(iqa) && iqa < mOptions.cardsGame.length) {
        var flipcard = mOptions.cardsGame[iqa];
        flipcard.audioBk = $(this).attr("href");
        if (flipcard.audioBk.length < 4) {
          flipcard.audioBk = "";
        }
      }
    });
    mOptions.time = typeof mOptions.time == "undefined" ? 0 : mOptions.time;
    mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
    mOptions.evaluationID = typeof mOptions.evaluationID == "undefined" ? "" : mOptions.evaluationID;
    mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;
    mOptions.hits = 0;
    mOptions.errors = 0;
    mOptions.score = 0;
    mOptions.active = 0;
    mOptions.obtainedClue = false;
    mOptions.currentWordDiv = null;
    mOptions.linesMap = new Map();
    mOptions.lines = [];
    mOptions.permitirErrores = mOptions.type > 0;
    mOptions.cardsGame = $eXeRelaciona.getCards(mOptions.cardsGame, mOptions.percentajeCards);
    for (var i = 0; i < mOptions.cardsGame.length; i++) {
      mOptions.cardsGame[i].id = i;
      mOptions.cardsGame[i].eText = $eXeRelaciona.decodeURIComponentSafe(mOptions.cardsGame[i].eText);
      mOptions.cardsGame[i].eTextBk = $eXeRelaciona.decodeURIComponentSafe(mOptions.cardsGame[i].eTextBk);
      var id = $eXeRelaciona.getID();
      mOptions.cardsGame[i].lineindex = id;
    }
    mOptions.numberCards = mOptions.cardsGame.length;
    mOptions.realNumberCards = mOptions.numberCards;
    mOptions.fullscreen = false;

    return mOptions;
  },
  getCards: function (cards, percentaje) {
    var mCards = cards;
    if (percentaje < 100) {
      var num = Math.round((percentaje * cards.length) / 100);
      num = num < 1 ? 1 : num;
      if (num < cards.length) {
        var array = [];
        for (var i = 0; i < cards.length; i++) {
          array.push(i);
        }
        array = $eXeRelaciona
          .shuffleAds(array)
          .slice(0, num)
          .sort(function (a, b) {
            return a - b;
          });
        mCards = [];
        for (var i = 0; i < array.length; i++) {
          mCards.push(cards[array[i]]);
        }
      }
    }
    return mCards;
  },
  decodeURIComponentSafe: function (s) {
    if (!s) {
      return s;
    }
    return decodeURIComponent(s).replace("&percnt;", "%");
  },

  updateTime: function (tiempo, instance) {
    var mOptions = $eXeRelaciona.options[instance];
    if (mOptions.time < 0) return;
    var mTime = $eXeRelaciona.getTimeToStringMemory(tiempo);
    $("#rlcPTime-" + instance).text(mTime);
  },
  getTimeToStringMemory: function (iTime) {
    var mMinutes = parseInt(iTime / 60) % 60;
    var mSeconds = iTime % 60;
    return (mMinutes < 10 ? "0" + mMinutes : mMinutes) + ":" + (mSeconds < 10 ? "0" + mSeconds : mSeconds);
  },

  shuffle: function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  clearHtml:function(htmlString){
    var tempDiv = $("<div>").html(htmlString);
    return tempDiv.text();
  },
  createCards: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    const shuffledWords = $eXeRelaciona.shuffle([...mOptions.cardsGame]);
    const shuffledDefinitions = $eXeRelaciona.shuffle([...mOptions.cardsGame]);
    shuffledWords.forEach((card, index) => {
      let imgV = card.url.length > 3 ? "block" : "none";
      let txtV = card.eText.length > 0 ? "flex" : "none";
      let imgW = card.eText.length == 0 ? "100%" : "30%";
      imgW = card.url.length < 3 ? "0%" : imgW;
      let txtW = card.url.length < 3 ? "100%" : "70%";
      txtW = card.eText.length == 0 ? "0%" : txtW;
      let color = card.color.length > 2 ? card.color : "inherit";
      let bkcolor = card.backcolor.length > 2 ? card.backcolor : "trasparent";
      let audio = card.audio.length > 3 ? "block" : "none";
      let author = card.author.length > 3 ? "block" : "none";
      let audioCls = card.url.length < 3 && card.eText.length == 0 ? "RLCP-LinkAudioBig" : "RLCP-LinkAudio";
      const wordDiv = $(`<div class="RLCP-Word" data-id="${card.id}" data-lineindex="${card.lineindex}">
                            <div class="RLCP-ContainerData">
                              <div class="RLCP-EText" style="display:${txtV}; width:${txtW}; color:${color}; background-color:${bkcolor};">${card.eText}</div>    
                              <div class="RLCP-ImageContain" style="display:${imgV}; width:${imgW};">
                                  <img src="${card.url}" class="RLCP-Image" data-url="${card.url}" data-x="${card.x}" data-y="${card.y}" alt="${card.alt}" />
                                  <div class="RLCP-Author RLCP-AuthorWord" data-author="${card.author}"  style="display: ${author};" alt="${card.author}" title="${mOptions.msgs.msgAuthor + ": " + $eXeRelaciona.clearHtml(card.author)}"><img src="${$eXeRelaciona.idevicePath}exequextcopyright.png"  /></div>
                              </div>
                            </div>
                            <div style="display:${audio}" data-audio="${card.audio}" class="RLCP-TAudio ${audioCls}"  title="Audio"><img src="${$eXeRelaciona.idevicePath}exequextplayaudio.svg" class="RLCP-Audio"  alt="Audio"></div>
                        </div>`);
      $("#rlcContainerWords-" + instance).append(wordDiv);
    });
    shuffledDefinitions.forEach((card, index) => {
      let imgV = card.urlBk.length > 3 ? "block" : "none";
      let txtV = card.eTextBk.length > 0 ? "flex" : "none";
      let imgW = card.eTextBk.length == 0 ? "100%" : "30%";
      imgW = card.urlBk.length < 3 ? "0%" : imgW;
      let txtW = card.urlBk.length < 3 ? "100%" : "70%";
      txtW = card.eTextBk.length == 0 ? "0%" : txtW;
      let color = card.colorBk.length > 2 ? card.colorBk : "inherit";
      let bkcolor = card.backcolorBk.length > 2 ? card.backcolorBk : "trasparent";
      let audio = card.audioBk.length > 3 ? "block" : "none";
      let author = card.authorBk.length > 0 ? "block" : "none";
      let audioCls = card.urlBk.length < 3 && card.eTextBk.length == 0 ? "RLCP-LinkAudioBig" : "RLCP-LinkAudio";
      const definitionDiv = $(`<div class="RLCP-Definition" data-id="${card.id}"  data-lineindex="0" >
                                <div class="RLCP-ContainerData">
                                  <div class="RLCP-ImageContain" style="display:${imgV}; width:${imgW};">
                                    <img src="${card.urlBk}" class="RLCP-Image" data-url="${card.urlBk}" data-x="${card.x}" data-y="${card.y}" alt="${card.altBk}" />
                                    <div class="RLCP-Author RLCP-AuthorDef" style="display: ${author};" data-author="${card.authorBk}" alt="${card.authorBk}" title="${mOptions.msgs.msgAuthor + ": " + $eXeRelaciona.clearHtml(card.authorBk)}"><img src="${$eXeRelaciona.idevicePath}exequextcopyright.png"  /></div>
                                  </div>
                                  <div class="RLCP-EText" style="display:${txtV}; width:${txtW}; color:${color}; background-color:${bkcolor};">${card.eTextBk}</div>
                                </div>
                              <div data-audio="${card.audioBk}" style="display:${audio}" class="RLCP-TAudio ${audioCls}"  title="Audio"><img src="${$eXeRelaciona.idevicePath}exequextplayaudio.svg" class="FLCDSP-RLCP"  alt="Audio"></div>
                            </div>`);
      $("#rlcContainerDefinitions-" + instance).append(definitionDiv);
    });
  },

  getID: function () {
    const numeroAleatorio = Math.floor(Math.random() * 8999) + 1000;
    const numeroAleatorio2 = Math.floor(Math.random() * 8999) + 1000;
    const timestamp = Date.now();
    return `${numeroAleatorio}${timestamp}${numeroAleatorio2}`;
  },

  startGame: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    if (mOptions.gameStarted) {
      return;
    }
    mOptions.gameStarted = true;
    mOptions.solveds = [];
    mOptions.selecteds = [];
    mOptions.hits = 0;
    mOptions.errors = 0;
    mOptions.score = 0;
    mOptions.counter = mOptions.time * 60;
    mOptions.gameOver = false;
    mOptions.gameStarted = false;
    mOptions.obtainedClue = false;
    $("#rlcPShowClue-" + instance).text("");
    $("#rlcShowClue-" + instance).hide();
    $("#rlcPHits-" + instance).text(mOptions.hits);
    $("#rlcPErrors-" + instance).text(mOptions.errors);
    $("#rlcCubierta-" + instance).hide();
    $("#rlcStartGame-" + instance).hide();
    if (mOptions.time > 0) {
      $("#rlcPTime-" + instance).show();
      $("#rlcImgTime-" + instance).show();
    }
    $("#rlcMessage-" + instance).show();
    if (mOptions.type == 2 && mOptions.time > 0) {
      mOptions.counterClock = setInterval(function () {
        if (mOptions.gameStarted) {
          mOptions.counter--;
          $eXeRelaciona.updateTime(mOptions.counter, instance);
          if (mOptions.counter <= 0) {
            $eXeRelaciona.gameOver(instance);
            return;
          }
        }
      }, 1000);
      $eXeRelaciona.updateTime(mOptions.time * 60, instance);
    }
    mOptions.gameStarted = true;
  },

  playSound: function (selectedFile, instance) {
    $eXeRelaciona.stopSound(instance);
    var mOptions = $eXeRelaciona.options[instance];
    $eXeRelaciona.stopSound(instance);
    selectedFile = $eXeRelaciona.extractURLGD(selectedFile);
    mOptions.playerAudio = new Audio(selectedFile);
    mOptions.playerAudio.play().catch((error) => console.error("Error playing audio:", error));
  },
  stopSound: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    if (mOptions.playerAudio && typeof mOptions.playerAudio.pause == "function") {
      mOptions.playerAudio.pause();
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
  createInterfaceCards: function (instance) {
    var html = "",
      path = $eXeRelaciona.idevicePath,
      msgs = $eXeRelaciona.options[instance].msgs,
      html = "";
    html +=
      '<div class="RLCP-MainContainer"  id="rlcMainContainer-' +
      instance +
      '">\
        <div class="RLCP-GameMinimize" id="rlcGameMinimize-' +
      instance +
      '">\
            <a href="#" class="RLCP-LinkMaximize" id="rlcLinkMaximize-' +
      instance +
      '" title="' +
      msgs.msgMaximize +
      '"><img src="' +
      path +
      'relacionaIcon.png"  class="RLCP-IconMinimize RLCP-Activo"  alt="">\
            <div class="RLCP-MessageMaximize" id="rlcMessageMaximize-' +
      instance +
      '">' +
      msgs.msgPlayStart +
      '</div>\
            </a>\
        </div>\
        <div class="RLCP-GameContainer" id="rlcGameContainer-' +
      instance +
      '">\
            <div class="RLCP-GameScoreBoard" id="rlcGameScoreBoard-' +
      instance +
      '">\
                <div class="RLCP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number"  id="rlcPNumberIcon-' +
      instance +
      '" title="' +
      msgs.msgNumQuestions +
      '"></div>\
                    <p><span class="sr-av">' +
      msgs.msgNumQuestions +
      ': </span><span id="rlcPNumber-' +
      instance +
      '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' +
      msgs.msgHits +
      '"></div>\
                    <p><span class="sr-av">' +
      msgs.msgHits +
      ': </span><span id="rlcPHits-' +
      instance +
      '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' +
      msgs.msgErrors +
      '"></div>\
                    <p><span class="sr-av">' +
      msgs.msgErrors +
      ': </span><span id="rlcPErrors-' +
      instance +
      '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" title="' +
      msgs.msgScore +
      '"></div>\
                    <p><span class="sr-av">' +
      msgs.msgScore +
      ': </span><span id="rlcPScore-' +
      instance +
      '">0</span></p>\
                 </div>\
                <div class="RLCP-Info" id="rlcInfo-' +
      instance +
      '"></div>\
                <div class="RLCP-TimeNumber">\
                    <strong><span class="sr-av">' +
      msgs.msgTime +
      ':</span></strong>\
					          <div class="exeQuextIcons  exeQuextIcons-Time" style="display:none" id="rlcImgTime-' +
      instance +
      '" title="' +
      msgs.msgTime +
      '"></div>\
                    <p id="rlcPTime-' +
      instance +
      '" style="display:none" class="RLCP-PTime">00:00</p>\
                    <a href="#" class="RLCP-LinkMinimize" id="rlcLinkMinimize-' +
      instance +
      '" title="' +
      msgs.msgMinimize +
      '">\
                        <strong><span class="sr-av">' +
      msgs.msgMinimize +
      ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  RLCP-Activo"></div>\
                    </a>\
                    <a href="#" class="RLCP-LinkFullScreen" id="rlcLinkFullScreen-' +
      instance +
      '" title="' +
      msgs.msgFullScreen +
      '">\
                        <strong><span class="sr-av">' +
      msgs.msgFullScreen +
      ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-FullScreen  RLCP-Activo" id="rlcFullScreen-' +
      instance +
      '"></div>\
                    </a>\
                  </div>\
                    </div>\
                    <div class="RLCP-Information">\
                      <a href="#" style="display:none" id="rlcStartGame-' +
      instance +
      '">' +
      msgs.msgPlayStart +
      '</a>\
                      <p class="RLCP-Message" id="rlcMessage-' +
      instance +
      '"></p>\
                    </div>\
                    <div id="rlcButtons-' +
      instance +
      '" class="RLCP-Buttons">\
                        <a href="#" class="RLCP-ResetButton" id="rlcResetButton-' +
      instance +
      '">' +
      msgs.msgRestart +
      '</a>\
                        <a href="#" class="RLCP-CheckButton" id="rlcCheckButton-' +
      instance +
      '">' +
      msgs.msgCheck +
      '</a>\
                    </div>\
                    <div class="RLCP-Multimedia" id="rlcMultimedia' +
      instance +
      '">\
                      <div class="RLCP-Main">\
                        <div id="rlcContainerGame-' +
      instance +
      '" class="RLCP-ContainerGame">\
                          <div id="rlcContainerWords-' +
      instance +
      '" class="RLCP-ContainerWords"></div>\
                          <div id="rlcContainerDefinitions-' +
      instance +
      '" class="RLCP-ContainerDefinitions"></div>\
                        </div>\
                        <canvas id="rlcCanvas-' +
      instance +
      '"  width="800" height="600" class="RLCP-Canvas"></canvas>\
                      </div>\
                    </div>\
                <div class="RLCP-AuthorGame" id="rlcAuthorGame-' +
      instance +
      '"></div>\
            </div>\
            <div class="RLCP-Cover" id="rlcCubierta-' +
      instance +
      '">\
                    <div class="RLCP-CodeAccessDiv" id="rlcCodeAccessDiv-' +
      instance +
      '">\
                        <div class="RLCP-MessageCodeAccessE" id="rlcMesajeAccesCodeE-' +
      instance +
      '"></div>\
                        <div class="RLCP-DataCodeAccessE">\
                        <label class="sr-av">' +
      msgs.msgCodeAccess +
      ':</label><input type="text" class="RLCP-CodeAccessE" id="rlcCodeAccessE-' +
      instance +
      '" placeholder="' +
      msgs.msgCodeAccess +
      '">\
                        <a href="#" id="rlcCodeAccessButton-' +
      instance +
      '" title="' +
      msgs.msgSubmit +
      '">\
                          <strong><span class="sr-av">' +
      msgs.msgSubmit +
      '</span></strong>\
                          <div class="exeQuextIcons-Submit RLCP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="RLCP-ShowClue" id="rlcShowClue-' +
      instance +
      '">\
                    <p class="sr-av">' +
      msgs.msgClue +
      '</p>\
                    <p class="RLCP-PShowClue" id="rlcPShowClue-' +
      instance +
      '"></p>\
                    <a href="#" class="RLCP-ClueBotton" id="rlcClueButton-' +
      instance +
      '" title="' +
      msgs.msgClose +
      '">' +
      msgs.msgClose +
      " </a>\
                </div>\
            </div>\
    </div>\
    " +
      this.addButtonScore(instance);
    return html;
  },
  hexToRgba: function (hex, opacity) {
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (opacity < 0) {
      opacity = 0;
    } else if (opacity > 1) {
      opacity = 1;
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
  shuffleElements: function (parentElement) {
    var children = parentElement.children();
    while (children.length) {
      parentElement.append(children.splice(Math.floor(Math.random() * children.length), 1)[0]);
    }
  },
  addButtonScore: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    var butonScore = "";
    var fB = '<div class="RLCP-BottonContainer">';
    if (mOptions.isScorm == 2) {
      var buttonText = mOptions.textButtonScorm;
      if (buttonText != "") {
        if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
          this.hasSCORMbutton = true;
          fB += '<div class="RLCP-GetScore">';
          if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
          fB += '<p><input type="button" id="rlcSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="RLCP-RepeatActivity" id="rlcRepeatActivity-' + instance + '"></span></p>';
          if (!this.isInExe) fB += "</form>";
          fB += "</div>";
          butonScore = fB;
        }
      }
    } else if (mOptions.isScorm == 1) {
      if (this.hasSCORMbutton == false && ($("body").hasClass("exe-authoring-page") || $("body").hasClass("exe-scorm"))) {
        this.hasSCORMbutton = true;
        fB += '<div class="RLCP-GetScore">';
        fB += '<p><span class="RLCP-RepeatActivity" id="rlcRepeatActivity-' + instance + '"></span></p>';
        fB += "</div>";
        butonScore = fB;
      }
    }
    fB = +"</div>";
    return butonScore;
  },
  gameOver: function (instance) {
    $eXeRelaciona.checkState(instance);
  },
  showScoreFooter: function (instance) {
    var mOptions = $eXeRelaciona.options[instance],
      score = mOptions.type > 1 ? (mOptions.hits * 10) / mOptions.realNumberCards : $eXeRelaciona.getScoreVisited(instance);
    score = score.toFixed(2);
    $("#rlcRepeatActivity-" + instance).text(mOptions.msgs.msgYouScore + ": " + score);
    return score;
  },
  showScoreGame: function (instance) {
    var mOptions = $eXeRelaciona.options[instance],
      msgs = mOptions.msgs,
      message = "",
      messageColor = 0,
      mclue = "",
      score = ((mOptions.hits * 10) / mOptions.numberCards).toFixed(2);
    message = msgs.msgEndGameM.replace("%s", score);
    $eXeRelaciona.showMessage(messageColor, message, instance, true);
    if (mOptions.itinerary.showClue) {
      if (score * 100 > mOptions.itinerary.percentageClue) {
        mclue = mOptions.itinerary.clueGame;
      } else {
        mclue = msgs.msgTryAgain.replace("%s", mOptions.itinerary.percentageClue);
      }
    }
    if (mOptions.itinerary.showClue) {
      $eXeRelaciona.showMessage(3, mclue, instance, true);
    }
    let sscore = ((mOptions.hits * 10) / mOptions.cardsGame.length).toFixed(2);
    $("#rlcPScore-" + instance).text(sscore);
    $("#rlcPHits-" + instance).text(mOptions.hits);
    $("#rlcPErrors-" + instance).text(mOptions.errors);
    $("#rlcPNumber-" + instance).text(mOptions.realNumberCards - mOptions.hits - mOptions.errors);
  },
  updateEvaluationIcon: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
      var node = $("#nodeTitle").text(),
        data = $eXeRelaciona.getDataStorage(mOptions.evaluationID);
      var score = "",
        state = 0;
      if (!data) {
        $eXeRelaciona.showEvaluationIcon(instance, state, score);
        return;
      }
      const findObject = data.activities.find((obj) => obj.id == mOptions.id && obj.node === node);
      if (findObject) {
        state = findObject.state;
        score = findObject.score;
      }
      $eXeRelaciona.showEvaluationIcon(instance, state, score);
      var ancla = "ac-" + mOptions.id;
      $("#" + ancla).remove();
      $("#rlcMainContainer-" + instance)
        .parents("article")
        .prepend('<div id="' + ancla + '"></div>');
    }
  },
  showEvaluationIcon: function (instance, state, score) {
    var mOptions = $eXeRelaciona.options[instance];
    var $header = $("#rlcGameContainer-" + instance)
      .parents("article")
      .find("header.iDevice_header");
    var icon = "exequextsq.png",
      alt = mOptions.msgs.msgUncompletedActivity;
    if (state == 1) {
      icon = "exequextrerrors.png";
      alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s',score);
    } else if (state == 2) {
      icon = "exequexthits.png";
      alt = mOptions.msgs.msgSuccessfulActivity.replace('%s',score);
    }
    $("#rlcEvaluationIcon-" + instance).remove();
    var sicon = '<div id="rlcEvaluationIcon-' + instance + '" class="RLCP-EvaluationDivIcon"><img  src="' + $eXeRelaciona.idevicePath + icon + '"><span>' + mOptions.msgs.msgUncompletedActivity + "</span></div>";
    $header.eq(0).append(sicon);
    $("#rlcEvaluationIcon-" + instance)
      .find("span")
      .eq(0)
      .text(alt);
  },
  updateEvaluation: function (obj1, obj2, id1) {
    if (!obj1) {
      obj1 = {
        id: id1,
        activities: [],
      };
    }
    const findObject = obj1.activities.find((obj) => obj.id === obj2.id && obj.node === obj2.node);

    if (findObject) {
      findObject.state = obj2.state;
      findObject.score = obj2.score;
      findObject.name = obj2.name;
      findObject.date = obj2.date;
    } else {
      obj1.activities.push({
        id: obj2.id,
        type: obj2.type,
        node: obj2.node,
        name: obj2.name,
        score: obj2.score,
        date: obj2.date,
        state: obj2.state,
      });
    }
    return obj1;
  },
getDateString: function () {
    var currentDate = new Date();
    var formattedDate = currentDate.getDate().toString().padStart(2, "0") + "/" + (currentDate.getMonth() + 1).toString().padStart(2, "0") + "/" + currentDate.getFullYear().toString().padStart(4, "0") + " " + currentDate.getHours().toString().padStart(2, "0") + ":" + currentDate.getMinutes().toString().padStart(2, "0") + ":" + currentDate.getSeconds().toString().padStart(2, "0");
    return formattedDate;
},
getDirectoryURL:function() {
    var fullURL = window.location.href;
    var lastIndex = fullURL.lastIndexOf("/");
    return fullURL.substring(0, lastIndex + 1);
},
getDataAccess: function (id) {
    var id = 'dataAccess-' + id,
        data = $eXeRelaciona.isJsonString(localStorage.getItem(id));
    return data;
},
sendData: function(user, passwd, node, activity, score, date, type, id) {
    if(this.isInExe){
        console.log("Esta opción sólo funcionará cuando exportes el recurso con web y la subas a un servidor que tenga PHP");
        return;
      }
    if( user === "" ||  passwd === ""  || node === "" || activity === "" || score === "") {
        console.log("Usuario y contraseña son campos obligatorios");
        return;
    }
    var data = {
        usuario: user,
        contrasena: passwd,
        nodo:node,
        actividad:activity,
        calificacion:score,
        fecha: date,
        tipo:type,
        id:id
    };
    var url = $eXeRelaciona.getDirectoryURL() + 'informe.php';
        //url = "http://localhost/notas/informe.php";
    $.ajax({
        type: "POST",
        url: url, 
        data: data,
        crossDomain: true,
        success: function (response) {
            if (response.error) {
                console.log("Error: " + response.error);
            } else if (response.almacenada) {
                console.log("Estos son los datos almacenados. Selecciona un grupo");
            }            },
        error: function () {
            console.log("Error al conectar con el servidor");
        }
    });
  },
  saveEvaluation: function (instance, type) {
    var mOptions = $eXeRelaciona.options[instance],
      score = ((mOptions.hits * 10) / mOptions.realNumberCards).toFixed(2);
    	var dataAccess=$eXeRelaciona.getDataAccess(mOptions.evaluationID);
      if ((mOptions.evaluationID && dataAccess) || (mOptions.evaluation && mOptions.evaluationID.length > 0)) {
          var name = $("#rlcGameContainer-" + instance)
          .parents("article")
          .find(".iDeviceTitle")
          .eq(0)
          .text(),
        node = $("#nodeTitle").text();
      var formattedDate = $eXeRelaciona.getDateString();
      var scorm = {
        id: mOptions.id,
        type: mOptions.msgs.msgTypeGame,
        node: node,
        name: name,
        score: score,
        date: formattedDate,
        state: parseFloat(score) >= 5 ? 2 : 1,
      };
      if(type && dataAccess){
        $eXeRelaciona.sendData(dataAccess.user, dataAccess.password, node, name, score, formattedDate, mOptions.msgs.msgTypeGame, mOptions.id)
      }
      var data = $eXeRelaciona.getDataStorage(mOptions.evaluationID);
      data = $eXeRelaciona.updateEvaluation(data, scorm);
      data = JSON.stringify(data, mOptions.evaluationID);
      localStorage.setItem("dataEvaluation-" + mOptions.evaluationID, data);
      $eXeRelaciona.showEvaluationIcon(instance, scorm.state, scorm.score);
    }
  },
  getDataStorage: function (id) {
    var id = "dataEvaluation-" + id,
      data = $eXeRelaciona.isJsonString(localStorage.getItem(id));
    return data;
  },

  sendScore: function (instance, auto) {
    var mOptions = $eXeRelaciona.options[instance],
      score = (mOptions.hits * 10) / mOptions.realNumberCards;
    if (typeof $eXeRelaciona.mScorm != "undefined") {
      if (!auto) {
        if (!mOptions.repeatActivity && $eXeRelaciona.previousScore !== "") {
          message = $eXeRelaciona.userName !== "" ? $eXeRelaciona.userName + " " + mOptions.msgs.msgOnlySaveScore : mOptions.msgs.msgOnlySaveScore;
        } else {
          $eXeRelaciona.previousScore = score;
          $eXeRelaciona.mScorm.set("cmi.core.score.raw", score);
          message = $eXeRelaciona.userName !== "" ? $eXeRelaciona.userName + ", " + $exe_i18n.yourScoreIs + " " + score : $exe_i18n.yourScoreIs + " " + score;
          if (!mOptions.repeatActivity) {
            $("#rlcSendScore-" + instance).hide();
          }
          $("#rlcRepeatActivity-" + instance).text($exe_i18n.yourScoreIs + " " + score);
          $("#rlcRepeatActivity-" + instance).show();
        }
      } else {
        $eXeRelaciona.previousScore = score;
        score = score === "" ? 0 : score;
        $eXeRelaciona.mScorm.set("cmi.core.score.raw", score);
        $("#rlcRepeatActivity-" + instance).text($exe_i18n.yourScoreIs + " " + score);
        $("#rlcRepeatActivity-" + instance).show();
        message = "";
      }
    } else {
      message = mOptions.msgs.msgScoreScorm;
    }
    if (!auto) alert(message);
  },

  showClue: function (instance) {
    var mOptions = $eXeRelaciona.options[instance],
      percentageHits = (mOptions.type == 2 ? (mOptions.hits * 10) / mOptions.cardsGame.length : $eXeRelaciona.getScoreVisited(instance)) * 10;
    if (mOptions.itinerary.showClue) {
      if (percentageHits >= mOptions.itinerary.percentageClue) {
        if (!mOptions.obtainedClue) {
          mOptions.obtainedClue = true;
          var msg = mOptions.msgs.msgInformation + ": " + mOptions.itinerary.clueGame;
          $("#rlcPShowClue-" + instance).text(msg);
          $("#rlcShowClue-" + instance).show();
          $("#rlcCubierta-" + instance).show();
        }
      }
    }
  },

  getFullscreen: function (element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  },
  toggleFullscreen: function (element, instance) {
    var mOptions = $eXeRelaciona.options[instance],
      element = element || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      mOptions.fullscreen = true;
      $eXeRelaciona.getFullscreen(element);
    } else {
      mOptions.fullscreen = false;
      $eXeRelaciona.exitFullscreen(element);
    }
  },
  exitFullscreen: function () {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },
  reboot: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    mOptions.hits = 0;
    mOptions.errors = 0;
    mOptions.score = 0;
    mOptions.active = 0;

    mOptions.obtainedClue = false;
    var keis = [];
    mOptions.linesMap.forEach((value, key) => {
      keis.push(key);
    });
    for (var i = 0; i < keis.length; i++) {
      $eXeRelaciona.removeLine(keis[i], instance);
    }
    mOptions.linesMap.clear();
    $("#rlcButtons-" + instance).hide();
    $("#rlcContainerWords-" + instance).empty();
    $("#rlcContainerDefinitions-" + instance).empty();
    $eXeRelaciona.createCards(instance);
    $eXeRelaciona.showScoreGame(instance);
    $eXeRelaciona.showMessage(0, "", instance);
    if (mOptions.type == 2) {
      mOptions.counter = mOptions.time * 60;
      $eXeRelaciona.startGame(instance);
    }
    $eXeRelaciona.ajustarCanvas(instance);
    mOptions.gameStarted = true;
    mOptions.gameOver = false;
  },

  adjustContainerHeight: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    var maxHeight = 100 * mOptions.cardsGame.length + 50;
    //$("#rlcContainerGame-" + instance).css("height",  maxHeight + "px");
  },
  checkState: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    clearInterval(mOptions.counterClock);
    mOptions.gameOver = true;
    mOptions.gameStarted = false;
    mOptions.hits = 0;
    mOptions.errors = 0;
    mOptions.linesMap.forEach((value, key) => {
      if (value.correct) {
        mOptions.hits++;
        value.color = $eXeRelaciona.borderColors.green;
      } else {
        value.color = $eXeRelaciona.borderColors.red;
        mOptions.errors++;
      }
    });
    $("#rlcCheckButton-" + instance).hide();
    $("#rlcButtons-" + instance).css("display", "flex");
    $("#rlcResetButton-" + instance).show();
    $eXeRelaciona.stopSound(instance);
    $eXeRelaciona.redibujarLineas(instance, false);
    $eXeRelaciona.showScoreGame(instance);
    $eXeRelaciona.saveEvaluation(instance, true);
    if (mOptions.isScorm == 1) {
      if (mOptions.repeatActivity || $eXeRelaciona.initialScore === "") {
        $eXeRelaciona.sendScore(instance, true);
        $eXeRelaciona.initialScore = $eXeRelaciona.showScoreFooter(instance);
      }
    }
  },
  addEvents: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    $("#rlcLinkMaximize-" + instance).on("click touchstart", function (e) {
      e.preventDefault();
      $("#rlcGameContainer-" + instance).show();
      $("#rlcGameMinimize-" + instance).hide();
    });
    $("#rlcLinkMinimize-" + instance).on("click touchstart", function (e) {
      e.preventDefault();
      $("#rlcGameContainer-" + instance).hide();
      $("#rlcGameMinimize-" + instance)
        .css("visibility", "visible")
        .show();
    });
    $("#rlcCubierta-" + instance).hide();
    $("#rlcCodeAccessDiv-" + instance).hide();
    if (mOptions.itinerary.showCodeAccess) {
      $("#rlcMesajeAccesCodeE-" + instance).text(mOptions.itinerary.messageCodeAccess);
      $("#rlcCodeAccessDiv-" + instance).show();
      $("#rlcShowClue-" + instance).hide();
      $("#rlcCubierta-" + instance).show();
    }
    $("#rlcCodeAccessButton-" + instance).on("click touchstart", function (e) {
      e.preventDefault();
      $eXeRelaciona.enterCodeAccess(instance);
    });

    $("#rlcCodeAccessE-" + instance).on("keydown", function (event) {
      if (event.which == 13 || event.keyCode == 13) {
        $eXeRelaciona.enterCodeAccess(instance);
        return false;
      }
      return true;
    });
    $("#rlcPNumber-" + instance).text(mOptions.realNumberCards);
    $(window).on("unload", function () {
      if (typeof $eXeRelaciona.mScorm != "undefined") {
        $eXeRelaciona.endScorm();
      }
    });
    if (mOptions.isScorm > 0) {
      $eXeRelaciona.updateScorm($eXeRelaciona.previousScore, mOptions.repeatActivity, instance);
    }
    $("#rlcSendScore-" + instance).click(function (e) {
      e.preventDefault();
      $eXeRelaciona.sendScore(instance, false);
      $eXeRelaciona.saveEvaluation(instance, true);
    });
    window.addEventListener("resize", function () {
      var element = document.getElementById("rlcGameContainer-" + instance);
      element = element || document.documentElement;
      mOptions.fullscreen = !(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement);
      $eXeRelaciona.ajustarCanvas(instance);
    });

    $("#rlcClueButton-" + instance).on("click", function (e) {
      e.preventDefault();
      $("#rlcShowClue-" + instance).hide();
      $("#rlcCubierta-" + instance).fadeOut();
    });

    $("#rlcPErrors-" + instance).text(mOptions.errors);
    if (mOptions.author.trim().length > 0 && !mOptions.fullscreen) {
      $("#rlcAuthorGame-" + instance).html(mOptions.msgs.msgAuthor + ": " + mOptions.author);
      $("#rlcAuthorGame-" + instance).show();
    }

    if (mOptions.isScorm > 0) {
      $eXeRelaciona.updateScorm($eXeRelaciona.previousScore, mOptions.repeatActivity, instance);
    }

    $("#rlcStartGame-" + instance).on("click", function (e) {
      e.preventDefault();
      $eXeRelaciona.startGame(instance);
    });

    $("#rlcLinkFullScreen-" + instance).on("click touchstart", function (e) {
      e.preventDefault();
      var element = document.getElementById("rlcGameContainer-" + instance);
      $eXeRelaciona.toggleFullscreen(element, instance);
    });
    $eXeRelaciona.updateEvaluationIcon(instance);
    $("#rlcResetButton-" + instance).on("click", function (e) {
      e.preventDefault();
      $eXeRelaciona.reboot(instance);
    });
    $("#rlcCheckButton-" + instance).on("click", function (e) {
      e.preventDefault();
      $eXeRelaciona.checkState(instance);
    });
    $eXeRelaciona.ajustarCanvas(instance);
    $("#rlcGameContainer-" + instance).on("mouseenter touchstart", ".RLCP-Author", function () {
      $eXeRelaciona.showAutorImage($(this), instance);
    });
    $("#rlcGameContainer-" + instance).on("mouseleave touchend touchcancel", ".RLCP-Author", function () {
      $eXeRelaciona.hideAutorImage($(this), instance);
    });

    $("#rlcGameContainer-" + instance).on("click touchstart", ".RLCP-TAudio", function () {
      if (!mOptions.gameStarted || mOptions.gameOver) return;
      var audio = $(this).data("audio");
      if (audio && audio.length > 3) $eXeRelaciona.playSound(audio, instance);
    });

    $eXeRelaciona.setupEventHandlers(instance);
    $eXeRelaciona.setupEventHandlersMovil(instance);
    mOptions.gameOver = false;
    if (mOptions.type < 2) {
      mOptions.gameStarted = true;
    }
  },
  setupEventHandlers: function (instance) {
    var mOptions = $eXeRelaciona.options[instance],
      isDragging = false,
      dragThreshold = 5,
      $gameContainer = $("#rlcGameContainer-" + instance);
    $gameContainer.on("mousedown", ".RLCP-Word", function (e) {
      e.preventDefault();
      if (!mOptions.gameStarted || mOptions.gameOver) return;
      var targetWord = $(e.target).closest(".RLCP-Word");
      if (targetWord.hasClass("RLCP-Connected")) {
        $eXeRelaciona.removeConnection(targetWord, instance);
      }
      $gameContainer.find(".RLCP-Word").removeClass("RLCP-Selected");
      targetWord.addClass("RLCP-Selected");
      mOptions.currentWordDiv = targetWord;
      mOptions.canvas = mOptions.canvas = $("#rlcCanvas-" + instance)[0];
      mOptions.contexto = mOptions.canvas.getContext("2d");
      mOptions.canvasRect = mOptions.canvas.getBoundingClientRect();
      mOptions.tempEnd = $("<div>")
        .css({
          position: "absolute",
          top: e.clientY - mOptions.canvasRect.top,
          left: e.clientX - mOptions.canvasRect.left,
          width: 0,
          height: 0,
          padding: 0,
          margin: 0,
          "border-radius": "50%",
          "background-color": "red",
          "z-index": 9,
        })
        .appendTo("#rlcContainerGame-" + instance);
      mOptions.lineindex = mOptions.currentWordDiv.data("lineindex");
      mOptions.startX = e.clientX - mOptions.canvasRect.left;
      mOptions.startY = e.clientY - mOptions.canvasRect.top;
      isDragging = false;
    });

    $(document).on("mousemove", function (e) {
      if (!mOptions.gameStarted || mOptions.gameOver) return;
      if (!mOptions.currentWordDiv) return;
      if (!mOptions.tempEnd) return;

      var dx = Math.abs(e.clientX - mOptions.startX);
      var dy = Math.abs(e.clientY - mOptions.startY);
      if (dx > dragThreshold || dy > dragThreshold) {
        mOptions.canvasRect = mOptions.canvas.getBoundingClientRect();
        mOptions.tempEnd.css({
          top: e.clientY - mOptions.canvasRect.top,
          left: e.clientX - mOptions.canvasRect.left,
        });

        let buffer = 40;
        let scrollSpeed = 10;
        if (e.clientY < buffer) {
          window.scrollBy(0, -scrollSpeed);
        } else if (window.innerHeight - e.clientY < buffer) {
          window.scrollBy(0, scrollSpeed);
        }
        isDragging = true;
        $eXeRelaciona.redibujarLineas(instance, isDragging);
      }
    });

    $(document).on("mouseup", function (e) {
      e.preventDefault();
      if (!mOptions.gameStarted || mOptions.gameOver) return;
      if (!mOptions.currentWordDiv) return;
      var definitionDiv = $(e.target).closest(".RLCP-Definition");
      if (definitionDiv.length > 0 && !definitionDiv.hasClass("RLCP-Connected")) {
        if (!(mOptions.type == 0 && mOptions.currentWordDiv.data("id") != definitionDiv.data("id"))) {
          if (isDragging || (!isDragging && mOptions.currentWordDiv)) {
            $eXeRelaciona.addOrUpdateLine(mOptions.lineindex, mOptions.currentWordDiv, definitionDiv, $eXeRelaciona.borderColors.blue, instance); // Implementa esta función
            $eXeRelaciona.checkAllConnected(instance);
            mOptions.currentWordDiv = null;
          }
        }
      }
      $eXeRelaciona.redibujarLineas(instance, false);
      isDragging = false;
      if (mOptions.tempEnd) {
        mOptions.tempEnd.remove();
        mOptions.tempEnd = null;
      }
    });
  },
  showAutorImage: function ($this, instance) {
    var mOptions = $eXeRelaciona.options[instance],
      author = $this.data("author");
    if (author && author.length > 0) {
      $rlcAuthorGameSelector = "#rlcAuthorGame-" + instance;
      $($rlcAuthorGameSelector).html(mOptions.msgs.msgAuthor + ": " + author);
      $($rlcAuthorGameSelector).show();
    }
  },
  hideAutorImage: function ($this, instance) {
    var mOptions = $eXeRelaciona.options[instance],
      author = $this.data("author");
    if (mOptions.author && mOptions.author.length > 0) {
      $($rlcAuthorGameSelector).html(mOptions.msgs.msgAuthor + ": " + author);
      $($rlcAuthorGameSelector).show();
    } else {
      $($rlcAuthorGameSelector).hide();
    }
  },

  setupEventHandlersMovil: function (instance) {
    var mOptions = $eXeRelaciona.options[instance],
      isDragging = false,
      dragThreshold = 5,
      $gameContainer = $("#rlcGameContainer-" + instance);
    document.querySelector("#rlcContainerGame-" + instance).addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
        if (!mOptions.gameStarted || mOptions.gameOver || !e.touches || e.touches.length == 0) {
          return;
        }
        var target = e.touches[0].target;
        var touchedWord = $(target).closest(".RLCP-Word");
        if (touchedWord.length == 0) return;
        mOptions.targetWord = $(target).closest(".RLCP-Word");
        if (mOptions.targetWord.hasClass("RLCP-Connected")) {
          $eXeRelaciona.removeConnection(mOptions.targetWord, instance);
        }
        $gameContainer.find(".RLCP-Word").removeClass("RLCP-Selected");
        mOptions.targetWord.addClass("RLCP-Selected");
        mOptions.currentWordDiv = mOptions.targetWord;
        mOptions.canvas = document.getElementById("rlcCanvas-" + instance);
        mOptions.contexto = mOptions.canvas.getContext("2d");
        mOptions.canvasRect = mOptions.canvas.getBoundingClientRect();
        mOptions.tempEnd = $("<div>")
          .css({
            position: "absolute",
            top: e.touches[0].clientY - mOptions.canvasRect.top,
            left: e.touches[0].clientX - mOptions.canvasRect.left,
            width: 10,
            height: 10,
            padding: 0,
            margin: 0,
            "border-radius": "50%",
            "background-color": "red",
            "z-index": 9,
          })
          .appendTo("#rlcContainerGame-" + instance);
        mOptions.lineindex = mOptions.currentWordDiv.data("lineindex");
        mOptions.startX = e.touches[0].clientX;
        mOptions.startY = e.touches[0].clientX.clientY;
        isDragging = false;
      },
      { passive: false }
    );

    document.querySelector("#rlcContainerGame-" + instance).addEventListener(
      "touchmove",
      function (e) {
        if (!mOptions.gameStarted || mOptions.gameOver) return;
        if (!mOptions.currentWordDiv) return;
        if (!mOptions.tempEnd) return;
        if (!e.touches || e.touches.length == 0) {
          return;
        }
        var touch = e.touches[0];
        var dx = Math.abs(touch.clientX - mOptions.startX);
        var dy = Math.abs(touch.clientY - mOptions.startY);
        if (dx > dragThreshold || dy > dragThreshold) {
          mOptions.tempEnd.css({
            top: touch.clientY - mOptions.canvasRect.top,
            left: touch.clientX - mOptions.canvasRect.left,
          });
          let buffer = 40;
          let scrollSpeed = 10;
          if (touch.clientY < buffer) {
            window.scrollBy(0, -scrollSpeed);
          } else if (window.innerHeight - touch.clientY < buffer) {
            window.scrollBy(0, scrollSpeed);
          }
          isDragging = true;
          $eXeRelaciona.redibujarLineas(instance, isDragging);
        }
      },
      { passive: false }
    );

    document.querySelector("#rlcContainerGame-" + instance).addEventListener("touchend", function (e) {
      e.preventDefault();
      if (!mOptions.gameStarted || mOptions.gameOver) return;
      if (!e.changedTouches || e.changedTouches.length == 0) {
        return;
      }
      var target = e.changedTouches[0];
      if (!mOptions.currentWordDiv) return;
      var definitionDiv = $(document.elementFromPoint(target.clientX, target.clientY)).closest(".RLCP-Definition");
      if (definitionDiv.length > 0 && !definitionDiv.hasClass("RLCP-Connected")) {
        if (!(mOptions.type == 0 && mOptions.currentWordDiv.data("id") != definitionDiv.data("id"))) {
          if (isDragging || (!isDragging && mOptions.currentWordDiv)) {
            $eXeRelaciona.addOrUpdateLine(mOptions.lineindex, mOptions.currentWordDiv, definitionDiv, $eXeRelaciona.borderColors.blue, instance); // Implementa esta función
            $eXeRelaciona.checkAllConnected(instance);
            mOptions.currentWordDiv = null;
          }
        }
      }
      $eXeRelaciona.redibujarLineas(instance, false);
      isDragging = false;
      if (mOptions.tempEnd) {
        mOptions.tempEnd.remove();
        mOptions.tempEnd = null;
      }
    });
  },
  removeLine: function (lineindex, instance) {
    var mOptions = $eXeRelaciona.options[instance];
    mOptions.linesMap.delete(lineindex);
  },

  updateColorLine: function (lineindex, instance) {
    var mOptions = $eXeRelaciona.options[instance],
      line;
    if (mOptions.linesMap.has(lineindex)) {
      line = mOptions.linesMap.get(lineindex);
      line.color = color;
    }
  },
  dibujaLineaTemporal(instance) {
    var mOptions = $eXeRelaciona.options[instance];
    var startRect = mOptions.currentWordDiv.getBoundingClientRect();
    var endRect = mOpitons.tempEnd.getBoundingClientRect();
    var x1 = startRect.right - mOptions.canvasRect.left;
    var y1 = startRect.top + startRect.height / 2 - mOptions.canvasRect.top;
    var x2 = endRect.left - mOptions.canvasRect.left;
    var y2 = endRect.top + endRect.height / 2 - mOptions.canvasRect.top;
    $eXeRelaciona.dibujaLineaCurva(mOptions.contexto, x1, y1, x2, y2, $eXeRelaciona.borderColors.blue);
  },
  addOrUpdateLine: function (lineindex, $word, $definition, color, instance) {
    var mOptions = $eXeRelaciona.options[instance],
      line,
      correct = false;
    if ($word && $definition) {
      correct = $word.data("id") == $definition.data("id");
    }
    $word.removeClass("RLCP-Selected");
    $definition.data("lineindex", lineindex);
    $definition.addClass("RLCP-Connected");
    $word.addClass("RLCP-Connected");
    if (mOptions.linesMap.has(lineindex)) {
      line = mOptions.linesMap.get(lineindex);
      line.start = $word;
      line.end = $definition;
      line.correct = correct;
      line.color = color;
    } else {
      line = {
        start: $word,
        end: $definition,
        color: color,
        correct: correct,
      };
      mOptions.linesMap.set(lineindex, line);
    }
    return line;
  },

  ajustarCanvas: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    var contenedor = $("#rlcContainerGame-" + instance);
    var canvas = $("#rlcCanvas-" + instance);
    canvas.attr("width", contenedor.width());
    canvas.attr("height", contenedor.height());
    mOptions.canvas = $("#rlcCanvas-" + instance)[0];
    mOptions.contexto = mOptions.canvas.getContext("2d");
    mOptions.canvasRect = mOptions.canvas.getBoundingClientRect();
    $eXeRelaciona.redibujarLineas(instance, false);
  },
  redibujarLineas: function (instance, ismoving) {
    var mOptions = $eXeRelaciona.options[instance];
    mOptions.contexto.clearRect(0, 0, mOptions.canvas.width, mOptions.canvas.height);
    var canvasRect = mOptions.canvas.getBoundingClientRect();
    mOptions.linesMap.forEach(function (line) {
      let startRect = line.start[0].getBoundingClientRect();
      let endRect = line.end[0].getBoundingClientRect();
      let x1 = startRect.right - canvasRect.left;
      let y1 = startRect.top + startRect.height / 2 - canvasRect.top;
      let x2 = endRect.left - canvasRect.left;
      let y2 = endRect.top + endRect.height / 2 - canvasRect.top;
      $eXeRelaciona.dibujaLineaCurva(mOptions.contexto, x1, y1, x2, y2, line.color);
    });
    if (ismoving && mOptions.currentWordDiv && mOptions.tempEnd) {
      let startRect = mOptions.currentWordDiv[0].getBoundingClientRect();
      let endRect = mOptions.tempEnd[0].getBoundingClientRect();
      let x1 = startRect.right - canvasRect.left;
      let y1 = startRect.top + startRect.height / 2 - canvasRect.top;
      let x2 = endRect.left - canvasRect.left;
      let y2 = endRect.top + endRect.height / 2 - canvasRect.top;
      $eXeRelaciona.dibujaLineaCurva(mOptions.contexto, x1, y1, x2, y2, $eXeRelaciona.borderColors.blue);
    }
  },

  dibujaLineaCurva: function (contexto, x0, y0, x1, y1, color) {
    var p0 = { x: x0, y: y0 };
    var p1 = { x: x1, y: y1 };
    var dx = p1.x - p0.x;
    var dy = p1.y - p0.y;
    var desplazamiento = Math.min(100, Math.abs(dx) / 2);
    var pc1 = { x: p0.x + desplazamiento, y: p0.y };
    var pc2 = { x: p1.x - desplazamiento, y: p1.y };
    contexto.beginPath();
    contexto.strokeStyle = color;
    contexto.lineWidth = $eXeRelaciona.isMobile() ? 3 : 5;
    contexto.moveTo(p0.x, p0.y);
    contexto.bezierCurveTo(pc1.x, pc1.y, pc2.x, pc2.y, p1.x, p1.y);
    contexto.stroke();
    var tangente = { x: 3 * (p1.x - pc2.x), y: 3 * (p1.y - pc2.y) };
    var angulo = Math.atan2(tangente.y, tangente.x);
    $eXeRelaciona.dibujaPuntaFlecha(contexto, p1, angulo, color);
  },

  dibujaPuntaFlecha: function (contexto, punto, angulo, color) {
    var tamañoFlecha = $eXeRelaciona.isMobile() ? 10 : 12;
    var anguloFlecha = Math.PI / 6;
    contexto.fillStyle = color;
    contexto.beginPath();
    contexto.moveTo(punto.x, punto.y);
    contexto.lineTo(punto.x - tamañoFlecha * Math.cos(angulo - anguloFlecha), punto.y - tamañoFlecha * Math.sin(angulo - anguloFlecha));
    contexto.lineTo(punto.x - tamañoFlecha * Math.cos(angulo + anguloFlecha), punto.y - tamañoFlecha * Math.sin(angulo + anguloFlecha));
    contexto.closePath();
    contexto.fill();
  },

  removeConnection: function (element, instance) {
    let lineId = element.data("lineindex");
    if (lineId !== undefined) {
      $eXeRelaciona.removeLine(lineId, instance);
      $("#rlcContainerWords-" + instance + " .RLCP-Word").each(function () {
        if ($(this).data("lineindex") == lineId) {
          $(this).removeClass("RLCP-Connected");
        }
      });

      $("#rlcContainerDefinitions-" + instance + " .RLCP-Definition").each(function () {
        if ($(this).data("lineindex") == lineId) {
          $(this).removeClass("RLCP-Connected");
          $(this).data("lineindex", 0);
        }
      });
    }
    $eXeRelaciona.redibujarLineas(instance, false);
  },
  checkAllConnected: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    $("#rlcCheckButton-" + instance).hide();
    $("#rlcResetButton-" + instance).hide();
    $("#rlcButtons-" + instance).css("display", "flex");
    if ($("#rlcContainerGame-" + instance).find(".RLCP-Word.RLCP-Connected").length === $("#rlcContainerGame-" + instance).find(".RLCP-Word").length) {
      if (mOptions.permitirErrores) {
        $("#rlcCheckButton-" + instance).show();
      } else {
        $eXeRelaciona.checkState(instance);
      }
    }
  },

  isMobile: function () {
    return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i);
  },

  enterCodeAccess: function (instance) {
    var mOptions = $eXeRelaciona.options[instance];
    if (
      mOptions.itinerary.codeAccess.toLowerCase() ==
      $("#rlcCodeAccessE-" + instance)
        .val()
        .toLowerCase()
    ) {
      $("#rlcCodeAccessDiv-" + instance).hide();
      $("#rlcCubierta-" + instance).hide();
    } else {
      $("#rlcMesajeAccesCodeE-" + instance)
        .fadeOut(300)
        .fadeIn(200)
        .fadeOut(300)
        .fadeIn(200);
      $("#rlcCodeAccessE-" + instance).val("");
    }
  },
  isMobile: function () {
    return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i);
  },

  shuffleAds: function (arr) {
    for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
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

  updateScore: function (correctAnswer, instance) {
    var mOptions = $eXeRelaciona.options[instance],
      obtainedPoints = 0,
      sscore = 0;
    if (correctAnswer) {
      mOptions.hits++;
      obtainedPoints = 10 / mOptions.realNumberCards;
    } else {
      mOptions.errors++;
    }
    mOptions.score = mOptions.score + obtainedPoints > 0 ? mOptions.score + obtainedPoints : 0;
    sscore = mOptions.score.toFixed(2);
    $("#rlcPScore-" + instance).text(sscore);
    $("#rlcPHits-" + instance).text(mOptions.hits);
    $("#rlcPErrors-" + instance).text(mOptions.errors);
    $("#rlcPNumber-" + instance).text(mOptions.realNumberCards - mOptions.hits - mOptions.errors);
  },

  showMessage: function (type, message, instance) {
    var colors = ["#555555", $eXeRelaciona.borderColors.red, $eXeRelaciona.borderColors.green, $eXeRelaciona.borderColors.blue, $eXeRelaciona.borderColors.yellow],
      color = colors[type],
      $rlcMessage = $("#rlcMessage-" + instance);
    $rlcMessage.html(message);
    $rlcMessage.css({
      color: color,
      "font-style": "bold",
    });
    $rlcMessage.show();
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
  getURLAudioMediaTeca: function (url) {
    if (url) {
      var matc = url.indexOf("https://mediateca.educa.madrid.org/audio/") != -1;
      var matc1 = url.indexOf("https://mediateca.educa.madrid.org/video/") != -1;

      if (matc) {
        var id = url.split("https://mediateca.educa.madrid.org/audio/")[1].split("?")[0];
        id = "https://mediateca.educa.madrid.org/streaming.php?id=" + id;
        return id;
      }
      if (matc1) {
        var id = url.split("https://mediateca.educa.madrid.org/video/")[1].split("?")[0];
        id = "https://mediateca.educa.madrid.org/streaming.php?id=" + id;
        return id;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  extractURLGD: function (urlmedia) {
    var sUrl = urlmedia;
    if (urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 && urlmedia.toLowerCase().indexOf("sharing") != -1) {
      sUrl = sUrl.replace(/https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g, "https://docs.google.com/uc?export=open&id=$1");
    } else if (typeof urlmedia != "undefined" && urlmedia.length > 10 && $eXeRelaciona.getURLAudioMediaTeca(urlmedia)) {
      sUrl = $eXeRelaciona.getURLAudioMediaTeca(urlmedia);
    }
    return sUrl;
  },
};
$(function () {
  $eXeRelaciona.init();
});
