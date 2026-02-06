(globalThis["webpackChunkcheckout_for_woocommerce"] = globalThis["webpackChunkcheckout_for_woocommerce"] || []).push([["vendors-checkout-order-pay-thank-you-side-cart"],{

/***/ "./node_modules/.pnpm/@bedrock-layout+use-forwarded-ref@1.6.1_react@18.3.1/node_modules/@bedrock-layout/use-forwarded-ref/lib/index.m.js":
/*!***********************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@bedrock-layout+use-forwarded-ref@1.6.1_react@18.3.1/node_modules/@bedrock-layout/use-forwarded-ref/lib/index.m.js ***!
  \***********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ o),
/* harmony export */   useForwardedRef: () => (/* binding */ o)
/* harmony export */ });
/* harmony import */ var _bedrock_layout_use_stateful_ref__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @bedrock-layout/use-stateful-ref */ "./node_modules/.pnpm/@bedrock-layout+use-stateful-ref@1.4.1_react@18.3.1/node_modules/@bedrock-layout/use-stateful-ref/lib/index.m.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


function o(t, u = { isStateful: !0 }) {
  const n = (0,_bedrock_layout_use_stateful_ref__WEBPACK_IMPORTED_MODULE_0__.useStatefulRef)(null), f = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null), e = u.isStateful ? n : f;
  return react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
    !t || (typeof t == "function" ? t(e.current) : t.current = e.current);
  }), e;
}



/***/ }),

/***/ "./node_modules/.pnpm/@bedrock-layout+use-stateful-ref@1.4.1_react@18.3.1/node_modules/@bedrock-layout/use-stateful-ref/lib/index.m.js":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@bedrock-layout+use-stateful-ref@1.4.1_react@18.3.1/node_modules/@bedrock-layout/use-stateful-ref/lib/index.m.js ***!
  \*********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ s),
/* harmony export */   useStatefulRef: () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function s(c = null) {
  let [e, f] = react__WEBPACK_IMPORTED_MODULE_0___default().useState(c);
  const { current: r } = react__WEBPACK_IMPORTED_MODULE_0___default().useRef({
    current: e
  });
  return Object.defineProperty(r, "current", {
    get: () => e,
    set: (t) => {
      Object.is(e, t) || (e = t, f(t));
    }
  }), r;
}



/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/create-interpolate-element.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/create-interpolate-element.js ***!
  \*********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./react */ "react");
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_react__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Internal dependencies
 */


/**
 * Object containing a React element.
 *
 * @typedef {import('react').ReactElement} Element
 */

let indoc, offset, output, stack;

/**
 * Matches tags in the localized string
 *
 * This is used for extracting the tag pattern groups for parsing the localized
 * string and along with the map converting it to a react element.
 *
 * There are four references extracted using this tokenizer:
 *
 * match: Full match of the tag (i.e. <strong>, </strong>, <br/>)
 * isClosing: The closing slash, if it exists.
 * name: The name portion of the tag (strong, br) (if )
 * isSelfClosed: The slash on a self closing tag, if it exists.
 *
 * @type {RegExp}
 */
const tokenizer = /<(\/)?(\w+)\s*(\/)?>/g;

/**
 * The stack frame tracking parse progress.
 *
 * @typedef Frame
 *
 * @property {Element}   element            A parent element which may still have
 * @property {number}    tokenStart         Offset at which parent element first
 *                                          appears.
 * @property {number}    tokenLength        Length of string marking start of parent
 *                                          element.
 * @property {number}    [prevOffset]       Running offset at which parsing should
 *                                          continue.
 * @property {number}    [leadingTextStart] Offset at which last closing element
 *                                          finished, used for finding text between
 *                                          elements.
 * @property {Element[]} children           Children.
 */

/**
 * Tracks recursive-descent parse state.
 *
 * This is a Stack frame holding parent elements until all children have been
 * parsed.
 *
 * @private
 * @param {Element} element            A parent element which may still have
 *                                     nested children not yet parsed.
 * @param {number}  tokenStart         Offset at which parent element first
 *                                     appears.
 * @param {number}  tokenLength        Length of string marking start of parent
 *                                     element.
 * @param {number}  [prevOffset]       Running offset at which parsing should
 *                                     continue.
 * @param {number}  [leadingTextStart] Offset at which last closing element
 *                                     finished, used for finding text between
 *                                     elements.
 *
 * @return {Frame} The stack frame tracking parse progress.
 */
function createFrame(element, tokenStart, tokenLength, prevOffset, leadingTextStart) {
  return {
    element,
    tokenStart,
    tokenLength,
    prevOffset,
    leadingTextStart,
    children: []
  };
}

/**
 * This function creates an interpolated element from a passed in string with
 * specific tags matching how the string should be converted to an element via
 * the conversion map value.
 *
 * @example
 * For example, for the given string:
 *
 * "This is a <span>string</span> with <a>a link</a> and a self-closing
 * <CustomComponentB/> tag"
 *
 * You would have something like this as the conversionMap value:
 *
 * ```js
 * {
 *     span: <span />,
 *     a: <a href={ 'https://github.com' } />,
 *     CustomComponentB: <CustomComponent />,
 * }
 * ```
 *
 * @param {string}                  interpolatedString The interpolation string to be parsed.
 * @param {Record<string, Element>} conversionMap      The map used to convert the string to
 *                                                     a react element.
 * @throws {TypeError}
 * @return {Element}  A wp element.
 */
const createInterpolateElement = (interpolatedString, conversionMap) => {
  indoc = interpolatedString;
  offset = 0;
  output = [];
  stack = [];
  tokenizer.lastIndex = 0;
  if (!isValidConversionMap(conversionMap)) {
    throw new TypeError('The conversionMap provided is not valid. It must be an object with values that are React Elements');
  }
  do {
    // twiddle our thumbs
  } while (proceed(conversionMap));
  return (0,_react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, ...output);
};

/**
 * Validate conversion map.
 *
 * A map is considered valid if it's an object and every value in the object
 * is a React Element
 *
 * @private
 *
 * @param {Object} conversionMap The map being validated.
 *
 * @return {boolean}  True means the map is valid.
 */
