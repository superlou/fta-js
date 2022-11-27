import Model, { attr, hasMany } from '@ember-data/model';
import mocus from '../utils/mocus';

export default class FaultTreeModel extends Model {
  @hasMany('tree-node', { async: false, inverse: 'faultTree' }) nodes;
  @hasMany('tree-edge', { async: false, inverse: 'faultTree' }) edges;

  findMCS(rootNodeId) {
    let nodes = this.nodes;
    let edges = this.edges;
    let gates = {};
    const nodeTypeMap = { 'or-gate': 'or', 'and-gate': 'and' };

    for (const node of nodes) {
      if (!Object.keys(nodeTypeMap).includes(node.nodeType)) {
        continue;
      }

      gates[node.id] = {
        id: node.id,
        kind: nodeTypeMap[node.nodeType],
        children: [],
      };
    }

    for (const edge of edges) {
      let parent = edge.parent;
      let child = edge.child;
      gates[parent.id]['children'].push(child.id);
    }

    gates = Object.values(gates).map((gate) => [
      gate.id,
      gate.kind,
      gate.children,
    ]);

    return mocus(gates, rootNodeId);
  }

  formatMocusResult(result) {
    const nodes = this.nodes;

    return result
      .map((union) =>
        union.map((nodeId) => nodes.find((n) => n.id == nodeId).ref).join('.')
      )
      .join(' + ');
  }

  probFromMCS(mcs) {
    let pMap = {};

    for (const node of this.nodes) {
      // Only get probability from basic-event nodes to avoid infinite recursion
      if (node.nodeType == 'basic-event') {
        pMap[node.id] = node.probability;
      }
    }

    let sum = 0;

    for (const set of mcs) {
      let product = 1;

      for (const nodeId of set) {
        product *= pMap[nodeId];
      }

      sum += product;
    }

    return sum;
  }
}