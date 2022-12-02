import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BuilderController extends Controller {
  @tracked selectedId = null;
  queryParams = ['selectedId'];

  @tracked focusProperty = null;

  @action
  setFocusProperty(property) {
    this.focusProperty = property;
  }

  @action
  select(item) {
    this.selectedId = item.id;
  }

  @action
  deselect(item) {
    this.selectedId = null;
  }

  get selected() {
    let nodes = this.model.nodes;
    let edges = this.model.edges;
    let items = nodes.concat(edges);
    return items.find((item) => item.id === this.selectedId);
  }

  wait(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }

  @action
  solveAll() {
    for (let node of this.model.nodes) {
      node.minCutSets = this.model.findMCS(node.id);
      node.save();
    }
  }
}
