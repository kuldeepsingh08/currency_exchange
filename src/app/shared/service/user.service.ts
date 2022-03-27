import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private toast: ToastrService) { }

  success(message: string, title?: string): void {
    this.toast.success(message, title ? title : '');
  }

  error(message: string, title?: string): void {
    this.toast.error(message, title ? title : '');
  }
}
