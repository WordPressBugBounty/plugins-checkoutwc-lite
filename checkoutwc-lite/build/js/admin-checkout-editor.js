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

/***/ "./node_modules/.pnpm/@monaco-editor+react@4.7.0_monaco-editor@0.50.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@monaco-editor/react/dist/index.mjs":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@monaco-editor+react@4.7.0_monaco-editor@0.50.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@monaco-editor/react/dist/index.mjs ***!
  \*************************************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DiffEditor: () => (/* binding */ we),
/* harmony export */   Editor: () => (/* binding */ de),
/* harmony export */   "default": () => (/* binding */ Ft),
/* harmony export */   loader: () => (/* reexport safe */ _monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   useMonaco: () => (/* binding */ Le)
/* harmony export */ });
/* harmony import */ var _monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @monaco-editor/loader */ "./node_modules/.pnpm/@monaco-editor+loader@1.7.0/node_modules/@monaco-editor/loader/lib/es/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
var le={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},v=le;var ae={container:{display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"}},Y=ae;function Me({children:e}){return react__WEBPACK_IMPORTED_MODULE_1__.createElement("div",{style:Y.container},e)}var Z=Me;var $=Z;function Ee({width:e,height:r,isEditorReady:n,loading:t,_ref:a,className:m,wrapperProps:E}){return react__WEBPACK_IMPORTED_MODULE_1__.createElement("section",{style:{...v.wrapper,width:e,height:r},...E},!n&&react__WEBPACK_IMPORTED_MODULE_1__.createElement($,null,t),react__WEBPACK_IMPORTED_MODULE_1__.createElement("div",{ref:a,style:{...v.fullWidth,...!n&&v.hide},className:m}))}var ee=Ee;var H=(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(ee);function Ce(e){(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(e,[])}var k=Ce;function he(e,r,n=!0){let t=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!0);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(t.current||!n?()=>{t.current=!1}:e,r)}var l=he;function D(){}function h(e,r,n,t){return De(e,t)||be(e,r,n,t)}function De(e,r){return e.editor.getModel(te(e,r))}function be(e,r,n,t){return e.editor.createModel(r,n,t?te(e,t):void 0)}function te(e,r){return e.Uri.parse(r)}function Oe({original:e,modified:r,language:n,originalLanguage:t,modifiedLanguage:a,originalModelPath:m,modifiedModelPath:E,keepCurrentOriginalModel:g=!1,keepCurrentModifiedModel:N=!1,theme:x="light",loading:P="Loading...",options:y={},height:V="100%",width:z="100%",className:F,wrapperProps:j={},beforeMount:A=D,onMount:q=D}){let[M,O]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),[T,s]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0),u=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),c=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),w=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),d=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(q),o=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(A),b=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!1);k(()=>{let i=_monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"].init();return i.then(f=>(c.current=f)&&s(!1)).catch(f=>f?.type!=="cancelation"&&console.error("Monaco initialization: error:",f)),()=>u.current?I():i.cancel()}),l(()=>{if(u.current&&c.current){let i=u.current.getOriginalEditor(),f=h(c.current,e||"",t||n||"text",m||"");f!==i.getModel()&&i.setModel(f)}},[m],M),l(()=>{if(u.current&&c.current){let i=u.current.getModifiedEditor(),f=h(c.current,r||"",a||n||"text",E||"");f!==i.getModel()&&i.setModel(f)}},[E],M),l(()=>{let i=u.current.getModifiedEditor();i.getOption(c.current.editor.EditorOption.readOnly)?i.setValue(r||""):r!==i.getValue()&&(i.executeEdits("",[{range:i.getModel().getFullModelRange(),text:r||"",forceMoveMarkers:!0}]),i.pushUndoStop())},[r],M),l(()=>{u.current?.getModel()?.original.setValue(e||"")},[e],M),l(()=>{let{original:i,modified:f}=u.current.getModel();c.current.editor.setModelLanguage(i,t||n||"text"),c.current.editor.setModelLanguage(f,a||n||"text")},[n,t,a],M),l(()=>{c.current?.editor.setTheme(x)},[x],M),l(()=>{u.current?.updateOptions(y)},[y],M);let L=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{if(!c.current)return;o.current(c.current);let i=h(c.current,e||"",t||n||"text",m||""),f=h(c.current,r||"",a||n||"text",E||"");u.current?.setModel({original:i,modified:f})},[n,r,a,e,t,m,E]),U=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{!b.current&&w.current&&(u.current=c.current.editor.createDiffEditor(w.current,{automaticLayout:!0,...y}),L(),c.current?.editor.setTheme(x),O(!0),b.current=!0)},[y,x,L]);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{M&&d.current(u.current,c.current)},[M]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{!T&&!M&&U()},[T,M,U]);function I(){let i=u.current?.getModel();g||i?.original?.dispose(),N||i?.modified?.dispose(),u.current?.dispose()}return react__WEBPACK_IMPORTED_MODULE_1__.createElement(H,{width:z,height:V,isEditorReady:M,loading:P,_ref:w,className:F,wrapperProps:j})}var ie=Oe;var we=(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(ie);function Pe(){let[e,r]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(_monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"].__getMonacoInstance());return k(()=>{let n;return e||(n=_monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"].init(),n.then(t=>{r(t)})),()=>n?.cancel()}),e}var Le=Pe;function He(e){let r=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();return (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{r.current=e},[e]),r.current}var se=He;var _=new Map;function Ve({defaultValue:e,defaultLanguage:r,defaultPath:n,value:t,language:a,path:m,theme:E="light",line:g,loading:N="Loading...",options:x={},overrideServices:P={},saveViewState:y=!0,keepCurrentModel:V=!1,width:z="100%",height:F="100%",className:j,wrapperProps:A={},beforeMount:q=D,onMount:M=D,onChange:O,onValidate:T=D}){let[s,u]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),[c,w]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0),d=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),o=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),b=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),L=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(M),U=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(q),I=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(),i=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(t),f=se(m),Q=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!1),B=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!1);k(()=>{let p=_monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"].init();return p.then(R=>(d.current=R)&&w(!1)).catch(R=>R?.type!=="cancelation"&&console.error("Monaco initialization: error:",R)),()=>o.current?pe():p.cancel()}),l(()=>{let p=h(d.current,e||t||"",r||a||"",m||n||"");p!==o.current?.getModel()&&(y&&_.set(f,o.current?.saveViewState()),o.current?.setModel(p),y&&o.current?.restoreViewState(_.get(m)))},[m],s),l(()=>{o.current?.updateOptions(x)},[x],s),l(()=>{!o.current||t===void 0||(o.current.getOption(d.current.editor.EditorOption.readOnly)?o.current.setValue(t):t!==o.current.getValue()&&(B.current=!0,o.current.executeEdits("",[{range:o.current.getModel().getFullModelRange(),text:t,forceMoveMarkers:!0}]),o.current.pushUndoStop(),B.current=!1))},[t],s),l(()=>{let p=o.current?.getModel();p&&a&&d.current?.editor.setModelLanguage(p,a)},[a],s),l(()=>{g!==void 0&&o.current?.revealLine(g)},[g],s),l(()=>{d.current?.editor.setTheme(E)},[E],s);let X=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{if(!(!b.current||!d.current)&&!Q.current){U.current(d.current);let p=m||n,R=h(d.current,t||e||"",r||a||"",p||"");o.current=d.current?.editor.create(b.current,{model:R,automaticLayout:!0,...x},P),y&&o.current.restoreViewState(_.get(p)),d.current.editor.setTheme(E),g!==void 0&&o.current.revealLine(g),u(!0),Q.current=!0}},[e,r,n,t,a,m,x,P,y,E,g]);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{s&&L.current(o.current,d.current)},[s]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{!c&&!s&&X()},[c,s,X]),i.current=t,(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{s&&O&&(I.current?.dispose(),I.current=o.current?.onDidChangeModelContent(p=>{B.current||O(o.current.getValue(),p)}))},[s,O]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{if(s){let p=d.current.editor.onDidChangeMarkers(R=>{let G=o.current.getModel()?.uri;if(G&&R.find(J=>J.path===G.path)){let J=d.current.editor.getModelMarkers({resource:G});T?.(J)}});return()=>{p?.dispose()}}return()=>{}},[s,T]);function pe(){I.current?.dispose(),V?y&&_.set(m,o.current.saveViewState()):o.current.getModel()?.dispose(),o.current.dispose()}return react__WEBPACK_IMPORTED_MODULE_1__.createElement(H,{width:z,height:F,isEditorReady:s,loading:N,_ref:b,className:j,wrapperProps:A})}var fe=Ve;var de=(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(fe);var Ft=de;
//# sourceMappingURL=index.mjs.map

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
    var _a, _b, _c, _d;
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [previewKey, setPreviewKey] = (0, react_1.useState)(Date.now());
    const [activeTab, setActiveTab] = (0, react_1.useState)('checkout');
    const [device, setDevice] = (0, react_1.useState)('desktop');
    const checkoutSettings = ((_a = cfwAdminPagesData.checkout_settings) === null || _a === void 0 ? void 0 : _a.settings) || {};
    const appearanceSettings = ((_b = cfwAdminPagesData.appearance_settings) === null || _b === void 0 ? void 0 : _b.settings) || {};
    const colorSettingsDefaults = ((_d = (_c = cfwAdminPagesData.appearance_settings) === null || _c === void 0 ? void 0 : _c.params) === null || _d === void 0 ? void 0 : _d.color_settings_defaults) || {};
    const initialValues = Object.assign(Object.assign(Object.assign({}, checkoutSettings), appearanceSettings), colorSettingsDefaults);
    const previewUrl = cfwAdminPagesData.preview_url || '';
    const hasProducts = cfwAdminPagesData.has_products || false;
    const closeUrl = cfwAdminPagesData.close_url || '';
    const handlePreviewUpdate = (0, react_1.useCallback)(() => {
        setPreviewKey(Date.now());
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
        setIsSaving(true);
        try {
            yield (0, api_fetch_1.default)({
                path: '/checkoutwc/v1/settings',
                method: 'POST',
                data: {
                    settings: (0, cfwFormatFormValuesForSave_1.default)(values),
                },
            });
            // Clear preview transient.
            yield (0, api_fetch_1.default)({
                path: '/checkoutwc/v1/preview-settings',
                method: 'DELETE',
            });
            // Reset dirty state.
            resetForm({ values });
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
    // beforeunload handler
    (0, react_1.useEffect)(() => {
        // We'll track dirty state via a ref that the Formik render prop updates.
        // This is handled inside the Formik render prop below.
    }, []);
    return (react_1.default.createElement(formik_1.Formik, { initialValues: initialValues, enableReinitialize: false, onSubmit: () => {
            // Submit handled by save button.
        } }, ({ values, dirty, resetForm }) => {
        // beforeunload handler for unsaved changes.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        (0, react_1.useEffect)(() => {
            const handler = (e) => {
                if (dirty) {
                    e.preventDefault();
                }
            };
            window.addEventListener('beforeunload', handler);
            return () => window.removeEventListener('beforeunload', handler);
        }, [dirty]);
        return (react_1.default.createElement("div", { className: "cfw-tw cfw-editor" },
            react_1.default.createElement(EditorHeader_1.default, { isDirty: dirty, isSaving: isSaving, device: device, onDeviceChange: setDevice, onSave: () => handleSave(values, resetForm), onClose: () => handleClose(dirty) }),
            react_1.default.createElement("div", { className: "cfw-editor__body" },
                react_1.default.createElement(EditorSidebar_1.default, { activeTab: activeTab, onTabChange: setActiveTab }),
                react_1.default.createElement(EditorPreview_1.default, { previewUrl: previewUrl, previewKey: previewKey, device: device, hasProducts: hasProducts })),
            react_1.default.createElement(FormObserver_1.default, { onPreviewUpdate: handlePreviewUpdate })));
    }));
};
exports["default"] = EditorApp;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/EditorHeader.tsx":
/*!*********************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/EditorHeader.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const EditorHeader = ({ isDirty, isSaving, device, onDeviceChange, onSave, onClose }) => (react_1.default.createElement("div", { className: "cfw-editor__header" },
    react_1.default.createElement("div", { className: "cfw-editor__header-left" },
        react_1.default.createElement("button", { type: "button", className: "cfw-editor__close-btn", onClick: onClose, title: (0, i18n_1.__)('Close', 'checkout-wc') },
            react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))),
        react_1.default.createElement("h1", { className: "cfw-editor__title" }, (0, i18n_1.__)('Checkout Editor', 'checkout-wc'))),
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
        react_1.default.createElement("button", { type: "button", className: "cfw-editor__save-btn", onClick: onSave, disabled: !isDirty || isSaving }, isSaving ? (0, i18n_1.__)('Saving...', 'checkout-wc') : (0, i18n_1.__)('Save', 'checkout-wc')))));
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
const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
};
const EditorPreview = ({ previewUrl, previewKey, device, hasProducts }) => {
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    if (!hasProducts) {
        return (react_1.default.createElement("div", { className: "cfw-editor__preview" },
            react_1.default.createElement("div", { className: "cfw-editor__preview-no-products" },
                react_1.default.createElement("svg", { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" })),
                react_1.default.createElement("p", null, (0, i18n_1.__)('Add a published product to your store to preview the checkout.', 'checkout-wc')))));
    }
    const iframeSrc = `${previewUrl}&t=${previewKey}`;
    return (react_1.default.createElement("div", { className: "cfw-editor__preview" },
        react_1.default.createElement("div", { className: "cfw-editor__preview-frame", style: { width: deviceWidths[device] } },
            isLoading && (react_1.default.createElement("div", { className: "cfw-editor__preview-loading" },
                react_1.default.createElement("div", { className: "cfw-editor-spinner" }))),
            react_1.default.createElement("iframe", { src: iframeSrc, onLoad: () => setIsLoading(false), key: previewKey, title: (0, i18n_1.__)('Checkout Preview', 'checkout-wc') }))));
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
const EditorSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(defaultOpen);
    return (react_1.default.createElement("div", { className: "cfw-editor-section" },
        react_1.default.createElement("div", { className: `cfw-editor-section__header ${isOpen ? 'open' : ''}`, onClick: () => setIsOpen(!isOpen) },
            react_1.default.createElement("h3", null, title),
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
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const CheckoutSettingsPanel_1 = __importDefault(__webpack_require__(/*! ./panels/CheckoutSettingsPanel */ "./sources/ts/admin/Components/CheckoutEditor/panels/CheckoutSettingsPanel.tsx"));
const DesignSettingsPanel_1 = __importDefault(__webpack_require__(/*! ./panels/DesignSettingsPanel */ "./sources/ts/admin/Components/CheckoutEditor/panels/DesignSettingsPanel.tsx"));
const EditorSidebar = ({ activeTab, onTabChange }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    return (react_1.default.createElement("div", { className: "cfw-editor__sidebar" },
        react_1.default.createElement("div", { className: "cfw-editor__sidebar-tabs" },
            react_1.default.createElement("button", { type: "button", className: activeTab === 'checkout' ? 'active' : '', onClick: () => onTabChange('checkout') }, (0, i18n_1.__)('Checkout', 'checkout-wc')),
            react_1.default.createElement("button", { type: "button", className: activeTab === 'design' ? 'active' : '', onClick: () => onTabChange('design') }, (0, i18n_1.__)('Design', 'checkout-wc'))),
        react_1.default.createElement("div", { className: "cfw-editor__sidebar-search", style: { position: 'relative' } },
            react_1.default.createElement("svg", { className: "search-icon", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" })),
            react_1.default.createElement("input", { type: "search", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: (0, i18n_1.__)('Search settings...', 'checkout-wc') })),
        react_1.default.createElement("div", { className: "cfw-editor__sidebar-content" },
            activeTab === 'checkout' && react_1.default.createElement(CheckoutSettingsPanel_1.default, { searchTerm: searchTerm }),
            activeTab === 'design' && react_1.default.createElement(DesignSettingsPanel_1.default, { searchTerm: searchTerm }))));
};
exports["default"] = EditorSidebar;


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
const FormObserver = ({ onPreviewUpdate }) => {
    const { values } = (0, formik_1.useFormikContext)();
    const timerRef = (0, react_1.useRef)(null);
    const isFirstRender = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
        // Skip the initial render.
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Convert boolean values to yes/no for preview settings.
                const previewValues = {};
                Object.keys(values).forEach((key) => {
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

/***/ "./sources/ts/admin/Components/CheckoutEditor/panels/CheckoutSettingsPanel.tsx":
/*!*************************************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/panels/CheckoutSettingsPanel.tsx ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const i18n_1 = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
const EditorSection_1 = __importDefault(__webpack_require__(/*! ../EditorSection */ "./sources/ts/admin/Components/CheckoutEditor/EditorSection.tsx"));
const CheckboxField_1 = __importDefault(__webpack_require__(/*! ../../Fields/CheckboxField */ "./sources/ts/admin/Components/Fields/CheckboxField.tsx"));
const CheckboxGroupField_1 = __importDefault(__webpack_require__(/*! ../../Fields/CheckboxGroupField */ "./sources/ts/admin/Components/Fields/CheckboxGroupField.tsx"));
const CountriesMultiselectField_1 = __importDefault(__webpack_require__(/*! ../../Fields/CountriesMultiselectField */ "./sources/ts/admin/Components/Fields/CountriesMultiselectField.tsx"));
const RadioGroupField_1 = __importDefault(__webpack_require__(/*! ../../Fields/RadioGroupField */ "./sources/ts/admin/Components/Fields/RadioGroupField.tsx"));
const TextField_1 = __importDefault(__webpack_require__(/*! ../../Fields/TextField */ "./sources/ts/admin/Components/Fields/TextField.tsx"));
const SelectField_1 = __importDefault(__webpack_require__(/*! ../../Fields/SelectField */ "./sources/ts/admin/Components/Fields/SelectField.tsx"));
const LockedFieldWrapper_1 = __importDefault(__webpack_require__(/*! ../../LockedFieldWrapper */ "./sources/ts/admin/Components/LockedFieldWrapper.tsx"));
const MediumAlert_1 = __importDefault(__webpack_require__(/*! ../../MediumAlert */ "./sources/ts/admin/Components/MediumAlert.tsx"));
const SevereAlert_1 = __importDefault(__webpack_require__(/*! ../../SevereAlert */ "./sources/ts/admin/Components/SevereAlert.tsx"));
const CheckoutSettingsPanel = ({ searchTerm }) => {
    var _a, _b;
    const { values } = (0, formik_1.useFormikContext)();
    const plan = cfwAdminPagesData.plan;
    const conditionalSettings = ((_a = cfwAdminPagesData.checkout_settings) === null || _a === void 0 ? void 0 : _a.conditional_settings) || {};
    const woocommerceSettings = ((_b = cfwAdminPagesData.checkout_settings) === null || _b === void 0 ? void 0 : _b.woocommerce_settings) || {};
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Steps', 'checkout-wc'), defaultOpen: true },
            react_1.default.createElement(CheckboxField_1.default, { name: "skip_cart_step", label: (0, i18n_1.__)('Disable Cart Step', 'checkout-wc'), description: (0, i18n_1.__)('Disable to skip the cart and redirect customers directly to checkout after adding a product to the cart. (Incompatible with Side Cart)', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(CheckboxField_1.default, { name: "skip_shipping_step", label: (0, i18n_1.__)('Disable Shipping Step', 'checkout-wc'), description: (0, i18n_1.__)('Disable to hide the shipping method step. Useful if you only have one shipping option for all orders.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'enable-order-review-step', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_order_review_step", label: (0, i18n_1.__)('Enable Order Review Step', 'checkout-wc'), description: (0, i18n_1.__)('Adds a review step after payment information before finalizing order.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_one_page_checkout", label: (0, i18n_1.__)('Enable One Page Checkout', 'checkout-wc'), description: (0, i18n_1.__)('Show all checkout steps on one page. Useful for digital stores.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }))),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Shipping Options', 'checkout-wc') },
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'auto-select-free-shipping', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(CheckboxField_1.default, { name: "auto_select_free_shipping_method", label: (0, i18n_1.__)('Auto Select Free Shipping Method (if available)', 'checkout-wc'), description: (0, i18n_1.__)('WooCommerce has a habit of not selecting the free shipping method if it is setup to be conditionally enabled.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }))),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Login and Registration', 'checkout-wc') },
            react_1.default.createElement(CheckboxField_1.default, { name: "disable_auto_open_login_modal", label: (0, i18n_1.__)('Disable Automatic Login Modal', 'checkout-wc'), description: (0, i18n_1.__)('Normally the login modal automatically opens if the entered email address matches an existing account.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(RadioGroupField_1.default, { name: "registration_style", label: (0, i18n_1.__)('Registration', 'checkout-wc'), description: (0, i18n_1.__)('Choose how customers obtain a password when registering an account.', 'checkout-wc'), options: [
                    { value: 'enhanced', label: (0, i18n_1.__)('Enhanced (Recommended)', 'checkout-wc'), description: (0, i18n_1.__)('Automatically generate a username and password.', 'checkout-wc') },
                    { value: 'woocommerce', label: (0, i18n_1.__)('WooCommerce Default', 'checkout-wc'), description: (0, i18n_1.__)('A password field is provided for the customer.', 'checkout-wc') },
                ], searchTerm: searchTerm }),
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'user-matching', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(RadioGroupField_1.default, { name: "user_matching", label: (0, i18n_1.__)('User Matching', 'checkout-wc'), description: (0, i18n_1.__)('Choose how to handle guest orders and accounts.', 'checkout-wc'), disabled: plan.plan_level < 1, options: [
                        { value: 'enabled', label: (0, i18n_1.__)('Enabled (Recommended)', 'checkout-wc'), description: (0, i18n_1.__)('Automatically matches guest orders to user accounts.', 'checkout-wc') },
                        { value: 'woocommerce', label: (0, i18n_1.__)('WooCommerce Default', 'checkout-wc'), description: (0, i18n_1.__)('Guest orders will not be linked to matching accounts.', 'checkout-wc') },
                    ], searchTerm: searchTerm }))),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Field Options', 'checkout-wc') },
            react_1.default.createElement(SelectField_1.default, { name: 'wp_option/woocommerce_checkout_phone_field', label: (0, i18n_1.__)('Phone Field', 'checkout-wc'), description: (0, i18n_1.__)('Determines whether the WooCommerce native phone field is enabled.', 'checkout-wc'), options: [
                    { value: 'hidden', label: (0, i18n_1.__)('Hidden', 'checkout-wc') },
                    { value: 'optional', label: (0, i18n_1.__)('Optional', 'checkout-wc') },
                    { value: 'required', label: (0, i18n_1.__)('Required', 'checkout-wc') },
                ], searchTerm: searchTerm }),
            react_1.default.createElement(CheckboxField_1.default, { name: "enable_order_notes", label: (0, i18n_1.__)('Enable Order Notes Field', 'checkout-wc'), description: (0, i18n_1.__)('Enable or disable WooCommerce Order Notes field.', 'checkout-wc'), enabled: conditionalSettings.order_notes_enable, searchTerm: searchTerm }),
            !conditionalSettings.order_notes_enable && (react_1.default.createElement(MediumAlert_1.default, { description: (0, i18n_1.__)('Order Notes field is being controlled by a filter or a plugin.', 'checkout-wc') })),
            react_1.default.createElement(CheckboxField_1.default, { name: "enable_coupon_code_link", label: (0, i18n_1.__)('Hide Coupon Code Field Behind Link', 'checkout-wc'), description: (0, i18n_1.__)('Initially hide coupon field until "Have a coupon code?" link is clicked.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(CheckboxField_1.default, { name: "hide_optional_address_fields_behind_link", label: (0, i18n_1.__)('Hide Optional Address Fields Behind Links', 'checkout-wc'), description: (0, i18n_1.__)('Recommended to increase conversions.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(CheckboxField_1.default, { name: "disable_domain_autocomplete", label: (0, i18n_1.__)('Disable Email Domain Autocomplete', 'checkout-wc'), description: (0, i18n_1.__)('Disable email domain autocomplete.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'field-options', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_discreet_address_1_fields", label: (0, i18n_1.__)('Enable Separate House Number and Street Name Address Fields', 'checkout-wc'), description: (0, i18n_1.__)('Values are combined into a single address_1 field based on country.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                plan.plan_level >= 1 && values.enable_discreet_address_1_fields && (react_1.default.createElement(RadioGroupField_1.default, { name: "discreet_address_1_fields_order", label: (0, i18n_1.__)('Separate Address Fields Display Order', 'checkout-wc'), description: (0, i18n_1.__)('Choose how to display separate address 1 fields.', 'checkout-wc'), nested: true, options: [
                        { value: 'default', label: (0, i18n_1.__)('[House Number] [Street Name]', 'checkout-wc') },
                        { value: 'alternate', label: (0, i18n_1.__)('[Street Name] [House Number]', 'checkout-wc') },
                    ], searchTerm: searchTerm })),
                values.enable_discreet_address_1_fields && values.enable_address_autocomplete && (react_1.default.createElement(SevereAlert_1.default, { description: (0, i18n_1.__)('Separate Address Fields is incompatible with Google Address Autocomplete.', 'checkout-wc') })),
                react_1.default.createElement(CheckboxField_1.default, { name: "use_fullname_field", label: (0, i18n_1.__)('Enable Full Name Field', 'checkout-wc'), description: (0, i18n_1.__)('Replace first and last name fields with a single full name field.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_highlighted_countries", label: (0, i18n_1.__)('Enable Highlighted Countries', 'checkout-wc'), description: (0, i18n_1.__)('Promote selected countries to the top of the countries list.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                plan.plan_level >= 1 && values.enable_highlighted_countries && (react_1.default.createElement(CountriesMultiselectField_1.default, { name: "highlighted_countries", label: (0, i18n_1.__)('Highlighted Countries', 'checkout-wc'), description: (0, i18n_1.__)('The countries to show first in country dropdowns.', 'checkout-wc'), nested: true, hide: !values.enable_highlighted_countries, countries: woocommerceSettings.countries, searchTerm: searchTerm })),
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_international_phone_field", label: (0, i18n_1.__)('Enable International Phone Field', 'checkout-wc'), description: (0, i18n_1.__)('Validate phone number entry based on selected country.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                plan.plan_level >= 1 && values.enable_international_phone_field && (react_1.default.createElement(RadioGroupField_1.default, { name: "international_phone_field_standard", label: (0, i18n_1.__)('International Phone Format', 'checkout-wc'), description: (0, i18n_1.__)('Choose how to store phone numbers.', 'checkout-wc'), nested: true, options: [
                        { value: 'raw', label: (0, i18n_1.__)('Raw Value (No Formatting)', 'checkout-wc') },
                        { value: 'E164', label: (0, i18n_1.__)('E164', 'checkout-wc') },
                        { value: 'INTERNATIONAL', label: (0, i18n_1.__)('International', 'checkout-wc') },
                        { value: 'NATIONAL', label: (0, i18n_1.__)('National', 'checkout-wc') },
                        { value: 'RFC3966', label: (0, i18n_1.__)('RFC3966', 'checkout-wc') },
                    ], searchTerm: searchTerm })))),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Address Options', 'checkout-wc') },
            react_1.default.createElement(CheckboxField_1.default, { name: "force_different_billing_address", label: (0, i18n_1.__)('Force Different Billing Address', 'checkout-wc'), description: (0, i18n_1.__)('Remove option to use shipping address as billing address.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(CheckboxField_1.default, { name: "hide_billing_address_for_free_orders", label: (0, i18n_1.__)('Hide Billing Address For Free Orders', 'checkout-wc'), description: (0, i18n_1.__)('Remove the billing address fields from checkout for free orders.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(CheckboxGroupField_1.default, { name: "enabled_billing_address_fields", label: (0, i18n_1.__)('Enabled Billing Address Fields', 'checkout-wc'), description: (0, i18n_1.__)('Choose which billing address fields are visible.', 'checkout-wc'), options: [
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
                ], searchTerm: searchTerm })),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Address Completion and Validation', 'checkout-wc') },
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'address-complete-and-validation', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_address_autocomplete", label: (0, i18n_1.__)('Enable Google Address Autocomplete', 'checkout-wc'), description: (0, i18n_1.__)('Enable or disable Google Address Autocomplete feature.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_fetchify_address_autocomplete", label: (0, i18n_1.__)('Enable Fetchify Address Autocomplete', 'checkout-wc'), description: (0, i18n_1.__)('Enable or disable Fetchify address autocomplete feature.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                plan.plan_level >= 1 && values.enable_fetchify_address_autocomplete && (react_1.default.createElement(TextField_1.default, { name: "fetchify_access_token", label: (0, i18n_1.__)('Fetchify Access Token', 'checkout-wc'), description: (0, i18n_1.__)('Your Fetchify access token.', 'checkout-wc'), nested: true, searchTerm: searchTerm })),
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_smartystreets_integration", label: (0, i18n_1.__)('Enable Smarty Address Validation', 'checkout-wc'), description: (0, i18n_1.__)('Validates shipping address with Smarty.com.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                plan.plan_level >= 1 && values.enable_smartystreets_integration && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(TextField_1.default, { name: "smartystreets_auth_id", label: (0, i18n_1.__)('Smarty Auth ID', 'checkout-wc'), description: (0, i18n_1.__)('Smarty Auth ID.', 'checkout-wc'), searchTerm: searchTerm, nested: true }),
                    react_1.default.createElement(TextField_1.default, { name: "smartystreets_auth_token", label: (0, i18n_1.__)('Smarty Auth Token', 'checkout-wc'), description: (0, i18n_1.__)('Smarty Auth Token.', 'checkout-wc'), searchTerm: searchTerm, nested: true }))))),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Cart Summary', 'checkout-wc') },
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'cart-editing-at-checkout', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_cart_editing", label: (0, i18n_1.__)('Enable Cart Editing At Checkout', 'checkout-wc'), description: (0, i18n_1.__)('Allows customer to remove or adjust quantity of cart items at checkout.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 }),
                plan.plan_level >= 1 && values.enable_cart_editing && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(CheckboxField_1.default, { name: "allow_checkout_cart_item_variation_changes", label: (0, i18n_1.__)('Allow Variation Changes', 'checkout-wc'), description: (0, i18n_1.__)('Displays an edit link under cart items.', 'checkout-wc'), nested: true, searchTerm: searchTerm }),
                    react_1.default.createElement(CheckboxField_1.default, { name: "show_item_remove_button", label: (0, i18n_1.__)('Show Item Remove Button', 'checkout-wc'), description: (0, i18n_1.__)('When hovering over an item, show a button (X) to remove it.', 'checkout-wc'), nested: true, searchTerm: searchTerm }),
                    react_1.default.createElement(TextField_1.default, { name: "cart_edit_empty_cart_redirect", label: (0, i18n_1.__)('Cart Editing Empty Cart Redirect', 'checkout-wc'), description: (0, i18n_1.__)('URL to redirect to when customer empties cart from checkout page.', 'checkout-wc'), nested: true, searchTerm: searchTerm })))),
            react_1.default.createElement(CheckboxField_1.default, { name: "enable_sticky_cart_summary", label: (0, i18n_1.__)('Enable Sticky Cart Summary', 'checkout-wc'), description: (0, i18n_1.__)('Cart summary sticks to the top when scrolling.', 'checkout-wc'), searchTerm: searchTerm })),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Mobile Options', 'checkout-wc') },
            react_1.default.createElement(CheckboxField_1.default, { name: "enable_mobile_cart_summary", label: (0, i18n_1.__)('Enable Mobile Cart Summary', 'checkout-wc'), description: (0, i18n_1.__)('Shows the cart, promo field, and totals at the bottom of the first checkout step.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(CheckboxField_1.default, { name: "enable_mobile_totals", label: (0, i18n_1.__)('Enable Mobile Totals', 'checkout-wc'), description: (0, i18n_1.__)('Shows cart totals right above the place order button on mobile.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(CheckboxField_1.default, { name: "show_mobile_coupon_field", label: (0, i18n_1.__)('Enable Mobile Coupon Field', 'checkout-wc'), description: (0, i18n_1.__)('Show coupon field above payment gateways on mobile devices.', 'checkout-wc'), searchTerm: searchTerm }),
            values.enable_mobile_cart_summary && values.show_mobile_coupon_field && (react_1.default.createElement(SevereAlert_1.default, { description: (0, i18n_1.__)('Enable Mobile Cart Summary is not compatible with Enable Mobile Coupon Field.', 'checkout-wc') })),
            react_1.default.createElement(CheckboxField_1.default, { name: "show_logos_mobile", label: (0, i18n_1.__)('Enable Mobile Credit Card Logos', 'checkout-wc'), description: (0, i18n_1.__)('Show the credit card logos on mobile.', 'checkout-wc'), searchTerm: searchTerm }),
            react_1.default.createElement(TextField_1.default, { name: "cart_summary_mobile_label", label: (0, i18n_1.__)('Cart Summary Mobile Label', 'checkout-wc'), description: (0, i18n_1.__)('Example: Show order summary and coupons.', 'checkout-wc'), searchTerm: searchTerm })),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Order Pay', 'checkout-wc') },
            react_1.default.createElement(LockedFieldWrapper_1.default, { plan: plan, slug: 'order-pay', locked: plan.plan_level < 1, requiredPlans: plan.labels.required_list[1] },
                react_1.default.createElement(CheckboxField_1.default, { name: "enable_order_pay", label: (0, i18n_1.__)('Enable Order Pay Page', 'checkout-wc'), description: (0, i18n_1.__)('Use CheckoutWC templates for Order Pay page.', 'checkout-wc'), searchTerm: searchTerm, disabled: plan.plan_level < 1 })))));
};
exports["default"] = CheckoutSettingsPanel;


/***/ }),

/***/ "./sources/ts/admin/Components/CheckoutEditor/panels/DesignSettingsPanel.tsx":
/*!***********************************************************************************!*\
  !*** ./sources/ts/admin/Components/CheckoutEditor/panels/DesignSettingsPanel.tsx ***!
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
const EditorSection_1 = __importDefault(__webpack_require__(/*! ../EditorSection */ "./sources/ts/admin/Components/CheckoutEditor/EditorSection.tsx"));
const WPMediaUploadButton_1 = __importDefault(__webpack_require__(/*! ../../Fields/WPMediaUploadButton */ "./sources/ts/admin/Components/Fields/WPMediaUploadButton.tsx"));
const RadioGroupField_1 = __importDefault(__webpack_require__(/*! ../../Fields/RadioGroupField */ "./sources/ts/admin/Components/Fields/RadioGroupField.tsx"));
const WYSIWYGField_1 = __importDefault(__webpack_require__(/*! ../../Fields/WYSIWYGField */ "./sources/ts/admin/Components/Fields/WYSIWYGField.tsx"));
const SelectField_1 = __importDefault(__webpack_require__(/*! ../../Fields/SelectField */ "./sources/ts/admin/Components/Fields/SelectField.tsx"));
const CodeEditorField_1 = __importDefault(__webpack_require__(/*! ../../Fields/CodeEditorField */ "./sources/ts/admin/Components/Fields/CodeEditorField.tsx"));
const ColorPickerField_1 = __importDefault(__webpack_require__(/*! ../../Fields/ColorPickerField */ "./sources/ts/admin/Components/Fields/ColorPickerField.tsx"));
const cfwConvertOptionsObjectToArray_1 = __importDefault(__webpack_require__(/*! ../../../../functions/cfwConvertOptionsObjectToArray */ "./sources/ts/functions/cfwConvertOptionsObjectToArray.ts"));
const DesignSettingsPanel = ({ searchTerm }) => {
    var _a, _b, _c;
    const { values, setFieldValue, initialValues } = (0, formik_1.useFormikContext)();
    const params = ((_a = cfwAdminPagesData.appearance_settings) === null || _a === void 0 ? void 0 : _a.params) || {};
    const templatePath = params.template_path || '';
    const colorSettings = params.color_settings || {};
    const fontOptions = params.font_options || {};
    const logoPreviewUrl = params.logo_preview_url || '';
    const [footerTextEditorMode, setFooterTextEditorMode] = (0, react_1.useState)(((_c = (_b = cfwAdminPagesData.appearance_settings) === null || _b === void 0 ? void 0 : _b.settings) === null || _c === void 0 ? void 0 : _c.footer_text_editor_mode) || 'WYSIWYG');
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('General Template Settings', 'checkout-wc'), defaultOpen: true },
            react_1.default.createElement(formik_1.Field, { type: "hidden", name: "footer_text_editor_mode", value: footerTextEditorMode }),
            react_1.default.createElement(WPMediaUploadButton_1.default, { name: `logo_attachment_id_${templatePath}`, label: (0, i18n_1.__)('Logo', 'checkout-wc'), description: (0, i18n_1.__)('Choose the logo you wish to display in the header.', 'checkout-wc'), defaultUrl: logoPreviewUrl, searchTerm: searchTerm }),
            react_1.default.createElement(RadioGroupField_1.default, { name: `label_style_${templatePath}`, label: (0, i18n_1.__)('Field Label Style', 'checkout-wc'), description: (0, i18n_1.__)('Choose how you want form labels styled.', 'checkout-wc'), options: [
                    { value: 'floating', label: (0, i18n_1.__)('Floating (Recommended)', 'checkout-wc'), description: (0, i18n_1.__)('Automatically show and hide labels.', 'checkout-wc') },
                    { value: 'normal', label: (0, i18n_1.__)('Normal', 'checkout-wc'), description: (0, i18n_1.__)('Labels appear above each field at all times.', 'checkout-wc') },
                ], searchTerm: searchTerm }),
            react_1.default.createElement(WYSIWYGField_1.default, { name: `footer_text_${templatePath}`, label: "Footer Text", description: "If left blank, a standard copyright notice will be displayed.", initialMode: footerTextEditorMode, onModeChange: (mode) => {
                    setFooterTextEditorMode(mode);
                    setFieldValue('footer_text_editor_mode', mode);
                }, searchTerm: searchTerm })),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Typography', 'checkout-wc') },
            react_1.default.createElement(SelectField_1.default, { name: `body_font_${templatePath}`, label: (0, i18n_1.__)('Body Font', 'checkout-wc'), description: (0, i18n_1.__)('Choose the font for the body text.', 'checkout-wc'), options: (0, cfwConvertOptionsObjectToArray_1.default)(fontOptions), searchTerm: searchTerm }),
            react_1.default.createElement(SelectField_1.default, { name: `heading_font_${templatePath}`, label: (0, i18n_1.__)('Heading Font', 'checkout-wc'), description: (0, i18n_1.__)('Choose the font for the headings.', 'checkout-wc'), options: (0, cfwConvertOptionsObjectToArray_1.default)(fontOptions), searchTerm: searchTerm })),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('Colors', 'checkout-wc') },
            react_1.default.createElement("div", { className: "flex flex-col space-y-4" }, Object.entries(colorSettings).map(([sectionName, sectionDetails]) => {
                if (Object.keys(sectionDetails.settings).length > 0) {
                    return (react_1.default.createElement("div", { key: sectionName },
                        react_1.default.createElement("h2", { className: "mb-2 text-sm font-semibold text-gray-700" }, sectionDetails.title),
                        react_1.default.createElement("div", { className: "flex flex-wrap flex-row gap-4" }, Object.entries(sectionDetails.settings).map(([settingName, settingLabel]) => (react_1.default.createElement(ColorPickerField_1.default, { key: settingName, name: `${settingName}_${templatePath}`, label: settingLabel, value: values[settingName], defaultValue: initialValues[settingName], searchTerm: searchTerm }))))));
                }
                return null;
            }))),
        react_1.default.createElement(EditorSection_1.default, { title: (0, i18n_1.__)('CSS', 'checkout-wc') },
            react_1.default.createElement(formik_1.Field, { name: `custom_css_${templatePath}`, label: (0, i18n_1.__)('Custom CSS', 'checkout-wc'), language: "css", component: CodeEditorField_1.default, description: (0, i18n_1.__)('Add Custom CSS rules to control the appearance of the checkout template.', 'checkout-wc'), searchTerm: searchTerm }))));
};
exports["default"] = DesignSettingsPanel;


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
            description && (react_1.default.createElement("p", { className: "text-gray-500", dangerouslySetInnerHTML: { __html: description } })))));
};
exports["default"] = (0, withVisibilityControl_1.default)(CheckboxField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/CheckboxGroupField.tsx":
/*!*******************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/CheckboxGroupField.tsx ***!
  \*******************************************************************/
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
const CheckboxGroupField = (_a) => {
    var { label, name, description, nested = false, notice = null, enabled = true, options } = _a, props = __rest(_a, ["label", "name", "description", "nested", "notice", "enabled", "options"]);
    const [field] = (0, formik_1.useField)({ name });
    const handleChange = (value, checked) => {
        const set = new Set(field.value);
        if (checked) {
            set.add(value);
        }
        else {
            set.delete(value);
        }
        field.onChange({ target: { name, value: Array.from(set) } });
    };
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("input", { type: "hidden", name: name }),
        react_1.default.createElement("div", { dangerouslySetInnerHTML: { __html: notice } }),
        react_1.default.createElement("legend", { className: "text-base font-medium text-gray-900" }, label),
        react_1.default.createElement("p", { className: "text-sm leading-5 text-gray-500" }, description),
        react_1.default.createElement("div", null, options.map(({ value, label }) => (react_1.default.createElement("div", { key: value, className: "flex items-start mt-3" },
            react_1.default.createElement("div", { className: "h-5 flex items-center" },
                react_1.default.createElement(formik_1.Field, { type: "checkbox", name: name, value: value, id: `${name}_${value}`, checked: field.value.includes(value), onChange: (e) => handleChange(value, e.target.checked), disabled: !enabled, className: "focus:ring-blue-800 h-4 w-4 text-blue-500 border-gray-300 rounded" })),
            react_1.default.createElement("div", { className: "ms-3 text-sm" },
                react_1.default.createElement("label", { htmlFor: `${name}_${value}`, style: { verticalAlign: 'unset' }, className: "font-medium text-gray-700" }, label))))))));
};
exports["default"] = (0, withVisibilityControl_1.default)(CheckboxGroupField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/CodeEditorField.tsx":
/*!****************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/CodeEditorField.tsx ***!
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
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const react_2 = __importDefault(__webpack_require__(/*! @monaco-editor/react */ "./node_modules/.pnpm/@monaco-editor+react@4.7.0_monaco-editor@0.50.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@monaco-editor/react/dist/index.mjs"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx")); // Adjusted import
const CodeEditorField = (_a) => {
    var { field, form, label, description, language } = _a, props = __rest(_a, ["field", "form", "label", "description", "language"]);
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container ${props.nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("label", { htmlFor: field.name, className: "block text-sm font-medium text-gray-700" }, label),
        react_1.default.createElement(react_2.default, { height: "400px", width: "100%", language: language, value: field.value, theme: "vs-dark", onChange: (newValue) => {
                form.setFieldValue(field.name, newValue);
            }, options: {
                selectOnLineNumbers: true,
                scrollbar: {
                    alwaysConsumeMouseWheel: false,
                },
            } }),
        react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500", dangerouslySetInnerHTML: { __html: description } })));
};
exports["default"] = (0, withVisibilityControl_1.default)(CodeEditorField);


/***/ }),

