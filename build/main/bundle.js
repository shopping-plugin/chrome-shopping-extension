webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	__webpack_require__(137);
	__webpack_require__(141);
	__webpack_require__(142);
	__webpack_require__(143);
	__webpack_require__(144);
	__webpack_require__(145);
	__webpack_require__(146);
	__webpack_require__(147);
	module.exports = __webpack_require__(148);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	var _Recognize = __webpack_require__(4);

	var _Recognize2 = _interopRequireDefault(_Recognize);

	var _setting = __webpack_require__(136);

	var _setting2 = _interopRequireDefault(_setting);

	var _DomOperation = __webpack_require__(119);

	var _DomOperation2 = _interopRequireDefault(_DomOperation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var state = {
	    "webType": null
	};

	var recognizeInstance = null;

	$(document).keydown(function (event) {
	    console.log(event.keyCode);
	    if (recognizeInstance) {
	        if (event.shiftKey && event.ctrlKey && event.keyCode === 77) {
	            recognizeInstance.domDetach();
	        }

	        if (event.shiftKey && event.ctrlKey && event.keyCode === 78) {
	            recognizeInstance.domAttach();
	        }
	    }
	});

	$(document).ready(function () {
	    setTimeout(function () {
	        var webConfig = null;
	        for (var key in _setting2.default) {
	            var dom = $(_setting2.default[key].identification);
	            console.log("dom", dom);
	            if (dom && dom.length === 1) {
	                // dom 存在
	                state.webType = key;
	                webConfig = _setting2.default[key].webConfig;
	                break;
	            }
	        }

	        if (!state.webType) {
	            console.log("this webpage is not  a matched target webpage. ");
	        } else {
	            recognizeInstance = new _Recognize2.default({
	                webConfig: webConfig,
	                state: state
	            });
	        }
	    }, 300);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _regenerator = __webpack_require__(5);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _toConsumableArray2 = __webpack_require__(9);

	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

	var _asyncToGenerator2 = __webpack_require__(63);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Capture = __webpack_require__(85);

	var _Capture2 = _interopRequireDefault(_Capture);

	var _config = __webpack_require__(118);

	var _config2 = _interopRequireDefault(_config);

	var _DomOperation = __webpack_require__(119);

	var _DomOperation2 = _interopRequireDefault(_DomOperation);

	var _ImageRecognize = __webpack_require__(120);

	var _ImageRecognize2 = _interopRequireDefault(_ImageRecognize);

	var _InterceptionWeb = __webpack_require__(127);

	var _InterceptionWeb2 = _interopRequireDefault(_InterceptionWeb);

	var _PDollarRecognizer = __webpack_require__(132);

	var _PDollarRecognizer2 = _interopRequireDefault(_PDollarRecognizer);

	var _Point = __webpack_require__(133);

	var _Point2 = _interopRequireDefault(_Point);

	var _PointCloud = __webpack_require__(134);

	var _PointCloud2 = _interopRequireDefault(_PointCloud);

	var _Util = __webpack_require__(135);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Recognize = function () {
	    function Recognize(args) {
	        (0, _classCallCheck3.default)(this, Recognize);

	        this.NumPointClouds = 4;
	        this.NumPoints = 32;
	        this.Origin = new _Point2.default(0, 0, 0);
	        this.util = _Util2.default.getInstance();
	        this.capture = new _Capture2.default({
	            "webConfig": args.webConfig
	        });
	        this.domOperation = new _DomOperation2.default();
	        this._history = new Array();
	        this.webConfig = args.webConfig;
	        this.config = _config2.default.noteConfig;

	        this._init();
	    }

	    (0, _createClass3.default)(Recognize, [{
	        key: "_init",
	        value: function _init() {
	            var _this = this;

	            this._$recognize = $("<canvas id=\"myCanvas\" class=\"web-recognize-Content\">\n                <span style=\"background-color:#ffff88;\">The &lt;canvas&gt; element is not supported by this browser.</span>\n            </canvas>");
	            this._canvas = this._$recognize[0];
	            var canvasPath = this.webConfig.listDOMSelector;
	            $(canvasPath).append(this._$recognize[0]);
	            this.onLoadEvent();
	            $(window).resize(function () {
	                _this.canvasResize();
	            });
	            $(this._canvas).on("mouseup", function (event) {
	                _this.mouseUpEvent(event.offsetX, event.offsetY, event.button);
	            });
	            $(this._canvas).on("mousedown", function (event) {
	                _this.mouseDownEvent(event.offsetX, event.offsetY, event.button);
	            });
	            $(this._canvas).on("mousemove", function (event) {
	                _this.mouseMoveEvent(event.offsetX, event.offsetY, event.button);
	            });
	            $(this._canvas).on("contextmenu", function () {
	                return false;
	            });
	        }
	    }, {
	        key: "domDetach",
	        value: function domDetach() {
	            $(this._canvas).detach();
	        }
	    }, {
	        key: "domAttach",
	        value: function domAttach() {
	            $(this.webConfig.listDOMSelector).append(this._canvas);
	        }
	    }, {
	        key: "canvasResize",
	        value: function canvasResize() {
	            var _this2 = this;

	            var canvasPath = this.webConfig.listDOMSelector;
	            setTimeout(function () {
	                _this2._canvas.width = $(canvasPath).width();
	                _this2._canvas.height = $(canvasPath).height();
	                _this2._rc = _this2.getCanvasRect(_this2._canvas);
	                _this2._g = _this2._canvas.getContext('2d');
	                console.log("resize", $(canvasPath).width(), $(canvasPath).height());
	            }, 300);
	        }
	    }, {
	        key: "onLoadEvent",
	        value: function onLoadEvent() {
	            var canvasPath = this.webConfig.listDOMSelector;
	            this.capture.watchDOMBySelector("default");
	            this._points = new Array(); // point array for current stroke
	            this._strokeID = 0;
	            this._r = new _PDollarRecognizer2.default();
	            this._canvas.width = $(canvasPath).width();
	            this._canvas.height = $(canvasPath).height();
	            this._rc = this.getCanvasRect(this._canvas);

	            // this.canvasResize();
	            this._g = this._canvas.getContext('2d');
	            this._g.lineWidth = 3;
	            this._g.font = "16px Gentilis";
	            this.drawText("please input: ", this._g);
	            this._isDown = false;
	        }
	    }, {
	        key: "getCanvasRect",
	        value: function getCanvasRect(canvas) {
	            var w = canvas.width;
	            var h = canvas.height;
	            var cx = $(document).scrollLeft();
	            var cy = $(document).scrollTop();
	            return { x: cx, y: cy, width: w, height: h };
	        }
	    }, {
	        key: "getScrollY",
	        value: function getScrollY() {
	            var scrollY = 0;
	            if (typeof document.body.parentElement != 'undefined') {
	                scrollY = document.body.parentElement.scrollTop; // IE
	            } else if (typeof window.pageYOffset != 'undefined') {
	                scrollY = window.pageYOffset; // FF
	            }
	            return scrollY;
	        }
	    }, {
	        key: "mouseDownEvent",
	        value: function mouseDownEvent(x, y, button) {
	            document.onselectstart = function () {
	                return false;
	            }; // disable drag-select
	            document.onmousedown = function () {
	                return false;
	            }; // disable drag-select
	            if (button <= 1) {
	                this._isDown = true;
	                if (this._strokeID == 0) // starting a new gesture
	                    {
	                        this._points.length = 0;
	                        this._g.clearRect(0, 0, this._rc.width, this._rc.height);
	                    }
	                this._points[this._points.length] = new _Point2.default(x, y, ++this._strokeID);
	                this.drawText("Recording stroke #" + this._strokeID + "...");
	                var clr = "rgb(" + this.util.rand(0, 200) + "," + this.util.rand(0, 200) + "," + this.util.rand(0, 200) + ")";
	                this._g.strokeStyle = clr;
	                this._g.fillStyle = clr;
	                this._g.fillRect(x - 4, y - 3, 9, 9);
	            } else if (button == 2) {
	                this.drawText("Recognizing gesture...");
	            }
	        }
	    }, {
	        key: "mouseMoveEvent",
	        value: function mouseMoveEvent(x, y, button) {
	            if (this._isDown) {
	                this._points[this._points.length] = new _Point2.default(x, y, this._strokeID); // append
	                this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
	            }
	        }
	    }, {
	        key: "mouseUpEvent",
	        value: function mouseUpEvent(x, y, button) {
	            document.onselectstart = function () {
	                return true;
	            }; // enable drag-select
	            document.onmousedown = function () {
	                return true;
	            }; // enable drag-select
	            if (button <= 1) {
	                if (this._isDown) {
	                    this._isDown = false;
	                    this.drawText("Stroke #" + this._strokeID + " recorded.");
	                }
	            } else if (button == 2) // segmentation with right-click
	                {
	                    if (this._points.length >= 10) {
	                        this.analyzeAndCapture();
	                        var gesObj = new Object();
	                        gesObj.action = "gesture";
	                        gesObj.points = this._points;
	                    } else {
	                        this.drawText("Too little input made. Please try again.");
	                    }
	                    this._strokeID = 0;
	                    this._points = new Array();
	                    // signal to begin new gesture on next mouse-down
	                }
	        }
	    }, {
	        key: "analyzeAndCapture",
	        value: function () {
	            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
	                var _this3 = this;

	                var results, allSelectedDom, filterTitleDoms, filterImgDoms, titleDoms, imgDoms;
	                return _regenerator2.default.wrap(function _callee$(_context) {
	                    while (1) {
	                        switch (_context.prev = _context.next) {
	                            case 0:
	                                results = this._r.Recognize(this._points);
	                                allSelectedDom = new Array();

	                                results.map(function (result) {
	                                    _this3.drawText("Result: " + _this3.config.noteType[result.Name] + " (" + _this3.util.round(result.Score, 2) + ").");
	                                    console.log("Result: " + _this3.config.noteType[result.Name] + " (" + _this3.util.round(result.Score, 2) + ").", result);
	                                    if (result.type === "2" && result.Score > 0.01) {
	                                        (function () {
	                                            var range = _this3.util.getRange(result.path);
	                                            var selectedDom = null;
	                                            var radius = null;
	                                            // not confirmed cross
	                                            if (result.Name === "10" || result.Name === "20") {
	                                                var type = parseInt(result.Name);
	                                                if (range.outerRadius < _this3.config.diff.boundary) {
	                                                    result.Name = "" + (type + 1);
	                                                } else {
	                                                    result.Name = "" + (type + 2);
	                                                }
	                                            }

	                                            selectedDom = _this3.capture.getElementByCapture(range.outerCentroid, range.outerRadius).map(function (item) {
	                                                return {
	                                                    "selectedDom": item,
	                                                    "range": {
	                                                        "startX": range.startX,
	                                                        "startY": range.startY,
	                                                        "width": range.width,
	                                                        "height": range.height
	                                                    },
	                                                    "points": result.path,
	                                                    "shape": _this3.config.noteType[result.Name],
	                                                    "confidenceLevel": result.Score
	                                                };
	                                            });
	                                            console.log("selectedDom", selectedDom);
	                                            allSelectedDom.push.apply(allSelectedDom, (0, _toConsumableArray3.default)(selectedDom));
	                                            _this3._history.push({
	                                                "points": result.path,
	                                                "shape": result.Name,
	                                                "Dom": selectedDom, // 之后替换成project's or commodity's ID
	                                                "confidenceLevel": result.Score
	                                            });
	                                        })();
	                                    }
	                                });
	                                console.log("allSelectedDom", allSelectedDom);
	                                filterTitleDoms = allSelectedDom.filter(function (item) {
	                                    return item.selectedDom.label === "label";
	                                });
	                                filterImgDoms = allSelectedDom.filter(function (item) {
	                                    return item.selectedDom.label === "img";
	                                });
	                                _context.next = 8;
	                                return this.getTitleDoms(filterTitleDoms);

	                            case 8:
	                                titleDoms = _context.sent;
	                                _context.next = 11;
	                                return this.getImgDoms(filterImgDoms);

	                            case 11:
	                                imgDoms = _context.sent;

	                                console.log("titleDoms", titleDoms);
	                                console.log("imgDoms", imgDoms);
	                                this.operationDoms(imgDoms);

	                            case 15:
	                            case "end":
	                                return _context.stop();
	                        }
	                    }
	                }, _callee, this);
	            }));

	            function analyzeAndCapture() {
	                return _ref.apply(this, arguments);
	            }

	            return analyzeAndCapture;
	        }()
	    }, {
	        key: "getTitleDoms",
	        value: function () {
	            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(titleDoms) {
	                var _this4 = this;

	                var result;
	                return _regenerator2.default.wrap(function _callee3$(_context3) {
	                    while (1) {
	                        switch (_context3.prev = _context3.next) {
	                            case 0:
	                                _context3.next = 2;
	                                return Promise.all(titleDoms.map(function () {
	                                    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(domItem) {
	                                        var item, parentLocation, offsetLeftStr, offsetTopStr, range, title;
	                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
	                                            while (1) {
	                                                switch (_context2.prev = _context2.next) {
	                                                    case 0:
	                                                        item = domItem.selectedDom;
	                                                        parentLocation = _this4.capture.getPositionOfElement(item.rootElement);
	                                                        offsetLeftStr = window.getComputedStyle(item.rootElement, null).getPropertyValue('margin-left');
	                                                        offsetTopStr = window.getComputedStyle(item.rootElement, null).getPropertyValue('margin-top');
	                                                        range = domItem.range;


	                                                        range.startX -= parentLocation.left - parseInt(offsetLeftStr.substring(0, offsetLeftStr.length - 2));
	                                                        range.startY -= parentLocation.top - parseInt(offsetTopStr.substring(0, offsetTopStr.length - 2));
	                                                        _context2.next = 9;
	                                                        return _this4.labelExtract(item, range);

	                                                    case 9:
	                                                        title = _context2.sent;
	                                                        return _context2.abrupt("return", {
	                                                            "rootDom": item.rootElement,
	                                                            "titleDom": item.element,
	                                                            "type": domItem.shape,
	                                                            "title": title.text
	                                                        });

	                                                    case 11:
	                                                    case "end":
	                                                        return _context2.stop();
	                                                }
	                                            }
	                                        }, _callee2, _this4);
	                                    }));

	                                    return function (_x2) {
	                                        return _ref3.apply(this, arguments);
	                                    };
	                                }()));

	                            case 2:
	                                result = _context3.sent;
	                                return _context3.abrupt("return", result);

	                            case 4:
	                            case "end":
	                                return _context3.stop();
	                        }
	                    }
	                }, _callee3, this);
	            }));

	            function getTitleDoms(_x) {
	                return _ref2.apply(this, arguments);
	            }

	            return getTitleDoms;
	        }()
	    }, {
	        key: "getImgDoms",
	        value: function () {
	            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(imgDoms) {
	                var result;
	                return _regenerator2.default.wrap(function _callee4$(_context4) {
	                    while (1) {
	                        switch (_context4.prev = _context4.next) {
	                            case 0:
	                                result = imgDoms.map(function (domItem) {
	                                    return {
	                                        "rootDom": domItem.selectedDom.rootElement,
	                                        "imgDoms": $(domItem.selectedDom.element).children("img")[0],
	                                        "type": domItem.shape
	                                    };
	                                });
	                                return _context4.abrupt("return", result);

	                            case 2:
	                            case "end":
	                                return _context4.stop();
	                        }
	                    }
	                }, _callee4, this);
	            }));

	            function getImgDoms(_x3) {
	                return _ref4.apply(this, arguments);
	            }

	            return getImgDoms;
	        }()
	    }, {
	        key: "operationDoms",
	        value: function operationDoms(imgDoms) {
	            if (!imgDoms || imgDoms.length < 1) {
	                return false;
	            }
	            console.log("i have run at this state.");
	            var containerDivs = imgDoms.map(function (item) {
	                return item.rootDom;
	            });
	            var imgDivs = imgDoms.map(function (item) {
	                return item.imgDoms;
	            });
	            var typeList = imgDoms.map(function (item) {
	                return item.type.includes("circle") ? "SIGN_WHITE" : "SIGN_BLACK";
	            });
	            this.domOperation.filter(containerDivs, imgDivs, typeList);
	        }
	    }, {
	        key: "labelExtract",
	        value: function labelExtract(item, range) {
	            return new Promise(function (resolve, reject) {
	                var imageRecognize = new _ImageRecognize2.default();
	                var interceptionWeb = new _InterceptionWeb2.default();
	                interceptionWeb.domToImageLikePng(item.rootElement, range).then(function (img) {
	                    setTimeout(function () {
	                        img.width = 500;
	                        imageRecognize.imageToText(img).then(function (result) {
	                            resolve(result);
	                        });
	                    }, 500);
	                });
	            });
	        }
	    }, {
	        key: "drawConnectedPoint",
	        value: function drawConnectedPoint(from, to) {
	            this._g.beginPath();
	            this._g.moveTo(this._points[from].X, this._points[from].Y);
	            this._g.lineTo(this._points[to].X, this._points[to].Y);
	            this._g.closePath();
	            this._g.stroke();
	        }
	    }, {
	        key: "drawText",
	        value: function drawText(str) {
	            var $_g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._g;

	            $_g.clearRect(0, 0, this._rc.width, 40);
	            $_g.fillStyle = "rgb(255,255,136)";
	            $_g.fillRect(0, 0, this._rc.width, 40);
	            $_g.font = "40px Arial";
	            $_g.fillStyle = "rgb(0,0,255)";
	            $_g.fillText(str, 1, 35);
	        }
	    }]);
	    return Recognize;
	}();

	exports.default = Recognize;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// This method of obtaining a reference to the global object needs to be
	// kept identical to the way it is obtained in runtime.js
	var g =
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this;

	// Use `getOwnPropertyNames` because not all browsers support calling
	// `hasOwnProperty` on the global `self` object in a worker. See #183.
	var hadRuntime = g.regeneratorRuntime &&
	  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

	// Save the old regeneratorRuntime in case it needs to be restored later.
	var oldRuntime = hadRuntime && g.regeneratorRuntime;

	// Force reevalutation of runtime.js.
	g.regeneratorRuntime = undefined;

	module.exports = __webpack_require__(7);

	if (hadRuntime) {
	  // Restore the original runtime.
	  g.regeneratorRuntime = oldRuntime;
	} else {
	  // Remove the global property added by runtime.js.
	  try {
	    delete g.regeneratorRuntime;
	  } catch(e) {
	    g.regeneratorRuntime = undefined;
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	!(function(global) {
	  "use strict";

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }

	    if (typeof process === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  runtime.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" ||
	              (method === "throw" && delegate.iterator[method] === undefined)) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;

	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }

	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }

	          var record = tryCatch(
	            delegate.iterator[method],
	            delegate.iterator,
	            arg
	          );

	          if (record.type === "throw") {
	            context.delegate = null;

	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }

	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;

	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }

	          context.delegate = null;
	        }

	        if (method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = arg;

	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }

	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }

	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          var info = {
	            value: record.arg,
	            done: context.done
	          };

	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[toStringTagSymbol] = "Generator";

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }

	      return ContinueSentinel;
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this
	);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _from = __webpack_require__(10);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(11), __esModule: true };

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(12);
	__webpack_require__(56);
	module.exports = __webpack_require__(20).Array.from;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(13)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(16)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(14)
	  , defined   = __webpack_require__(15);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(17)
	  , $export        = __webpack_require__(18)
	  , redefine       = __webpack_require__(33)
	  , hide           = __webpack_require__(23)
	  , has            = __webpack_require__(34)
	  , Iterators      = __webpack_require__(35)
	  , $iterCreate    = __webpack_require__(36)
	  , setToStringTag = __webpack_require__(52)
	  , getPrototypeOf = __webpack_require__(54)
	  , ITERATOR       = __webpack_require__(53)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(19)
	  , core      = __webpack_require__(20)
	  , ctx       = __webpack_require__(21)
	  , hide      = __webpack_require__(23)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 19 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 20 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(22);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(24)
	  , createDesc = __webpack_require__(32);
	module.exports = __webpack_require__(28) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(25)
	  , IE8_DOM_DEFINE = __webpack_require__(27)
	  , toPrimitive    = __webpack_require__(31)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(28) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(28) && !__webpack_require__(29)(function(){
	  return Object.defineProperty(__webpack_require__(30)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(29)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26)
	  , document = __webpack_require__(19).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(26);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(23);

/***/ },
/* 34 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(37)
	  , descriptor     = __webpack_require__(32)
	  , setToStringTag = __webpack_require__(52)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(23)(IteratorPrototype, __webpack_require__(53)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(25)
	  , dPs         = __webpack_require__(38)
	  , enumBugKeys = __webpack_require__(50)
	  , IE_PROTO    = __webpack_require__(47)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(30)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(51).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(24)
	  , anObject = __webpack_require__(25)
	  , getKeys  = __webpack_require__(39);

	module.exports = __webpack_require__(28) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(40)
	  , enumBugKeys = __webpack_require__(50);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(34)
	  , toIObject    = __webpack_require__(41)
	  , arrayIndexOf = __webpack_require__(44)(false)
	  , IE_PROTO     = __webpack_require__(47)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(42)
	  , defined = __webpack_require__(15);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(43);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(41)
	  , toLength  = __webpack_require__(45)
	  , toIndex   = __webpack_require__(46);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(14)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(14)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(48)('keys')
	  , uid    = __webpack_require__(49);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(19)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(19).document && document.documentElement;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(24).f
	  , has = __webpack_require__(34)
	  , TAG = __webpack_require__(53)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(48)('wks')
	  , uid        = __webpack_require__(49)
	  , Symbol     = __webpack_require__(19).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(34)
	  , toObject    = __webpack_require__(55)
	  , IE_PROTO    = __webpack_require__(47)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(15);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(21)
	  , $export        = __webpack_require__(18)
	  , toObject       = __webpack_require__(55)
	  , call           = __webpack_require__(57)
	  , isArrayIter    = __webpack_require__(58)
	  , toLength       = __webpack_require__(45)
	  , createProperty = __webpack_require__(59)
	  , getIterFn      = __webpack_require__(60);

	$export($export.S + $export.F * !__webpack_require__(62)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(25);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(35)
	  , ITERATOR   = __webpack_require__(53)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(24)
	  , createDesc      = __webpack_require__(32);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(61)
	  , ITERATOR  = __webpack_require__(53)('iterator')
	  , Iterators = __webpack_require__(35);
	module.exports = __webpack_require__(20).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(43)
	  , TAG = __webpack_require__(53)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(53)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _promise = __webpack_require__(64);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (fn) {
	  return function () {
	    var gen = fn.apply(this, arguments);
	    return new _promise2.default(function (resolve, reject) {
	      function step(key, arg) {
	        try {
	          var info = gen[key](arg);
	          var value = info.value;
	        } catch (error) {
	          reject(error);
	          return;
	        }

	        if (info.done) {
	          resolve(value);
	        } else {
	          return _promise2.default.resolve(value).then(function (value) {
	            step("next", value);
	          }, function (err) {
	            step("throw", err);
	          });
	        }
	      }

	      return step("next");
	    });
	  };
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(65), __esModule: true };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(66);
	__webpack_require__(12);
	__webpack_require__(67);
	__webpack_require__(71);
	module.exports = __webpack_require__(20).Promise;

/***/ },
/* 66 */
/***/ function(module, exports) {

	

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68);
	var global        = __webpack_require__(19)
	  , hide          = __webpack_require__(23)
	  , Iterators     = __webpack_require__(35)
	  , TO_STRING_TAG = __webpack_require__(53)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(69)
	  , step             = __webpack_require__(70)
	  , Iterators        = __webpack_require__(35)
	  , toIObject        = __webpack_require__(41);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(16)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 70 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY            = __webpack_require__(17)
	  , global             = __webpack_require__(19)
	  , ctx                = __webpack_require__(21)
	  , classof            = __webpack_require__(61)
	  , $export            = __webpack_require__(18)
	  , isObject           = __webpack_require__(26)
	  , aFunction          = __webpack_require__(22)
	  , anInstance         = __webpack_require__(72)
	  , forOf              = __webpack_require__(73)
	  , speciesConstructor = __webpack_require__(74)
	  , task               = __webpack_require__(75).set
	  , microtask          = __webpack_require__(77)()
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;

	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(53)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();

	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};

	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(78)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(52)($Promise, PROMISE);
	__webpack_require__(79)(PROMISE);
	Wrapper = __webpack_require__(20)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(62)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(21)
	  , call        = __webpack_require__(57)
	  , isArrayIter = __webpack_require__(58)
	  , anObject    = __webpack_require__(25)
	  , toLength    = __webpack_require__(45)
	  , getIterFn   = __webpack_require__(60)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(25)
	  , aFunction = __webpack_require__(22)
	  , SPECIES   = __webpack_require__(53)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(21)
	  , invoke             = __webpack_require__(76)
	  , html               = __webpack_require__(51)
	  , cel                = __webpack_require__(30)
	  , global             = __webpack_require__(19)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(43)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 76 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(19)
	  , macrotask = __webpack_require__(75).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(43)(process) == 'process';

	module.exports = function(){
	  var head, last, notify;

	  var flush = function(){
	    var parent, fn;
	    if(isNode && (parent = process.domain))parent.exit();
	    while(head){
	      fn   = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch(e){
	        if(head)notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if(parent)parent.enter();
	  };

	  // Node.js
	  if(isNode){
	    notify = function(){
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if(Observer){
	    var toggle = true
	      , node   = document.createTextNode('');
	    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	    notify = function(){
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if(Promise && Promise.resolve){
	    var promise = Promise.resolve();
	    notify = function(){
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function(){
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }

	  return function(fn){
	    var task = {fn: fn, next: undefined};
	    if(last)last.next = task;
	    if(!head){
	      head = task;
	      notify();
	    } last = task;
	  };
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(23);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(19)
	  , core        = __webpack_require__(20)
	  , dP          = __webpack_require__(24)
	  , DESCRIPTORS = __webpack_require__(28)
	  , SPECIES     = __webpack_require__(53)('species');

	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 80 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(82);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(84);
	var $Object = __webpack_require__(20).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(18);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(28), 'Object', {defineProperty: __webpack_require__(24).f});

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Circle = __webpack_require__(86);

	var _Circle2 = _interopRequireDefault(_Circle);

	var _Rectangle = __webpack_require__(116);

	var _Rectangle2 = _interopRequireDefault(_Rectangle);

	var _Vector = __webpack_require__(117);

	var _Vector2 = _interopRequireDefault(_Vector);

	var _config = __webpack_require__(118);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Capture = function () {
	    function Capture(args) {
	        (0, _classCallCheck3.default)(this, Capture);

	        this.watchElements = new Array();
	        this.config = args.webConfig;
	    }
	    // algnrith advance


	    (0, _createClass3.default)(Capture, [{
	        key: "addWatchElements",
	        value: function addWatchElements(rootElement, element, label, domPath) {
	            this.watchElements.push({
	                rootElement: rootElement,
	                element: element,
	                label: label,
	                domPath: domPath
	            });
	        }
	    }, {
	        key: "watchDOMBySelector",
	        value: function watchDOMBySelector() {
	            var _this = this;

	            var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

	            selectors = this.config.itemSelectors;
	            selectors.forEach(function (selector) {
	                $(selector).each(function (index, item) {
	                    var img = $(item).find(_this.config.itemImgSelector)[0];
	                    var text = $(item).find(_this.config.itemTitleSelector)[0];
	                    if (img) {
	                        _this.addWatchElements(item, img, "img", _this.config.itemImgSelector);
	                    }
	                    if (text) {
	                        _this.addWatchElements(item, text, "label", _this.config.itemTitleSelector);
	                    }
	                });
	            });
	        }
	    }, {
	        key: "updateWatchDom",
	        value: function updateWatchDom() {
	            var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

	            this.watchElements = [];
	            this.watchDOMBySelector(selectors);
	        }
	    }, {
	        key: "getElementByCapture",
	        value: function getElementByCapture(location, range) {
	            var _this2 = this;

	            this.updateWatchDom();
	            var result = this.watchElements.filter(function (item) {
	                var judge = _this2.filterJudgement(item.element, location, range);
	                if (!judge) {
	                    $(item.element).removeClass("test-selected");
	                }
	                return judge;
	            });
	            return result;
	        }
	    }, {
	        key: "filterJudgement",
	        value: function filterJudgement(element, location, range) {
	            var rect = this.getPositionOfElement(element);
	            var start = {
	                x: rect.left,
	                y: rect.top
	            };
	            var end = {
	                x: rect.right,
	                y: rect.bottom
	            };
	            return this.isJoined(start, end, location, range);
	        }
	    }, {
	        key: "isJoined",
	        value: function isJoined(rStart, rEnd, cLoc, cRadius) {
	            var circle = new _Circle2.default();
	            circle.centerLocation = cLoc;
	            circle.radius = cRadius;
	            var rect = new _Rectangle2.default();
	            rect.startPoint = [rStart.x, rStart.y];
	            rect.endPoint = [rEnd.x, rEnd.y];
	            var vJoin = rect.getVectorFrom(cLoc).abs();
	            var vNear = rect.getNearestDiagonalVector(cLoc).abs();
	            var vResult = vJoin.minus(vNear);

	            var u = 0;
	            // circle cetroid in rect
	            if (vResult.vector[0] < 0 && vResult.vector[1] < 0) {
	                return true;
	            }
	            // 靠近 方框
	            if (Math.abs(vResult.vector[0]) < cRadius && Math.abs(vResult.vector[1]) < cRadius) {
	                u = Math.min(Math.max(vResult.vector[0], 0), Math.max(vResult.vector[1], 0));
	                return u <= cRadius;
	            }

	            // 远离方框
	            if (vResult.vector[0] > 0 || vResult.vector[1] > 0) {
	                u = vResult.distance();
	                return u <= cRadius;
	            }
	            return false;
	        }
	    }, {
	        key: "getPositionOfElement",
	        value: function getPositionOfElement(element) {
	            var x = 0;
	            var y = 0;
	            var width = element.offsetWidth;
	            var height = element.offsetHeight;

	            while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
	                try {
	                    if ($(element).hasClass(this.config.listDOMSelector.slice(1))) {
	                        break;
	                    }
	                } catch (e) {
	                    console.log("nothing");
	                }
	                x += element.offsetLeft;
	                y += element.offsetTop;
	                element = element.offsetParent;
	            }
	            return {
	                left: x,
	                right: x + width,
	                top: y,
	                bottom: y + height
	            };
	        }
	    }]);
	    return Capture;
	}();

	exports.default = Capture;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(87);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(107);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _Shape2 = __webpack_require__(115);

	var _Shape3 = _interopRequireDefault(_Shape2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Circle = function (_Shape) {
	    (0, _inherits3.default)(Circle, _Shape);

	    function Circle(args) {
	        (0, _classCallCheck3.default)(this, Circle);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, args));

	        _this._type = "Circle";
	        _this._radius = null;
	        return _this;
	    }

	    (0, _createClass3.default)(Circle, [{
	        key: "centerLocation",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._centerLocation = {
	                    x: value[0],
	                    y: value[1]
	                };
	                return true;
	            } else {
	                return false;
	            }
	        }
	    }, {
	        key: "radius",
	        set: function set(value) {
	            if (typeof value === 'number') {
	                this._radius = value;
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._radius ? this.radius : false;
	        }
	    }]);
	    return Circle;
	}(_Shape3.default);

	exports.default = Circle;

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(88);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(89);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(92);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(12);
	__webpack_require__(67);
	module.exports = __webpack_require__(91).f('iterator');

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(53);

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(93), __esModule: true };

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(94);
	__webpack_require__(66);
	__webpack_require__(105);
	__webpack_require__(106);
	module.exports = __webpack_require__(20).Symbol;

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(19)
	  , has            = __webpack_require__(34)
	  , DESCRIPTORS    = __webpack_require__(28)
	  , $export        = __webpack_require__(18)
	  , redefine       = __webpack_require__(33)
	  , META           = __webpack_require__(95).KEY
	  , $fails         = __webpack_require__(29)
	  , shared         = __webpack_require__(48)
	  , setToStringTag = __webpack_require__(52)
	  , uid            = __webpack_require__(49)
	  , wks            = __webpack_require__(53)
	  , wksExt         = __webpack_require__(91)
	  , wksDefine      = __webpack_require__(96)
	  , keyOf          = __webpack_require__(97)
	  , enumKeys       = __webpack_require__(98)
	  , isArray        = __webpack_require__(101)
	  , anObject       = __webpack_require__(25)
	  , toIObject      = __webpack_require__(41)
	  , toPrimitive    = __webpack_require__(31)
	  , createDesc     = __webpack_require__(32)
	  , _create        = __webpack_require__(37)
	  , gOPNExt        = __webpack_require__(102)
	  , $GOPD          = __webpack_require__(104)
	  , $DP            = __webpack_require__(24)
	  , $keys          = __webpack_require__(39)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(103).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(100).f  = $propertyIsEnumerable;
	  __webpack_require__(99).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(17)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(23)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(49)('meta')
	  , isObject = __webpack_require__(26)
	  , has      = __webpack_require__(34)
	  , setDesc  = __webpack_require__(24).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(29)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(19)
	  , core           = __webpack_require__(20)
	  , LIBRARY        = __webpack_require__(17)
	  , wksExt         = __webpack_require__(91)
	  , defineProperty = __webpack_require__(24).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(39)
	  , toIObject = __webpack_require__(41);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(39)
	  , gOPS    = __webpack_require__(99)
	  , pIE     = __webpack_require__(100);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 99 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 100 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(43);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(41)
	  , gOPN      = __webpack_require__(103).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(40)
	  , hiddenKeys = __webpack_require__(50).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(100)
	  , createDesc     = __webpack_require__(32)
	  , toIObject      = __webpack_require__(41)
	  , toPrimitive    = __webpack_require__(31)
	  , has            = __webpack_require__(34)
	  , IE8_DOM_DEFINE = __webpack_require__(27)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(28) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(96)('asyncIterator');

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(96)('observable');

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(108);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(112);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(88);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(109), __esModule: true };

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(110);
	module.exports = __webpack_require__(20).Object.setPrototypeOf;

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(18);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(111).set});

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(26)
	  , anObject = __webpack_require__(25);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(21)(Function.call, __webpack_require__(104).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(113), __esModule: true };

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(114);
	var $Object = __webpack_require__(20).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(18)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(37)});

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Shape = function () {
	    function Shape(args) {
	        (0, _classCallCheck3.default)(this, Shape);

	        if (args) {
	            this._type = args.type || "";
	            this._centerLocation = args.centerLocation;
	        } else {
	            this._type = null;
	            this._centerLocation = null;
	        }
	    }

	    (0, _createClass3.default)(Shape, [{
	        key: "type",
	        get: function get() {
	            return this._type;
	        }
	    }, {
	        key: "centerLocation",
	        get: function get() {
	            return this._centerLocation;
	        }
	    }]);
	    return Shape;
	}();

	exports.default = Shape;

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof2 = __webpack_require__(88);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(87);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(107);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _Shape2 = __webpack_require__(115);

	var _Shape3 = _interopRequireDefault(_Shape2);

	var _Vector = __webpack_require__(117);

	var _Vector2 = _interopRequireDefault(_Vector);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Rectangle = function (_Shape) {
	    (0, _inherits3.default)(Rectangle, _Shape);

	    function Rectangle(args) {
	        (0, _classCallCheck3.default)(this, Rectangle);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this, args));

	        _this._type = "Rectangle";
	        _this._startPoint = null;
	        _this._endPoint = null;
	        _this._diagnalVector = null;
	        return _this;
	    }

	    (0, _createClass3.default)(Rectangle, [{
	        key: "_updateCenterLocation",
	        value: function _updateCenterLocation() {
	            if (this._startPoint && this._endPoint) {
	                this._centerLocation = {
	                    x: (this._startPoint.x + this._endPoint.x) / 2,
	                    y: (this._startPoint.y + this._endPoint.y) / 2
	                };
	                this._diagnalVector = [];
	                this._diagnalVector.push(new _Vector2.default((this._endPoint.x - this._startPoint.x) / 2, (this._endPoint.y - this._startPoint.y) / 2));
	                this._diagnalVector.push(new _Vector2.default((this._endPoint.x - this._startPoint.x) / 2, -(this._endPoint.y - this._startPoint.y) / 2));
	                this._diagnalVector.push(new _Vector2.default(-(this._endPoint.x - this._startPoint.x) / 2, -(this._endPoint.y - this._startPoint.y) / 2));
	                this._diagnalVector.push(new _Vector2.default(-(this._endPoint.x - this._startPoint.x) / 2, (this._endPoint.y - this._startPoint.y) / 2));
	            } else {
	                this._centerLocation = null;
	                this._diagnalVector = null;
	            }
	        }
	    }, {
	        key: "getVectorFrom",
	        value: function getVectorFrom(location) {
	            if (!this._centerLocation) return false;
	            if (Array.isArray(location) && location.length >= 2) {
	                return new _Vector2.default(location[0] - this._centerLocation.x, location[1] - this._centerLocation.y);
	            } else if ((typeof location === "undefined" ? "undefined" : (0, _typeof3.default)(location)) === "object" && location.x && location.y) {
	                return new _Vector2.default(location.x - this._centerLocation.x, location.y - this._centerLocation.y);
	            } else {
	                return false;
	            }
	        }
	    }, {
	        key: "getNearestDiagonalVector",
	        value: function getNearestDiagonalVector(location) {
	            var _this2 = this;

	            var curVector = this.getVectorFrom(location);
	            if (curVector && this._centerLocation) {
	                var _ret = function () {
	                    var resultIndex = 0;
	                    var cos = curVector.angleCos(_this2._diagnalVector[0]);
	                    _this2._diagnalVector.forEach(function (item, index) {
	                        if (index !== 0) {
	                            var curCos = curVector.angleCos(item);
	                            if (curCos > cos) {
	                                cos = curCos;
	                                resultIndex = index;
	                            }
	                        }
	                    });
	                    return {
	                        v: _this2._diagnalVector[resultIndex]
	                    };
	                }();

	                if ((typeof _ret === "undefined" ? "undefined" : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
	            } else {
	                return false;
	            }
	        }
	    }, {
	        key: "startPoint",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._startPoint = {
	                    x: value[0],
	                    y: value[1]
	                };
	                this._updateCenterLocation();
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._startPoint ? [this._startPoint.x, this._startPoint.y] : null;
	        }
	    }, {
	        key: "endPoint",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._endPoint = {
	                    x: value[0],
	                    y: value[1]
	                };
	                this._updateCenterLocation();
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._endPoint ? [this._endPoint.x, this.endPoint.y] : null;
	        }
	    }]);
	    return Rectangle;
	}(_Shape3.default);

	exports.default = Rectangle;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Vector = function () {
	    function Vector() {
	        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	        (0, _classCallCheck3.default)(this, Vector);

	        this._startPoint = null;
	        this._endPoint = null;
	        this._vector = null;
	        if (x !== null && y !== null) {
	            this._startPoint = {
	                x: 0,
	                y: 0
	            };
	            this._endPoint = {
	                x: x,
	                y: y
	            };
	            this._vector = {
	                x: x,
	                y: y
	            };
	        }
	    }

	    (0, _createClass3.default)(Vector, [{
	        key: "_updateVector",
	        value: function _updateVector() {
	            if (this._endPoint && this._startPoint) {
	                this._vector = {
	                    x: this._endPoint.x - this._startPoint.x,
	                    y: this._endPoint.y - this._startPoint.y
	                };
	            } else {
	                this._vector = null;
	            }
	        }
	    }, {
	        key: "plus",
	        value: function plus(vector) {
	            if (vector instanceof Vector) {
	                return new Vector(this._vector.x + vector.vector[0], this._vector.y + vector.vector[1]);
	            } else {
	                throw new Error("input must be a Vector object.");
	            }
	        }
	    }, {
	        key: "minus",
	        value: function minus(vector) {
	            if (vector instanceof Vector) {
	                return new Vector(this._vector.x - vector.vector[0], this._vector.y - vector.vector[1]);
	            } else {
	                throw new Error("input must be a Vector object.");
	            }
	        }
	    }, {
	        key: "distance",
	        value: function distance() {
	            var vector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	            if (vector === null) {
	                // calculate it's distance
	                return Math.sqrt(Math.pow(this._vector.x, 2) + Math.pow(this._vector.y, 2));
	            } else {
	                // calculate vector's distance
	                return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
	            }
	        }
	    }, {
	        key: "angleCos",
	        value: function angleCos(vector) {
	            if (vector) {
	                var a = this.distance();
	                var b = this.distance(vector);
	                var ab = this._vector.x * vector.x + this._vector.y * vector.y;
	                return a * b !== 0 ? ab / (a * b) : 1; // assum 1
	            } else {
	                return false;
	            }
	        }
	    }, {
	        key: "abs",
	        value: function abs(vector) {
	            if (vector) {
	                return new Vector(Math.abs(vector.x), Math.abs(vector.y));
	            } else {
	                return new Vector(Math.abs(this._vector.x), Math.abs(this._vector.y));
	            }
	        }
	    }, {
	        key: "startPoint",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._startPoint = {
	                    x: value[0],
	                    y: value[1]
	                };
	                this._updateVector();
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._startPoint ? [this._startPoint.x, this._startPoint.y] : null;
	        }
	    }, {
	        key: "endPoint",
	        set: function set(value) {
	            if (Array.isArray(value) && value.length >= 2) {
	                this._endPoint = {
	                    x: value[0],
	                    y: value[1]
	                };
	                this._updateVector();
	                return true;
	            } else {
	                return false;
	            }
	        },
	        get: function get() {
	            return this._endPoint ? [this._endPoint.x, this._endPoint.y] : null;
	        }
	    }, {
	        key: "vector",
	        get: function get() {
	            return this._vector ? [this._vector.x, this._vector.y] : null;
	        }
	    }]);
	    return Vector;
	}();

	exports.default = Vector;

