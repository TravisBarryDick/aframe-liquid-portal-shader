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

    twistRadius: { type: "float", is: "uniform", default: 0.25 },
    maxTwist: { type: "float", is: "uniform", default: 1.0 },
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

      float a_offset = pc[1] < twistRadius ? mix(0.0, maxTwist * 2.0 * PI, twistRadius - pc[1]) : 0.0;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hZnJhbWVMaXF1aWRQb3J0YWxTaGFkZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci8uL3NyYy9saXF1aWQtcG9ydGFsLW1vdXNlLmpzIiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci8uL3NyYy9saXF1aWQtcG9ydGFsLXNoYWRlci5qcyIsIndlYnBhY2s6Ly9hZnJhbWVMaXF1aWRQb3J0YWxTaGFkZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2FmcmFtZUxpcXVpZFBvcnRhbFNoYWRlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0EsZUFBZSwrQkFBK0I7QUFDOUMsR0FBRzs7QUFFSDtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7QUN6Q0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSw4QkFBOEI7QUFDN0MsVUFBVSw2QkFBNkI7O0FBRXZDLG1CQUFtQix3Q0FBd0MsaUJBQWlCLEVBQUU7QUFDOUUsaUJBQWlCLDJDQUEyQztBQUM1RCxzQkFBc0IsOENBQThDO0FBQ3BFLGtCQUFrQiw2Q0FBNkM7O0FBRS9ELGtCQUFrQiw4Q0FBOEM7QUFDaEUsZUFBZSw2Q0FBNkM7QUFDNUQsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7VUM5RUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOZ0M7QUFDRCIsImZpbGUiOiJhZnJhbWUtbGlxdWlkLXBvcnRhbC1zaGFkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhZnJhbWVMaXF1aWRQb3J0YWxTaGFkZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiYWZyYW1lTGlxdWlkUG9ydGFsU2hhZGVyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwibGlxdWlkLXBvcnRhbC1tb3VzZVwiLCB7XG4gIHNjaGVtYToge1xuICAgIG1vdmVGcmFjOiB7IHR5cGU6IFwibnVtYmVyXCIsIGRlZmF1bHQ6IDAuMSB9LFxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1vdXNlQ29vcmRzID0geyB4OiAwLCB5OiAwIH07XG4gICAgdGhpcy5tb3VzZU1vdmVIYW5kbGVyID0gKGV2dCkgPT4ge1xuICAgICAgdGhpcy5tb3VzZUNvb3Jkcy54ID0gKGV2dC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogMiAtIDE7XG4gICAgICB0aGlzLm1vdXNlQ29vcmRzLnkgPSAoZXZ0LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogMiAtIDE7XG4gICAgfTtcbiAgICB0aGlzLnJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoKTtcbiAgICB0aGlzLnRhcmdldENlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IyKDAuNSwgMC41KTtcbiAgICB0aGlzLmN1cnJlbnRDZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMigwLjUsIDAuNSk7XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2VNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICB9LFxuXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5tb3VzZU1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gIH0sXG5cbiAgdGljazogZnVuY3Rpb24gKHRpbWUpIHtcbiAgICB0aGlzLnJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKHRoaXMubW91c2VDb29yZHMsIHRoaXMuZWwuc2NlbmVFbC5jYW1lcmEpO1xuICAgIGxldCBpbnRlcnNlY3Rpb25zID0gdGhpcy5yYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0KFxuICAgICAgdGhpcy5lbC5nZXRPYmplY3QzRChcIm1lc2hcIilcbiAgICApO1xuICAgIGlmIChpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBtb3VzZVVWID0gaW50ZXJzZWN0aW9uc1swXS51djtcbiAgICAgIHRoaXMudGFyZ2V0Q2VudGVyLnNldChtb3VzZVVWLngsIDEuMCAtIG1vdXNlVVYueSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Q2VudGVyLmxlcnAodGhpcy50YXJnZXRDZW50ZXIsIHRoaXMuZGF0YS5tb3ZlRnJhYyk7XG5cbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcIm1hdGVyaWFsXCIsIHtcbiAgICAgIHJpcHBsZUNlbnRlcjogdGhpcy5jdXJyZW50Q2VudGVyLFxuICAgICAgdGltZU1zZWM6IHRpbWUsXG4gICAgfSk7XG4gIH0sXG59KTtcbiIsIi8qKlxuICogVGhpcyBzdHJpbmcgdGVtcGxhdGUgbGl0ZXJhbCBkb2VzIG5vdCBtb2RpZnkgdGhlIGlucHV0IHN0cmluZywgYnV0IGFsbG93cyB1c1xuICogdG8gdGFnIHNvbWUgc3RyaW5ncyBhcyBnbHNsIHNuaXBwZXRzIHNvIHRoYXQgZWRpdG9ycyAoZS5nLiwgVlNDb2RlKSBjYW5cbiAqIHN5bnRheCBoaWdsaWdodCB0aGVtLlxuICovXG5mdW5jdGlvbiBnbHNsKHN0cnMpIHtcbiAgcmV0dXJuIHN0cnNbMF07XG59XG5cbkFGUkFNRS5yZWdpc3RlclNoYWRlcihcImxpcXVpZC1wb3J0YWxcIiwge1xuICBzY2hlbWE6IHtcbiAgICB0aW1lTXNlYzogeyB0eXBlOiBcInRpbWVcIiwgaXM6IFwidW5pZm9ybVwiIH0sXG4gICAgc3JjOiB7IHR5cGU6IFwibWFwXCIsIGlzOiBcInVuaWZvcm1cIiB9LFxuXG4gICAgcmlwcGxlQ2VudGVyOiB7IHR5cGU6IFwidmVjMlwiLCBpczogXCJ1bmlmb3JtXCIsIGRlZmF1bHQ6IHsgeDogMC41LCB5OiAwLjUgfSB9LFxuICAgIG51bVJpcHBsZXM6IHsgdHlwZTogXCJmbG9hdFwiLCBpczogXCJ1bmlmb3JtXCIsIGRlZmF1bHQ6IDUgfSxcbiAgICBtYXhSaXBwbGVPZmZzZXQ6IHsgdHlwZTogXCJmbG9hdFwiLCBpczogXCJ1bmlmb3JtXCIsIGRlZmF1bHQ6IDAuMDEgfSxcbiAgICByaXBwbGVTcGVlZDogeyB0eXBlOiBcImZsb2F0XCIsIGlzOiBcInVuaWZvcm1cIiwgZGVmYXVsdDogMC4xIH0sXG5cbiAgICB0d2lzdFJhZGl1czogeyB0eXBlOiBcImZsb2F0XCIsIGlzOiBcInVuaWZvcm1cIiwgZGVmYXVsdDogMC4yNSB9LFxuICAgIG1heFR3aXN0OiB7IHR5cGU6IFwiZmxvYXRcIiwgaXM6IFwidW5pZm9ybVwiLCBkZWZhdWx0OiAxLjAgfSxcbiAgfSxcblxuICB2ZXJ0ZXhTaGFkZXI6IGdsc2xgXG4gICAgb3V0IHZlYzIgdl91djtcbiAgICB2b2lkIG1haW4oKSB7XG4gICAgICB2X3V2ID0gdXY7XG4gICAgICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KHBvc2l0aW9uLCAxLjApO1xuICAgIH1cbiAgYCxcblxuICBmcmFnbWVudFNoYWRlcjogZ2xzbGBcbiAgICBmbG9hdCBQSSA9IDMuMTQxNTk7XG5cbiAgICB1bmlmb3JtIHNhbXBsZXIyRCBzcmM7XG4gICAgdW5pZm9ybSBmbG9hdCB0aW1lTXNlYztcblxuICAgIHVuaWZvcm0gdmVjMiByaXBwbGVDZW50ZXI7XG4gICAgdW5pZm9ybSBmbG9hdCBudW1SaXBwbGVzO1xuICAgIHVuaWZvcm0gZmxvYXQgbWF4UmlwcGxlT2Zmc2V0O1xuICAgIHVuaWZvcm0gZmxvYXQgcmlwcGxlU3BlZWQ7XG5cbiAgICB1bmlmb3JtIGZsb2F0IHR3aXN0UmFkaXVzO1xuICAgIHVuaWZvcm0gZmxvYXQgbWF4VHdpc3Q7XG5cbiAgICBpbiB2ZWMyIHZfdXY7XG5cbiAgICAvLyAtLS0gUG9sYXIgQ29vcmRpbmF0ZXMgLS0tIC8vXG5cbiAgICB2ZWMyIHRvUG9sYXIodmVjMiBjZW50ZXIsIHZlYzIgdXYpIHtcbiAgICAgIHZlYzIgb2Zmc2V0ID0gdXYgLSBjZW50ZXI7XG4gICAgICByZXR1cm4gdmVjMihhdGFuKG9mZnNldC54LCBvZmZzZXQueSksIGxlbmd0aChvZmZzZXQpKTtcbiAgICB9XG5cbiAgICB2ZWMyIGZyb21Qb2xhcih2ZWMyIGNlbnRlciwgdmVjMiBwYykge1xuICAgICAgZmxvYXQgYW5nbGUgPSBwY1swXTtcbiAgICAgIGZsb2F0IHJhZGl1cyA9IHBjWzFdO1xuICAgICAgcmV0dXJuIHZlYzIoY2VudGVyLnggKyBzaW4oYW5nbGUpICogcmFkaXVzLCBjZW50ZXIueSArIGNvcyhhbmdsZSkgKiByYWRpdXMpO1xuICAgIH1cblxuICAgIC8vIC0tLSBNYWluIC0tLSAvL1xuXG4gICAgdm9pZCBtYWluKCkge1xuICAgICAgdmVjMiBwYyA9IHRvUG9sYXIocmlwcGxlQ2VudGVyLCB2X3V2KTtcblxuICAgICAgZmxvYXQgcl9vZmZzZXQgPSBtYXhSaXBwbGVPZmZzZXQgKiBzaW4oKHBjWzFdIC0gdGltZU1zZWMgLyAxMDAwLjAgKiByaXBwbGVTcGVlZCkgKiA0LjAgKiBQSSAqIG51bVJpcHBsZXMpO1xuXG4gICAgICBmbG9hdCBhX29mZnNldCA9IHBjWzFdIDwgdHdpc3RSYWRpdXMgPyBtaXgoMC4wLCBtYXhUd2lzdCAqIDIuMCAqIFBJLCB0d2lzdFJhZGl1cyAtIHBjWzFdKSA6IDAuMDtcblxuICAgICAgcGNbMF0gKz0gYV9vZmZzZXQ7XG4gICAgICBwY1sxXSArPSByX29mZnNldDtcblxuICAgICAgdmVjMiB1diA9IGZyb21Qb2xhcihyaXBwbGVDZW50ZXIsIHBjKTtcblxuICAgICAgdmVjNCBjb2xvcl9yZ2JhID0gdGV4dHVyZTJEKHNyYywgdXYpO1xuICAgICAgZ2xfRnJhZ0NvbG9yID0gY29sb3JfcmdiYTtcbiAgICB9XG4gIGAsXG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2xpcXVpZC1wb3J0YWwtc2hhZGVyXCI7XG5pbXBvcnQgXCIuL2xpcXVpZC1wb3J0YWwtbW91c2VcIjtcbiJdLCJzb3VyY2VSb290IjoiIn0=