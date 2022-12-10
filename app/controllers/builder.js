import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BuilderController extends Controller {
  @tracked selectedId = null;
  queryParams = ['selectedId'];

  @tracked focusProperty = null;

  @action
  setFocusProperty(property) {
    this.focusProperty = property;
  }

  @action
  select(item) {
    this.selectedId = item.id;
  }

  @action
  deselect(item) {
    this.selectedId = null;
  }

  get selected() {
    let nodes = this.model.nodes;
    let edges = this.model.edges;
    let items = nodes.concat(edges);
    return items.find((item) => item.id === this.selectedId);
  }

  wait(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }

  @action
  solveAll() {
    for (let node of this.model.nodes) {
      node.minCutSets = this.model.findMCS(node.id);
      node.save();
    }
  }
  
  @action
  copySvg() {
    // todo Fix this hackiness to get the SVG. This will break
    // if we ever have more than one SVG on the page.
    let svg = document.getElementsByTagName('svg')[0];
    let parent = svg.parentNode;
    
    // Make a temporary svg to prepare for export.
    // It must be added to the DOM to get styles.
    svg = svg.cloneNode(true);
    parent.append(svg);
    
    for (let el of svg.getElementsByTagName('path')) {
      const style = window.getComputedStyle(el);
      let properties = ['fill', 'stroke', 'stroke-width'];
      for (const property of properties) {
        el.style[property] = style[property];
      }
    }
 
    for (let el of svg.getElementsByTagName('text')) {
      const style = window.getComputedStyle(el);
      let properties = ['text-anchor', 'font-family', 'font-size'];
      for (const property of properties) {
        el.style[property] = style[property];
      }
    }
    
    navigator.clipboard.writeText(svg.outerHTML);
    parent.removeChild(svg);
  }
}
