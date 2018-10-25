import {
  convertBinStrToUint8Array,
} from './convertBinStrToUint8Array';
import {
  getMAC,
} from './getMAC';
import {
  lastResults,
} from './lastResults';
import {
  randomBytesGenerator,
} from './randomBytesGenerator';
import {
  strings,
} from './strings';
import {
  TUUIDVersion,
} from './TypeAliases/TUUIDVersion';
import {
  UUIDVersions,
} from './Enums/UUIDVersions';

export function nodeIdentifierGetter(
  version: TUUIDVersion,
  hash?: string,
): Uint8Array
{
  let nodeIdentifier: Uint8Array;
  if (version.toString() === UUIDVersions.One) { /* Create the node ID from the system time. */
    if (lastResults.nodeIdentifier &&
        'BYTES_PER_ELEMENT' in lastResults.nodeIdentifier)
    {
      return lastResults.nodeIdentifier;
    }

    nodeIdentifier = getMAC();
    lastResults.nodeIdentifier = nodeIdentifier;
  } else if (/^[35]$/.test(version.toString())) {
    if (!hash) {
      throw new Error(strings.HASH_ARGUMENT_MISSING);
    }

    let nodeIdentifierStr = '';
    
    /* node_identifier */
    nodeIdentifierStr += hash.slice(20, 32);
    let nodeIdentifierBinStr = parseInt(nodeIdentifierStr, 16)
      .toString(2)
      .padStart(48, '0');

    /* Set the unicast/multicast bit (the least significant bit in the first
     * byte) to 1, for multicast. */
    nodeIdentifierBinStr =
      nodeIdentifierBinStr.slice(0, 7) +
      '1' +
      nodeIdentifierBinStr.slice(8); 

    nodeIdentifier = convertBinStrToUint8Array(nodeIdentifierBinStr);
  } else if (version.toString() === UUIDVersions.Four) {
    nodeIdentifier = randomBytesGenerator(6);
  } else {
    throw new Error(strings.UUID_VERSION_INVALID);
  }

  return nodeIdentifier;
}

export default nodeIdentifierGetter;
