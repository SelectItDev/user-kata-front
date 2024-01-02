import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

import { User } from '../domain/user';

@Injectable()
export class UserService {

    constructor(private httpClient: HttpClient) { }

    getUsers(): Observable<User[]> {
        console.log(environment.apiUrl);
        return this.httpClient
        .get<User[]>(environment.apiUrl + '/api/users');
    }

    findUserByEmail(email: string): Observable<User> {
        return this.httpClient
        .get<User>(environment.apiUrl + '/api/users/email/' + email);
    }

    saveUser(user: User): Observable<User> {
        return this.httpClient
        .post<User>(environment.apiUrl + '/api/users', user);
    }

    deleteUser(id: string): Observable<any> {
        return this.httpClient
        .delete<any>(environment.apiUrl + '/api/users/' + id);
    }
}