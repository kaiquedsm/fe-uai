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
  images_1: string[] = ['../../../assets/imgs/carousel_1/1/img_1.svg', '../../../assets/imgs/carousel_1/1/img_2.svg', '../../../assets/imgs/carousel_1/1/img_3.svg', '../../../assets/imgs/carousel_1/1/img_4.svg',]; 
  images_2: string[] = ['../../../assets/imgs/carousel_1/2/img_1.svg', '../../../assets/imgs/carousel_1/2/img_2.svg', '../../../assets/imgs/carousel_1/2/img_3.svg', '../../../assets/imgs/carousel_1/2/img_4.svg',]; 
  image_op: string[] = [];
  currentIndex: number = 0;
  
  constructor() { }

  ngOnInit(): void {
    
    // this.startCarousel();
    
    window.addEventListener('resize', () => {
      this.screen_width = window.innerWidth;
   });
   
   if(this.screen_width >= 640) {
    this.image_op = this.images_1
   } else {
    this.image_op = this.images_2
   }
    
    setInterval(() => { 
      this.currentIndex = (this.currentIndex + 1) % this.image_op.length;
    }, 5000);
    
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
  
  startCarousel(): void {
     // Alterar a imagem a cada 3 segundos (3000 milissegundos)  
  }
    


}
