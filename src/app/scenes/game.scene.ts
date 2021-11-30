import Phaser from 'phaser';
import { Key } from '../shared/enums/key.enum';
import { BootComponent } from '../boot/boot.component';
import { interval } from 'rxjs';
import { filter, map } from 'rxjs/operators';

let context: BootComponent

export abstract class GameScene extends Phaser.Scene {
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  ground!: Phaser.Physics.Arcade.StaticGroup;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  stars!: Phaser.Physics.Arcade.Group;
  score: number = 0;
  scoreText!: Phaser.GameObjects.Text;
  gameTime!: Phaser.GameObjects.Text;
  gameOver = false;
  bombs!: Phaser.Physics.Arcade.Group;

  constructor() {
    super({key: 'game'});
  }

  create(): void {
    console.log('create method');
    this.add.image(400, 300, 'background');

    this.generatePlatforms();
    this.generatePlayer();
    this.generatePlayerAnimation();
    this.generateStars();
    this.bombs = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, 'wynik: 0', {
      fontSize: '32px',
      fill: '#000000'
    } as Phaser.Types.GameObjects.Text.TextStyle);
    this.gameTime = this.add.text(605, 16, 'czas: 0s', {
      fontSize: '32px',
      fill: '#000000'
    } as Phaser.Types.GameObjects.Text.TextStyle);

    interval(1000).pipe(
      filter(() => !this.gameOver),
      map(sec => sec++)
    ).subscribe(res => {
      this.gameTime.setText(`czas: ${context.stateService.chosenGameConfig.getValue()?.time - res}s`);

      if (res >= context.stateService.chosenGameConfig.getValue()?.time) {
        this.scene.start('endGame');
        this.gameOver = true;
      }
    })

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.stars, this.ground);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.bombs, this.ground);
    // @ts-ignore
    this.physics.add.overlap(this.player, this.stars, (player, star) => this.collectStar(player, star), null, this);
    // @ts-ignore
    this.physics.add.collider(this.player, this.bombs, (player, bomb) => this.hitBomb(player, bomb), null, this);
  }


  preload(): void {
    this.load.image('background', 'assets/sky.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
  }

  update(): void {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play(Key.Left, true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play(Key.Right, true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  generatePlatforms(): void {
    this.platforms = this.physics.add.staticGroup();
    this.ground = this.physics.add.staticGroup();

    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(750, 220, 'platform');

    this.ground.create(400, 568, 'ground').setScale(2).refreshBody();

  }

  generatePlayer(): void {
    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
  }

  generatePlayerAnimation(): void {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{key: 'dude', frame: 4}],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
      frameRate: 10,
      repeat: -1
    });
  }

  generateStars(): void {
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {x: 12, y: 0, stepX: 70}
    });

    this.stars.children.iterate((child: any) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
  }

  collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite): void {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('wynik: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child: any) => {
        child.enableBody(true, child.x, 0, true, true);
      });

      const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      const bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
  }

  hitBomb(player: Phaser.Physics.Arcade.Sprite, bomb: Phaser.Physics.Arcade.Sprite): void {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.gameOver = true;

    context.stateService.lastGameScore.next(this.score);
    this.scene.start('endGame');
  }
}

export const makeGameScene = (ctx: any) => {
  context = ctx;
  return GameScene;
}
