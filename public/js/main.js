$(document).ready(function () {
	$('#send').hide();
	$('#sendForm').submit(function (e) {
		e.preventDefault();
		var data = $('#data').val();
		if (data.length > 0) {
			socket.emit('send', data);
			$('#data').val('').focus();
		}
	});

	var socket = io('//:8443');
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
		setCookie("token", data, 30);
	});
	socket.on('pair', function () {
		console.log('PAIRED');
		$('#qrcode').hide();
		$('#send').show();
	});
	socket.on('data', function (data) {
		data = escapeHtml(data);
		data = extractLinks(data);
		$("#history").prepend($('<li>').html(data));
	});
	socket.on('fail', function (data) {
		alert('ERROR: ' + data);
	});
	socket.on('disconnect', function () {
		window.location.reload();
	});
	window.onbeforeunload = function (e) {
		socket.disconnect();
	}
	
	socket.emit('try-remember', getCookie("token"));
});
