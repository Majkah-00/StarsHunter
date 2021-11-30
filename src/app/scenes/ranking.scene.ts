import Phaser from 'phaser';
import { Ranking } from '../shared/interfaces/ranking.interface';
import { BootComponent } from '../boot/boot.component';

let context: BootComponent;

export abstract class RankingScene extends Phaser.Scene {
  playerText: any;

  constructor() {
    super({key: 'ranking'});
  }

  create(): void {
    if (context) {
      context.initialized();
    }

    this.add.image(400, 300, 'background');
    this.add.text(300, 50, 'Ranking', {fontSize: 36} as any).setTint(0x062E35);

    context.rankingService.getRankingData()
      .sort((obj1: Ranking, obj2: Ranking) => obj2.score - obj1.score)
      .slice(0, 5)
      .forEach((rankingRecord: Ranking, index: number) => {
        this.add.text(310, 120 + (50 * index), `${rankingRecord.name} \t ${rankingRecord.score}`,).setTint(0x062E35);
      })

    const backButton = this.add.text(this.cameras.main.centerX - 25, this.cameras.main.centerY + 100, 'Back to Menu')
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => backButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => backButton.setStyle({ fill: '#FFF' }));

    backButton.setInteractive().on('pointerdown', () => {
      this.scene.start('main');
    });
  }

  preload(): void {
    this.load.image('background', 'assets/menu-background.png');
  }
}

export const makeRankingScene = (ctx: BootComponent) => {
  context = ctx;
  return RankingScene;
}
