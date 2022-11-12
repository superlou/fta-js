import Component from '@glimmer/component';

export default class TreeNodeComponent extends Component {
  andPath = 'm -20,20 h 40 v -16 c 0,-30  -40,-30 -40, 0 z';
  orPath =
    'm -20,20 c 10,-10 30,-10 40,0 v -4 c 0,-20 -16,-36 -20,-36 c -4,0 -20,16 -20,36 z';
  basicElementPath = 'm -25,0 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0';

  get pathD() {
    if (this.args.nodeType == 'and-gate') {
      return this.andPath;
    } else if (this.args.nodeType == 'or-gate') {
      return this.orPath;
    } else if (this.args.nodeType == 'basic-event') {
      return this.basicElementPath;
    }
  }
}
