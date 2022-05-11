var canvas, g;
// var characterPosX, characterPosY, characterImage, characterR;
// var speed, acceleration;
// var enemyPosX, enemyPosY, enemyImage, enemySpeed, enemyR;
var player, enemy, particles, moon, castle;
var score;
var scene;
var frameCount;
var bound;
var next;

// シーンの定義
const Scenes = {
  GameMain: "GameMain",
  GameOver: "GameOver",
};

onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  document.onkeyup = keyup;
  document.onmousedown = keydown;
  document.onmouseup = keyup;
  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function init() {
  // 自キャラ初期化
  // player = new Sprite();
  // player.posx = 100;
  // player.posy = 400;
  // player.r = 16;
  // player.image = new Image();
  // player.image.src = "./reimu.png";
  // player.speed = 0;
  // player.acceleration = 0;
  player = new Player(100, 400, 16, ".reimu.png", 0, 0);

  // 敵キャラ初期化
  // enemy = new Sprite();
  // enemy.posx = 600;
  // enemy.posy = 400;
  // enemy.r = 16;
  // enemy.image = new Image();
  // enemy.image.src = "./marisa.png";
  // enemy.speed = 5;
  // enemy.acceleration = 0;
  enemy = [];
  next = 10;

  // 月
  moon = new Sprite();
  moon.posx = 100;
  moon.posy = 100;
  moon.image = new Image();
  moon.image.src = "./moon.png"

  // 城
  castle = new Sprite();
  castle.posx = 400;
  castle.posy = 296;
  castle.image = new Image();
  castle.image.src = "./castle.png";

  // ゲーム管理データの初期化
  score = 0;
  frameCount = 0;
  bound = false;
  scene = Scenes.GameMain;

  // パーティクル初期化
  particles = [];
}

var isKeyDown = false;
function keydown(e) {
  // ゲームプレイ中
  if (scene == Scenes.GameMain) {
    if (player.speed == 0 && !isKeyDown) {
      player.speed = -18;
      player.acceleration = 1.0;
    }
    // ゲームオーバー中
  } else if (scene == Scenes.GameOver) {
    if (frameCount > 60) {
      init();
    }
  }
  isKeyDown = true;
}

function keyup(e) {
  if (player.speed < 0) {
    player.acceleration = 2.5;
  }
  isKeyDown = false;
}

function gameloop() {
  update();
  draw();
}

function update() {
  // ゲームプレイ中
  if (scene == Scenes.GameMain) {
    // 自キャラの状態更新
    player.update();

    // 敵キャラの状態更新
    // enemy.posx -= enemy.speed;
    // if (enemy.posx < -100) {
    //   enemy.posx = 600;
    //   score += 100;
    // }
    enemy.forEach((e) => {
      e.update();
      // 端に到達できたスコア増加
      if (e.posx < -100)  {
        score += 100;
      }
    });

    // 端に到達した敵キャラを除外
    enemy = enemy.filter((e) => e.posx >= -100);

    // 敵キャラ生成
    if (frameCount == next) {
      generateNextEnemy();
    }

    // 当たり判定
    hitCheck();

    // ゲームオーバー中
  } else if (scene == Scenes.GameOver) {  
    // 自キャラの状態更新
    // player.speed = player.speed + player.acceleration;
    // player.posy = player.posy + player.speed;
    
    // if (player.posx < 20 || player.posx > 460) {
    //   bound = !bound;
    // }
    // if (bound) {
    //   player.posx = player.posx + 30;
    // } else {
    //   player.posx = player.posx - 30;
    // }

    // パーティクルの状態更新
    particles.forEach((p) => {
      p.update();
    });

    // 敵キャラの状態更新
    enemy.forEach((e) => {
      e.update();
    });
  }

  // 背景の城の位置を動かす
  castle.posx -= 0.25;
  if (castle.posx < -100) castle.posx = 560;

  // 現在何フレーム目かをカウント
  frameCount++;
}

function draw() {
  g.imageSmoothingEnabled = false;

  // ゲームプレイ中
  if (scene == Scenes.GameMain) {

    // 背景描画
    drawBack(g);

    // キャラクター描画
    // g.drawImage(
    //   player.image,
    //   player.posx - player.image.width / 2,
    //   player.posy - player.image.height / 2
    // );
    player.draw(g);

    // 敵キャラクター描画
    // g.drawImage(
    //   enemy.image,
    //   enemy.posx - enemy.image.width / 2,
    //   enemy.posy - enemy.image.height / 2
    // );
    enemy.forEach((e) => {
      e.draw(g);
    });

    // スコア描画
    drawScore(g);

    // ゲームオーバー中
  } else if (scene == Scenes.GameOver) {

    // 背景描画
    drawBack(g);
    
    // キャラクター描画
    // if (frameCount < 120) {
    //   g.save();
    //   g.translate(player.posx, player.posy);
    //   g.rotate(((frameCount % 30) * Math.PI * 2) / 30);
    //   g.drawImage(
    //     player.image,
    //     -player.image.width / 2,
    //     -player.image.height / 2,
    //     player.image.width + frameCount,
    //     player.image.height + frameCount
    //   );
    //   g.restore();
    // }

    // パーティクル描画
    particles.forEach((p) => {
      p.draw(g);
    });

    // 敵キャラクター描画
    //  g.drawImage(
    //   enemy.image,
    //   enemy.posx - enemy.image.width / 2,
    //   enemy.posy - enemy.image.height / 2
    // );
    enemy.forEach((e) => {
      e.draw(g);
    });

    // スコア描画
    drawScore(g);

    // ゲームオーバー表示
    drawGameOver(g);
  }
}

