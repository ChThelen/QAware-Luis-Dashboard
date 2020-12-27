import { Component, OnInit } from '@angular/core';

const darkThemeStyleSheet = document.styleSheets[2];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  darkThemeIsActive = false;

  ngOnInit(): void {
    darkThemeStyleSheet.disabled = !this.darkThemeIsActive;
  }

  switchTheme() {
    this.darkThemeIsActive = !this.darkThemeIsActive;
    darkThemeStyleSheet.disabled = !this.darkThemeIsActive;
  }

}
