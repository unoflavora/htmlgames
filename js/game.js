//membuat scene
//where all actions take place
let gameScene = new Phaser.Scene('Game')

gameScene.init = function() {
  this.playerSpeed = 3
  this.enemyMinSpeed = 1
  this.enemyMaxSpeed = 4

  //batasan gerak enemy sprite
  this.enemyMinY = 80
  this.enemyMaxY = 280

  //apakah game berakhir?
  this.isTerminating = false
}

//load assets
gameScene.preload = function() {
  //menambahkan background
  this.load.image('background', 'assets/background.png')
  this.load.image('player', 'assets/player.png')
  this.load.image('enemy', 'assets/dragon.png')
  this.load.image('goal', 'assets/treasure.png')
}

gameScene.create = function() {
  this.bg = this.add.sprite(0,0, 'background')
  this.bg.setOrigin(0,0)

  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player')
  this.player.setScale(0.5)

  this.goal = this.add.sprite(this.sys.game.config.width - 80,  this.sys.game.config.height / 2, 'goal')
  this.goal.setScale(0.6)


  this.enemies = this.add.group({
    key: 'enemy',
    repeat: 3,
    setXY: {
      x: 120,
      y: 100,
      stepX: 120,
      stepY: 20
    }
  })
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4)
  
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
    //set flip
    enemy.flipX = true
    let dir = Math.random() < 0.5 ? 1 : -1
    let speed = Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed) + this.enemyMinSpeed
    enemy.speed = dir * speed
  }, this)
}

//run 60fps
gameScene.update = function() {
  //memastikan bahwa fungsi gameOver hanya dieksekusi sekali
  if(this.isTerminating) return;

  //cek input
  if(this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed
  }

  let playerRect = this.player.getBounds()
  let treasureRect = this.goal.getBounds()
  
  //treasure overlap
  if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    this.scene.restart()
    return
  }

  let enemies = this.enemies.getChildren()

  enemies.forEach(enemy => {
    
    //pergerakan enemy
    enemy.y += enemy.speed

    if(enemy.y >= this.enemyMaxY || enemy.y <= this.enemyMinY) {
      enemy.speed *= -1
    }

    let enemyRect = enemy.getBounds()

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)){
      return this.gameOver()
    }

  })
}

gameScene.gameOver = function() {
  this.isTerminating = true

  this.cameras.main.shake(500)
  this.cameras.main.on('camerashakecomplete', (camera, effect) => {
    this.cameras.main.fade(500)
    this.cameras.main.on('camerafadeoutcomplete', (camera, effect) => {
      this.scene.restart()
    })
  })
}

//konfigurasi game
let config = {
  type: Phaser.AUTO, //WebGL if available, canvas is not
  width: 640,
  height: 360,
  scene: gameScene
}

//membuat game dengan konfigurasi di atas
let game = new Phaser.Game(config)