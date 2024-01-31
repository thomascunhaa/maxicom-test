import { Component, Input, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { ListComponent } from './components/list/list.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonComponent, InputComponent, ListComponent, FormsModule, HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'maxicom-test';

  @Input() logradouro: string = '';
  complemento: string = '';
  bairro: string = '';
  localidade: string = '';
  uf: string = '';

  constructor(private http: HttpClient) { }


  async consultarCep() {
    const valueCep = '05795180'
    if (valueCep) {
      const response = await fetch('https://viacep.com.br/ws/' + valueCep + '/json/');
      const data = await response.json();

      this.logradouro = data.logradouro;
      this.complemento = data.complemento;
      this.bairro = data.bairro;
      this.localidade = data.localidade;
      this.uf = data.uf;

      console.log('Logradouro:', this.logradouro);
      console.log('Complemento:', this.complemento);
      console.log('Bairro:', this.bairro);
      console.log('Localidade:', this.localidade);

      this.enviarDadosHasura(data);

    } else {
      console.error('O valor do CEP está indefinido.');
    }
  }

  async enviarDadosHasura(data: any) {
    const url = 'https://genuine-pug-57.hasura.app/v1/graphql';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const body = {
      query: `
      mutation InsertData($logradouro: String!, $complemento: String!, $bairro: String!, $localidade: String!, $uf: String!) {
        insert_via_cep(objects: [{
          logradouro: $logradouro,
          complemento: $complemento,
          bairro: $bairro,
          localidade: $localidade,
          uf: $uf
        }]) {
          affected_rows
        }
      }`,
      variables: {
        data: data
      }
    };
    this.http.post(url, body, { headers: headers }).subscribe(
      (response) => {
        console.log('Dados enviados para o Hasura GraphQL:', response);
      },
      (error) => {
        console.error('Erro ao enviar dados para o Hasura GraphQL:', error);
      }
    );

  }
}
