var canvas, g;
var characterPosX, characterPosY, characterImage;
var speed, acceleration;

onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function init() {
  characterPosX = 100;
  characterPosY = 400;
  characterImage = new Image();
  characterImage.src = "./reimu.png";
  speed = 0;
  acceleration = 0;
}

function keydown(e) {
  speed = -20;
  acceleration = 1.5;
}

function gameloop() {
  update();
  draw();
}

function update() {
  speed = speed + acceleration;
  characterPosY = characterPosY + speed;
  if (characterPosY > 400) {
    characterPosY = 400;
    speed = 0;
    acceleration = 0;
  }
}

function draw() {
  // 背景描画
  g.fillStyle = "rgb(0,0,0)";
  g.fillRect(0, 0, 480, 480);

  // キャラクター描画
  g.drawImage(
    characterImage,
    characterPosX - characterImage.width / 2,
    characterPosY - characterImage.height / 2
  );

  // 敵キャラクター描画
  g,drawImage(
    enemyImage,
    enemyPosX - enemyImage.width / 2,
    enemyPosY - enemyImage.height / 2
  );
}
