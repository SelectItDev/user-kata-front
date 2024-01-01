import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

import { User } from '../domain/user';

@Injectable()
export class UserService {

    api_url: string = 'http://localhost:8080';

    constructor(private httpClient: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.httpClient
        .get<User[]>(this.api_url + '/api/users');
    }

    findUserByEmail(email: string): Observable<User> {
        return this.httpClient
        .get<User>(this.api_url + '/api/users/email/' + email);
    }

    saveUser(user: User): Observable<User> {
        return this.httpClient
        .post<User>(this.api_url + '/api/users', user);
    }

    deleteUser(id: string): Observable<any> {
        return this.httpClient
        .delete<any>(this.api_url + '/api/users/' + id);
    }
}