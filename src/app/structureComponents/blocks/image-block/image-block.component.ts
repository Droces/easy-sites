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
  }

  handleFileInput(files: FileList): void {
    console.log('files: ', files);
    // To handle multifile selection, iterate through this files array.
    this.fileToUpload = files.item(0);
    var request = this.httpService.instance.postFile(this.fileToUpload);
    request.subscribe(data => {
        // Upload success
        console.log('data: ', data);
      },
      error => {
        console.log(error);
      }
    );
  }
}
