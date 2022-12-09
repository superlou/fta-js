import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import mocus from '../utils/mocus';

export default class TreeBuilderComponent extends Component {
  @service store;

  @tracked isDragging = false;
  @tracked isPanning = false;
  @tracked solution = null;
  @tracked isLinking = false;
  mousePos = [0, 0];
  dragShift = [0, 0];
  originalPos = {};

  @tracked viewBoxX = 0;
  @tracked viewBoxY = 0;
  @tracked contentW = 0;
  @tracked contentH = 0;
  @tracked zoom = 1;

  get viewBoxW() {
    return this.contentW * this.zoom;
  }

  get viewBoxH() {
    return this.contentH * this.zoom;
  }

  @action
  async select(model) {
    if (this.isLinking) {
      this.isLinking = false;
      this.makeEdge(this.args.selected, model);
    }

    this.isDragging = true;
    this.dragShift = [0, 0];
    this.originalPos[model.id] = [model.x, model.y];
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

  snapPos(x, y) {
    let snap = this.args.tree.snapDistance;
    if (snap > 1) {
      x = Math.round(x / snap) * snap;
      y = Math.round(y / snap) * snap;
    }
    
    return [x, y];
  }
  
  @action
  mouseMove(evt) {
    this.mousePos = [evt.clientX, evt.clientY];

    if (this.isDragging) {
      this.dragShift[0] += evt.movementX * this.zoom;
      this.dragShift[1] += evt.movementY * this.zoom;

      let node = this.args.selected;
      let x = this.originalPos[node.id][0] + this.dragShift[0];
      let y = this.originalPos[node.id][1] + this.dragShift[1];   
      [x, y] = this.snapPos(x, y);

      node.x = x;
      node.y = y;
      node.save();
    }

    if (this.isPanning) {
      this.viewBoxX -= evt.movementX * this.zoom;
      this.viewBoxY -= evt.movementY * this.zoom;
    }
  }

  @action
  mouseDown(evt) {
    this.isPanning = true;
    this.args.deselect();
  }

  @action
  wheel(evt) {
    let dy = evt.deltaY;

    if (dy > 0) {
      this.zoom *= 1.1;
    } else if (dy < 0) {
      this.zoom /= 1.1;
    }
  }

  @action
  onResize(resizeObserverEntry) {
    let rect = resizeObserverEntry.contentRect;
    this.contentW = rect.width;
    this.contentH = rect.height;
  }

  @action
  mouseUp(evt) {
    this.isDragging = false;
    this.dragShift = [0, 0];
    this.isPanning = false;
  }

  solveAll = task(async () => {
    this.args.solveAll();
    await timeout(100);
  });

  @action
  async keyPress(evt) {
    evt.preventDefault();

    if (evt.key == 's') {
      this.solveAll.perform();
    } else if (evt.key == 'a') {
      this.createNode('and-gate');
    } else if (evt.key == 'o') {
      this.createNode('or-gate');
    } else if (evt.key == 'e') {
      this.createNode('basic-event');
    } else if (evt.key == 'Delete') {
      if (this.args.selected.constructor.modelName == 'tree-node') {
        this.deleteNode(this.args.selected);
      } else if (this.args.selected.constructor.modelName == 'tree-edge') {
        this.deleteEdge(this.args.selected);
      }
    } else if (evt.key == 'l' && this.args.selected) {
      this.isLinking = true;
    } else if (evt.key == 'Escape') {
      this.isLinking = false;
      this.args.deselect();
    }
  }

  createNode(gateType) {
    let [x, y] = this.snapPos(...this.mousePos);
    
    let record = this.store.createRecord('tree-node', {
      x: x,
      y: y,
      nodeType: gateType,
      ref: '',
      desc: '',
      faultTree: this.args.tree,
    });
    record.save();
    this.args.tree.save();

    this.args.select(record);
    this.args.setFocusProperty('node_ref');
  }

  deleteNode(node) {
    const tree = this.args.tree;
    if (!node) {
      return;
    }

    const index = tree.nodes.indexOf(node);
    if (index > -1) {
      tree.nodes.splice(index, 1);
      this.args.tree.save();
    }

    for (let edge of node.edges) {
      this.deleteEdge(edge);
    }

    node.destroyRecord();
    node.save();
  }

  deleteEdge(edge) {
    let child = edge.child;
    let parent = edge.parent;
    let tree = edge.faultTree;

    let index = child.edges.indexOf(edge);
    if (index > -1) {
      child.edges.splice(index, 1);
      child.save();
    }

    index = parent.edges.indexOf(edge);
    if (index > -1) {
      parent.edges.splice(index, 1);
      parent.save();
    }

    index = tree.edges.indexOf(edge);
    if (index > -1) {
      tree.edges.splice(index, 1);
      tree.save();
    }

    edge.destroyRecord();
    edge.save();
  }
}
