import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class BuilderController extends Controller {
  @action
  moveNode(selectedId, x, y) {
    let node = this.model.nodes.find((node) => node.id == selectedId);
    node.x = x;
    node.y = y;
  }
}