const isValidConversionMap = conversionMap => {
  const isObject = typeof conversionMap === 'object';
  const values = isObject && Object.values(conversionMap);
  return isObject && values.length && values.every(element => (0,_react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(element));
};

/**
 * This is the iterator over the matches in the string.
 *
 * @private
 *
 * @param {Object} conversionMap The conversion map for the string.
 *
 * @return {boolean} true for continuing to iterate, false for finished.
 */
function proceed(conversionMap) {
  const next = nextToken();
  const [tokenType, name, startOffset, tokenLength] = next;
  const stackDepth = stack.length;
  const leadingTextStart = startOffset > offset ? offset : null;
  if (!conversionMap[name]) {
    addText();
    return false;
  }
  switch (tokenType) {
    case 'no-more-tokens':
      if (stackDepth !== 0) {
        const {
          leadingTextStart: stackLeadingText,
          tokenStart
        } = stack.pop();
        output.push(indoc.substr(stackLeadingText, tokenStart));
      }
      addText();
      return false;
    case 'self-closed':
      if (0 === stackDepth) {
        if (null !== leadingTextStart) {
          output.push(indoc.substr(leadingTextStart, startOffset - leadingTextStart));
        }
        output.push(conversionMap[name]);
        offset = startOffset + tokenLength;
        return true;
      }

      // Otherwise we found an inner element.
      addChild(createFrame(conversionMap[name], startOffset, tokenLength));
      offset = startOffset + tokenLength;
      return true;
    case 'opener':
      stack.push(createFrame(conversionMap[name], startOffset, tokenLength, startOffset + tokenLength, leadingTextStart));
      offset = startOffset + tokenLength;
      return true;
    case 'closer':
      // If we're not nesting then this is easy - close the block.
      if (1 === stackDepth) {
        closeOuterElement(startOffset);
        offset = startOffset + tokenLength;
        return true;
      }

      // Otherwise we're nested and we have to close out the current
      // block and add it as a innerBlock to the parent.
      const stackTop = stack.pop();
      const text = indoc.substr(stackTop.prevOffset, startOffset - stackTop.prevOffset);
      stackTop.children.push(text);
      stackTop.prevOffset = startOffset + tokenLength;
      const frame = createFrame(stackTop.element, stackTop.tokenStart, stackTop.tokenLength, startOffset + tokenLength);
      frame.children = stackTop.children;
      addChild(frame);
      offset = startOffset + tokenLength;
      return true;
    default:
      addText();
      return false;
  }
}

/**
 * Grabs the next token match in the string and returns it's details.
 *
 * @private
 *
 * @return {Array}  An array of details for the token matched.
 */
function nextToken() {
  const matches = tokenizer.exec(indoc);
  // We have no more tokens.
  if (null === matches) {
    return ['no-more-tokens'];
  }
  const startedAt = matches.index;
  const [match, isClosing, name, isSelfClosed] = matches;
  const length = match.length;
  if (isSelfClosed) {
    return ['self-closed', name, startedAt, length];
  }
  if (isClosing) {
    return ['closer', name, startedAt, length];
  }
  return ['opener', name, startedAt, length];
}

/**
 * Pushes text extracted from the indoc string to the output stack given the
 * current rawLength value and offset (if rawLength is provided ) or the
 * indoc.length and offset.
 *
 * @private
 */
function addText() {
  const length = indoc.length - offset;
  if (0 === length) {
    return;
  }
  output.push(indoc.substr(offset, length));
}

/**
 * Pushes a child element to the associated parent element's children for the
 * parent currently active in the stack.
 *
 * @private
 *
 * @param {Frame} frame The Frame containing the child element and it's
 *                      token information.
 */
function addChild(frame) {
  const {
    element,
    tokenStart,
    tokenLength,
    prevOffset,
    children
  } = frame;
  const parent = stack[stack.length - 1];
  const text = indoc.substr(parent.prevOffset, tokenStart - parent.prevOffset);
  if (text) {
    parent.children.push(text);
  }
  parent.children.push((0,_react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(element, null, ...children));
  parent.prevOffset = prevOffset ? prevOffset : tokenStart + tokenLength;
}

/**
 * This is called for closing tags. It creates the element currently active in
 * the stack.
 *
 * @private
 *
 * @param {number} endOffset Offset at which the closing tag for the element
 *                           begins in the string. If this is greater than the
 *                           prevOffset attached to the element, then this
 *                           helps capture any remaining nested text nodes in
 *                           the element.
 */
function closeOuterElement(endOffset) {
  const {
    element,
    leadingTextStart,
    prevOffset,
    tokenStart,
    children
  } = stack.pop();
  const text = endOffset ? indoc.substr(prevOffset, endOffset - prevOffset) : indoc.substr(prevOffset);
  if (text) {
    children.push(text);
  }
  if (null !== leadingTextStart) {
    output.push(indoc.substr(leadingTextStart, tokenStart - leadingTextStart));
  }
  output.push((0,_react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(element, null, ...children));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createInterpolateElement);
//# sourceMappingURL=create-interpolate-element.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/index.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/index.js ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Children: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.Children),
/* harmony export */   Component: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.Component),
/* harmony export */   Fragment: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.Fragment),
/* harmony export */   Platform: () => (/* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   PureComponent: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.PureComponent),
/* harmony export */   RawHTML: () => (/* reexport safe */ _raw_html__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   StrictMode: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.StrictMode),
/* harmony export */   Suspense: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.Suspense),
/* harmony export */   cloneElement: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.cloneElement),
/* harmony export */   concatChildren: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.concatChildren),
/* harmony export */   createContext: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.createContext),
/* harmony export */   createElement: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.createElement),
/* harmony export */   createInterpolateElement: () => (/* reexport safe */ _create_interpolate_element__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   createPortal: () => (/* reexport safe */ _react_platform__WEBPACK_IMPORTED_MODULE_2__.createPortal),
/* harmony export */   createRef: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.createRef),
/* harmony export */   createRoot: () => (/* reexport safe */ _react_platform__WEBPACK_IMPORTED_MODULE_2__.createRoot),
/* harmony export */   findDOMNode: () => (/* reexport safe */ _react_platform__WEBPACK_IMPORTED_MODULE_2__.findDOMNode),
/* harmony export */   flushSync: () => (/* reexport safe */ _react_platform__WEBPACK_IMPORTED_MODULE_2__.flushSync),
/* harmony export */   forwardRef: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.forwardRef),
/* harmony export */   hydrate: () => (/* reexport safe */ _react_platform__WEBPACK_IMPORTED_MODULE_2__.hydrate),
/* harmony export */   hydrateRoot: () => (/* reexport safe */ _react_platform__WEBPACK_IMPORTED_MODULE_2__.hydrateRoot),
/* harmony export */   isEmptyElement: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.isEmptyElement),
/* harmony export */   isValidElement: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.isValidElement),
/* harmony export */   lazy: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.lazy),
/* harmony export */   memo: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.memo),
/* harmony export */   render: () => (/* reexport safe */ _react_platform__WEBPACK_IMPORTED_MODULE_2__.render),
/* harmony export */   renderToString: () => (/* reexport safe */ _serialize__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   startTransition: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.startTransition),
/* harmony export */   switchChildrenNodeName: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.switchChildrenNodeName),
/* harmony export */   unmountComponentAtNode: () => (/* reexport safe */ _react_platform__WEBPACK_IMPORTED_MODULE_2__.unmountComponentAtNode),
/* harmony export */   useCallback: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useCallback),
/* harmony export */   useContext: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useContext),
/* harmony export */   useDebugValue: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useDebugValue),
/* harmony export */   useDeferredValue: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useDeferredValue),
/* harmony export */   useEffect: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useEffect),
/* harmony export */   useId: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useId),
/* harmony export */   useImperativeHandle: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useImperativeHandle),
/* harmony export */   useInsertionEffect: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useInsertionEffect),
/* harmony export */   useLayoutEffect: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect),
/* harmony export */   useMemo: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useMemo),
/* harmony export */   useReducer: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useReducer),
/* harmony export */   useRef: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useRef),
/* harmony export */   useState: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useState),
/* harmony export */   useSyncExternalStore: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useSyncExternalStore),
/* harmony export */   useTransition: () => (/* reexport safe */ _react__WEBPACK_IMPORTED_MODULE_1__.useTransition)
/* harmony export */ });
/* harmony import */ var _create_interpolate_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-interpolate-element */ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/create-interpolate-element.js");
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./react */ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/react.js");
/* harmony import */ var _react_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./react-platform */ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/react-platform.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/utils.js");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./platform */ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/platform.js");
/* harmony import */ var _serialize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./serialize */ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/serialize.js");
/* harmony import */ var _raw_html__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./raw-html */ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/raw-html.js");







//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/platform.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/platform.js ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Parts of this source were derived and modified from react-native-web,
 * released under the MIT license.
 *
 * Copyright (c) 2016-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 */
const Platform = {
  OS: 'web',
  select: spec => 'web' in spec ? spec.web : spec.default,
  isWeb: true
};
/**
 * Component used to detect the current Platform being used.
 * Use Platform.OS === 'web' to detect if running on web enviroment.
 *
 * This is the same concept as the React Native implementation.
 *
 * @see https://reactnative.dev/docs/platform-specific-code#platform-module
 *
 * Here is an example of how to use the select method:
 * @example
 * ```js
 * import { Platform } from '@wordpress/element';
 *
 * const placeholderLabel = Platform.select( {
 *   native: __( 'Add media' ),
 *   web: __( 'Drag images, upload new ones or select files from your library.' ),
 * } );
 * ```
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Platform);
//# sourceMappingURL=platform.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/raw-html.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/raw-html.js ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RawHTML)
/* harmony export */ });
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./react */ "react");
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_react__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Internal dependencies
 */


/** @typedef {{children: string} & import('react').ComponentPropsWithoutRef<'div'>} RawHTMLProps */

/**
 * Component used as equivalent of Fragment with unescaped HTML, in cases where
 * it is desirable to render dangerous HTML without needing a wrapper element.
 * To preserve additional props, a `div` wrapper _will_ be created if any props
 * aside from `children` are passed.
 *
 * @param {RawHTMLProps} props Children should be a string of HTML or an array
 *                             of strings. Other props will be passed through
 *                             to the div wrapper.
 *
 * @return {JSX.Element} Dangerously-rendering component.
 */
function RawHTML({
  children,
  ...props
}) {
  let rawHtml = '';

  // Cast children as an array, and concatenate each element if it is a string.
  _react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children).forEach(child => {
    if (typeof child === 'string' && child.trim() !== '') {
      rawHtml += child;
    }
  });

  // The `div` wrapper will be stripped by the `renderElement` serializer in
  // `./serialize.js` unless there are non-children props present.
  return (0,_react__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    dangerouslySetInnerHTML: {
      __html: rawHtml
    },
    ...props
  });
}
//# sourceMappingURL=raw-html.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/react-platform.js":
/*!*********************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/react-platform.js ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPortal: () => (/* reexport safe */ react_dom__WEBPACK_IMPORTED_MODULE_0__.createPortal),
/* harmony export */   createRoot: () => (/* reexport safe */ react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot),
/* harmony export */   findDOMNode: () => (/* reexport safe */ react_dom__WEBPACK_IMPORTED_MODULE_0__.findDOMNode),
/* harmony export */   flushSync: () => (/* reexport safe */ react_dom__WEBPACK_IMPORTED_MODULE_0__.flushSync),
/* harmony export */   hydrate: () => (/* reexport safe */ react_dom__WEBPACK_IMPORTED_MODULE_0__.hydrate),
/* harmony export */   hydrateRoot: () => (/* reexport safe */ react_dom_client__WEBPACK_IMPORTED_MODULE_1__.hydrateRoot),
/* harmony export */   render: () => (/* reexport safe */ react_dom__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   unmountComponentAtNode: () => (/* reexport safe */ react_dom__WEBPACK_IMPORTED_MODULE_0__.unmountComponentAtNode)
/* harmony export */ });
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js");
/**
 * External dependencies
 */



/**
 * Creates a portal into which a component can be rendered.
 *
 * @see https://github.com/facebook/react/issues/10309#issuecomment-318433235
 *
 * @param {import('react').ReactElement} child     Any renderable child, such as an element,
 *                                                 string, or fragment.
 * @param {HTMLElement}                  container DOM node into which element should be rendered.
 */


/**
 * Finds the dom node of a React component.
 *
 * @param {import('react').ComponentType} component Component's instance.
 */


/**
 * Forces React to flush any updates inside the provided callback synchronously.
 *
 * @param {Function} callback Callback to run synchronously.
 */


/**
 * Renders a given element into the target DOM node.
 *
 * @deprecated since WordPress 6.2.0. Use `createRoot` instead.
 * @see https://react.dev/reference/react-dom/render
 */


