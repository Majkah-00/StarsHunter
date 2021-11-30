import Phaser from 'phaser';

export abstract class MenuScene extends Phaser.Scene {
  constructor() {
    super({key: 'main'});
  }

  create(): void {
    this.add.image(400, 300, 'background');
    this.add.image(this.cameras.main.centerX, 150, 'logo');

    const playButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start game')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => playButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => playButton.setStyle({ fill: '#FFF' }));

    playButton.setInteractive().on('pointerdown', () => {
      this.scene.start('mode');
    });

    const rankingButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Ranking')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => rankingButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => rankingButton.setStyle({ fill: '#FFF' }));

    rankingButton.setInteractive().on('pointerdown', () => {
      this.scene.start('ranking');
    });
  }

  preload(): void {
    this.load.image('background', 'assets/menu-background.png');
    this.load.image('logo', 'assets/logo.png');
  }
}
