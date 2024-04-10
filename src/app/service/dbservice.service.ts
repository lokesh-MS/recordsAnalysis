import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  publishUrl:string="http://192.168.0.201:7001/api/";
  constructor(private http:HttpClient) { }

  
  uploadFile(file: File,dataBaseName:any,section:any) {
    debugger
// Set the maximum allowed file size in bytes
const maxFileSize = 300 * 1024 * 1024; // 200 MB

// Create HttpHeaders with the maximum file size limit
const headers = new HttpHeaders({
  'Content-Type': 'multipart/form-data',
  'Max-Upload-Size': maxFileSize.toString() // Add this custom header
});


//     const formData = new FormData();
//     formData.append('file', file);
// //  return this.http.post<any>(`${this.publishUrl}ExcelData/upload`, formData, { headers: headers });
//  return this.http.post<any>(`https://localhost:7022/api/ExcelData/upload?DataBaseName=${dataBaseName}&collectionName=${section}`, formData, { headers: headers });
const formData = new FormData();
formData.append('file', file);

// Construct the API URL with query parameters
const url = `https://localhost:7022/api/ExcelData/upload?DataBaseName=${dataBaseName}&collectionName=${section}`;

// Make the HTTP POST request
return this.http.post<any>(url, formData);
  }
  exportToExcel(): Observable<Blob> {
    // return this.http.get(`https://localhost:7022/api/ExcelData/export`, { responseType: 'blob' });
    return this.http.get(`${this.publishUrl}ExcelData/export`, { responseType: 'blob' });
  }
  

  exportToalldropdowndata(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    // return this.http.get(`${this.publishUrl}StringSearch/export`, {
    //   headers: headers,
    //   responseType: 'blob'
    // });
    return this.http.get(`https://localhost:7022/api/StringSearch/export`, {
      headers: headers,
      responseType: 'blob'
    });
  }

  getAllDBCollection(){
return this.http.get(`https://localhost:7022/api/DBAndCollections`);
  }
}
