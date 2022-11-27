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
    try {
      for (let node of faultTree.nodes) {
        node.deleteRecord();
        node.save();  
      }  
    } catch (err) {
      console.warn('Skipping deletion of nodes because some of the associated records were not loaded.');
      console.warn(err);
    }
    
    try {
      for (let edge of faultTree.edges) {
        edge.deleteRecord();
        edge.save();  
      }
    } catch(err) {
      console.warn('Skipping deletion of edges because some of the associated records were not loaded.');
      console.warn(err);      
    }
    
    faultTree.deleteRecord();
    faultTree.save();
  }
}
