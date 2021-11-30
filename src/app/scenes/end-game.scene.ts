import Phaser from 'phaser';
import { BootComponent } from '../boot/boot.component';
import ENTER = Phaser.Input.Keyboard.KeyCodes.ENTER;

let context: BootComponent;

export abstract class EndGameScene extends Phaser.Scene {
  constructor() {
    super({key: 'endGame'});
  }

  create(): void {
    if (context) {
      context.initialized();
    }
    this.add.image(400, 300, 'background');
    this.add.text(280, 50, 'Koniec gry!', {fontSize: 36, fontFamily: 'Courier'} as any).setTint(0x062E35);
    this.add.text(300, 100, 'Twój wynik: ', {fontSize: 24, fontFamily: 'Courier'} as any).setTint(0x062E35);
    this.add.text(470, 100, String(context.stateService.lastGameScore.getValue()), {fontSize: 24} as any).setTint(0x062E35);

    this.add.text(10, 150, 'Wpisz swój nick:', {fontSize: 24, fontFamily: 'Courier'} as any).setTint(0x062E35);
    const textEntry = this.add.text(250, 150, '', {fontSize: 24, fontFamily: 'Courier'} as any).setTint(0x062E35);

    const nextButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Koniec')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => nextButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => nextButton.setStyle({ fill: '#FFF' }));

    nextButton.setInteractive().on('pointerdown', () => {
      context.rankingService.addGameToRanking({
        name: textEntry.text,
        score: context.stateService.lastGameScore.getValue()
      })
      this.scene.start('main');
    });


    this.input.keyboard.on('keydown', (event: any) => {

      if (event.keyCode === 8 && textEntry.text.length > 0) {
        textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
      } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
        textEntry.text += event.key;
      }

      if (event.keyCode === ENTER) {
        context.rankingService.addGameToRanking({
          name: textEntry.text,
          score: context.stateService.lastGameScore.getValue()
        })
        this.scene.start('main');
      }
    });
  }

  preload(): void {
    this.load.image('background', 'assets/menu-background.png');
  }
}

export const makeEndGameScene = (ctx: BootComponent) => {
  context = ctx;
  return EndGameScene;
}
