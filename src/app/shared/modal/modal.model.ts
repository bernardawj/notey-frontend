import { ModalAction } from './modal-action.enum';
import { ModalType } from './modal-type.enum';

export class Modal {

  constructor(public data: any, public type: ModalType, public action: ModalAction, public expand: boolean) {
  }
}
