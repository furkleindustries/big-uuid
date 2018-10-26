import {
  getHashFromNamespaceIdAndName,
} from '../getHashFromNamespaceIdAndName';
import {
  getLastResults,
} from '../getLastResults';
import {
  isNode,
} from '../isNode';
import {
  isUUIDVersion,
} from '../TypeGuards/isUUIDVersion';
import {
  IUUID,
} from './IUUID';
import {
  IUUIDOptions,
} from './UUIDOptions/IUUIDOptions';
import {
  strings,
} from '../strings';
import {
  TUUIDVersion,
} from '../TypeAliases/TUUIDVersion';
import {
  uintArrayAsNumber,
} from '../uintArrayAsNumber';
import {
  UUIDOptions,
} from './UUIDOptions/UUIDOptions';
import {
  UUIDVersions,
} from '../Enums/UUIDVersions';
import {
  writeNewResults,
} from '../writeNewResults';

/* The formal Augmented Backus-Naur Form grammar for UUIDs is as follows,
 * courtesy RFC-4112:
 * The formal definition of the UUID string representation is
 * provided by the following ABNF:
 *
 *    UUID                        = time-low "-" time-mid "-"
 *                                  time-high-and-version "-"
 *                                  clock-seq-high-and-reserved
 *                                  clock-seq-low "-" node
 *    time-low                    = 4hexOctet/8hexDigit
 *    time-mid                    = 2hexOctet/4hexDigit
 *    time-high-and-version       = 2hexOctet/4hexDigit
 *    clock-seq-high-and-reserved = hexOctet/2hexDigit
 *    clock-seq-low               = hexOctet/2hexDigit
 *    node                        = 6hexOctet/12hexDigit
 *    hexOctet                    = hexDigit hexDigit
 *    hexDigit =
 *          "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
 *          "a" / "b" / "c" / "d" / "e" / "f" /
 *          "A" / "B" / "C" / "D" / "E" / "F"
 */
