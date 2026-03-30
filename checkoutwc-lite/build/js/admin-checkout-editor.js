/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/@floating-ui+core@1.7.3/node_modules/@floating-ui/core/dist/floating-ui.core.mjs":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@floating-ui+core@1.7.3/node_modules/@floating-ui/core/dist/floating-ui.core.mjs ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   rectToClientRect: () => (/* reexport safe */ _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
  const alignmentAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
  const alignLength = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(alignmentAxis);
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
  const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentAxis)(placement);
    const length = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAxisLength)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment), ...allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement) === alignment || (autoAlignment ? (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAlignmentPlacement)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const initialSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(initialPlacement);
      const isBasePlacement = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositePlacement)(initialPlacement)] : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getExpandedPlacements)(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...(0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxisPlacements)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignmentSides)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return _floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.left));
  const minY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...rects.map(rect => rect.top));
  const maxX = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.right));
  const maxY = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getPaddingObject)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          const isLeftSide = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement) === 'left';
          const maxRight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(...clientRects.map(rect => rect.right));
          const minLeft = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
  const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
  const isVertical = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement);
      const mainAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getOppositeAxis)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has((0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.evaluate)(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSide)(placement);
      const alignment = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getAlignment)(placement);
      const isYAxis = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.getSideAxis)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.min)(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, 0);
        const xMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.right, 0);
        const yMin = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, 0);
        const yMax = (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : (0,_floating_ui_utils__WEBPACK_IMPORTED_MODULE_0__.max)(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};




/***/ }),

/***/ "./node_modules/.pnpm/@floating-ui+dom@1.7.4/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@floating-ui+dom@1.7.4/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrow: () => (/* binding */ arrow),
/* harmony export */   autoPlacement: () => (/* binding */ autoPlacement),
/* harmony export */   autoUpdate: () => (/* binding */ autoUpdate),
/* harmony export */   computePosition: () => (/* binding */ computePosition),
/* harmony export */   detectOverflow: () => (/* binding */ detectOverflow),
/* harmony export */   flip: () => (/* binding */ flip),
/* harmony export */   getOverflowAncestors: () => (/* reexport safe */ _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors),
/* harmony export */   hide: () => (/* binding */ hide),
/* harmony export */   inline: () => (/* binding */ inline),
/* harmony export */   limitShift: () => (/* binding */ limitShift),
/* harmony export */   offset: () => (/* binding */ offset),
/* harmony export */   platform: () => (/* binding */ platform),
/* harmony export */   shift: () => (/* binding */ shift),
/* harmony export */   size: () => (/* binding */ size)
/* harmony export */ });
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @floating-ui/utils */ "./node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs");
/* harmony import */ var _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @floating-ui/core */ "./node_modules/.pnpm/@floating-ui+core@1.7.3/node_modules/@floating-ui/core/dist/floating-ui.core.mjs");
/* harmony import */ var _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @floating-ui/utils/dom */ "./node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs");





function getCssDimensions(element) {
  const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.round)(width) !== offsetWidth || (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.round)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(domElement)) {
    return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) : rect.width) / width;
  let y = ($ ? (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(0);
function getVisualOffsets(element) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(domElement);
    const offsetWin = offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(offsetParent) ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(currentIFrame);
      currentIFrame = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getFrameElement)(currentWin);
    }
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const topLayer = elements ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(1);
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(0);
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  const scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(element);
  const body = element.ownerDocument.body;
  const width = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.max)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.max)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(body).direction === 'rtl') {
    x += (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.max)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  const html = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isWebKit)();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  // <html> `overflow: hidden` + `scrollbar-gutter: stable` reduces the
  // visual width of the <html> but this is not considered in the size
  // of `html.clientWidth`.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  } else if (windowScrollbarX <= SCROLLBAR_MAX) {
    // If the <body> scrollbar is on the left, the width needs to be extended
    // by the scrollbar amount so there isn't extra space on the right.
    width += windowScrollbarX;
  }
  return {
    width,
    height,
    x,
    y
  };
}

const absoluteOrFixed = /*#__PURE__*/new Set(['absolute', 'fixed']);
// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element) ? getScale(element) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element));
  } else if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.rectToClientRect)(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element);
  if (parentNode === stopNode || !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(parentNode) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(parentNode)) {
    return false;
  }
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(element, [], false).filter(el => (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(el) && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(currentNode) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(currentNode)) {
    const computedStyle = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(currentNode);
    const currentNodeIsContaining = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.max)(rect.top, accRect.top);
    accRect.right = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(offsetParent);
  const documentElement = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(0);

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeName)(offsetParent) !== 'body' || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isOverflowElement)(documentElement)) {
      scroll = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getNodeScroll)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.createCoords)(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element) || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
  if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTopLayer)(element)) {
    return win;
  }
  if (!(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element)) {
    let svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(element);
    while (svgOffsetParent && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(svgOffsetParent)) {
      if ((0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement)(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getParentNode)(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isTableElement)(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isLastTraversableNode)(offsetParent) && isStaticPositioned(offsetParent) && !(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isContainingBlock)(offsetParent)) {
    return win;
  }
  return offsetParent || (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getContainingBlock)(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getComputedStyle)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: _floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getDocumentElement)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.floor)(top);
    const insetRight = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.floor)(root.clientWidth - (left + width));
    const insetBottom = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.floor)(root.clientHeight - (top + height));
    const insetLeft = (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.floor)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.max)(0, (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_0__.min)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        // It's possible that even though the ratio is reported as 1, the
        // element is not actually fully within the IntersectionObserver's root
        // area anymore. This can happen under performance constraints. This may
        // be a bug in the browser's IntersectionObserver implementation. To
        // work around this, we compare the element's bounding rect now with
        // what it was at the time we created the IntersectionObserver. If they
        // are not equal then the element moved, so we refresh.
        refresh();
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(referenceEl) : []), ...(0,_floating_ui_utils_dom__WEBPACK_IMPORTED_MODULE_2__.getOverflowAncestors)(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectOverflow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.detectOverflow;

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.offset;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = _floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return (0,_floating_ui_core__WEBPACK_IMPORTED_MODULE_1__.computePosition)(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ }),

/***/ "./node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs":
/*!*********************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getComputedStyle: () => (/* binding */ getComputedStyle),
/* harmony export */   getContainingBlock: () => (/* binding */ getContainingBlock),
/* harmony export */   getDocumentElement: () => (/* binding */ getDocumentElement),
/* harmony export */   getFrameElement: () => (/* binding */ getFrameElement),
/* harmony export */   getNearestOverflowAncestor: () => (/* binding */ getNearestOverflowAncestor),
/* harmony export */   getNodeName: () => (/* binding */ getNodeName),
/* harmony export */   getNodeScroll: () => (/* binding */ getNodeScroll),
/* harmony export */   getOverflowAncestors: () => (/* binding */ getOverflowAncestors),
/* harmony export */   getParentNode: () => (/* binding */ getParentNode),
/* harmony export */   getWindow: () => (/* binding */ getWindow),
/* harmony export */   isContainingBlock: () => (/* binding */ isContainingBlock),
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isLastTraversableNode: () => (/* binding */ isLastTraversableNode),
/* harmony export */   isNode: () => (/* binding */ isNode),
/* harmony export */   isOverflowElement: () => (/* binding */ isOverflowElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot),
/* harmony export */   isTableElement: () => (/* binding */ isTableElement),
/* harmony export */   isTopLayer: () => (/* binding */ isTopLayer),
/* harmony export */   isWebKit: () => (/* binding */ isWebKit)
/* harmony export */ });
function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
const invalidOverflowDisplayValues = /*#__PURE__*/new Set(['inline', 'contents']);
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
}
const tableElements = /*#__PURE__*/new Set(['table', 'td', 'th']);
function isTableElement(element) {
  return tableElements.has(getNodeName(element));
}
const topLayerSelectors = [':popover-open', ':modal'];
function isTopLayer(element) {
  return topLayerSelectors.some(selector => {
    try {
      return element.matches(selector);
    } catch (_e) {
      return false;
    }
  });
}
const transformProperties = ['transform', 'translate', 'scale', 'rotate', 'perspective'];
const willChangeValues = ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'];
const containValues = ['paint', 'layout', 'strict', 'content'];
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return transformProperties.some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || willChangeValues.some(value => (css.willChange || '').includes(value)) || containValues.some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
const lastTraversableNodeNames = /*#__PURE__*/new Set(['html', 'body', '#document']);
function isLastTraversableNode(node) {
  return lastTraversableNodeNames.has(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}




/***/ }),

/***/ "./node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alignments: () => (/* binding */ alignments),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   createCoords: () => (/* binding */ createCoords),
/* harmony export */   evaluate: () => (/* binding */ evaluate),
/* harmony export */   expandPaddingObject: () => (/* binding */ expandPaddingObject),
/* harmony export */   floor: () => (/* binding */ floor),
/* harmony export */   getAlignment: () => (/* binding */ getAlignment),
/* harmony export */   getAlignmentAxis: () => (/* binding */ getAlignmentAxis),
/* harmony export */   getAlignmentSides: () => (/* binding */ getAlignmentSides),
/* harmony export */   getAxisLength: () => (/* binding */ getAxisLength),
/* harmony export */   getExpandedPlacements: () => (/* binding */ getExpandedPlacements),
/* harmony export */   getOppositeAlignmentPlacement: () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   getOppositeAxis: () => (/* binding */ getOppositeAxis),
/* harmony export */   getOppositeAxisPlacements: () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   getOppositePlacement: () => (/* binding */ getOppositePlacement),
/* harmony export */   getPaddingObject: () => (/* binding */ getPaddingObject),
/* harmony export */   getSide: () => (/* binding */ getSide),
/* harmony export */   getSideAxis: () => (/* binding */ getSideAxis),
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   rectToClientRect: () => (/* binding */ rectToClientRect),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   sides: () => (/* binding */ sides)
/* harmony export */ });
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
const yAxisSides = /*#__PURE__*/new Set(['top', 'bottom']);
function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}




/***/ }),

