import { DifficultyLevel } from '../enums/difficulty-level.enum';

export const GameModeConfigConst = {
  [DifficultyLevel.Easy]: {
    difficultyLevel: DifficultyLevel.Easy,
    time: 180
  },
  [DifficultyLevel.Medium]: {
    difficultyLevel: DifficultyLevel.Medium,
    time: 120
  },
  [DifficultyLevel.Hard]: {
      difficultyLevel: DifficultyLevel.Hard,
      time: 60
  }
}
