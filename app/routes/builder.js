import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BuilderRoute extends Route {
  @service store;

  model() {
    let n0 = this.store.createRecord('tree-node', {
      nodeType: 'basic-event',
      ref: 'n0',
      x: 100,
      y: 300,
    });

    let n1 = this.store.createRecord('tree-node', {
      nodeType: 'basic-event',
      ref: 'n1',
      x: 200,
      y: 300,
    });

    let n2 = this.store.createRecord('tree-node', {
      nodeType: 'or-gate',
      ref: 'n2',
      x: 150,
      y: 200,
    });

    let n3 = this.store.createRecord('tree-node', {
      nodeType: 'basic-event',
      ref: 'n3',
      x: 300,
      y: 300,
    });

    let n4 = this.store.createRecord('tree-node', {
      nodeType: 'and-gate',
      ref: 'n4',
      x: 200,
      y: 100,
    });

    let e0 = this.store.createRecord('tree-edge', {
      child: n0,
      parent: n2,
    });

    let e1 = this.store.createRecord('tree-edge', {
      child: n1,
      parent: n2,
    });
        
    let e2 = this.store.createRecord('tree-edge', {
      child: n2,
      parent: n4,
    });

    let e3 = this.store.createRecord('tree-edge', {
      child: n3,
      parent: n4,
    });    

    return this.store.createRecord('fault-tree', {
      nodes: [n0, n1, n2, n3, n4],
      edges: [e0, e1, e2, e3],
    });
  }
}
