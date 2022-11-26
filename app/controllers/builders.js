import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class BuildersController extends Controller {
  @service store;

  @action
  createFaultTree() {
    let record = this.store.createRecord('fault-tree');
    record.save();
  }

  @action
  deleteFaultTree(faultTree) {
    for (let node of faultTree.nodes) {
      node.deleteRecord();
      node.save();  
    }
    
    for (let edge of faultTree.edges) {
      edge.deleteRecord();
      edge.save();  
    }
    
    faultTree.deleteRecord();
    faultTree.save();
  }
}
