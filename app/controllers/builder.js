import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BuilderController extends Controller {
  @tracked selected = null;
  
  @action
  select(item) {
    this.selected = item;
  }
  
  @action
  deselect(item) {
    this.selected = null;
  }
}
