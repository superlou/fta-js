import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class BuilderController extends Controller {
  @action
  async moveNode(selectedId, x, y) {
    const nodes = await this.model.nodes;
    let node = nodes.find((node) => node.id == selectedId);
    node.x = x;
    node.y = y;
    node.save();
  }
}
