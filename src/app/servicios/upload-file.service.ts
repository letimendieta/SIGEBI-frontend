import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private url = GlobalConstants.apiUrlBackend + '/archivos';

  constructor(private http: HttpClient) { }

  upload(file: File, tipo: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('tipo', tipo);

    const req = new HttpRequest('POST', `${this.url}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  upload2(file: File, tipo: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('tipo', tipo);

    const req = new HttpRequest('POST', `${this.url}/upload`, formData);

    return this.http.request(req);
  }

  uploadAsync(file: File, tipo: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('tipo', tipo);  

    return this.http.request(new HttpRequest('POST', `${this.url}/upload`, formData));
  }

  getFiles( tipo: String ): Observable<any> {
    return this.http.get(`${this.url}/filesFolder/${ tipo }`);
  }

  getFilesName(name: String, tipo: String): Observable<any> {
    return this.http.get(`${this.url}/filesName/${ name }/${ tipo }`);
  }

  getFilesServer(name: String): Observable<any> {
    return this.http.get(`${this.url}/files/${ name }`);
  }
  
}
