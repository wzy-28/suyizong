const Portrait = {
  presets: {
    face: [
      {name:"圆脸",draw:(ctx,w,h,s)=>{ctx.fillStyle=s;ctx.beginPath();ctx.ellipse(w/2,h*0.38,w*0.16,h*0.22,0,0,Math.PI*2);ctx.fill()}},
      {name:"瓜子脸",draw:(ctx,w,h,s)=>{ctx.fillStyle=s;ctx.beginPath();ctx.moveTo(w/2-w*0.14,h*0.2);ctx.quadraticCurveTo(w/2-w*0.18,h*0.38,w/2-w*0.1,h*0.58);ctx.quadraticCurveTo(w/2,h*0.62,w/2+w*0.1,h*0.58);ctx.quadraticCurveTo(w/2+w*0.18,h*0.38,w/2+w*0.14,h*0.2);ctx.closePath();ctx.fill()}},
      {name:"方脸",draw:(ctx,w,h,s)=>{ctx.fillStyle=s;ctx.fillRect(w/2-w*0.14,h*0.18,w*0.28,h*0.38)}},
      {name:"鹅蛋脸",draw:(ctx,w,h,s)=>{ctx.fillStyle=s;ctx.beginPath();ctx.ellipse(w/2,h*0.38,w*0.14,h*0.24,0,0,Math.PI*2);ctx.fill()}}
    ],
    hair: [
      {name:"束发",draw:(ctx,w,h)=>{ctx.fillStyle="#1a1a1a";ctx.beginPath();ctx.ellipse(w/2,h*0.24,w*0.16,h*0.08,0,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(w/2-w*0.14,h*0.24,w*0.04,h*0.12);ctx.fillRect(w/2+w*0.1,h*0.24,w*0.04,h*0.12)}},
      {name:"披肩",draw:(ctx,w,h)=>{ctx.fillStyle="#1a1a1a";ctx.beginPath();ctx.ellipse(w/2,h*0.22,w*0.18,h*0.1,0,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(w/2-w*0.18,h*0.22,w*0.06,h*0.2);ctx.fillRect(w/2+w*0.12,h*0.22,w*0.06,h*0.2)}},
      {name:"发髻",draw:(ctx,w,h)=>{ctx.fillStyle="#1a1a1a";ctx.beginPath();ctx.arc(w/2,h*0.22,w*0.12,0,Math.PI*2);ctx.fill();ctx.fillRect(w/2-w*0.14,h*0.22,w*0.04,h*0.14);ctx.fillRect(w/2+w*0.1,h*0.22,w*0.04,h*0.14)}},
      {name:"双髻",draw:(ctx,w,h)=>{ctx.fillStyle="#1a1a1a";ctx.beginPath();ctx.arc(w/2-w*0.08,h*0.22,w*0.07,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w/2+w*0.08,h*0.22,w*0.07,0,Math.PI*2);ctx.fill()}}
    ],
    eyes: [
      {name:"丹凤眼",draw:(ctx,w,h)=>{ctx.fillStyle="#222";ctx.beginPath();ctx.ellipse(w/2-22,h*0.36,7,4,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(w/2+22,h*0.36,7,4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(w/2-20,h*0.35,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w/2+24,h*0.35,2.5,0,Math.PI*2);ctx.fill()}},
      {name:"圆眼",draw:(ctx,w,h)=>{ctx.fillStyle="#222";ctx.beginPath();ctx.arc(w/2-22,h*0.36,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w/2+22,h*0.36,6,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(w/2-20,h*0.35,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w/2+24,h*0.35,3,0,Math.PI*2);ctx.fill()}},
      {name:"桃花眼",draw:(ctx,w,h)=>{ctx.fillStyle="#222";ctx.beginPath();ctx.ellipse(w/2-22,h*0.36,8,5,-0.1,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(w/2+22,h*0.36,8,5,0.1,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(w/2-20,h*0.35,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(w/2+24,h*0.35,3,0,Math.PI*2);ctx.fill()}}
    ],
    skin: [{name:"白皙",color:"#f5e6d3"},{name:"自然",color:"#e8c9a0"},{name:"古铜",color:"#c4956a"},{name:"黝黑",color:"#8b6f47"}],
    outfit: [
      {name:"官服（红）",draw:(ctx,w,h,s)=>{ctx.fillStyle="#8b1a1a";ctx.beginPath();ctx.moveTo(w/2-50,h*0.52);ctx.lineTo(w/2+50,h*0.52);ctx.lineTo(w/2+55,h);ctx.lineTo(w/2-55,h);ctx.closePath();ctx.fill()}},
      {name:"官服（蓝）",draw:(ctx,w,h,s)=>{ctx.fillStyle="#1a3a6b";ctx.beginPath();ctx.moveTo(w/2-50,h*0.52);ctx.lineTo(w/2+50,h*0.52);ctx.lineTo(w/2+55,h);ctx.lineTo(w/2-55,h);ctx.closePath();ctx.fill()}},
      {name:"便服（青）",draw:(ctx,w,h,s)=>{ctx.fillStyle="#2a4a3a";ctx.beginPath();ctx.moveTo(w/2-50,h*0.52);ctx.lineTo(w/2+50,h*0.52);ctx.lineTo(w/2+55,h);ctx.lineTo(w/2-55,h);ctx.closePath();ctx.fill()}}
    ]
  },
  render(canvas,features,gender){
    const ctx=canvas.getContext("2d");const w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);const sc=(this.presets.skin[features.skin]||{}).color||"#e8c9a0";
    ctx.fillStyle="#12121a";ctx.fillRect(0,0,w,h);
    (this.presets.outfit[features.outfit]||{}).draw?.(ctx,w,h,sc);
    ctx.fillStyle=sc;ctx.fillRect(w/2-15,h*0.52,30,40);
    (this.presets.face[features.face]||{}).draw?.(ctx,w,h,sc);
    (this.presets.eyes[features.eyes]||{}).draw?.(ctx,w,h,sc);
    ctx.strokeStyle="#1a1a1a";ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(w/2-32,h*0.32);ctx.quadraticCurveTo(w/2-22,h*0.28,w/2-12,h*0.32);ctx.stroke();
    ctx.beginPath();ctx.moveTo(w/2+12,h*0.32);ctx.quadraticCurveTo(w/2+22,h*0.28,w/2+32,h*0.32);ctx.stroke();
    ctx.strokeStyle="#8b4444";ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(w/2,h*0.45,8,0.1,Math.PI-0.1);ctx.stroke();
    (this.presets.hair[features.hair]||{}).draw?.(ctx,w,h,sc);
    ctx.fillStyle="#1a1a1a";ctx.beginPath();ctx.ellipse(w/2,h*0.24,w*0.12,10,0,0,Math.PI*2);ctx.fill()
  }
};

window.Portrait=Portrait;