// 当たり判定
function hitCheck() {
  enemy.forEach((e) => {
    var diffX = player.posx - enemy.posx;
    var diffY = player.posy - enemy.posy;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if (distance < player.r + enemy.r) {
      // 当たった時の処理
      scene = Scenes.GameOver;
      // player.speed = -20;
      // player.acceleration = 0.5;
      frameCount = 0;
  
      // パーティクル生成
      for (var i = 0; i < 300; i ++) {
        particles.push(new Particle(player.posx, player.posy))
      }
    }
  })
}

// 敵キャラ生成
function generateNextEnemy() {
  var newEnemy = new Enemy(
    600,
    400 - (Math.random() < 0.5 ? 0 : 50),
    12,
    "./marisa.png",
    4 + 5 * Math.random(),
    0
  );
  enemy.push(newEnemy);
  next = Math.floor(frameCount + 30 + 80 * Math.random());
}

// 背景の描画
function drawBack(g) {
  var interval = 16;
  var ratio = 5;
  var center = 240;
  var baseLine = 360;
  // 画面を黒く塗りつぶして初期化する
  g.fillStyle = "rgb(0,0,0)";
  g.fillRect(0, 0, 480, 480);
  // 月と城を描画する
  moon.draw(g);
  castle.draw(g);
  // 地面のラインアート
  for (var i = 0; i < 480 / interval + 1; i++) {
    var x1 = i * interval - (frameCount % interval);
    var x2 = center + (x1 - center) * ratio;
    g.strokeStyle = "#98660b";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(x1, baseLine);
    g.lineTo(x2, 480);
    g.stroke();
  }
}

// スコア描画
function drawScore(g) {
  g.fillStyle = "rgb(255,255,255)";
  g.font = "16pt Arial";
  var scoreLabel = "SCORE : " + score;
  var scoreLabelWidth = g.measureText(scoreLabel).width;
  g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);
}

// ゲームオーバー表示
function drawGameOver(g) {
  g.fillStyle = "rgb(255,255,255)";
  g.font = "48pt Arial";
  var scoreLabel = "GAME OVER";
  var scoreLabelWidth = g.measureText(scoreLabel).width;
  g.fillText(scoreLabel, 240 - scoreLabelWidth / 2, 220);
}

// スプレイトクラス
class Sprite {
  image = null;
  posx = 0;
  posy = 0;
  speed = 0;
  acceleration = 0;
  r = 0;

  // コンストラクタ
  constructor() {}

  // 状態更新
  update() {}

  // 描画処理
  draw(g) {
    // 画像を描画する
    g.drawImage(
      this.image,
      this.posx - this.image.width / 2,
      this.posy - this.image.height / 2
    );
  }
}

// パーティクルクラス
class Particle extends Sprite {
  baseLine = 0;
  // acceleration = 0;
  speedy = 0;
  speedx = 0;

  constructor(x, y) {
    super();
    this.posx = x;
    this.posy = y;
    this.baseLine = 420;
    this.acceleration = 0.5;
    var angle = (Math.PI * 5) / 4 + (Math.PI / 2) * Math.random();
    this.speed = 5 + Math.random() * 20;
    this.speedx = this.speed * Math.cos(angle);
    this.speedy = this.speed * Math.sin(angle);
    this.r = 2;
  }

  update() {
    this.speedx *= 0.97;
    this.speedy += this.acceleration;
    this.posx += this.speedx;
    this.posy += this.speedy;
    if (this.posy > this.baseLine) {
      this.posy = this.baseLine;
      this.speedy = this.speedy * -1 * (Math.random() * 0.5 + 0.3);
    }
  }

  draw(g) {
    g.fillStyle = "rgb(255,50,50)";
    g.fillRect(this.posx - this.r, this.posy - this.r, this.r * 2, this.r * 2);
  }
}

// プレイヤークラス
class Player extends Sprite {
  baseLine = 400;

  constructor(posx, posy, r, imageUrl, speed, acceleration) {
    super();
    this.posx = posx;
    this.posy = posy;
    this.r = r;
    this.image = new Image();
    this.image.src = imageUrl;
    this.speed = speed;
    this.acceleration = acceleration;
  }

  update()  {
    // 敵キャラの状態更新
    this.speed = this.speed + this.acceleration;
    this.posy = this.posy + this.speed;
    if (this.posy > this.baseLine) {
      this.posy = this.baseLine;
      this.speed = 0;
      this.acceleration = 0;
    }
  }
}

// エネミークラス
class Enemy extends Sprite {
  constructor(posx, posy, r, imageUrl, speed, acceleration) {
    super();
    this.posx = posx;
    this.posy = posy;
    this.r = r;
    this.image = new Image();
    this.image.src = imageUrl;
    this.speed = speed;
    this.acceleration = acceleration;
  }

  update()  {
    // 敵キャラの状態更新
    this.posx -= this.speed;
  }
}