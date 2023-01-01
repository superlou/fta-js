import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class NodeEditorComponent extends Component {
  @action
  saveModel(evt) {
    this.activeModel.save();
  }

  @action
  saveTree(evt) {
    this.args.tree.save();
  }

  get disabled() {
    return this.args.model == null;
  }

  nodeTypes = ['and-gate', 'or-gate', 'basic-event', 'undeveloped-event'];

  @action changeNodeType(nodeType) {
    this.activeModel.nodeType = nodeType;
    this.saveModel();
  }
  
  get activeModel() {
    if (this.args.model.length > 0) {
      console.log(this.args.model.map(model => model.constructor.modelName));
      return this.args.model.at(-1);
    } else {
      return undefined;
    }
  }

  get showTreeEditor() {
    return !this.activeModel;
  }

  get showNodeEditor() {
    return (
      this.activeModel && this.activeModel.constructor.modelName === 'tree-node'
    );
  }

  get showEdgeEditor() {
    return (
      this.activeModel && this.activeModel.constructor.modelName === 'tree-edge'
    );
  }
}
