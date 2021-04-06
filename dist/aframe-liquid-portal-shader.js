(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["aframeLiquidPortalShader"] = factory();
	else
		root["aframeLiquidPortalShader"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/liquid-portal-mouse.js":
/*!************************************!*\
  !*** ./src/liquid-portal-mouse.js ***!
  \************************************/
/***/ (() => {

AFRAME.registerComponent("liquid-portal-mouse", {
  schema: {
    moveFrac: { type: "number", default: 0.1 },
  },

  init: function () {
    this.mouseCoords = { x: 0, y: 0 };
    this.mouseMoveHandler = (evt) => {
      this.mouseCoords.x = (evt.clientX / window.innerWidth) * 2 - 1;
      this.mouseCoords.y = (evt.clientY / window.innerHeight) * 2 - 1;
    };
    this.raycaster = new THREE.Raycaster();
    this.targetCenter = new THREE.Vector2(0.5, 0.5);
    this.currentCenter = new THREE.Vector2(0.5, 0.5);
  },

  play: function () {
    window.addEventListener("mousemove", this.mouseMoveHandler, false);
  },

  pause: function () {
    window.removeEventListener("mousemove", this.mouseMoveHandler, false);
  },

  tick: function (time) {
    this.raycaster.setFromCamera(this.mouseCoords, this.el.sceneEl.camera);
    let intersections = this.raycaster.intersectObject(
      this.el.getObject3D("mesh")
    );
    if (intersections.length > 0) {
      let mouseUV = intersections[0].uv;
      this.targetCenter.set(mouseUV.x, 1.0 - mouseUV.y);
    }

    this.currentCenter.lerp(this.targetCenter, this.data.moveFrac);

    this.el.setAttribute("material", {
      rippleCenter: this.currentCenter,
      timeMsec: time,
    });
  },
});


/***/ }),

/***/ "./src/liquid-portal-shader.js":
/*!*************************************!*\
  !*** ./src/liquid-portal-shader.js ***!
  \*************************************/
/***/ (() => {

/**
 * This string template literal does not modify the input string, but allows us
 * to tag some strings as glsl snippets so that editors (e.g., VSCode) can
 * syntax higlight them.
 */
function glsl(strs) {
  return strs[0];
}

AFRAME.registerShader("liquid-portal", {
  schema: {
    timeMsec: { type: "time", is: "uniform" },
    src: { type: "map", is: "uniform" },

    rippleCenter: { type: "vec2", is: "uniform", default: { x: 0.5, y: 0.5 } },
    numRipples: { type: "float", is: "uniform", default: 5 },
    maxRippleOffset: { type: "float", is: "uniform", default: 0.01 },
    rippleSpeed: { type: "float", is: "uniform", default: 0.1 },
  },

  vertexShader: glsl`
    out vec2 v_uv;
    void main() {
      v_uv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: glsl`
    float PI = 3.14159;

    uniform sampler2D src;
    uniform float timeMsec;

    uniform vec2 rippleCenter;
    uniform float numRipples;
    uniform float maxRippleOffset;
    uniform float rippleSpeed;

    in vec2 v_uv;

    // --- Polar Coordinates --- //

    vec2 toPolar(vec2 center, vec2 uv) {
      vec2 offset = uv - center;
      return vec2(atan(offset.x, offset.y), length(offset));
    }

    vec2 fromPolar(vec2 center, vec2 pc) {
      float angle = pc[0];
      float radius = pc[1];
      return vec2(center.x + sin(angle) * radius, center.y + cos(angle) * radius);
    }

    // --- Main --- //

    void main() {
      vec2 pc = toPolar(rippleCenter, v_uv);

      float r_offset = maxRippleOffset * sin((pc[1] - timeMsec / 1000.0 * rippleSpeed) * 4.0 * PI * numRipples);
      pc[1] += r_offset;

      vec2 uv = fromPolar(rippleCenter, pc);

      vec4 color_rgba = texture2D(src, uv);
      gl_FragColor = color_rgba;
    }
  `,
});


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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _liquid_portal_shader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./liquid-portal-shader */ "./src/liquid-portal-shader.js");
/* harmony import */ var _liquid_portal_shader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_liquid_portal_shader__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _liquid_portal_mouse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./liquid-portal-mouse */ "./src/liquid-portal-mouse.js");
/* harmony import */ var _liquid_portal_mouse__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_liquid_portal_mouse__WEBPACK_IMPORTED_MODULE_1__);



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hZnJhbWVMaXF1aWRQb3J0YWxTaGFkZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci8uL3NyYy9saXF1aWQtcG9ydGFsLW1vdXNlLmpzIiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci8uL3NyYy9saXF1aWQtcG9ydGFsLXNoYWRlci5qcyIsIndlYnBhY2s6Ly9hZnJhbWVMaXF1aWRQb3J0YWxTaGFkZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0EsZUFBZSwrQkFBK0I7QUFDOUMsR0FBRzs7QUFFSDtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUN6Q0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSw4QkFBOEI7QUFDN0MsVUFBVSw2QkFBNkI7O0FBRXZDLG1CQUFtQix3Q0FBd0MsaUJBQWlCLEVBQUU7QUFDOUUsaUJBQWlCLDJDQUEyQztBQUM1RCxzQkFBc0IsOENBQThDO0FBQ3BFLGtCQUFrQiw2Q0FBNkM7QUFDL0QsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7O1VDcEVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7Ozs7O0FDTmdDO0FBQ0QiLCJmaWxlIjoiYWZyYW1lLWxpcXVpZC1wb3J0YWwtc2hhZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFmcmFtZUxpcXVpZFBvcnRhbFNoYWRlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImxpcXVpZC1wb3J0YWwtbW91c2VcIiwge1xuICBzY2hlbWE6IHtcbiAgICBtb3ZlRnJhYzogeyB0eXBlOiBcIm51bWJlclwiLCBkZWZhdWx0OiAwLjEgfSxcbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tb3VzZUNvb3JkcyA9IHsgeDogMCwgeTogMCB9O1xuICAgIHRoaXMubW91c2VNb3ZlSGFuZGxlciA9IChldnQpID0+IHtcbiAgICAgIHRoaXMubW91c2VDb29yZHMueCA9IChldnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIDIgLSAxO1xuICAgICAgdGhpcy5tb3VzZUNvb3Jkcy55ID0gKGV2dC5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSAqIDIgLSAxO1xuICAgIH07XG4gICAgdGhpcy5yYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKCk7XG4gICAgdGhpcy50YXJnZXRDZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMigwLjUsIDAuNSk7XG4gICAgdGhpcy5jdXJyZW50Q2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjIoMC41LCAwLjUpO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm1vdXNlTW92ZUhhbmRsZXIsIGZhbHNlKTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2VNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgdGhpcy5yYXljYXN0ZXIuc2V0RnJvbUNhbWVyYSh0aGlzLm1vdXNlQ29vcmRzLCB0aGlzLmVsLnNjZW5lRWwuY2FtZXJhKTtcbiAgICBsZXQgaW50ZXJzZWN0aW9ucyA9IHRoaXMucmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdChcbiAgICAgIHRoaXMuZWwuZ2V0T2JqZWN0M0QoXCJtZXNoXCIpXG4gICAgKTtcbiAgICBpZiAoaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgbW91c2VVViA9IGludGVyc2VjdGlvbnNbMF0udXY7XG4gICAgICB0aGlzLnRhcmdldENlbnRlci5zZXQobW91c2VVVi54LCAxLjAgLSBtb3VzZVVWLnkpO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudENlbnRlci5sZXJwKHRoaXMudGFyZ2V0Q2VudGVyLCB0aGlzLmRhdGEubW92ZUZyYWMpO1xuXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJtYXRlcmlhbFwiLCB7XG4gICAgICByaXBwbGVDZW50ZXI6IHRoaXMuY3VycmVudENlbnRlcixcbiAgICAgIHRpbWVNc2VjOiB0aW1lLFxuICAgIH0pO1xuICB9LFxufSk7XG4iLCIvKipcbiAqIFRoaXMgc3RyaW5nIHRlbXBsYXRlIGxpdGVyYWwgZG9lcyBub3QgbW9kaWZ5IHRoZSBpbnB1dCBzdHJpbmcsIGJ1dCBhbGxvd3MgdXNcbiAqIHRvIHRhZyBzb21lIHN0cmluZ3MgYXMgZ2xzbCBzbmlwcGV0cyBzbyB0aGF0IGVkaXRvcnMgKGUuZy4sIFZTQ29kZSkgY2FuXG4gKiBzeW50YXggaGlnbGlnaHQgdGhlbS5cbiAqL1xuZnVuY3Rpb24gZ2xzbChzdHJzKSB7XG4gIHJldHVybiBzdHJzWzBdO1xufVxuXG5BRlJBTUUucmVnaXN0ZXJTaGFkZXIoXCJsaXF1aWQtcG9ydGFsXCIsIHtcbiAgc2NoZW1hOiB7XG4gICAgdGltZU1zZWM6IHsgdHlwZTogXCJ0aW1lXCIsIGlzOiBcInVuaWZvcm1cIiB9LFxuICAgIHNyYzogeyB0eXBlOiBcIm1hcFwiLCBpczogXCJ1bmlmb3JtXCIgfSxcblxuICAgIHJpcHBsZUNlbnRlcjogeyB0eXBlOiBcInZlYzJcIiwgaXM6IFwidW5pZm9ybVwiLCBkZWZhdWx0OiB7IHg6IDAuNSwgeTogMC41IH0gfSxcbiAgICBudW1SaXBwbGVzOiB7IHR5cGU6IFwiZmxvYXRcIiwgaXM6IFwidW5pZm9ybVwiLCBkZWZhdWx0OiA1IH0sXG4gICAgbWF4UmlwcGxlT2Zmc2V0OiB7IHR5cGU6IFwiZmxvYXRcIiwgaXM6IFwidW5pZm9ybVwiLCBkZWZhdWx0OiAwLjAxIH0sXG4gICAgcmlwcGxlU3BlZWQ6IHsgdHlwZTogXCJmbG9hdFwiLCBpczogXCJ1bmlmb3JtXCIsIGRlZmF1bHQ6IDAuMSB9LFxuICB9LFxuXG4gIHZlcnRleFNoYWRlcjogZ2xzbGBcbiAgICBvdXQgdmVjMiB2X3V2O1xuICAgIHZvaWQgbWFpbigpIHtcbiAgICAgIHZfdXYgPSB1djtcbiAgICAgIGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQocG9zaXRpb24sIDEuMCk7XG4gICAgfVxuICBgLFxuXG4gIGZyYWdtZW50U2hhZGVyOiBnbHNsYFxuICAgIGZsb2F0IFBJID0gMy4xNDE1OTtcblxuICAgIHVuaWZvcm0gc2FtcGxlcjJEIHNyYztcbiAgICB1bmlmb3JtIGZsb2F0IHRpbWVNc2VjO1xuXG4gICAgdW5pZm9ybSB2ZWMyIHJpcHBsZUNlbnRlcjtcbiAgICB1bmlmb3JtIGZsb2F0IG51bVJpcHBsZXM7XG4gICAgdW5pZm9ybSBmbG9hdCBtYXhSaXBwbGVPZmZzZXQ7XG4gICAgdW5pZm9ybSBmbG9hdCByaXBwbGVTcGVlZDtcblxuICAgIGluIHZlYzIgdl91djtcblxuICAgIC8vIC0tLSBQb2xhciBDb29yZGluYXRlcyAtLS0gLy9cblxuICAgIHZlYzIgdG9Qb2xhcih2ZWMyIGNlbnRlciwgdmVjMiB1dikge1xuICAgICAgdmVjMiBvZmZzZXQgPSB1diAtIGNlbnRlcjtcbiAgICAgIHJldHVybiB2ZWMyKGF0YW4ob2Zmc2V0LngsIG9mZnNldC55KSwgbGVuZ3RoKG9mZnNldCkpO1xuICAgIH1cblxuICAgIHZlYzIgZnJvbVBvbGFyKHZlYzIgY2VudGVyLCB2ZWMyIHBjKSB7XG4gICAgICBmbG9hdCBhbmdsZSA9IHBjWzBdO1xuICAgICAgZmxvYXQgcmFkaXVzID0gcGNbMV07XG4gICAgICByZXR1cm4gdmVjMihjZW50ZXIueCArIHNpbihhbmdsZSkgKiByYWRpdXMsIGNlbnRlci55ICsgY29zKGFuZ2xlKSAqIHJhZGl1cyk7XG4gICAgfVxuXG4gICAgLy8gLS0tIE1haW4gLS0tIC8vXG5cbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICB2ZWMyIHBjID0gdG9Qb2xhcihyaXBwbGVDZW50ZXIsIHZfdXYpO1xuXG4gICAgICBmbG9hdCByX29mZnNldCA9IG1heFJpcHBsZU9mZnNldCAqIHNpbigocGNbMV0gLSB0aW1lTXNlYyAvIDEwMDAuMCAqIHJpcHBsZVNwZWVkKSAqIDQuMCAqIFBJICogbnVtUmlwcGxlcyk7XG4gICAgICBwY1sxXSArPSByX29mZnNldDtcblxuICAgICAgdmVjMiB1diA9IGZyb21Qb2xhcihyaXBwbGVDZW50ZXIsIHBjKTtcblxuICAgICAgdmVjNCBjb2xvcl9yZ2JhID0gdGV4dHVyZTJEKHNyYywgdXYpO1xuICAgICAgZ2xfRnJhZ0NvbG9yID0gY29sb3JfcmdiYTtcbiAgICB9XG4gIGAsXG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2xpcXVpZC1wb3J0YWwtc2hhZGVyXCI7XG5pbXBvcnQgXCIuL2xpcXVpZC1wb3J0YWwtbW91c2VcIjtcbiJdLCJzb3VyY2VSb290IjoiIn0=