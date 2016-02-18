$(document).ready(function () {
	var socket = io('//:8000');
	socket.on('qr', function (data) {
		$('#qrcode').html('');
		var qrcode = new QRCode('qrcode', {
				text : data,
				width : 256,
				height : 256,
				colorDark : '#000000',
				colorLight : '#ffffff',
				correctLevel : QRCode.CorrectLevel.H
			});
	});
	socket.on('pair', function () {
		console.log('PAIRED');
	});
	socket.on('data', function (data) {
		console.log('DATA: ' + data);
	});
	socket.on('fail', function (data) {
		console.log('ERR: ' + data);
	});
	socket.on('disconnect', function () {
		// TODO: notify user about disconnection, disable form
		console.log('DISCONNECTED');
	});
	window.onbeforeunload = function (e) {
		socket.disconnect();
	}
});
