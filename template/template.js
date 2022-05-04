var canvas, g;
var characterPosX, characterPosY, characterImage, characterR;
var speed, acceleration;
var enemyPosX, enemyPosY, enemyImage, enemySpeed, enemyR;
var score;

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
  characterR = 16;
  characterImage = new Image();
  characterImage.src = "./reimu.png";
  speed = 0;
  acceleration = 0;

  enemyPosX = 600;
  enemyPosY = 400;
  enemyR = 16;
  enemyImage = new Image();
  enemyImage.src = "./marisa.png";
  enemySpeed = 5;

  // スコア初期化
  score = 0;
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
  // 自キャラの状態更新
  speed = speed + acceleration;
  characterPosY = characterPosY + speed;
  if (characterPosY > 400) {
    characterPosY = 400;
    speed = 0;
    acceleration = 0;
  }

  // 敵キャラの状態更新
  enemyPosX -= enemySpeed;
  if (enemyPosX < -100) {
    enemyPosX = 600;
    score += 100;
  }

  // 当たり判定
  var diffX = characterPosX - enemyPosX;
  var diffY = characterPosY - enemyPosY;
  var distance = Math.sqrt(diffX * diffX + diffY * diffY);
  if (distance < characterR + enemyR) {
    enemySpeed = 0;
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
  g.drawImage(
    enemyImage,
    enemyPosX - enemyImage.width / 2,
    enemyPosY - enemyImage.height / 2
  );

  // スコア描画
  g.fillStyle = "rgb(255,255,255)";
  g.font = "16pt Arial";
  var scoreLabel = "SCORE : " + score;
  var scoreLabelWidth = g.measureText(scoreLabel).width;
  g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);
}
