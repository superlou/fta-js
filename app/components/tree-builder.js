import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import mocus from '../utils/mocus';

export default class TreeBuilderComponent extends Component {
  @service store;

  @tracked dragged = null;
  @tracked selected = null;
  @tracked solution = null;
  @tracked isLinking = false;
  mousePos = [0, 0];

  @action
  async select(id) {
    if (this.isLinking) {
      this.isLinking = false;
      this.makeEdge(this.selected, id);
    }

    this.dragged = id;
    this.selected = id;
  }
  
  async makeEdge(firstId, secondId) {
    const nodes = await this.args.tree.nodes;
    let node0 = nodes.find(node => node.id == firstId);
    let node1 = nodes.find(node => node.id == secondId);
      
    if (node0 === undefined) {
      console.log("Tried to link undefined node0!");
      return;
    }
  
    if (node1 === undefined) {
      console.log("Tried to link undefined node1!");
      return;
    }
      
    if (node0 == node1) {
      console.log("Can't link node to itself!");
      return;
    }
      
    let parent, child;
    [parent, child] = (node0.y < node1.y) ? [node0, node1] : [node1, node0];

    let edge = this.store.createRecord('tree-edge', {
      faultTree: this.args.tree,
      child: child,
      parent: parent,
    });

    edge.save();
    this.args.tree.save();
    parent.save();
    child.save();
  }

  @action
  mouseMove(evt) {
    this.mousePos = [evt.clientX, evt.clientY];
    
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
    } else if (evt.key == 'a') {
      this.addLogicGate('and-gate');
    } else if (evt.key == 'o') {
      this.addLogicGate('or-gate');
    } else if (evt.key == 'Delete') {
      this.deleteNode(this.selected);
    } else if (evt.key == 'l' && this.selected) {
      this.isLinking = true;
    } else if (evt.key == 'Escape') {
      this.isLinking = false;
      this.selected = null;
    }
  }
  
  addLogicGate(gateType) {
    console.log(this.mousePos);
    let record = this.store.createRecord('tree-node', {
      x: this.mousePos[0],
      y: this.mousePos[1],
      nodeType: gateType,
      ref: '',
      desc: '',
      faultTree: this.args.tree,
    });
    record.save();
    this.args.tree.save();
  }
  
  async deleteNode(nodeId) {
    const nodes = await this.args.tree.nodes;
    let node = nodes.find(node => node.id == nodeId);
    
    if (node) {
      const index = nodes.indexOf(node);
      if (index > -1) {
        nodes.splice(index, 1);
        this.args.tree.save();
        node.destroyRecord();
        node.save(); 
      }
    }
  }

  solve(rootNodeId) {
    let nodes = this.args.tree.nodes;
    let edges = this.args.tree.edges;
    let gates = {};
    const nodeTypeMap = { 'or-gate': 'or', 'and-gate': 'and' };

    nodes.forEach((node) => {
      if (!Object.keys(nodeTypeMap).includes(node.nodeType)) {
        return;
      }

      gates[node.id] = {
        id: node.id,
        kind: nodeTypeMap[node.nodeType],
        children: [],
      };
    });

    edges.forEach((edge) => {
      gates[edge.parent.id]['children'].push(edge.child.id);
    });

    gates = Object.values(gates).map((gate) => [
      gate.id,
      gate.kind,
      gate.children,
    ]);
    let result = mocus(gates, rootNodeId);
    this.solution = this.formatMocusResult(result);
  }

  formatMocusResult(result) {
    return result
      .map((union) =>
        union
          .map((nodeId) => this.args.tree.nodes.find((n) => n.id == nodeId).ref)
          .join('.')
      )
      .join(' + ');
  }
}
