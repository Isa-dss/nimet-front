import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment as env } from '../../environments/enviroment';
import { urlConfig } from '../../assets/config/urlConfig';
import { UsuarioRequest } from '../model/usuarioRequest';
import { UsuarioResponse } from '../model/usuarioResponse';
import { VerificacaoEmailRequest } from '../model/verificacaoEmailRequest';
import { LoginRequest } from '../model/loginRequest';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 };
  constructor(private httpClient: HttpClient ) { }


  cadastrar(request: UsuarioRequest) : Observable <UsuarioResponse>{
    return this.httpClient.post(env.baseApiUrl + '/' +urlConfig.cadastrarUsuario, request).pipe(
      map((res:any) => res)
    )
  }


  logar(request:LoginRequest): Observable<UsuarioResponse> {
    return this.httpClient.post<any>(env.baseApiUrl + '/' + urlConfig.logar+'?login='+request.login+'&senha='+request.password, request).pipe(
      map((res:any) => res)
    )
  }

  verficarEmail(token:VerificacaoEmailRequest): Observable<any> {

    return this.httpClient.put(env.baseApiUrl + '/' + urlConfig.verificarEmail,token, this.httpOptions).pipe(
      map((res:any) => res)
    )
  }
}

