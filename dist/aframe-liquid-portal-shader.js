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
    decayTime: { type: "number", default: 0.5 },
  },

  init: function () {
    this.mouseCoords = { x: 0, y: 0 };
    this.mouseMoveHandler = (evt) => {
      this.mouseCoords.x = (evt.clientX / window.innerWidth) * 2 - 1;
      this.mouseCoords.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    };
    this.raycaster = new THREE.Raycaster();
    this.targetCenter = new THREE.Vector2(0.5, 0.5);
    this.currentCenter = new THREE.Vector2(0.5, 0.5);

    this.effectStrength = 0.0;
  },

  play: function () {
    window.addEventListener("mousemove", this.mouseMoveHandler, false);
  },

  pause: function () {
    window.removeEventListener("mousemove", this.mouseMoveHandler, false);
  },

  tick: function (time, timeDelta) {
    this.raycaster.setFromCamera(this.mouseCoords, this.el.sceneEl.camera);
    let intersections = this.raycaster.intersectObject(
      this.el.getObject3D("mesh")
    );
    if (intersections.length > 0) {
      let mouseUV = intersections[0].uv;
      this.targetCenter.set(mouseUV.x, mouseUV.y);
    }

    this.effectStrength += this.targetCenter.distanceTo(this.currentCenter);
    this.effectStrength -= timeDelta / 1000 / this.data.decayTime;
    this.effectStrength = Math.max(0.0, Math.min(this.effectStrength, 1.0));

    this.currentCenter.lerp(this.targetCenter, this.data.moveFrac);

    this.el.setAttribute("material", {
      rippleCenter: this.currentCenter,
      strength: this.effectStrength,
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

    twistRadius: { type: "float", is: "uniform", default: 0.25 },
    maxTwist: { type: "float", is: "uniform", default: 1.0 },

    strength: { type: "float", is: "uniform", default: 1.0 },
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

    uniform float twistRadius;
    uniform float maxTwist;
    
    uniform float strength;

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

      float r_offset = strength * maxRippleOffset * sin((pc[1] - timeMsec / 1000.0 * rippleSpeed) * 4.0 * PI * numRipples);

      float tr = strength * twistRadius;
      float mt = strength * maxTwist;
      float a_offset = pc[1] < tr ? mix(0.0, mt * 2.0 * PI, tr - pc[1]) : 0.0;

      pc[0] += a_offset;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hZnJhbWVMaXF1aWRQb3J0YWxTaGFkZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci8uL3NyYy9saXF1aWQtcG9ydGFsLW1vdXNlLmpzIiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci8uL3NyYy9saXF1aWQtcG9ydGFsLXNoYWRlci5qcyIsIndlYnBhY2s6Ly9hZnJhbWVMaXF1aWRQb3J0YWxTaGFkZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0EsZUFBZSwrQkFBK0I7QUFDOUMsZ0JBQWdCLCtCQUErQjtBQUMvQyxHQUFHOztBQUVIO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7OztBQ2pERDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLDhCQUE4QjtBQUM3QyxVQUFVLDZCQUE2Qjs7QUFFdkMsbUJBQW1CLHdDQUF3QyxpQkFBaUIsRUFBRTtBQUM5RSxpQkFBaUIsMkNBQTJDO0FBQzVELHNCQUFzQiw4Q0FBOEM7QUFDcEUsa0JBQWtCLDZDQUE2Qzs7QUFFL0Qsa0JBQWtCLDhDQUE4QztBQUNoRSxlQUFlLDZDQUE2Qzs7QUFFNUQsZUFBZSw2Q0FBNkM7QUFDNUQsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7O1VDcEZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7Ozs7O0FDTmdDO0FBQ0QiLCJmaWxlIjoiYWZyYW1lLWxpcXVpZC1wb3J0YWwtc2hhZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFmcmFtZUxpcXVpZFBvcnRhbFNoYWRlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImxpcXVpZC1wb3J0YWwtbW91c2VcIiwge1xuICBzY2hlbWE6IHtcbiAgICBtb3ZlRnJhYzogeyB0eXBlOiBcIm51bWJlclwiLCBkZWZhdWx0OiAwLjEgfSxcbiAgICBkZWNheVRpbWU6IHsgdHlwZTogXCJudW1iZXJcIiwgZGVmYXVsdDogMC41IH0sXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubW91c2VDb29yZHMgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICB0aGlzLm1vdXNlTW92ZUhhbmRsZXIgPSAoZXZ0KSA9PiB7XG4gICAgICB0aGlzLm1vdXNlQ29vcmRzLnggPSAoZXZ0LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMTtcbiAgICAgIHRoaXMubW91c2VDb29yZHMueSA9IC0oZXZ0LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogMiArIDE7XG4gICAgfTtcbiAgICB0aGlzLnJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoKTtcbiAgICB0aGlzLnRhcmdldENlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IyKDAuNSwgMC41KTtcbiAgICB0aGlzLmN1cnJlbnRDZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMigwLjUsIDAuNSk7XG5cbiAgICB0aGlzLmVmZmVjdFN0cmVuZ3RoID0gMC4wO1xuICB9LFxuXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm1vdXNlTW92ZUhhbmRsZXIsIGZhbHNlKTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2VNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICB9LFxuXG4gIHRpY2s6IGZ1bmN0aW9uICh0aW1lLCB0aW1lRGVsdGEpIHtcbiAgICB0aGlzLnJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKHRoaXMubW91c2VDb29yZHMsIHRoaXMuZWwuc2NlbmVFbC5jYW1lcmEpO1xuICAgIGxldCBpbnRlcnNlY3Rpb25zID0gdGhpcy5yYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0KFxuICAgICAgdGhpcy5lbC5nZXRPYmplY3QzRChcIm1lc2hcIilcbiAgICApO1xuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBtb3VzZVVWID0gaW50ZXJzZWN0aW9uc1swXS51djtcbiAgICAgIHRoaXMudGFyZ2V0Q2VudGVyLnNldChtb3VzZVVWLngsIG1vdXNlVVYueSk7XG4gICAgfVxuXG4gICAgdGhpcy5lZmZlY3RTdHJlbmd0aCArPSB0aGlzLnRhcmdldENlbnRlci5kaXN0YW5jZVRvKHRoaXMuY3VycmVudENlbnRlcik7XG4gICAgdGhpcy5lZmZlY3RTdHJlbmd0aCAtPSB0aW1lRGVsdGEgLyAxMDAwIC8gdGhpcy5kYXRhLmRlY2F5VGltZTtcbiAgICB0aGlzLmVmZmVjdFN0cmVuZ3RoID0gTWF0aC5tYXgoMC4wLCBNYXRoLm1pbih0aGlzLmVmZmVjdFN0cmVuZ3RoLCAxLjApKTtcblxuICAgIHRoaXMuY3VycmVudENlbnRlci5sZXJwKHRoaXMudGFyZ2V0Q2VudGVyLCB0aGlzLmRhdGEubW92ZUZyYWMpO1xuXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJtYXRlcmlhbFwiLCB7XG4gICAgICByaXBwbGVDZW50ZXI6IHRoaXMuY3VycmVudENlbnRlcixcbiAgICAgIHN0cmVuZ3RoOiB0aGlzLmVmZmVjdFN0cmVuZ3RoLFxuICAgICAgdGltZU1zZWM6IHRpbWUsXG4gICAgfSk7XG4gIH0sXG59KTtcbiIsIi8qKlxuICogVGhpcyBzdHJpbmcgdGVtcGxhdGUgbGl0ZXJhbCBkb2VzIG5vdCBtb2RpZnkgdGhlIGlucHV0IHN0cmluZywgYnV0IGFsbG93cyB1c1xuICogdG8gdGFnIHNvbWUgc3RyaW5ncyBhcyBnbHNsIHNuaXBwZXRzIHNvIHRoYXQgZWRpdG9ycyAoZS5nLiwgVlNDb2RlKSBjYW5cbiAqIHN5bnRheCBoaWdsaWdodCB0aGVtLlxuICovXG5mdW5jdGlvbiBnbHNsKHN0cnMpIHtcbiAgcmV0dXJuIHN0cnNbMF07XG59XG5cbkFGUkFNRS5yZWdpc3RlclNoYWRlcihcImxpcXVpZC1wb3J0YWxcIiwge1xuICBzY2hlbWE6IHtcbiAgICB0aW1lTXNlYzogeyB0eXBlOiBcInRpbWVcIiwgaXM6IFwidW5pZm9ybVwiIH0sXG4gICAgc3JjOiB7IHR5cGU6IFwibWFwXCIsIGlzOiBcInVuaWZvcm1cIiB9LFxuXG4gICAgcmlwcGxlQ2VudGVyOiB7IHR5cGU6IFwidmVjMlwiLCBpczogXCJ1bmlmb3JtXCIsIGRlZmF1bHQ6IHsgeDogMC41LCB5OiAwLjUgfSB9LFxuICAgIG51bVJpcHBsZXM6IHsgdHlwZTogXCJmbG9hdFwiLCBpczogXCJ1bmlmb3JtXCIsIGRlZmF1bHQ6IDUgfSxcbiAgICBtYXhSaXBwbGVPZmZzZXQ6IHsgdHlwZTogXCJmbG9hdFwiLCBpczogXCJ1bmlmb3JtXCIsIGRlZmF1bHQ6IDAuMDEgfSxcbiAgICByaXBwbGVTcGVlZDogeyB0eXBlOiBcImZsb2F0XCIsIGlzOiBcInVuaWZvcm1cIiwgZGVmYXVsdDogMC4xIH0sXG5cbiAgICB0d2lzdFJhZGl1czogeyB0eXBlOiBcImZsb2F0XCIsIGlzOiBcInVuaWZvcm1cIiwgZGVmYXVsdDogMC4yNSB9LFxuICAgIG1heFR3aXN0OiB7IHR5cGU6IFwiZmxvYXRcIiwgaXM6IFwidW5pZm9ybVwiLCBkZWZhdWx0OiAxLjAgfSxcblxuICAgIHN0cmVuZ3RoOiB7IHR5cGU6IFwiZmxvYXRcIiwgaXM6IFwidW5pZm9ybVwiLCBkZWZhdWx0OiAxLjAgfSxcbiAgfSxcblxuICB2ZXJ0ZXhTaGFkZXI6IGdsc2xgXG4gICAgb3V0IHZlYzIgdl91djtcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICB2X3V2ID0gdXY7XG4gICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KHBvc2l0aW9uLCAxLjApO1xuICAgIH1cbiAgYCxcblxuICBmcmFnbWVudFNoYWRlcjogZ2xzbGBcbiAgICBmbG9hdCBQSSA9IDMuMTQxNTk7XG5cbiAgICB1bmlmb3JtIHNhbXBsZXIyRCBzcmM7XG4gICAgdW5pZm9ybSBmbG9hdCB0aW1lTXNlYztcblxuICAgIHVuaWZvcm0gdmVjMiByaXBwbGVDZW50ZXI7XG4gICAgdW5pZm9ybSBmbG9hdCBudW1SaXBwbGVzO1xuICAgIHVuaWZvcm0gZmxvYXQgbWF4UmlwcGxlT2Zmc2V0O1xuICAgIHVuaWZvcm0gZmxvYXQgcmlwcGxlU3BlZWQ7XG5cbiAgICB1bmlmb3JtIGZsb2F0IHR3aXN0UmFkaXVzO1xuICAgIHVuaWZvcm0gZmxvYXQgbWF4VHdpc3Q7XG4gICAgXG4gICAgdW5pZm9ybSBmbG9hdCBzdHJlbmd0aDtcblxuICAgIGluIHZlYzIgdl91djtcblxuICAgIC8vIC0tLSBQb2xhciBDb29yZGluYXRlcyAtLS0gLy9cblxuICAgIHZlYzIgdG9Qb2xhcih2ZWMyIGNlbnRlciwgdmVjMiB1dikge1xuICAgICAgdmVjMiBvZmZzZXQgPSB1diAtIGNlbnRlcjtcbiAgICAgIHJldHVybiB2ZWMyKGF0YW4ob2Zmc2V0LngsIG9mZnNldC55KSwgbGVuZ3RoKG9mZnNldCkpO1xuICAgIH1cblxuICAgIHZlYzIgZnJvbVBvbGFyKHZlYzIgY2VudGVyLCB2ZWMyIHBjKSB7XG4gICAgICBmbG9hdCBhbmdsZSA9IHBjWzBdO1xuICAgICAgZmxvYXQgcmFkaXVzID0gcGNbMV07XG4gICAgICByZXR1cm4gdmVjMihjZW50ZXIueCArIHNpbihhbmdsZSkgKiByYWRpdXMsIGNlbnRlci55ICsgY29zKGFuZ2xlKSAqIHJhZGl1cyk7XG4gICAgfVxuXG4gICAgLy8gLS0tIE1haW4gLS0tIC8vXG5cbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICB2ZWMyIHBjID0gdG9Qb2xhcihyaXBwbGVDZW50ZXIsIHZfdXYpO1xuXG4gICAgICBmbG9hdCByX29mZnNldCA9IHN0cmVuZ3RoICogbWF4UmlwcGxlT2Zmc2V0ICogc2luKChwY1sxXSAtIHRpbWVNc2VjIC8gMTAwMC4wICogcmlwcGxlU3BlZWQpICogNC4wICogUEkgKiBudW1SaXBwbGVzKTtcblxuICAgICAgZmxvYXQgdHIgPSBzdHJlbmd0aCAqIHR3aXN0UmFkaXVzO1xuICAgICAgZmxvYXQgbXQgPSBzdHJlbmd0aCAqIG1heFR3aXN0O1xuICAgICAgZmxvYXQgYV9vZmZzZXQgPSBwY1sxXSA8IHRyID8gbWl4KDAuMCwgbXQgKiAyLjAgKiBQSSwgdHIgLSBwY1sxXSkgOiAwLjA7XG5cbiAgICAgIHBjWzBdICs9IGFfb2Zmc2V0O1xuICAgICAgcGNbMV0gKz0gcl9vZmZzZXQ7XG5cbiAgICAgIHZlYzIgdXYgPSBmcm9tUG9sYXIocmlwcGxlQ2VudGVyLCBwYyk7XG5cbiAgICAgIHZlYzQgY29sb3JfcmdiYSA9IHRleHR1cmUyRChzcmMsIHV2KTtcbiAgICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yX3JnYmE7XG4gICAgfVxuICBgLFxufSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9saXF1aWQtcG9ydGFsLXNoYWRlclwiO1xuaW1wb3J0IFwiLi9saXF1aWQtcG9ydGFsLW1vdXNlXCI7XG4iXSwic291cmNlUm9vdCI6IiJ9