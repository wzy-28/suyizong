UI.showCover = function() {
  document.getElementById("app").innerHTML = '<div class="cover-screen" id="cover"><h1 class="title">测试通过</h1><p class="subtitle">覆盖机制正常</p><button class="menu-btn" onclick="UI.showMainMenu()">开始游戏</button></div>';
  var cb = document.getElementById("continue-btn");
  if(cb && !Save.hasSave()) { cb.style.opacity = "0.4"; cb.style.pointerEvents = "none"; }
};