/***/ "./sources/scss/admin/checkout-editor.scss":
/*!*************************************************!*\
  !*** ./sources/scss/admin/checkout-editor.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorApp.tsx":
/*!******************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorApp.tsx ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const api_fetch_1 = __importDefault(__webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch"));
const EditorHeader_1 = __importDefault(__webpack_require__(/*! ./EditorHeader */ "./sources/ts/admin/Components/CheckoutEditor/EditorHeader.tsx"));
const EditorSidebar_1 = __importDefault(__webpack_require__(/*! ./EditorSidebar */ "./sources/ts/admin/Components/CheckoutEditor/EditorSidebar.tsx"));
const EditorPreview_1 = __importDefault(__webpack_require__(/*! ./EditorPreview */ "./sources/ts/admin/Components/CheckoutEditor/EditorPreview.tsx"));
const FormObserver_1 = __importDefault(__webpack_require__(/*! ./FormObserver */ "./sources/ts/admin/Components/CheckoutEditor/FormObserver.tsx"));
const cfwFormatFormValuesForSave_1 = __importDefault(__webpack_require__(/*! ../../../functions/cfwFormatFormValuesForSave */ "./sources/ts/functions/cfwFormatFormValuesForSave.ts"));
const LoggingService_1 = __importDefault(__webpack_require__(/*! ../../../frontend/Services/LoggingService */ "./sources/ts/frontend/Services/LoggingService.ts"));
const EditorApp = () => {
    var _a, _b, _c, _d, _e;
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [previewKey, setPreviewKey] = (0, react_1.useState)(Date.now());
    const [previewPending, setPreviewPending] = (0, react_1.useState)(false);
    const [device, setDevice] = (0, react_1.useState)('desktop');
    const [savedTemplateSlug, setSavedTemplateSlug] = (0, react_1.useState)(() => { var _a, _b; return cfwAdminPagesData.saved_active_template || ((_b = (_a = cfwAdminPagesData.editor_settings) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.template_path) || ''; });
    const editorSettingsData = ((_a = cfwAdminPagesData.editor_settings) === null || _a === void 0 ? void 0 : _a.settings) || {};
    const colorSettingsDefaults = ((_c = (_b = cfwAdminPagesData.editor_settings) === null || _b === void 0 ? void 0 : _b.params) === null || _c === void 0 ? void 0 : _c.color_settings_defaults) || {};
    const initialValues = Object.assign(Object.assign({}, editorSettingsData), colorSettingsDefaults);
    const previewUrl = cfwAdminPagesData.preview_url || '';
    const hasProducts = cfwAdminPagesData.has_products || false;
    const closeUrl = cfwAdminPagesData.close_url || '';
    const editorUrl = cfwAdminPagesData.editor_url || '';
    const initialTemplateSlug = ((_e = (_d = cfwAdminPagesData.editor_settings) === null || _d === void 0 ? void 0 : _d.params) === null || _e === void 0 ? void 0 : _e.template_path) || '';
    const templates = cfwAdminPagesData.templates || [];
    const handlePreviewUpdate = (0, react_1.useCallback)(() => {
        setPreviewPending(false);
        setPreviewKey(Date.now());
    }, []);
    const handlePreviewRequest = (0, react_1.useCallback)(() => {
        setPreviewPending(true);
    }, []);
    const handleClose = (0, react_1.useCallback)((dirty) => {
        const cleanup = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, api_fetch_1.default)({
                    path: '/checkoutwc/v1/preview-settings',
                    method: 'DELETE',
                });
            }
            catch (e) {
                // Silently fail.
            }
        });
        if (dirty) {
            // eslint-disable-next-line no-alert
            if (!window.confirm((0, i18n_1.__)('You have unsaved changes. Are you sure you want to leave?', 'checkout-wc'))) {
                return;
            }
        }
        cleanup().then(() => {
            window.location.href = closeUrl;
        });
    }, [closeUrl]);
    const handleSave = (0, react_1.useCallback)((values, resetForm) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        setIsSaving(true);
        try {
            const templatePath = ((_b = (_a = cfwAdminPagesData.editor_settings) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.template_path) || '';
            const valuesToSave = templatePath
                ? Object.assign(Object.assign({}, values), { active_template: templatePath }) : values;
            yield (0, api_fetch_1.default)({
                path: '/checkoutwc/v1/settings',
                method: 'POST',
                data: {
                    settings: (0, cfwFormatFormValuesForSave_1.default)(valuesToSave),
                },
            });
            // Clear preview transient.
            yield (0, api_fetch_1.default)({
                path: '/checkoutwc/v1/preview-settings',
                method: 'DELETE',
            });
            // Reset dirty state.
            resetForm({ values });
            // Treat the current template as saved so the "unsaved" indicator clears.
            if (templatePath) {
                setSavedTemplateSlug(templatePath);
            }
            // Reload preview to reflect saved settings.
            setPreviewKey(Date.now());
        }
        catch (error) {
            /* translators: %s is the error message */
            alert((0, i18n_1.__)('Failed to save settings. Error: %s', 'checkout-wc').replace('%s', error.message));
            LoggingService_1.default.logError('Failed to save settings.', error);
        }
        finally {
            setIsSaving(false);
        }
    }), []);
    const handleDiscard = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        // eslint-disable-next-line no-alert
        if (!window.confirm((0, i18n_1.__)('Are you sure you want to discard all unsaved changes?', 'checkout-wc'))) {
            return;
        }
        try {
            yield (0, api_fetch_1.default)({
                path: '/checkoutwc/v1/preview-settings',
                method: 'DELETE',
            });
        }
        catch (_a) {
            // Silently fail.
        }
        // If the only change was switching template, go back to the saved template editor.
        if (initialTemplateSlug !== savedTemplateSlug) {
            window.location.href = editorUrl;
        }
        else {
            window.location.reload();
        }
    }), [initialTemplateSlug, savedTemplateSlug, editorUrl]);
    const handleTemplateChange = (0, react_1.useCallback)((slug) => {
        if (!slug || slug === initialTemplateSlug || !editorUrl) {
            return;
        }
        // eslint-disable-next-line no-alert
        const confirmSwitch = window.confirm((0, i18n_1.__)('Changing templates will update the logo, typography, colors, field label style, and footer text to those defined by the selected template. Are you sure you want to continue?', 'checkout-wc'));
        if (!confirmSwitch) {
            return;
        }
        const url = new URL(editorUrl);
        url.searchParams.set('cfw_editor_template', slug);
        window.location.href = url.toString();
    }, [initialTemplateSlug, editorUrl]);
    // beforeunload handler
    (0, react_1.useEffect)(() => {
        // We'll track dirty state via a ref that the Formik render prop updates.
        // This is handled inside the Formik render prop below.
    }, []);
    return (react_1.default.createElement(formik_1.Formik, { initialValues: initialValues, enableReinitialize: false, onSubmit: () => {
            // Submit handled by save button.
        } }, ({ values, dirty, resetForm, setFieldValue }) => {
        var _a, _b;
        // beforeunload handler for unsaved changes.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        (0, react_1.useEffect)(() => {
            const handler = (e) => {
                if (dirty || initialTemplateSlug !== savedTemplateSlug) {
                    e.preventDefault();
                }
            };
            window.addEventListener('beforeunload', handler);
            return () => window.removeEventListener('beforeunload', handler);
        }, [dirty, initialTemplateSlug, savedTemplateSlug]);
        return (react_1.default.createElement("div", { className: "cfw-tw cfw-editor" },
            react_1.default.createElement(EditorHeader_1.default, { isDirty: dirty || initialTemplateSlug !== savedTemplateSlug, isSaving: isSaving, device: device, onDeviceChange: setDevice, liveEnabled: !!values.enable, requiresLicense: !!((_b = (_a = cfwAdminPagesData.editor_settings) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.requires_license), onSetLiveEnabled: (next) => {
                    setFieldValue('enable', next);
                }, onSave: () => handleSave(values, resetForm), onDiscard: handleDiscard, onClose: () => handleClose(dirty || initialTemplateSlug !== savedTemplateSlug) }),
            react_1.default.createElement("div", { className: "cfw-editor__body" },
                react_1.default.createElement(EditorSidebar_1.default, { templates: templates, activeTemplateSlug: initialTemplateSlug, onTemplateChange: (slug) => handleTemplateChange(slug) }),
                react_1.default.createElement(EditorPreview_1.default, { previewUrl: previewUrl, previewKey: previewKey, device: device, hasProducts: hasProducts, previewPending: previewPending })),
            react_1.default.createElement(FormObserver_1.default, { onPreviewUpdate: handlePreviewUpdate, onPreviewRequest: handlePreviewRequest })));
    }));
};
exports["default"] = EditorApp;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorCheckboxField.tsx":
/*!****************************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorCheckboxField.tsx ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const EyeIcon_1 = __importDefault(__webpack_require__(/*! @heroicons/react/24/outline/EyeIcon */ "./node_modules/.pnpm/@heroicons+react@2.2.0_react@18.3.1/node_modules/@heroicons/react/24/outline/EyeIcon.js"));
const EyeSlashIcon_1 = __importDefault(__webpack_require__(/*! @heroicons/react/24/outline/EyeSlashIcon */ "./node_modules/.pnpm/@heroicons+react@2.2.0_react@18.3.1/node_modules/@heroicons/react/24/outline/EyeSlashIcon.js"));
const pickValidCheckboxProps_1 = __webpack_require__(/*! ../../functions/pickValidCheckboxProps */ "./sources/ts/admin/functions/pickValidCheckboxProps.ts");
const CheckboxField_1 = __importDefault(__webpack_require__(/*! ../Fields/CheckboxField */ "./sources/ts/admin/Components/Fields/CheckboxField.tsx"));
/**
 * Checkbox for the checkout editor: normal checkbox by default.
 * Pass useEyeToggle={true} for fields that should show the eye on/off style.
 * Editor use only; does not affect other settings pages.
 */
const EditorCheckboxField = (_a) => {
    var { name, label, description = '', nested = false, enabled = true, disabled = false, useEyeToggle = false, invertValue = false } = _a, props = __rest(_a, ["name", "label", "description", "nested", "enabled", "disabled", "useEyeToggle", "invertValue"]);
    const { values, setFieldValue } = (0, formik_1.useFormikContext)();
    const storedValue = !!values[name];
    const checked = invertValue ? !storedValue : storedValue;
    if (!useEyeToggle) {
        return (react_1.default.createElement(CheckboxField_1.default, Object.assign({ name: name, label: label, description: description, nested: nested, enabled: enabled, disabled: disabled }, props)));
    }
    const handleToggle = () => {
        if (disabled || !enabled) {
            return;
        }
        const newChecked = !checked;
        const newStoredValue = invertValue ? !newChecked : newChecked;
        setFieldValue(name, newStoredValue);
    };
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container relative flex items-start cfw-editor-checkbox-toggle ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement(formik_1.Field, Object.assign({ type: "checkbox", id: `cfw_checkbox_${name}`, name: name, className: "sr-only", disabled: disabled }, (0, pickValidCheckboxProps_1.pickValidCheckboxProps)(props))),
        react_1.default.createElement("button", { type: "button", onClick: handleToggle, disabled: disabled || !enabled, className: `flex items-center justify-center h-5 w-5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none ${checked ? 'text-green-600 hover:text-green-700' : 'text-gray-500 hover:text-gray-700'}`, "aria-label": checked ? (0, i18n_1.__)('On', 'checkout-wc') : (0, i18n_1.__)('Off', 'checkout-wc'), "aria-pressed": checked }, checked ? (react_1.default.createElement(EyeIcon_1.default, { className: "h-5 w-5", "aria-hidden": true })) : (react_1.default.createElement(EyeSlashIcon_1.default, { className: "h-5 w-5", "aria-hidden": true }))),
        react_1.default.createElement("div", { className: "ms-3 text-sm flex items-center min-h-[1.25rem]" },
            react_1.default.createElement("label", { htmlFor: `cfw_checkbox_${name}`, className: "font-medium text-gray-700 cursor-pointer", style: { verticalAlign: 'unset' } }, label))));
};
exports["default"] = EditorCheckboxField;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorCheckboxGroupField.tsx":
/*!*********************************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorCheckboxGroupField.tsx ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const EyeIcon_1 = __importDefault(__webpack_require__(/*! @heroicons/react/24/outline/EyeIcon */ "./node_modules/.pnpm/@heroicons+react@2.2.0_react@18.3.1/node_modules/@heroicons/react/24/outline/EyeIcon.js"));
const EyeSlashIcon_1 = __importDefault(__webpack_require__(/*! @heroicons/react/24/outline/EyeSlashIcon */ "./node_modules/.pnpm/@heroicons+react@2.2.0_react@18.3.1/node_modules/@heroicons/react/24/outline/EyeSlashIcon.js"));
/**
 * Checkbox group for the checkout editor. When useEyeToggle is true,
 * each option is rendered as an eye (on) / eye-slash (off) toggle.
 * Editor use only.
 */
