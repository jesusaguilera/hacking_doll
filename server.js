var http = require('http'),
		firmata = require('firmata');

var board = new firmata.Board('/dev/tty.usbmodemfa131', function(err){
	
	console.log('connected!');
	console.log('Firmware: ' + board.firmware.name + '\n');

	init();

});

function init(){

	board.pinMode(13,board.MODES.OUTPUT);
	board.digitalWrite(13,0);

	board.pinMode(9,board.MODES.SERVO);
	board.servoWrite(9,0);
	
	server();

}

function server(){

	server = http.createServer(function(req,res){
		
		if (req.url === '/doll_hacked_on') {
			res.writeHead(200,{'Content-type':'text/html; charset=utf-8'});
			res.write('<h1 style="font-size:60px;font-family:Helvetica,Arial,sans-serif;text-align:center;">Hello Doll!!!</h1>\n');
			res.end();

			board.digitalWrite(13,1);
			servoMot('init');
		}
		
		if (req.url === '/doll_hacked_off') {
			res.writeHead(200,{'Content-type':'text/html; charset=utf-8'});
			res.write('<h1 style="font-size:60px;font-family:Helvetica,Arial,sans-serif;text-align:center;">Bye bye Doll!!!</h1>\n');
			res.end();
			
			board.digitalWrite(13,0);
			servoMot('stop');
	}

	});

	server.listen(3000);
	
};


function servoMot(flag){

	var degrees = 10;
	var incrementer = 10;

	if(flag === 'init'){

		time = setInterval(function(){
			if(degrees >= 180 || degrees === 0){
				incrementer *= -1;
			}
			degrees += incrementer;
			board.servoWrite(9,degrees);
		},500);

	}

	if(flag === 'stop'){

		clearInterval(time);
		board.servoWrite(9,degrees);

	}

}
