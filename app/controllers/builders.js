import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { JSONAPISerializer } from '@ember-data/serializer/json-api';

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
      console.warn(
        'Skipping deletion of nodes because some of the associated records were not loaded.'
      );
      console.warn(err);
    }

    try {
      for (let edge of faultTree.edges) {
        edge.deleteRecord();
        edge.save();
      }
    } catch (err) {
      console.warn(
        'Skipping deletion of edges because some of the associated records were not loaded.'
      );
      console.warn(err);
    }

    faultTree.deleteRecord();
    faultTree.save();
  }

  @action
  exportFaultTree(faultTree) {
    let json = this.createImportableJson(faultTree);

    let file = new Blob([JSON.stringify(json, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    let filename = `${faultTree.id}-${faultTree.title}.json`;

    let fileLink = document.createElement('a');
    fileLink.href = URL.createObjectURL(file);
    fileLink.download = filename;
    fileLink.click();
    fileLink.remove();
  }

  // This creates an export compatible with what Ember Local Storage Adapater
  // expects to import. This puts all records in data and doesn't use includes.
  createImportableJson(faultTree) {
    let json = faultTree.serialize({ includeId: true });
    json.data = [json.data];

    let related = faultTree.nodes.concat(faultTree.edges);
    json.data = json.data.concat(
      related.map((model) => model.serialize({ includeId: true }).data)
    );

    return json;
  }

  // This creates a more typical export for a single record, but isn't
  // compatible with what is expected for import.
  createJsonFromFaultTree(faultTree) {
    let json = faultTree.serialize({ includeId: true });
    let related = faultTree.nodes.concat(faultTree.edges);
    json.included = related.map(
      (model) => model.serialize({ includeId: true }).data
    );
    return json;
  }

  @action
  async importFaultTree(evt) {
    let reader = new FileReader();

    for (let filename of evt.target.files) {
      let blob = new Blob([filename], {
        type: 'application/json;charset=utf-8',
      });
      let json = await blob.text();

      this.importFaultTreeFromJson(json);
    }
  }

  importFaultTreeFromJson(json) {
    this.store.importData(json, {
      truncate: false,
    });
  }
}
