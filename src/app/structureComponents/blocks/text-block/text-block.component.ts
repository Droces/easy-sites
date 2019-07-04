import { Component, OnInit, Input } from '@angular/core';

import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import { SettingsService } from '../../../settings.service';
import { PageService } from '../../../page.service';
import { HttpService } from '../../../http.service';

import { StructureComponentBase } from '../../structureComponentBase.component';

// import { BlockInterface } from '../../block-interface';
import { TextBlock } from '../text-block';

@Component({
  selector: 'text-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.scss']
})
export class TextBlockComponent extends StructureComponentBase implements OnInit {
  @Input() block: TextBlock;
  @Input() blocksInGroup: number;

  public editor = InlineEditor;
  public config = {
    placeholder: 'Click here to type.',
    toolbar: [
      "heading", "|", "bold", "italic", "link", "bulletedList", "numberedList",
      "insertTable"
    ]
  };

  constructor(
    public settings: SettingsService,
    public httpService: HttpService,
    public pageService: PageService) {
    super();
  }

  ngOnInit() { }

  public editorReady(editor) {
    // console.log('editor toolbar items', Array.from(editor.ui.componentFactory.names()));
  }

  onChange({ editor }: ChangeEvent) {
    this.httpService.currentState = 'Unsaved';
    // const data = editor.getData();
    this.pageService.savePage();
  }
}
