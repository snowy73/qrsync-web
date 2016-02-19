$(document).ready(function () {
	var URLpattern = new RegExp('^https?:\/\/.*');

	//$('#send').hide();
	$('#sendForm').submit(function (e) {
		e.preventDefault();
		var data = $('#data').val();
		if (data.length > 0) {
			socket.emit('send', data);
			$('#data').val('').focus();
		}
	});

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
		$('#qrcode').hide();
		$('#send').show();
	});
	socket.on('data', function (data) {
		if (URLpattern.test(data)) {
			data = '<a href="'+data+'" target="_blank">'+data+'</a>'
		}
		$("#history").prepend($('<li>').html(data));
	});
	socket.on('fail', function (data) {
		console.log('ERR: ' + data);
	});
	socket.on('disconnect', function () {
		window.location.reload();
	});
	window.onbeforeunload = function (e) {
		socket.disconnect();
	}
});
