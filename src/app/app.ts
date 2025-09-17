import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Music, Release, Song } from './music';
import { CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly releases = signal<Release[]>([]);
  protected readonly audioPath = signal<string>('');
  protected readonly playlist = signal<Song[]>([]);
  protected readonly currentSong = signal<Song | null>(null);
  @ViewChild('audioPlayer') audioPlayer?: ElementRef<HTMLAudioElement>;

  private readonly baseAudioPath = 'http://localhost:5299/play/';
  constructor(private musicService: Music) {
    toObservable(this.currentSong).subscribe(() => {
      setTimeout(() => {
        if (this.audioPlayer) {
          this.audioPlayer.nativeElement.play()
            .then(() => {})
            .catch(error => console.error('Audio player error', error));
        }
      }, 400);
    });
  }

  ngOnInit(): void {
    this.musicService.getData().subscribe({
      next: (releases) => this.releases.set(releases),
      error: (err) => console.error(err),
    });
  }

  playSong(song: Song) {
    this.playlist.update(() => [song]);
    this.startSong(song);
  }

  playRelease(release: Release) {
    this.playlist.update(() => release.songs);
    this.startSong(release.songs[0]);
  }

  startSong(song: Song) {
    this.currentSong.update(() => song);
    this.audioPath.update(() => `${this.baseAudioPath}${song.fileName}`);
  }

  songEnded() {
    if (this.playlist().length > 1) {
      const songIndex = this.playlist().findIndex(s => s.fileName === this.currentSong()!.fileName);
      if (songIndex !== this.playlist().length - 1) {
        this.startSong(this.playlist()[songIndex + 1]);
      }
    }
  }
}
