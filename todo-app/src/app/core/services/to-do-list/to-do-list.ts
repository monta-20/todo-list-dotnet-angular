import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment'; 
import { HttpClient, HttpParams } from '@angular/common/http';
import { TodoItem } from '../../../models/TodoItem';
import { Observable } from 'rxjs';
import { TodoQuery } from '../../../models/TodoQuery';
import { PagedResult } from '../../../models/PagedResult';
import { TodoUpdateDto } from '../../../models/TodoUpdateDto';
@Injectable({
  providedIn: 'root'
})
export class ToDoList {
  private apiUrl = environment.ApiUrl;
  constructor(private _http: HttpClient) { }
  getAll(): Observable<TodoItem[]> {
    return this._http.get<TodoItem[]>(this.apiUrl); 
  }
  getById(id: number): Observable<TodoItem> {
    return this._http.get<TodoItem>(`${this.apiUrl}/${id}`); 
  }
  create(item: TodoItem): Observable<TodoItem> {
    return this._http.post<TodoItem>(this.apiUrl, item);  
  }
  update(id: number, item: Partial<TodoItem>): Observable<TodoItem> {
    return this._http.put<TodoItem>(`${this.apiUrl}/${id}`, item);
  }
  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`); 
  }
  getFiltred(query: TodoQuery): Observable<PagedResult> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this._http.get<PagedResult>(`${this.apiUrl}/filtered`, { params });
  }
  getMetadata(): Observable<any> {
    return this._http.get(`${this.apiUrl}/metadata`);
  }
  toggleComplete(id: number): Observable<TodoUpdateDto> {
    return this._http.patch<TodoUpdateDto>(`${this.apiUrl}/${id}/toggle-complete`, {});
  }
}
