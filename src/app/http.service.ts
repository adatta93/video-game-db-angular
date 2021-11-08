import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../environments/environment';
import { forkJoin, Observable } from 'rxjs';
import { APIResponse, Game } from './models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);
    if (search) {
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }
    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params: params,
    });
  }

  getGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get<Game>(`${env.BASE_URL}/games/${id}`);
    const gameTrailerRequest = this.http.get<Game>(
      `${env.BASE_URL}/games/${id}/movies`
    );
    const gameScreenshotsRequest = this.http.get<Game>(
      `${env.BASE_URL}/games/${id}/screenshots`
    );
    return forkJoin({
      gameInfoRequest,
      gameTrailerRequest,
      gameScreenshotsRequest,
    }).pipe(
      map((resp: any) => {
        return {
          ...resp['gameInfoRequest'],
          trailers: resp['gameTrailerRequest']?.results,
          screenshots: resp['gameScreenshotsRequest']?.results,
        };
      })
    );
  }
}
