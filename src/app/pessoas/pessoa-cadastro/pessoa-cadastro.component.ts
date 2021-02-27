import { ErrorHandlerService } from './../../core/error-handler.service';
import { MessageService } from 'primeng/api';
import { Pessoa } from './../../core/model';
import { PessoaService } from './../pessoa.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoas=[];
  pessoa = new Pessoa();

  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    ) { }

  ngOnInit(): void {
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova pessoa');

    if(codigoPessoa){

      if(isNaN(codigoPessoa)) {
        this.router.navigate(['/pagina-nao-encontrada']);
        return;
      }
      this.carregarPessoa(codigoPessoa);
    }

  }

  get editando(){
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number){
    this.pessoaService.buscarPorCodigo(codigo)
    .then(pessoa =>{
      this.pessoa = pessoa;
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandler.handle(erro));

  }

  salvar(form: FormControl){

    if(this.editando){
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }

  }

  adicionarPessoa(form: FormControl){
    this.pessoaService.adicionar(this.pessoa)
    .then(pessoaAdicionada =>{
      this.messageService.add({ severity: 'success', detail: `${pessoaAdicionada.nome} adicionado(a) com sucesso!` });

      this.router.navigate(['/pessoas', pessoaAdicionada.codigo])

    })
    .catch(erro => this.errorHandler.handle(erro))

  }

  atualizarPessoa(form: FormControl){
    this.pessoaService.atualizar(this.pessoa)
    .then(pessoa =>{
      this.pessoa = pessoa;

      this.messageService.add({ severity: 'success', detail: `${pessoa.nome} alterado(a) com sucesso!`  });
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  nova(form: FormControl){
    form.reset();

    setTimeout(function() {
      this.pessoa = new Pessoa();
    }.bind(this), 1);


    this.router.navigate(['/pessoas/nova']);
  }

  atualizarTituloEdicao(){
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }

}