const EditorCheckboxGroupField = ({ name, label, description = '', nested = false, enabled = true, options, useEyeToggle = false, }) => {
    const [field, , helpers] = (0, formik_1.useField)({ name });
    const rawValue = field.value;
    const valueArray = Array.isArray(rawValue) ? rawValue : [];
    const valueSet = new Set(valueArray);
    const handleToggle = (optionValue) => {
        const set = new Set(valueArray);
        if (set.has(optionValue)) {
            set.delete(optionValue);
        }
        else {
            set.add(optionValue);
        }
        helpers.setValue(Array.from(set));
    };
    if (!useEyeToggle) {
        // Use standard checkboxes via a simple inline implementation to avoid importing CheckboxGroupField
        return (react_1.default.createElement("div", { className: `cfw-admin-field-container cfw-editor-checkbox-group ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
            label && react_1.default.createElement("legend", { className: "text-sm font-medium text-gray-700" }, label),
            description && react_1.default.createElement("p", { className: "mt-1 text-sm text-gray-500" }, description),
            react_1.default.createElement("div", { className: "cfw-editor-checkbox-group__options" }, options.map(({ value, label: optionLabel }) => (react_1.default.createElement("div", { key: value, className: "flex items-start mt-3" },
                react_1.default.createElement("div", { className: "h-5 flex items-center" },
                    react_1.default.createElement("input", { type: "checkbox", name: name, value: value, id: `${name}_${value}`, checked: valueSet.has(value), onChange: (e) => handleToggle(value), disabled: !enabled, className: "focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300 rounded" })),
                react_1.default.createElement("div", { className: "ms-3 text-sm" },
                    react_1.default.createElement("label", { htmlFor: `${name}_${value}`, className: "font-medium text-gray-700" }, optionLabel))))))));
    }
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container cfw-editor-checkbox-group cfw-editor-checkbox-group--eye ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        label && react_1.default.createElement("legend", { className: "text-sm font-medium text-gray-700" }, label),
        description && react_1.default.createElement("p", { className: "mt-1 text-sm text-gray-500" }, description),
        react_1.default.createElement("div", { className: "cfw-editor-checkbox-group__options" }, options.map(({ value, label: optionLabel }) => {
            const checked = valueSet.has(value);
            return (react_1.default.createElement("button", { key: value, type: "button", onClick: () => handleToggle(value), disabled: !enabled, className: "cfw-editor-checkbox-group__row flex items-center text-left rounded py-0.5 w-fit focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none", "aria-label": `${optionLabel}: ${checked ? (0, i18n_1.__)('On', 'checkout-wc') : (0, i18n_1.__)('Off', 'checkout-wc')}`, "aria-pressed": checked },
                react_1.default.createElement("span", { className: `flex items-center justify-center h-5 w-5 rounded flex-shrink-0 ${checked ? 'text-green-600 hover:text-green-700' : 'text-gray-500 hover:text-gray-700'}`, "aria-hidden": true }, checked ? (react_1.default.createElement(EyeIcon_1.default, { className: "h-5 w-5", "aria-hidden": true })) : (react_1.default.createElement(EyeSlashIcon_1.default, { className: "h-5 w-5", "aria-hidden": true }))),
                react_1.default.createElement("span", { className: "ms-3 text-sm font-medium text-gray-700" }, optionLabel)));
        }))));
};
exports["default"] = EditorCheckboxGroupField;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorFieldGroup.tsx":
/*!*************************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorFieldGroup.tsx ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
/**
 * Groups a main setting with its sub-settings so that border/margin is applied
 * after the whole group, and sub-settings appear in one indented gray block.
 */
const EditorFieldGroup = ({ children, nestedFields }) => {
    const hasNestedFields = nestedFields != null;
    let nestedFieldCount = 0;
    if (hasNestedFields) {
        if (react_1.default.isValidElement(nestedFields) && nestedFields.type === react_1.default.Fragment) {
            nestedFieldCount = react_1.default.Children.count(nestedFields.props.children);
        }
        else {
            nestedFieldCount = react_1.default.Children.count(nestedFields);
        }
    }
    const hasSingleNestedField = nestedFieldCount === 1;
    return (react_1.default.createElement("div", { className: "cfw-editor-field-group" },
        children,
        hasNestedFields && (react_1.default.createElement("div", { className: "cfw-editor-nested-fields", "data-single-field": hasSingleNestedField ? 'true' : undefined }, nestedFields))));
};
exports["default"] = EditorFieldGroup;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorHeader.tsx":
/*!*********************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorHeader.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const EditorHeader = ({ isDirty, isSaving, device, onDeviceChange, onSave, onDiscard, onClose, liveEnabled, requiresLicense, onSetLiveEnabled, }) => {
    const [isLiveMenuOpen, setIsLiveMenuOpen] = (0, react_1.useState)(false);
    const liveMenuRef = (0, react_1.useRef)(null);
    const liveButtonRef = (0, react_1.useRef)(null);
    const liveStatusLabel = liveEnabled ? (0, i18n_1.__)('Live', 'checkout-wc') : (0, i18n_1.__)('Preview', 'checkout-wc');
    (0, react_1.useEffect)(() => {
        const handleDocumentPointerDown = (e) => {
            const target = e.target;
            if (isLiveMenuOpen) {
                const liveMenu = liveMenuRef.current;
                const liveButton = liveButtonRef.current;
                if (liveMenu && !liveMenu.contains(target) && liveButton && !liveButton.contains(target)) {
                    setIsLiveMenuOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleDocumentPointerDown);
        return () => document.removeEventListener('mousedown', handleDocumentPointerDown);
    }, [isLiveMenuOpen]);
    return (react_1.default.createElement("div", { className: "cfw-editor__header" },
        react_1.default.createElement("div", { className: "cfw-editor__header-left" },
            react_1.default.createElement("button", { type: "button", className: "cfw-editor__close-btn", onClick: onClose, title: (0, i18n_1.__)('Close', 'checkout-wc') },
                react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))),
            (cfwAdminPagesData === null || cfwAdminPagesData === void 0 ? void 0 : cfwAdminPagesData.editor_logo_url) && (react_1.default.createElement("img", { src: cfwAdminPagesData.editor_logo_url, alt: "CheckoutWC", className: "cfw-editor__header-logo" })),
            react_1.default.createElement("h1", { className: "cfw-editor__title" }, (0, i18n_1.__)('Checkout Editor', 'checkout-wc')),
            react_1.default.createElement("div", { className: "cfw-editor__live-indicator-wrap" },
                react_1.default.createElement("button", { ref: liveButtonRef, type: "button", className: `cfw-editor__live-indicator ${liveEnabled ? 'cfw-editor__live-indicator--on' : 'cfw-editor__live-indicator--off'}`, "aria-label": liveStatusLabel, "aria-haspopup": "menu", "aria-expanded": isLiveMenuOpen, onClick: () => setIsLiveMenuOpen((prev) => !prev), disabled: isSaving, title: liveStatusLabel },
                    react_1.default.createElement("span", { className: "cfw-editor__live-indicator-dot", "aria-hidden": true }),
                    react_1.default.createElement("span", { className: "cfw-editor__live-indicator-text", "aria-hidden": true }, liveStatusLabel),
                    react_1.default.createElement("svg", { className: `cfw-editor__live-indicator-caret ${isLiveMenuOpen ? 'cfw-editor__live-indicator-caret--open' : ''}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "aria-hidden": true },
                        react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }))),
                isLiveMenuOpen && (react_1.default.createElement("div", { ref: liveMenuRef, className: "cfw-editor__dropdown-menu", role: "menu" },
                    react_1.default.createElement("button", { type: "button", className: "cfw-editor__dropdown-menu-item", role: "menuitem", onClick: () => {
                            onSetLiveEnabled(true);
                            setIsLiveMenuOpen(false);
                        }, disabled: isSaving }, (0, i18n_1.__)('Live', 'checkout-wc')),
                    react_1.default.createElement("button", { type: "button", className: "cfw-editor__dropdown-menu-item", role: "menuitem", onClick: () => {
                            onSetLiveEnabled(false);
                            setIsLiveMenuOpen(false);
                        }, disabled: isSaving }, (0, i18n_1.__)('Preview', 'checkout-wc')),
                    requiresLicense && (react_1.default.createElement("div", { className: "cfw-editor__dropdown-menu-helper", role: "note" }, (0, i18n_1.__)('Set the checkout to live and save your changes to make it available to customers. Please note that a valid, active license key is required to go live.', 'checkout-wc'))))))),
        react_1.default.createElement("div", { className: "cfw-editor__header-center" },
            isDirty && (react_1.default.createElement("div", { className: "cfw-editor__unsaved" },
                react_1.default.createElement("span", { className: "cfw-editor__unsaved-dot" }),
                react_1.default.createElement("span", null, (0, i18n_1.__)('Unsaved changes', 'checkout-wc')))),
            react_1.default.createElement("div", { className: "cfw-editor__device-toggle" },
                react_1.default.createElement("button", { type: "button", className: device === 'desktop' ? 'active' : '', onClick: () => onDeviceChange('desktop'), title: (0, i18n_1.__)('Desktop', 'checkout-wc') },
                    react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                        react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }))),
                react_1.default.createElement("button", { type: "button", className: device === 'tablet' ? 'active' : '', onClick: () => onDeviceChange('tablet'), title: (0, i18n_1.__)('Tablet', 'checkout-wc') },
                    react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                        react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }))),
                react_1.default.createElement("button", { type: "button", className: device === 'mobile' ? 'active' : '', onClick: () => onDeviceChange('mobile'), title: (0, i18n_1.__)('Mobile', 'checkout-wc') },
                    react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                        react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" }))))),
        react_1.default.createElement("div", { className: "cfw-editor__header-right" },
            isDirty && (react_1.default.createElement("button", { type: "button", className: "cfw-editor__discard-changes-btn", onClick: onDiscard, disabled: isSaving }, (0, i18n_1.__)('Discard Changes', 'checkout-wc'))),
            react_1.default.createElement("button", { type: "button", className: "cfw-editor__save-changes-btn", onClick: onSave, disabled: !isDirty || isSaving }, isSaving ? (0, i18n_1.__)('Saving...', 'checkout-wc') : (0, i18n_1.__)('Save Changes', 'checkout-wc')))));
};
exports["default"] = EditorHeader;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorPreview.tsx":
/*!**********************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorPreview.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const CFW_EDITOR_PREVIEW_HASH_MESSAGE = 'cfw-editor-preview-hash';
const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
};
const EditorPreview = ({ previewUrl, previewKey, device, hasProducts, previewPending = false }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const preservedHashRef = (0, react_1.useRef)('');
    const preservedScrollYRef = (0, react_1.useRef)(null);
    const iframeRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const handleMessage = (event) => {
            var _a, _b, _c;
            if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === CFW_EDITOR_PREVIEW_HASH_MESSAGE) {
                if (typeof ((_b = event.data) === null || _b === void 0 ? void 0 : _b.hash) === 'string') {
                    preservedHashRef.current = event.data.hash;
                }
                if (typeof ((_c = event.data) === null || _c === void 0 ? void 0 : _c.scrollY) === 'number' && !Number.isNaN(event.data.scrollY)) {
                    preservedScrollYRef.current = event.data.scrollY;
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    // Blur out when preview is reloading (previewKey changed)
    (0, react_1.useEffect)(() => {
        if (hasProducts) {
            setIsLoading(true);
        }
    }, [previewKey, hasProducts]);
    if (!hasProducts) {
        return (react_1.default.createElement("div", { className: "cfw-editor__preview" },
            react_1.default.createElement("div", { className: "cfw-editor__preview-no-products cfw-editor__alert" },
                react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", className: "cfw-editor__alert-icon", "aria-hidden": true },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })),
                react_1.default.createElement("p", null, (0, i18n_1.__)('No products can be found to show in the editor. Ensure you have products which are published and in stock.', 'checkout-wc')))));
    }
    const hash = preservedHashRef.current;
    const iframeSrc = `${previewUrl}&t=${previewKey}${hash ? hash : ''}`;
    const handleIframeLoad = () => {
        var _a, _b;
        try {
            const win = (_a = iframeRef.current) === null || _a === void 0 ? void 0 : _a.contentWindow;
            if ((_b = win === null || win === void 0 ? void 0 : win.location) === null || _b === void 0 ? void 0 : _b.hash) {
                preservedHashRef.current = win.location.hash;
            }
            if (win && typeof preservedScrollYRef.current === 'number' && !Number.isNaN(preservedScrollYRef.current)) {
                win.scrollTo({
                    top: preservedScrollYRef.current,
                });
            }
        }
        catch (_c) {
            // Cross-origin or not yet available; rely on postMessage from iframe
        }
        setIsLoading(false);
    };
    const showLoading = isLoading || previewPending;
    return (react_1.default.createElement("div", { className: "cfw-editor__preview" },
        react_1.default.createElement("div", { className: `cfw-editor__preview-frame${showLoading ? ' cfw-editor__preview-frame--loading' : ''}`, style: { width: deviceWidths[device] } },
            showLoading && (react_1.default.createElement("div", { className: "cfw-editor__preview-loading" },
                react_1.default.createElement("div", { className: "cfw-editor-spinner" }),
                react_1.default.createElement("span", { className: "cfw-editor__preview-loading-text" }, (0, i18n_1.__)('Updating preview…', 'checkout-wc')))),
            react_1.default.createElement("iframe", { ref: iframeRef, src: iframeSrc, onLoad: handleIframeLoad, key: previewKey, title: (0, i18n_1.__)('Checkout Preview', 'checkout-wc') }))));
};
exports["default"] = EditorPreview;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorSection.tsx":
/*!**********************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorSection.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const EditorSection = ({ id, title, children, defaultOpen = false, isOpen: controlledOpen, onToggle, statusColor, }) => {
    const [internalOpen, setInternalOpen] = (0, react_1.useState)(defaultOpen);
    const isControlled = controlledOpen !== undefined && onToggle !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const handleClick = () => {
        if (isControlled) {
            onToggle === null || onToggle === void 0 ? void 0 : onToggle();
        }
        else {
            setInternalOpen(!internalOpen);
        }
    };
    const statusDotClass = statusColor === 'green'
        ? 'bg-green-500'
        : statusColor === 'red'
            ? 'bg-red-500'
            : '';
    return (react_1.default.createElement("div", { className: "cfw-editor-section", "data-section-id": id },
        react_1.default.createElement("div", { className: `cfw-editor-section__header ${isOpen ? 'open' : ''}`, onClick: handleClick },
            react_1.default.createElement("h3", { className: "flex items-center gap-2" },
                react_1.default.createElement("span", null, title),
                statusColor && (react_1.default.createElement("span", { className: `inline-block h-2 w-2 rounded-full ${statusDotClass}`, "aria-hidden": "true" }))),
            react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }))),
        isOpen && (react_1.default.createElement("div", { className: "cfw-editor-section__body" }, children))));
};
exports["default"] = EditorSection;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorSidebar.tsx":
/*!**********************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorSidebar.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const EditorSettingsPanel_1 = __importDefault(__webpack_require__(/*! ./panels/EditorSettingsPanel */ "./sources/ts/admin/Components/CheckoutEditor/panels/EditorSettingsPanel.tsx"));
const EditorSidebar = ({ templates, activeTemplateSlug, onTemplateChange, }) => (react_1.default.createElement("div", { className: "cfw-editor__sidebar" },
    react_1.default.createElement("div", { className: "cfw-editor__sidebar-content" },
        react_1.default.createElement(EditorSettingsPanel_1.default, { templates: templates, activeTemplateSlug: activeTemplateSlug, onTemplateChange: onTemplateChange }))));
