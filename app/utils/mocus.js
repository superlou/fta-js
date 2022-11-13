function findGate(m, g) {
  let result = [null, null, null];
  
  m.every((row, x) => {
    return row.every((item, y) => {
      if (item in g) {
        result = [item, x, y];
        return false;
      } else {
        return true;
      }
    });
  });
  
  return result;
}

// Avoid https://stackoverflow.com/questions/13756482/create-copy-of-multi-dimensional-array-not-reference-javascript
function logNow(x) {
  console.log(JSON.parse(JSON.stringify(x)));
}

export function buildMocusTable(gates, top) {
  let g = {}
  
  gates.forEach(gate => 
    g[gate[0]] = gate
  );
    
  let m = [[top]];  // Table for MOCUS expansion 
  let [name, x, y] = findGate(m, g);
  
  while (name !== null) {
    let kind = g[name][1];
    let inputs = g[name][2];
    
    if (kind == "and") {
      m[x][y] = inputs[0];
      m[x] = m[x].concat(inputs.slice(1));
    } else if (kind == "or") {
      m[x][y] = inputs[0];
      inputs.slice(1).forEach(inp => {
        let new_row = [...m[x]];
        new_row[y] = inp;
        m = m.concat([new_row]);
      });
    }
    
    [name, x, y] = findGate(m, g);
  }
  
  return m;
}

/*
def get_mcs(cutsets):
    cutsets = sorted(cutsets, key=len)
    min_cutsets = []
    for cutset in cutsets:
        if not any(min_cutset.issubset(cutset) for min_cutset in min_cutsets):
            min_cutsets.append(cutset)
    
    return min_cutsets
*/

export function isSubset(subset, set) {
  let isSubset = [...subset].every(element => set.has(element));
  // console.log(subset, set, isSubset);
  return isSubset;
}

export function findMCS(cutsets) {
  cutsets = cutsets.map(row => new Set(row));  
  cutsets.sort((a, b) => a.size - b.size);
  
  let minCutsets = []  
    
  cutsets.forEach(cutset => {
    // Add the cutset to the minCutsets if none of the current minCutsets are a subset of it
    let isSubsetOfAnyMCS = minCutsets.map(minCutset => isSubset(minCutset, cutset));
    if (!isSubsetOfAnyMCS.some(item => item)) {
      minCutsets.push(cutset);
    }
  });

  return minCutsets.map(set => Array.from(set));
}

export default function mocus(gates, top) {
  let m = buildMocusTable(gates, top);
  
  logNow(m);
  
  return true;
}
