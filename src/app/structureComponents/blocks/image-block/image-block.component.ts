import { Component, OnInit } from '@angular/core';

import { PageService } from '../../../page.service';
import { FileUploadService } from '../../../file-upload.service';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss']
})
export class ImageBlockComponent implements OnInit {
  fileToUpload: File = null;

  constructor(
    public pageService: PageService,
    public fileUploadService: FileUploadService) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    console.log('files: ', files);
    // To handle multifile selection, iterate through this files array.
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
      // do something, if upload success
      },
      error => {
        console.log(error);
      }
    );
  }
}
