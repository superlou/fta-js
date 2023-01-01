import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BuilderController extends Controller {
  @tracked selectedIds = [];  // Can't be a set because order matters
  queryParams = ['selectedIds'];

  @tracked focusProperty = null;

  @action
  setFocusProperty(property) {
    this.focusProperty = property;
  }

  @action
  select(item) {
    console.log(item.id);
    this.deselect(item);
    this.selectedIds.push(item.id);
    console.log(this.selectedIds);
  }

  @action
  deselect(item) {
    this.selectedIds = this.selectedIds.filter(id => id != item.id);
  }
  
  @action
  deselectAll() {
    this.selectedIds = [];
  }

  get selected() {
    let nodes = this.model.nodes;
    let edges = this.model.edges;
    let items = nodes.concat(edges);
    let idMap = Object.fromEntries(items.map(item => [item.id, item]));
    
    return this.selectedIds.map(id => idMap[id]);
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
    let svgHTML = this.styleSVG(svg);
    navigator.clipboard.writeText(svgHTML);
  }
   
  @action
  copyPng() {
    // From https://levelup.gitconnected.com/draw-an-svg-to-canvas-and-download-it-as-image-in-javascript-f7f7713cf81f
    // todo Fix this hackiness to get the SVG. This will break
    // if we ever have more than one SVG on the page.
    let svg = document.getElementsByTagName('svg')[0];
    let {width, height} = svg.getBBox();
    
    let outerHTML = this.styleSVG(svg);    
    
    let blob = new Blob([outerHTML], {type: 'image/svg+xml;charset=utf-8'});
    let url = window.url || window.webkitURL || window;
    let blobUrl = url.createObjectURL(blob);
    
    let img = new Image();
    
    // For onload to succeed, SVG must be valid. This requires version and xmlns
    // to be set on the SVG.
    img.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = svg.clientWidth;
      canvas.height = svg.clientHeight;
      let context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // ClipboardItem is not enabled by default in Firefox
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1619947
      // https://stackoverflow.com/questions/27863617/is-it-possible-to-copy-a-canvas-image-to-the-clipboard
      canvas.toBlob((blob) => {
        try {
          const item = new ClipboardItem({'image/png': blob}); 
          navigator.clipboard.write([item]);
        } catch (error) {
          console.error('Error creating ClipboardItem!');
          console.warn('On Firefox, be enabled in about:config dom.events.asyncClipboard.clipboardItem');
          console.error(error);
        }
      });
    };
    
    img.onerror = function(e) {
      console.log('Error loading SVG as source', e);
    }
    
    img.src = blobUrl;   
  }


  styleSVG(svg) {
    let parent = svg.parentNode;
    
    // Make a temporary svg to prepare for export.
    // It must be added to the DOM to get styles.
    svg = svg.cloneNode(true);
    parent.append(svg);
    
    // Width and height attributes required for rendering SVG image on Firefox
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=700533
    svg.setAttribute('width', svg.clientWidth);
    svg.setAttribute('height', svg.clientHeight);
    
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
    
    let svgHTML = svg.outerHTML;
    parent.removeChild(svg);
    return svgHTML;
  }  
}
