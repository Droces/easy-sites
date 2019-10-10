import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from '../../../settings.service';
import { StateService } from '../../../state.service';
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
    public state: StateService,
    public httpService: HttpService,
    public pageService: PageService) {
    super();
  }

  ngOnInit() {
    // console.log('image block: ', this.block);
  }

  handleFileInput(files: FileList): void {
    // console.log('files: ', files);
    let file = files.item(0);

    const reader: FileReader = new FileReader();
    reader.onload = () => {
      this.postFile(reader.result, file.name);
    }
    reader.readAsArrayBuffer(file);
  }

  postFile(fileData: string | ArrayBuffer, fileName: string) {
    const request = this.httpService.instance.postFile(fileData, fileName);
    request.subscribe(file => {
      // Upload success
      // console.log('file: ', file);
      this.block.fileId = file['id'];
      this.block.path = file['url'];

      // Make it permanent by attaching it to the page
      // Page content type needs a "field_files" multi-value field
      const attachRequest = this.httpService.instance
        .attachFile(this.block.fileId, this.pageService.currentPage.id);
      attachRequest.subscribe(() => {});

      this.httpService.currentState = 'Unsaved';
      // const data = editor.getData();
      if (! this.state.inDemoMode) {
        this.pageService.savePage();
      }
      return attachRequest;
    },
    error => {
      console.error(error);
    });
  }
}
