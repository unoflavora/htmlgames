// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  this.words = [
    {
      key: 'building',
      setXY: {
        x: 100,
        y: 240
      },
      spanish: 'edificio'
    },
    { 
      key: 'house',
      setXY: {
        x:240,
        y:280
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
      spanish: 'casa'
    },
    {
      key:'car',
      setXY: {
        x: 400,
        y: 300
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
      spanish: 'automovil'
    },
    {
      key: 'tree',
      setXY: {
        x: 550,
        y: 250
      },
      spanish: 'arbol'
    }
  ]
}

// load asset files for our game
gameScene.preload = function() {
  this.load.image('background', 'assets/images/background-city.png')
  this.load.image('car', 'assets/images/car.png')
  this.load.image('building', 'assets/images/building.png')
  this.load.image('house', 'assets/images/house.png')
  this.load.image('tree', 'assets/images/tree.png')

  this.load.audio('treeAudio', 'assets/audio/arbol.mp3')
  this.load.audio('carAudio', 'assets/audio/auto.mp3')
  this.load.audio('houseAudio', 'assets/audio/casa.mp3')
  this.load.audio('buildingAudio', 'assets/audio/edificio.mp3')
  this.load.audio('correct', 'assets/audio/correct.mp3')
  this.load.audio('wrong', 'assets/audio/wrong.mp3')
  

};

// executed once, after assets were loaded
gameScene.create = function() {
  this.add.sprite(0,0,'background').setOrigin(0,0)

  this.items = this.add.group(this.words)

  let items = this.items.getChildren()

  items.forEach((item, index) => {
    item.setInteractive()
    console.log(this.words[index])

    this.words[index].sound = this.sound.add(this.words[index].key + 'Audio')

    //creating tween
    item.resizeTween = this.tweens.add({
      targets: item,
      scaleX: 1.25,
      scaleY: 1.25,
      duration: 500,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut'
    })

    item.alphaTween = this.tweens.add({
      targets: item,
      alpha: 0.7,
      duration: 400,
      paused: true
    })

    item.wrongTween = this.tweens.add({
      targets: item,
      scaleX: 1.25,
      scaleY: 1.25,
      duration: 500,
      angle: 90,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut'
    })

    item.on('pointerdown', function(pointer) {
      item.resizeTween.restart()
      if(this.checkAnswer(this.words[index].spanish)) {
        item.resizeTween.restart()
        this.showNextQuestion()
      } else {
        item.wrongTween.restart()
      }
    }, this)

    item.on('pointerover', function() {
      item.alphaTween.restart()
    }, this)

    item.on('pointerout', function() {
      item.alphaTween.stop()
      item.alpha = 1
    }, this)
  })

  this.wordText = this.add.text(30,20, 'Hello', {
    font: '24px Open Sans',
    fill: '#ffffff'
  })

  this.showNextQuestion()


};


gameScene.showNextQuestion = function(){
  //select a random word
  this.nextItem = Phaser.Math.RND.pick(this.words)
  this.nextItem.sound.play()  
  console.log(this.nextItem)
  this.wordText.setText(this.nextItem.spanish)
}

gameScene.checkAnswer = function(userResponse) {
  console.log(this.nextItem.spanish, userResponse)
  if(this.nextItem.spanish === userResponse) {
    this.sound.add('correct').play()
    return true
  } else {
    this.sound.add('wrong').play()
    return false
  }
}

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Spanish Learning Game',
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);