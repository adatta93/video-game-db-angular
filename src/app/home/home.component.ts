import { APIResponse } from './../models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { Game } from '../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sort: string = 'metacritic';
  games: Array<Game> = [];
  routeSub: Subscription = new Subscription();
  gameSub: Subscription = new Subscription();
  searchingGame: boolean = false;

  constructor(
    private service: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('metacrit', params['game-search']);
      } else {
        this.searchGames('metacrit');
      }
    });
  }

  searchGames(sort: string, search?: string): void {
    this.searchingGame = true;
    this.gameSub = this.service
      .getGameList(sort, search)
      .subscribe((gameList: APIResponse<Game>) => {
        this.games = gameList.results;
        console.log(gameList);
        this.searchingGame = false;
      });
  }

  openGameDetails(gameID: string): void {
    this.router.navigate(['details', gameID]);
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
