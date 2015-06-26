angular
  .module('whiteboard')
  .directive('draw', draw);

function draw() {
    var directive = {
      restrict: "A",
      link: link
    }

    return directive;

    function link(scope, element) {
        var socket = io();

        var ctx = element[0].getContext('2d');
        ctx.canvas.width = 1000;
        ctx.canvas.height = 1000;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var drawing = false;

        var lastX;
        var lastY;

        var COLORS = ['#001f3f', 
                      '#0074D9', 
                      '#7FDBFF', 
                      '#39CCCC', 
                      '#3D9970', 
                      '#2ECC40', 
                      '#01FF70', 
                      '#FFDC00', 
                      '#FF851B',
                      '#FF4136', 
                      '#85144b', 
                      '#F012BE', 
                      '#B10DC9', 
                      '#111111',
                      '#AAAAAA',
                      '#DDDDDD'];

        var color = getColor();
        var sessionId = getSessionId();

        element.bind('mousedown', function(event){
            if(event.offsetX!==undefined){
                lastX = event.offsetX;
                lastY = event.offsetY;
            } else { // Firefox compatibility
                lastX = event.layerX - event.currentTarget.offsetLeft;
                lastY = event.layerY - event.currentTarget.offsetTop;
            }

            drawing = true;   
        });
        element.bind('mousemove', function(event){
            if(drawing){
                if(event.offsetX!==undefined){
                    currentX = event.offsetX;
                    currentY = event.offsetY;
                } else {
                    currentX = event.layerX - event.currentTarget.offsetLeft;
                    currentY = event.layerY - event.currentTarget.offsetTop;
                }

                draw(lastX, lastY, currentX, currentY, color);
                emitDrawing(lastX, lastY, currentX, currentY);

                lastX = currentX;
                lastY = currentY;
            }
        });
        element.bind('mouseup', function(event){

            drawing = false;
        }); 

        socket.on('draw', function(msg) {
            receive(msg);
        });

        function receive(msg){
            draw(msg.lastX, msg.lastY, msg.currentX, msg.currentY, msg.color)
        }

        function draw(lX, lY, cX, cY, color){
            ctx.beginPath();
            ctx.moveTo(lX,lY);
            ctx.lineTo(cX,cY);
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.closePath();
        }

        function emitDrawing(lX, lY, cX, cY) {
            var drawObj = {
                lastX: lX,
                lastY: lY,
                currentX: cX,
                currentY: cY,
                color: color,
                sessionId: sessionId
            }

            socket.emit('draw', drawObj);
        }

        function getColor() {
            return COLORS[getRandomInt(0, COLORS.length-1)];

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }    
        }

        function getSessionId() {
            return socket.json.id;
        }

        function reset(){
            element[0].width = element[0].width; 
        }
    }
}