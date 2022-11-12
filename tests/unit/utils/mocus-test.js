import {mocus, buildMocusTable, findMCS } from 'fta-js/utils/mocus';
import { module, test } from 'qunit';

module('Unit | Utility | mocus', function () {
  test('builds the mocus table', function(assert) {
    let a = ["A", "and", ["B", "C"]];
    let b = ["B", "or", ["1", "D"]];
    let c = ["D", "and", ["2", "3"]];
    let d = ["C", "or", ["2", "4"]];  
    
    let result = buildMocusTable([a, b, c, d], "A");
    assert.deepEqual(result, [['1', '2'],
                              ['2', '2', '3'],
                              ['1', '4'],
                              ['2', '4', '3']]);
  });
  
  test('finds minimum cutsets', function(assert) {
    let cutsets = [[1, 2], [2, 3], [1, 4], [2, 4, 3]]
    assert.deepEqual(findMCS(cutsets), [[1, 2],
                                        [2, 3],
                                        [1, 4]]);
  });
});
