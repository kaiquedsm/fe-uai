import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre-nos',
  templateUrl: './sobre-nos.component.html',
  styleUrls: ['./sobre-nos.component.scss']
})
export class SobreNosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  anchor() {
    const section = document.getElementById('idAnchor');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }

  }

}
