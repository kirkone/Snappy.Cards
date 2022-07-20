/**
 * An enum representing the min (inclusive) qr version that uses certain
 * qr code bit character count indicators
 * @enum {number}
 */
export const QrLevelLength = {
  MID: 10,
  LONG: 27,
};

/**
 * 4-bit number indicating in which mode the following data
 * will be encoded
 * @enum {number}
 */
const QrDataMode = {
  ECI_UTF8: 0b0111,
  Numeric: 0b0001,
  Alphanumeric: 0b0010,
  Byte: 0b0100,
  Kanji: 0b1000,
  StructuredAppend: 0b0011,
  FNC1_POS1: 0b0101,
  FNC1_POS2: 0b1001,
  Terminator: 0b0000,
};

const CHAR_0 = 0x30;
const CHAR_9 = 0x39;
const CHAR_BACKSLASH = 0x5c;
const CHAR_TILDE = 0x7e;

/**
 * @typedef {{qrMode: QrDataMode, startIndex: number, endIndex: number, encoded: Array<number>, nextSegment: ?QrDataSegment}} QrDataSegment
 *  - A linked list piece of data representing the string
 */
export let QrDataSegment;

/**
 * @typedef {{numBits: number, segments: QrDataSegment}}
 */
export let SegmentedData;

/**
 * Processes the data and decides how to best segment it to achieve the smallest
 * qr code. TODO: At the moment, always encodes to utf8
 * @param {string} data - The data to encode into the qr-code
 * @returns {Array<SegmentedData>}
 */
export function segmentData(data) {
  const encoded = [];
  for (let i = 0; i < data.length; i++) {
    let codepoint = data.charCodeAt(i);
    if ((0xfc00 & codepoint) === 0xd800) {
      // note that this implicitly returns NaN if i === data.length - 1
      // which will get "correctly" encoded as the raw value in utf8
      // basically, if we run into lone surrogate pairs, we encode
      // them into the utf8, which may be undesirable behavior, but whatever
      const nextChar = data.charCodeAt(i + 1);

      if ((0xfc00 & nextChar) === 0xdc00) {
        i++;
        const rawBits = ((codepoint & 0x3ff) << 10) | (nextChar & 0x3ff);
        codepoint = rawBits + 0x10000;
      }
    }

    if (codepoint < 1 << 7) {
      encoded.push(codepoint);
    } else if (codepoint < 1 << 11) {
      encoded.push(0xc0 | (codepoint >> 6), 0x80 | (codepoint & 0x3f));
    } else if (codepoint < 1 << 16) {
      encoded.push(
        0xe0 | (codepoint >> 12),
        0x80 | ((codepoint >> 6) & 0x3f),
        0x80 | (codepoint & 0x3f)
      );
    } else {
      encoded.push(
        0xf0 | (codepoint >> 18),
        0x80 | ((codepoint >> 12) & 0x3f),
        0x80 | ((codepoint >> 6) & 0x3f),
        0x80 | (codepoint & 0x3f)
      );
    }
  }

  const segments = {
    qrMode: QrDataMode.ECI_UTF8,
    startIndex: 0,
    endIndex: data.length,
    encoded,
    nextSegment: null,
  };

  const BASE = 24 + 8 * encoded.length;
  return [
    { numBits: BASE, segments },
    { numBits: BASE + 8, segments },
    { numBits: BASE + 8, segments },
  ];
}

/**
 * Encodes the data
 * @param {number} numDataBytes - The number of bytes in the final array
 * @param {number} level - The level (0, 1, 2) of encoding, this decides how many bits to use in mode headers
 * @param {QrDataSegment} segments - The segments to encode
 */
export function encodeData(numDataBytes, level, segments) {
  const encoded = [];
  const appendBits = makeAppendBits(encoded);

  // TODO: atm assumes one segment that is a single utf8 segment
  const utf8 = segments.encoded;

  // append the segment header
  appendBits(16, 0b0111000110100100);
  appendBits(level ? 16 : 8, utf8.length);

  let i = 0;
  while (i < utf8.length) {
    appendBits(8, utf8[i++]);
  }

  i = -1;
  while (encoded.length < numDataBytes) {
    appendBits(8, ++i && (i & 1 ? 0b11101100 : 0b00010001));
  }

  return encoded;
}

function makeAppendBits(destination) {
  let currentByte = 0;
  let bitsUsedInByte = 0;

  function appendBits(numBits, data) {
    bitsUsedInByte += numBits;

    while (bitsUsedInByte >= 8) {
      bitsUsedInByte -= 8;
      destination.push(currentByte | ((data >> bitsUsedInByte) & 0xff));
      currentByte = 0;
    }

    // implicitly this code does nothing if bitsUsedInByte === 0
    const remainingMask = (1 << bitsUsedInByte) - 1;
    currentByte |= (data & remainingMask) << (8 - bitsUsedInByte);
  }

  return appendBits;
}
