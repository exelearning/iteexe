/**
 * This script contains embed functions for common plugins. This scripts are complety free to use for any purpose.
 */

function writeFlash(p) {
	writeEmbed(
		'D27CDB6E-AE6D-11cf-96B8-444553540000',
		'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
		'application/x-shockwave-flash',
		p
	);
}

function writeMP3(p) {
// Note that writeEmbed passes on additional attributes for MP3 as well...
        // indicate that this Flash is specifically an mp3player with:
        p.id = "mp3player";
	writeEmbed(
		'D27CDB6E-AE6D-11cf-96B8-444553540000',
		'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0',
		'application/x-shockwave-flash',
		p
	);
}

function writeFlowPlayer(p) {
// Note that writeEmbed will pass on additional attributes for FlowPlayer as well...
        // indicate that this Flash is specifically an FLV flowplayer with:
	// no classid or codebase!
        p.id = "flowplayer";
	// and do set the object's data to the initial eXe templates directory: 
	p.data="../templates/flowPlayer.swf"; 
	// at least until these flashvars are built into options an the FLV's appearance tab, 
	// continue to hardcode the same parameters that were in use with the old 
	// Flash Movie iDevice: 
	p.flashvars="config={ autoPlay: false, loop: false, initialScale: 'scale', " 
	    + "showLoopButton: false, showPlayListButtons: false, playList: [ { " 
	    + "url: '" + pl.src + "' }, ]}";
	writeEmbed(
		'',
		'',
		'application/x-shockwave-flash',
		p
	);
}

function writeShockWave(p) {
	writeEmbed(
	'166B1BCA-3F9C-11CF-8075-444553540000',
	'http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=8,5,1,0',
	'application/x-director',
		p
	);
}

function writeQuickTime(p) {
	writeEmbed(
		'02BF25D5-8C17-4B23-BC80-D3488ABDDC6B',
		'http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0',
		'video/quicktime',
		p
	);
}

function writeRealMedia(p) {
	writeEmbed(
		'CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA',
		'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0',
		'audio/x-pn-realaudio-plugin',
		p
	);
}

function writeWindowsMedia(p) {
	p.url = p.src;
	writeEmbed(
		'6BF52A52-394A-11D3-B153-00C04F79FAA6',
		'http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701',
		// eXe WMP hack:
		'video/x-ms-wmv',
		p
	);
}

function writeEmbed(cls, cb, mt, p) {
	var h = '', n;

        if (mt == 'video/x-ms-wmv') {
	    // eXe WMP hack:
	    h += ' type="' + mt + '" data="' + p.src + '"';
            h += ' codebase="' + cb + '"';
        } 
	else if (mt == 'application/x-shockwave-flash'
                 && p.id == 'flowplayer') {
            // embedded FLV player - no classid or codebase:
            h += ' type="' + mt + '"';
            h += ' data="' + p.data + '"';
        }
        else {
	    h += ' classid="clsid:' + cls + '"';
            h += ' codebase="' + cb + '"';
        }

	h += typeof(p.id) != "undefined" ? 'id="' + p.id + '"' : '';
	h += typeof(p.name) != "undefined" ? 'name="' + p.name + '"' : '';
	h += typeof(p.width) != "undefined" ? 'width="' + p.width + '"' : '';
	h += typeof(p.height) != "undefined" ? 'height="' + p.height + '"' : '';
	h += typeof(p.align) != "undefined" ? 'align="' + p.align + '"' : '';
	h += '>';

	for (n in p)
		h += '<param name="' + n + '" value="' + p[n] + '">';

        // MP3 hack for eXe:
	// putting this AFTER all of the above p[], to ensure that it will FOLLOW
	// the p.src attribute, for easier parsing within eXe.
        if (mt == 'application/x-shockwave-flash' && p.id == 'mp3player') {
		if (typeof(p.exe_mp3) == "undefined") {
                	// want to include the actual source name in this parm, 
                	// to confirm to eXe the source to which it applies:
                	h += '<param name="exe_mp3" value="' + p.src + '" />';
		}
        }
        // FLV hack for eXe:
	// likwise, putting this AFTER all of the above p[], to ensure that it will FOLLOW
	// the p.src attribute, for easier parsing within eXe.
        if (mt == 'application/x-shockwave-flash' && p.id == 'flowplayer') {
		if (typeof(p.exe_flv) == "undefined") {
                	// want to include the actual source name in this parm, 
                	// to confirm to eXe the source to which it applies:
                	h += '<param name="exe_flv" value="' + p.src + '" />';
		}
        }

	h += '<embed type="' + mt + '"';

	for (n in p)
		h += n + '="' + p[n] + '" ';

	h += '></embed></object>';

	document.write(h);
}