/**
 * Hydrates a given element into the target DOM node.
 *
 * @deprecated since WordPress 6.2.0. Use `hydrateRoot` instead.
 * @see https://react.dev/reference/react-dom/hydrate
 */


/**
 * Creates a new React root for the target DOM node.
 *
 * @since 6.2.0 Introduced in WordPress core.
 * @see https://react.dev/reference/react-dom/client/createRoot
 */


/**
 * Creates a new React root for the target DOM node and hydrates it with a pre-generated markup.
 *
 * @since 6.2.0 Introduced in WordPress core.
 * @see https://react.dev/reference/react-dom/client/hydrateRoot
 */


/**
 * Removes any mounted element from the target DOM node.
 *
 * @deprecated since WordPress 6.2.0. Use `root.unmount()` instead.
 * @see https://react.dev/reference/react-dom/unmountComponentAtNode
 */

//# sourceMappingURL=react-platform.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/react.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/react.js ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Children: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.Children),
/* harmony export */   Component: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.Component),
/* harmony export */   Fragment: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.Fragment),
/* harmony export */   PureComponent: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.PureComponent),
/* harmony export */   StrictMode: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.StrictMode),
/* harmony export */   Suspense: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.Suspense),
/* harmony export */   cloneElement: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.cloneElement),
/* harmony export */   concatChildren: () => (/* binding */ concatChildren),
/* harmony export */   createContext: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.createContext),
/* harmony export */   createElement: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.createElement),
/* harmony export */   createRef: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.createRef),
/* harmony export */   forwardRef: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.forwardRef),
/* harmony export */   isValidElement: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.isValidElement),
/* harmony export */   lazy: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.lazy),
/* harmony export */   memo: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.memo),
/* harmony export */   startTransition: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.startTransition),
/* harmony export */   switchChildrenNodeName: () => (/* binding */ switchChildrenNodeName),
/* harmony export */   useCallback: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useCallback),
/* harmony export */   useContext: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useContext),
/* harmony export */   useDebugValue: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useDebugValue),
/* harmony export */   useDeferredValue: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useDeferredValue),
/* harmony export */   useEffect: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useEffect),
/* harmony export */   useId: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useId),
/* harmony export */   useImperativeHandle: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle),
/* harmony export */   useInsertionEffect: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useInsertionEffect),
/* harmony export */   useLayoutEffect: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect),
/* harmony export */   useMemo: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useMemo),
/* harmony export */   useReducer: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useReducer),
/* harmony export */   useRef: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useRef),
/* harmony export */   useState: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useState),
/* harmony export */   useSyncExternalStore: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore),
/* harmony export */   useTransition: () => (/* reexport safe */ react__WEBPACK_IMPORTED_MODULE_0__.useTransition)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/**
 * External dependencies
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-imports


/**
 * Object containing a React element.
 *
 * @typedef {import('react').ReactElement} Element
 */

/**
 * Object containing a React component.
 *
 * @typedef {import('react').ComponentType} ComponentType
 */

/**
 * Object containing a React synthetic event.
 *
 * @typedef {import('react').SyntheticEvent} SyntheticEvent
 */

/**
 * Object containing a React synthetic event.
 *
 * @template T
 * @typedef {import('react').RefObject<T>} RefObject<T>
 */

/**
 * Object that provides utilities for dealing with React children.
 */


/**
 * Creates a copy of an element with extended props.
 *
 * @param {Element} element Element
 * @param {?Object} props   Props to apply to cloned element
 *
 * @return {Element} Cloned element.
 */


/**
 * A base class to create WordPress Components (Refs, state and lifecycle hooks)
 */


/**
 * Creates a context object containing two components: a provider and consumer.
 *
 * @param {Object} defaultValue A default data stored in the context.
 *
 * @return {Object} Context object.
 */


/**
 * Returns a new element of given type. Type can be either a string tag name or
 * another function which itself returns an element.
 *
 * @param {?(string|Function)} type     Tag name or element creator
 * @param {Object}             props    Element properties, either attribute
 *                                      set to apply to DOM node or values to
 *                                      pass through to element creator
 * @param {...Element}         children Descendant elements
 *
 * @return {Element} Element.
 */


/**
 * Returns an object tracking a reference to a rendered element via its
 * `current` property as either a DOMElement or Element, dependent upon the
 * type of element rendered with the ref attribute.
 *
 * @return {Object} Ref object.
 */


/**
 * Component enhancer used to enable passing a ref to its wrapped component.
 * Pass a function argument which receives `props` and `ref` as its arguments,
 * returning an element using the forwarded ref. The return value is a new
 * component which forwards its ref.
 *
 * @param {Function} forwarder Function passed `props` and `ref`, expected to
 *                             return an element.
 *
 * @return {Component} Enhanced component.
 */


/**
 * A component which renders its children without any wrapping element.
 */


/**
 * Checks if an object is a valid React Element.
 *
 * @param {Object} objectToCheck The object to be checked.
 *
 * @return {boolean} true if objectToTest is a valid React Element and false otherwise.
 */


/**
 * @see https://reactjs.org/docs/react-api.html#reactmemo
 */


/**
 * Component that activates additional checks and warnings for its descendants.
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usecallback
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usecontext
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usedebugvalue
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usedeferredvalue
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#useeffect
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#useid
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#useinsertioneffect
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usememo
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore
 */


/**
 * @see https://reactjs.org/docs/hooks-reference.html#usetransition
 */


/**
 * @see https://reactjs.org/docs/react-api.html#starttransition
 */


/**
 * @see https://reactjs.org/docs/react-api.html#reactlazy
 */


/**
 * @see https://reactjs.org/docs/react-api.html#reactsuspense
 */


/**
 * @see https://reactjs.org/docs/react-api.html#reactpurecomponent
 */


/**
 * Concatenate two or more React children objects.
 *
 * @param {...?Object} childrenArguments Array of children arguments (array of arrays/strings/objects) to concatenate.
 *
 * @return {Array} The concatenated value.
 */
function concatChildren(...childrenArguments) {
  return childrenArguments.reduce((accumulator, children, i) => {
    react__WEBPACK_IMPORTED_MODULE_0__.Children.forEach(children, (child, j) => {
      if (child && 'string' !== typeof child) {
        child = (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(child, {
          key: [i, j].join()
        });
      }
      accumulator.push(child);
    });
    return accumulator;
  }, []);
}

/**
 * Switches the nodeName of all the elements in the children object.
 *
 * @param {?Object} children Children object.
 * @param {string}  nodeName Node name.
 *
 * @return {?Object} The updated children object.
 */
function switchChildrenNodeName(children, nodeName) {
  return children && react__WEBPACK_IMPORTED_MODULE_0__.Children.map(children, (elt, index) => {
    if (typeof elt?.valueOf() === 'string') {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(nodeName, {
        key: index
      }, elt);
    }
    const {
      children: childrenProp,
      ...props
    } = elt.props;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(nodeName, {
      key: index,
      ...props
    }, childrenProp);
  });
}
//# sourceMappingURL=react.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/serialize.js":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/serialize.js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   hasPrefix: () => (/* binding */ hasPrefix),
/* harmony export */   renderAttributes: () => (/* binding */ renderAttributes),
/* harmony export */   renderComponent: () => (/* binding */ renderComponent),
/* harmony export */   renderElement: () => (/* binding */ renderElement),
/* harmony export */   renderNativeComponent: () => (/* binding */ renderNativeComponent),
/* harmony export */   renderStyle: () => (/* binding */ renderStyle)
/* harmony export */ });
/* harmony import */ var is_plain_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! is-plain-object */ "./node_modules/.pnpm/is-plain-object@5.0.0/node_modules/is-plain-object/dist/is-plain-object.mjs");
/* harmony import */ var change_case__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! change-case */ "./node_modules/.pnpm/param-case@3.0.4/node_modules/param-case/dist.es2015/index.js");
/* harmony import */ var _wordpress_escape_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/escape-html */ "./node_modules/.pnpm/@wordpress+escape-html@2.58.0/node_modules/@wordpress/escape-html/build-module/index.js");
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./react */ "react");
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _raw_html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./raw-html */ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/raw-html.js");
/**
 * Parts of this source were derived and modified from fast-react-render,
 * released under the MIT license.
 *
 * https://github.com/alt-j/fast-react-render
 *
 * Copyright (c) 2016 Andrey Morozov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * External dependencies
 */



/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */



/** @typedef {import('react').ReactElement} ReactElement */

const {
  Provider,
  Consumer
} = (0,_react__WEBPACK_IMPORTED_MODULE_3__.createContext)(undefined);
const ForwardRef = (0,_react__WEBPACK_IMPORTED_MODULE_3__.forwardRef)(() => {
  return null;
});

/**
 * Valid attribute types.
 *
 * @type {Set<string>}
 */
const ATTRIBUTES_TYPES = new Set(['string', 'boolean', 'number']);

/**
 * Element tags which can be self-closing.
 *
 * @type {Set<string>}
 */
