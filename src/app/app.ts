import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Music } from './music';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // protected readonly title = signal('dw-homepage');
  protected audioPath = 'http://localhost:5299/weatherforecast';
  constructor(private musicService: Music) {}

  ngOnInit(): void {
    this.musicService.getData().subscribe({
      next: (res) => console.log('music data', res),
      error: (err) => console.error(err),
    });
  }
}
