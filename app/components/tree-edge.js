import Component from '@glimmer/component';

export default class TreeEdgeComponent extends Component {
  edgeCurve = 50;

  get pathD() {
    let edgeCurve = this.edgeCurve;

    // get(...) is required to avoid error
    let startX = this.args.start.get('x');
    let startY = this.args.start.get('y');
    let finishX = this.args.finish.get('x');
    let finishY = this.args.finish.get('y');
    
    return (
      `M ${startX},${startY} ` +
      `C ${startX},${startY - edgeCurve}, ${finishX},${finishY + edgeCurve
      }, ${finishX},${finishY}`
    );
  }
}
