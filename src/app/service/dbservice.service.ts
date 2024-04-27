import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  publishUrl:string="http://192.168.0.201:7001/api/";
  constructor(private http:HttpClient) { }

  
  uploadFile(file: File, dataBaseName: any, section: any) {
    // Set the maximum allowed file size in bytes
    const maxFileSize = 1024 * 1024 * 300; // 300 MB

    // Create HttpHeaders with the maximum file size limit
    const headers = new HttpHeaders({
        'Max-Upload-Size': maxFileSize.toString() // Add this custom header
    });

    // Construct the FormData object and append the file
    const formData = new FormData();
    formData.append('file', file);

    // Construct the API URL with query parameters
    const url = `${this.publishUrl}ExcelData/upload?DataBaseName=${dataBaseName}&collectionName=${section}`;

    // Define options object with headers
    const options = {
        headers: headers
    };

    // Make the HTTP POST request with options
    return this.http.post<any>(url, formData, options);
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
    return this.http.get(`${this.publishUrl}StringSearch/export`, {
      headers: headers,
      responseType: 'blob'
    });
  }

  getAllDBCollection(){
return this.http.get(`${this.publishUrl}DBAndCollections`);
  }



  
}
