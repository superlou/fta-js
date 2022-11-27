import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TreeEdgeComponent extends Component {
  edgeCurve = 50;

  get pathD() {
    let edgeCurve = this.edgeCurve;

    let startX = this.args.model.child.x;
    let startY = this.args.model.child.y;
    let finishX = this.args.model.parent.x;
    let finishY = this.args.model.parent.y;

    return (
      `M ${startX},${startY} ` +
      `C ${startX},${startY - edgeCurve}, ${finishX},${
        finishY + edgeCurve
      }, ${finishX},${finishY}`
    );
  }
  
  @action
  onMousedown(evt) {
    this.args.onSelect(this.args.model);
    evt.stopPropagation();
  }
}
