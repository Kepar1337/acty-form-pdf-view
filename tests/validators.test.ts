import assert from 'node:assert/strict';
import { isNonEmptyString } from '../lib/validators';

assert.equal(isNonEmptyString('hello'), true);
assert.equal(isNonEmptyString(''), false);
assert.equal(isNonEmptyString(123), false);

console.log('validators tests passed');
