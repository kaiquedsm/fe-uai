import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIfContext } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  number_img_carousel: number = 1;
  screen_width: number = 0;

  constructor(private router: Router) { }

  loginCadastro() {
    this.router.navigate(['/login-cadastro']);
  }

  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.screen_width = window.innerWidth;
    });
    setInterval(() => {
      if (this.number_img_carousel === 4) {
        this.number_img_carousel = 1
        return
      }
      this.number_img_carousel++
    }, 5000)
    initFlowbite();
  }

}