const SELF_CLOSING_TAGS = new Set(['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

/**
 * Boolean attributes are attributes whose presence as being assigned is
 * meaningful, even if only empty.
 *
 * See: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
 * Extracted from: https://html.spec.whatwg.org/multipage/indices.html#attributes-3
 *
 * Object.keys( [ ...document.querySelectorAll( '#attributes-1 > tbody > tr' ) ]
 *     .filter( ( tr ) => tr.lastChild.textContent.indexOf( 'Boolean attribute' ) !== -1 )
 *     .reduce( ( result, tr ) => Object.assign( result, {
 *         [ tr.firstChild.textContent.trim() ]: true
 *     } ), {} ) ).sort();
 *
 * @type {Set<string>}
 */
const BOOLEAN_ATTRIBUTES = new Set(['allowfullscreen', 'allowpaymentrequest', 'allowusermedia', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'defer', 'disabled', 'download', 'formnovalidate', 'hidden', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected', 'typemustmatch']);

/**
 * Enumerated attributes are attributes which must be of a specific value form.
 * Like boolean attributes, these are meaningful if specified, even if not of a
 * valid enumerated value.
 *
 * See: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#enumerated-attribute
 * Extracted from: https://html.spec.whatwg.org/multipage/indices.html#attributes-3
 *
 * Object.keys( [ ...document.querySelectorAll( '#attributes-1 > tbody > tr' ) ]
 *     .filter( ( tr ) => /^("(.+?)";?\s*)+/.test( tr.lastChild.textContent.trim() ) )
 *     .reduce( ( result, tr ) => Object.assign( result, {
 *         [ tr.firstChild.textContent.trim() ]: true
 *     } ), {} ) ).sort();
 *
 * Some notable omissions:
 *
 *  - `alt`: https://blog.whatwg.org/omit-alt
 *
 * @type {Set<string>}
 */
const ENUMERATED_ATTRIBUTES = new Set(['autocapitalize', 'autocomplete', 'charset', 'contenteditable', 'crossorigin', 'decoding', 'dir', 'draggable', 'enctype', 'formenctype', 'formmethod', 'http-equiv', 'inputmode', 'kind', 'method', 'preload', 'scope', 'shape', 'spellcheck', 'translate', 'type', 'wrap']);

/**
 * Set of CSS style properties which support assignment of unitless numbers.
 * Used in rendering of style properties, where `px` unit is assumed unless
 * property is included in this set or value is zero.
 *
 * Generated via:
 *
 * Object.entries( document.createElement( 'div' ).style )
 *     .filter( ( [ key ] ) => (
 *         ! /^(webkit|ms|moz)/.test( key ) &&
 *         ( e.style[ key ] = 10 ) &&
 *         e.style[ key ] === '10'
 *     ) )
 *     .map( ( [ key ] ) => key )
 *     .sort();
 *
 * @type {Set<string>}
 */
const CSS_PROPERTIES_SUPPORTS_UNITLESS = new Set(['animation', 'animationIterationCount', 'baselineShift', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth', 'columnCount', 'cx', 'cy', 'fillOpacity', 'flexGrow', 'flexShrink', 'floodOpacity', 'fontWeight', 'gridColumnEnd', 'gridColumnStart', 'gridRowEnd', 'gridRowStart', 'lineHeight', 'opacity', 'order', 'orphans', 'r', 'rx', 'ry', 'shapeImageThreshold', 'stopOpacity', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'tabSize', 'widows', 'x', 'y', 'zIndex', 'zoom']);

/**
 * Returns true if the specified string is prefixed by one of an array of
 * possible prefixes.
 *
 * @param {string}   string   String to check.
 * @param {string[]} prefixes Possible prefixes.
 *
 * @return {boolean} Whether string has prefix.
 */
function hasPrefix(string, prefixes) {
  return prefixes.some(prefix => string.indexOf(prefix) === 0);
}

/**
 * Returns true if the given prop name should be ignored in attributes
 * serialization, or false otherwise.
 *
 * @param {string} attribute Attribute to check.
 *
 * @return {boolean} Whether attribute should be ignored.
 */
function isInternalAttribute(attribute) {
  return 'key' === attribute || 'children' === attribute;
}

/**
 * Returns the normal form of the element's attribute value for HTML.
 *
 * @param {string} attribute Attribute name.
 * @param {*}      value     Non-normalized attribute value.
 *
 * @return {*} Normalized attribute value.
 */
function getNormalAttributeValue(attribute, value) {
  switch (attribute) {
    case 'style':
      return renderStyle(value);
  }
  return value;
}
/**
 * This is a map of all SVG attributes that have dashes. Map(lower case prop => dashed lower case attribute).
 * We need this to render e.g strokeWidth as stroke-width.
 *
 * List from: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute.
 */
const SVG_ATTRIBUTE_WITH_DASHES_LIST = ['accentHeight', 'alignmentBaseline', 'arabicForm', 'baselineShift', 'capHeight', 'clipPath', 'clipRule', 'colorInterpolation', 'colorInterpolationFilters', 'colorProfile', 'colorRendering', 'dominantBaseline', 'enableBackground', 'fillOpacity', 'fillRule', 'floodColor', 'floodOpacity', 'fontFamily', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle', 'fontVariant', 'fontWeight', 'glyphName', 'glyphOrientationHorizontal', 'glyphOrientationVertical', 'horizAdvX', 'horizOriginX', 'imageRendering', 'letterSpacing', 'lightingColor', 'markerEnd', 'markerMid', 'markerStart', 'overlinePosition', 'overlineThickness', 'paintOrder', 'panose1', 'pointerEvents', 'renderingIntent', 'shapeRendering', 'stopColor', 'stopOpacity', 'strikethroughPosition', 'strikethroughThickness', 'strokeDasharray', 'strokeDashoffset', 'strokeLinecap', 'strokeLinejoin', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'textAnchor', 'textDecoration', 'textRendering', 'underlinePosition', 'underlineThickness', 'unicodeBidi', 'unicodeRange', 'unitsPerEm', 'vAlphabetic', 'vHanging', 'vIdeographic', 'vMathematical', 'vectorEffect', 'vertAdvY', 'vertOriginX', 'vertOriginY', 'wordSpacing', 'writingMode', 'xmlnsXlink', 'xHeight'].reduce((map, attribute) => {
  // The keys are lower-cased for more robust lookup.
  map[attribute.toLowerCase()] = attribute;
  return map;
}, {});

/**
 * This is a map of all case-sensitive SVG attributes. Map(lowercase key => proper case attribute).
 * The keys are lower-cased for more robust lookup.
 * Note that this list only contains attributes that contain at least one capital letter.
 * Lowercase attributes don't need mapping, since we lowercase all attributes by default.
 */
const CASE_SENSITIVE_SVG_ATTRIBUTES = ['allowReorder', 'attributeName', 'attributeType', 'autoReverse', 'baseFrequency', 'baseProfile', 'calcMode', 'clipPathUnits', 'contentScriptType', 'contentStyleType', 'diffuseConstant', 'edgeMode', 'externalResourcesRequired', 'filterRes', 'filterUnits', 'glyphRef', 'gradientTransform', 'gradientUnits', 'kernelMatrix', 'kernelUnitLength', 'keyPoints', 'keySplines', 'keyTimes', 'lengthAdjust', 'limitingConeAngle', 'markerHeight', 'markerUnits', 'markerWidth', 'maskContentUnits', 'maskUnits', 'numOctaves', 'pathLength', 'patternContentUnits', 'patternTransform', 'patternUnits', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'preserveAlpha', 'preserveAspectRatio', 'primitiveUnits', 'refX', 'refY', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'specularConstant', 'specularExponent', 'spreadMethod', 'startOffset', 'stdDeviation', 'stitchTiles', 'suppressContentEditableWarning', 'suppressHydrationWarning', 'surfaceScale', 'systemLanguage', 'tableValues', 'targetX', 'targetY', 'textLength', 'viewBox', 'viewTarget', 'xChannelSelector', 'yChannelSelector'].reduce((map, attribute) => {
  // The keys are lower-cased for more robust lookup.
  map[attribute.toLowerCase()] = attribute;
  return map;
}, {});

/**
 * This is a map of all SVG attributes that have colons.
 * Keys are lower-cased and stripped of their colons for more robust lookup.
 */
const SVG_ATTRIBUTES_WITH_COLONS = ['xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'xmlns:xlink'].reduce((map, attribute) => {
  map[attribute.replace(':', '').toLowerCase()] = attribute;
  return map;
}, {});

/**
 * Returns the normal form of the element's attribute name for HTML.
 *
 * @param {string} attribute Non-normalized attribute name.
 *
 * @return {string} Normalized attribute name.
 */
function getNormalAttributeName(attribute) {
  switch (attribute) {
    case 'htmlFor':
      return 'for';
    case 'className':
      return 'class';
  }
  const attributeLowerCase = attribute.toLowerCase();
  if (CASE_SENSITIVE_SVG_ATTRIBUTES[attributeLowerCase]) {
    return CASE_SENSITIVE_SVG_ATTRIBUTES[attributeLowerCase];
  } else if (SVG_ATTRIBUTE_WITH_DASHES_LIST[attributeLowerCase]) {
    return (0,change_case__WEBPACK_IMPORTED_MODULE_1__.paramCase)(SVG_ATTRIBUTE_WITH_DASHES_LIST[attributeLowerCase]);
  } else if (SVG_ATTRIBUTES_WITH_COLONS[attributeLowerCase]) {
    return SVG_ATTRIBUTES_WITH_COLONS[attributeLowerCase];
  }
  return attributeLowerCase;
}

/**
 * Returns the normal form of the style property name for HTML.
 *
 * - Converts property names to kebab-case, e.g. 'backgroundColor' → 'background-color'
 * - Leaves custom attributes alone, e.g. '--myBackgroundColor' → '--myBackgroundColor'
 * - Converts vendor-prefixed property names to -kebab-case, e.g. 'MozTransform' → '-moz-transform'
 *
 * @param {string} property Property name.
 *
 * @return {string} Normalized property name.
 */
function getNormalStylePropertyName(property) {
  if (property.startsWith('--')) {
    return property;
  }
  if (hasPrefix(property, ['ms', 'O', 'Moz', 'Webkit'])) {
    return '-' + (0,change_case__WEBPACK_IMPORTED_MODULE_1__.paramCase)(property);
  }
  return (0,change_case__WEBPACK_IMPORTED_MODULE_1__.paramCase)(property);
}

/**
 * Returns the normal form of the style property value for HTML. Appends a
 * default pixel unit if numeric, not a unitless property, and not zero.
 *
 * @param {string} property Property name.
 * @param {*}      value    Non-normalized property value.
 *
 * @return {*} Normalized property value.
 */
function getNormalStylePropertyValue(property, value) {
  if (typeof value === 'number' && 0 !== value && !CSS_PROPERTIES_SUPPORTS_UNITLESS.has(property)) {
    return value + 'px';
  }
  return value;
}

/**
 * Serializes a React element to string.
 *
 * @param {import('react').ReactNode} element         Element to serialize.
 * @param {Object}                    [context]       Context object.
 * @param {Object}                    [legacyContext] Legacy context object.
 *
 * @return {string} Serialized element.
 */
function renderElement(element, context, legacyContext = {}) {
  if (null === element || undefined === element || false === element) {
    return '';
  }
  if (Array.isArray(element)) {
    return renderChildren(element, context, legacyContext);
  }
  switch (typeof element) {
    case 'string':
      return (0,_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_2__.escapeHTML)(element);
    case 'number':
      return element.toString();
  }
  const {
    type,
    props
  } = /** @type {{type?: any, props?: any}} */
  element;
  switch (type) {
    case _react__WEBPACK_IMPORTED_MODULE_3__.StrictMode:
    case _react__WEBPACK_IMPORTED_MODULE_3__.Fragment:
      return renderChildren(props.children, context, legacyContext);
    case _raw_html__WEBPACK_IMPORTED_MODULE_4__["default"]:
      const {
        children,
        ...wrapperProps
      } = props;
      return renderNativeComponent(!Object.keys(wrapperProps).length ? null : 'div', {
        ...wrapperProps,
        dangerouslySetInnerHTML: {
          __html: children
        }
      }, context, legacyContext);
  }
  switch (typeof type) {
    case 'string':
      return renderNativeComponent(type, props, context, legacyContext);
    case 'function':
      if (type.prototype && typeof type.prototype.render === 'function') {
        return renderComponent(type, props, context, legacyContext);
      }
      return renderElement(type(props, legacyContext), context, legacyContext);
  }
  switch (type && type.$$typeof) {
    case Provider.$$typeof:
      return renderChildren(props.children, props.value, legacyContext);
    case Consumer.$$typeof:
      return renderElement(props.children(context || type._currentValue), context, legacyContext);
    case ForwardRef.$$typeof:
      return renderElement(type.render(props), context, legacyContext);
  }
  return '';
}

/**
 * Serializes a native component type to string.
 *
 * @param {?string} type            Native component type to serialize, or null if
 *                                  rendering as fragment of children content.
 * @param {Object}  props           Props object.
 * @param {Object}  [context]       Context object.
 * @param {Object}  [legacyContext] Legacy context object.
 *
 * @return {string} Serialized element.
 */
function renderNativeComponent(type, props, context, legacyContext = {}) {
  let content = '';
  if (type === 'textarea' && props.hasOwnProperty('value')) {
    // Textarea children can be assigned as value prop. If it is, render in
    // place of children. Ensure to omit so it is not assigned as attribute
    // as well.
    content = renderChildren(props.value, context, legacyContext);
    const {
      value,
      ...restProps
    } = props;
    props = restProps;
  } else if (props.dangerouslySetInnerHTML && typeof props.dangerouslySetInnerHTML.__html === 'string') {
    // Dangerous content is left unescaped.
    content = props.dangerouslySetInnerHTML.__html;
  } else if (typeof props.children !== 'undefined') {
    content = renderChildren(props.children, context, legacyContext);
  }
  if (!type) {
    return content;
  }
  const attributes = renderAttributes(props);
  if (SELF_CLOSING_TAGS.has(type)) {
    return '<' + type + attributes + '/>';
  }
  return '<' + type + attributes + '>' + content + '</' + type + '>';
}

/** @typedef {import('react').ComponentType} ComponentType */

/**
 * Serializes a non-native component type to string.
 *
 * @param {ComponentType} Component       Component type to serialize.
 * @param {Object}        props           Props object.
 * @param {Object}        [context]       Context object.
 * @param {Object}        [legacyContext] Legacy context object.
 *
 * @return {string} Serialized element
 */
function renderComponent(Component, props, context, legacyContext = {}) {
  const instance = new ( /** @type {import('react').ComponentClass} */
  Component)(props, legacyContext);
  if (typeof
  // Ignore reason: Current prettier reformats parens and mangles type assertion
  // prettier-ignore
  /** @type {{getChildContext?: () => unknown}} */
  instance.getChildContext === 'function') {
    Object.assign(legacyContext, /** @type {{getChildContext?: () => unknown}} */instance.getChildContext());
  }
  const html = renderElement(instance.render(), context, legacyContext);
  return html;
}

/**
 * Serializes an array of children to string.
 *
 * @param {import('react').ReactNodeArray} children        Children to serialize.
 * @param {Object}                         [context]       Context object.
 * @param {Object}                         [legacyContext] Legacy context object.
 *
 * @return {string} Serialized children.
 */
function renderChildren(children, context, legacyContext = {}) {
  let result = '';
  children = Array.isArray(children) ? children : [children];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    result += renderElement(child, context, legacyContext);
  }
  return result;
}

/**
 * Renders a props object as a string of HTML attributes.
 *
 * @param {Object} props Props object.
 *
 * @return {string} Attributes string.
 */
function renderAttributes(props) {
  let result = '';
  for (const key in props) {
    const attribute = getNormalAttributeName(key);
    if (!(0,_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_2__.isValidAttributeName)(attribute)) {
      continue;
    }
    let value = getNormalAttributeValue(key, props[key]);

    // If value is not of serializable type, skip.
    if (!ATTRIBUTES_TYPES.has(typeof value)) {
      continue;
    }

    // Don't render internal attribute names.
    if (isInternalAttribute(key)) {
      continue;
    }
    const isBooleanAttribute = BOOLEAN_ATTRIBUTES.has(attribute);

    // Boolean attribute should be omitted outright if its value is false.
    if (isBooleanAttribute && value === false) {
      continue;
    }
    const isMeaningfulAttribute = isBooleanAttribute || hasPrefix(key, ['data-', 'aria-']) || ENUMERATED_ATTRIBUTES.has(attribute);

    // Only write boolean value as attribute if meaningful.
    if (typeof value === 'boolean' && !isMeaningfulAttribute) {
      continue;
    }
    result += ' ' + attribute;

    // Boolean attributes should write attribute name, but without value.
    // Mere presence of attribute name is effective truthiness.
    if (isBooleanAttribute) {
      continue;
    }
    if (typeof value === 'string') {
      value = (0,_wordpress_escape_html__WEBPACK_IMPORTED_MODULE_2__.escapeAttribute)(value);
    }
    result += '="' + value + '"';
  }
  return result;
}

/**
 * Renders a style object as a string attribute value.
 *
 * @param {Object} style Style object.
 *
 * @return {string} Style attribute value.
 */
function renderStyle(style) {
  // Only generate from object, e.g. tolerate string value.
  if (!(0,is_plain_object__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(style)) {
    return style;
  }
  let result;
  for (const property in style) {
    const value = style[property];
    if (null === value || undefined === value) {
      continue;
    }
    if (result) {
      result += ';';
    } else {
      result = '';
    }
    const normalName = getNormalStylePropertyName(property);
    const normalValue = getNormalStylePropertyValue(property, value);
    result += normalName + ':' + normalValue;
  }
  return result;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderElement);
//# sourceMappingURL=serialize.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/utils.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+element@5.35.0/node_modules/@wordpress/element/build-module/utils.js ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isEmptyElement: () => (/* binding */ isEmptyElement)
/* harmony export */ });
/**
 * Checks if the provided WP element is empty.
 *
 * @param {*} element WP element to check.
 * @return {boolean} True when an element is considered empty.
 */
const isEmptyElement = element => {
  if (typeof element === 'number') {
    return false;
  }
  if (typeof element?.valueOf() === 'string' || Array.isArray(element)) {
    return !element.length;
  }
  return !element;
};
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+escape-html@2.58.0/node_modules/@wordpress/escape-html/build-module/escape-greater.js":
/*!*****************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+escape-html@2.58.0/node_modules/@wordpress/escape-html/build-module/escape-greater.js ***!
  \*****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ __unstableEscapeGreaterThan)
/* harmony export */ });
/**
 * Returns a string with greater-than sign replaced.
 *
 * Note that if a resolution for Trac#45387 comes to fruition, it is no longer
 * necessary for `__unstableEscapeGreaterThan` to exist.
 *
 * See: https://core.trac.wordpress.org/ticket/45387
 *
 * @param {string} value Original string.
 *
 * @return {string} Escaped string.
 */
