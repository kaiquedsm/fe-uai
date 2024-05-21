import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: false
})
export class LoadingComponent implements OnInit {

  private animationItem: AnimationItem | undefined;

  options: AnimationOptions = {
    path: '/assets/imgs/loading.json',
    loop: true,
    autoplay: true,
  }

  constructor() { }

  ngOnInit(): void {
  }

  animationCreated(animation: AnimationItem) {  
    this.animationItem = animation;
  }

}
