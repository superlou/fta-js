import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TreeNodeComponent extends Component {
  andPath = 'm -20,20 h 40 v -16 c 0,-30  -40,-30 -40, 0 z';
  orPath =
    'm -20,20 c 10,-10 30,-10 40,0 v -4 c 0,-20 -16,-36 -20,-36 c -4,0 -20,16 -20,36 z';
  basicEventPath = 'm -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0';

  @tracked wrappedDesc = this.args.model.desc;
   
  @action
  onMousedown(evt) {
    this.args.onSelect(this.args.model);
    evt.stopPropagation();
  }
  
  get pathD() {
    if (this.args.model.nodeType == 'and-gate') {
      return this.andPath;
    } else if (this.args.model.nodeType == 'or-gate') {
      return this.orPath;
    } else if (this.args.model.nodeType == 'basic-event') {
      return this.basicEventPath;
    }
  }
  
  wrapText(el, [desc, maxWidth]) {
    let rectEl = el.firstElementChild;
    let textEl = rectEl.nextElementSibling;
    let padding = 0;
    let linePadding = 0;
        
    // Make hidden copy of this node to draw, measure, and calculate line breaks
    let testing = textEl.cloneNode(false);
    testing.setAttributeNS(null, 'visibility', 'hidden');
    let testingTSpan = document.createElementNS(null, 'tspan');
    let testingTextNode = document.createTextNode(desc);
    testingTSpan.appendChild(testingTextNode);
    testing.appendChild(testingTSpan);
    
    let tester = document.getElementsByTagName('svg')[0].appendChild(testing);
    
    let words = desc.split(" ");
    let prevLine = "";
    let line = "";
    let lines = [];
    let testWidth;
    
    for (let n = 0; n < words.length; n++) {
      line = prevLine + words[n] + " ";
      testing.textContent = line;
      testWidth = testing.getBBox().width;
      
      if (testWidth > maxWidth) {
        lines.push(prevLine);
        prevLine = words[n] + " ";
      } else {
        prevLine = line;
      }
    }
    
    lines.push(prevLine);

    testing.remove();    
    textEl.innerHTML = "";
    
    let lineCounter = 0;
    
    for (const line of lines) {
      let tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.textContent = line;
      tspan.setAttribute('x', 0);
      tspan.setAttribute('dy', "1.2em");
      textEl.appendChild(tspan);
      lineCounter++;
    }
    
    let bbox = textEl.getBBox();
    
    // Adjust the background rectangle
    rectEl.setAttribute('x', -8);
    rectEl.setAttribute('y', -2);
    rectEl.setAttribute('width', bbox.width + 16);
    rectEl.setAttribute('height', bbox.height + 10);

    if (desc) {
      rectEl.setAttribute('display', null);
    } else {
      rectEl.setAttribute('display', 'none');
    }
    
    // Shift the content to align with the top of the node
    let xOffset = -bbox.width/2
    let yOffset = -bbox.height - 40;
    el.setAttribute('transform', `translate(${xOffset}, ${yOffset})`);
  }
}