function __unstableEscapeGreaterThan(value) {
  return value.replace(/>/g, '&gt;');
}
//# sourceMappingURL=escape-greater.js.map

/***/ }),

/***/ "./node_modules/.pnpm/@wordpress+escape-html@2.58.0/node_modules/@wordpress/escape-html/build-module/index.js":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@wordpress+escape-html@2.58.0/node_modules/@wordpress/escape-html/build-module/index.js ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   escapeAmpersand: () => (/* binding */ escapeAmpersand),
/* harmony export */   escapeAttribute: () => (/* binding */ escapeAttribute),
/* harmony export */   escapeEditableHTML: () => (/* binding */ escapeEditableHTML),
/* harmony export */   escapeHTML: () => (/* binding */ escapeHTML),
/* harmony export */   escapeLessThan: () => (/* binding */ escapeLessThan),
/* harmony export */   escapeQuotationMark: () => (/* binding */ escapeQuotationMark),
/* harmony export */   isValidAttributeName: () => (/* binding */ isValidAttributeName)
/* harmony export */ });
/* harmony import */ var _escape_greater__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./escape-greater */ "./node_modules/.pnpm/@wordpress+escape-html@2.58.0/node_modules/@wordpress/escape-html/build-module/escape-greater.js");
/**
 * Internal dependencies
 */


