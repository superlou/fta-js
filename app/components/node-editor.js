import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class NodeEditorComponent extends Component {
  @action
  saveModel(evt) {
    this.args.model.save();
  }

  get disabled() {
    return this.args.model == null;
  }

  nodeTypes = ['and-gate', 'or-gate', 'basic-event'];

  @action changeNodeType(nodeType) {
    this.args.model.nodeType = nodeType;
    this.saveModel();
  }
  
  get showNodeEditor() {
    return this.args.model && this.args.model.constructor.modelName === "tree-node";
  }
  
  get showEdgeEditor() {
    return this.args.model && this.args.model.constructor.modelName === "tree-edge";
  }
}
