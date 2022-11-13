import { buildMocusTable, findMCS, isSubset } from 'fta-js/utils/mocus';
import mocus from 'fta-js/utils/mocus';
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
    let result = findMCS(cutsets);
    assert.deepEqual(result, [[1, 2],
                              [2, 3],
                              [1, 4]]);
  });
  
  test('checks if subset', function(assert) {
    assert.true(isSubset(new Set([1, 2]), new Set([1, 2, 3])));
    assert.true(isSubset(new Set([1, 3]), new Set([1, 2, 3])));
    assert.true(isSubset(new Set([1, 2, 3]), new Set([1, 2, 3])));
    assert.false(isSubset(new Set([1, 4]), new Set([1, 2, 3])));
  });
  
  test('checks mocus', function(assert) {
    // todo These tests are brittle because order of result
    // shouldn't matter.
    let a = ["e4", "and", ["e2", "e3"]];
    let b = ["e2", "or", ["e0", "e1"]];
    let result = mocus([a, b], "e4");
    assert.deepEqual(result, [["e0", "e3"], ["e1", "e3"]]);
    
    a = ["e4", "or", ["e2", "e3"]];
    b = ["e2", "and", ["e0", "e1"]];
    result = mocus([a, b], "e4");
    assert.deepEqual(result, [["e3"], ["e0", "e1"]]);
    
    a = ["e4", "or", ["e2", "e3"]];
    b = ["e2", "or", ["e0", "e1", "e3"]];
    result = mocus([a, b], "e4");
    assert.deepEqual(result, [["e0"], ["e3"], ["e1"]]);    
  });
});
