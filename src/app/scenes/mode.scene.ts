import Phaser from 'phaser';
import { BootComponent } from '../boot/boot.component';
import { GameModeConfigConst } from '../shared/consts/game-mode-config.const';
import { DifficultyLevel } from '../shared/enums/difficulty-level.enum';

let context: BootComponent;

export abstract class ModeScene extends Phaser.Scene {
  playerText: any;

  constructor() {
    super({key: 'mode'});
  }

  create(): void {
    if (context) {
      context.initialized();
    }

    this.add.image(400, 300, 'background');
    this.add.text(150, 50, 'Wybierz poziom trudności:', {fontSize: 36} as any).setTint(0x062E35);

    const easyButton = this.add.text(this.cameras.main.centerX, 150 + 50, 'Łatwy')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({backgroundColor: '#111'})
      .setInteractive({useHandCursor: true})
      .on('pointerover', () => easyButton.setStyle({fill: '#f39c12'}))
      .on('pointerout', () => easyButton.setStyle({fill: '#FFF'}));

    const mediumButton = this.add.text(this.cameras.main.centerX, 200 + 50, 'Średni')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({backgroundColor: '#111'})
      .setInteractive({useHandCursor: true})
      .on('pointerover', () => mediumButton.setStyle({fill: '#f39c12'}))
      .on('pointerout', () => mediumButton.setStyle({fill: '#FFF'}));

    const hardButton = this.add.text(this.cameras.main.centerX, 250 + 50, 'Trudny')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({backgroundColor: '#111'})
      .setInteractive({useHandCursor: true})
      .on('pointerover', () => hardButton.setStyle({fill: '#f39c12'}))
      .on('pointerout', () => hardButton.setStyle({fill: '#FFF'}));

    easyButton.setInteractive().on('pointerdown', () => {
      context.stateService.chosenGameConfig.next(GameModeConfigConst[DifficultyLevel.Easy])
      this.scene.start('game');
    });

    mediumButton.setInteractive().on('pointerdown', () => {
      context.stateService.chosenGameConfig.next(GameModeConfigConst[DifficultyLevel.Medium])
      this.scene.start('game');
    });

    hardButton.setInteractive().on('pointerdown', () => {
      context.stateService.chosenGameConfig.next(GameModeConfigConst[DifficultyLevel.Hard])
      this.scene.start('game');
    });
  }

  preload(): void {
    this.load.image('background', 'assets/menu-background.png');
  }
}

export const makeModeScene = (ctx: BootComponent) => {
  context = ctx;
  return ModeScene;
}
