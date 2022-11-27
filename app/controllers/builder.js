import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BuilderController extends Controller {
  @tracked selectedId = null;
  queryParams = ['selectedId'];
  
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
    return items.find(item => item.id === this.selectedId);
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