/**
 * Regular expression matching invalid attribute names.
 *
 * "Attribute names must consist of one or more characters other than controls,
 * U+0020 SPACE, U+0022 ("), U+0027 ('), U+003E (>), U+002F (/), U+003D (=),
 * and noncharacters."
 *
 * @see https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
 *
 * @type {RegExp}
 */
const REGEXP_INVALID_ATTRIBUTE_NAME = /[\u007F-\u009F "'>/="\uFDD0-\uFDEF]/;

/**
 * Returns a string with ampersands escaped. Note that this is an imperfect
 * implementation, where only ampersands which do not appear as a pattern of
 * named, decimal, or hexadecimal character references are escaped. Invalid
 * named references (i.e. ambiguous ampersand) are still permitted.
 *
 * @see https://w3c.github.io/html/syntax.html#character-references
 * @see https://w3c.github.io/html/syntax.html#ambiguous-ampersand
 * @see https://w3c.github.io/html/syntax.html#named-character-references
 *
 * @param {string} value Original string.
 *
 * @return {string} Escaped string.
 */
function escapeAmpersand(value) {
  return value.replace(/&(?!([a-z0-9]+|#[0-9]+|#x[a-f0-9]+);)/gi, '&amp;');
}

/**
 * Returns a string with quotation marks replaced.
 *
 * @param {string} value Original string.
 *
 * @return {string} Escaped string.
 */
function escapeQuotationMark(value) {
  return value.replace(/"/g, '&quot;');
}

/**
 * Returns a string with less-than sign replaced.
 *
 * @param {string} value Original string.
 *
 * @return {string} Escaped string.
 */
function escapeLessThan(value) {
  return value.replace(/</g, '&lt;');
}

/**
 * Returns an escaped attribute value.
 *
 * @see https://w3c.github.io/html/syntax.html#elements-attributes
 *
 * "[...] the text cannot contain an ambiguous ampersand [...] must not contain
 * any literal U+0022 QUOTATION MARK characters (")"
 *
 * Note we also escape the greater than symbol, as this is used by wptexturize to
 * split HTML strings. This is a WordPress specific fix
 *
 * Note that if a resolution for Trac#45387 comes to fruition, it is no longer
 * necessary for `__unstableEscapeGreaterThan` to be used.
 *
 * See: https://core.trac.wordpress.org/ticket/45387
 *
 * @param {string} value Attribute value.
 *
 * @return {string} Escaped attribute value.
 */
function escapeAttribute(value) {
  return (0,_escape_greater__WEBPACK_IMPORTED_MODULE_0__["default"])(escapeQuotationMark(escapeAmpersand(value)));
}

/**
 * Returns an escaped HTML element value.
 *
 * @see https://w3c.github.io/html/syntax.html#writing-html-documents-elements
 *
 * "the text must not contain the character U+003C LESS-THAN SIGN (<) or an
 * ambiguous ampersand."
 *
 * @param {string} value Element value.
 *
 * @return {string} Escaped HTML element value.
 */
function escapeHTML(value) {
  return escapeLessThan(escapeAmpersand(value));
}

/**
 * Returns an escaped Editable HTML element value. This is different from
 * `escapeHTML`, because for editable HTML, ALL ampersands must be escaped in
 * order to render the content correctly on the page.
 *
 * @param {string} value Element value.
 *
 * @return {string} Escaped HTML element value.
 */
function escapeEditableHTML(value) {
  return escapeLessThan(value.replace(/&/g, '&amp;'));
}

/**
 * Returns true if the given attribute name is valid, or false otherwise.
 *
 * @param {string} name Attribute name to test.
 *
 * @return {boolean} Whether attribute is valid.
 */
function isValidAttributeName(name) {
  return !REGEXP_INVALID_ATTRIBUTE_NAME.test(name);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/.pnpm/body-scroll-lock@3.1.5/node_modules/body-scroll-lock/lib/bodyScrollLock.esm.js":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/body-scroll-lock@3.1.5/node_modules/body-scroll-lock/lib/bodyScrollLock.esm.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearAllBodyScrollLocks: () => (/* binding */ clearAllBodyScrollLocks),
/* harmony export */   disableBodyScroll: () => (/* binding */ disableBodyScroll),
/* harmony export */   enableBodyScroll: () => (/* binding */ enableBodyScroll)
/* harmony export */ });
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Older browsers don't support event options, feature detect it.

// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

var hasPassiveEvents = false;
if (typeof window !== 'undefined') {
  var passiveTestOptions = {
    get passive() {
      hasPassiveEvents = true;
      return undefined;
    }
  };
  window.addEventListener('testPassive', null, passiveTestOptions);
  window.removeEventListener('testPassive', null, passiveTestOptions);
}

var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);


var locks = [];
var documentListenerAdded = false;
var initialClientY = -1;
var previousBodyOverflowSetting = void 0;
var previousBodyPaddingRight = void 0;

// returns true if `el` should be allowed to receive touchmove events.
var allowTouchMove = function allowTouchMove(el) {
  return locks.some(function (lock) {
    if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
      return true;
    }

    return false;
  });
};

var preventDefault = function preventDefault(rawEvent) {
  var e = rawEvent || window.event;

  // For the case whereby consumers adds a touchmove event listener to document.
  // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
  // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
  // the touchmove event on document will break.
  if (allowTouchMove(e.target)) {
    return true;
  }

  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1) return true;

  if (e.preventDefault) e.preventDefault();

  return false;
};

var setOverflowHidden = function setOverflowHidden(options) {
  // If previousBodyPaddingRight is already set, don't set it again.
  if (previousBodyPaddingRight === undefined) {
    var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
    var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

    if (_reserveScrollBarGap && scrollBarGap > 0) {
      previousBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = scrollBarGap + 'px';
    }
  }

  // If previousBodyOverflowSetting is already set, don't set it again.
  if (previousBodyOverflowSetting === undefined) {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
};

var restoreOverflowSetting = function restoreOverflowSetting() {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight;

    // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
    // can be set again.
    previousBodyPaddingRight = undefined;
  }

  if (previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = previousBodyOverflowSetting;

    // Restore previousBodyOverflowSetting to undefined
    // so setOverflowHidden knows it can be set again.
    previousBodyOverflowSetting = undefined;
  }
};

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};

var handleScroll = function handleScroll(event, targetElement) {
  var clientY = event.targetTouches[0].clientY - initialClientY;

  if (allowTouchMove(event.target)) {
    return false;
  }

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll.
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the bottom of its scroll.
    return preventDefault(event);
  }

  event.stopPropagation();
  return true;
};

var disableBodyScroll = function disableBodyScroll(targetElement, options) {
  // targetElement must be provided
  if (!targetElement) {
    // eslint-disable-next-line no-console
    console.error('disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.');
    return;
  }

  // disableBodyScroll must not have been called on this targetElement before
  if (locks.some(function (lock) {
    return lock.targetElement === targetElement;
  })) {
    return;
  }

  var lock = {
    targetElement: targetElement,
    options: options || {}
  };

  locks = [].concat(_toConsumableArray(locks), [lock]);

  if (isIosDevice) {
    targetElement.ontouchstart = function (event) {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        initialClientY = event.targetTouches[0].clientY;
      }
    };
    targetElement.ontouchmove = function (event) {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        handleScroll(event, targetElement);
      }
    };

    if (!documentListenerAdded) {
      document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
      documentListenerAdded = true;
    }
  } else {
    setOverflowHidden(options);
  }
};

var clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
  if (isIosDevice) {
    // Clear all locks ontouchstart/ontouchmove handlers, and the references.
    locks.forEach(function (lock) {
      lock.targetElement.ontouchstart = null;
      lock.targetElement.ontouchmove = null;
    });

    if (documentListenerAdded) {
      document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
      documentListenerAdded = false;
    }

    // Reset initial clientY.
    initialClientY = -1;
  } else {
    restoreOverflowSetting();
  }

  locks = [];
};

