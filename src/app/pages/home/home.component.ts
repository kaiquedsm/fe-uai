import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  number_img_carousel: number = 1;

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      if(this.number_img_carousel === 4) {
        this.number_img_carousel = 1
        return
      }
      this.number_img_carousel++
      console.log(this.number_img_carousel);
      
    }, 5000)
  }

}