/***/ "./sources/ts/admin/Components/Fields/ColorPickerField.tsx":
/*!*****************************************************************!*\
  !*** ./sources/ts/admin/Components/Fields/ColorPickerField.tsx ***!
  \*****************************************************************/
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
const components_1 = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
const formik_1 = __webpack_require__(/*! formik */ "./node_modules/.pnpm/formik@2.4.9_@types+react@18.3.27_react@18.3.1/node_modules/formik/dist/formik.esm.js");
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const withVisibilityControl_1 = __importDefault(__webpack_require__(/*! ../withVisibilityControl */ "./sources/ts/admin/Components/withVisibilityControl.tsx"));
const ColorPickerField = (_a) => {
    var { label, name, nested = false, additionalClasses = [], defaultValue = '#FFFFFF' } = _a, props = __rest(_a, ["label", "name", "nested", "additionalClasses", "defaultValue"]);
    const [field, , helpers] = (0, formik_1.useField)(name);
    const handleChangeComplete = (color) => {
        helpers.setValue(color.hex);
    };
    const resetColor = () => {
        helpers.setValue(defaultValue);
        return false;
    };
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container mb-4 w-min ${additionalClasses.join(' ')} ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("div", { className: "text-sm mb-2" },
            react_1.default.createElement("label", { className: "font-medium text-gray-700 flex justify-between", htmlFor: name }, label)),
        react_1.default.createElement(components_1.ColorPicker, { color: field.value, onChangeComplete: handleChangeComplete, defaultValue: defaultValue }),
        react_1.default.createElement("a", { onClick: resetColor, className: 'rounded bg-white w-full block text-center px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer' }, "Reset to Default")));
};
exports["default"] = (0, withVisibilityControl_1.default)(ColorPickerField);


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
        react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500" }, description)));
};
exports["default"] = (0, withVisibilityControl_1.default)(CountriesMultiselectField);


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
    var { label, name, description, nested = false, options, enabled = true } = _a, props = __rest(_a, ["label", "name", "description", "nested", "options", "enabled"]);
    return (react_1.default.createElement("div", { className: `cfw-admin-field-container cfw-admin-field-radio-group ${nested ? 'ms-7 p-4 bg-gray-100' : ''}` },
        react_1.default.createElement("legend", { className: "text-base font-medium text-gray-900" }, label),
        react_1.default.createElement("p", { className: "text-sm leading-5 text-gray-500" }, description),
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
        react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500" }, description)));
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
    var { name, label, description, defaultUrl = null, nested = false } = _a, props = __rest(_a, ["name", "label", "description", "defaultUrl", "nested"]);
    const [frame, setFrame] = (0, react_1.useState)(null);
    const [currentAttachment, setAttachment] = (0, react_1.useState)(null);
    const [showPreview, setShowPreview] = (0, react_1.useState)(false);
    const [field, , helpers] = (0, formik_1.useField)(name);
    (0, react_1.useEffect)(() => {
        setAttachment(field.value);
        if (field.value || defaultUrl) {
            setShowPreview(true);
        }
    }, []);
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
        react_1.default.createElement("legend", { className: "text-base font-medium text-gray-900" }, label),
        react_1.default.createElement("p", { className: "text-sm leading-5 text-gray-500", dangerouslySetInnerHTML: { __html: description } }),
        react_1.default.createElement("div", { className: "cfw-admin-image-preview-wrapper mb-4 mt-4" }, showPreview
            && (react_1.default.createElement(react_1.default.Fragment, null, ((currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.url) || defaultUrl) && (react_1.default.createElement("img", { className: "cfw-admin-image-preview max-h-28 w-28", src: (currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.url) ? currentAttachment.url : defaultUrl, alt: `${label} preview` }))))),
        react_1.default.createElement("div", { className: "block" },
            react_1.default.createElement("button", { type: "button", onClick: openMediaLibrary, className: "mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }, (0, i18n_1.__)('Upload Image', 'checkout-wc')),
            react_1.default.createElement("button", { type: "button", onClick: clearButtonClicked, className: "mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" }, (0, i18n_1.__)('Clear', 'checkout-wc')))));
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
        react_1.default.createElement("p", { className: "mt-2 text-sm text-gray-500", dangerouslySetInnerHTML: { __html: description } })));
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
function MediumAlert({ description }) {
    return (react_1.default.createElement("div", { className: "border-l-4 border-yellow-400 bg-yellow-50 p-4" },
        react_1.default.createElement("div", { className: "flex" },
            react_1.default.createElement("div", { className: "flex-shrink-0" },
                react_1.default.createElement(ExclamationTriangleIcon_1.default, { className: "h-5 w-5 text-yellow-400", "aria-hidden": "true" })),
            react_1.default.createElement("div", { className: "ms-3" },
                react_1.default.createElement("div", { className: "text-sm text-yellow-700" }, typeof description === 'string' ? react_1.default.createElement(interweave_1.Markup, { content: description }) : description)))));
}