var enableBodyScroll = function enableBodyScroll(targetElement) {
  if (!targetElement) {
    // eslint-disable-next-line no-console
    console.error('enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.');
    return;
  }

  locks = locks.filter(function (lock) {
    return lock.targetElement !== targetElement;
  });

  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    if (documentListenerAdded && locks.length === 0) {
      document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
      documentListenerAdded = false;
    }
  } else if (!locks.length) {
    restoreOverflowSetting();
  }
};



/***/ }),

/***/ "./node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js ***!
  \******************************************************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else // removed by dead control flow
{}
}());


/***/ }),

/***/ "./node_modules/.pnpm/dot-case@3.0.4/node_modules/dot-case/dist.es2015/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/dot-case@3.0.4/node_modules/dot-case/dist.es2015/index.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dotCase: () => (/* binding */ dotCase)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var no_case__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! no-case */ "./node_modules/.pnpm/no-case@3.0.4/node_modules/no-case/dist.es2015/index.js");


function dotCase(input, options) {
    if (options === void 0) { options = {}; }
    return (0,no_case__WEBPACK_IMPORTED_MODULE_1__.noCase)(input, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({ delimiter: "." }, options));
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/.pnpm/lower-case@2.0.2/node_modules/lower-case/dist.es2015/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/lower-case@2.0.2/node_modules/lower-case/dist.es2015/index.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   localeLowerCase: () => (/* binding */ localeLowerCase),
/* harmony export */   lowerCase: () => (/* binding */ lowerCase)
/* harmony export */ });
/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
var SUPPORTED_LOCALE = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069",
        },
    },
    az: {
        regexp: /\u0130/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069",
        },
    },
    lt: {
        regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            Į: "\u012F\u0307",
            Ì: "\u0069\u0307\u0300",
            Í: "\u0069\u0307\u0301",
            Ĩ: "\u0069\u0307\u0303",
        },
    },
};
/**
 * Localized lower case.
 */
function localeLowerCase(str, locale) {
    var lang = SUPPORTED_LOCALE[locale.toLowerCase()];
    if (lang)
        return lowerCase(str.replace(lang.regexp, function (m) { return lang.map[m]; }));
    return lowerCase(str);
}
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/.pnpm/no-case@3.0.4/node_modules/no-case/dist.es2015/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/no-case@3.0.4/node_modules/no-case/dist.es2015/index.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   noCase: () => (/* binding */ noCase)
/* harmony export */ });
/* harmony import */ var lower_case__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lower-case */ "./node_modules/.pnpm/lower-case@2.0.2/node_modules/lower-case/dist.es2015/index.js");

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lower_case__WEBPACK_IMPORTED_MODULE_0__.lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/.pnpm/param-case@3.0.4/node_modules/param-case/dist.es2015/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/param-case@3.0.4/node_modules/param-case/dist.es2015/index.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   paramCase: () => (/* binding */ paramCase)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var dot_case__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dot-case */ "./node_modules/.pnpm/dot-case@3.0.4/node_modules/dot-case/dist.es2015/index.js");


function paramCase(input, options) {
    if (options === void 0) { options = {}; }
    return (0,dot_case__WEBPACK_IMPORTED_MODULE_1__.dotCase)(input, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({ delimiter: "-" }, options));
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./node_modules/.pnpm/react-responsive-modal@6.4.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-responsive-modal/dist/react-responsive-modal.esm.js":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/react-responsive-modal@6.4.2_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-responsive-modal/dist/react-responsive-modal.esm.js ***!
  \****************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Modal: () => (/* binding */ Modal),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "./node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var body_scroll_lock__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! body-scroll-lock */ "./node_modules/.pnpm/body-scroll-lock@3.1.5/node_modules/body-scroll-lock/lib/bodyScrollLock.esm.js");
/* harmony import */ var _bedrock_layout_use_forwarded_ref__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @bedrock-layout/use-forwarded-ref */ "./node_modules/.pnpm/@bedrock-layout+use-forwarded-ref@1.6.1_react@18.3.1/node_modules/@bedrock-layout/use-forwarded-ref/lib/index.m.js");






function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var CloseIcon = function CloseIcon(_ref) {
  var classes = _ref.classes,
      classNames = _ref.classNames,
      styles = _ref.styles,
      id = _ref.id,
      closeIcon = _ref.closeIcon,
      onClick = _ref.onClick;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    id: id,
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(classes.closeButton, classNames == null ? void 0 : classNames.closeButton),
    style: styles == null ? void 0 : styles.closeButton,
    onClick: onClick,
    "data-testid": "close-button"
  }, closeIcon ? closeIcon : react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: classNames == null ? void 0 : classNames.closeIcon,
    style: styles == null ? void 0 : styles.closeIcon,
    width: 28,
    height: 28,
    viewBox: "0 0 36 36",
    "data-testid": "close-icon"
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"
  })));
};

var isBrowser = typeof window !== 'undefined';

// https://github.com/alexandrzavalii/focus-trap-js/blob/master/src/index.js v1.1.0
var candidateSelectors = ['input', 'select', 'textarea', 'a[href]', 'button', '[tabindex]', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])'];

function isHidden(node) {
  // offsetParent being null will allow detecting cases where an element is invisible or inside an invisible element,
  // as long as the element does not use position: fixed. For them, their visibility has to be checked directly as well.
  return node.offsetParent === null || getComputedStyle(node).visibility === 'hidden';
}

function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
}

function isNotRadioOrTabbableRadio(node) {
  if (node.tagName !== 'INPUT' || node.type !== 'radio' || !node.name) {
    return true;
  }

  var radioScope = node.form || node.ownerDocument;
  var radioSet = radioScope.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
  var checked = getCheckedRadio(radioSet, node.form);
  return checked === node || checked === undefined && radioSet[0] === node;
}

function getAllTabbingElements(parentElem) {
  var currentActiveElement = document.activeElement;
  var tabbableNodes = parentElem.querySelectorAll(candidateSelectors.join(','));
  var onlyTabbable = [];

  for (var i = 0; i < tabbableNodes.length; i++) {
    var node = tabbableNodes[i];

    if (currentActiveElement === node || !node.disabled && getTabindex(node) > -1 && !isHidden(node) && isNotRadioOrTabbableRadio(node)) {
      onlyTabbable.push(node);
    }
  }

  return onlyTabbable;
}
function tabTrappingKey(event, parentElem) {
  // check if current event keyCode is tab
  if (!event || event.key !== 'Tab') return;

  if (!parentElem || !parentElem.contains) {
    if (process && "development" === 'development') {
      console.warn('focus-trap-js: parent element is not defined');
    }

    return false;
  }

  if (!parentElem.contains(event.target)) {
    return false;
  }

  var allTabbingElements = getAllTabbingElements(parentElem);
  var firstFocusableElement = allTabbingElements[0];
  var lastFocusableElement = allTabbingElements[allTabbingElements.length - 1];

  if (event.shiftKey && event.target === firstFocusableElement) {
    lastFocusableElement.focus();
    event.preventDefault();
    return true;
  } else if (!event.shiftKey && event.target === lastFocusableElement) {
    firstFocusableElement.focus();
    event.preventDefault();
    return true;
  }

  return false;
}

function getTabindex(node) {
  var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);
  if (!isNaN(tabindexAttr)) return tabindexAttr; // Browsers do not return tabIndex correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.

  if (isContentEditable(node)) return 0;
  return node.tabIndex;
}

function isContentEditable(node) {
  return node.getAttribute('contentEditable');
}

var FocusTrap = function FocusTrap(_ref) {
  var container = _ref.container,
      initialFocusRef = _ref.initialFocusRef;
  var refLastFocus = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  /**
   * Handle focus lock on the modal
   */

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    var handleKeyEvent = function handleKeyEvent(event) {
      if (container == null ? void 0 : container.current) {
        tabTrappingKey(event, container.current);
      }
    };

    if (isBrowser) {
      document.addEventListener('keydown', handleKeyEvent);
    } // On mount we focus on the first focusable element in the modal if there is one


    if (isBrowser && (container == null ? void 0 : container.current)) {
      var savePreviousFocus = function savePreviousFocus() {
        // First we save the last focused element
        // only if it's a focusable element
        if (candidateSelectors.findIndex(function (selector) {
          var _document$activeEleme;

          return (_document$activeEleme = document.activeElement) == null ? void 0 : _document$activeEleme.matches(selector);
        }) !== -1) {
          refLastFocus.current = document.activeElement;
        }
      };

      if (initialFocusRef) {
        savePreviousFocus(); // We need to schedule focusing on a next frame - this allows to focus on the modal root

        requestAnimationFrame(function () {
          var _initialFocusRef$curr;

          (_initialFocusRef$curr = initialFocusRef.current) == null ? void 0 : _initialFocusRef$curr.focus();
        });
      } else {
        var allTabbingElements = getAllTabbingElements(container.current);

        if (allTabbingElements[0]) {
          savePreviousFocus();
          allTabbingElements[0].focus();
        }
      }
    }

    return function () {
      if (isBrowser) {
        var _refLastFocus$current;

        document.removeEventListener('keydown', handleKeyEvent); // On unmount we restore the focus to the last focused element

        (_refLastFocus$current = refLastFocus.current) == null ? void 0 : _refLastFocus$current.focus();
      }
    };
  }, [container, initialFocusRef]);
  return null;
};

var modals = [];
/**
 * Handle the order of the modals.
 * Inspired by the material-ui implementation.
 */

