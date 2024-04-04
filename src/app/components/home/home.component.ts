import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  currentTime:string='';
  Date:any;
  constructor(private el:ElementRef,private render:Renderer2){

    
  }
ngOnInit(): void {
  const date = new Date();
  this.Date= date.toDateString();
  // Call updateCurrentTime initially to display the current time
  this.updateCurrentTime();

  // Update the current time every second (1000 milliseconds)
  setInterval(() => {
    this.updateCurrentTime();
  }, 1000);
  this.initializeYears();
}
updateCurrentTime(): void {
  // Create a new Date object to get the current time
  const now = new Date();

  // Get the current time in hours, minutes, and seconds
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Construct the time string in the format HH:MM:SS
  this.currentTime = `${hours}:${minutes}:${seconds}`;
}

years: number[] = [];
initializeYears() {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear - 10; year <= currentYear + 10; year++) {
    this.years.push(year);
  }
}

selectYear(year: any) {
  // this.yearSelected.emit(year);
}

}
