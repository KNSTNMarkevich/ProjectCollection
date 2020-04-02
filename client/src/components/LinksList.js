import React, {useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/auth.context'
import {useHistory} from 'react-router-dom'

export const LinksList = ( {links} ) => {
  const history = useHistory();
  const {request} = useHttp();
  const {token} = useContext(AuthContext);
    if (!links.length) {
        return <p className="center"><strong>У вас пока нет заметок</strong></p>
    }
    var shapes=[];

     function CreateNodes() {
        let canvas = document.getElementById('Canvas01');
        let ctx = canvas.getContext('2d');
        canvas.style.border='2px solid purple';
        var cw=canvas.width;
        var ch=canvas.height;
        ctx.font = '10pt Verdana';
        let maxWidth = 200;
        let lineHeight = 16;
            let y,x;
            let defY = 90;
      links.map((link) => {
          x = link.x;
          y = link.y;
            let words = link.text.split(' ');
            let line = ``;
            for(let n = 0; n < words.length; n++) {
              let testLine = line + words[n] + ' ';
              let metrics = ctx.measureText(testLine);
              let testWidth = metrics.width;
              if (testWidth > maxWidth && n > 0) {
                line = line.replace(/\W*\s(\S)*$/, '...')
              }
              else {
                line = testLine;
              }
            }
            let heightR = defY + lineHeight;
              shapes.push( {x:x-10, y:y-30, width:maxWidth+5, height:heightR-30, colorR: link.color, text: line, xT:x, yT:y, colorT: 'black', idnote: link._id} );
        });
        drawAll();
      var offsetX,offsetY;
      reOffset();
      window.onscroll=function(e){ reOffset(); }
      window.onresize=function(e){ reOffset(); }
      canvas.onresize=function(e){ reOffset(); }
      var isDragging=false;
      var startX,startY;
      var selectedShapeIndex;
      canvas.onmousedown=handleMouseDown;
      canvas.onmousemove=handleMouseMove;
      canvas.onmouseup=handleMouseUp;
      canvas.onmouseout=handleMouseOut;
    function reOffset(){
      var BB=canvas.getBoundingClientRect();
      offsetX=BB.left;
      offsetY=BB.top;        
}

function isMouseInShape(mx,my,shape){
  var rLeft=shape.x;
  var rRight=shape.x+shape.width;
  var rTop=shape.y;
  var rBott=shape.y+shape.height;
  var rLeftT=shape.xT;
  var rTopT=shape.yT;
  if( mx>rLeft && mx<rRight && my>rTop && my<rBott && mx>rLeftT && my>rTopT){
      return(true);
  }
return(false);
}

function handleMouseDown(e){
    e.preventDefault();
    e.stopPropagation();
    startX=parseInt(e.clientX-offsetX);
    startY=parseInt(e.clientY-offsetY);
    for(var i=0;i<shapes.length;i++){
    if(isMouseInShape(startX,startY,shapes[i])){
    selectedShapeIndex=i;
    isDragging=true;
    return;
      }
    }
}

function handleMouseUp(e){
    if(!isDragging){return;}
    e.preventDefault();
    e.stopPropagation();
    isDragging=false;
}

  function handleMouseOut(e){
    if(!isDragging){return;}
    e.preventDefault();
    e.stopPropagation();
    isDragging=false;
  }

function handleMouseMove(e){
    if(!isDragging){return;}
    e.preventDefault();
    e.stopPropagation();        
    var mouseX=parseInt(e.clientX-offsetX);
    var mouseY=parseInt(e.clientY-offsetY);
    var dx=mouseX-startX;
    var dy=mouseY-startY;
    var selectedShape=shapes[selectedShapeIndex];
    selectedShape.x+=dx;
    selectedShape.y+=dy;
    selectedShape.xT+=dx;
    selectedShape.yT+=dy;
    drawAll();
    startX=mouseX;
    startY=mouseY;
}

function drawAll(){
    ctx.clearRect(0,0,cw,ch);
    for(var i=0;i<shapes.length;i++){
    var shape=shapes[i];
    ctx.fillStyle=shape.colorR;
    ctx.fillRect(shape.x,shape.y,shape.width,shape.height);
    ctx.fillStyle=shape.colorT;
    ctx.fillText(`${shape.text}`, shape.xT, shape.yT);
    }
}
     } 

     const saveNode = async event => {
       let notes = [];
       for (let i = 0; i < shapes.length; i++) {
        notes.push({ id: shapes[i].idnote, x: shapes[i].x, y: shapes[i].y })
      }
      try {
          await request('/api/link/updateXY', 'POST', {note: notes}, {
              Authorization: `Bearer ${token}`
          });
          //history.push('/links');
      } catch (e) {} 
      
     }

     const canvasDoubleClick = (e) => {
      let canvas = document.getElementById('Canvas01');
      var offsetX,offsetY;
      reOffset();
      window.onscroll=function(e){ reOffset(); }
      window.onresize=function(e){ reOffset(); }
      canvas.onresize=function(e){ reOffset(); }
      var startX,startY;
    function reOffset(){
      var BB=canvas.getBoundingClientRect();
      offsetX=BB.left;
      offsetY=BB.top;        
}
function isMouseInShape(mx,my,shape){
  var rLeft=shape.x;
  var rRight=shape.x+shape.width;
  var rTop=shape.y;
  var rBott=shape.y+shape.height;
  var rLeftT=shape.xT;
  var rTopT=shape.yT;
  if( mx>rLeft && mx<rRight && my>rTop && my<rBott && mx>rLeftT && my>rTopT){
      return(true);
  }
return(false);
}
        e.preventDefault();
        e.stopPropagation();
        startX=parseInt(e.clientX-offsetX);
        startY=parseInt(e.clientY-offsetY);
        for(var i=0;i<shapes.length;i++){
        if(isMouseInShape(startX,startY,shapes[i])){
        history.push(`/detail/${shapes[i].idnote}`);
        return;
        }
    }
     }

    return (
      <>
        <div className="right">
            <a className="waves-effect waves-light btn"
            onClick={CreateNodes}
            >Показать мои заметки</a>
        </div>
        <div className="right">
            <a className="waves-effect waves-light btn"
            onClick={saveNode}
            //href ="/links"
            >Сохранить положение заметок</a>
        </div>
        <div className='center'>
          <p className='note'><strong>Для редактирования заметки кликните на нее два раза!</strong></p>
        </div>
        <div>
        <canvas width="1300" height="680" id = "Canvas01"
        onDoubleClick={canvasDoubleClick}
        ></canvas> 
        </div>
        </>
    )
}