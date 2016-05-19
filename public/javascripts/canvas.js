
var beginx=0,beginy=0,movex=0,movey=0;
var ismouseDown=false;
var c = document.getElementById("canvas");
var cxt = c.getContext("2d");

var crw, crh, cx, cy, cvw, cvh;
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
this.socket.on('brushChanged', function(brush){
	this.brush = brush;

	cxt.strokeStyle = this.brush.color;	
	cxt.lineWidth = this.brush.width;
})

function mousedown()
{
	beginx = getRealX(event.clientX);
	beginy = getRealY(event.clientY);
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
		movex = getRealX(event.clientX);
		movey = getRealY(event.clientY);
		this.socket.emit('draw', {
			'x': movex,
			'y': movey
		})
	}
	
}
//将当前用户的显示坐标转化为画布中的实际坐标
function initSize() {
	crw = c.width;	//画布的实际宽度
	crh = c.height;	//画布的实际高度
	cx = c.offsetLeft;	//画布起点x值
	cy = c.offsetTop;	//画布起点y值
	cvw = c.offsetWidth;	//画布显示出的宽度
	cvh = c.offsetHeight;	//画布显示出的高度
};
function getRealX(mx) {
	return (mx - cx) / cvw * crw; 
}
function getRealY(my) {
	return (my - cy) / cvh * crh; 
}

this.socket.on('beginDraw', function(point){
	cxt.beginPath();
	cxt.moveTo(point.x, point.y);
});
this.socket.on('draw', function(point){
	cxt.lineTo(point.x, point.y);
	cxt.stroke();
});