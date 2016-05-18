var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var users = {};
var usersCount = 0;

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

//WebSocket连接监听
io.on('connection', function(socket) {

  console.log("有一个新连接");
  //打印握手信息
  // console.log(socket.handshake);

  //登录
  socket.on('login', function(user){
    //将user.id设置为socket.name
    socket.name = user.id;

    users[user.id] = user.name;
    usersCount++;
    console.log("用户数："+usersCount);

    io.emit('login', {
      user: user.name,
      allUser: users,
    });
  });

  //退出
  socket.on('disconnect', function(){
    if(users.hasOwnProperty(socket.name)){
      var username = users[socket.name];
      delete users[socket.name];
      usersCount--;
      io.emit('logout', {
        user: username,
        allUser: users,
      })
      console.log("用户数："+usersCount);
    }
  });

  //接收消息
  socket.on('message', function(mess) {
    //广播给所有用户
    io.emit('message', mess);
  });

  socket.on('beginDraw', function(p){
    io.emit('beginDraw', p);
  });
  socket.on('draw', function(p) {
    io.emit('draw', p);
  });
  socket.on('brushChanged', function(brush){
    io.emit('brushChanged', brush);
  });
});

server.listen(app.get('port'), function() {
  console.log("Chat程序开始监听端口："+app.get('port'));
});
routes(app, __dirname);
module.exports = app;
