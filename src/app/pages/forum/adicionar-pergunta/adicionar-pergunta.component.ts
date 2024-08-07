import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ForumService } from '../../../service/forum/forum.service';
import { UsuarioService } from '../../../service/usuario/usuario.service';
import { PerguntaPostRequest } from './../../../model/request/perguntaPostRequest';

@Component({
  selector: 'app-adicionar-pergunta',
  templateUrl: './adicionar-pergunta.component.html',
  styleUrls: ['./adicionar-pergunta.component.scss'],
  providers: [MessageService]
})
export class AdicionarPerguntaComponent implements OnInit {

  perguntaForm!: FormGroup;

  categories: string[] = [
    'LOGICA_DE_PROGRAMACAO',
    'REDES_DE_COMPUTADORES_E_INTERNET',
    'APLICACOES_PARA_WEB',
    'SISTEMAS_COMPUTACIONAIS'
  ];

  constructor(
    private forumService: ForumService,
    private userService: UsuarioService,
    private message: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.perguntaForm = this.fb.group({
      titulo: ['', [Validators.required]],
      detalhes: ['', [Validators.required]],
      tags: [[], [Validators.required, this.validateTagsNotEmpty]] // Adiciona validação customizada para tags
    });
  }

  validateTagsNotEmpty(control: any) {
    return control.value && control.value.length > 0 ? null : { required: true };
  }

  montarRequest(): void {
    if (this.perguntaForm.invalid) {
      this.message.add({severity: 'error', summary: 'Erro', detail: 'Nenhum dos campos pode estar vazio'});
      return; // Retorna imediatamente se a validação falhar
    }

    const form = this.perguntaForm.getRawValue();
    const tagsArray = Array.isArray(form.tags) ? form.tags : [form.tags];
    const request: PerguntaPostRequest = {
      detalhes: form.detalhes,
      titulo: form.titulo,
      usuarioId: this.userService.getUsuario().usuarioId,
      tags: tagsArray
    };

    this.postar(request);
    console.log(request);
  }

  postar(request: PerguntaPostRequest): void {
    this.forumService.adicionarPergunta(request).subscribe({
      next: (result) => {
        this.message.add({severity: 'success', summary: 'Sucesso', detail: 'Pergunta postada com sucesso' })
        console.log(result);
      },
      error: (erro) => {
        this.message.add({severity:'error', summary: 'Erro', detail: 'Não foi possivel inserir a pergunta' })
        console.error(erro);
      }
    });
  }
}
