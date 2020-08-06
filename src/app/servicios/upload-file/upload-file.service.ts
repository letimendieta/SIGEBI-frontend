import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private baseUrl = 'http://localhost:8080/auth/archivos';

  constructor(private http: HttpClient) { }

  upload(file: File, tipo: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('tipo', tipo);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  upload2(file: File, tipo: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('tipo', tipo);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData);

    return this.http.request(req);
  }

  uploadAsync(file: File, tipo: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('tipo', tipo);  

    return this.http.request(new HttpRequest('POST', `${this.baseUrl}/upload`, formData));
  }

  getFiles( tipo: String ): Observable<any> {
    return this.http.get(`${this.baseUrl}/filesFolder/${ tipo }`);
  }

  getFilesName(name: String, tipo: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/filesName/${ name }/${ tipo }`);
  }
  
}
