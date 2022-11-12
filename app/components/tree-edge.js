import Component from '@glimmer/component';

export default class TreeEdgeComponent extends Component {
  edgeCurve = 50;

  get pathD() {
    let start = this.args.start;
    let finish = this.args.finish;
    let edgeCurve = this.edgeCurve;

    return (
      `M ${start.x},${start.y} ` +
      `C ${start.x},${start.y - edgeCurve}, ${finish.x},${
        finish.y + edgeCurve
      }, ${finish.x},${finish.y}`
    );
  }
}
