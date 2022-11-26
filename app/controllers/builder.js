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

  @action
  async solveAll() {
    for (let node of await this.model.nodes) {
      if (['and-gate', 'or-gate'].includes(node.nodeType)) {
        node.minCutSets = this.model.findMCS(node.id);
      }
    }
  }
}
