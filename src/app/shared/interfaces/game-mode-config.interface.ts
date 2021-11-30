import { DifficultyLevel } from '../enums/difficulty-level.enum';

export interface GameModeConfig {
  difficultyLevel: DifficultyLevel;
  time: number;
}