export class UUID implements IUUID {
  constructor(argOptions?: Partial<IUUIDOptions>) {
    const options = new UUIDOptions();

    if (argOptions && typeof argOptions === 'object') {
      /* istanbul ignore else */
      if (argOptions.version) {
        options.version = argOptions.version;
      }

      if (typeof argOptions.clockSequenceGetter === 'function') {
        options.clockSequenceGetter = argOptions.clockSequenceGetter;
      }

      if (typeof argOptions.timestampGetter === 'function') {
        options.timestampGetter = argOptions.timestampGetter;
      }

      if (typeof argOptions.nodeIdentifierGetter === 'function') {
        options.nodeIdentifierGetter = argOptions.nodeIdentifierGetter;
      }

      if (/^[35]$/.test(options.version.toString())) {
        if (argOptions.namespaceId) {
          options.namespaceId = argOptions.namespaceId;
        }
  
        if (argOptions.name) {
          options.name = argOptions.name;
        }
      }
    }

    let version = options.version;
    if (!isUUIDVersion(version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }

    if (!isNode() && version.toString() === UUIDVersions.One) {
      throw new Error(strings.VERSION_1_IN_BROWSER);
    }

    this.__version = version;

    if (/^[35]$/.test(version.toString())) {
      if (!options.namespaceId) {
        throw new Error(strings.NAMESPACE_ID_MISSING);
      } else if (!options.name) {
        throw new Error(strings.NAME_MISSING);
      }

      const hash = getHashFromNamespaceIdAndName(
        version,
        options.namespaceId,
        options.name,
      );

      /* Clock sequence is highly dependent on other values and their 
       * availability, so it should be generated first. */
      const clockSequence = options.clockSequenceGetter(
        version,
        hash,
      );

      this.__clockSequence = clockSequence;
      
      const timestamp = options.timestampGetter(
        version,
        hash,
      );
      
      this.__timestamp = timestamp;

      const nodeIdentifier = options.nodeIdentifierGetter(
        version,
        hash,
      );

      this.__nodeIdentifier = nodeIdentifier;
    } else if (version.toString() === UUIDVersions.Nil) {
      this.__clockSequence = new Uint8Array([ 0, 0, ]);
      this.__timestamp = new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, ]);
      this.__nodeIdentifier = new Uint8Array(
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]
      );
    } else {
      /* v1 and v4 */
      const ts = options.timestampGetter(version);
      this.__timestamp = ts;

      const ni = options.nodeIdentifierGetter(version);
      this.__nodeIdentifier = ni;
      
      /* Obviously we can't serialize state to file in the browser. */
      if (isNode() && this.version.toString() === UUIDVersions.One) {
        const lastResults = getLastResults();
        if (uintArrayAsNumber(lastResults.nodeIdentifier) !== uintArrayAsNumber(ni)) {
          /* Create a random clock sequence if the node identifier has changed. */ 
          const cs = options.clockSequenceGetter(UUIDVersions.Four);
          this.__clockSequence = cs;
        } else {
          const cs = options.clockSequenceGetter(this.version);
          this.__clockSequence = cs;
        }

        let shouldWrite = false;
        if (!lastResults) {
          shouldWrite = true;
        } else {
          const oldTimestamp = lastResults.timestamp;
          const oldClockSequence = lastResults.clockSequence;
          /* Check if the last recorded timestamp is after the current time. */
          if ((oldTimestamp && 'BYTES_PER_ELEMENT' in oldTimestamp) &&
              (oldClockSequence && 'BYTES_PER_ELEMENT' in oldClockSequence))
          {
            const oldTimeInt = uintArrayAsNumber(oldTimestamp);
            const newTimeInt = uintArrayAsNumber(this.timestamp);
            if (oldTimeInt.greater(newTimeInt)) {
              /* Increment the clock sequence given that the timestamp is invalid. */
              this.__clockSequence[1] += 1;
              if (this.__clockSequence[1] === 0) {
                /* Increment the upper byte if the lower byte wrapped around. */
                this.__clockSequence[0] += 1;
              }
            }

            shouldWrite = true;
          } else if (
            uintArrayAsNumber(this.clockSequence).equals(uintArrayAsNumber(lastResults.clockSequence)) ||
            uintArrayAsNumber(this.nodeIdentifier).equals(uintArrayAsNumber(lastResults.nodeIdentifier)))
          {
            shouldWrite = true;
          }
        }

        if (shouldWrite) {
          writeNewResults(this);
        }
      } else {
        const clockSequence = options.clockSequenceGetter(version);
        this.__clockSequence = clockSequence;
      }
    }
  }

  /* Parsed into 4 bits. */
  private __version: TUUIDVersion;
  get version(): TUUIDVersion {
    return this.__version;
  }

  /* 60 bits */
  private __timestamp: Uint8Array;
  get timestamp(): Uint8Array {
    return this.__timestamp;
  }

  /* 4 bytes */
  get timeLow(): Uint8Array {
    const timeLow = this.timestamp.slice(4, 8);
    return timeLow;
  }

  /* 2 bytes */
  get timeMid(): Uint8Array {
    const timeMid = this.timestamp.slice(2, 4);
    return timeMid;
  }

  /* 12 bits */
  get timeHigh(): Uint8Array {
    const timeHigh = this.timestamp.slice(0, 2);
    return timeHigh;
  }

  /* 2 bytes */
  get timeHighAndVersion(): Uint8Array {
    const timeHigh = this.timeHigh;
    const version = this.version.toString() === UUIDVersions.Nil ?
      '0' :
      /* istanbul ignore next */
      parseInt(this.version.toString()).toString(2);

    const timeHighNum = uintArrayAsNumber(timeHigh).toString(2);
    const binStr = version.padStart(4, '0') + timeHighNum.padStart(12, '0');
    const firstByte = parseInt(binStr.slice(0, 8), 2);
    const secondByte = parseInt(binStr.slice(8, 16), 2);
    return new Uint8Array([ firstByte, secondByte, ]);
  }

  /* 14 bits */
  private __clockSequence: Uint8Array;
  get clockSequence(): Uint8Array {
    return this.__clockSequence;
  }

  /* 1 byte */
  get clockSequenceLow(): Uint8Array {
    return this.clockSequence.slice(0, 1);
  }

  /* 1 byte */
  get clockSequenceHigh(): Uint8Array {
    return this.clockSequence.slice(1);
  }

  /* 4 bits. */
  /* istanbul ignore next */
  get reserved(): Uint8Array {
    return new Uint8Array([ 2, ]);
  }

  get clockSequenceHighAndReserved(): Uint8Array {
    const clockHigh = uintArrayAsNumber(this.clockSequenceHigh).toString(2);
    const reserved = this.version.toString() === UUIDVersions.Nil ?
      '0' :
      /* istanbul ignore next */
      uintArrayAsNumber(this.reserved).toString(2);

    const byte = clockHigh.padStart(6, '0') + reserved.padStart(2, '0');
    return new Uint8Array([ parseInt(byte, 2), ]);
  }

  /* 6 bytes */
  private __nodeIdentifier: Uint8Array;
  get nodeIdentifier(): Uint8Array {
    return this.__nodeIdentifier;
  }

  /* text: e.g. 103314af-205e-0080-002b-7cd2a900a098 */
  static parse(text: string): IUUID {
    const split = text.split('-');
    if (split.length !== 5) {
      throw new Error(strings.UUID_STRING_INVALID);
    }

    const timeLow = split[0];
    const timeMid = split[1];
    const timeHighAndVersion = split[2];

    const timeHigh = timeHighAndVersion.slice(0, 3);
    const version = timeHighAndVersion[3] === '0' ?
      UUIDVersions.Nil :
      /* istanbul ignore next */
      timeHighAndVersion[3];
    const timestampHex = timeHigh + timeMid + timeLow;
    const timestampArr = [];
    for (let ii = 0; ii < 16; ii += 2) {
      timestampArr.push(parseInt(timestampHex.slice(ii, ii + 2), 16));
    }

    const timestamp = new Uint8Array(timestampArr);

    const clockSequenceHighAndReservedAndLow = split[3];
    const clockSequenceHighAndReservedHex =
      clockSequenceHighAndReservedAndLow.slice(0, 2);
    const clockSequenceHighHex =
      parseInt(
        parseInt(clockSequenceHighAndReservedHex, 16).toString(2).slice(2),
        2
      ).toString(16);

    const clockSequenceLowHex =
      clockSequenceHighAndReservedAndLow.slice(2, 4);

    const clockSequenceHex = clockSequenceLowHex + clockSequenceHighHex;
    const clockSequenceArr = [];
    for (let ii = 0; ii < 7; ii += 2) {
      clockSequenceArr.push(parseInt(clockSequenceHex.slice(ii, ii + 2), 16));
    }

    const clockSequence = new Uint8Array(clockSequenceArr);

    const nodeIdentifierHex = split[4];
    const nodeIdentifierArr = [];
    for (let ii = 0; ii < 12; ii += 2) {
      nodeIdentifierArr.push(parseInt(nodeIdentifierHex.slice(ii, ii + 2), 16));
    }

    const nodeIdentifier = new Uint8Array(nodeIdentifierArr);

    const obj = {
      __version: version,
      get version() {
        return obj.__version;
      },

      __timestamp: timestamp,
      get timestamp() {
        return obj.__timestamp;
      },

      __clockSequence: clockSequence,
      get clockSequence() {
        return obj.__clockSequence;
      },

      __nodeIdentifier: nodeIdentifier,
      get nodeIdentifier() {
        return obj.__nodeIdentifier;
      },
    };

    return Object.assign({}, this.prototype, obj);
  }

  toString(): string {
    const format = (value: Uint8Array, toPad: number) => (
      uintArrayAsNumber(value).toString(16)
        /* Pad any missing most-significant-digits. */
        .padStart(toPad, '0')
    );

    return (
      format(this.timeLow, 8) +
      '-' +
      format(this.timeMid, 4) +
      '-' +
      format(this.timeHighAndVersion, 4) +
      '-' +
      format(this.clockSequenceHighAndReserved, 2) +
      format(this.clockSequenceLow, 2) +
      '-' +
      format(this.nodeIdentifier, 12)
    );
  }
}

export default UUID;