/***/ },
/* 118 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    "webConfig": {
	        "listDOMSelector": ".grid-container",
	        "itemSelectors": [".grid-container > .grid-item", ".grid-container .blank-row .grid-item"],
	        "itemImgSelector": ".grid-panel > .img-box > .img-a",
	        "itemTitleSelector": ".grid-panel > .info-cont > .title-row > .product-title"
	    },
	    "inputType": {
	        "0": "can't be matched",
	        "1": "item of next",
	        "2": "matched"
	    },
	    "noteConfig": {
	        "noteType": {
	            "01": "/",
	            "02": "\\",
	            "03": "1",
	            "04": "circle item access",
	            "10": "circle not confirmed",
	            "11": "small circle",
	            "12": "big circle",
	            "20": "cross not confirmed",
	            "21": "small cross",
	            "22": "big cross",
	            "31": "up",
	            "41": "down"
	        },
	        "diff": {
	            "minRadius": 36,
	            "maxRadius": 248,
	            "boundary": 50
	        }
	    }
	};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof2 = __webpack_require__(88);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DomOperation = function () {
	  function DomOperation() {
	    var _this = this;

	    (0, _classCallCheck3.default)(this, DomOperation);

	    this.GRID_STYLE = "GRID";
	    this.LIST_STYLE = "LIST";
	    this.PAGE_NO = 1;
	    this.product_list = "";

	    // 存储过往操作的黑白名单，在填补空白时对product_list中的商品进行过滤
	    this.WHITE_LIST = [];
	    this.BLACK_LIST = [];

	    // 不同的笔迹类型
	    this.SIGN_WHITE = "SIGN_WHITE"; // 大圈
	    this.SIGN_BLACK = "SIGN_BLACK"; // 大叉

	    //根据插件页面发出的消息进行回应
	    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	      // 根据黑白名单对页面dom元素进行重排序，并利用API返回的商品列表进行页面空白补全
	      if (request.command == "filter") {
	        //filterDom(request);
	        //getProductListAndFilter(request);
	        sendResponse({ result: "filtering done" });
	      }
	      // 获取异步API调用的返回值：商品列表
	      if (request.command == "product_list") {
	        _this.product_list = $.parseJSON(request.list).tbk_item_get_response.results.n_tbk_item;
	      }
	    });
	  }

	  (0, _createClass3.default)(DomOperation, [{
	    key: "getNextPage",
	    value: function getNextPage() {
	      // 获取下一页链接
	      var next_page = $('ul.items li.item.active').next();
	      var a = next_page.children();
	      var s_value = a.attr("data-value");

	      var cur_url = $(document)[0].URL;
	      var s_para = cur_url.match(/s=([^& ]*)/);
	      var next_url = void 0;
	      if (s_para == null) {
	        next_url = cur_url + "&s=" + s_value;
	      } else {
	        next_url = cur_url.replace(/s=([^& ]*)/, "s=" + s_value);
	      }
	      console.debug(next_url);

	      var iframe = document.createElement('iframe');
	      iframe.id = "next_page_iframe";
	      iframe.name = "next_page_iframe";
	      iframe.src = next_url;
	      iframe.width = "0";
	      iframe.height = "0";
	      document.body.appendChild(iframe);

	      setTimeout(function () {
	        var item_list = $(window.frames["next_page_iframe"].document).find(".grid.g-clearfix").children().eq(0);
	        console.debug("item_list", item_list);
	      }, 2000);
	    }
	  }, {
	    key: "filter",
	    value: function filter(containerDivList, imgDivList, typeList) {
	      var _this2 = this;

	      this.getNextPage();

	      if (this.product_list == "") {
	        console.debug("calling API to get product list ...");

	        // 获得当前页面商品排序方式
	        //let sorts = $('li.sort');

	        this.requestForProductList();

	        // 等待异步API调用的返回结果
	        setTimeout(function () {
	          console.debug(_this2.product_list);

	          _this2.filterDom(containerDivList, imgDivList, typeList);
	        }, 1000);
	      } else {
	        // 已获取商品列表，直接过滤
	        this.filterDom(containerDivList, imgDivList, typeList);
	      }
	    }

	    /*
	     * 供识别模块进行调用
	     * 根据识别出的大圈大叉的dom元素对页面进行过滤
	     * 若无用于填补空白的商品列表，则调用API获取
	     */

	  }, {
	    key: "filterDom",
	    value: function filterDom(containerDivList, imgDivList, typeList) {
	      console.log("param", containerDivList, imgDivList, typeList);
	      var page_style = this.getPageStyle();

	      for (var i = 0; i < containerDivList.length; i++) {
	        var cur_item = containerDivList[i];
	        var cur_img = imgDivList[i];
	        var cur_type = typeList[i];

	        var cur_id = this.getProductIdFromImg(cur_img);
	        console.log("cur_id", cur_id);
	        if (cur_id == "") continue;

	        // 大叉，黑名单，直接删除商品，并填补造成的页面空缺
	        if (cur_type == this.SIGN_BLACK) {
	          this.updateItem(cur_item, cur_id);

	          if ($('#' + cur_id).length > 0) {
	            $('#' + cur_id).remove();
	            this.BLACK_LIST.push(cur_id);

	            this.fillInBlank(page_style);
	          }
	        }
	        // 将白名单内商品排列到最前
	        else if (cur_type == this.SIGN_WHITE) {
	            // 当前商品列表第一个元素，将白名单商品添加在其前即可
	            var first_product = this.getFirstProduct(page_style);

	            this.updateItem(cur_item, cur_id);

	            if ($('#' + cur_id).length > 0) {
	              $('#' + cur_id).insertBefore(first_product);
	              this.WHITE_LIST.push(cur_id);

	              // 新开标签页，显示该商品的商品详情
	              this.createTab(cur_img.parentNode.href);
	            }
	          }
	      }
	    }
	    /*
	     * 根据图片dom元素获取商品id
	     */

	  }, {
	    key: "getProductIdFromImg",
	    value: function getProductIdFromImg(imgDom) {
	      var href = imgDom.parentNode.href;
	      if (href == undefined || href == null) {
	        return "";
	      }
	      var id = href.match(/id=([^&]*)&/);
	      if (id == null) {
	        return "";
	      }
	      console.log("id", id);

	      return id[1];
	    }

	    /*
	     * 根据商品id更新该商品所在dom元素
	       增加id属性；增加背景色样式
	     */

	  }, {
	    key: "updateItem",
	    value: function updateItem(item, p_id) {
	      item.id = p_id;
	      item.style.backgroundColor = "#FFCCCC";
	    }

	    /*
	     * 填补页面空缺
	     */

	  }, {
	    key: "fillInBlank",
	    value: function fillInBlank(page_style) {
	      // 当前商品列表最后一个元素，将新商品添加在其后即可
	      var lastProduct = this.getLastProduct(page_style);
	      console.debug(lastProduct);

	      var newProduct = this.getNewProduct();

	      // 替换商品信息
	      var item = lastProduct.clone();
	      if (page_style == this.GRID_STYLE) {
	        var pic_inner_box = item.children().eq(0).children().children();
	        var icon_msg = item.children().eq(1).children();

	        // 删除“找同款”  “找相似”
	        pic_inner_box.eq(2).remove();
	        pic_inner_box.eq(1).remove();

	        // 替换商品图片和链接
	        var a = pic_inner_box.children().eq(0);
	        a[0].href = newProduct.item_url;
	        a[0].id = "J_Itemlist_PLink_" + newProduct.num_iid;
	        a[0].search = "?id=" + newProduct.num_iid;

	        var img = a.children().eq(0);
	        img[0].id = "J_Itemlist_Pic_" + newProduct.num_iid;
	        img[0].src = newProduct.pict_url;
	        img[0].alt = newProduct.title;

	        // 删除天猫，保险理赔，旺旺等信息
	        icon_msg.eq(3).remove();

	        // 替换价格信息
	        var price = icon_msg.eq(0).children().eq(0).children().eq(1);
	        price[0].textContent = newProduct.zk_final_price;

	        // 替换销量信息
	        var volume = icon_msg.eq(0).children().eq(1);
	        volume[0].textContent = newProduct.volume + "人付款";

	        // 替换标题信息
	        var title = icon_msg.eq(1).children();
	        title[0].search = "?id=" + newProduct.num_iid;
	        title[0].id = "J_Itemlist_TLink_" + newProduct.num_iid;
	        title[0].href = newProduct.item_url;
	        title[0].textContent = newProduct.title;

	        // 替换店铺信息
	        var shop = icon_msg.eq(2).children().eq(0).children();
	        shop[0].search = "?user_number_id=" + newProduct.seller_id;
	        shop[0].href = "https://store.taobao.com/shop/view_shop.htm?user_number_id=" + newProduct.seller_id;
	        var shop_name = shop.children().eq(1);
	        shop_name[0].textContent = newProduct.nick;
	        shop.bind("mouseover", function (e) {
	          return false;
	        });

	        // 替换地址信息
	        var location = icon_msg.eq(2).children().eq(1);
	        location[0].textContent = newProduct.provcity;

	        lastProduct.after(item);
	      } else {
	        var pic_box = item.children().eq(0).children().children();

	        // 删除“找同款”  “找相似”
	        pic_box.children().eq(2).remove();
	        pic_box.children().eq(1).remove();

	        // 替换商品图片和链接
	        var _a = pic_box.children().children().eq(0);
	        _a[0].href = newProduct.item_url;
	        _a[0].id = "J_Itemlist_PLink_" + newProduct.num_iid;
	        _a[0].search = "?id=" + newProduct.num_iid;

	        var _img = _a.children().eq(0);
	        _img[0].id = "J_Itemlist_Pic_" + newProduct.num_iid;
	        _img[0].src = newProduct.pict_url;
	        _img[0].alt = newProduct.title;
	        _img.bind("mouseover", function (e) {
	          return false;
	        });

	        item.children().eq(2).children().eq(1).remove();

	        // 替换价格信息
	        var _price = item.children().eq(2).children().eq(0);
	        // 删除包邮信息
	        _price.children().eq(1).remove();
	        _price.children().eq(0).children()[1].textContent = newProduct.zk_final_price;

	        // 删除评论数信息
	        item.children().eq(3).children().eq(1).remove();

	        // 替换销量信息
	        var _volume = item.children().eq(3).children();
	        _volume[0].textContent = newProduct.volume + "人付款";

	        var _icon_msg = item.children().eq(1).children();

	        // 替换标题信息
	        var _title = _icon_msg.eq(0).children();
	        _title[0].search = "?id=" + newProduct.num_iid;
	        _title[0].id = "J_Itemlist_TLink_" + newProduct.num_iid;
	        _title[0].href = newProduct.item_url;
	        _title[0].textContent = newProduct.title;

	        // 替换店铺信息
	        var _shop = _icon_msg.eq(2).children().eq(0).children();
	        _shop[0].search = "?user_number_id=" + newProduct.seller_id;
	        _shop[0].href = "https://store.taobao.com/shop/view_shop.htm?user_number_id=" + newProduct.seller_id;
	        var _shop_name = _shop.children().eq(1);
	        _shop_name[0].textContent = newProduct.nick;
	        _shop.bind("mouseover", function (e) {
	          return false;
	        });

	        // 替换地址信息
	        var _location = _icon_msg.eq(2).children().eq(2);
	        _location[0].textContent = newProduct.provcity;

	        // 删除运费险等信息
	        item.children().eq(4).remove();
	        _icon_msg.eq(1).children().remove();
	        _icon_msg.eq(2).children().eq(1).children().remove();

	        lastProduct.after(item);
	      }
	    }

	    /*
	     * 从商品列表中获取填充的下一个商品
	     */

	  }, {
	    key: "getNewProduct",
	    value: function getNewProduct() {
	      var _this3 = this;

	      var _loop = function _loop() {
	        var product = _this3.product_list.shift();
	        console.debug(product);
	        var test = false;

	        // 商品列表为空，调用API取下一页商品
	        if (product == undefined) {
	          _this3.PAGE_NO++;
	          _this3.requestForProductList();

	          // 等待异步API调用的返回结果
	          setTimeout(function () {
	            console.debug(_this3.product_list);
	            product = _this3.product_list.shift();

	            if (_this3.checkProduct(product)) {
	              return product;
	            }
	          }, 1000);
	        } else {
	          if (_this3.checkProduct(product)) {
	            return {
	              v: product
	            };
	          }
	        }
	      };

	      while (true) {
	        var _ret = _loop();

	        if ((typeof _ret === "undefined" ? "undefined" : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
	      }
	    }

	    /*
	     * 检测商品是否可填充：不与页面已有商品重复；不是黑白名单商品
	     */

	  }, {
	    key: "checkProduct",
	    value: function checkProduct(product) {
	      var numiid = product.num_iid;

	      // 是否是黑白名单商品
	      if ($.inArray(numiid, this.WHITE_LIST) != -1 || $.inArray(numiid, this.BLACK_LIST) != -1) {
	        return false;
	      }

	      // 是否与页面其他商品重复
	      var item = void 0;

	      if (this.getPageStyle() == this.GRID_STYLE) {
	        var a_id = "J_Itemlist_PLink_" + numiid;
	        item = $('#' + a_id);
	      } else {
	        item = $('a[data-nid="' + numiid + '"]').eq(0);
	      }

	      if (item.length > 0) {
	        return false;
	      }

	      return true;
	    }

	    /*
	     * 获取当前页面显示方式：网格 OR 列表
	     */

	  }, {
	    key: "getPageStyle",
	    value: function getPageStyle() {
	      var grid_class = $('div.styles ul li')[0].childNodes[1].classList;

	      var cur_style = void 0;
	      if ($.inArray("active", grid_class) != -1) {
	        cur_style = this.GRID_STYLE;
	      } else {
	        cur_style = this.LIST_STYLE;
	      }

	      console.debug("current page style: " + cur_style);
	      return cur_style;
	    }

	    /*
	     * 返回当前页面列表中第一个商品dom元素
	     */

	  }, {
	    key: "getFirstProduct",
	    value: function getFirstProduct(page_style) {
	      if (page_style == this.GRID_STYLE) {
	        return $('div.item.J_MouserOnverReq').eq(0);
	      } else {
	        return $('div.item.g-clearfix').eq(0);
	      }
	    }

	    /*
	     * 返回当前页面列表中最后一个商品dom元素
	     */

	  }, {
	    key: "getLastProduct",
	    value: function getLastProduct(page_style) {
	      var container = void 0;
	      if (page_style == this.GRID_STYLE) {
	        container = $('div.item.J_MouserOnverReq');
	      } else {
	        container = $('div.item.g-clearfix');
	      }

	      return container.eq(container.length - 1);
	    }

	    /*
	     * 与popup页面通信，以实现新开标签页
	     */

	  }, {
	    key: "createTab",
	    value: function createTab(url) {
	      console.log("createing tab: " + url);
	      chrome.runtime.sendMessage({ command: "createTab", target: url }, function (response) {
	        console.log(response.result);
	      });
	    }

	    /*
	     * 与background页面通信，发送请求以根据当前页面URL获取完整商品列表
	     */

	  }, {
	    key: "requestForProductList",
	    value: function requestForProductList() {
	      // 获得当前页面URL
	      var page_url = $(document)[0].URL;
	      console.debug(page_url);

	      chrome.runtime.sendMessage({ command: "getProductList", url: page_url, page_no: this.PAGE_NO }, function (response) {});
	    }
	  }]);
	  return DomOperation;
	}();

	exports.default = DomOperation;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _tesseract = __webpack_require__(121);

	var _tesseract2 = _interopRequireDefault(_tesseract);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ImageRecognize = function () {
	    function ImageRecognize() {
	        (0, _classCallCheck3.default)(this, ImageRecognize);

	        this.tool = _tesseract2.default;
	    }

	    (0, _createClass3.default)(ImageRecognize, [{
	        key: "imageToText",
	        value: function imageToText(imageLike) {
	            var _this = this;

	            return new Promise(function (resolve, reject) {
	                _this.tool.recognize(imageLike, "chi_sim").catch(function (error) {
	                    reject(error);
	                }).then(function (result) {
	                    resolve(result);
	                    console.log("result", result);
	                });
	            });
	        }
	    }, {
	        key: "textMactch",
	        value: function textMactch(targetText, baseText) {
	            var baseItem = baseText.split(" ");
	            var result = "";
	            var tempAccuracy = 0;
	            baseItem.forEach(function (item) {
	                if (targetText.includes(item)) {
	                    result.concat(item + " ");
	                }
	            });
	            if (result.length < 1) {
	                return null;
	            }
	            return result;
	        }
	    }]);
	    return ImageRecognize;
	}();

	exports.default = ImageRecognize;

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	const adapter = __webpack_require__(122)
	const circularize = __webpack_require__(124)
	const TesseractJob = __webpack_require__(125);
	const objectAssign = __webpack_require__(126);
	const version = __webpack_require__(123).version;

	function create(workerOptions){
		workerOptions = workerOptions || {};
		var worker = new TesseractWorker(objectAssign({}, adapter.defaultOptions, workerOptions))
		worker.create = create;
		worker.version = version;
		return worker;
	}

	class TesseractWorker {
		constructor(workerOptions){
			this.worker = null;
			this.workerOptions = workerOptions;
			this._currentJob = null;
			this._queue = []
		}

		recognize(image, options){
			return this._delay(job => {
				if(typeof options === 'string'){
					options = { lang: options };
				}else{
					options = options || {}
					options.lang = options.lang || 'eng';	
				}
				
				job._send('recognize', { image: image, options: options, workerOptions: this.workerOptions })
			})
		}
		detect(image, options){
			options = options || {}
			return this._delay(job => {
				job._send('detect', { image: image, options: options, workerOptions: this.workerOptions })
			})
		}

		terminate(){ 
			if(this.worker) adapter.terminateWorker(this);
			this.worker = null;
		}

		_delay(fn){
			if(!this.worker) this.worker = adapter.spawnWorker(this, this.workerOptions);

			var job = new TesseractJob(this);
			this._queue.push(e => {
				this._queue.shift()
				this._currentJob = job;
				fn(job)
			})
			if(!this._currentJob) this._dequeue();
			return job
		}

		_dequeue(){
			this._currentJob = null;
			if(this._queue.length > 0){
				this._queue[0]()
			}
		}

		_recv(packet){

	        if(packet.status === 'resolve' && packet.action === 'recognize'){
	            packet.data = circularize(packet.data);
	        }

			if(this._currentJob.id === packet.jobId){
				this._currentJob._handle(packet)
			}else{
				console.warn('Job ID ' + packet.jobId + ' not known.')
			}
		}
	}

	var DefaultTesseract = create()

	module.exports = DefaultTesseract

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var defaultOptions = {
	    // workerPath: 'https://cdn.rawgit.com/naptha/tesseract.js/0.2.0/dist/worker.js',
	    corePath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/0.1.0/index.js',    
	    langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
	}

	if (process.env.NODE_ENV === "development") {
	    console.debug('Using Development Configuration')
	    defaultOptions.workerPath = location.protocol + '//' + location.host + '/dist/worker.dev.js?nocache=' + Math.random().toString(36).slice(3)
	}else{
	    var version = __webpack_require__(123).version;
	    defaultOptions.workerPath = 'https://cdn.rawgit.com/naptha/tesseract.js/' + version + '/dist/worker.js'
	}

	exports.defaultOptions = defaultOptions;


	exports.spawnWorker = function spawnWorker(instance, workerOptions){
	    if(window.Blob && window.URL){
	        var blob = new Blob(['importScripts("' + workerOptions.workerPath + '");'])
	        var worker = new Worker(window.URL.createObjectURL(blob));
	    }else{
	        var worker = new Worker(workerOptions.workerPath)
	    }

	    worker.onmessage = function(e){
	        var packet = e.data;
	        instance._recv(packet)
	    }
	    return worker
	}

	exports.terminateWorker = function(instance){
	    instance.worker.terminate()
	}

	exports.sendPacket = function sendPacket(instance, packet){
	    loadImage(packet.payload.image, function(img){
	        packet.payload.image = img
	        instance.worker.postMessage(packet) 
	    })
	}


	function loadImage(image, cb){
	    if(typeof image === 'string'){
	        if(/^\#/.test(image)){
	            // element css selector
	            return loadImage(document.querySelector(image), cb)
	        }else if(/(blob|data)\:/.test(image)){
	            // data url
	            var im = new Image
	            im.src = image;
	            im.onload = e => loadImage(im, cb);
	            return
	        }else{
	            var xhr = new XMLHttpRequest();
	            xhr.open('GET', image, true)
	            xhr.responseType = "blob";
	            xhr.onload = e => loadImage(xhr.response, cb);
	            xhr.onerror = function(e){
	                if(/^https?:\/\//.test(image) && !/^https:\/\/crossorigin.me/.test(image)){
	                    console.debug('Attempting to load image with CORS proxy')
	                    loadImage('https://crossorigin.me/' + image, cb)
	                }
	            }
	            xhr.send(null)
	            return
	        }
	    }else if(image instanceof File){
	        // files
	        var fr = new FileReader()
	        fr.onload = e => loadImage(fr.result, cb);
	        fr.readAsDataURL(image)
	        return
	    }else if(image instanceof Blob){
	        return loadImage(URL.createObjectURL(image), cb)
	    }else if(image.getContext){
	        // canvas element
	        return loadImage(image.getContext('2d'), cb)
	    }else if(image.tagName == "IMG" || image.tagName == "VIDEO"){
	        // image element or video element
	        var c = document.createElement('canvas');
	        c.width  = image.naturalWidth  || image.videoWidth;
	        c.height = image.naturalHeight || image.videoHeight;
	        var ctx = c.getContext('2d');
	        ctx.drawImage(image, 0, 0);
	        return loadImage(ctx, cb)
	    }else if(image.getImageData){
	        // canvas context
	        var data = image.getImageData(0, 0, image.canvas.width, image.canvas.height);
	        return loadImage(data, cb)
	    }else{
	        return cb(image)
	    }
	    throw new Error('Missing return in loadImage cascade')

	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 123 */
/***/ function(module, exports) {

	module.exports = {
		"_args": [
			[
				{
					"raw": "tesseract.js@^1.0.10",
					"scope": null,
					"escapedName": "tesseract.js",
					"name": "tesseract.js",
					"rawSpec": "^1.0.10",
					"spec": ">=1.0.10 <2.0.0",
					"type": "range"
				},
				"/Users/yef/codes/chrome-plugin/web-recognize-capture"
			]
		],
		"_from": "tesseract.js@>=1.0.10 <2.0.0",
		"_id": "tesseract.js@1.0.10",
		"_inCache": true,
		"_location": "/tesseract.js",
		"_nodeVersion": "6.7.0",
		"_npmOperationalInternal": {
			"host": "packages-12-west.internal.npmjs.com",
			"tmp": "tmp/tesseract.js-1.0.10.tgz_1476823577978_0.5278713656589389"
		},
		"_npmUser": {
			"name": "antimatter15",
			"email": "antimatter15@gmail.com"
		},
		"_npmVersion": "3.10.8",
		"_phantomChildren": {},
		"_requested": {
			"raw": "tesseract.js@^1.0.10",
			"scope": null,
			"escapedName": "tesseract.js",
			"name": "tesseract.js",
			"rawSpec": "^1.0.10",
			"spec": ">=1.0.10 <2.0.0",
			"type": "range"
		},
		"_requiredBy": [
			"#DEV:/"
		],
		"_resolved": "https://registry.npmjs.org/tesseract.js/-/tesseract.js-1.0.10.tgz",
		"_shasum": "e11a96ae76147939d9218f88e287fb69414b1e5d",
		"_shrinkwrap": null,
		"_spec": "tesseract.js@^1.0.10",
		"_where": "/Users/yef/codes/chrome-plugin/web-recognize-capture",
		"author": "",
		"browser": {
			"./src/node/index.js": "./src/browser/index.js"
		},
		"bugs": {
			"url": "https://github.com/naptha/tesseract.js/issues"
		},
		"dependencies": {
			"file-type": "^3.8.0",
			"is-url": "^1.2.2",
			"jpeg-js": "^0.2.0",
			"level-js": "^2.2.4",
			"node-fetch": "^1.6.3",
			"object-assign": "^4.1.0",
			"png.js": "^0.2.1",
			"tesseract.js-core": "^1.0.2"
		},
		"description": "Pure Javascript Multilingual OCR",
		"devDependencies": {
			"babel-preset-es2015": "^6.16.0",
			"babelify": "^7.3.0",
			"browserify": "^13.1.0",
			"envify": "^3.4.1",
			"http-server": "^0.9.0",
			"pako": "^1.0.3",
			"watchify": "^3.7.0"
		},
		"directories": {},
		"dist": {
			"shasum": "e11a96ae76147939d9218f88e287fb69414b1e5d",
			"tarball": "https://registry.npmjs.org/tesseract.js/-/tesseract.js-1.0.10.tgz"
		},
		"gitHead": "fc15b0ef43cbf2d8729f8db2ef06a16b2497a16e",
		"homepage": "https://github.com/naptha/tesseract.js",
		"license": "Apache-2.0",
		"main": "src/index.js",
		"maintainers": [
			{
				"name": "antimatter15",
				"email": "antimatter15@gmail.com"
			},
			{
				"name": "bijection",
				"email": "guillermo@cdbzb.com"
			}
		],
		"name": "tesseract.js",
		"optionalDependencies": {},
		"readme": "ERROR: No README data found!",
		"repository": {
			"type": "git",
			"url": "git+https://github.com/naptha/tesseract.js.git"
		},
		"scripts": {
			"build": "browserify src/index.js -t [ babelify --presets [ es2015 ] ] -o dist/tesseract.js --standalone Tesseract && browserify src/browser/worker.js -t [ babelify --presets [ es2015 ] ] -o dist/worker.js",
			"release": "npm run build && git commit -am 'new release' && git push && git tag `jq -r '.version' package.json` && git push origin --tags && npm publish",
			"start": "watchify src/index.js  -t [ envify --NODE_ENV development ] -t [ babelify --presets [ es2015 ] ] -o dist/tesseract.dev.js --standalone Tesseract & watchify src/browser/worker.js  -t [ envify --NODE_ENV development ] -t [ babelify --presets [ es2015 ] ] -o dist/worker.dev.js & http-server -p 7355",
			"test": "echo \"Error: no test specified\" & exit 1"
		},
		"version": "1.0.10"
	};

/***/ },
/* 124 */
/***/ function(module, exports) {

	// The result of dump.js is a big JSON tree
	// which can be easily serialized (for instance
	// to be sent from a webworker to the main app
	// or through Node's IPC), but we want
	// a (circular) DOM-like interface for walking
	// through the data. 

	module.exports = function circularize(page){
	    page.paragraphs = []
	    page.lines = []
	    page.words = []
	    page.symbols = []

	    page.blocks.forEach(function(block){
	        block.page = page;

	        block.lines = []
	        block.words = []
	        block.symbols = []

	        block.paragraphs.forEach(function(para){
	            para.block = block;
	            para.page = page;

	            para.words = []
	            para.symbols = []
	            
	            para.lines.forEach(function(line){
	                line.paragraph = para;
	                line.block = block;
	                line.page = page;

	                line.symbols = []

	                line.words.forEach(function(word){
	                    word.line = line;
	                    word.paragraph = para;
	                    word.block = block;
	                    word.page = page;
	                    word.symbols.forEach(function(sym){
	                        sym.word = word;
	                        sym.line = line;
	                        sym.paragraph = para;
	                        sym.block = block;
	                        sym.page = page;
	                        
	                        sym.line.symbols.push(sym)
	                        sym.paragraph.symbols.push(sym)
	                        sym.block.symbols.push(sym)
	                        sym.page.symbols.push(sym)
	                    })
	                    word.paragraph.words.push(word)
	                    word.block.words.push(word)
	                    word.page.words.push(word)
	                })
	                line.block.lines.push(line)
	                line.page.lines.push(line)
	            })
	            para.page.paragraphs.push(para)
	        })
	    })
	    return page
	}

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	const adapter = __webpack_require__(122)

	let jobCounter = 0;

	module.exports = class TesseractJob {
	    constructor(instance){
	        this.id = 'Job-' + (++jobCounter) + '-' + Math.random().toString(16).slice(3, 8)

	        this._instance = instance;
	        this._resolve = []
	        this._reject = []
	        this._progress = []
	        this._finally = []
	    }

	    then(resolve, reject){
	        if(this._resolve.push){
	            this._resolve.push(resolve) 
	        }else{
	            resolve(this._resolve)
	        }

	        if(reject) this.catch(reject);
	        return this;
	    }
	    catch(reject){
	        if(this._reject.push){
	            this._reject.push(reject) 
	        }else{
	            reject(this._reject)
	        }
	        return this;
	    }
	    progress(fn){
	        this._progress.push(fn)
	        return this;
	    }
	    finally(fn) {
	        this._finally.push(fn)
	        return this;  
	    }
	    _send(action, payload){
	        adapter.sendPacket(this._instance, {
	            jobId: this.id,
	            action: action,
	            payload: payload
	        })
	    }

	    _handle(packet){
	        var data = packet.data;
	        let runFinallyCbs = false;

	        if(packet.status === 'resolve'){
	            if(this._resolve.length === 0) console.log(data);
	            this._resolve.forEach(fn => {
	                var ret = fn(data);
	                if(ret && typeof ret.then == 'function'){
	                    console.warn('TesseractJob instances do not chain like ES6 Promises. To convert it into a real promise, use Promise.resolve.')
	                }
	            })
	            this._resolve = data;
	            this._instance._dequeue()
	            runFinallyCbs = true;
	        }else if(packet.status === 'reject'){
	            if(this._reject.length === 0) console.error(data);
	            this._reject.forEach(fn => fn(data))
	            this._reject = data;
	            this._instance._dequeue()
	            runFinallyCbs = true;
	        }else if(packet.status === 'progress'){
	            this._progress.forEach(fn => fn(data))
	        }else{
	            console.warn('Message type unknown', packet.status)
	        }

	        if (runFinallyCbs) {
	            this._finally.forEach(fn => fn(data));
	        }
	    }
	}


/***/ },
/* 126 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _domToImage = __webpack_require__(128);

	var _domToImage2 = _interopRequireDefault(_domToImage);

	var _fileSaver = __webpack_require__(129);

	var _fileSaver2 = _interopRequireDefault(_fileSaver);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var InterceptionWeb = function () {
	    function InterceptionWeb() {
	        (0, _classCallCheck3.default)(this, InterceptionWeb);

	        this.domToImage = _domToImage2.default;
	    }

	    (0, _createClass3.default)(InterceptionWeb, [{
	        key: "domToImageLikePng",
	        value: function domToImageLikePng(dom, range) {
	            var _this = this;

	            return new Promise(function (resolve, reject) {

	                _this.domToImage.toPng(dom).then(function (dataUrl) {
	                    var img = new Image();
	                    // const img = $(`<img src=${dataUrl}/>`)
	                    img.src = dataUrl;
	                    var result = _this.clip(img, range);
	                    document.body.appendChild(result);
	                    resolve(result);
	                }).catch(function (error) {
	                    reject(error);
	                });
	            });
	        }
	    }, {
	        key: "domToImageLikeJpeg",
	        value: function domToImageLikeJpeg(dom, range) {
	            var _this2 = this;

	            return new Promise(function (resolve, reject) {
	                _this2.domToImage.toJpeg(dom, { quality: 0.95 }).then(function (dataUrl) {
	                    var img = new Image();
	                    img.src = dataUrl;
	                    resolve(img);
	                }).catch(function (error) {
	                    reject(error);
	                });
	            });
	        }
	    }, {
	        key: "domToImageLikeSvg",
	        value: function domToImageLikeSvg(dom, range) {
	            var _this3 = this;

	            return new Promise(function (resolve, reject) {
	                _this3.domToImage.toSvg(dom).then(function (dataUrl) {
	                    var img = new Image();
	                    img.src = dataUrl;

	                    resolve(img);
	                }).catch(function (error) {
	                    reject(error);
	                });
	            });
	        }
	    }, {
	        key: "clip",
	        value: function clip(dom, range) {
	            if (!range || !range.startX || !range.startY || !range.width || !range.height) {
	                console.log("clip range params exists error");
	            }
	            var base64 = AlloyImage(dom).clip(parseInt(range.startX), parseInt(range.startY), parseInt(range.width), parseInt(range.height)).replace(dom).save("result.png", 1.0);
	            var image = new Image();
	            image.src = base64;
	            return image;
	        }
	    }]);
	    return InterceptionWeb;
	}();

	exports.default = InterceptionWeb;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {
	    'use strict';

	    var util = newUtil();
	    var inliner = newInliner();
	    var fontFaces = newFontFaces();
	    var images = newImages();

	    var domtoimage = {
	        toSvg: toSvg,
	        toPng: toPng,
	        toJpeg: toJpeg,
	        toBlob: toBlob,
	        toPixelData: toPixelData,
	        impl: {
	            fontFaces: fontFaces,
	            images: images,
	            util: util,
	            inliner: inliner
	        }
	    };

	    if (true)
	        module.exports = domtoimage;
	    else
	        global.domtoimage = domtoimage;


	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options
	     * @param {Function} options.filter - Should return true if passed node should be included in the output
	     *          (excluding node means excluding it's children as well). Not called on the root node.
	     * @param {String} options.bgcolor - color for the background, any valid CSS color value.
	     * @param {Number} options.width - width to be applied to node before rendering.
	     * @param {Number} options.height - height to be applied to node before rendering.
	     * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.
	     * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
	                defaults to 1.0.
	     * @return {Promise} - A promise that is fulfilled with a SVG image data URL
	     * */
	    function toSvg(node, options) {
	        options = options || {};
	        return Promise.resolve(node)
	            .then(function (node) {
	                return cloneNode(node, options.filter, true);
	            })
	            .then(embedFonts)
	            .then(inlineImages)
	            .then(applyOptions)
	            .then(function (clone) {
	                return makeSvgDataUri(clone,
	                    options.width || util.width(node),
	                    options.height || util.height(node)
	                );
	            });

	        function applyOptions(clone) {
	            if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;

	            if (options.width) clone.style.width = options.width + 'px';
	            if (options.height) clone.style.height = options.height + 'px';

	            if (options.style)
	                Object.keys(options.style).forEach(function (property) {
	                    clone.style[property] = options.style[property];
	                });

	            return clone;
	        }
	    }

	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options, @see {@link toSvg}
	     * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
	     * */
	    function toPixelData(node, options) {
	        return draw(node, options || {})
	            .then(function (canvas) {
	                return canvas.getContext('2d').getImageData(
	                    0,
	                    0,
	                    util.width(node),
	                    util.height(node)
	                ).data;
	            });
	    }

	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options, @see {@link toSvg}
	     * @return {Promise} - A promise that is fulfilled with a PNG image data URL
	     * */
	    function toPng(node, options) {
	        return draw(node, options || {})
	            .then(function (canvas) {
	                return canvas.toDataURL();
	            });
	    }

	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options, @see {@link toSvg}
	     * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
	     * */
	    function toJpeg(node, options) {
	        options = options || {};
	        return draw(node, options)
	            .then(function (canvas) {
	                return canvas.toDataURL('image/jpeg', options.quality || 1.0);
	            });
	    }

	    /**
	     * @param {Node} node - The DOM Node object to render
	     * @param {Object} options - Rendering options, @see {@link toSvg}
	     * @return {Promise} - A promise that is fulfilled with a PNG image blob
	     * */
	    function toBlob(node, options) {
	        return draw(node, options || {})
	            .then(util.canvasToBlob);
	    }

	    function draw(domNode, options) {
	        return toSvg(domNode, options)
	            .then(util.makeImage)
	            .then(util.delay(100))
	            .then(function (image) {
	                var canvas = newCanvas(domNode);
	                canvas.getContext('2d').drawImage(image, 0, 0);
	                return canvas;
	            });

	        function newCanvas(domNode) {
	            var canvas = document.createElement('canvas');
	            canvas.width = options.width || util.width(domNode);
	            canvas.height = options.height || util.height(domNode);

	            if (options.bgcolor) {
	                var ctx = canvas.getContext('2d');
	                ctx.fillStyle = options.bgcolor;
	                ctx.fillRect(0, 0, canvas.width, canvas.height);
	            }

	            return canvas;
	        }
	    }

	    function cloneNode(node, filter, root) {
	        if (!root && filter && !filter(node)) return Promise.resolve();

	        return Promise.resolve(node)
	            .then(makeNodeCopy)
	            .then(function (clone) {
	                return cloneChildren(node, clone, filter);
	            })
	            .then(function (clone) {
	                return processClone(node, clone);
	            });

	        function makeNodeCopy(node) {
	            if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
	            return node.cloneNode(false);
	        }

	        function cloneChildren(original, clone, filter) {
	            var children = original.childNodes;
	            if (children.length === 0) return Promise.resolve(clone);

	            return cloneChildrenInOrder(clone, util.asArray(children), filter)
	                .then(function () {
	                    return clone;
	                });

	            function cloneChildrenInOrder(parent, children, filter) {
	                var done = Promise.resolve();
	                children.forEach(function (child) {
	                    done = done
	                        .then(function () {
	                            return cloneNode(child, filter);
	                        })
	                        .then(function (childClone) {
	                            if (childClone) parent.appendChild(childClone);
	                        });
	                });
	                return done;
	            }
	        }

	        function processClone(original, clone) {
	            if (!(clone instanceof Element)) return clone;

	            return Promise.resolve()
	                .then(cloneStyle)
	                .then(clonePseudoElements)
	                .then(copyUserInput)
	                .then(fixSvg)
	                .then(function () {
	                    return clone;
	                });

	            function cloneStyle() {
	                copyStyle(window.getComputedStyle(original), clone.style);

	                function copyStyle(source, target) {
	                    if (source.cssText) target.cssText = source.cssText;
	                    else copyProperties(source, target);

	                    function copyProperties(source, target) {
	                        util.asArray(source).forEach(function (name) {
	                            target.setProperty(
	                                name,
	                                source.getPropertyValue(name),
	                                source.getPropertyPriority(name)
	                            );
	                        });
	                    }
	                }
	            }

	            function clonePseudoElements() {
	                [':before', ':after'].forEach(function (element) {
	                    clonePseudoElement(element);
	                });

	                function clonePseudoElement(element) {
	                    var style = window.getComputedStyle(original, element);
	                    var content = style.getPropertyValue('content');

	                    if (content === '' || content === 'none') return;

	                    var className = util.uid();
	                    clone.className = clone.className + ' ' + className;
	                    var styleElement = document.createElement('style');
	                    styleElement.appendChild(formatPseudoElementStyle(className, element, style));
	                    clone.appendChild(styleElement);

	                    function formatPseudoElementStyle(className, element, style) {
	                        var selector = '.' + className + ':' + element;
	                        var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);
	                        return document.createTextNode(selector + '{' + cssText + '}');

	                        function formatCssText(style) {
	                            var content = style.getPropertyValue('content');
	                            return style.cssText + ' content: ' + content + ';';
	                        }

	                        function formatCssProperties(style) {

	                            return util.asArray(style)
	                                .map(formatProperty)
	                                .join('; ') + ';';

	                            function formatProperty(name) {
	                                return name + ': ' +
	                                    style.getPropertyValue(name) +
	                                    (style.getPropertyPriority(name) ? ' !important' : '');
	                            }
	                        }
	                    }
	                }
	            }

	            function copyUserInput() {
	                if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
	                if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
	            }

	            function fixSvg() {
	                if (!(clone instanceof SVGElement)) return;
	                clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

	                if (!(clone instanceof SVGRectElement)) return;
	                ['width', 'height'].forEach(function (attribute) {
	                    var value = clone.getAttribute(attribute);
	                    if (!value) return;

	                    clone.style.setProperty(attribute, value);
	                });
	            }
	        }
	    }

	    function embedFonts(node) {
	        return fontFaces.resolveAll()
	            .then(function (cssText) {
	                var styleNode = document.createElement('style');
	                node.appendChild(styleNode);
	                styleNode.appendChild(document.createTextNode(cssText));
	                return node;
	            });
	    }

	    function inlineImages(node) {
	        return images.inlineAll(node)
	            .then(function () {
	                return node;
	            });
	    }

	    function makeSvgDataUri(node, width, height) {
	        return Promise.resolve(node)
	            .then(function (node) {
	                node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
	                return new XMLSerializer().serializeToString(node);
	            })
	            .then(util.escapeXhtml)
	            .then(function (xhtml) {
	                return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>';
	            })
	            .then(function (foreignObject) {
	                return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
	                    foreignObject + '</svg>';
	            })
	            .then(function (svg) {
	                return 'data:image/svg+xml;charset=utf-8,' + svg;
	            });
	    }

	    function newUtil() {
	        return {
	            escape: escape,
	            parseExtension: parseExtension,
	            mimeType: mimeType,
	            dataAsUrl: dataAsUrl,
	            isDataUrl: isDataUrl,
	            canvasToBlob: canvasToBlob,
	            resolveUrl: resolveUrl,
	            getAndEncode: getAndEncode,
	            uid: uid(),
	            delay: delay,
	            asArray: asArray,
	            escapeXhtml: escapeXhtml,
	            makeImage: makeImage,
	            width: width,
	            height: height
	        };

	        function mimes() {
	            /*
	             * Only WOFF and EOT mime types for fonts are 'real'
	             * see http://www.iana.org/assignments/media-types/media-types.xhtml
	             */
	            var WOFF = 'application/font-woff';
	            var JPEG = 'image/jpeg';

	            return {
	                'woff': WOFF,
	                'woff2': WOFF,
	                'ttf': 'application/font-truetype',
	                'eot': 'application/vnd.ms-fontobject',
	                'png': 'image/png',
	                'jpg': JPEG,
	                'jpeg': JPEG,
	                'gif': 'image/gif',
	                'tiff': 'image/tiff',
	                'svg': 'image/svg+xml'
	            };
	        }

	        function parseExtension(url) {
	            var match = /\.([^\.\/]*?)$/g.exec(url);
	            if (match) return match[1];
	            else return '';
	        }

	        function mimeType(url) {
	            var extension = parseExtension(url).toLowerCase();
	            return mimes()[extension] || '';
	        }

	        function isDataUrl(url) {
	            return url.search(/^(data:)/) !== -1;
	        }

	        function toBlob(canvas) {
	            return new Promise(function (resolve) {
	                var binaryString = window.atob(canvas.toDataURL().split(',')[1]);
	                var length = binaryString.length;
	                var binaryArray = new Uint8Array(length);

	                for (var i = 0; i < length; i++)
	                    binaryArray[i] = binaryString.charCodeAt(i);

	                resolve(new Blob([binaryArray], {
	                    type: 'image/png'
	                }));
	            });
	        }

	        function canvasToBlob(canvas) {
	            if (canvas.toBlob)
	                return new Promise(function (resolve) {
	                    canvas.toBlob(resolve);
	                });

	            return toBlob(canvas);
	        }

	        function resolveUrl(url, baseUrl) {
	            var doc = document.implementation.createHTMLDocument();
	            var base = doc.createElement('base');
	            doc.head.appendChild(base);
	            var a = doc.createElement('a');
	            doc.body.appendChild(a);
	            base.href = baseUrl;
	            a.href = url;
	            return a.href;
	        }

	        function uid() {
	            var index = 0;

	            return function () {
	                return 'u' + fourRandomChars() + index++;

	                function fourRandomChars() {
	                    /* see http://stackoverflow.com/a/6248722/2519373 */
	                    return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
	                }
	            };
	        }

	        function makeImage(uri) {
	            return new Promise(function (resolve, reject) {
	                var image = new Image();
	                image.onload = function () {
	                    resolve(image);
	                };
	                image.onerror = reject;
	                image.src = uri;
	            });
	        }

	        function getAndEncode(url) {
	            var TIMEOUT = 30000;

	            return new Promise(function (resolve) {
	                var request = new XMLHttpRequest();

	                request.onreadystatechange = done;
	                request.ontimeout = timeout;
	                request.responseType = 'blob';
	                request.timeout = TIMEOUT;
	                request.open('GET', url, true);
	                request.send();

	                function done() {
	                    if (request.readyState !== 4) return;

	                    if (request.status !== 200) {
	                        fail('cannot fetch resource: ' + url + ', status: ' + request.status);
	                        return;
	                    }

	                    var encoder = new FileReader();
	                    encoder.onloadend = function () {
	                        var content = encoder.result.split(/,/)[1];
	                        resolve(content);
	                    };
	                    encoder.readAsDataURL(request.response);
	                }

	                function timeout() {
	                    fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url);
	                }

	                function fail(message) {
	                    console.error(message);
	                    resolve('');
	                }
	            });
	        }

	        function dataAsUrl(content, type) {
	            return 'data:' + type + ';base64,' + content;
	        }

	        function escape(string) {
	            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
	        }

	        function delay(ms) {
	            return function (arg) {
	                return new Promise(function (resolve) {
	                    setTimeout(function () {
	                        resolve(arg);
	                    }, ms);
	                });
	            };
	        }

	        function asArray(arrayLike) {
	            var array = [];
	            var length = arrayLike.length;
	            for (var i = 0; i < length; i++) array.push(arrayLike[i]);
	            return array;
	        }

	        function escapeXhtml(string) {
	            return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
	        }

	        function width(node) {
	            var leftBorder = px(node, 'border-left-width');
	            var rightBorder = px(node, 'border-right-width');
	            return node.scrollWidth + leftBorder + rightBorder;
	        }

	        function height(node) {
	            var topBorder = px(node, 'border-top-width');
	            var bottomBorder = px(node, 'border-bottom-width');
	            return node.scrollHeight + topBorder + bottomBorder;
	        }

	        function px(node, styleProperty) {
	            var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
	            return parseFloat(value.replace('px', ''));
	        }
	    }

	    function newInliner() {
	        var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

	        return {
	            inlineAll: inlineAll,
	            shouldProcess: shouldProcess,
	            impl: {
	                readUrls: readUrls,
	                inline: inline
	            }
	        };

	        function shouldProcess(string) {
	            return string.search(URL_REGEX) !== -1;
	        }

	        function readUrls(string) {
	            var result = [];
	            var match;
	            while ((match = URL_REGEX.exec(string)) !== null) {
	                result.push(match[1]);
	            }
	            return result.filter(function (url) {
	                return !util.isDataUrl(url);
	            });
	        }

	        function inline(string, url, baseUrl, get) {
	            return Promise.resolve(url)
	                .then(function (url) {
	                    return baseUrl ? util.resolveUrl(url, baseUrl) : url;
	                })
	                .then(get || util.getAndEncode)
	                .then(function (data) {
	                    return util.dataAsUrl(data, util.mimeType(url));
	                })
	                .then(function (dataUrl) {
	                    return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3');
	                });

	            function urlAsRegex(url) {
	                return new RegExp('(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))', 'g');
	            }
	        }

	        function inlineAll(string, baseUrl, get) {
	            if (nothingToInline()) return Promise.resolve(string);

	            return Promise.resolve(string)
	                .then(readUrls)
	                .then(function (urls) {
	                    var done = Promise.resolve(string);
	                    urls.forEach(function (url) {
	                        done = done.then(function (string) {
	                            return inline(string, url, baseUrl, get);
	                        });
	                    });
	                    return done;
	                });

	            function nothingToInline() {
	                return !shouldProcess(string);
	            }
	        }
	    }

	    function newFontFaces() {
	        return {
	            resolveAll: resolveAll,
	            impl: {
	                readAll: readAll
	            }
	        };

	        function resolveAll() {
	            return readAll(document)
	                .then(function (webFonts) {
	                    return Promise.all(
	                        webFonts.map(function (webFont) {
	                            return webFont.resolve();
	                        })
	                    );
	                })
	                .then(function (cssStrings) {
	                    return cssStrings.join('\n');
	                });
	        }

	        function readAll() {
	            return Promise.resolve(util.asArray(document.styleSheets))
	                .then(getCssRules)
	                .then(selectWebFontRules)
	                .then(function (rules) {
	                    return rules.map(newWebFont);
	                });

	            function selectWebFontRules(cssRules) {
	                return cssRules
	                    .filter(function (rule) {
	                        return rule.type === CSSRule.FONT_FACE_RULE;
	                    })
	                    .filter(function (rule) {
	                        return inliner.shouldProcess(rule.style.getPropertyValue('src'));
	                    });
	            }

	            function getCssRules(styleSheets) {
	                var cssRules = [];
	                styleSheets.forEach(function (sheet) {
	                    try {
	                        util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
	                    } catch (e) {
	                        console.log('Error while reading CSS rules from ' + sheet.href, e.toString());
	                    }
	                });
	                return cssRules;
	            }

	            function newWebFont(webFontRule) {
	                return {
	                    resolve: function resolve() {
	                        var baseUrl = (webFontRule.parentStyleSheet || {}).href;
	                        return inliner.inlineAll(webFontRule.cssText, baseUrl);
	                    },
	                    src: function () {
	                        return webFontRule.style.getPropertyValue('src');
	                    }
	                };
	            }
	        }
	    }

	    function newImages() {
	        return {
	            inlineAll: inlineAll,
	            impl: {
	                newImage: newImage
	            }
	        };

	        function newImage(element) {
	            return {
	                inline: inline
	            };

	            function inline(get) {
	                if (util.isDataUrl(element.src)) return Promise.resolve();

	                return Promise.resolve(element.src)
	                    .then(get || util.getAndEncode)
	                    .then(function (data) {
	                        return util.dataAsUrl(data, util.mimeType(element.src));
	                    })
	                    .then(function (dataUrl) {
	                        return new Promise(function (resolve, reject) {
	                            element.onload = resolve;
	                            element.onerror = reject;
	                            element.src = dataUrl;
	                        });
	                    });
	            }
	        }

	        function inlineAll(node) {
	            if (!(node instanceof Element)) return Promise.resolve(node);

	            return inlineBackground(node)
	                .then(function () {
	                    if (node instanceof HTMLImageElement)
	                        return newImage(node).inline();
	                    else
	                        return Promise.all(
	                            util.asArray(node.childNodes).map(function (child) {
	                                return inlineAll(child);
	                            })
	                        );
	                });

	            function inlineBackground(node) {
	                var background = node.style.getPropertyValue('background');

	                if (!background) return Promise.resolve(node);

	                return inliner.inlineAll(background)
	                    .then(function (inlined) {
	                        node.style.setProperty(
	                            'background',
	                            inlined,
	                            node.style.getPropertyPriority('background')
	                        );
	                    })
	                    .then(function () {
	                        return node;
	                    });
	            }
	        }
	    }
	})(this);


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
	 * A saveAs() FileSaver implementation.
	 * 1.3.2
	 * 2016-06-16 18:25:19
	 *
	 * By Eli Grey, http://eligrey.com
	 * License: MIT
	 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
	 */

	/*global self */
	/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

	/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

	var saveAs = saveAs || (function(view) {
		"use strict";
		// IE <10 is explicitly unsupported
		if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
			return;
		}
		var
			  doc = view.document
			  // only get URL when necessary in case Blob.js hasn't overridden it yet
			, get_URL = function() {
				return view.URL || view.webkitURL || view;
			}
			, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
			, can_use_save_link = "download" in save_link
			, click = function(node) {
				var event = new MouseEvent("click");
				node.dispatchEvent(event);
			}
			, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
			, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
			, throw_outside = function(ex) {
				(view.setImmediate || view.setTimeout)(function() {
					throw ex;
				}, 0);
			}
			, force_saveable_type = "application/octet-stream"
			// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
			, arbitrary_revoke_timeout = 1000 * 40 // in ms
			, revoke = function(file) {
				var revoker = function() {
					if (typeof file === "string") { // file is an object URL
						get_URL().revokeObjectURL(file);
					} else { // file is a File
						file.remove();
					}
				};
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
			, dispatch = function(filesaver, event_types, event) {
				event_types = [].concat(event_types);
				var i = event_types.length;
				while (i--) {
					var listener = filesaver["on" + event_types[i]];
					if (typeof listener === "function") {
						try {
							listener.call(filesaver, event || filesaver);
						} catch (ex) {
							throw_outside(ex);
						}
					}
				}
			}
			, auto_bom = function(blob) {
				// prepend BOM for UTF-8 XML and text/* types (including HTML)
				// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
				if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
					return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
				}
				return blob;
			}
			, FileSaver = function(blob, name, no_auto_bom) {
				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				// First try a.download, then web filesystem, then object URLs
				var
					  filesaver = this
					, type = blob.type
					, force = type === force_saveable_type
					, object_url
					, dispatch_all = function() {
						dispatch(filesaver, "writestart progress write writeend".split(" "));
					}
					// on any filesys errors revert to saving with object URLs
					, fs_error = function() {
						if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
							// Safari doesn't allow downloading of blob urls
							var reader = new FileReader();
							reader.onloadend = function() {
								var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
								var popup = view.open(url, '_blank');
								if(!popup) view.location.href = url;
								url=undefined; // release reference before dispatching
								filesaver.readyState = filesaver.DONE;
								dispatch_all();
							};
							reader.readAsDataURL(blob);
							filesaver.readyState = filesaver.INIT;
							return;
						}
						// don't create more object URLs than needed
						if (!object_url) {
							object_url = get_URL().createObjectURL(blob);
						}
						if (force) {
							view.location.href = object_url;
						} else {
							var opened = view.open(object_url, "_blank");
							if (!opened) {
								// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
								view.location.href = object_url;
							}
						}
						filesaver.readyState = filesaver.DONE;
						dispatch_all();
						revoke(object_url);
					}
				;
				filesaver.readyState = filesaver.INIT;

				if (can_use_save_link) {
					object_url = get_URL().createObjectURL(blob);
					setTimeout(function() {
						save_link.href = object_url;
						save_link.download = name;
						click(save_link);
						dispatch_all();
						revoke(object_url);
						filesaver.readyState = filesaver.DONE;
					});
					return;
				}

				fs_error();
			}
			, FS_proto = FileSaver.prototype
			, saveAs = function(blob, name, no_auto_bom) {
				return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
			}
		;
		// IE 10+ (native saveAs)
		if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
			return function(blob, name, no_auto_bom) {
				name = name || blob.name || "download";

				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				return navigator.msSaveOrOpenBlob(blob, name);
			};
		}

		FS_proto.abort = function(){};
		FS_proto.readyState = FS_proto.INIT = 0;
		FS_proto.WRITING = 1;
		FS_proto.DONE = 2;

		FS_proto.error =
		FS_proto.onwritestart =
		FS_proto.onprogress =
		FS_proto.onwrite =
		FS_proto.onabort =
		FS_proto.onerror =
		FS_proto.onwriteend =
			null;

		return saveAs;
	}(
		   typeof self !== "undefined" && self
		|| typeof window !== "undefined" && window
		|| this.content
	));
	// `self` is undefined in Firefox for Android content script context
	// while `this` is nsIContentFrameMessageManager
	// with an attribute `content` that corresponds to the window

	if (typeof module !== "undefined" && module.exports) {
	  module.exports.saveAs = saveAs;
	} else if (("function" !== "undefined" && __webpack_require__(130) !== null) && (__webpack_require__(131) !== null)) {
	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    return saveAs;
	  }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}


