import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class NodeEditorComponent extends Component {
  @action
  saveModel(evt) {
    this.args.model.save();
  }
}
