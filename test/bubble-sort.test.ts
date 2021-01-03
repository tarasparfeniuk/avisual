import { BubbleSort } from '../src/model/bubble/BubbleSort';

const assert = require('assert');

describe('BubbleSort', function() {
  
  describe('#sort()', function() {
  
    it('should return sorted array', function() {
  
      const algo = new BubbleSort([2, 4, 1, 5, 3], (a, b) => a - b);

      assert.deepEqual(algo.sort(), [1, 2, 3, 4, 5]);
    });
  });
});
