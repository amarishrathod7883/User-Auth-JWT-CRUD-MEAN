import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const API_URL = 'http://localhost:8080/api/users/';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }
  
  getAllUsers(searchCondition): Observable<any> {
    return this.http.post(API_URL + 'getAllUsers', searchCondition, { responseType: 'text' });
  }
  getSingleUser(id): Observable<any> {
    return this.http.get(API_URL + 'getSingleUser/' + id, { responseType: 'text' });
  }
  updateUser(id: any, data: any): Observable<any> {
    return this.http.put(API_URL + 'updateUser/' + id, data);
  }
  removeUser(id: any): Observable<any> {
    return this.http.get(API_URL + 'removeUser/' + id, { responseType: 'text' });
  }
  removeAllUser(): Observable<any> {
    return this.http.get(API_URL + 'removeAllUser', { responseType: 'text' }).pipe(map(res => JSON.parse(res)));
  }
}