exports["default"] = EditorSidebar;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorSubSection.tsx":
/*!*************************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorSubSection.tsx ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const EditorSubSection = ({ id, title, children, defaultOpen = false, isOpen: controlledOpen, onToggle }) => {
    const [internalOpen, setInternalOpen] = (0, react_1.useState)(defaultOpen);
    const isControlled = controlledOpen !== undefined && onToggle !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const handleClick = () => {
        if (isControlled) {
            onToggle === null || onToggle === void 0 ? void 0 : onToggle();
        }
        else {
            setInternalOpen(!internalOpen);
        }
    };
    return (react_1.default.createElement("div", { className: "cfw-editor-subsection", "data-subsection-id": id },
        react_1.default.createElement("button", { type: "button", className: `cfw-editor-subsection__header ${isOpen ? 'open' : ''}`, onClick: handleClick },
            react_1.default.createElement("span", { className: "cfw-editor-subsection__title" }, title),
            react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }))),
        isOpen && (react_1.default.createElement("div", { className: "cfw-editor-subsection__body" }, children))));
};
exports["default"] = EditorSubSection;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/FormObserver.tsx":
/*!*********************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/FormObserver.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __webpack_require__(/*! react */ "react");
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const api_fetch_1 = __importDefault(__webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch"));
const PREVIEW_OMIT_KEYS = new Set(['cart_edit_empty_cart_redirect', 'enable']);
/** Build a stable string of only preview-relevant values so we can skip refresh when only omitted keys change. */
function getPreviewSignature(values) {
    const previewRelevant = {};
    Object.keys(values).forEach((key) => {
        if (PREVIEW_OMIT_KEYS.has(key)) {
            return;
        }
        const val = values[key];
        previewRelevant[key] = typeof val === 'boolean' ? (val ? 'yes' : 'no') : val;
    });
    return JSON.stringify(previewRelevant);
}
const FormObserver = ({ onPreviewUpdate, onPreviewRequest }) => {
    const { values } = (0, formik_1.useFormikContext)();
    const timerRef = (0, react_1.useRef)(null);
    const isFirstRender = (0, react_1.useRef)(true);
    const lastPreviewSignatureRef = (0, react_1.useRef)('');
    (0, react_1.useEffect)(() => {
        const signature = getPreviewSignature(values);
        // Skip the initial render.
        if (isFirstRender.current) {
            isFirstRender.current = false;
            lastPreviewSignatureRef.current = signature;
            return;
        }
        // Only refresh preview when preview-relevant values changed (e.g. not when only "enable" is toggled).
        if (signature === lastPreviewSignatureRef.current) {
            return;
        }
        lastPreviewSignatureRef.current = signature;
        // Show loading state right away so the user sees feedback instead of waiting for the debounce.
        onPreviewRequest === null || onPreviewRequest === void 0 ? void 0 : onPreviewRequest();
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const previewValues = {};
                Object.keys(values).forEach((key) => {
                    if (PREVIEW_OMIT_KEYS.has(key)) {
                        return;
                    }
                    const val = values[key];
                    if (typeof val === 'boolean') {
                        previewValues[key] = val ? 'yes' : 'no';
                    }
                    else {
                        previewValues[key] = val;
                    }
                });
                yield (0, api_fetch_1.default)({
                    path: '/checkoutwc/v1/preview-settings',
                    method: 'POST',
                    data: previewValues,
                });
                onPreviewUpdate();
            }
            catch (error) {
                // Silently fail — preview will just not update.
            }
        }), 800);
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [values]);
    return null;
};
exports["default"] = FormObserver;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/panels/EditorSettingsPanel.tsx":
/*!***********************************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/panels/EditorSettingsPanel.tsx ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const react_select_1 = __importDefault(__webpack_require__(/*! react-select */ "./node_modules/.pnpm/react-select@5.10.2_@types+react@18.3.27_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-select/dist/react-select.esm.js"));
const EditorSection_1 = __importDefault(__webpack_require__(/*! ../EditorSection */ "./sources/ts/admin/Components/CheckoutEditor/EditorSection.tsx"));
const EditorSubSection_1 = __importDefault(__webpack_require__(/*! ../EditorSubSection */ "./sources/ts/admin/Components/CheckoutEditor/EditorSubSection.tsx"));
const EditorFieldGroup_1 = __importDefault(__webpack_require__(/*! ../EditorFieldGroup */ "./sources/ts/admin/Components/CheckoutEditor/EditorFieldGroup.tsx"));
const WPMediaUploadButton_1 = __importDefault(__webpack_require__(/*! ../../Fields/WPMediaUploadButton */ "./sources/ts/admin/Components/Fields/WPMediaUploadButton.tsx"));
const RadioGroupField_1 = __importDefault(__webpack_require__(/*! ../../Fields/RadioGroupField */ "./sources/ts/admin/Components/Fields/RadioGroupField.tsx"));
const WYSIWYGField_1 = __importDefault(__webpack_require__(/*! ../../Fields/WYSIWYGField */ "./sources/ts/admin/Components/Fields/WYSIWYGField.tsx"));
const SelectField_1 = __importDefault(__webpack_require__(/*! ../../Fields/SelectField */ "./sources/ts/admin/Components/Fields/SelectField.tsx"));
const EditorCheckboxField_1 = __importDefault(__webpack_require__(/*! ../EditorCheckboxField */ "./sources/ts/admin/Components/CheckoutEditor/EditorCheckboxField.tsx"));
const EditorCheckboxGroupField_1 = __importDefault(__webpack_require__(/*! ../EditorCheckboxGroupField */ "./sources/ts/admin/Components/CheckoutEditor/EditorCheckboxGroupField.tsx"));
const CountriesMultiselectField_1 = __importDefault(__webpack_require__(/*! ../../Fields/CountriesMultiselectField */ "./sources/ts/admin/Components/Fields/CountriesMultiselectField.tsx"));
const ColorPickerField_1 = __importDefault(__webpack_require__(/*! ../../Fields/ColorPickerField */ "./sources/ts/admin/Components/Fields/ColorPickerField.tsx"));
const LockedFieldWrapper_1 = __importDefault(__webpack_require__(/*! ../../LockedFieldWrapper */ "./sources/ts/admin/Components/LockedFieldWrapper.tsx"));
const MediumAlert_1 = __importDefault(__webpack_require__(/*! ../../MediumAlert */ "./sources/ts/admin/Components/MediumAlert.tsx"));
const TextField_1 = __importDefault(__webpack_require__(/*! ../../Fields/TextField */ "./sources/ts/admin/Components/Fields/TextField.tsx"));
const NumberField_1 = __importDefault(__webpack_require__(/*! ../../Fields/NumberField */ "./sources/ts/admin/Components/Fields/NumberField.tsx"));
const cfwConvertOptionsObjectToArray_1 = __importDefault(__webpack_require__(/*! ../../../../functions/cfwConvertOptionsObjectToArray */ "./sources/ts/functions/cfwConvertOptionsObjectToArray.ts"));
const EDITOR_COLOR_SECTIONS = ['body', 'buttons', 'breadcrumbs', 'cart_summary', 'header', 'footer'];
const SECTION_IDS = {
    template: 'template',
    logo: 'logo',
    typography: 'typography',
    colors: 'colors',
    steps: 'steps',
    fields: 'fields',
    addresses: 'addresses',
    express_checkout: 'express_checkout',
    cart_summary: 'cart_summary',
    badges: 'badges',
    footer: 'footer',
    advanced: 'advanced',
};
const EditorSettingsPanel = ({ templates, activeTemplateSlug, onTemplateChange, }) => {
    var _a, _b, _c, _d, _e, _f;
    const { values, setFieldValue, initialValues } = (0, formik_1.useFormikContext)();
    const params = ((_a = cfwAdminPagesData.editor_settings) === null || _a === void 0 ? void 0 : _a.params) || {};
    const templatePath = params.template_path || '';
    const colorSettings = params.color_settings || {};
    const fontOptions = params.font_options || {};
    const logoPreviewUrl = params.logo_preview_url || '';
    const countries = params.countries || {};
    const conditionalSettings = params.conditional_settings || {};
    const plan = cfwAdminPagesData.plan;
    const onePageCheckoutEnabled = !!values.enable_one_page_checkout;
    const stepSuffix = onePageCheckoutEnabled ? '' : ` ${(0, i18n_1.__)('Step', 'checkout-wc')}`;
    const [openSectionId, setOpenSectionId] = (0, react_1.useState)(SECTION_IDS.template);
    const [openColorSubSectionId, setOpenColorSubSectionId] = (0, react_1.useState)(null);
    const [footerTextEditorMode, setFooterTextEditorMode] = (0, react_1.useState)(((_c = (_b = cfwAdminPagesData.editor_settings) === null || _b === void 0 ? void 0 : _b.settings) === null || _c === void 0 ? void 0 : _c.footer_text_editor_mode) || 'WYSIWYG');
    // One Page Checkout and Order Review Step are mutually exclusive.
    // Enforce this on load and whenever One Page Checkout is enabled so preview updates immediately.
    (0, react_1.useEffect)(() => {
        if (onePageCheckoutEnabled && values.enable_order_review_step) {
            setFieldValue('enable_order_review_step', false);
        }
    }, [onePageCheckoutEnabled, values.enable_order_review_step, setFieldValue]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.template, title: (0, i18n_1.__)('Template', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.template, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.template ? null : SECTION_IDS.template)) },
            react_1.default.createElement(formik_1.Field, { type: "hidden", name: "footer_text_editor_mode", value: footerTextEditorMode }),
            !!(templates === null || templates === void 0 ? void 0 : templates.length) && (react_1.default.createElement("div", { className: "cfw-admin-field-container cfw-admin-select-field" },
                react_1.default.createElement("label", { htmlFor: "cfw-template-select", className: "sr-only" }, (0, i18n_1.__)('Template', 'checkout-wc')),
                react_1.default.createElement(react_select_1.default, { inputId: "cfw-template-select", "aria-label": (0, i18n_1.__)('Template', 'checkout-wc'), isMulti: false, options: templates.map((template) => {
                        const isLocked = !!template.locked && template.slug !== activeTemplateSlug;
                        const labelParts = [template.name];
                        if (isLocked) {
                            labelParts.push((0, i18n_1.__)('Premium', 'checkout-wc'));
                        }
                        return {
                            value: template.slug,
                            label: labelParts.join(' – '),
                            isDisabled: isLocked,
                        };
                    }), value: (_d = templates
                        .filter((t) => t.slug === activeTemplateSlug)
                        .map((t) => {
                        const isLocked = !!t.locked && t.slug !== activeTemplateSlug;
                        return {
                            value: t.slug,
                            label: [t.name, isLocked ? (0, i18n_1.__)('Premium', 'checkout-wc') : ''].filter(Boolean).join(' – '),
                        };
                    })[0]) !== null && _d !== void 0 ? _d : null, onChange: (option) => {
                        if (!option || option.value === activeTemplateSlug) {
                            return;
                        }
                        const selected = templates.find((t) => t.slug === option.value);
                        if (selected === null || selected === void 0 ? void 0 : selected.locked) {
                            return;
                        }
                        onTemplateChange(option.value);
                    } })))),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.logo, title: (0, i18n_1.__)('Logo', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.logo, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.logo ? null : SECTION_IDS.logo)) },
            react_1.default.createElement(WPMediaUploadButton_1.default, { name: `logo_attachment_id_${templatePath}`, label: (0, i18n_1.__)('Logo', 'checkout-wc'), description: "", defaultUrl: logoPreviewUrl, hideLabel: true })),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.typography, title: (0, i18n_1.__)('Typography', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.typography, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.typography ? null : SECTION_IDS.typography)) },
            react_1.default.createElement(SelectField_1.default, { name: `body_font_${templatePath}`, label: (0, i18n_1.__)('Body Font', 'checkout-wc'), description: "", options: (0, cfwConvertOptionsObjectToArray_1.default)(fontOptions) }),
            react_1.default.createElement(SelectField_1.default, { name: `heading_font_${templatePath}`, label: (0, i18n_1.__)('Heading Font', 'checkout-wc'), description: "", options: (0, cfwConvertOptionsObjectToArray_1.default)(fontOptions) })),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.colors, title: (0, i18n_1.__)('Colors', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.colors, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.colors ? null : SECTION_IDS.colors)) }, EDITOR_COLOR_SECTIONS.map((sectionId) => {
            const section = colorSettings[sectionId];
            if (!section || Object.keys(section.settings || {}).length === 0) {
                return null;
            }
            const sectionTitles = {
                body: (0, i18n_1.__)('Body', 'checkout-wc'),
                buttons: (0, i18n_1.__)('Buttons', 'checkout-wc'),
                breadcrumbs: (0, i18n_1.__)('Breadcrumbs', 'checkout-wc'),
                cart_summary: (0, i18n_1.__)('Cart Summary', 'checkout-wc'),
                header: (0, i18n_1.__)('Header', 'checkout-wc'),
                footer: (0, i18n_1.__)('Footer', 'checkout-wc'),
            };
            return (react_1.default.createElement(EditorSubSection_1.default, { key: sectionId, id: sectionId, title: sectionTitles[sectionId] || section.title, isOpen: openColorSubSectionId === sectionId, onToggle: () => setOpenColorSubSectionId((prev) => (prev === sectionId ? null : sectionId)) },
                react_1.default.createElement("div", { className: "flex flex-wrap flex-row gap-2" }, Object.entries(section.settings).map(([settingName, settingLabel]) => (react_1.default.createElement(ColorPickerField_1.default, { key: settingName, name: `${settingName}_${templatePath}`, label: settingLabel, value: values[`${settingName}_${templatePath}`], defaultValue: initialValues[settingName] }))))));
        })),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.steps, title: (0, i18n_1.__)('Steps', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.steps, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.steps ? null : SECTION_IDS.steps)) },
            react_1.default.createElement(EditorCheckboxField_1.default, { name: "skip_shipping_step", label: `${(0, i18n_1.__)('Shipping Methods', 'checkout-wc')}${stepSuffix}`, description: "", useEyeToggle: true, invertValue: true }),
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'enable-order-review-step', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                !onePageCheckoutEnabled && (react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_order_review_step", label: `${(0, i18n_1.__)('Order Review', 'checkout-wc')}${stepSuffix}`, description: "", disabled: plan.plan_level < 1, useEyeToggle: true })),
                react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_one_page_checkout", label: (0, i18n_1.__)('One Page Checkout', 'checkout-wc'), description: "", disabled: plan.plan_level < 1, useEyeToggle: true }))),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.fields, title: (0, i18n_1.__)('Fields', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.fields, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.fields ? null : SECTION_IDS.fields)) },
            react_1.default.createElement(EditorCheckboxField_1.default, { name: "hide_optional_address_fields_behind_link", label: (0, i18n_1.__)('Address Fields Link', 'checkout-wc'), description: "" }),
            react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_coupon_code_link", label: (0, i18n_1.__)('Coupon Code Link', 'checkout-wc'), description: "" }),
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'field-options', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(EditorCheckboxField_1.default, { name: "use_fullname_field", label: (0, i18n_1.__)('Full Name Field', 'checkout-wc'), description: "", disabled: plan.plan_level < 1 }),
                react_1.default.createElement(EditorFieldGroup_1.default, { nestedFields: values.enable_discreet_address_1_fields ? (react_1.default.createElement(RadioGroupField_1.default, { name: "discreet_address_1_fields_order", label: (0, i18n_1.__)('Separate Address Fields Display Order', 'checkout-wc'), description: "", nested: false, options: [
                            { value: 'default', label: (0, i18n_1.__)('[House Number] [Street Name]', 'checkout-wc') },
                            { value: 'alternate', label: (0, i18n_1.__)('[Street Name] [House Number]', 'checkout-wc') },
                        ] })) : undefined },
                    react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_discreet_address_1_fields", label: (0, i18n_1.__)('Separate House Number/Street Name', 'checkout-wc'), description: "", disabled: plan.plan_level < 1 })),
                react_1.default.createElement(EditorFieldGroup_1.default, { nestedFields: values.enable_highlighted_countries ? (react_1.default.createElement(CountriesMultiselectField_1.default, { name: "highlighted_countries", label: (0, i18n_1.__)('Highlighted Countries', 'checkout-wc'), description: "", nested: false, countries: countries })) : undefined },
                    react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_highlighted_countries", label: (0, i18n_1.__)('Highlighted Countries', 'checkout-wc'), description: "", disabled: plan.plan_level < 1 }))),
            react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_order_notes", label: (0, i18n_1.__)('Order Notes', 'checkout-wc'), description: "", enabled: conditionalSettings.order_notes_enable }),
            !conditionalSettings.order_notes_enable && (react_1.default.createElement(MediumAlert_1.default, { description: (0, i18n_1.__)('Order Notes field is being controlled by a filter or a plugin.', 'checkout-wc') })),
            react_1.default.createElement(RadioGroupField_1.default, { name: `label_style_${templatePath}`, label: (0, i18n_1.__)('Field Label Style', 'checkout-wc'), description: "", options: [
                    { value: 'floating', label: (0, i18n_1.__)('Floating (Recommended)', 'checkout-wc') },
                    { value: 'normal', label: (0, i18n_1.__)('Normal', 'checkout-wc') },
                ] }),
            react_1.default.createElement(SelectField_1.default, { name: "wp_option/woocommerce_checkout_phone_field", label: (0, i18n_1.__)('Phone Field', 'checkout-wc'), description: "", options: [
                    { value: 'hidden', label: (0, i18n_1.__)('Hidden', 'checkout-wc') },
                    { value: 'optional', label: (0, i18n_1.__)('Optional', 'checkout-wc') },
                    { value: 'required', label: (0, i18n_1.__)('Required', 'checkout-wc') },
                ] })),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.addresses, title: (0, i18n_1.__)('Addresses', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.addresses, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.addresses ? null : SECTION_IDS.addresses)) },
            react_1.default.createElement(EditorCheckboxField_1.default, { name: "force_different_billing_address", label: (0, i18n_1.__)('Force Different Billing Address', 'checkout-wc'), description: "" }),
            react_1.default.createElement(EditorCheckboxGroupField_1.default, { name: "enabled_billing_address_fields", label: (0, i18n_1.__)('Billing Address Fields', 'checkout-wc'), description: "", useEyeToggle: true, options: [
                    { value: 'billing_first_name', label: (0, i18n_1.__)('First Name', 'checkout-wc') },
                    { value: 'billing_last_name', label: (0, i18n_1.__)('Last Name', 'checkout-wc') },
                    { value: 'billing_address_1', label: (0, i18n_1.__)('Address 1', 'checkout-wc') },
                    { value: 'billing_address_2', label: (0, i18n_1.__)('Address 2', 'checkout-wc') },
                    { value: 'billing_company', label: (0, i18n_1.__)('Company', 'checkout-wc') },
                    { value: 'billing_country', label: (0, i18n_1.__)('Country', 'checkout-wc') },
                    { value: 'billing_postcode', label: (0, i18n_1.__)('Postcode', 'checkout-wc') },
                    { value: 'billing_state', label: (0, i18n_1.__)('State', 'checkout-wc') },
                    { value: 'billing_city', label: (0, i18n_1.__)('City', 'checkout-wc') },
                    { value: 'billing_phone', label: (0, i18n_1.__)('Phone', 'checkout-wc') },
                ] })),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.express_checkout, title: (0, i18n_1.__)('Express Checkout', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.express_checkout, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.express_checkout ? null : SECTION_IDS.express_checkout)) },
            react_1.default.createElement(EditorCheckboxField_1.default, { name: "disable_express_checkout", label: (0, i18n_1.__)('Express Checkout', 'checkout-wc'), description: "", useEyeToggle: true, invertValue: true }),
            ((_f = (_e = params.express_checkout_gateways) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) === 0 && (react_1.default.createElement(MediumAlert_1.default, { description: (0, i18n_1.__)('No supported gateways detected.<br><a class="text-blue-600 hover:text-blue-800" target="_blank" href="https://www.checkoutwc.com/documentation/supported-express-payment-gateways/">See our recommendations.</a>', 'checkout-wc'), variant: "setting" }))),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.cart_summary, title: (0, i18n_1.__)('Cart Summary', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.cart_summary, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.cart_summary ? null : SECTION_IDS.cart_summary)) },
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'cart-editing-at-checkout', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(EditorFieldGroup_1.default, { nestedFields: plan.plan_level >= 1 && values.enable_cart_editing ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(EditorCheckboxField_1.default, { name: "allow_checkout_cart_item_variation_changes", label: (0, i18n_1.__)('Variation Edits', 'checkout-wc'), description: "", nested: false }),
                        react_1.default.createElement(EditorCheckboxField_1.default, { name: "show_item_remove_button", label: (0, i18n_1.__)('Item Remove', 'checkout-wc'), description: "", nested: false }))) : undefined },
                    react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_cart_editing", label: (0, i18n_1.__)('Cart Editing', 'checkout-wc'), description: "", disabled: plan.plan_level < 1 }))),
            react_1.default.createElement(EditorCheckboxField_1.default, { name: "show_cart_item_discount", label: (0, i18n_1.__)('Sale Prices', 'checkout-wc'), description: "" }),
            react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_sticky_cart_summary", label: (0, i18n_1.__)('Sticky Cart on Scroll', 'checkout-wc'), description: "" }),
            react_1.default.createElement(SelectField_1.default, { name: "cart_item_link", label: (0, i18n_1.__)('Cart Item Links', 'checkout-wc'), description: "", options: [
                    { value: 'disabled', label: (0, i18n_1.__)('Disabled', 'checkout-wc') },
                    { value: 'enabled', label: (0, i18n_1.__)('Enabled', 'checkout-wc') },
                ] }),
            react_1.default.createElement(SelectField_1.default, { name: "cart_item_data_display", label: (0, i18n_1.__)('Cart Item Data Display', 'checkout-wc'), description: "", options: [
                    { value: 'short', label: (0, i18n_1.__)('Short', 'checkout-wc') },
                    { value: 'woocommerce', label: (0, i18n_1.__)('WooCommerce Default', 'checkout-wc') },
                ] })),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.badges, title: (0, i18n_1.__)('Badges', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.badges, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.badges ? null : SECTION_IDS.badges)) },
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'trust-badges', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(EditorFieldGroup_1.default, { nestedFields: plan.plan_level >= 1 && values.enable_trust_badges ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(TextField_1.default, { name: "trust_badges_title", label: (0, i18n_1.__)('Heading', 'checkout-wc'), description: "", nested: false, placeholder: (0, i18n_1.__)('Example: Why choose us?', 'checkout-wc') }),
                        react_1.default.createElement(RadioGroupField_1.default, { name: "trust_badge_position", label: (0, i18n_1.__)('Location', 'checkout-wc'), description: "", nested: false, options: [
                                { value: 'below_cart_summary', label: (0, i18n_1.__)('Below the checkout cart summary', 'checkout-wc') },
                                { value: 'below_checkout_form', label: (0, i18n_1.__)('After the checkout form', 'checkout-wc') },
                                { value: 'in_footer', label: (0, i18n_1.__)('Top of the footer', 'checkout-wc') },
                            ] }),
                        react_1.default.createElement("p", { className: "mt-3 text-gray-500" },
                            (0, i18n_1.__)('To add trust badges, you can manage them in', 'checkout-wc'),
                            ' ',
                            react_1.default.createElement("a", { href: `${cfwAdminPagesData.admin_url}?page=cfw-settings-trust-badges`, className: "text-blue-600 hover:text-blue-800" }, (0, i18n_1.__)('trust badges settings', 'checkout-wc')),
                            "."))) : undefined },
                    react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_trust_badges", label: (0, i18n_1.__)('Trust Badges', 'checkout-wc'), description: "", disabled: plan.plan_level < 1, useEyeToggle: true })),
                react_1.default.createElement(EditorFieldGroup_1.default, { nestedFields: values.enable_wc_review_badges ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(SelectField_1.default, { name: "wc_review_source", label: (0, i18n_1.__)('Priority', 'checkout-wc'), description: "", nested: false, options: [
                                { value: 'cart_only', label: (0, i18n_1.__)('Cart products only', 'checkout-wc') },
                                { value: 'cart_first', label: (0, i18n_1.__)('Cart products first, then site-wide', 'checkout-wc') },
                                { value: 'sitewide', label: (0, i18n_1.__)('Any product reviews', 'checkout-wc') },
                            ] }),
                        react_1.default.createElement(SelectField_1.default, { name: "wc_review_min_rating", label: (0, i18n_1.__)('Minimum Star Rating', 'checkout-wc'), description: "", nested: false, options: [
                                { value: '3', label: (0, i18n_1.__)('3+ stars', 'checkout-wc') },
                                { value: '4', label: (0, i18n_1.__)('4+ stars', 'checkout-wc') },
                                { value: '5', label: (0, i18n_1.__)('5 stars only', 'checkout-wc') },
                            ] }),
                        react_1.default.createElement(NumberField_1.default, { name: "wc_review_limit", label: (0, i18n_1.__)('Maximum Reviews to Show', 'checkout-wc'), description: "", nested: false, min: 1, max: 5 }))) : undefined },
                    react_1.default.createElement(EditorCheckboxField_1.default, { name: "enable_wc_review_badges", label: (0, i18n_1.__)('Review Badges', 'checkout-wc'), description: "", useEyeToggle: true })))),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.footer, title: (0, i18n_1.__)('Footer', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.footer, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.footer ? null : SECTION_IDS.footer)) },
            react_1.default.createElement(WYSIWYGField_1.default, { name: `footer_text_${templatePath}`, label: (0, i18n_1.__)('Footer Text', 'checkout-wc'), description: "", initialMode: footerTextEditorMode, onModeChange: (mode) => {
                    setFooterTextEditorMode(mode);
                    setFieldValue('footer_text_editor_mode', mode);
                } })),
        react_1.default.createElement(EditorSection_1.default, { id: SECTION_IDS.advanced, title: (0, i18n_1.__)('Advanced', 'checkout-wc'), isOpen: openSectionId === SECTION_IDS.advanced, onToggle: () => setOpenSectionId((prev) => (prev === SECTION_IDS.advanced ? null : SECTION_IDS.advanced)) },
            react_1.default.createElement("p", { className: "text-gray-500" }, (0, i18n_1.__)('The settings in this editor cover the most commonly used options for most stores. However, many additional settings are available. Once you\'ve saved any changes, head over to the CheckoutWC menu in your WordPress dashboard to explore more options.', 'checkout-wc')))));
};
exports["default"] = EditorSettingsPanel;


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/CheckboxField.tsx":
/*!**************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/CheckboxField.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const pickValidCheckboxProps_1 = __webpack_require__(/*! ../../functions/pickValidCheckboxProps */ "./sources/ts/admin/functions/pickValidCheckboxProps.ts");
const CheckboxField = (_a) => {
    var { name, label, description, nested = false, enabled = true, disabled = false } = _a, props = __rest(_a, ["name", "label", "description", "nested", "enabled", "disabled"]);
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container relative flex items-start ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("div", { className: "flex items-center h-5" },
            react_1.default.createElement(formik_1.Field, Object.assign({ type: "checkbox", id: `cfw_checkbox_${name}`, name: name, className: "focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:border", disabled: disabled }, (0, pickValidCheckboxProps_1.pickValidCheckboxProps)(Object.assign({}, props))))),
        react_1.default.createElement("div", { className: "ms-3 text-sm" },
            react_1.default.createElement("label", { htmlFor: `cfw_checkbox_${name}`, className: "font-medium text-gray-700", style: { verticalAlign: 'unset' } }, label),
            description && (react_1.default.createElement("p", { className: "mt-1 text-sm text-gray-500", dangerouslySetInnerHTML: { __html: description } })))));
};
exports["default"] = (0, withVisibilityControl_1.default)(CheckboxField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/ColorPickerField.tsx":
/*!*****************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/ColorPickerField.tsx ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const components_1 = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const ColorPickerField = (_a) => {
    var { label, name, nested = false, additionalClasses = [], defaultValue = '#FFFFFF' } = _a, props = __rest(_a, ["label", "name", "nested", "additionalClasses", "defaultValue"]);
    const [field, , helpers] = (0, formik_1.useField)(name);
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const buttonRef = (0, react_1.useRef)(null);
    const markChanged = () => {
        var _a;
        // Non-editor admin pages use this event to enable "Save Changes" + show the unsaved notice.
        (_a = document.body) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new Event('cfw_admin_field_changed'));
    };
    const handleChangeComplete = (color) => {
        helpers.setValue(color.hex);
        markChanged();
    };
    const normalizedDefaultValue = (0, react_1.useMemo)(() => {
        if (typeof defaultValue !== 'string') {
            return '#FFFFFF';
        }
        return defaultValue.startsWith('#') ? defaultValue : `#${defaultValue}`;
    }, [defaultValue]);
    const normalizedValue = (0, react_1.useMemo)(() => {
        const v = typeof field.value === 'string' ? field.value : '';
        if (!v) {
            return normalizedDefaultValue;
        }
        return v.startsWith('#') ? v : `#${v}`;
    }, [field.value, normalizedDefaultValue]);
    const isValidHex = (value) => /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
    const handleHexInputChange = (value) => {
        const raw = (value || '').trim();
        if (raw === '') {
            return;
        }
        const maybe = raw.startsWith('#') ? raw : `#${raw}`;
        if (isValidHex(maybe)) {
            helpers.setValue(maybe.toUpperCase());
            markChanged();
        }
    };
    const resetColor = () => {
        helpers.setValue(normalizedDefaultValue);
        markChanged();
        return false;
    };
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container mb-4 w-min ${additionalClasses.join(' ')} ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("div", { className: "text-sm mb-2" },
            react_1.default.createElement("label", { className: "font-medium text-gray-700 flex justify-between", htmlFor: name }, label)),
        react_1.default.createElement("div", { className: "flex items-center gap-2" },
            react_1.default.createElement(components_1.Button, { ref: buttonRef, variant: "secondary", onClick: () => setIsOpen((prev) => !prev), "aria-expanded": isOpen, "aria-label": label, style: {
                    padding: 0,
                    width: 32,
                    minWidth: 32,
                    height: 32,
                    borderRadius: 6,
                } },
                react_1.default.createElement("span", { "aria-hidden": "true", style: {
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        borderRadius: 6,
                        background: normalizedValue,
                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)',
                    } })),
            react_1.default.createElement("div", { className: "min-w-[120px]" },
                react_1.default.createElement(components_1.TextControl, { id: name, value: normalizedValue, onChange: handleHexInputChange, onBlur: (e) => { var _a; return handleHexInputChange((_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value); }, placeholder: normalizedDefaultValue, help: undefined })),
            react_1.default.createElement("button", { type: "button", onClick: resetColor, className: "rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" }, "Reset")),
        isOpen && (react_1.default.createElement(components_1.Popover, { anchor: buttonRef.current, placement: "bottom-start", onClose: () => setIsOpen(false), focusOnMount: false },
            react_1.default.createElement("div", { style: { padding: 12 } },
                react_1.default.createElement(components_1.ColorPicker, { color: normalizedValue, onChangeComplete: handleChangeComplete, defaultValue: normalizedDefaultValue, enableAlpha: false }))))));
};
// Avoid leaking HOC private prop types into generated declarations.
const WrappedColorPickerField = (0, withVisibilityControl_1.default)(ColorPickerField);
exports["default"] = WrappedColorPickerField;


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/CountriesMultiselectField.tsx":
/*!**************************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/CountriesMultiselectField.tsx ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_select_1 = __importDefault(__webpack_require__(/*! react-select */ "./node_modules/.pnpm/react-select@5.10.2_@types+react@18.3.27_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-select/dist/react-select.esm.js"));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const CountriesMultiselectField = (_a) => {
    var { label, name, description, nested = false, countries, placeholder = null, ariaLabel = null } = _a, props = __rest(_a, ["label", "name", "description", "nested", "countries", "placeholder", "ariaLabel"]);
    const [field, , helpers] = (0, formik_1.useField)(name);
    const formattedCountries = Object.keys(countries).map((countryValue) => ({
        value: countryValue,
        label: countries[countryValue],
    }));
    // Function to handle changes in the select component
    const handleChange = (selectedOptions) => {
        // Extract values from selected options
        const values = selectedOptions.map((option) => option.value);
        // Update Formik's state
        helpers.setValue(values);
    };
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container cfw-admin-select-field ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700" }, label),
        react_1.default.createElement(formik_1.Field, { name: name, isMulti: true, component: react_select_1.default, "data-placeholder": placeholder, "aria-label": ariaLabel, options: formattedCountries, value: formattedCountries.filter((option) => field.value.includes(option.value)), onChange: handleChange }),
        description && (react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500" }, description))));
};
exports["default"] = (0, withVisibilityControl_1.default)(CountriesMultiselectField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/NumberField.tsx":
/*!************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/NumberField.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const NumberField = (_a) => {
    var { label, name, description, nested = false } = _a, props = __rest(_a, ["label", "name", "description", "nested"]);
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700" }, label),
        react_1.default.createElement(formik_1.Field, { type: "number", name: name, id: name, className: "w-64 shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border border-gray-300 rounded-md" }),
        react_1.default.createElement(formik_1.ErrorMessage, { name: name, component: "div", className: "error" }),
        description && (react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500" }, description))));
};
exports["default"] = (0, withVisibilityControl_1.default)(NumberField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/RadioGroupField.tsx":
/*!****************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/RadioGroupField.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const RadioGroupField = (_a) => {
    var { label, name, description, nested = false, options, enabled = true, hideLabel = false } = _a, props = __rest(_a, ["label", "name", "description", "nested", "options", "enabled", "hideLabel"]);
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container cfw-admin-field-radio-group ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        !hideLabel && react_1.default.createElement("legend", { className: "text-sm font-medium text-gray-700" }, label),
        description && react_1.default.createElement("p", { className: "mt-1 text-sm text-gray-500" }, description),
        react_1.default.createElement("div", { className: "space-y-5 mt-4" }, options.map(({ value, label: optionLabel, description: optionDescription }) => (react_1.default.createElement("div", { key: value, className: "relative flex items-start" },
            react_1.default.createElement("div", { className: "flex items-center h-5" },
                react_1.default.createElement(formik_1.Field, { type: "radio", name: name, value: value, id: `${name}_${value}`, className: "focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300", disabled: !enabled })),
            react_1.default.createElement("div", { className: "ms-3 text-sm" },
                react_1.default.createElement("label", { htmlFor: `${name}_${value}`, style: { verticalAlign: 'unset' }, className: "font-medium text-gray-700" }, optionLabel),
                optionDescription && (react_1.default.createElement("p", { id: "small-description", className: "text-gray-500", dangerouslySetInnerHTML: { __html: optionDescription } })))))))));
};
exports["default"] = (0, withVisibilityControl_1.default)(RadioGroupField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/SelectField.tsx":
/*!************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/SelectField.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_select_1 = __importDefault(__webpack_require__(/*! react-select */ "./node_modules/.pnpm/react-select@5.10.2_@types+react@18.3.27_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-select/dist/react-select.esm.js"));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const SelectField = (_a) => {
    var { label, name, description, nested = false, options, placeholder = null, ariaLabel = null } = _a, props = __rest(_a, ["label", "name", "description", "nested", "options", "placeholder", "ariaLabel"]);
    const [field, , helpers] = (0, formik_1.useField)(name);
    // Function to handle changes in the select component
    const handleChange = (selectedOption) => {
        // Update Formik's state with the value of the selected option
        helpers.setValue(selectedOption ? selectedOption.value : '');
    };
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container cfw-admin-select-field ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700" }, label),
        react_1.default.createElement(formik_1.Field, { name: name, isMulti: false, component: react_select_1.default, "data-placeholder": placeholder, "aria-label": ariaLabel, options: options, value: options.find((option) => option.value === field.value), onChange: handleChange }),
        description && (react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500" }, description))));
};
exports["default"] = (0, withVisibilityControl_1.default)(SelectField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/TextField.tsx":
/*!**********************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/TextField.tsx ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const TextField = (_a) => {
    var { label, name, description = null, placeholder = null, nested = false } = _a, props = __rest(_a, ["label", "name", "description", "placeholder", "nested"]);
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700" }, label),
        react_1.default.createElement(formik_1.Field, { name: name, type: "text", id: name, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md", placeholder: placeholder }),
        description && (react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500", dangerouslySetInnerHTML: { __html: description } }))));
};
exports["default"] = (0, withVisibilityControl_1.default)(TextField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/WPMediaUploadButton.tsx":
/*!********************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/WPMediaUploadButton.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const WPMediaUploadButton = (_a) => {
    var { name, label, description, defaultUrl = null, nested = false, hideLabel = false } = _a, props = __rest(_a, ["name", "label", "description", "defaultUrl", "nested", "hideLabel"]);
    const [frame, setFrame] = (0, react_1.useState)(null);
    const [currentAttachment, setAttachment] = (0, react_1.useState)(null);
    const [showPreview, setShowPreview] = (0, react_1.useState)(false);
    const [field, meta, helpers] = (0, formik_1.useField)(name);
    (0, react_1.useEffect)(() => {
        var _a;
        // If the value has been cleared, hide the preview.
        if (!field.value) {
            setAttachment(null);
            setShowPreview(false);
            return;
        }
        // If we're still on the initial value and have a default URL, show that.
        if (defaultUrl && field.value === meta.initialValue) {
            setAttachment(null);
            setShowPreview(true);
            return;
        }
        // Otherwise, attempt to hydrate the attachment from the stored ID so the preview
        // persists when switching sections in the editor.
        try {
            const attachment = ((_a = wp === null || wp === void 0 ? void 0 : wp.media) === null || _a === void 0 ? void 0 : _a.attachment) ? wp.media.attachment(field.value) : null;
            if (!attachment) {
                setAttachment(null);
                setShowPreview(false);
                return;
            }
            // attachment.fetch() returns a promise and populates the model.
            Promise.resolve(attachment.fetch ? attachment.fetch() : attachment)
                .then(() => {
                const data = attachment.toJSON ? attachment.toJSON() : attachment;
                if (data === null || data === void 0 ? void 0 : data.url) {
                    setAttachment(data);
                    setShowPreview(true);
                }
                else {
                    setAttachment(null);
                    setShowPreview(false);
                }
            })
                .catch(() => {
                setAttachment(null);
                setShowPreview(false);
            });
        }
        catch (e) {
            setAttachment(null);
            setShowPreview(false);
        }
    }, [field.value, meta.initialValue, defaultUrl]);
    const clearButtonClicked = () => {
        // eslint-disable-next-line no-param-reassign
        setShowPreview(false);
        setAttachment(null);
        helpers.setValue('');
    };
    const openMediaLibrary = () => {
        let currentFrame = frame;
        if (!currentFrame) {
            currentFrame = wp.media({
                title: (0, i18n_1.__)('Select or Upload a Logo', 'checkout-wc'),
                button: {
                    text: (0, i18n_1.__)('Use this image', 'checkout-wc'),
                },
                multiple: false,
            });
            currentFrame.on('select', () => {
                const attachment = currentFrame.state().get('selection').first().toJSON();
                setAttachment(attachment);
                setShowPreview(true);
                helpers.setValue(attachment.id);
            });
            setFrame(currentFrame);
        }
        currentFrame.open();
    };
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container cfw-admin-upload-control-parent ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        !hideLabel && (react_1.default.createElement("legend", { className: "text-sm font-medium text-gray-700" }, label)),
        description && (react_1.default.createElement("p", { className: "mt-1 text-sm text-gray-500", dangerouslySetInnerHTML: { __html: description } })),
        showPreview && ((currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.url) || (defaultUrl && field.value === meta.initialValue)) && (react_1.default.createElement("div", { className: "cfw-admin-image-preview-wrapper mb-4 mt-2" },
            react_1.default.createElement("img", { className: "cfw-admin-image-preview max-h-28 w-28", src: (currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.url) ? currentAttachment.url : defaultUrl, alt: `${label} preview` }))),
        react_1.default.createElement("div", { className: "mt-2 flex flex-wrap gap-2" },
            react_1.default.createElement("button", { type: "button", onClick: openMediaLibrary, className: "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }, (0, i18n_1.__)('Upload Image', 'checkout-wc')),
            showPreview && ((currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.url) || defaultUrl) && (react_1.default.createElement("button", { type: "button", onClick: clearButtonClicked, className: "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }, (0, i18n_1.__)('Clear', 'checkout-wc'))))));
};
exports["default"] = (0, withVisibilityControl_1.default)(WPMediaUploadButton);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/WYSIWYGField.tsx":
/*!*************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/WYSIWYGField.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "react"));
const react_quill_1 = __importDefault(__webpack_require__(/*! react-quill */ "./node_modules/.pnpm/react-quill@2.0.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-quill/lib/index.js"));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const WYSIWYGField = (_a) => {
    var { name, label, description, initialMode, onModeChange } = _a, props = __rest(_a, ["name", "label", "description", "initialMode", "onModeChange"]);
    const [field, , helpers] = (0, formik_1.useField)(name);
    const [mode, setMode] = (0, react_1.useState)(initialMode || 'WYSIWYG');
    const handleEditorChange = (updatedContent) => {
        helpers.setValue(updatedContent);
    };
    const handleModeChange = (updatedMode) => {
        setMode(updatedMode);
        onModeChange(updatedMode);
    };
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link'],
            ['clean', 'code'],
        ],
    };
    const editorModes = [
        { id: 'WYSIWYG', title: 'WYSIWYG' },
        { id: 'HTML', title: 'HTML' },
    ];
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("label", { htmlFor: name, className: "block text-sm font-medium text-gray-700" }, label),
        mode === 'WYSIWYG' ? (react_1.default.createElement(react_quill_1.default, { id: name, onChange: handleEditorChange, value: field.value, modules: modules, theme: "snow", className: 'cfw-wysiwyg-visual-mode-element' })) : (react_1.default.createElement("textarea", Object.assign({ id: name }, field, { onChange: (e) => handleEditorChange(e.target.value), className: 'cfw-wysiwyg-text-mode-element' }))),
        react_1.default.createElement("div", { className: "space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0 mt-2" }, editorModes.map((editorMode) => (react_1.default.createElement("div", { key: editorMode.id, className: "flex items-center" },
            react_1.default.createElement("input", { id: editorMode.id, name: `editor-mode-${name}`, type: "radio", defaultChecked: editorMode.id === mode, className: "h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600", onChange: () => handleModeChange(editorMode.id) }),
            react_1.default.createElement("label", { htmlFor: editorMode.id, className: "ms-3 block text-sm font-medium leading-6 text-gray-900" }, editorMode.title))))),
        description && (react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500", dangerouslySetInnerHTML: { __html: description } }))));
};
exports["default"] = (0, withVisibilityControl_1.default)(WYSIWYGField);


