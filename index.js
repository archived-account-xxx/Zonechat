var http = require('http'),
    connected = 0
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    // index = fs.readFileSync(__dirname + '/client/index.html');
    console.log("working")

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    // res.end(index);
    fs.createReadStream("client/index.html").pipe(res)
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 10000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    connected = connected + 1
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
    socket.on("disconnect",() => {
      connected = connected - 1
    })
    socket.on("message",(data)=>{
      console.log(data)
      io.local.emit("message",data)
    })
});
//Every 1 minute log how many people are connected
// setInterval(function(){
//   console.log(`${connected} people connected!`)
// },60000)
app.listen(3000);