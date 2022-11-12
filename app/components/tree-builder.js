import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TreeBuilderComponent extends Component {
  @tracked selected = null;

  @action
  select(id) {
    this.selected = id;
  }

  @action
  mouseMove(evt) {
    if (this.selected !== null) {
      this.args.moveNode(this.selected, evt.clientX, evt.clientY);
    }
  }

  @action
  mouseUp(evt) {
    this.selected = null;
  }
}
