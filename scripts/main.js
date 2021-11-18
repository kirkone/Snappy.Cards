import {IO, O, R} from "./fp.js";
import {flow, identity, pipe} from "../vendor/pkg/fp-ts/es6/function.js";
import QRCodeStyling from "../vendor/pkg/qr-code-styling.js";
import {sequenceS} from "../vendor/pkg/fp-ts/es6/Apply.js";
const StringParamDecoder = identity;
const ImageParamDecoder = ({width, height, params}) => (input) => pipe(input, O.map((i) => i.startsWith("http") ? i : `https://source.unsplash.com/${i}/${width}x${height}?${new URLSearchParams(params)}`));
const urlParameters = {
  name: StringParamDecoder,
  phone: StringParamDecoder,
  mail: StringParamDecoder,
  web: StringParamDecoder,
  sub: StringParamDecoder,
  avatar: ImageParamDecoder({
    width: 100,
    height: 100,
    params: {face: ""}
  }),
  background: ImageParamDecoder({
    width: 1e3,
    height: 1e3,
    params: {blur: ""}
  })
};
const decodeParameters = (params) => pipe(urlParameters, R.mapWithIndex((name, decode) => pipe(params, R.lookup(name), decode)));
const isInstanceOf = (Cls) => (el) => el instanceof Cls;
const getEl = flow(document.querySelector.bind(document), O.fromNullable, IO.of);
const getHtmlEl = flow(getEl, IO.map(O.chain(O.fromPredicate(isInstanceOf(HTMLElement)))));
const getImgEl = flow(getEl, IO.map(O.chain(O.fromPredicate(isInstanceOf(HTMLImageElement)))));
const sequenceIO = sequenceS(IO.Apply);
const sequenceO = sequenceS(O.Apply);
const render = ({
  avatar,
  background,
  ...data
}) => () => {
  pipe(sequenceIO({
    body: getHtmlEl("body"),
    background: IO.of(background)
  }), IO.map(sequenceO), IO.map(O.map(({body, background: background2}) => body.style.backgroundImage = `url(${background2})`)))();
  pipe(sequenceIO({
    el: getHtmlEl("#avatar"),
    fillIn: getImgEl("#avatar > .fill-in"),
    src: IO.of(avatar)
  }), IO.map(sequenceO), IO.map(O.map(({fillIn, src, el}) => {
    fillIn.src = src;
    el.classList.add("visible");
  })))();
  pipe(data, R.mapWithIndex((key, value) => pipe(sequenceIO({
    el: getHtmlEl(`#${key}`),
    fillIn: getHtmlEl(`#${key} > .fill-in`),
    text: IO.of(value)
  }), IO.map(sequenceO), IO.map(O.map(({fillIn, text, el}) => {
    fillIn.innerText = text;
    el.classList.add("visible");
  })), (fillIn) => fillIn())));
};
const getParametersFromSearch = () => pipe(new URLSearchParams(document.location.search.substring(1)).entries(), Object.fromEntries);
const fillInValues = pipe(getParametersFromSearch, IO.map(decodeParameters), IO.chain(render));
const qrCode = new QRCodeStyling({
  width: 600,
  height: 600,
  type: "canvas",
  data: window.location.href,
  image: "",
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: "Byte",
    errorCorrectionLevel: "L"
  },
  dotsOptions: {
    color: "#000000",
    type: "rounded"
  },
  backgroundOptions: {
    color: "#ffffffaa"
  },
  cornersSquareOptions: {
    color: "#000000",
    type: "extra-rounded"
  },
  cornersDotOptions: {
    color: "#000000",
    type: "dot"
  }
});
window.addEventListener("DOMContentLoaded", () => {
  pipe(getHtmlEl("body > .content"), IO.map(O.map((content) => content.style.visibility = "visible")))();
  pipe(getHtmlEl("#qr"), IO.map(O.map((qr) => qrCode.append(qr))))();
  fillInValues();
});
