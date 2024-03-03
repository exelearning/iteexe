/**
 * Selecciona Medias activity (Export)
 *
 * Released under Attribution-ShareAlike 4.0 International License.
 * Author: Manuel Narváez Martínez
 * License: http://creativecommons.org/licenses/by-sa/4.0/
 *
 */
var $eXeSeleccionaMedias = {
  idevicePath: "",
  borderColors: {
    black: "#1c1b1b",
    blue: "#3334a1",
    green: "#006641",
    red: "#a2241a",
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
  previousScore: "",
  initialScore: "",
  hasLATEX: false,
  idevicePath:'',
  init: function () {
    this.activities = $(".seleccionamedias-IDevice");
    if (this.activities.length == 0) return;
    if (!$eXeSeleccionaMedias.supportedBrowser("slcmp")) return;
    if (
      typeof $exeAuthoring != "undefined" &&
      $("#exe-submitButton").length > 0
    ) {
      this.activities.hide();
      if (typeof _ != "undefined")
        this.activities.before("<p>" + _("Order") + "</p>");
      return;
    }
    if ($(".QuizTestIdevice .iDevice").length > 0) this.hasSCORMbutton = true;
    if (typeof $exeAuthoring != "undefined") this.isInExe = true;
    this.idevicePath = this.isInExe
      ? "/scripts/idevices/seleccionamedias-activity/export/"
      : "";
    if ($("body").hasClass("exe-scorm")) this.loadSCORM_API_wrapper();
    else this.enable();
  },
  loadSCORM_API_wrapper: function () {
    if (typeof pipwerks == "undefined")
      $exe.loadScript(
        "SCORM_API_wrapper.js",
        "$eXeSeleccionaMedias.loadSCOFunctions()"
      );
    else this.loadSCOFunctions();
  },
  loadSCOFunctions: function () {
    if (typeof exitPageStatus == "undefined")
      $exe.loadScript("SCOFunctions.js", "$eXeSeleccionaMedias.enable()");
    else this.enable();
    $eXeSeleccionaMedias.mScorm = scorm;
    var callSucceeded = $eXeSeleccionaMedias.mScorm.init();
    if (callSucceeded) {
      $eXeSeleccionaMedias.userName = $eXeSeleccionaMedias.getUserName();
      $eXeSeleccionaMedias.previousScore = $eXeSeleccionaMedias.getPreviousScore();
      $eXeSeleccionaMedias.mScorm.set("cmi.core.score.max", 10);
      $eXeSeleccionaMedias.mScorm.set("cmi.core.score.min", 0);
      $eXeSeleccionaMedias.initialScore = $eXeSeleccionaMedias.previousScore;
    }
  },
  getFixedOrder: function (columns, cards) {
    if (cards > 0) {
      var rept = 0;
      var end = 0;
      var arraynum = [];
      var max = cards - columns;
      while (rept != -1) {
        for (var i = 0; i <= max; i++) {
          var numaleatorio = Math.floor(Math.random() * max);
          if (arraynum.indexOf(numaleatorio) < 0) {
            arraynum.push(numaleatorio);
            end++;
          }
          end == max ? (rept = -1) : false;
        }
      }
    }
    var arraybas = [];
    for (var i = 0; i < columns; i++) {
      arraybas.push(i);
    }
    for (var j = 0; j < arraynum.length; j++) {
      arraynum[j] += columns;
    }
    var array = arraybas.concat(arraynum);

    return array;
  },
  updateScorm: function (prevScore, repeatActivity, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance],
      text = "";
    $("#slcmpSendScore-" + instance).hide();
    if (mOptions.isScorm === 1) {
      if (repeatActivity && prevScore !== "") {
        text = mOptions.msgs.msgSaveAuto + " " +  mOptions.msgs.msgYouLastScore +  ": " +   prevScore;
      } else if (repeatActivity && prevScore === "") {
        text = mOptions.msgs.msgSaveAuto + " " + mOptions.msgs.msgPlaySeveralTimes;
      } else if (!repeatActivity && prevScore === "") {
        text = mOptions.msgs.msgOnlySaveAuto;
      } else if (!repeatActivity && prevScore !== "") {
        text = mOptions.msgs.msgActityComply + " " + mOptions.msgs.msgYouLastScore +  ": " +   prevScore;
      }
    } else if (mOptions.isScorm === 2) {
      $("#slcmpSendScore-" + instance).show();
      if (repeatActivity && prevScore !== "") {
        text = mOptions.msgs.msgPlaySeveralTimes + " " +  mOptions.msgs.msgYouLastScore +  ": " + prevScore;
      } else if (repeatActivity && prevScore === "") {
        text = mOptions.msgs.msgPlaySeveralTimes;
      } else if (!repeatActivity && prevScore === "") {
        text = mOptions.msgs.msgOnlySaveScore;
      } else if (!repeatActivity && prevScore !== "") {
        $("#slcmpSendScore-" + instance).hide();
        text = mOptions.msgs.msgActityComply + " " + mOptions.msgs.msgYouScore +  ": " +  prevScore;
      }
    }
    $("#slcmpRepeatActivity-" + instance).text(text);
    $("#slcmpRepeatActivity-" + instance).fadeIn(1000);
  },
  getUserName: function () {
    var user = $eXeSeleccionaMedias.mScorm.get("cmi.core.student_name");
    return user;
  },
  getPreviousScore: function () {
    var score = $eXeSeleccionaMedias.mScorm.get("cmi.core.score.raw");
    return score;
  },
  endScorm: function () {
    $eXeSeleccionaMedias.mScorm.quit();
  },
  enable: function () {
    $eXeSeleccionaMedias.loadGame();
  },
  loadGame: function () {
    $eXeSeleccionaMedias.options = [];
    $eXeSeleccionaMedias.activities.each(function (i) {
      var dl = $(".seleccionamedias-DataGame", this),
        mOption = $eXeSeleccionaMedias.loadDataGame(dl, this),
        msg = mOption.msgs.msgPlayStart;
      $eXeSeleccionaMedias.options.push(mOption);
      var slcmp = $eXeSeleccionaMedias.createInterfaceSelecciona(i);
      dl.before(slcmp).remove();
      $("#slcmpGameMinimize-" + i).hide();
      $("#slcmpGameContainer-" + i).hide();
      if (mOption.showMinimize) {
        $("#slcmpGameMinimize-" + i)
          .css({
            cursor: "pointer",
          })
          .show();
      } else {
        $("#slcmpGameContainer-" + i).show();
      }
      $("#slcmpDivFeedBack-" + i).prepend(
        $(".seleccionamedias-feedback-game", this)
      );
      $eXeSeleccionaMedias.showPhrase(0, i);
      $eXeSeleccionaMedias.addEvents(i);
      $("#slcmpDivFeedBack-" + i).hide();
    });
    if ($eXeSeleccionaMedias.hasLATEX && typeof MathJax == "undefined") {
      $eXeSeleccionaMedias.loadMathJax();
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
  getPhraseDefault: function () {
    var q = new Object();
    q.cards = [];
    q.msgError = "";
    q.msgHit = "";
    q.definition = "";
    q.phrase = "";
    return q;
  },

  getCardDefault: function () {
    var p = new Object();
    p.id = "";
    p.type = 0;
    p.url = "";
    p.audio = "";
    p.x = 0;
    p.y = 0;
    p.author = "";
    p.alt = "";
    p.eText = "";
    p.color = "#000000";
    p.backcolor = "#ffffff";
    return p;
  },

  loadDataGame: function (data, sthis) {
    var json = data.text();
    json = $eXeSeleccionaMedias.Decrypt(json);
    var mOptions = $eXeSeleccionaMedias.isJsonString(json),
      $audiosDef = $(".seleccionamedias-LinkAudiosDef", sthis),
      $imagesDef = $('.seleccionamedias-LinkImagesDef', sthis),
      $audiosError = $(".seleccionamedias-LinkAudiosError", sthis),
      $audiosHit = $(".seleccionamedias-LinkAudiosHit", sthis),
      hasLatex = /(?:\$|\\\(|\\\[|\\begin\{.*?})/.test(json);
    if (hasLatex) {
      $eXeSeleccionaMedias.hasLATEX = true;
    }

    mOptions.playerAudio = "";
    for (var i = 0; i < mOptions.phrasesGame.length; i++) {
      mOptions.phrasesGame[i].url = typeof mOptions.phrasesGame[i].url == "undefined" ? "" : mOptions.phrasesGame[i].url;
      mOptions.phrasesGame[i].alt = typeof mOptions.phrasesGame[i].alt == "undefined" ? "" : mOptions.phrasesGame[i].alt;
      mOptions.phrasesGame[i].author =typeof mOptions.phrasesGame[i].author == "undefined" ? "" : mOptions.phrasesGame[i].author;
      var $imagesLink = $(".seleccionamedias-LinkImages-" + i, sthis),
        $audiosLink = $(".seleccionamedias-LinkAudios-" + i, sthis),
        cards = mOptions.phrasesGame[i].cards;
      $imagesLink.each(function () {
        var iq = parseInt($(this).text());
        if (!isNaN(iq) && iq < cards.length) {
          cards[iq].url = $(this).attr("href");
          if (cards[iq].url < 4) {
            cards[iq].url = "";
          }
        }
      });
      $audiosLink.each(function () {
        var iqa = parseInt($(this).text());
        if (!isNaN(iqa) && iqa < cards.length) {
          cards[iqa].audio = $(this).attr("href");
          if (cards[iqa].audio.length < 4) {
            cards[iqa].audio = "";
          }
        }
      });
      mOptions.phrasesGame[i].phrase =
        typeof mOptions.phrasesGame[i].phrase == "undefined"
          ? ""
          : mOptions.phrasesGame[i].phrase;  

      for (var j = 0; j < cards.length; j++) {
        cards[j].type = 0;
        if (cards[j].url.length > 4 && cards[j].eText.trim().length > 0) {
          cards[j].type = 2;
        } else if (cards[j].url.length > 4) {
          cards[j].type = 0;
        } else if (cards[j].eText.trim().length > 0) {
          cards[j].type = 1;
        }
        cards[j].order = j;
      }
    }
    $imagesDef.each(function () {
      var iqb = parseInt($(this).text());
      if (!isNaN(iqb) && iqb < mOptions.phrasesGame.length) {
        mOptions.phrasesGame[iqb].url = $(this).attr('href');
          if (mOptions.phrasesGame[iqb].url.length < 4) {
            mOptions.phrasesGame[iqb].url = "";
          }
      }
   });
    $audiosDef.each(function () {
      var iqa = parseInt($(this).text());
      if (!isNaN(iqa) && iqa < mOptions.phrasesGame.length) {
        mOptions.phrasesGame[iqa].audioDefinition = $(this).attr("href");
        if (mOptions.phrasesGame[iqa].audioDefinition.length < 4) {
          mOptions.phrasesGame[iqa].audioDefinition = "";
        }
      }
    });
    $audiosError.each(function () {
      var iqa = parseInt($(this).text());
      if (!isNaN(iqa) && iqa < mOptions.phrasesGame.length) {
        mOptions.phrasesGame[iqa].audioError = $(this).attr("href");
        if (mOptions.phrasesGame[iqa].audioError.length < 4) {
          mOptions.phrasesGame[iqa].audioError = "";
        }
      }
    });
    $audiosHit.each(function () {
      var iqa = parseInt($(this).text());
      if (!isNaN(iqa) && iqa < mOptions.phrasesGame.length) {
        mOptions.phrasesGame[iqa].audioHit = $(this).attr("href");
        if (mOptions.phrasesGame[iqa].audioHit.length < 4) {
          mOptions.phrasesGame[iqa].audioHit = "";
        }
      }
    });
    mOptions.modeTable = mOptions.numberMaxCards<= 4 ? 1: mOptions.modeTable;
    mOptions.active = 0;
    mOptions.evaluation = typeof mOptions.evaluation == "undefined" ? false : mOptions.evaluation;
    mOptions.evaluationID =  typeof mOptions.evaluationID == "undefined" ? "" : mOptions.evaluationID;
    mOptions.id = typeof mOptions.id == "undefined" ? false : mOptions.id;
    mOptions.allPhrases = $.extend(true, {}, mOptions.phrasesGame);
    mOptions.phrasesGame = $eXeSeleccionaMedias.getQuestions(mOptions.phrasesGame, mOptions.percentajeQuestions);
    mOptions.phrasesGame = $eXeSeleccionaMedias.shuffleAds(mOptions.phrasesGame);
    mOptions.numberQuestions = mOptions.phrasesGame.length;
    mOptions.fullscreen = false;
    mOptions.hits = 0;
    for (var i = 0; i < mOptions.phrasesGame.length; i++){
      mOptions.phrasesGame[i].cards = $eXeSeleccionaMedias.getCardsPart( mOptions.phrasesGame[i].cards, mOptions.numberMaxCards);
    }
    return mOptions;
  },

  showPhrase: function (num, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    mOptions.active = num;
    mOptions.intentos = mOptions.attempsNumber;
    mOptions.phrase = mOptions.phrasesGame[num];
    $eXeSeleccionaMedias.stopSound(instance);
    $eXeSeleccionaMedias.addCards(mOptions.phrase.cards, instance);
    $eXeSeleccionaMedias.showMessage(1,'',instance);
    $eXeSeleccionaMedias.showImage(num,instance);     $('#slcmpAudioDef-' + instance).hide();
    if (num > 0) {
      $('#slcmpQuestion-' + instance).html(mOptions.phrase.definition);
      $('#slcmpQuestion-' + instance).show();
      if (typeof mOptions.phrase.audioDefinition != "undefined" && mOptions.phrase.audioDefinition.length > 4) {
        $eXeSeleccionaMedias.playSound( mOptions.phrase.audioDefinition, instance );
        $('#slcmpAudioDef-'+instance).css('display','block');
      }

    }
  },

  getQuestions: function (questions, percentaje) {
    var mQuestions = questions;
    if (percentaje < 100) {
      var num = Math.round((percentaje * questions.length) / 100);
      num = num < 1 ? 1 : num;
      if (num < questions.length) {
        var array = [];
        for (var i = 0; i < questions.length; i++) {
          array.push(i);
        }
        array = $eXeSeleccionaMedias
          .shuffleAds(array)
          .slice(0, num)
          .sort(function (a, b) {
            return a - b;
          });
        mQuestions = [];
        for (var i = 0; i < array.length; i++) {
          mQuestions.push(questions[array[i]]);
        }
      }
    }
    return mQuestions;
  },

  getCardsPart: function (questions, number) {
    var mQuestions = questions;
    if (number <= 30) {
      var num = number
      num = num < 1 ? 1 : num;
      if (num < questions.length) {
        var array = [];
        for (var i = 0; i < questions.length; i++) {
          array.push(i);
        }
        array = $eXeSeleccionaMedias
          .shuffleAds(array)
          .slice(0, num)
          .sort(function (a, b) {
            return a - b;
          });
        mQuestions = [];
        for (var i = 0; i < array.length; i++) {
          mQuestions.push(questions[array[i]]);
        }
      }
    }
    return mQuestions;
  },

  playSound: function (selectedFile, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    $eXeSeleccionaMedias.stopSound(instance);
    selectedFile = $eXeSeleccionaMedias.extractURLGD(selectedFile);
    mOptions.playerAudio = new Audio(selectedFile); //or you can get it with getelementbyid
    mOptions.playerAudio
      .play()
      .catch((error) => console.error("Error playing audio:", error));
  },

  stopSound: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    if (
      mOptions.playerAudio &&
      typeof mOptions.playerAudio.pause == "function"
    ) {
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
  createInterfaceSelecciona: function (instance) {
    var html = "",
      path = $eXeSeleccionaMedias.idevicePath,
      msgs = $eXeSeleccionaMedias.options[instance].msgs,
      html = "";
    html +='<div class="SLCMP-MainContainer" id="slcmpMainContainer-' + instance + '">\
        <div class="SLCMP-GameMinimize" id="slcmpGameMinimize-' + instance +'">\
            <a href="#" class="SLCMP-LinkMaximize" id="slcmpLinkMaximize-' + instance + '" title="' + msgs.msgMaximize +'"><img src="' + path + 'slcmpIcon.png"  class="SLCMP-IconMinimize SLCMP-Activo"  alt="">\
            <div class="SLCMP-MessageMaximize" id="slcmpMessageMaximize-' + instance + '">' +      msgs.msgPlayStart + '</div>\
            </a>\
        </div>\
        <div class="SLCMP-GameContainer" id="slcmpGameContainer-' + instance + '">\
            <div class="SLCMP-GameScoreBoard" id="slcmpGameScoreBoard-' + instance + '">\
                <div class="SLCMP-GameScores">\
                    <div class="exeQuextIcons  exeQuextIcons-Number"  id="slcmpPNumberIcon-' + instance + '" title="' +  msgs.msgNumQuestions + '"></div>\
                    <p><span class="sr-av">' +  msgs.msgNumQuestions + ': </span><span id="slcmpPNumber-' +  instance + '">0</span></p>\
                    <div class="exeQuextIcons exeQuextIcons-Hit" title="' +  msgs.msgHits + '"></div>\
                    <p><span class="sr-av">' + msgs.msgHits + ': </span><span id="slcmpPHits-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Error" title="' +  msgs.msgNumbersAttemps + '"></div>\
                    <p><span class="sr-av">' + msgs.msgErrors + ': </span><span id="slcmpPErrors-' + instance + '">0</span></p>\
                    <div class="exeQuextIcons  exeQuextIcons-Score" id="slcmpPScoreIcon-' + instance + '" title="' +  msgs.msgScore + '"></div>\
                    <p><span class="sr-av">' +  msgs.msgScore + ': </span><span id="slcmpPScore-' +  instance + '">0</span></p>\
                </div>\
                <div class="SLCMP-Info" id="slcmpInfo-' + instance +'"></div>\
                    <div class="SLCMP-TimeNumber">\
                      <strong><span class="sr-av">' +  msgs.msgTime + ':</span></strong>\
					          <div class="exeQuextIcons  exeQuextIcons-Time" id="slcmpImgTime-' + instance + '" title="' +  msgs.msgTime +  '"></div>\
                    <p  id="slcmpPTime-' + instance + '" class="SLCMP-PTime">00:00</p>\
                    <a href="#" class="SLCMP-LinkMansory" id="slcViewMode-' +  instance + '" title="' + msgs.msgChangeMode + '">\
                      <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                      <div class="exeQuextIcons exeQuextIcons-ModeTable SLCMP-Activo"></div>\
                    </a>\
                    <a href="#" class="SLCMP-LinkMinimize" id="slcmpLinkMinimize-' +  instance + '" title="' + msgs.msgMinimize + '">\
                        <strong><span class="sr-av">' + msgs.msgMinimize + ':</span></strong>\
                        <div class="exeQuextIcons exeQuextIcons-Minimize  SLCMP-Activo"></div>\
                    </a>\
                    <a href="#" class="SLCMP-LinkFullScreen" id="slcmpLinkFullScreen-' + instance + '" title="' +  msgs.msgFullScreen + '">\
						<strong><span class="sr-av">' +  msgs.msgFullScreen + ':</span></strong>\
						<div class="exeQuextIcons exeQuextIcons-FullScreen  SLCMP-Activo" id="slcmpFullScreen-' + instance + '"></div>\
                    </a>\
				</div>\
            </div>\
            <div class="SLCMP-ImageDiv" id="slcmpImageDiv-' +  instance +  '">\
                 <img class="SLCMP-ImageDef" id="slcmpImageDefinition-' +  instance +  '"  src="' + path + 'slcmImage.png" alt="' +  msgs.msgNoImage + '" />\
            </div>\
            <div class="SLCMP-Author" id="slcmpAuthor-' +  instance +  '">Probando</div>\
            <div class="SLCMP-Information">\
              <p class="SLCMP-Message" id="slcmpMessage-' +  instance +  '"></p>\
              <a href="#" id="slcmpStartGame-' +  instance + '">' +  msgs.msgPlayStart + '</a>\
            </div>\
            <div class="SLCMP-GameButton" id="slcmpGameButtons-' +  instance + '">\
                <a href="#" id="slcmpCheck-' + instance + '" title="">' + msgs.msgCheck + '</a>\
                <a href="#" id="slcmpReboot-' + instance + '" title="" style="display:none">' +  msgs.msgAgain + '</a>\
            </div>\
            <div class="SLCMP-QuestionDiv" id="slcmpQuestionDiv-' +  instance +  '">\
              <div class="SLCMP-Question" id="slcmpQuestion-' +  instance +  '"></div>\
              <a href="#" id="slcmpAudioDef-' + instance + '" class="SLCMP-LinkAudioDef">\
                <img src="' + $eXeSeleccionaMedias.idevicePath + 'exequextplayaudio.svg">\
              </a>\
            </div>\
            <div class="SLCMP-Multimedia" id="slcmpMultimedia-' + instance + '"></div>\
            <div class="SLCMP-Cubierta" id="slcmpCubierta-' + instance + '">\
                <div class="SLCMP-GameOverExt" id="slcmpGameOver-' + instance +'">\
                    <div class="SLCMP-StartGameEnd" id="slcmpMesasgeEnd-' + instance + '"></div>\
                    <div class="SLCMP-GameOver">\
                        <div class="SLCMP-DataImage">\
                            <img src="' +  path + 'exequextwon.png" class="SLCMP-HistGGame" id="slcmpHistGame-' + instance + '" alt="' +  msgs.msgAllQuestions + '" />\
                            <img src="' +  path + 'exequextlost.png" class="SLCMP-LostGGame" id="slcmpLostGame-' + instance + '"  alt="' + msgs.msgTimeOver + '" />\
                        </div>\
                        <div class="SLCMP-DataScore">\
                            <p id="slcmpOverNumCards-' + instance + '"></p>\
                            <p id="slcmpOverHits-' + instance + '"></p>\
                            <p id="slcmpOverErrors-' +  instance + '"></p>\
                            <p id="slcmpOverScore-' +  instance + '"></p>\
                        </div>\
                    </div>\
                    <div class="SLCMP-StartGameEnd"><a href="#" id="slcmpStartGameEnd-' + instance + '">' +  msgs.msgPlayAgain + '</a></div>\
                </div>\
                <div class="SLCMP-CodeAccessDiv" id="slcmpCodeAccessDiv-' + instance +  '">\
                    <div class="SLCMP-MessageCodeAccessE" id="slcmpMesajeAccesCodeE-' + instance + '"></div>\
                    <div class="SLCMP-DataCodeAccessE">\
                        <label class="sr-av">' +  msgs.msgCodeAccess + ':</label><input type="text" class="SLCMP-CodeAccessE" id="slcmpCodeAccessE-' + instance + '" placeholder="' + msgs.msgCodeAccess + '">\
                        <a href="#" id="slcmpCodeAccessButton-' + instance + '" title="' + msgs.msgSubmit + '">\
                            <strong><span class="sr-av">' + msgs.msgSubmit +'</span></strong>\
                            <div class="exeQuextIcons-Submit SLCMP-Activo"></div>\
                        </a>\
                    </div>\
                </div>\
                <div class="SLCMP-ShowClue" id="slcmpShowClue-' + instance +'">\
                    <p class="sr-av">' + msgs.msgClue + '</p>\
                    <p class="SLCMP-PShowClue" id="slcmpPShowClue-' +  instance + '"></p>\
                    <a href="#" class="SLCMP-ClueBotton" id="slcmpClueButton-' + instance + '" title="' +  msgs.msgContinue + '">' + msgs.msgContinue + ' </a>\
                </div>\
            </div>\
            <div class="SLCMP-DivFeedBack" id="slcmpDivFeedBack-' + instance +'">\
                <input type="button" id="slcmpFeedBackClose-' + instance + '" value="' + msgs.msgClose + '" class="feedbackbutton" />\
            </div>\
            <div class="SLCMP-AuthorGame" id="slcmpAuthorGame-' +  instance +'"></div>\
        </div>\
    </div>\
    ' +
      this.addButtonScore(instance);

    return html;
  },

  addButtonScore: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    var butonScore = "";
    var fB = '<div class="SLCMP-BottonContainer">';
    if (mOptions.isScorm == 2) {
      var buttonText = mOptions.textButtonScorm;
      if (buttonText != "") {
        if (
          this.hasSCORMbutton == false &&
          ($("body").hasClass("exe-authoring-page") ||
            $("body").hasClass("exe-scorm"))
        ) {
          this.hasSCORMbutton = true;
          fB += '<div class="SLCMP-GetScore">';
          if (!this.isInExe) fB += '<form action="#" onsubmit="return false">';
          fB +='<p><input type="button" id="slcmpSendScore-' + instance + '" value="' + buttonText + '" class="feedbackbutton" /> <span class="SLCMP-RepeatActivity" id="slcmpRepeatActivity-' + instance + '"></span></p>';
          if (!this.isInExe) fB += "</form>";
          fB += "</div>";
          butonScore = fB;
        }
      }
    } else if (mOptions.isScorm == 1) {
      if (
        this.hasSCORMbutton == false &&
        ($("body").hasClass("exe-authoring-page") ||
          $("body").hasClass("exe-scorm"))
      ) {
        this.hasSCORMbutton = true;
        fB += '<div class="SLCMP-GetScore">';
        fB += '<p><span class="SLCMP-RepeatActivity" id="slcmpRepeatActivity-' + instance + '"></span></p>';
        fB += "</div>";
        butonScore = fB;
      }
    }
    fB = +"</div>";
    return butonScore;
  },
  showImage: function (num,instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance],
        q = mOptions.phrasesGame[num];

    if(q.url.length < 4){
      return false;
    }
    var $image = $('#slcmpImageDefinition-' + instance),
        $imageDiv = $('#slcmpImageDiv-' + instance),
        $author = $('#slcmpAuthor-' + instance);
    $imageDiv.hide();
    $author.hide();
    $image.attr('alt', q.alt);
    $image.prop('src', q.url)
        .on('load', function () {
            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                return false;
            } else {
                var mData = $eXeSeleccionaMedias.placeImageWindows(this, this.naturalWidth, this.naturalHeight);
                $eXeSeleccionaMedias.drawImage(this, mData);
                $imageDiv.show();
                if( q.author.length > 0){
                  $author.show();
                }
                if( q.alt.length > 0){
                  $image.prop('alt', q.alt);
                }
                return true;
            }
        }).on('error', function () {
            return false;
        });
  },
  drawImage: function (image, mData) {
    $(image).css({
        'position': 'absolute',
        'left': mData.x + 'px',
        'top': mData.y + 'px',
        'width': mData.w + 'px',
        'height': mData.h + 'px'
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
        y: yImagen
    };

},
  updateEvaluationIcon: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    if (mOptions.id && mOptions.evaluation && mOptions.evaluationID.length > 0) {
      var node = $("#nodeTitle").text(),
        data = $eXeSeleccionaMedias.getDataStorage(mOptions.evaluationID);
      var score = "",
        state = 0;
      if (!data) {
        $eXeSeleccionaMedias.showEvaluationIcon(instance, state, score);
        return;
      }
      const findObject = data.activities.find(
        (obj) => obj.id == mOptions.id && obj.node === node
      );
      if (findObject) {
        state = findObject.state;
        score = findObject.score;
      }
      $eXeSeleccionaMedias.showEvaluationIcon(instance, state, score);
      var ancla = "ac-" + mOptions.id;
      $("#" + ancla).remove();
      $("#slcmpMainContainer-" + instance)
        .parents("article")
        .prepend('<div id="' + ancla + '"></div>');
    }
  },
  showEvaluationIcon: function (instance, state, score) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    var $header = $("#slcmpGameContainer-" + instance)
      .parents("article")
      .find("header.iDevice_header");
    var icon = "exequextsq.png",
      alt = mOptions.msgs.msgUncompletedActivity;
    if (state == 1) {
      icon = "exequextrerrors.png";
      alt = mOptions.msgs.msgUnsuccessfulActivity.replace('%s', score);
    } else if (state == 2) {
      icon = "exequexthits.png";
      alt = mOptions.msgs.msgSuccessfulActivity.replace('%s', score);
    }
    $("#slcmpEvaluationIcon-" + instance).remove();
    var sicon ='<div id="slcmpEvaluationIcon-' + instance + '" class="SLCMP-EvaluationDivIcon"><img  src="' + $eXeSeleccionaMedias.idevicePath + icon + '"><span>' +  mOptions.msgs.msgUncompletedActivity +  "</span></div>";
    $header.eq(0).append(sicon);
    $("#slcmpEvaluationIcon-" + instance)
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
    const findObject = obj1.activities.find(
      (obj) => obj.id === obj2.id && obj.node === obj2.node
    );

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
    var formattedDate =
      currentDate.getDate().toString().padStart(2, "0") +
      "/" +
      (currentDate.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      currentDate.getFullYear().toString().padStart(4, "0") +
      " " +
      currentDate.getHours().toString().padStart(2, "0") +
      ":" +
      currentDate.getMinutes().toString().padStart(2, "0") +
      ":" +
      currentDate.getSeconds().toString().padStart(2, "0");
    return formattedDate;
  },

  saveEvaluation: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance],
      score = ((mOptions.hits * 10) / mOptions.numberQuestions).toFixed(2);
    if (
      mOptions.id &&
      mOptions.evaluation &&
      mOptions.evaluationID.length > 0
    ) {
      var name = $("#slcmpGameContainer-" + instance).parents("article").find(".iDeviceTitle").eq(0).text(),
        node = $("#nodeTitle").text();
      var formattedDate = $eXeSeleccionaMedias.getDateString();
      var scorm = {
        id: mOptions.id,
        type: mOptions.msgs.msgTypeGame,
        node: node,
        name: name,
        score: score,
        date: formattedDate,
        state: parseFloat(score) >= 5 ? 2 : 1,
      };
      var data = $eXeSeleccionaMedias.getDataStorage(mOptions.evaluationID);
      data = $eXeSeleccionaMedias.updateEvaluation(data, scorm);
      data = JSON.stringify(data, mOptions.evaluationID);
      localStorage.setItem("dataEvaluation-" + mOptions.evaluationID, data);
      $eXeSeleccionaMedias.showEvaluationIcon(instance, scorm.state,scorm.score);
    }
  },
  getDataStorage: function (id) {
    var id = "dataEvaluation-" + id,
      data = $eXeSeleccionaMedias.isJsonString(localStorage.getItem(id));
    return data;
  },
  sendScore: function (instance, auto) {
    var mOptions = $eXeSeleccionaMedias.options[instance],
      message = "",
      score = ((mOptions.hits * 10) / mOptions.phrasesGame.length).toFixed(2);
    if (mOptions.gameStarted || mOptions.gameOver) {
      if (typeof $eXeSeleccionaMedias.mScorm != "undefined") {
        if (!auto) {
          if (!mOptions.repeatActivity && $eXeSeleccionaMedias.previousScore !== ""
          ) {
            message =$eXeSeleccionaMedias.userName !== ""
                ? $eXeSeleccionaMedias.userName +
                  " " +
                  mOptions.msgs.msgOnlySaveScore
                : mOptions.msgs.msgOnlySaveScore;
          } else {
            $eXeSeleccionaMedias.previousScore = score;
            $eXeSeleccionaMedias.mScorm.set("cmi.core.score.raw", score);
            message = $eXeSeleccionaMedias.userName !== ""   ? $eXeSeleccionaMedias.userName + ", " + $exe_i18n.yourScoreIs +  " " + score : $exe_i18n.yourScoreIs + " " + score;
            if (!mOptions.repeatActivity) {
              $("#slcmpSendScore-" + instance).hide();
            }
            $("#slcmpRepeatActivity-" + instance).text($exe_i18n.yourScoreIs + " " + score);
            $("#slcmpRepeatActivity-" + instance).show();
          }
        } else {
          $eXeSeleccionaMedias.previousScore = score;
          score = score === "" ? 0 : score;
          $eXeSeleccionaMedias.mScorm.set("cmi.core.score.raw", score);
          $("#slcmpRepeatActivity-" + instance).text($exe_i18n.yourScoreIs + " " + score);
          $("#slcmpRepeatActivity-" + instance).show();
          message = "";
        }
      } else {
        message = mOptions.msgs.msgScoreScorm;
      }
    } else {
      var hasClass = $("body").hasClass("exe-scorm");
      message = hasClass ? mOptions.msgs.msgEndGameScore : mOptions.msgs.msgScoreScorm;
    }
    if (!auto) alert(message);
  },
  addCards: function (cardsGame, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    for (let i = cardsGame.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardsGame[i], cardsGame[j]] = [cardsGame[j], cardsGame[i]];
    }
    $("#slcmpCheck-" + instance).show();
    $("#slcmpReboot-" + instance).hide();
    $("#slcmpMultimedia-" + instance).empty();
    cardsGame.forEach(function (card) {
      var $divImage = $('<div class="SLCMP-Card SLCMP-GridItem SLCMP-NoHover"></div>');
      if (card.url && card.url.trim() !== "") {
        $divImage.append('<img class="SLCMP-Image" src="' + card.url + '" alt="' + card.alt + '">');
       if (card.author && card.author.trim() !=""){
         $divImage.append('<img class="SLCMP-Author" src="' + $eXeSeleccionaMedias.idevicePath+'quextauthor.png" alt="' + mOptions.msgs.msgAuthor +': '+card.author + '" title="' + mOptions.msgs.msgAutor +': '+ card.author + '">');
       }
      }
      if (card.eText && card.eText.trim() !== "") {
        var $divText = $('<div class="SLCMP-TextCard">' + card.eText + "</div>");
        if (card.color && card.color.trim() !== "") {
          $divText.css("color", card.color);
        }
        if (card.backcolor && card.backcolor.trim() !== "") {
          $divText.css("background-color", card.backcolor);
        }
        if (!card.url || card.url.trim() === "") {
          $divText.addClass("SLCMP-NoImage");
        }
        $divImage.append($divText);
      }

      var $sonidoEnlace;
      if (card.audio && card.audio.trim() !== "") {
        $sonidoEnlace = $(
          '<a href="#" class="SLCMP-LinkAudio"><img src="' + $eXeSeleccionaMedias.idevicePath + 'exequextplayaudio.svg"></a>'
        );
        $sonidoEnlace.on("click", function (e) {
          e.preventDefault();
          var audio = new Audio(card.audio);
          audio.play();
        });
        $divImage.append($sonidoEnlace);
      }
      if ((!card.url || card.url.trim() === "") && (!card.eText || card.eText.trim() === "") &&  $sonidoEnlace) {
        $divImage.addClass("SLCMP-OnlyAudio");
      }
      $divImage.data("state", card.state);
      $("#slcmpMultimedia-" + instance).append($divImage);
    });
    var imagesLoaded = 0;
    var totalImages = cardsGame.filter(t => t.url && t.url.trim() !== "").length;;
    if(mOptions.modeTable){
      $('#slcViewMode-' + instance).find('div.exeQuextIcons').removeClass('exeQuextIcons-ModeTable');
      $('#slcViewMode-' + instance).find('div.exeQuextIcons').addClass('exeQuextIcons-ModeMansory');
    }
    if(totalImages == 0 ){
      if(mOptions.modeTable){
        $('#slcViewMode-' + instance).find('div.exeQuextIcons').removeClass('exeQuextIcons-ModeTable');
        $('#slcViewMode-' + instance).find('div.exeQuextIcons').addClass('exeQuextIcons-ModeMansory');
        $("#slcmpGameContainer-" + instance).find('.SLCMP-Multimedia').addClass('SLCMP-ModeTable');
      } else {
        $eXeSeleccionaMedias.initializeMasonry(instance)
      }
    }else{
      $("#slcmpMultimedia-" + instance).find("img.SLCMP-Image")
      .on("load", function () {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          if(mOptions.modeTable){
            $("#slcmpGameContainer-" + instance).find('.SLCMP-Multimedia').addClass('SLCMP-ModeTable');
          } else {
            $eXeSeleccionaMedias.initializeMasonry(instance);
          }
        }
      })
      .on("error", function () {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          if(mOptions.modeTable){
            $("#slcmpGameContainer-" + instance).find('.SLCMP-Multimedia').addClass('SLCMP-ModeTable');
          } else {
            $eXeSeleccionaMedias.initializeMasonry(instance)
          }
        }
      });
    }
  },
  checkQuestion: function(instance){
    var mOptions= $eXeSeleccionaMedias.options[instance],
       todasCorrectas = true,
       seleccionadasCorrectamente = true;
    $("#slcmpCheck-" + instance).hide();
    $eXeSeleccionaMedias.desactivateHover(instance);
    mOptions.intentos--;
    $("#slcmpMultimedia-" + instance).find(".SLCMP-GridItem").each(function () {
        var $this = $(this),
          esCorrecta = $this.data("state"),
          estaSeleccionada = $this.hasClass("SLCMP-Select");
        if (estaSeleccionada) {
          if (esCorrecta) {
            $this.addClass("SLCMP-OK"); 
          } else {
            $this.addClass("SLCMP-KO"); 
            seleccionadasCorrectamente = false;
          }
        } else {
          if (esCorrecta) {
            todasCorrectas = false;
          }
          $this.removeClass("SLCMP-OK SLCMP-KO SLCMP-Select");
        }
      });
    if (todasCorrectas && seleccionadasCorrectamente) {
       $eXeSeleccionaMedias.updateScore(true, instance);
       var msg = mOptions.customMessages &&  mOptions.phrasesGame[mOptions.active].msgHit && mOptions.phrasesGame[mOptions.active].msgHit.length >0 ? mOptions.phrasesGame[mOptions.active].msgHit : mOptions.msgs.msgAllOK;
       $eXeSeleccionaMedias.showMessage(2, msg, instance);
       if (mOptions.isScorm == 1) {
        if (mOptions.repeatActivity || $eXeSeleccionaMedias.initialScore === "") {
          var score = ((mOptions.hits * 10) / mOptions.phrasesGame.length).toFixed(2);
          $eXeSeleccionaMedias.sendScore(instance, true);
          $("#slcmpRepeatActivity-" + instance).text(mOptions.msgs.msgYouScore + ": " + score);
          $eXeSeleccionaMedias.initialScore = score;
        }
      }
     }else{
        var msg=$eXeSeleccionaMedias.getMessageErrorAnswer(instance);
        msg = mOptions.customMessages &&  mOptions.phrasesGame[mOptions.active].msgError && mOptions.phrasesGame[mOptions.active].msgError.length >0 ? mOptions.phrasesGame[mOptions.active].msgError : msg;
        $eXeSeleccionaMedias.showMessage(1, msg ,instance);
        var mtxt = mOptions.intentos > 0 ? mOptions.msgs.msgAgain + ' (' + mOptions.intentos + ')':mOptions.msgs.msgAgain;
        $("#slcmpReboot-" + instance).html(mtxt);
        if(mOptions.intentos > 0){
          $("#slcmpReboot-" + instance).show();
        }else{
          $eXeSeleccionaMedias.updateScore(false, instance);
          if (mOptions.isScorm == 1) {
            if (mOptions.repeatActivity || $eXeSeleccionaMedias.initialScore === "") {
              var score = ((mOptions.hits * 10) / mOptions.phrasesGame.length).toFixed(2);
              $eXeSeleccionaMedias.sendScore(instance, true);
              $("#slcmpRepeatActivity-" + instance).text(mOptions.msgs.msgYouScore + ": " + score);
              $eXeSeleccionaMedias.initialScore = score;
            }
          }
        }    }
  },
  desactivateHover:function(instance){
    $("#slcmpMultimedia-" + instance).find('.SLCMP-Card').addClass('SLCMP-NoHover')
    $("#slcmpMultimedia-" + instance).off("click", ".SLCMP-Card");
  },
  activateHover:function(instance){
    $("#slcmpMultimedia-" + instance).find('.SLCMP-Card').removeClass('SLCMP-NoHover')
    $("#slcmpMultimedia-" + instance).off("click", ".SLCMP-Card");
    $("#slcmpMultimedia-" + instance).on("click",".SLCMP-Card",function (e) {
      e.preventDefault();
      $(this).toggleClass("SLCMP-Select");
    });
  },
  clear: function (phrase) {
    return phrase.replace(/[&\s\n\r]+/g, " ").trim();
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
    var mOptions = $eXeSeleccionaMedias.options[instance],
      element = element || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      mOptions.fullscreen = true;
      $eXeSeleccionaMedias.getFullscreen(element);
    } else {
      mOptions.fullscreen = false;
      $eXeSeleccionaMedias.exitFullscreen(element);
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
  addEvents: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    $("#slcmpLinkMaximize-" + instance).on("click touchstart", function (e) {
      e.preventDefault();
      $("#slcmpGameContainer-" + instance).show();
      $("#slcmpGameMinimize-" + instance).hide();
      if (!mOptions.gameStarted && !mOptions.gameOver) {
        $eXeSeleccionaMedias.startGame(instance);
        $("#slcmpStartGame-" + instance).hide();
      }
    });
    $("#slcmpLinkMinimize-" + instance).on("click touchstart", function (e) {
      e.preventDefault();
      $("#slcmpGameContainer-" + instance).hide();
      $("#slcmpGameMinimize-" + instance)
        .css("visibility", "visible")
        .show();
    });
    $("#slcmpCubierta-" + instance).hide();
    $("#slcmpGameOver-" + instance).hide();
    $("#slcmpCodeAccessDiv-" + instance).hide();
    $("#slcmpLinkFullScreen-" + instance).on("click touchstart", function (e) {
      e.preventDefault();
      var element = document.getElementById("slcmpGameContainer-" + instance);
      $eXeSeleccionaMedias.toggleFullscreen(element, instance);
    });
    $("#slcmpFeedBackClose-" + instance).on("click", function (e) {
      $("#slcmpDivFeedBack-" + instance).hide();
      $("#slcmpGameOver-" + instance).show();
    });
    if (mOptions.itinerary.showCodeAccess) {
      $("#slcmpMesajeAccesCodeE-" + instance).text(mOptions.itinerary.messageCodeAccess);
      $("#slcmpCodeAccessDiv-" + instance).show();
      $("#slcmpCubierta-" + instance).show();
    }
    $("#slcmpCodeAccessButton-" + instance).on("click touchstart",
      function (e) {
        e.preventDefault();
        $eXeSeleccionaMedias.enterCodeAccess(instance);
      }
    );
    $("#slcmpCodeAccessE-" + instance).on("keydown", function (event) {
      if (event.which == 13 || event.keyCode == 13) {
        $eXeSeleccionaMedias.enterCodeAccess(instance);
        return false;
      }
      return true;
    });
    $("#slcmpPNumber-" + instance).text(mOptions.numberQuestions);
    $(window).on("unload", function () {
      if (typeof $eXeSeleccionaMedias.mScorm != "undefined") {
        $eXeSeleccionaMedias.endScorm();
      }
    });
    if (mOptions.isScorm > 0) {
      $eXeSeleccionaMedias.updateScorm($eXeSeleccionaMedias.previousScore, mOptions.repeatActivity,instance);
    }
    $("#slcmpSendScore-" + instance).click(function (e) {
      e.preventDefault();
      $eXeSeleccionaMedias.sendScore(instance, false);
      $eXeSeleccionaMedias.saveEvaluation(instance);
    });
    window.addEventListener("resize", function () {
      var element = document.getElementById("slcmpGameContainer-" + instance);
      element = element || document.documentElement;
      mOptions.fullscreen = !(
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      );
    });
    $("#slcmpStartGame-" + instance).on("click", function (e) {
      e.preventDefault();
      $eXeSeleccionaMedias.startGame(instance);
      $(this).hide();
    });
    $("#slcmpStartGameEnd-" + instance).on("click", function (e) {
      e.preventDefault();
      $eXeSeleccionaMedias.showPhrase(0, instance);
      $eXeSeleccionaMedias.startGame(instance);
      $("#slcmpCubierta-" + instance).hide();
    });
    $("#slcmpClueButton-" + instance).on("click", function (e) {
      e.preventDefault();
      $("#slcmpShowClue-" + instance).hide();
      $("#slcmpCubierta-" + instance).fadeOut();
    });

    if (mOptions.time == 0) {
      $("#slcmpPTime-" + instance).hide();
      $("#slcmpImgTime-" + instance).hide();
      $eXeSeleccionaMedias.uptateTime(mOptions.time * 60, instance);
    } else {
      $eXeSeleccionaMedias.uptateTime(mOptions.time * 60, instance);
    }
    if (mOptions.author.trim().length > 0 && !mOptions.fullscreen) {
      $("#slcmpAuthorGame-" + instance).html(
        mOptions.msgs.msgAuthor + "; " + mOptions.author
      );
      $("#slcmpAuthorGame-" + instance).show();
    }
    $("#slcmpNextPhrase-" + instance).hide();
    $("#slcmpGameButtons-" + instance).hide();

    $eXeSeleccionaMedias.updateEvaluationIcon(instance);
    if(mOptions.time == 0 && !mOptions.itinerary.showCodeAccess){
        $eXeSeleccionaMedias.startGame(instance);
    }
    $("#slcmpCheck-" + instance).on("click", function (e) {
      e.preventDefault();
      $eXeSeleccionaMedias.checkQuestion(instance)
    });
    $("#slcmpReboot-" + instance).on("click", function (e) {
        e.preventDefault();
        $("#slcmpMultimedia-" + instance).find(".SLCMP-Card ").removeClass("SLCMP-OK SLCMP-KO SLCMP-Select");
        $("#slcmpCheck-" + instance).show();
        $(this).hide();
        $eXeSeleccionaMedias.showMessage(1,'',instance);
        $eXeSeleccionaMedias.activateHover(instance);
    });
    $('#slcViewMode-' + instance).click(function(e) {
      e.preventDefault();
      $('#slcViewMode-' + instance).find('div.exeQuextIcons').removeClass('exeQuextIcons-ModeMansory exeQuextIcons-ModeTable');
      var $multimediaContainer = $('#slcmpMultimedia-' + instance);
      if ($multimediaContainer.hasClass('SLCMP-ModeTable')) {
          $multimediaContainer.removeClass('SLCMP-ModeTable');
          $eXeSeleccionaMedias.initializeMasonry(instance);
          $('#slcViewMode-' + instance).find('div.exeQuextIcons').addClass('exeQuextIcons-ModeTable');
          mOptions.modeTable= false;
      } else {
          $multimediaContainer.addClass('SLCMP-ModeTable');
          $eXeSeleccionaMedias.destroyMasonry(instance); 
          $('#slcViewMode-' + instance).find('div.exeQuextIcons').addClass('exeQuextIcons-ModeMansory');
          mOptions.modeTable = true;
        }
    });
    $('#slcmpAudioDef-'+instance).on('click', function(e){
        e.preventDefault();
        var sound= mOptions.phrasesGame[mOptions.active].audioDefinition
        $eXeSeleccionaMedias.playSound(sound, instance);
    });
    
  },
  initializeMasonry: function(instance) {
    var $grid = $("#slcmpMainContainer-" + instance).find(".SLCMP-Multimedia");
    $grid.masonry({
      itemSelector: ".SLCMP-GridItem",
      columnWidth: ".SLCMP-GridItem",
      gutter: 10,
    });
    $grid.masonry('reloadItems');
    $grid.masonry('layout');
  },
  destroyMasonry: function(instance) {
      var $grid = $('.SLCMP-Multimedia');
      $grid.masonry('destroy');
  },
  checkAudio: function (card, instance) {
    var audio = $(card).find(".SLCMP-LinkAudio").data("audio");
    if (typeof audio != "undefined" && audio.length > 3) {
      $eXeSeleccionaMedias.playSound(audio, instance);
    }
  },
  nextPhrase: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    $eXeSeleccionaMedias.stopSound(instance);
    setTimeout(function () {
      mOptions.active++;
      if (mOptions.active < mOptions.phrasesGame.length) {
        $eXeSeleccionaMedias.showPhrase(mOptions.active, instance);
        $eXeSeleccionaMedias.activateHover(instance)
      } else {
        $eXeSeleccionaMedias.gameOver(0, instance);
      }
    }, mOptions.timeShowSolution * 1000);

  },
  enterCodeAccess: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    if ( mOptions.itinerary.codeAccess == $("#slcmpCodeAccessE-" + instance).val()) {
      $("#slcmpCodeAccessDiv-" + instance).hide();
      $("#slcmpCubierta-" + instance).hide();
      if(mOptions.time > 0){
        $eXeSeleccionaMedias.startGame(instance)
      }
    } else {
      $("#slcmpMesajeAccesCodeE-" + instance)
        .fadeOut(300)
        .fadeIn(200)
        .fadeOut(300)
        .fadeIn(200);
      $("#slcmpCodeAccessE-" + instance).val("");
    }
  },

  startGame: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    if (mOptions.gameStarted) {
      return;
    }
    mOptions.hits = 0;
    mOptions.errors = 0;
    mOptions.score = 0;
    mOptions.gameActived = true;
    mOptions.counter = mOptions.time * 60;
    mOptions.gameOver = false;
    mOptions.gameStarted = false;
    mOptions.obtainedClue = false;
    mOptions.nattempts = mOptions.attempts > 0 ? mOptions.attempts : 0;
    $('#slcmpQuestion-' + instance).html(mOptions.phrasesGame[0].definition);
    $('#slcmpQuestion-' + instance).show();
    $("#slcmpGameButtons-" + instance).css("display", "flex");
    $("#slcmpGameButtons-" + instance).show();
    $("#slcmpShowClue-" + instance).hide();
    $("#slcmpPHits-" + instance).text(mOptions.hits);
    $("#slcmpPNumber-" + instance).text(mOptions.numberQuestions);
    $("#slcmpPScore-" + instance).text( mOptions.score);
    $("#slcmpPErrors-" + instance).text(mOptions.errors);
    $("#slcmpCubierta-" + instance).hide();
    $("#slcmpGameOver-" + instance).hide();
    $("#slcmpStartGame-" + instance).hide();
    $("#slcmpCheck-" + instance).show();
    if (mOptions.time == 0) {
      $("#slcmpPTime-" + instance).hide();
      $("#slcmpImgTime-" + instance).hide();
    }
    if (mOptions.time > 0) {
      mOptions.counterClock = setInterval(function () {
        if (mOptions.gameStarted) {
          mOptions.counter--;
          if (mOptions.counter <= 0) {
            $eXeSeleccionaMedias.gameOver(2, instance);
            return;
          }
        }
        $eXeSeleccionaMedias.uptateTime(mOptions.counter, instance);
      }, 1000);
      $eXeSeleccionaMedias.uptateTime(mOptions.time * 60, instance);
    }
    if (typeof mOptions.phrase.audioDefinition != "undefined" &&
      mOptions.phrase.audioDefinition.length > 4) {
      $eXeSeleccionaMedias.playSound(mOptions.phrase.audioDefinition, instance);
    }
    mOptions.gameStarted = true;
    $eXeSeleccionaMedias.activateHover(instance)
  },
  uptateTime: function (tiempo, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    if (mOptions.time == 0) return;
    var mTime = $eXeSeleccionaMedias.getTimeToString(tiempo);
    $("#slcmpPTime-" + instance).text(mTime);
  },
  getTimeToString: function (iTime) {
    var mMinutes = parseInt(iTime / 60) % 60;
    var mSeconds = iTime % 60;
    return (
      (mMinutes < 10 ? "0" + mMinutes : mMinutes) +
      ":" +
      (mSeconds < 10 ? "0" + mSeconds : mSeconds)
    );
  },
  gameOver: function (type, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    if (!mOptions.gameStarted) {
      return;
    }
    $eXeSeleccionaMedias.desactivateHover(instance);
    mOptions.gameStarted = false;
    mOptions.gameActived = false;
    mOptions.gameOver = true;
    clearInterval(mOptions.counterClock);
    $eXeSeleccionaMedias.stopSound(instance);
    $("#slcmpCubierta-" + instance).show();
    $eXeSeleccionaMedias.showScoreGame(type, instance);
    $eXeSeleccionaMedias.saveEvaluation(instance);
    if (mOptions.isScorm == 1) {
      if (mOptions.repeatActivity || $eXeSeleccionaMedias.initialScore === "") {
        var score = ((mOptions.hits * 10) / mOptions.phrasesGame.length).toFixed(2);
        $eXeSeleccionaMedias.sendScore(instance, true);
        $("#slcmpRepeatActivity-" + instance).text(mOptions.msgs.msgYouScore + ": " + score);
        $eXeSeleccionaMedias.initialScore = score;
      }
    }
    $eXeSeleccionaMedias.showFeedBack(instance);
    $("#slcmpCodeAccessDiv-" + instance).hide();
  },

  showFeedBack: function (instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
    var puntos = (mOptions.hits * 100) / mOptions.phrasesGame.length;
    if (mOptions.feedBack) {
      if (puntos >= mOptions.percentajeFB) {
        $("#slcmpGameOver-" + instance).hide();
        $("#slcmpDivFeedBack-" + instance)
          .find(".seleccionamedias-feedback-game")
          .show();
        $("#slcmpDivFeedBack-" + instance).show();
      } else {
        $eXeSeleccionaMedias.showMessage(1, mOptions.msgs.msgTryAgain.replace("%s", mOptions.percentajeFB), instance, false);
      }
    }
  },
  isMobile: function () {
    return (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
      navigator.userAgent.match(/Opera Mini/i) ||
      navigator.userAgent.match(/IEMobile/i)
    );
  },

  showScoreGame: function (type, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance],
      msgs = mOptions.msgs,
      $slcmpHistGame = $("#slcmpHistGame-" + instance),
      $slcmpLostGame = $("#slcmpLostGame-" + instance),
      $slcmpOverNumCards = $("#slcmpOverNumCards-" + instance),
      $slcmpOverHits = $("#slcmpOverHits-" + instance),
      $slcmpOverErrors = $("#slcmpOverErrors-" + instance),
      $slcmpOverScore = $("#slcmpOverScore-" + instance),
      $slcmpCubierta = $("#slcmpCubierta-" + instance),
      $slcmpGameOver = $("#slcmpGameOver-" + instance),
      message = "",
      messageColor = 1;
    $slcmpHistGame.hide();
    $slcmpLostGame.hide();
    $slcmpOverNumCards.show();
    $slcmpOverHits.show();
    $slcmpOverErrors.show();
    var mclue = "";
    switch (type) {
      case 0:
        message =  msgs.mgsAllPhrases;
        messageColor = 2;
        $slcmpHistGame.show();
        if (mOptions.itinerary.showClue) {
          var text = mOptions.msgs.msgClue + ' ' + mOptions.itinerary.clueGame;
          if (mOptions.obtainedClue) {
            mclue = text;
          } else {
            mclue = msgs.msgTryAgain.replace(
              "%s",
              mOptions.itinerary.percentageClue
            );
          }
        }
        break;
      case 1:
        messageColor = 3;
        message = msgs.mgsAllPhrases;
        $slcmpLostGame.show();
        if (mOptions.itinerary.showClue) {
          var text = mOptions.msgs.msgClue + ' ' + mOptions.itinerary.clueGame;
          if (mOptions.obtainedClue) {
            mclue = text;
          } else {
            mclue = msgs.msgTryAgain.replace(
              "%s",
              mOptions.itinerary.percentageClue
            );
          }
        }
        break;
      case 2:
        messageColor = 3;
        message = msgs.msgTimeOver;
        $slcmpLostGame.show();
        if (mOptions.itinerary.showClue) {
          var text = mOptions.msgs.msgClue + ' ' + mOptions.itinerary.clueGame;
          if (mOptions.obtainedClue) {
            mclue = text;
          } else {
            mclue = msgs.msgTryAgain.replace(
              "%s",
              mOptions.itinerary.percentageClue
            );
          }
        }
        break;
      case 3:
        messageColor = 3;
        message = msgs.mgsAllPhrases;
        $slcmpLostGame.show();
        if (mOptions.itinerary.showClue) {
          var text = mOptions.msgs.msgClue + ' ' + mOptions.itinerary.clueGame;
          if (mOptions.obtainedClue) {
            mclue = text;
          } else {
            mclue = msgs.msgTryAgain.replace(
              "%s",
              mOptions.itinerary.percentageClue
            );
          }
        }
        break;
      default:
        break;
    }
    $eXeSeleccionaMedias.showMessage(messageColor, message, instance, true);
    $slcmpOverNumCards.html(
      msgs.msgActivities + ": " + mOptions.phrasesGame.length
    );
    $slcmpOverHits.html(msgs.msgHits + ": " + mOptions.hits);
    $slcmpOverErrors.html(msgs.msgErrors + ": " + mOptions.errors);
    $slcmpOverScore.html(msgs.msgScore + ": " + ((mOptions.hits/mOptions.numberQuestions)*10).toFixed(2));
    $slcmpGameOver.show();
    $slcmpCubierta.show();
    $("#slcmpShowClue-" + instance).hide();
    if (mOptions.itinerary.showClue) {
      $eXeSeleccionaMedias.showMessage(3, mclue, instance, true);
    }
  },
  shuffleAds: function (arr) {
    for (
      var j, x, i = arr.length;
      i;
      j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x
    );
    return arr;
  },

  getRetroFeedMessages: function (iHit, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance],
      sMessages = iHit ? mOptions.msgs.msgSuccesses : mOptions.msgs.msgFailures;
    sMessages = sMessages.split("|");
    return sMessages[Math.floor(Math.random() * sMessages.length)];
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
  updateScore: function (correctAnswer, instance) {
    var mOptions = $eXeSeleccionaMedias.options[instance];
      obtainedPoints = 0,
      sscore = 0;
    if (correctAnswer) {
      mOptions.hits++;
      obtainedPoints = 10 / mOptions.phrasesGame.length;
    }else{
      mOptions.errors ++;
    }
    mOptions.score = mOptions.score + obtainedPoints;
    sscore = mOptions.score % 1 == 0 ? mOptions.score : mOptions.score.toFixed(2);
    $("#slcmpPNumber-" + instance).text(mOptions.phrasesGame.length-mOptions.hits -mOptions.errors);
    $("#slcmpPErrors-" + instance).text(mOptions.errors);
    $("#slcmpPScore-" + instance).text(sscore);
    $("#slcmpPHits-" + instance).text(mOptions.hits);
    if((mOptions.score/mOptions.phrasesGame.length) * 100 > mOptions.itinerary.percentageClue){
      mOptions.obtainedClue = true;
    }
    if(mOptions.showSolution){
      $("#slcmpMultimedia-" + instance).find(".SLCMP-GridItem").each(function () {
        var $this = $(this);
        if($this.data("state")){
          $this.addClass('SLCMP-Solutions')
        };
      });
    }
    $eXeSeleccionaMedias.saveEvaluation(instance);
    if ((mOptions.numberQuestions - mOptions.hits - mOptions.errors ) <= 0){
      mOptions.gameActived = false;
      setTimeout(function () {
        $eXeSeleccionaMedias.gameOver(1, instance);
      }, mOptions.timeShowSolution *1000 );
    }else{
       $eXeSeleccionaMedias.nextPhrase(instance);
    }
  },
  getMessageErrorAnswer: function (instance) {
    return $eXeSeleccionaMedias.getRetroFeedMessages(false, instance);
  },
  showMessage: function (type, message, instance, end) {
    var mOptions=$eXeSeleccionaMedias.options[instance],
        colors = [
        "#555555",
        $eXeSeleccionaMedias.borderColors.red,
        $eXeSeleccionaMedias.borderColors.green,
        $eXeSeleccionaMedias.borderColors.blue,
        $eXeSeleccionaMedias.borderColors.yellow,
      ],
      color = colors[type],
      $slcmpMessage = $("#slcmpMessage-" + instance);
    $slcmpMessage.html(message);
    $slcmpMessage.css({
      color: color,
      "font-style": "bold",
    });
    $slcmpMessage.show();
    if(end){
      $slcmpMessage.hide();
      color =1 ;
      if(mOptions.score >= 6){
        color = 2
      }
      $("#slcmpMesasgeEnd-" + instance).html(message);
      $("#slcmpMesasgeEnd-" + instance).css({
        'color': color
      });
      $eXeSeleccionaMedias.showMessage(message);
    }
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
  extractURLGD: function (urlmedia) {
    var sUrl = urlmedia;
    if (
      urlmedia.toLowerCase().indexOf("https://drive.google.com") == 0 &&
      urlmedia.toLowerCase().indexOf("sharing") != -1
    ) {
      sUrl = sUrl.replace(
        /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/.*?\?usp=sharing/g,
        "https://docs.google.com/uc?export=open&id=$1"
      );
    }
    return sUrl;
  },

};
$(function () {
  $eXeSeleccionaMedias.init();
});