/***/ }),

/***/ "./sources/ts/admin/Components/LockedFieldWrapper.tsx":
/*!************************************************************!*\
  !*** ./sources/ts/admin/Components/LockedFieldWrapper.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const LockedFieldWrapper = ({ plan, slug, children, locked = false, requiredPlans = '' }) => {
    const upgradeUrl = plan.plan_level === 0 ? `https://www.checkoutwc.com/lite-upgrade/?utm_campaign=liteplugin&utm_medium=admin-page-${encodeURIComponent(slug)}&utm_source=WordPress&utm_content=Unlock+with+Premium` : 'https://www.checkoutwc.com/documentation/upgrading-your-license/';
    if (!locked) {
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "relative w-full inset-0 ring-1 ring-black ring-opacity-5 shadow-lg rounded-md p-6 space-y-6" },
            react_1.default.createElement("div", { className: "opacity-50 pointer-events-none space-y-6" }, children),
            react_1.default.createElement("div", { className: 'space-y-4' },
                react_1.default.createElement("p", { className: 'flex justify-center' },
                    react_1.default.createElement("a", { href: upgradeUrl, className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-lg hover:text-white" }, plan.plan_level > 0 ? (0, i18n_1.__)('Upgrade Your License', 'checkout-wc') : (0, i18n_1.__)('Unlock with Premium', 'checkout-wc'))),
                react_1.default.createElement("p", { className: 'text-center italic text-gray-500' },
                    react_1.default.createElement("span", { dangerouslySetInnerHTML: { __html: (0, i18n_1.__)('A %s plan is required to access these features.', 'checkout-wc').replace('%s', requiredPlans) } }))))));
};
exports["default"] = LockedFieldWrapper;


/***/ }),