var modalManager = {
  /**
   * Register a new modal
   */
  add: function add(newModal) {
    modals.push(newModal);
  },

  /**
   * Remove a modal
   */
  remove: function remove(oldModal) {
    modals = modals.filter(function (modal) {
      return modal !== oldModal;
    });
  },

  /**
   * When multiple modals are rendered will return true if current modal is the last one
   */
  isTopModal: function isTopModal(modal) {
    return !!modals.length && modals[modals.length - 1] === modal;
  }
};
function useModalManager(ref, open) {
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (open) {
      modalManager.add(ref);
    }

    return function () {
      modalManager.remove(ref);
    };
  }, [open, ref]);
}

var useScrollLock = function useScrollLock(refModal, open, showPortal, blockScroll, reserveScrollBarGap) {
  var oldRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (open && refModal.current && blockScroll) {
      oldRef.current = refModal.current;
      (0,body_scroll_lock__WEBPACK_IMPORTED_MODULE_3__.disableBodyScroll)(refModal.current, {
        reserveScrollBarGap: reserveScrollBarGap
      });
    }

    return function () {
      if (oldRef.current) {
        (0,body_scroll_lock__WEBPACK_IMPORTED_MODULE_3__.enableBodyScroll)(oldRef.current);
        oldRef.current = null;
      }
    };
  }, [open, showPortal, refModal, blockScroll, reserveScrollBarGap]);
};

var classes = {
  root: 'react-responsive-modal-root',
  overlay: 'react-responsive-modal-overlay',
  overlayAnimationIn: 'react-responsive-modal-overlay-in',
  overlayAnimationOut: 'react-responsive-modal-overlay-out',
  modalContainer: 'react-responsive-modal-container',
  modalContainerCenter: 'react-responsive-modal-containerCenter',
  modal: 'react-responsive-modal-modal',
  modalAnimationIn: 'react-responsive-modal-modal-in',
  modalAnimationOut: 'react-responsive-modal-modal-out',
  closeButton: 'react-responsive-modal-closeButton'
};
var Modal = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().forwardRef(function (_ref, ref) {
  var _classNames$overlayAn, _classNames$overlayAn2, _classNames$modalAnim, _classNames$modalAnim2;

  var open = _ref.open,
      center = _ref.center,
      _ref$blockScroll = _ref.blockScroll,
      blockScroll = _ref$blockScroll === void 0 ? true : _ref$blockScroll,
      _ref$closeOnEsc = _ref.closeOnEsc,
      closeOnEsc = _ref$closeOnEsc === void 0 ? true : _ref$closeOnEsc,
      _ref$closeOnOverlayCl = _ref.closeOnOverlayClick,
      closeOnOverlayClick = _ref$closeOnOverlayCl === void 0 ? true : _ref$closeOnOverlayCl,
      container = _ref.container,
      _ref$showCloseIcon = _ref.showCloseIcon,
      showCloseIcon = _ref$showCloseIcon === void 0 ? true : _ref$showCloseIcon,
      closeIconId = _ref.closeIconId,
      closeIcon = _ref.closeIcon,
      _ref$focusTrapped = _ref.focusTrapped,
      focusTrapped = _ref$focusTrapped === void 0 ? true : _ref$focusTrapped,
      _ref$initialFocusRef = _ref.initialFocusRef,
      initialFocusRef = _ref$initialFocusRef === void 0 ? undefined : _ref$initialFocusRef,
      _ref$animationDuratio = _ref.animationDuration,
      animationDuration = _ref$animationDuratio === void 0 ? 300 : _ref$animationDuratio,
      classNames = _ref.classNames,
      styles = _ref.styles,
      _ref$role = _ref.role,
      role = _ref$role === void 0 ? 'dialog' : _ref$role,
      ariaDescribedby = _ref.ariaDescribedby,
      ariaLabelledby = _ref.ariaLabelledby,
      containerId = _ref.containerId,
      modalId = _ref.modalId,
      onClose = _ref.onClose,
      onEscKeyDown = _ref.onEscKeyDown,
      onOverlayClick = _ref.onOverlayClick,
      onAnimationEnd = _ref.onAnimationEnd,
      children = _ref.children,
      reserveScrollBarGap = _ref.reserveScrollBarGap;
  var refDialog = (0,_bedrock_layout_use_forwarded_ref__WEBPACK_IMPORTED_MODULE_4__["default"])(ref);
  var refModal = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var refShouldClose = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  var refContainer = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null); // Lazily create the ref instance
  // https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily

  if (refContainer.current === null && isBrowser) {
    refContainer.current = document.createElement('div');
  } // The value should be false for srr, that way when the component is hydrated client side,
  // it will match the server rendered content


  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
      showPortal = _useState[0],
      setShowPortal = _useState[1]; // Hook used to manage multiple modals opened at the same time


  useModalManager(refModal, open); // Hook used to manage the scroll

  useScrollLock(refModal, open, showPortal, blockScroll, reserveScrollBarGap);

  var handleOpen = function handleOpen() {
    if (refContainer.current && !container && !document.body.contains(refContainer.current)) {
      document.body.appendChild(refContainer.current);
    }

    document.addEventListener('keydown', handleKeydown);
  };

  var handleClose = function handleClose() {
    if (refContainer.current && !container && document.body.contains(refContainer.current)) {
      document.body.removeChild(refContainer.current);
    }

    document.removeEventListener('keydown', handleKeydown);
  };

  var handleKeydown = function handleKeydown(event) {
    // Only the last modal need to be escaped when pressing the esc key
    if (event.keyCode !== 27 || !modalManager.isTopModal(refModal)) {
      return;
    }

    onEscKeyDown == null ? void 0 : onEscKeyDown(event);

    if (closeOnEsc) {
      onClose();
    }
  };

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    return function () {
      if (showPortal) {
        // When the modal is closed or removed directly, cleanup the listeners
        handleClose();
      }
    };
  }, [showPortal]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    // If the open prop is changing, we need to open the modal
    // This is also called on the first render if the open prop is true when the modal is created
    if (open && !showPortal) {
      setShowPortal(true);
      handleOpen();
    }
  }, [open]);

  var handleClickOverlay = function handleClickOverlay(event) {
    if (refShouldClose.current === null) {
      refShouldClose.current = true;
    }

    if (!refShouldClose.current) {
      refShouldClose.current = null;
      return;
    }

    onOverlayClick == null ? void 0 : onOverlayClick(event);

    if (closeOnOverlayClick) {
      onClose();
    }

    refShouldClose.current = null;
  };

  var handleModalEvent = function handleModalEvent() {
    refShouldClose.current = false;
  };

  var handleAnimationEnd = function handleAnimationEnd() {
    if (!open) {
      setShowPortal(false);
    }

    onAnimationEnd == null ? void 0 : onAnimationEnd();
  };

  var containerModal = container || refContainer.current;
  var overlayAnimation = open ? (_classNames$overlayAn = classNames == null ? void 0 : classNames.overlayAnimationIn) != null ? _classNames$overlayAn : classes.overlayAnimationIn : (_classNames$overlayAn2 = classNames == null ? void 0 : classNames.overlayAnimationOut) != null ? _classNames$overlayAn2 : classes.overlayAnimationOut;
  var modalAnimation = open ? (_classNames$modalAnim = classNames == null ? void 0 : classNames.modalAnimationIn) != null ? _classNames$modalAnim : classes.modalAnimationIn : (_classNames$modalAnim2 = classNames == null ? void 0 : classNames.modalAnimationOut) != null ? _classNames$modalAnim2 : classes.modalAnimationOut;
  return showPortal && containerModal ? react_dom__WEBPACK_IMPORTED_MODULE_1___default().createPortal(react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(classes.root, classNames == null ? void 0 : classNames.root),
    style: styles == null ? void 0 : styles.root,
    "data-testid": "root"
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(classes.overlay, classNames == null ? void 0 : classNames.overlay),
    "data-testid": "overlay",
    "aria-hidden": true,
    style: _extends({
      animation: overlayAnimation + " " + animationDuration + "ms"
    }, styles == null ? void 0 : styles.overlay)
  }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    ref: refModal,
    id: containerId,
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(classes.modalContainer, center && classes.modalContainerCenter, classNames == null ? void 0 : classNames.modalContainer),
    style: styles == null ? void 0 : styles.modalContainer,
    "data-testid": "modal-container",
    onClick: handleClickOverlay
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    ref: refDialog,
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(classes.modal, classNames == null ? void 0 : classNames.modal),
    style: _extends({
      animation: modalAnimation + " " + animationDuration + "ms"
    }, styles == null ? void 0 : styles.modal),
    onMouseDown: handleModalEvent,
    onMouseUp: handleModalEvent,
    onClick: handleModalEvent,
    onAnimationEnd: handleAnimationEnd,
    id: modalId,
    role: role,
    "aria-modal": "true",
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "data-testid": "modal",
    tabIndex: -1
  }, focusTrapped && react__WEBPACK_IMPORTED_MODULE_0___default().createElement(FocusTrap, {
    container: refDialog,
    initialFocusRef: initialFocusRef
  }), children, showCloseIcon && react__WEBPACK_IMPORTED_MODULE_0___default().createElement(CloseIcon, {
    classes: classes,
    classNames: classNames,
    styles: styles,
    closeIcon: closeIcon,
    onClick: onClose,
    id: closeIconId
  })))), containerModal) : null;
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);

//# sourceMappingURL=react-responsive-modal.esm.js.map


/***/ })

}]);
//# sourceMappingURL=vendors-checkout-order-pay-thank-you-side-cart.js.map