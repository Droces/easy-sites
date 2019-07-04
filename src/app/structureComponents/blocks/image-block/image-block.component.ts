import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from '../../../settings.service';
import { PageService } from '../../../page.service';
import { HttpService } from '../../../http.service';

import { StructureComponentBase } from '../../structureComponentBase.component';

// import { BlockInterface } from '../../block-interface';
import { ImageBlock } from '../image-block';

@Component({
  selector: 'image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss']
})
export class ImageBlockComponent extends StructureComponentBase implements OnInit {
  @Input() block: ImageBlock;
  @Input() blocksInGroup: number;

  constructor(
    public settings: SettingsService,
    public httpService: HttpService,
    public pageService: PageService) {
    super();
  }

  ngOnInit() {
    // console.log('image block: ', this.block);
  }

  handleFileInput(files: FileList): void {
    // console.log('files: ', files);
    var file = files.item(0);

    var reader = new FileReader();
    reader.onload = () => {
      this.postFile(reader.result, file.name);
    }
    reader.readAsArrayBuffer(file);
  }

  postFile(fileData: string | ArrayBuffer, fileName: string) {
    var request = this.httpService.instance.postFile(fileData, fileName);
    request.subscribe(data => {
        // Upload success
        // console.log('data: ', data);
        this.block.fileId = data['data']['id'];
        this.block.path = data['data']['attributes']['uri']['url'];
        var attachRequest = this.httpService.instance
          .attachFile(this.block.fileId, this.pageService.currentPage.id);

        this.httpService.currentState = 'Unsaved';
        // const data = editor.getData();
        this.pageService.savePage();

        return attachRequest;
      },
      error => {
        console.log(error);
      }
    );
  }
}