/***/ }),

/***/ "./sources/ts/admin/Components/SevereAlert.tsx":
/*!*****************************************************!*\
  !*** ./sources/ts/admin/Components/SevereAlert.tsx ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = SevereAlert;
const XCircleIcon_1 = __importDefault(__webpack_require__(/*! @heroicons/react/20/solid/XCircleIcon */ "./node_modules/.pnpm/@heroicons+react@2.2.0_react@18.3.1/node_modules/@heroicons/react/20/solid/XCircleIcon.js"));
const react_1 = __importDefault(__webpack_require__(/*! react */ "react"));
const interweave_1 = __webpack_require__(/*! interweave */ "./node_modules/.pnpm/interweave@13.1.1_react@18.3.1/node_modules/interweave/esm/index.js");
function SevereAlert({ description }) {
    return (react_1.default.createElement("div", { className: "border-l-4 border-red-600 bg-red-50 p-4" },
        react_1.default.createElement("div", { className: "flex" },
            react_1.default.createElement("div", { className: "flex-shrink-0" },
                react_1.default.createElement(XCircleIcon_1.default, { className: "h-5 w-5 text-red-400", "aria-hidden": "true" })),
            react_1.default.createElement("div", { className: "ms-3" },
                react_1.default.createElement("p", { className: "text-sm text-red-800" },
                    react_1.default.createElement(interweave_1.Markup, { content: description, noWrap: true }))))));
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
/******/ 	__webpack_require__.O(undefined, ["vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_b","vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_react-select-f14d8ac4","vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_s","vendors-admin-settings-admin-checkout-editor-node_modules_pnpm_d","vendors-admin-settings-admin-checkout-editor-node_modules_pnpm_quill_1_3_7_node_modules_quill_dist_q-ca3e6a97","admin-checkout-editor-styles"], () => (__webpack_require__("./sources/ts/admin/checkout-editor.tsx")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_b","vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_react-select-f14d8ac4","vendors-admin-settings-admin-order-bumps-editor-admin-checkout-editor-node_modules_pnpm_s","vendors-admin-settings-admin-checkout-editor-node_modules_pnpm_d","vendors-admin-settings-admin-checkout-editor-node_modules_pnpm_quill_1_3_7_node_modules_quill_dist_q-ca3e6a97","admin-checkout-editor-styles"], () => (__webpack_require__("./sources/scss/admin/checkout-editor.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=admin-checkout-editor.js.map