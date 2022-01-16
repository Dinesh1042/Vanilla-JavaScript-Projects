const SVG_REGEX_PATTERN = /[\r\n%#()<>?[\\\]^`{|}]/gm;

const curry =
  (fn) =>
  (...args) =>
    args.length >= fn.length ? fn.apply(null, args) : fn.bind(null, ...args);

const pipe =
  (...fns) =>
  (initialValue) =>
    fns.reduce((acc, val) => val(acc), initialValue);

const replace = curry((searchValue, replacer, string) => {
  return string.replace(searchValue, replacer);
});

// svg -> dataURI
export const encodeSvg = pipe(
  replace(SVG_REGEX_PATTERN, encodeURIComponent),
  replace(/"/g, "'"),
  replace(/(.*)/, 'data:image/svg+xml,$1')
);

// svg -> cssBackground
export const svgToCssBackGroundImage = pipe(
  encodeSvg,
  replace(/(.*)/, `background-image: url("$1");`)
);

// dataURI -> svg
export const decodeSvg = pipe(
  replace('data:image/svg+xml,', ''),
  replace(/"/g, "'"),
  decodeURIComponent
);

// dataURI -> cssBackground
export const dataURIToCssBackGroundImage = pipe(
  replace(/(.*)/, `background-image: url("$1");`)
);

export const validateSvg = (svgString) => {
  const regexExp = new RegExp(/<svg .*>.*<\/svg>/, 'g'); // TODO: Need to add more specific validation

  if (!regexExp.test(svgString)) throw new Error('Please enter a valid svg.');
  else return true;
};

export const validateDataURI = (dataURI) => {
  if (!dataURI.startsWith('data:image/svg+xml'))
    // TODO: Need to add more specific validation
    throw new Error('Please enter a valid DataURI.');
  else return true;
};
