
var beginx=0,beginy=0,movex=0,movey=0;
var ismouseDown=false;
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
//画笔
var brush = {
	"color": "#000000",
	"width": "1"
}

function changeColor()//改变颜色
{
	brush.color = form.value;
	brushChanged();
}
function changeThickness()//改变笔触粗细
{
	brush.width = thick.value;
	brushChanged();
}
function useEraser()//使用橡皮
{
	brush.width = rubber.value;
	brush.color = "white";
	brushChanged();
}

function brushChanged() {
	this.socket.emit('brushChanged', brush);
}
// function setCxtBrush() {
// 	//重设画笔
// 	cxt.strokeStyle = this.brush.color;	
// 	cxt.lineWidth = this.brush.width;
// 	console.log(cxt.strokeStyle+ " " +cxt.lineWidth);
// }
this.socket.on('brushChanged', function(brush){
	this.brush = brush;

	cxt.strokeStyle = this.brush.color;	
	cxt.lineWidth = this.brush.width;
})

function mousedown()
{
	beginx=event.clientX;//获取当前鼠标坐标
	beginy=event.clientY-100;
	cxt.beginPath();
	cxt.moveTo(beginx,beginy);
	ismouseDown=true;

	this.socket.emit('beginDraw', {
		'x': beginx,
		'y': beginy
	})
	
}
function mouseup()
{
	ismouseDown=false;
}
function mousemove()
{	
	if(ismouseDown==true)
	{
		movex=event.clientX;
		movey=event.clientY-100;
		cxt.lineTo(movex,movey);
		cxt.stroke();

		this.socket.emit('draw', {
			'x': movex,
			'y': movey
		})
	}
	
}
this.socket.on('beginDraw', function(point){
	cxt.beginPath();
	cxt.moveTo(point.x, point.y);
})
this.socket.on('draw', function(point){
	cxt.lineTo(point.x, point.y);
	cxt.stroke();
})