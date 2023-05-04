import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { StudentModel } from '../Models/student.model';
import { ResponseDto } from '../Models/response.dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private endPoint: string = `${environment.apiRamsay}${environment.serviceStudent}`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(`${this.endPoint}GetAll`);
  }

  insert(model: StudentModel): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${this.endPoint}Insert`, model);
  }

  update(model: StudentModel): Observable<ResponseDto> {
    return this.http.put<ResponseDto>(`${this.endPoint}Update`, model);
  }

  delete(id: number): Observable<ResponseDto> {
    return this.http.delete<ResponseDto>(`${this.endPoint}Delete/?id=${id}`);
  }
}