/***/ "./sources/ts/admin/Components/MediumAlert.tsx":
/*!*****************************************************!*\
  !*** ./sources/ts/admin/Components/MediumAlert.tsx ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = MediumAlert;
const ExclamationTriangleIcon_1 = __importDefault(__webpack_require__(/*! @heroicons/react/20/solid/ExclamationTriangleIcon */ "./node_modules/.pnpm/@heroicons+react@2.2.0_react@18.3.1/node_modules/@heroicons/react/20/solid/ExclamationTriangleIcon.js"));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const interweave_1 = __webpack_require__(/*! interweave */ "./node_modules/.pnpm/interweave@13.1.1_react@18.3.1/node_modules/interweave/esm/index.js");
function MediumAlert({ description, variant = 'default' }) {
    return (react_1.default.createElement("div", { className: `border-l-4 border-yellow-400 bg-yellow-50 p-4 ${variant === 'setting' ? 'cfw-editor-setting-notice' : ''}` },
        react_1.default.createElement("div", { className: "flex" },
            react_1.default.createElement("div", { className: "flex-shrink-0" },
                react_1.default.createElement(ExclamationTriangleIcon_1.default, { className: "h-5 w-5 text-yellow-400", "aria-hidden": "true" })),
            react_1.default.createElement("div", { className: "ms-3" },
                react_1.default.createElement("div", { className: "text-sm text-yellow-700" }, typeof description === 'string' ? react_1.default.createElement(interweave_1.Markup, { content: description }) : description)))));
}


