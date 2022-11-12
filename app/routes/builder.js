import Route from '@ember/routing/route';
import TreeNode from '../utils/tree-node';
import TreeEdge from '../utils/tree-edge';
import mocus from '../utils/mocus';

export default class BuilderRoute extends Route {
  model() {
    let n0 = new TreeNode('basic-event', 'e0', 100, 300);
    let n1 = new TreeNode('basic-event', 'e1', 200, 300);
    let n2 = new TreeNode('or-gate', 'e2', 150, 200);
    let n3 = new TreeNode('basic-event', 'e3', 300, 300);
    let n4 = new TreeNode('and-gate', 'e4', 200, 100);

    let e0 = new TreeEdge(0, n0, n2);
    let e1 = new TreeEdge(0, n1, n2);
    let e2 = new TreeEdge(0, n2, n4);
    let e3 = new TreeEdge(0, n3, n4);
    
    let a = ["A", "and", ["B", "C"]];
    let b = ["B", "or", ["1", "D"]];
    let c = ["D", "and", ["2", "3"]];
    let d = ["C", "or", ["2", "4"]];  
    let result = mocus([a, b, c, d], "A");
    // console.log(result);

    return {
      nodes: [n0, n1, n2, n3, n4],
      edges: [e0, e1, e2, e3],
    };
  }
}
