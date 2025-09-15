import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Music, Release, Song } from './music';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly releases = signal<Release[]>([]);
  protected readonly audioPath = signal<string>('');

  private readonly baseAudioPath = 'http://localhost:5299/play/';
  constructor(private musicService: Music) {}

  ngOnInit(): void {
    this.musicService.getData().subscribe({
      next: (releases) => this.releases.set(releases),
      error: (err) => console.error(err),
    });
  }

  play(song: Song) {
    this.audioPath.update(() => `${this.baseAudioPath}${song.fileName}`);
  }
}
