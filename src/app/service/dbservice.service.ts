import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  publishUrl:string="http://localhost:88/api/";
  constructor(private http:HttpClient) { }
  uploadFile(file: File) {
    debugger
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<any>(`https://localhost:7022/api/ExcelData/upload`, formData);
  }
  exportToExcel(): Observable<Blob> {
    return this.http.get(`https://localhost:7022/api/ExcelData/export`, { responseType: 'blob' });
  }
  

  exportToalldropdowndata(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    return this.http.get('https://localhost:7022/api/StringSearch/export', {
      headers: headers,
      responseType: 'blob'
    });
  }
}
