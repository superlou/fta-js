import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class TreeNodeComponent extends Component {
  andPath = 'm -20,20 h 40 v -16 c 0,-30  -40,-30 -40, 0 z';
  orPath =
    'm -20,20 c 10,-10 30,-10 40,0 v -4 c 0,-20 -16,-36 -20,-36 c -4,0 -20,16 -20,36 z';
  basicElementPath = 'm -25,0 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0';

  @tracked wrappedDesc = this.args.model.desc;
  
  get pathD() {
    if (this.args.model.nodeType == 'and-gate') {
      return this.andPath;
    } else if (this.args.model.nodeType == 'or-gate') {
      return this.orPath;
    } else if (this.args.model.nodeType == 'basic-event') {
      return this.basicElementPath;
    }
  }
  
  wrapText(el, [desc, maxWidth]) {
    let padding = 0;
    let linePadding = 0;
        
    // Make hidden copy of this node to draw, measure, and calculate line breaks
    let testing = el.cloneNode(false);
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
    console.log(lines);

    testing.remove();    
    el.innerHTML = "";
    
    let lineCounter = 0;
    
    for (const line of lines) {
      let tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.textContent = line;
      tspan.setAttribute('x', 0);
      tspan.setAttribute('dy', "1.2em");
      el.appendChild(tspan);
      lineCounter++;
    }
    
    let bbox = el.getBBox();
    
    // Adjust the background rectangle
    let rect = el.previousElementSibling;
    console.log(rect);
    rect.setAttribute('x', -8);
    rect.setAttribute('y', -2);
    rect.setAttribute('width', bbox.width + 16);
    rect.setAttribute('height', bbox.height + 10);

    if (desc) {
      rect.setAttribute('display', null);
    } else {
      rect.setAttribute('display', 'none');
    }
    
    // Shift the content to align with the top of the node
    let g = el.parentElement;
    let xOffset = -bbox.width/2
    let yOffset = -bbox.height - 40;
    g.setAttribute('transform', `translate(${xOffset}, ${yOffset})`);
  }
}
