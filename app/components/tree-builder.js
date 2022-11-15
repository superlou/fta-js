import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import mocus from '../utils/mocus';

export default class TreeBuilderComponent extends Component {
  @service store;

  @tracked isDragging = false;
  @tracked solution = null;
  @tracked isLinking = false;
  mousePos = [0, 0];

  @action
  async select(model) {
    if (this.isLinking) {
      this.isLinking = false;
      this.makeEdge(this.args.selected, model);
    }

    this.isDragging = true;
    this.args.select(model);
  }

  async makeEdge(node0, node1) {
    if (node0 === undefined) {
      console.log('Tried to link undefined node0!');
      return;
    }

    if (node1 === undefined) {
      console.log('Tried to link undefined node1!');
      return;
    }

    if (node0 == node1) {
      console.log("Can't link node to itself!");
      return;
    }

    let parent, child;
    [parent, child] = node0.y < node1.y ? [node0, node1] : [node1, node0];

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

    if (this.isDragging) {
      this.shiftNode(this.args.selected, evt.movementX, evt.movementY);
    }
  }

  shiftNode(node, dx, dy) {
    node.x += dx;
    node.y += dy;
    node.save();
  }

  @action
  mouseUp(evt) {
    this.isDragging = false;
  }

  @action
  keyPress(evt) {
    if (evt.key == 's' && this.args.selected) {
      this.solve(this.args.selected);
    } else if (evt.key == 'a') {
      this.createNode('and-gate');
    } else if (evt.key == 'o') {
      this.createNode('or-gate');
    } else if (evt.key == 'e') {
      this.createNode('basic-event');
    } else if (evt.key == 'Delete') {
      this.deleteNode(this.args.selected);
    } else if (evt.key == 'l' && this.args.selected) {
      this.isLinking = true;
    } else if (evt.key == 'Escape') {
      this.isLinking = false;
      this.args.deselect();
    }
  }

  createNode(gateType) {
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
    let node = this.args.selected;

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
