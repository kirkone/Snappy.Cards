/**
 * The container type for a rectangle of bits
 * @typedef {Object} BitCanvas
 * @property {Array<number>} bits - The individual bit values
 * @property {number} canvasWidth
 * @property {number} canvasHeight
 */
export let BitCanvas;

/**
 * Instantiates a new BitCanvas
 * @param {number} canvasWidth - The width of the BitCanvas
 * @param {number} canvasHeight - The height of the BitCanvas
 * @param {number} startingValue - The value all the bits will start out as
 * @returns {BitCanvas}
 */
export function makeBitCanvas(canvasWidth, canvasHeight, startingValue) {
  return {
    bits: new Array(canvasWidth * canvasHeight).fill(startingValue),
    canvasWidth,
    canvasHeight,
  };
}

/**
 * Writes the given value to the desired location.
 * @param {BitCanvas} canvas - The canvas to write to
 * @param {number} x - The x-value to write to, if negative, starts from the right-edge
 * @param {number} y - The y-value to write to, if negative, starts from the bottom
 * @param {number} value - The value to write
 */
export function writeValue(canvas, x, y, value) {
  const { bits, canvasWidth, canvasHeight } = canvas;
  const row = y < 0 ? canvasHeight + y : y;
  const column = x < 0 ? canvasWidth + x : x;
  bits[row * canvasWidth + column] = value;
}

/**
 * Writes the given bits to the canvas. The bits are written left-to-right from most-significant to least-significant.
 * @param {BitCanvas} canvas - The canvas to write to
 * @param {number} x - The first x-value to write to, if negative, then it will start that many bits from the right
 * @param {number} y - The y-value for the horizontal line, if negative, starts from the bottom
 * @param {number} bits - The encoded bits, they are read to from the (numBits - 1) bit to the 0th bit
 * @param {number} numBits - The number of bits to encode
 * @param {Array<number>} interpretations - A [number, number] array, where the 0th index corresponds to what we write when encountering a 0 bit, and the 1th index a 1 bit.
 */
export function writeHorizontalRun(
  canvas,
  x,
  y,
  toWrite,
  numBits,
  interpretations
) {
  const { bits, canvasHeight, canvasWidth } = canvas;
  const row = y < 0 ? canvasHeight + y : y;
  const column = x < 0 ? canvasWidth + x : x;
  for (
    let i = row * canvasWidth + column, bitToRead = numBits - 1;
    bitToRead >= 0;
    bitToRead--, i++
  ) {
    bits[i] = interpretations[(toWrite >> bitToRead) & 1];
  }
}

/**
 * Writes the given bits to the canvas. The bits are written bottom-to-top from most-significant to least-significant.
 * @param {BitCanvas} canvas - The canvas to write to
 * @param {number} x - The x-value to write to, if negative, then it will be that many bits from the right
 * @param {number} y - The first y-value, if negative, starts from the bottom
 * @param {number} bits - The encoded bits, they are read to from the (numBits - 1) bit to the 0th bit
 * @param {number} numBits - The number of bits to encode
 * @param {Array<number>} interpretations - A [number, number] array, where the 0th index corresponds to what we write when encountering a 0 bit, and the 1th index a 1 bit.
 */
export function writeUpRun(canvas, x, y, toWrite, numBits, interpretations) {
  const { bits, canvasWidth, canvasHeight } = canvas;
  const row = y < 0 ? canvasHeight + y : y;
  const column = x < 0 ? canvasWidth + x : x;
  for (
    let i = row * canvasWidth + column, bitToRead = numBits - 1;
    bitToRead >= 0;
    bitToRead--, i -= canvasWidth
  ) {
    bits[i] = interpretations[(toWrite >> bitToRead) & 1];
  }
}
/**
 * Makes a string describing an svg path that draws on anything which shares a bit with the trigger flag
 * You can draw the resulting path by putting it in an svg path like `<path d=${result} />`
 * @param {BitCanvas} canvas - The bits to draw
 * @param {number} offsetX - What should be added to the x-value of each pixel
 * @param {number} offsetY - What should be added to the y-value of each pixel
 * @param {number} triggerFlag
 * @returns {string} The path definition
 */
export function makePath(canvas, offsetX, offsetY, triggerFlag) {
  const { canvasWidth, canvasHeight, bits } = canvas;
  const runs = [];
  for (let y = 0, i = 0; y < canvasHeight; y++) {
    let runLength = 0;
    for (let x = 0; x <= canvasWidth; x++) {
      if (x < canvasWidth && bits[i++] & triggerFlag) {
        runLength++;
      } else if (runLength) {
        runs.push(`M${offsetX + x - runLength} ${offsetY + y}.5 h${runLength}`);
        runLength = 0;
      }
    }
  }

  return runs.join(" ");
}
