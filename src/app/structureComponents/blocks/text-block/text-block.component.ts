import { Component, OnInit, Input } from '@angular/core';

import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import { PageService } from '../../../page.service';
import { HttpService } from '../../../http.service';

import { Block } from '../../block';
import { StructureComponentBase } from '../../structureComponentBase.component';

@Component({
  selector: 'app-block',
  templateUrl: './text-block.component.html',
  styleUrls: ['./text-block.component.scss']
})
export class TextBlockComponent extends StructureComponentBase implements OnInit {
  @Input() block: Block;
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
