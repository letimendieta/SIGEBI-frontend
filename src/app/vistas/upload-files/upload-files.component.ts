import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { UploadFileService } from 'src/app/servicios/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
  @ViewChild('tipo') tipo: ElementRef;

  uploadForm: FormGroup;
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';

  fileInfos: Observable<any>;

  constructor(private uploadService: UploadFileService,
              private fb: FormBuilder) {
        this.crearFormulario();
  }

  ngOnInit() {
    var tipo = this.uploadForm.get('tipo').value;
    if(tipo){
      this.listarCarpeta();
    }
  }

  listarCarpeta() {
    var tipo = this.uploadForm.get('tipo').value;
    this.fileInfos = this.uploadService.getFiles(tipo);
  }

  selectFile(event) {
    this.progress = 0;
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress = 0;
    var tipo = this.uploadForm.get('tipo').value;
    this.currentFile = this.selectedFiles.item(0);

    this.uploadService.upload(this.currentFile, tipo).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.fileInfos = this.uploadService.getFiles(tipo);
        }
      },
      err => {
        this.progress = 0;
        this.message = 'No se pudo subir el archivo!';
        this.currentFile = undefined;
        Swal.fire({
          icon: 'info',
          text: err.status +'. '+ this.obtenerError(err)
        })
      });

    this.selectedFiles = undefined;
  }

  obtenerError(e : any){
    var mensaje = "Error indefinido ";
      if(e.error){
        if(e.error.mensaje){
          mensaje = e.error.mensaje;
        }
        if(e.error.message){
          mensaje = e.error.message;
        }
        if(e.error.errors){
          mensaje = mensaje + ' ' + e.error.errors[0];
        }
        if(e.error.error){
          mensaje = mensaje + ' ' + e.error.error;
        }
      }
      if(e.message){
        mensaje = mensaje + ' ' + e.message;
      }
    return mensaje;  
  }

  crearFormulario() {
    this.uploadForm = this.fb.group({
      tipo  : ["H", [] ]
    });
  }
}
