import { HttpService } from './../http.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Game } from './../models';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  gameRating: number = 0;
  gameID: string = '';
  game: Game = {} as Game;
  routeSub: Subscription = new Subscription();
  gameSub: Subscription = new Subscription();
  loadingGameDetail: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameID = params['id'];
      this.getGameDetails(this.gameID);
    });
  }

  getGameDetails(gameID: string): void {
    this.loadingGameDetail = true;
    this.gameSub = this.httpService.getGameDetails(gameID).subscribe(
      (gameRes: Game) => {
        this.game = gameRes;
        this.loadingGameDetail = false;

        setTimeout(() => {
          this.gameRating = this.game.metacritic;
        }, 1000);
      },
      (err) => {
        if (err.status === 404) {
        }
        this.loadingGameDetail = false;
      }
    );
  }

  getColor(value: number): string {
    if (value > 75) {
      return '#5ee432';
    } else if (value > 50) {
      return '#fffa50';
    } else if (value > 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }
  }
}
