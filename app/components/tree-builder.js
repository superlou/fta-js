import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import mocus from '../utils/mocus';

export default class TreeBuilderComponent extends Component {
  @tracked dragged = null;
  @tracked selected = null;
  @tracked solution = null;

  @action
  select(id) {
    this.dragged = id;
    this.selected = id;
  }

  @action
  mouseMove(evt) {
    if (this.dragged !== null) {
      this.args.moveNode(this.dragged, evt.clientX, evt.clientY);
    }
  }

  @action
  mouseUp(evt) {
    this.dragged = null;
  }
  
  @action
  keyPress(evt) {
    if (evt.key == 's' && this.selected) {
      this.solve(this.selected);
    }
  }
  
  solve(rootNodeId) {
    let nodes = this.args.tree.nodes;
    let edges = this.args.tree.edges;
    let gates = {};
    const nodeTypeMap = {"or-gate": "or", "and-gate": 'and'};
    
    nodes.forEach(node => {
      if (!Object.keys(nodeTypeMap).includes(node.nodeType)) {
        return;
      }

      gates[node.id] = {
        id: node.id,
        kind: nodeTypeMap[node.nodeType],
        children: [],
      }
    });
    
    edges.forEach(edge => {
      gates[edge.parent.id]['children'].push(edge.child.id);
    });
    
    gates = Object.values(gates).map(gate => [gate.id, gate.kind, gate.children]);
    let result = mocus(gates, rootNodeId);
    this.solution = this.formatMocusResult(result);
  }
  
  formatMocusResult(result) {  
    return result.map(union => 
      union.map(nodeId =>
        this.args.tree.nodes.find(n => n.id == nodeId).ref
      ).join(".")
    ).join(" + ")
  }
}
