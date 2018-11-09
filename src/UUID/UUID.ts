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
  makeVersionOneUUIDValues,
} from './makeVersionOneUUIDValues';
import {
  makeVersionThreeOrFiveUUIDValues,
} from './makeVersionThreeOrFiveUUIDValues';
import {
  strings,
} from '../strings';
import {
  uintArrayAsHex,
} from '../uintArrayAsHex';
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
import makeVersionFourUUIDValues from './makeVersionFourUUIDValues';
import makeVersionNilUUIDValues from './makeVersionNilUUIDValues';
import { mergeUUIDOptions } from './UUIDOptions/mergeUUIDOptions';

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
    const base = new UUIDOptions();
    const options = argOptions ? mergeUUIDOptions(base, argOptions) : base;

    let version = options.version.toString();
    if (!isUUIDVersion(version)) {
      throw new Error(strings.UUID_VERSION_INVALID);
    }

    if (!isNode() && version === UUIDVersions.One) {
      throw new Error(strings.VERSION_1_IN_BROWSER);
    }

    this.__version = version;

    if (version === UUIDVersions.One) {
      const {
        clockSequence,
        nodeIdentifier,
        shouldWrite,
        timestamp,
      } = makeVersionOneUUIDValues(options);

      if (shouldWrite) {
        writeNewResults(this);
      }

      this.__clockSequence = clockSequence;
      this.__nodeIdentifier = nodeIdentifier;
      this.__timestamp = timestamp;
    } else if (version === UUIDVersions.Three ||
               version === UUIDVersions.Five)
    {
      const {
        clockSequence,
        nodeIdentifier,
        timestamp,
      } = makeVersionThreeOrFiveUUIDValues(options);

      this.__clockSequence = clockSequence;
      this.__nodeIdentifier = nodeIdentifier;
      this.__timestamp = timestamp;  
    } else if (version === UUIDVersions.Four) {
      const {
        clockSequence,
        nodeIdentifier,
        timestamp,
      } = makeVersionFourUUIDValues(options);

      this.__clockSequence = clockSequence;
      this.__nodeIdentifier = nodeIdentifier;
      this.__timestamp = timestamp;
    } else {
      /* Nil */
      const {
        clockSequence,
        nodeIdentifier,
        timestamp,
      } = makeVersionNilUUIDValues();

      this.__clockSequence = clockSequence;
      this.__nodeIdentifier = nodeIdentifier;
      this.__timestamp = timestamp;
    }
  }

  /* istanbul ignore next */
  get id() {
    return this.toString();
  }

  /* Parsed into 4 bits. */
  private __version: UUIDVersions;
  get version(): UUIDVersions {
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
    const version = parseInt(this.version).toString(2);
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
    return this.clockSequence.slice(1);
  }

  /* 1 byte */
  get clockSequenceHigh(): Uint8Array {
    return this.clockSequence.slice(0, 1);
  }

  /* 4 bits. */
  /* istanbul ignore next */
  get reserved(): Uint8Array {
    return new Uint8Array([ 2, ]);
  }

  /* 1 byte. */
  get clockSequenceHighAndReserved(): Uint8Array {
    const clockHigh = uintArrayAsNumber(this.clockSequenceHigh).toString(2);
    /* istanbul ignore next */
    const reserved = this.version === UUIDVersions.Nil ?
      '0' :
      uintArrayAsNumber(this.reserved).toString(2);

    const byte = clockHigh.padStart(6, '0') + reserved.padStart(2, '0');
    return new Uint8Array([ parseInt(byte, 2), ]);
  }

  /* 6 bytes */
  private __nodeIdentifier: Uint8Array;
  get nodeIdentifier(): Uint8Array {
    return this.__nodeIdentifier;
  }

  /* text: e.g. '103314af-205e-0080-002b-7cd2a900a098' */
  static parse(text: string): IUUID {
    const split = text.split('-');
    if (split.length !== 5) {
      throw new Error(strings.UUID_STRING_INVALID);
    }

    const timeLow = split[0];
    const timeMid = split[1];
    const timeHighAndVersion = split[2];

    const timeHigh = timeHighAndVersion.slice(0, 3);
    const version = timeHighAndVersion[0];
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
      uintArrayAsHex(value)
        /* Pad any missing most-significant-digits. */
        .padStart(toPad, '0')
    );

    return (
      format(this.timeLow, 8) +
      '-' +
      format(this.timeMid, 4) +
      '-' +
      `${this.version}${format(this.timeHigh, 3)}` +
      '-' +
      `${format(this.clockSequenceHighAndReserved, 2)}${format(this.clockSequenceLow, 2)}` +
      '-' +
      format(this.nodeIdentifier, 12)
    );
  }
}

export default UUID;
