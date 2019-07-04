import { BlockInterface } from '../block-interface';
export class ImageBlock implements BlockInterface {
  type: string;
  fileId: string;
  path?: string;
}
