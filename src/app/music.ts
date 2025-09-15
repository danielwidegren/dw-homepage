import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Music {
  private baseUrl = 'http://localhost:5299';

  constructor(private http: HttpClient) {}

  getData(): Observable<Release[]> {
    return this.http.get(`${this.baseUrl}/songs`).pipe(
      map((data: any) => {
        if (!this.isValidData(data)) {
          console.error('Invalid music data received.');
          return [];
        } else {
          return this.mapSongsToReleases(data.data);
        }
      })
    );
  }

  private isValidData(data: any) {
    return ('data' in data) && Array.isArray(data.data);
  }

  private mapSongsToReleases(songs: any[]) {
    return songs.reduce((result, song) => {
      let release = result.find((r: Release) => r.name === song.release);
      if (!release) {
        release = new Release(song.release, song.artist);
        result.push(release);
      }
      release.songs.push(new Song(song.name, song.information, song.fileName, song.trackNumber));
      release.songs.sort((a: Song, b: Song) => a.trackNumber - b.trackNumber);
      return result;
    }, []);
  }
}

export class Release {
  constructor(
    public name: string,
    public artist: string,
    public songs: Song[] = [],
  ) {}
}

export class Song {
  constructor(
    public name: string,
    public information: string,
    public fileName: string,
    public trackNumber: number,
  ) {}
}