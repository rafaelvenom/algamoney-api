import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { LogoutService } from './../../seguranca/logout.service';
import { ErrorHandlerService } from './../error-handler.service';
import { AuthService } from './../../seguranca/auth.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;

  constructor(
    public auth: AuthService,
    private logoutService: LogoutService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private messageService: MessageService,
    private confirmation: ConfirmationService
  ) { }

  ngOnInit() {
  }



  logout() {
      this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
        this.messageService.add({ severity: 'warn', detail: 'Você foi desconectado!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarSaida() {
    this.confirmation.confirm({
      message: `Deseja sair?`,
      accept: () => {
        this.logout();
      }
    });
  }

}