/***/ }),

/***/ "./sources/ts/admin/Components/withVisibilityControl.tsx":
/*!***************************************************************!*\
  !*** ./sources/ts/admin/Components/withVisibilityControl.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const withVisibilityControl = (WrappedComponent) => class extends react_1.default.Component {
    render() {
        const { searchTerm, label, description, name } = this.props;
        // If searchTerm is undefined or if label includes searchTerm, render the WrappedComponent
        if (!searchTerm
            || (label.toLowerCase().includes(searchTerm.toLowerCase())
                || (name
                    && name.toLowerCase().includes(searchTerm.toLowerCase()))
                || (description
                    && description.toLowerCase().includes(searchTerm.toLowerCase())))) {
            return (react_1.default.createElement(WrappedComponent, Object.assign({}, this.props)));
        }
        // If there's no match, return null
        return null;
    }
};
exports["default"] = withVisibilityControl;


/***/ }),

/***/ "./sources/ts/admin/checkout-editor.tsx":
/*!**********************************************!*\
  !*** ./sources/ts/admin/checkout-editor.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const cfwRenderComponentIfElementExists_1 = __importDefault(__webpack_require__(/*! ../functions/cfwRenderComponentIfElementExists */ "./sources/ts/functions/cfwRenderComponentIfElementExists.ts"));
