import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameModeConfig } from '../interfaces/game-mode-config.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  lastGameScore = new BehaviorSubject(0);
  chosenGameConfig = new BehaviorSubject<GameModeConfig>({} as any);
}
