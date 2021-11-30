import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { MenuScene } from '../scenes/menu.scene';
import { makeGameScene } from '../scenes/game.scene';
import { makeModeScene } from '../scenes/mode.scene';
import { makeRankingScene } from '../scenes/ranking.scene';
import { RankingService } from '../shared/services/ranking.service';
import { makeEndGameScene } from '../scenes/end-game.scene';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-boot',
  templateUrl: './boot.component.html',
  styleUrls: ['./boot.component.scss']
})
export class BootComponent implements OnInit {
  phaserGame: Phaser.Game | undefined;
  config: Phaser.Types.Core.GameConfig;

  constructor(
    readonly rankingService: RankingService,
    readonly stateService: StateService
  ) {
    this.config = {
      type: Phaser.AUTO,
      height: 600,
      width: 800,
      scene: [MenuScene, makeGameScene(this), makeModeScene(this), makeRankingScene(this), makeEndGameScene(this)],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 300}
        }
      }
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }

  initialized() {
    console.log('Boot Scene initialized!');
  }
}

