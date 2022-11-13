import Route from '@ember/routing/route';
import { service } from '@ember/service';
import mocus from '../utils/mocus';

export default class BuilderRoute extends Route {
  @service store;

  model() {
    let n0 = this.store.createRecord('tree-node', {
      nodeType: 'basic-event',
      ref: 'e0',
      x: 100,
      y: 300,
    });

    let n1 = this.store.createRecord('tree-node', {
      nodeType: 'basic-event',
      ref: 'e1',
      x: 200,
      y: 300,
    });

    let n2 = this.store.createRecord('tree-node', {
      nodeType: 'or-gate',
      ref: 'e2',
      x: 150,
      y: 200,
    });

    let n3 = this.store.createRecord('tree-node', {
      nodeType: 'basic-event',
      ref: 'e3',
      x: 300,
      y: 300,
    });

    let n4 = this.store.createRecord('tree-node', {
      nodeType: 'and-gate',
      ref: 'e4',
      x: 200,
      y: 100,
    });

    let e0 = this.store.createRecord('tree-edge', {
      start: n0,
      finish: n2,
    });

    let e1 = this.store.createRecord('tree-edge', {
      start: n1,
      finish: n2,
    });
        
    let e2 = this.store.createRecord('tree-edge', {
      start: n2,
      finish: n4,
    });

    let e3 = this.store.createRecord('tree-edge', {
      start: n3,
      finish: n4,
    });    
        
    let a = ['A', 'and', ['B', 'C']];
    let b = ['B', 'or', ['1', 'D']];
    let c = ['D', 'and', ['2', '3']];
    let d = ['C', 'or', ['2', '4']];
    let result = mocus([a, b, c, d], 'A');

    return this.store.createRecord('fault-tree', {
      nodes: [n0, n1, n2, n3, n4],
      edges: [e0, e1, e2, e3],
    });
  }
}
