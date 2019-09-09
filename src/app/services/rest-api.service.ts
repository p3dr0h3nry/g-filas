import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "http://www.prod.agesi.com.br/api_gestao/api/";

@Injectable({
  providedIn: 'root'
})
export class RestApiService  {

  constructor(private http: HttpClient) { 

  }

  post(data, type) {
    
    return new Promise((resolve, reject) => {
       let headers = new Headers();
       this.http.post(apiUrl + type, JSON.stringify(data)).subscribe(res => {
         resolve(res);
       }), (err) => {
         console.log(err);
         reject(err);
       }
    })
  }

}
