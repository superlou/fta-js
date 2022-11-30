import Component from '@glimmer/component';

export default class McsListComponent extends Component {
  get mcsSets() {
    let minCutSets = this.args.node.minCutSets;
    let tree = this.args.node.faultTree;

    let result = [];

    if (!minCutSets) {
      return '(not solved)';
    }

    for (const minCutSet of minCutSets) {
      let line = [];

      for (const id of minCutSet) {
        let node = tree.nodes.find((item) => item.id === id);
        if (node) {
          line.push(node.ref ? node.ref : id);
        } else {
          line.push('?');
        }
      }

      result.push(line);
    }

    return result;
  }
}
