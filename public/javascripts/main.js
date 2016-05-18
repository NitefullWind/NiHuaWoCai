var d = document;
var username = getUsername();

(function() {
	//连接websocket后端服务器
	this.socket = io.connect('http://localhost:3000');
	
	//告诉服务器username登录
	socket.emit('login', {
		id: new Date().getTime()+""+Math.floor(Math.random()*899+100),
		name: username
	});

	socket.on('login', function(obj) {

		showUserList(obj.allUser);

		showMessage('系统提示', obj.user+" 登录了");
	});
	socket.on('logout', function(obj) {

		showUserList(obj.allUser);
		showMessage('系统提示', obj.user+" 退出了");
	});
	socket.on('message', function(obj) {
		showMessage(obj.user, obj.content);
	});	


	//点击回车发送消息
	d.getElementById('content').onkeydown = function(e) {
		e = e || event;
		if(e.keyCode === 13) {
			sendMsg();
		}
	};
})();

//发送消息
function sendMsg() {
	var content = d.getElementById('content').value;
	var mess = {
		user: username,
		content: content,
		// time: new Date().toLocaleString()
	}
	this.socket.emit('message', mess);
	d.getElementById('content').value = "";
};

//获取cookie中username
function getUsername() {
	if(d.cookie.length>0) {
		var start = d.cookie.indexOf('username=');
		if(start!=-1) {
			start = start + 'username='.length;
			var end = d.cookie.indexOf(';', start);
			if(end==-1) end = d.cookie.length;
			//decodeURI防止中文乱码
			return decodeURI(d.cookie.substring(start, end));
		}
	}
	return "";
};

function showUserList(userList) {
	//清空原数据
	var usl = d.getElementById('usersList');
	usl.innerHTML = "";

	//将所有用户输出
	for(key in userList) {
		var li = d.createElement('li');
		li.innerHTML = userList[key];
		usl.appendChild(li);
	}
}

function showMessage(user, content) {
	var msl = d.getElementById('messageList');

	var li = d.createElement('li');
	li.innerHTML = new Date().toLocaleTimeString()+"<label style='color:#ff0000'> "+user +" : </label> " + content;
	msl.appendChild(li);
}