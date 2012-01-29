//---------------------------------------------------------------------------
// client.js
//---------------------------------------------------------------------------
// Copyright (C) 2011 Kulikala. All Rights Reserved.
//---------------------------------------------------------------------------

var ws1;
var ws2;
var as1;
var as2;
var url1;
var url2;

( function () {

//---------------------------------------------------------------------------
// Window load event
//---------------------------------------------------------------------------
$( function () {

	$('section.Connect input[type="text"]').val(
		'ws://' + location.hostname + ':' + (location.port || 9081)
	);

	$('section.Connect button').click( function () {
		if (ws1 || ws2) {
			alert('Already connected.');
			return;
		}

                var url = $('#url').val();
                console.log(['url', url]);


                if (window.WebSocket) {
                    ws1 = new WebSocket(url);
                    ws2 = new WebSocket(url);
                }
                if (window.MozWebSocket) {
                    ws1 = new MozWebSocket(url);
                    ws2 = new MozWebSocket(url);
                }
		ws1.binaryType = 'arraybuffer';
		ws2.binaryType = 'arraybuffer';
	});

	$('section.LoadAndPlay button.Play').click( function () {
		var audioResource1 = $('#song1').val();
		if (!as1) {
			as1 = AudioStream.audioPlayer(audioResource1);
			as1.onAudioData( function (event) {
				var sendData = event.audioData;
				ws1 && ws1.send(sendData);
			});
		}
		as1.play();

		var audioResource2 = $('#song2').val();
                if (!as2) {
			as2 = AudioStream.audioPlayer(audioResource2);
			as2.onAudioData( function (event) {
				var sendData = event.audioData;
				ws2 && ws2.send(sendData);
			});
		}
                as2.play();

		log('LoadAndPlay', 'Start playing the audio and sending frame buffer...');
	});

	$('section.LoadAndPlay button.Stop').click( function () {
		if (! (as1 || as2) ) {
			return;
		}
		as1.pause();
                as2.pause();

		log('LoadAndPlay', 'Stopped.');
	});

	$('section.ReceiveAndPlay button.Start').click( function () {
		if (! (ws1 || ws2) ) {
			return;
		}

		if (! (as1 || as2) ) {
			as1 = new AudioStream();
                        as2 = new AudioStream();
		}

		ws1.onmessage = function (event) {
			as1.setAudioData(event.data);
		};

		ws2.onmessage = function (event) {
			as2.setAudioData(event.data);
		};

		log('ReceiveAndPlay', 'Start waiting...');
	});

	$('section.ReceiveAndPlay button.Stop').click( function () {
		if (! (ws1 || ws2)) {
			return;
		}

		ws1.onmessage = null;
                ws2.onmessage = null;

		log('ReceiveAndPlay', 'Stopped.');
	});
});


//---------------------------------------------------------------------------
// Utility
//---------------------------------------------------------------------------
var log = function (context, message) {
	$('section.' + context + ' div.Status').append( (new Date()) + ' : ' + message + '<br/>' );
};


//---------------------------------------------------------------------------
// End
//---------------------------------------------------------------------------

})();
