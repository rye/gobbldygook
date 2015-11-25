import has from 'lodash/object/has'
import reject from 'lodash/collection/reject'

/**
 * Throws a ReferenceError if any requested key is missing.
 * @private
 * @param {Object} obj - the object with keys to check
 * @param {...string} listOfKeys - the list of keys to look for
 * @throws {ReferenceError} Param 'obj' must include all requested keys
 * @returns {void}
 */
export default function assertKeys(obj, ...listOfKeys) {
	const missingKeys = reject(listOfKeys, key => has(obj, key))
	if (missingKeys.length) {
		throw new ReferenceError(`assertKeys(): missing ${missingKeys.join(', ')} from ${JSON.stringify(obj)}`)
	}
}