const EditorApp_1 = __importDefault(__webpack_require__(/*! ./Components/CheckoutEditor/EditorApp */ "./sources/ts/admin/Components/CheckoutEditor/EditorApp.tsx"));
(0, cfwRenderComponentIfElementExists_1.default)('cfw-checkout-editor', react_1.default.createElement(EditorApp_1.default, null));


/***/ }),

/***/ "./sources/ts/admin/functions/pickValidCheckboxProps.ts":
/*!**************************************************************!*\
  !*** ./sources/ts/admin/functions/pickValidCheckboxProps.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pickValidCheckboxProps = pickValidCheckboxProps;
const validCheckboxProps = [
    'type', 'id', 'name', 'className', 'disabled', 'checked', 'onChange', 'onBlur', 'value',
];
function pickValidCheckboxProps(props) {
    return Object.keys(props)
        .filter((key) => validCheckboxProps.includes(key))
        .reduce((obj, key) => {
        obj[key] = props[key];
        return obj;
    }, {});
}


/***/ }),

/***/ "./sources/ts/frontend/Services/DataService.ts":
/*!*****************************************************!*\
  !*** ./sources/ts/frontend/Services/DataService.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class DataService {
    static initRunTimeParams() {
        cfw.runtime_params = {};
    }
    static getSettings() {
        return cfw.settings;
    }
    static getSetting(setting) {
        if (cfw.settings[setting]) {
            return cfw.settings[setting];
        }
        return false;
    }
    static getData(key) {
        var _a;
        return (_a = cfw.data[key]) !== null && _a !== void 0 ? _a : false;
    }
    static updateData(key, value) {
        cfw.data[key] = value;
    }
    static getMessage(messageKey) {
        if (cfw.messages[messageKey]) {
            return cfw.messages[messageKey];
        }
        return '';
    }
    static getCompatibilityClass(key) {
        return cfw.compatibility[key];
    }
    static getElement(element) {
        if (cfw.elements[element]) {
            return jQuery(cfw.elements[element]);
        }
        return jQuery();
    }
    static getCheckoutParams() {
        return cfw.checkout_params;
    }
    /**
   * @param param
   */
    static getCheckoutParam(param) {
        if (cfw.checkout_params[param]) {
            return cfw.checkout_params[param];
        }
        return null;
    }
    static getRuntimeParameters() {
        return cfw.runtime_params;
    }
    static getRuntimeParameter(param) {
        if (cfw.runtime_params[param]) {
            return cfw.runtime_params[param];
        }
        return null;
    }
    static setRuntimeParameter(param, value) {
        cfw.runtime_params[param] = value;
    }
    /**
     * @returns {JQuery}
     */
    static get checkoutForm() {
        return DataService._checkoutForm;
    }
    /**
     * @param {JQuery} value
     */
    static set checkoutForm(value) {
        this._checkoutForm = value;
    }
    static getPostPurchaseData() {
        return cfw.post_purchase_data;
    }
}
exports["default"] = DataService;


/***/ }),

/***/ "./sources/ts/frontend/Services/LoggingService.ts":
/*!********************************************************!*\
  !*** ./sources/ts/frontend/Services/LoggingService.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const DataService_1 = __importDefault(__webpack_require__(/*! ./DataService */ "./sources/ts/frontend/Services/DataService.ts"));
const cfwAjax_1 = __importDefault(__webpack_require__(/*! ../../functions/cfwAjax */ "./sources/ts/functions/cfwAjax.ts"));
class LoggingService {
    static logError(message, extraData = null) {
        LoggingService.log(`${message} ⚠️`, true, extraData);
        (0, cfwAjax_1.default)('cfw_log_error', {
            type: 'POST',
            data: {
                log_data: Object.assign({ message }, (typeof extraData === 'object' && extraData !== null ? extraData : {
                    extraData,
                })),
            },
            dataType: 'json',
            cache: false,
        });
    }
    static logNotice(message, object = null) {
        LoggingService.log(`${message} ℹ️`, false, object);
    }
    static logEvent(message, object = null) {
        LoggingService.log(`${message} 🔈`, false, object);
    }
    static log(message, force = false, object = null) {
        if (force || DataService_1.default.getCheckoutParam('cfw_debug_mode')) {
            // eslint-disable-next-line no-console
            console.log(`CheckoutWC: ${message}`);
            if (object) {
                // eslint-disable-next-line no-console
                console.log(object);
            }
        }
    }
}
exports["default"] = LoggingService;


/***/ }),

/***/ "./sources/ts/functions/cfwAjax.ts":
/*!*****************************************!*\
  !*** ./sources/ts/functions/cfwAjax.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = cfwAjax;
const DataService_1 = __importDefault(__webpack_require__(/*! ../frontend/Services/DataService */ "./sources/ts/frontend/Services/DataService.ts"));
const LoggingService_1 = __importDefault(__webpack_require__(/*! ../frontend/Services/LoggingService */ "./sources/ts/frontend/Services/LoggingService.ts"));
function cfwAjax(id, params) {
    LoggingService_1.default.logNotice(`AJAX request to endpoint: ${id}. ☄️`);
    const defaultErrorFunction = (xhr, textStatus, errorThrown) => {
        if (textStatus !== 'abort') {
            LoggingService_1.default.logError(`cfwAjax ${id} Error: ${errorThrown} (${textStatus})`);
        }
    };
    const args = Object.assign({}, params);
    const endpoint = DataService_1.default.getCheckoutParam('wc_ajax_url').toString().replace('%%endpoint%%', id);
    args.url = `${endpoint}&nocache=${new Date().getTime()}`;
    args.dataType = 'json';
    args.cache = false;
    args.error = [params.error, defaultErrorFunction].filter(Boolean).flat(); // ensures 1d array of callbacks
    return jQuery.ajax(args);
}


/***/ }),

/***/ "./sources/ts/functions/cfwConvertOptionsObjectToArray.ts":
/*!****************************************************************!*\
  !*** ./sources/ts/functions/cfwConvertOptionsObjectToArray.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = cfwConvertOptionsObjectToArray;
function cfwConvertOptionsObjectToArray(obj) {
    return Object.keys(obj).map((key) => ({ value: key, label: obj[key] }));
}


/***/ }),

/***/ "./sources/ts/functions/cfwFormatFormValuesForSave.ts":
/*!************************************************************!*\
  !*** ./sources/ts/functions/cfwFormatFormValuesForSave.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = cfwFormatFormValuesForSave;
function cfwFormatFormValuesForSave(rawValues) {
    return Object.keys(rawValues).map((key) => {
        var _a;
        let value;
        if (typeof rawValues[key] === 'boolean') {
            value = rawValues[key] ? 'yes' : 'no';
        }
        else {
            value = rawValues[key];
        }
        if (key === 'allow_tracking' && rawValues[key].length) {
            // Grab the LAST array value - checkbox values are arrays when a value is defined
            value = (_a = rawValues[key][rawValues[key].length - 1]) !== null && _a !== void 0 ? _a : 'no';
        }
        return {
            name: key,
            value,
        };
    });
}


/***/ }),

/***/ "./sources/ts/functions/cfwRenderComponentIfElementExists.ts":
/*!*******************************************************************!*\
  !*** ./sources/ts/functions/cfwRenderComponentIfElementExists.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = cfwRenderComponentIfElementExists;
const element_1 = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
const react_dom_1 = __importDefault(__webpack_require__(/*! react-dom */ "react-dom"));
const reactVersion = react_dom_1.default.version || '';
function cfwRenderComponentIfElementExists(elementId, component, condition = true) {
    const element = document.getElementById(elementId);
    if (!element || !condition) {
        return;
    }
    if (reactVersion.startsWith('18')) {
        const root = (0, element_1.createRoot)(element);
        root.render(component);
    }
    else {
        (0, element_1.render)(component, element);
    }
}


/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"admin-checkout-editor": 0,
/******/ 			"admin-checkout-editor-styles": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkcheckout_for_woocommerce"] = globalThis["webpackChunkcheckout_for_woocommerce"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_b","vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_react-select-f14d8ac4","vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_s","vendors-admin-settings-admin-checkout-editor-node_modules_pnpm_d","vendors-admin-settings-admin-checkout-editor-node_modules_pnpm_quill_1_3_7_node_modules_quill_dist_q-ca3e6a97","vendors-admin-checkout-editor","admin-checkout-editor-styles"], () => (__webpack_require__("./sources/ts/admin/checkout-editor.tsx")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_b","vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_react-select-f14d8ac4","vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_s","vendors-admin-settings-admin-checkout-editor-node_modules_pnpm_d","vendors-admin-settings-admin-checkout-editor-node_modules_pnpm_quill_1_3_7_node_modules_quill_dist_q-ca3e6a97","vendors-admin-checkout-editor","admin-checkout-editor-styles"], () => (__webpack_require__("./sources/scss/admin/checkout-editor.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=admin-checkout-editor.js.map