/***/ },
/* 130 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 131 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _config = __webpack_require__(118);

	var _config2 = _interopRequireDefault(_config);

	var _Point = __webpack_require__(133);

	var _Point2 = _interopRequireDefault(_Point);

	var _PointCloud = __webpack_require__(134);

	var _PointCloud2 = _interopRequireDefault(_PointCloud);

	var _Util = __webpack_require__(135);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PDollarRecognizer = function () {
	    function PDollarRecognizer() {
	        (0, _classCallCheck3.default)(this, PDollarRecognizer);

	        this.config = _config2.default.inputType;
	        var NumPointClouds = 4;
	        this.PointClouds = new Array(NumPointClouds);
	        this.subPoints = new Array(4);
	        this.PointClouds[0] = new _PointCloud2.default({ name: "31", points: new Array(new _Point2.default(100, 0, 1), new _Point2.default(0, 100, 1), new _Point2.default(100, 0, 2), new _Point2.default(200, 100, 2), new _Point2.default(100, 0, 3), new _Point2.default(0, 300, 3)) });
	        this.PointClouds[1] = new _PointCloud2.default({ name: "41", points: new Array(new _Point2.default(100, 0, 1), new _Point2.default(0, 300, 1), new _Point2.default(0, 200, 2), new _Point2.default(100, 300, 2), new _Point2.default(200, 200, 2)) });
	        this.PointClouds[2] = new _PointCloud2.default({ name: "20", points: new Array(new _Point2.default(0, 0, 1), new _Point2.default(100, 100, 1), new _Point2.default(200, 200, 1), new _Point2.default(200, 0, 2), new _Point2.default(100, 100, 2), new _Point2.default(0, 200, 2)) });
	        var pai = 100 * Math.sqrt(2);
	        this.PointClouds[3] = new _PointCloud2.default({ name: "10", points: new Array(new _Point2.default(0, 100, 1), new _Point2.default(100 - pai, 100 + pai, 1), new _Point2.default(100, 200, 1), new _Point2.default(100 + pai, 100 + pai, 1), new _Point2.default(200, 100, 1), new _Point2.default(100 + pai, 100 - pai, 1), new _Point2.default(100, 0, 1), new _Point2.default(100 - pai, 100 - pai, 1)) });

	        this.subPoints[0] = new _PointCloud2.default({ name: "01", points: new Array(new _Point2.default(100, 0, 1), new _Point2.default(0, 100, 1)) });
	        this.subPoints[1] = new _PointCloud2.default({ name: "02", points: new Array(new _Point2.default(0, 0, 1), new _Point2.default(100, 100, 1)) });
	        this.subPoints[2] = new _PointCloud2.default({ name: "03", points: new Array(new _Point2.default(0, 0, 1), new _Point2.default(0, 100, 1)) });
	        this.subPoints[3] = new _PointCloud2.default({ name: "circle", points: new Array(new _Point2.default(0, 100, 1), new _Point2.default(100 - pai, 100 + pai, 1), new _Point2.default(100, 200, 1), new _Point2.default(100 + pai, 100 + pai, 1), new _Point2.default(200, 100, 1), new _Point2.default(100 + pai, 100 - pai, 1), new _Point2.default(100, 0, 1), new _Point2.default(100 - pai, 100 - pai, 1)) });
	    }

	    (0, _createClass3.default)(PDollarRecognizer, [{
	        key: "Recognize",
	        value: function Recognize(points) {
	            var _this = this;

	            var filteredPoints = this.filterSignleEdge(points);
	            var clouds = this.splitCloudBySpaceRange(filteredPoints);
	            var results = new Array();
	            clouds.forEach(function (cloud) {
	                var result = "";

	                if (cloud.length < 2) {
	                    result = {
	                        Score: 0,
	                        Name: "无效序列",
	                        type: "0",
	                        path: cloud,
	                        domPath: "",
	                        label: ""
	                    };
	                } else {
	                    result = _this.recognizeSingle(cloud);
	                }

	                results.push(result);
	            });
	            return results;
	        }
	    }, {
	        key: "recognizeSingle",
	        value: function recognizeSingle(points) {
	            var pointCloud = new _PointCloud2.default({ name: "未知", points: points }).points;
	            var b = +Infinity;
	            var u = -1;
	            for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
	            {
	                var d = _Util2.default.getInstance().GreedyCloudMatch(pointCloud, this.PointClouds[i]);
	                if (d < b) {
	                    b = d; // best (least) distance
	                    u = i; // point-cloud
	                }
	            }
	            var result = u === -1 ? { Name: "No match.", Score: 0, type: "0" } : Object.assign({ path: points, type: "2" }, { Name: this.PointClouds[u].name, Score: Math.max((2.5 - b) / 2.5, 0) });
	            return result;
	        }
	    }, {
	        key: "recognizeSingleEdge",
	        value: function recognizeSingleEdge(points) {
	            var pointCloud = new _PointCloud2.default({ name: "未知", points: points }).points;
	            var b = +Infinity;
	            var u = -1;
	            for (var i = 0; i < this.subPoints.length; i++) // for each point-cloud template
	            {
	                var d = _Util2.default.getInstance().GreedyCloudMatch(pointCloud, this.subPoints[i]);
	                if (d < b) {
	                    b = d; // best (least) distance
	                    u = i; // point-cloud
	                }
	            }
	            var result = u == -1 ? { Name: "No match.", Score: 0 } : Object.assign({ path: this.subPoints[u].originPoints }, { Name: this.subPoints[u].name, Score: Math.max((2.5 - b) / 2.5, 0.0) });
	            return result;
	        }
	    }, {
	        key: "filterSignleEdge",
	        value: function filterSignleEdge(points) {
	            var _this2 = this;

	            var edges = this.splitByEdge(points);
	            var results = edges.filter(function (item) {
	                var result = _this2.recognizeSingleEdge(item);
	                if (result.Score > 0.001) {
	                    return true;
	                }
	                return false;
	            });
	            return this.mergeEdgesToCLouds(results);
	        }
	    }, {
	        key: "mergeEdgesToCLouds",
	        value: function mergeEdgesToCLouds(cloudsByEdge) {
	            var clouds = cloudsByEdge.reduce(function (prev, curr) {
	                return prev.concat(curr);
	            }, []);
	            return clouds;
	        }
	    }, {
	        key: "splitCloudBySpaceRange",
	        value: function splitCloudBySpaceRange(points) {
	            var _this3 = this;

	            var edges = this.splitByEdge(points);

	            var clouds = new Array();
	            var index = 0;
	            edges.reduce(function (prev, curr) {
	                if (!prev) {
	                    clouds[index] = new Array();
	                    clouds[index].push(curr);
	                    return curr;
	                }
	                var canMerged = false;
	                clouds[index].forEach(function (item) {
	                    if (_Util2.default.getInstance().isConnected(item, curr)) {
	                        canMerged = true;
	                    }
	                });

	                if (canMerged) {
	                    clouds[index].push(curr);
	                } else {
	                    index++;
	                    clouds[index] = new Array();
	                    clouds[index].push(curr);
	                }
	                return curr;
	            }, null);
	            var result = clouds.map(function (item) {
	                return _this3.mergeEdgesToCLouds(item);
	            });
	            return result;
	        }
	    }, {
	        key: "splitByEdge",
	        value: function splitByEdge(points) {
	            var edges = new Array();
	            var index = 0;
	            points.reduce(function (prev, next) {
	                if (!prev) {
	                    edges[index] = new Array();
	                    edges[index].push(next);
	                    return next;
	                }

	                if (prev.ID === next.ID) {
	                    edges[index].push(next);
	                } else {
	                    index++;
	                    edges[index] = new Array();
	                    edges[index].push(next);
	                }
	                return next;
	            }, null);
	            return edges;
	        }
	    }]);
	    return PDollarRecognizer;
	}();

	exports.default = PDollarRecognizer;

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Point = function Point(x, y, id) {
	    (0, _classCallCheck3.default)(this, Point);

	    this.X = x;
	    this.Y = y;
	    this.ID = id;
	};

	exports.default = Point;

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Point = __webpack_require__(133);

	var _Point2 = _interopRequireDefault(_Point);

	var _Util = __webpack_require__(135);

	var _Util2 = _interopRequireDefault(_Util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var PointCloud = function () {
	    function PointCloud(args) {
	        (0, _classCallCheck3.default)(this, PointCloud);

	        this.name = args.name;
	        this.originPoints = args.points;
	        this.points = null;
	        this.NumPoints = 32;
	        this.originPoint = new _Point2.default(0, 0, 0);
	        this.util = _Util2.default.getInstance();
	        this._dealPoints();
	    }

	    (0, _createClass3.default)(PointCloud, [{
	        key: "_dealPoints",
	        value: function _dealPoints() {
	            var points = null;
	            if (this.originPoints) {
	                points = this.Resample(this.originPoints, this.NumPoints);
	                points = this.Scale(points);
	                points = this.TranslateTo(points, this.originPoint);
	                this.points = points;
	            }
	        }
	    }, {
	        key: "Centroid",
	        value: function Centroid(points) // 中心点 平均值
	        {
	            if (!points) {
	                points = this.originPoints;
	            }
	            var x = 0.0;
	            var y = 0.0;
	            for (var i = 0; i < points.length; i++) {
	                x += points[i].X;
	                y += points[i].Y;
	            }
	            x /= points.length;
	            y /= points.length;
	            return new _Point2.default(x, y, 0);
	        }
	    }, {
	        key: "Resample",
	        value: function Resample(points, n) //调整points的分布，尽量以相同间隔分布
	        {
	            var I = this.util.PathLength(points) / (n - 1); // interval distance
	            var D = 0.0;
	            var newpoints = new Array(points[0]);
	            for (var i = 1; i < points.length; i++) {
	                if (points[i].ID == points[i - 1].ID) {
	                    var d = this.util.Distance(points[i - 1], points[i]);
	                    if (D + d >= I) {
	                        var qx = points[i - 1].X + (I - D) / d * (points[i].X - points[i - 1].X);
	                        var qy = points[i - 1].Y + (I - D) / d * (points[i].Y - points[i - 1].Y);
	                        var q = new _Point2.default(qx, qy, points[i].ID);
	                        newpoints[newpoints.length] = q; // append new point 'q'
	                        points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i insert q
	                        D = 0.0;
	                    } else D += d;
	                }
	            }
	            if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
	                newpoints[newpoints.length] = new _Point2.default(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
	            return newpoints;
	        }
	    }, {
	        key: "Scale",
	        value: function Scale(points) // 计算points scale 计算最大坐标差 压缩坐标值
	        {
	            var minX = +Infinity,
	                maxX = -Infinity,
	                minY = +Infinity,
	                maxY = -Infinity;
	            for (var i = 0; i < points.length; i++) {
	                minX = Math.min(minX, points[i].X);
	                minY = Math.min(minY, points[i].Y);
	                maxX = Math.max(maxX, points[i].X);
	                maxY = Math.max(maxY, points[i].Y);
	            }

	            var size = Math.max(maxX - minX, maxY - minY);
	            var newpoints = new Array();
	            for (var i = 0; i < points.length; i++) {
	                var qx = (points[i].X - minX) / size;
	                var qy = (points[i].Y - minY) / size;
	                newpoints[newpoints.length] = new _Point2.default(qx, qy, points[i].ID);
	            }
	            return newpoints;
	        }
	    }, {
	        key: "TranslateTo",
	        value: function TranslateTo(points, pt) // translates points' centroid //去中心点 pt不知是啥
	        {
	            var c = this.Centroid(points);
	            var newpoints = new Array();
	            for (var i = 0; i < points.length; i++) {
	                var qx = points[i].X + pt.X - c.X;
	                var qy = points[i].Y + pt.Y - c.Y;
	                newpoints[newpoints.length] = new _Point2.default(qx, qy, points[i].ID);
	            }
	            return newpoints;
	        }
	    }]);
	    return PointCloud;
	}();

	exports.default = PointCloud;

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Util = function () {
	    function Util() {
	        (0, _classCallCheck3.default)(this, Util);
	    }

	    (0, _createClass3.default)(Util, [{
	        key: "GreedyCloudMatch",
	        value: function GreedyCloudMatch(points, P) {
	            var e = 0.50;
	            var step = Math.floor(Math.pow(points.length, 1 - e));
	            var min = +Infinity;
	            for (var i = 0; i < points.length; i += step) {
	                var d1 = this.CloudDistance(points, P.points, i);
	                var d2 = this.CloudDistance(P.points, points, i);
	                min = Math.min(min, Math.min(d1, d2)); // min3
	            }
	            return min;
	        }
	    }, {
	        key: "isConnected",
	        value: function isConnected(points1, points2) {
	            var rule = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	            var radius1 = this.getRange(points1).outerRadius;
	            var radius2 = this.getRange(points2).outerRadius;
	            var minDis = this.cloudMinDistance(points1, points2);
	            var minRadius = Math.min(radius1, radius2);

	            if (minRadius * rule > minDis) {
	                return true;
	            }
	            return false;
	        }
	    }, {
	        key: "CloudDistance",
	        value: function CloudDistance(pts1, pts2, start) {
	            var matched = new Array(pts1.length); // pts1.length == pts2.length
	            for (var k = 0; k < pts1.length; k++) {
	                matched[k] = false;
	            }var sum = 0;
	            var i = start;
	            do {
	                var index = -1;
	                var min = +Infinity;
	                for (var j = 0; j < matched.length; j++) {
	                    if (!matched[j]) {
	                        var d = this.Distance(pts1[i], pts2[j]);
	                        if (d < min) {
	                            min = d;
	                            index = j;
	                        }
	                    }
	                }
	                matched[index] = true;
	                var weight = 1 - (i - start + pts1.length) % pts1.length / pts1.length;
	                sum += weight * min;
	                i = (i + 1) % pts1.length;
	            } while (i != start);
	            return sum;
	        }
	    }, {
	        key: "cloudMinDistance",
	        value: function cloudMinDistance(points1, points2) {
	            var _this = this;

	            var minDis = +Infinity;
	            points1.forEach(function (preItem) {
	                points2.forEach(function (backItem) {
	                    if (_this.Distance(preItem, backItem) < minDis) {
	                        minDis = _this.Distance(preItem, backItem);
	                    }
	                });
	            });
	            return minDis;
	        }
	    }, {
	        key: "getRange",
	        value: function getRange(points) {
	            var maxDistance = 0;
	            var minDistance = +Infinity;
	            var maxDisPointPair = null;
	            var minDisPointPair = null;
	            var locationRange = this.getLocationRange(points);
	            var length = points.length;

	            for (var index = 0; index < length - 1; index++) {
	                for (var next = index + 1; next < length; next++) {
	                    var curDistance = this.Distance(points[index], points[next]);
	                    if (curDistance > maxDistance) {
	                        maxDistance = curDistance;
	                        maxDisPointPair = [points[index], points[next]];
	                    }
	                    if (curDistance < minDistance) {
	                        minDistance = curDistance;
	                        minDisPointPair = [points[index], points[next]];
	                    }
	                }
	            }

	            if (!maxDisPointPair && !minDisPointPair) {
	                return null;
	            } else {
	                return {
	                    "outerRadius": maxDistance / 2,
	                    "innerRadius": minDistance / 2,
	                    "innerCentroid": this.centroidOfTwoPoint(minDisPointPair[0], minDisPointPair[1]),
	                    "outerCentroid": this.centroidOfTwoPoint(maxDisPointPair[0], maxDisPointPair[1]),
	                    "startX": locationRange.startX,
	                    "startY": locationRange.startY,
	                    "width": locationRange.width,
	                    "height": locationRange.height
	                };
	            }

	            return Math.max(maxX - minX, maxY - minY) / 2;
	        }
	    }, {
	        key: "getLocationRange",
	        value: function getLocationRange(points) {
	            if (!points || points < 2) {
	                return null;
	            }

	            var startX = +Infinity;
	            var startY = +Infinity;
	            var endX = -Infinity;
	            var endY = -Infinity;
	            var length = points.length;

	            for (var index = 0; index < length; index++) {
	                if (startX > points[index].X) {
	                    startX = points[index].X;
	                }

	                if (startY > points[index].Y) {
	                    startY = points[index].Y;
	                }

	                if (endX < points[index].X) {
	                    endX = points[index].X;
	                }

	                if (endY < points[index].Y) {
	                    endY = points[index].Y;
	                }
	            }

	            return {
	                startX: startX,
	                startY: startY,
	                "width": Math.abs(endX - startX),
	                "height": Math.abs(endY - startY)
	            };
	        }
	    }, {
	        key: "PathDistance",
	        value: function PathDistance(pts1, pts2) // average distance between corresponding points in two paths // 两个points平均偏移距离
	        {
	            var d = 0.0;
	            for (var i = 0; i < pts1.length; i++) {
	                // assumes pts1.length == pts2.length
	                d += this.Distance(pts1[i], pts2[i]);
	            }return d / pts1.length;
	        }
	    }, {
	        key: "PathLength",
	        value: function PathLength(points) // length traversed by a point path //相同ID的前后两个点的距离和
	        {
	            var d = 0.0;
	            for (var i = 1; i < points.length; i++) {
	                if (points[i].ID == points[i - 1].ID) d += this.Distance(points[i - 1], points[i]);
	            }
	            return d;
	        }
	    }, {
	        key: "Distance",
	        value: function Distance(p1, p2) // Euclidean distance between two points
	        {
	            var dx = p2.X - p1.X;
	            var dy = p2.Y - p1.Y;
	            return Math.sqrt(dx * dx + dy * dy);
	        }
	    }, {
	        key: "centroidOfTwoPoint",
	        value: function centroidOfTwoPoint(p1, p2) {
	            var dx = (p2.X + p1.X) / 2;
	            var dy = (p2.Y + p1.Y) / 2;
	            return { "x": dx, "y": dy };
	        }
	    }, {
	        key: "rand",
	        value: function rand(low, high) {
	            return Math.floor((high - low + 1) * Math.random()) + low;
	        }
	    }, {
	        key: "round",
	        value: function round(n, d) {
	            d = Math.pow(10, d);
	            return Math.round(n * d) / d;
	        }
	    }], [{
	        key: "getInstance",
	        value: function getInstance() {
	            if (!Util._instance) {
	                Util._instance = new Util();
	            }
	            return Util._instance;
	        }
	    }]);
	    return Util;
	}();

	Util._instance = null;
	exports.default = Util;

/***/ },
/* 136 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    "key-search": {
	        "identification": "#spulist-grid",
	        "webConfig": {
	            "listDOMSelector": ".m-grid",
	            "itemSelectors": [".grid-container > .grid-item", ".grid-container .blank-row .grid-item"],
	            "itemImgSelector": ".grid-panel > .img-box > .img-a",
	            "itemTitleSelector": ".grid-panel > .info-cont > .title-row > .product-title"
	        }
	    },
	    "fuzzy-search": {
	        "identification": "#mainsrp-itemlist",
	        "webConfig": {
	            "listDOMSelector": ".m-itemlist",
	            "itemSelectors": [".m-itemlist .items > .item", ".m-itemlist .items > .grid > .item"],
	            "itemImgSelector": ".pic-box > .pic-box-inner > .pic > .pic-link",
	            "itemTitleSelector": ".ctx-box > .title > a"
	        }
	    }
	};

/***/ },
/* 137 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "background.html";

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 143 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvMTI4LnBuZyI7"

/***/ },
/* 144 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvMTYucG5nIjs="

/***/ },
/* 145 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvMzIucG5nIjs="

/***/ },
/* 146 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvNjQucG5nIjs="

/***/ },
/* 147 */
/***/ function(module, exports) {

	module.exports = "data:image/jpeg;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvYmFja2dyb3VuZC5qcGciOw=="

/***/ },
/* 148 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArICIvaWNvbnMvaXRlbS5wbmciOw=="

/***/ }
]);