import { Component, Input, OnInit } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { ErrorService } from 'src/app/core/services/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  showError: boolean = false;
  width: number = 100;

  close = faClose;

  @Input()
  errorMessage: string = '';
  
  constructor(private errorService: ErrorService) { }

  ngOnInit(): void {
    this.errorService.errorSub.subscribe({
      next: (existsError) => {
        this.showError = existsError;
        if(existsError) {
          setTimeout(() => {
            this.closeError();
          }, 5000)
        }
      }
    });
    
  }

  closeError() {
    this.errorService.errorSub.next(false);
  }

}
