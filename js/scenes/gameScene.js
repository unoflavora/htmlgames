// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  this.stats = {
    health: 100,
    fun: 100
  }

  this.decay = {
    health: 5,
    fun: 10
  }
};


// executed once, after assets were loaded
gameScene.create = function() {
  let bg = this.add.sprite(0,0,'backyard').setOrigin(0,0).setInteractive()
  bg.on('pointerdown', this.placeItem, this)

  this.pet = this.add.sprite(100,200, 'pet', 0).setInteractive().setDepth(1)

  //make pet draggable
  this.input.setDraggable(this.pet)
  this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX
    gameObject.y = dragY
  })  

  this.createUi()
  this.createHud()
  this.refreshHud()

  this.timedEventStats = this.time.addEvent({
    delay: 1000,
    repeat: -1,
    callback: () => {
      this.updateStats({health: -this.decay.health, fun: -this.decay.fun})
    }
  })
};

gameScene.createHud = function() {
  this.healthText = this.add.text(20,20, 'Health: ', {
    font: '24px Arial',
    fill: '#ffffff'
  })

  this.funText = this.add.text(150, 20, 'Fun: ', {
    font: '24px Arial',
    fill: '#ffffff'
  })
}

gameScene.refreshHud = function() {
  this.healthText.setText('Health: ' + this.stats.health)
  this.funText.setText('Fun: ' + this.stats.fun)
}

gameScene.createUi = function() {
    //buttons
    this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive()
    this.appleBtn.customStats = { health: 20, fun: 0}

    this.appleBtn.on('pointerdown', this.pickItem) 

    this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive()
    this.candyBtn.customStats = { health: -10, fun: 10}
    this.candyBtn.on('pointerdown', this.pickItem) 


    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive()
    this.toyBtn.customStats = { health: 0, fun: 15}
    this.toyBtn.on('pointerdown', this.pickItem) 

    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive()
    this.rotateBtn.customStats = { health: 0, fun: 10 }
    this.rotateBtn.on('pointerdown', this.rotatePet) 

    //array of items
    this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn]
    
    //rotate pet tween
    this.pet.rotateTween = this.add.tween({
      targets: this.pet,
      duration: 1000,
      angle: 360,
      paused: true,
      onComplete: () => {
        this.updateStats(this.rotateBtn.customStats)
        this.refreshHud()
        this.uiReady()
      }
    })

    //restart
    this.uiBlocked = false
    this.uiReady()

}

gameScene.rotatePet = function() {
  if(this.scene.uiBlocked) return

  this.scene.uiBlocked = true
  this.scene.pet.rotateTween.restart()
  
}

gameScene.pickItem = function() {
  if(this.scene.uiBlocked) return //use scene to access gameScene
  this.scene.selectedItem = this;
  this.alpha = 0.5
}

gameScene.placeItem = function(pointer, localX, localY) {

  if (!this.selectedItem) return
  if (this.uiBlocked) return

  let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key)
  
  this.petTween = this.tweens.add({
    targets: this.pet,
    duration: 500,
    x: localX,
    y: localY,
    paused: false,
    onComplete: (tween, sprites) => {
      newItem.destroy()

      this.pet.on('animationcomplete', () => {
        this.pet.setFrame(0)
        this.uiReady()
      })

      this.pet.play('funnyfaces')

    }
  })

  this.updateStats(this.selectedItem.customStats)

  this.refreshHud()
  this.uiReady()
}


gameScene.updateStats = function(arg) {
  let gameOver = false

  if(this.stats.health <= 0 || this.stats.fun <= 0) {
    this.stats.health = 0 
    this.stats.fun = 0
    gameOver = true 
  }

  if(!gameOver) {
    this.stats.health += arg.health
    this.stats.fun += arg.fun
    this.refreshHud()
  }
  
  if(gameOver) this.gameOver()
}

gameScene.gameOver = function() {
  this.UiBlocked = true
  this.pet.setFrame(4)

  this.time.addEvent({
    delay: 2000,
    repeat: 0,
    callback: () => {
      this.scene.start('Home')
    }
  })
}

gameScene.uiReady = function() {
  this.selectedItem = null
  this.buttons.forEach(button => {
    button.alpha = 1
  })
  this.uiBlocked = false
}