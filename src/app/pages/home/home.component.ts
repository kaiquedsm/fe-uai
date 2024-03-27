import { NgIfContext } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  number_img_carousel: number = 1;
  screen_width: number = window.innerWidth
  elseDiv!: TemplateRef<NgIfContext<boolean>>|null;
  
  
  constructor() { }

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.screen_width = window.innerWidth;
   });
    setInterval(() => {
      if(this.number_img_carousel === 4) {
        this.number_img_carousel = 1
        return
      }
      this.number_img_carousel++
      console.log(this.screen_width);
      
    }, 5000)

    initFlowbite();
  }

}
