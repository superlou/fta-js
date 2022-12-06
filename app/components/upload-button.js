import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class UploadButtonComponent extends Component { 
  @action
  clickFileInput(evt) {
    let fileInput = evt.target.querySelector('input');

    // todo Why is fileInput null and appears to be called twice?
    if (fileInput) {
      fileInput.click(); 
    }
  }
}
