import { Injectable } from '@angular/core';
import { Ranking } from '../interfaces/ranking.interface';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  getRankingData(): Ranking[] {
    return JSON.parse(localStorage.getItem("ranking") as string);
  }

  addGameToRanking(data: Ranking): void {
    const ranking: Ranking[] = JSON.parse(localStorage.getItem("ranking") as string) || [];
    ranking.push({name: data.name, score: data.score});

    localStorage.setItem("ranking", JSON.stringify(ranking));
  }
}
