var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/retry/lib/retry_operation.js
var require_retry_operation = __commonJS({
  "node_modules/retry/lib/retry_operation.js"(exports, module) {
    function RetryOperation(timeouts, options) {
      if (typeof options === "boolean") {
        options = { forever: options };
      }
      this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
      this._timeouts = timeouts;
      this._options = options || {};
      this._maxRetryTime = options && options.maxRetryTime || Infinity;
      this._fn = null;
      this._errors = [];
      this._attempts = 1;
      this._operationTimeout = null;
      this._operationTimeoutCb = null;
      this._timeout = null;
      this._operationStart = null;
      this._timer = null;
      if (this._options.forever) {
        this._cachedTimeouts = this._timeouts.slice(0);
      }
    }
    module.exports = RetryOperation;
    RetryOperation.prototype.reset = function() {
      this._attempts = 1;
      this._timeouts = this._originalTimeouts.slice(0);
    };
    RetryOperation.prototype.stop = function() {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._timeouts = [];
      this._cachedTimeouts = null;
    };
    RetryOperation.prototype.retry = function(err) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      if (!err) {
        return false;
      }
      var currentTime = (/* @__PURE__ */ new Date()).getTime();
      if (err && currentTime - this._operationStart >= this._maxRetryTime) {
        this._errors.push(err);
        this._errors.unshift(new Error("RetryOperation timeout occurred"));
        return false;
      }
      this._errors.push(err);
      var timeout = this._timeouts.shift();
      if (timeout === void 0) {
        if (this._cachedTimeouts) {
          this._errors.splice(0, this._errors.length - 1);
          timeout = this._cachedTimeouts.slice(-1);
        } else {
          return false;
        }
      }
      var self2 = this;
      this._timer = setTimeout(function() {
        self2._attempts++;
        if (self2._operationTimeoutCb) {
          self2._timeout = setTimeout(function() {
            self2._operationTimeoutCb(self2._attempts);
          }, self2._operationTimeout);
          if (self2._options.unref) {
            self2._timeout.unref();
          }
        }
        self2._fn(self2._attempts);
      }, timeout);
      if (this._options.unref) {
        this._timer.unref();
      }
      return true;
    };
    RetryOperation.prototype.attempt = function(fn, timeoutOps) {
      this._fn = fn;
      if (timeoutOps) {
        if (timeoutOps.timeout) {
          this._operationTimeout = timeoutOps.timeout;
        }
        if (timeoutOps.cb) {
          this._operationTimeoutCb = timeoutOps.cb;
        }
      }
      var self2 = this;
      if (this._operationTimeoutCb) {
        this._timeout = setTimeout(function() {
          self2._operationTimeoutCb();
        }, self2._operationTimeout);
      }
      this._operationStart = (/* @__PURE__ */ new Date()).getTime();
      this._fn(this._attempts);
    };
    RetryOperation.prototype.try = function(fn) {
      console.log("Using RetryOperation.try() is deprecated");
      this.attempt(fn);
    };
    RetryOperation.prototype.start = function(fn) {
      console.log("Using RetryOperation.start() is deprecated");
      this.attempt(fn);
    };
    RetryOperation.prototype.start = RetryOperation.prototype.try;
    RetryOperation.prototype.errors = function() {
      return this._errors;
    };
    RetryOperation.prototype.attempts = function() {
      return this._attempts;
    };
    RetryOperation.prototype.mainError = function() {
      if (this._errors.length === 0) {
        return null;
      }
      var counts = {};
      var mainError = null;
      var mainErrorCount = 0;
      for (var i = 0; i < this._errors.length; i++) {
        var error = this._errors[i];
        var message = error.message;
        var count = (counts[message] || 0) + 1;
        counts[message] = count;
        if (count >= mainErrorCount) {
          mainError = error;
          mainErrorCount = count;
        }
      }
      return mainError;
    };
  }
});

// node_modules/retry/lib/retry.js
var require_retry = __commonJS({
  "node_modules/retry/lib/retry.js"(exports) {
    var RetryOperation = require_retry_operation();
    exports.operation = function(options) {
      var timeouts = exports.timeouts(options);
      return new RetryOperation(timeouts, {
        forever: options && (options.forever || options.retries === Infinity),
        unref: options && options.unref,
        maxRetryTime: options && options.maxRetryTime
      });
    };
    exports.timeouts = function(options) {
      if (options instanceof Array) {
        return [].concat(options);
      }
      var opts = {
        retries: 10,
        factor: 2,
        minTimeout: 1 * 1e3,
        maxTimeout: Infinity,
        randomize: false
      };
      for (var key in options) {
        opts[key] = options[key];
      }
      if (opts.minTimeout > opts.maxTimeout) {
        throw new Error("minTimeout is greater than maxTimeout");
      }
      var timeouts = [];
      for (var i = 0; i < opts.retries; i++) {
        timeouts.push(this.createTimeout(i, opts));
      }
      if (options && options.forever && !timeouts.length) {
        timeouts.push(this.createTimeout(i, opts));
      }
      timeouts.sort(function(a, b) {
        return a - b;
      });
      return timeouts;
    };
    exports.createTimeout = function(attempt, opts) {
      var random = opts.randomize ? Math.random() + 1 : 1;
      var timeout = Math.round(random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt));
      timeout = Math.min(timeout, opts.maxTimeout);
      return timeout;
    };
    exports.wrap = function(obj, options, methods2) {
      if (options instanceof Array) {
        methods2 = options;
        options = null;
      }
      if (!methods2) {
        methods2 = [];
        for (var key in obj) {
          if (typeof obj[key] === "function") {
            methods2.push(key);
          }
        }
      }
      for (var i = 0; i < methods2.length; i++) {
        var method = methods2[i];
        var original = obj[method];
        obj[method] = function retryWrapper(original2) {
          var op = exports.operation(options);
          var args = Array.prototype.slice.call(arguments, 1);
          var callback = args.pop();
          args.push(function(err) {
            if (op.retry(err)) {
              return;
            }
            if (err) {
              arguments[0] = op.mainError();
            }
            callback.apply(this, arguments);
          });
          op.attempt(function() {
            original2.apply(obj, args);
          });
        }.bind(obj, original);
        obj[method].options = options;
      }
    };
  }
});

// node_modules/retry/index.js
var require_retry2 = __commonJS({
  "node_modules/retry/index.js"(exports, module) {
    module.exports = require_retry();
  }
});

// node_modules/p-retry/index.js
var require_p_retry = __commonJS({
  "node_modules/p-retry/index.js"(exports, module) {
    "use strict";
    var retry = require_retry2();
    var networkErrorMsgs = [
      "Failed to fetch",
      // Chrome
      "NetworkError when attempting to fetch resource.",
      // Firefox
      "The Internet connection appears to be offline.",
      // Safari
      "Network request failed"
      // `cross-fetch`
    ];
    var AbortError = class extends Error {
      constructor(message) {
        super();
        if (message instanceof Error) {
          this.originalError = message;
          ({ message } = message);
        } else {
          this.originalError = new Error(message);
          this.originalError.stack = this.stack;
        }
        this.name = "AbortError";
        this.message = message;
      }
    };
    var decorateErrorWithCounts = (error, attemptNumber, options) => {
      const retriesLeft = options.retries - (attemptNumber - 1);
      error.attemptNumber = attemptNumber;
      error.retriesLeft = retriesLeft;
      return error;
    };
    var isNetworkError = (errorMessage) => networkErrorMsgs.includes(errorMessage);
    var pRetry4 = (input, options) => new Promise((resolve, reject) => {
      options = {
        onFailedAttempt: () => {
        },
        retries: 10,
        ...options
      };
      const operation = retry.operation(options);
      operation.attempt(async (attemptNumber) => {
        try {
          resolve(await input(attemptNumber));
        } catch (error) {
          if (!(error instanceof Error)) {
            reject(new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`));
            return;
          }
          if (error instanceof AbortError) {
            operation.stop();
            reject(error.originalError);
          } else if (error instanceof TypeError && !isNetworkError(error.message)) {
            operation.stop();
            reject(error);
          } else {
            decorateErrorWithCounts(error, attemptNumber, options);
            try {
              await options.onFailedAttempt(error);
            } catch (error2) {
              reject(error2);
              return;
            }
            if (!operation.retry(error)) {
              reject(operation.mainError());
            }
          }
        }
      });
    });
    module.exports = pRetry4;
    module.exports.default = pRetry4;
    module.exports.AbortError = AbortError;
  }
});

// node_modules/uuid/dist/esm-browser/regex.js
var regex_default;
var init_regex = __esm({
  "node_modules/uuid/dist/esm-browser/regex.js"() {
    regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
  }
});

// node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default;
var init_validate = __esm({
  "node_modules/uuid/dist/esm-browser/validate.js"() {
    init_regex();
    validate_default = validate;
  }
});

// node_modules/uuid/dist/esm-browser/stringify.js
function unsafeStringify(arr2, offset = 0) {
  return (byteToHex[arr2[offset + 0]] + byteToHex[arr2[offset + 1]] + byteToHex[arr2[offset + 2]] + byteToHex[arr2[offset + 3]] + "-" + byteToHex[arr2[offset + 4]] + byteToHex[arr2[offset + 5]] + "-" + byteToHex[arr2[offset + 6]] + byteToHex[arr2[offset + 7]] + "-" + byteToHex[arr2[offset + 8]] + byteToHex[arr2[offset + 9]] + "-" + byteToHex[arr2[offset + 10]] + byteToHex[arr2[offset + 11]] + byteToHex[arr2[offset + 12]] + byteToHex[arr2[offset + 13]] + byteToHex[arr2[offset + 14]] + byteToHex[arr2[offset + 15]]).toLowerCase();
}
var byteToHex, i;
var init_stringify = __esm({
  "node_modules/uuid/dist/esm-browser/stringify.js"() {
    byteToHex = [];
    for (i = 0; i < 256; ++i) {
      byteToHex.push((i + 256).toString(16).slice(1));
    }
  }
});

// node_modules/uuid/dist/esm-browser/rng.js
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}
var getRandomValues, rnds8;
var init_rng = __esm({
  "node_modules/uuid/dist/esm-browser/rng.js"() {
    rnds8 = new Uint8Array(16);
  }
});

// node_modules/uuid/dist/esm-browser/native.js
var randomUUID, native_default;
var init_native = __esm({
  "node_modules/uuid/dist/esm-browser/native.js"() {
    randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
    native_default = {
      randomUUID
    };
  }
});

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default;
var init_v4 = __esm({
  "node_modules/uuid/dist/esm-browser/v4.js"() {
    init_native();
    init_rng();
    init_stringify();
    v4_default = v4;
  }
});

// node_modules/uuid/dist/esm-browser/index.js
var init_esm_browser = __esm({
  "node_modules/uuid/dist/esm-browser/index.js"() {
    init_v4();
    init_validate();
  }
});

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    EventEmitter.prefixed = prefix;
    EventEmitter.EventEmitter = EventEmitter;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter;
    }
  }
});

// node_modules/p-finally/index.js
var require_p_finally = __commonJS({
  "node_modules/p-finally/index.js"(exports, module) {
    "use strict";
    module.exports = (promise, onFinally) => {
      onFinally = onFinally || (() => {
      });
      return promise.then(
        (val) => new Promise((resolve) => {
          resolve(onFinally());
        }).then(() => val),
        (err) => new Promise((resolve) => {
          resolve(onFinally());
        }).then(() => {
          throw err;
        })
      );
    };
  }
});

// node_modules/p-timeout/index.js
var require_p_timeout = __commonJS({
  "node_modules/p-timeout/index.js"(exports, module) {
    "use strict";
    var pFinally = require_p_finally();
    var TimeoutError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "TimeoutError";
      }
    };
    var pTimeout = (promise, milliseconds, fallback) => new Promise((resolve, reject) => {
      if (typeof milliseconds !== "number" || milliseconds < 0) {
        throw new TypeError("Expected `milliseconds` to be a positive number");
      }
      if (milliseconds === Infinity) {
        resolve(promise);
        return;
      }
      const timer = setTimeout(() => {
        if (typeof fallback === "function") {
          try {
            resolve(fallback());
          } catch (error) {
            reject(error);
          }
          return;
        }
        const message = typeof fallback === "string" ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
        const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message);
        if (typeof promise.cancel === "function") {
          promise.cancel();
        }
        reject(timeoutError);
      }, milliseconds);
      pFinally(
        // eslint-disable-next-line promise/prefer-await-to-then
        promise.then(resolve, reject),
        () => {
          clearTimeout(timer);
        }
      );
    });
    module.exports = pTimeout;
    module.exports.default = pTimeout;
    module.exports.TimeoutError = TimeoutError;
  }
});

// node_modules/p-queue/dist/lower-bound.js
var require_lower_bound = __commonJS({
  "node_modules/p-queue/dist/lower-bound.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function lowerBound(array, value, comparator) {
      let first = 0;
      let count = array.length;
      while (count > 0) {
        const step = count / 2 | 0;
        let it = first + step;
        if (comparator(array[it], value) <= 0) {
          first = ++it;
          count -= step + 1;
        } else {
          count = step;
        }
      }
      return first;
    }
    exports.default = lowerBound;
  }
});

// node_modules/p-queue/dist/priority-queue.js
var require_priority_queue = __commonJS({
  "node_modules/p-queue/dist/priority-queue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lower_bound_1 = require_lower_bound();
    var PriorityQueue = class {
      constructor() {
        this._queue = [];
      }
      enqueue(run, options) {
        options = Object.assign({ priority: 0 }, options);
        const element = {
          priority: options.priority,
          run
        };
        if (this.size && this._queue[this.size - 1].priority >= options.priority) {
          this._queue.push(element);
          return;
        }
        const index = lower_bound_1.default(this._queue, element, (a, b) => b.priority - a.priority);
        this._queue.splice(index, 0, element);
      }
      dequeue() {
        const item = this._queue.shift();
        return item === null || item === void 0 ? void 0 : item.run;
      }
      filter(options) {
        return this._queue.filter((element) => element.priority === options.priority).map((element) => element.run);
      }
      get size() {
        return this._queue.length;
      }
    };
    exports.default = PriorityQueue;
  }
});

// node_modules/p-queue/dist/index.js
var require_dist = __commonJS({
  "node_modules/p-queue/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventEmitter = require_eventemitter3();
    var p_timeout_1 = require_p_timeout();
    var priority_queue_1 = require_priority_queue();
    var empty = () => {
    };
    var timeoutError = new p_timeout_1.TimeoutError();
    var PQueue = class extends EventEmitter {
      constructor(options) {
        var _a, _b, _c, _d;
        super();
        this._intervalCount = 0;
        this._intervalEnd = 0;
        this._pendingCount = 0;
        this._resolveEmpty = empty;
        this._resolveIdle = empty;
        options = Object.assign({ carryoverConcurrencyCount: false, intervalCap: Infinity, interval: 0, concurrency: Infinity, autoStart: true, queueClass: priority_queue_1.default }, options);
        if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
          throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${(_b = (_a = options.intervalCap) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : ""}\` (${typeof options.intervalCap})`);
        }
        if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
          throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${(_d = (_c = options.interval) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""}\` (${typeof options.interval})`);
        }
        this._carryoverConcurrencyCount = options.carryoverConcurrencyCount;
        this._isIntervalIgnored = options.intervalCap === Infinity || options.interval === 0;
        this._intervalCap = options.intervalCap;
        this._interval = options.interval;
        this._queue = new options.queueClass();
        this._queueClass = options.queueClass;
        this.concurrency = options.concurrency;
        this._timeout = options.timeout;
        this._throwOnTimeout = options.throwOnTimeout === true;
        this._isPaused = options.autoStart === false;
      }
      get _doesIntervalAllowAnother() {
        return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
      }
      get _doesConcurrentAllowAnother() {
        return this._pendingCount < this._concurrency;
      }
      _next() {
        this._pendingCount--;
        this._tryToStartAnother();
        this.emit("next");
      }
      _resolvePromises() {
        this._resolveEmpty();
        this._resolveEmpty = empty;
        if (this._pendingCount === 0) {
          this._resolveIdle();
          this._resolveIdle = empty;
          this.emit("idle");
        }
      }
      _onResumeInterval() {
        this._onInterval();
        this._initializeIntervalIfNeeded();
        this._timeoutId = void 0;
      }
      _isIntervalPaused() {
        const now = Date.now();
        if (this._intervalId === void 0) {
          const delay = this._intervalEnd - now;
          if (delay < 0) {
            this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
          } else {
            if (this._timeoutId === void 0) {
              this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, delay);
            }
            return true;
          }
        }
        return false;
      }
      _tryToStartAnother() {
        if (this._queue.size === 0) {
          if (this._intervalId) {
            clearInterval(this._intervalId);
          }
          this._intervalId = void 0;
          this._resolvePromises();
          return false;
        }
        if (!this._isPaused) {
          const canInitializeInterval = !this._isIntervalPaused();
          if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
            const job = this._queue.dequeue();
            if (!job) {
              return false;
            }
            this.emit("active");
            job();
            if (canInitializeInterval) {
              this._initializeIntervalIfNeeded();
            }
            return true;
          }
        }
        return false;
      }
      _initializeIntervalIfNeeded() {
        if (this._isIntervalIgnored || this._intervalId !== void 0) {
          return;
        }
        this._intervalId = setInterval(() => {
          this._onInterval();
        }, this._interval);
        this._intervalEnd = Date.now() + this._interval;
      }
      _onInterval() {
        if (this._intervalCount === 0 && this._pendingCount === 0 && this._intervalId) {
          clearInterval(this._intervalId);
          this._intervalId = void 0;
        }
        this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
        this._processQueue();
      }
      /**
      Executes all queued functions until it reaches the limit.
      */
      _processQueue() {
        while (this._tryToStartAnother()) {
        }
      }
      get concurrency() {
        return this._concurrency;
      }
      set concurrency(newConcurrency) {
        if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
          throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
        }
        this._concurrency = newConcurrency;
        this._processQueue();
      }
      /**
      Adds a sync or async task to the queue. Always returns a promise.
      */
      async add(fn, options = {}) {
        return new Promise((resolve, reject) => {
          const run = async () => {
            this._pendingCount++;
            this._intervalCount++;
            try {
              const operation = this._timeout === void 0 && options.timeout === void 0 ? fn() : p_timeout_1.default(Promise.resolve(fn()), options.timeout === void 0 ? this._timeout : options.timeout, () => {
                if (options.throwOnTimeout === void 0 ? this._throwOnTimeout : options.throwOnTimeout) {
                  reject(timeoutError);
                }
                return void 0;
              });
              resolve(await operation);
            } catch (error) {
              reject(error);
            }
            this._next();
          };
          this._queue.enqueue(run, options);
          this._tryToStartAnother();
          this.emit("add");
        });
      }
      /**
          Same as `.add()`, but accepts an array of sync or async functions.
      
          @returns A promise that resolves when all functions are resolved.
          */
      async addAll(functions, options) {
        return Promise.all(functions.map(async (function_) => this.add(function_, options)));
      }
      /**
      Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
      */
      start() {
        if (!this._isPaused) {
          return this;
        }
        this._isPaused = false;
        this._processQueue();
        return this;
      }
      /**
      Put queue execution on hold.
      */
      pause() {
        this._isPaused = true;
      }
      /**
      Clear the queue.
      */
      clear() {
        this._queue = new this._queueClass();
      }
      /**
          Can be called multiple times. Useful if you for example add additional items at a later time.
      
          @returns A promise that settles when the queue becomes empty.
          */
      async onEmpty() {
        if (this._queue.size === 0) {
          return;
        }
        return new Promise((resolve) => {
          const existingResolve = this._resolveEmpty;
          this._resolveEmpty = () => {
            existingResolve();
            resolve();
          };
        });
      }
      /**
          The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
      
          @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
          */
      async onIdle() {
        if (this._pendingCount === 0 && this._queue.size === 0) {
          return;
        }
        return new Promise((resolve) => {
          const existingResolve = this._resolveIdle;
          this._resolveIdle = () => {
            existingResolve();
            resolve();
          };
        });
      }
      /**
      Size of the queue.
      */
      get size() {
        return this._queue.size;
      }
      /**
          Size of the queue, filtered by the given options.
      
          For example, this can be used to find the number of items remaining in the queue with a specific priority level.
          */
      sizeBy(options) {
        return this._queue.filter(options).length;
      }
      /**
      Number of pending promises.
      */
      get pending() {
        return this._pendingCount;
      }
      /**
      Whether the queue is currently paused.
      */
      get isPaused() {
        return this._isPaused;
      }
      get timeout() {
        return this._timeout;
      }
      /**
      Set the timeout for future operations.
      */
      set timeout(milliseconds) {
        this._timeout = milliseconds;
      }
    };
    exports.default = PQueue;
  }
});

// node_modules/langsmith/dist/singletons/fetch.js
var DEFAULT_FETCH_IMPLEMENTATION, LANGSMITH_FETCH_IMPLEMENTATION_KEY, _getFetchImplementation;
var init_fetch = __esm({
  "node_modules/langsmith/dist/singletons/fetch.js"() {
    DEFAULT_FETCH_IMPLEMENTATION = (...args) => fetch(...args);
    LANGSMITH_FETCH_IMPLEMENTATION_KEY = Symbol.for("ls:fetch_implementation");
    _getFetchImplementation = () => {
      return globalThis[LANGSMITH_FETCH_IMPLEMENTATION_KEY] ?? DEFAULT_FETCH_IMPLEMENTATION;
    };
  }
});

// node_modules/langsmith/dist/utils/async_caller.js
var import_p_retry, import_p_queue, STATUS_NO_RETRY, STATUS_IGNORE, AsyncCaller;
var init_async_caller = __esm({
  "node_modules/langsmith/dist/utils/async_caller.js"() {
    import_p_retry = __toESM(require_p_retry(), 1);
    import_p_queue = __toESM(require_dist(), 1);
    init_fetch();
    STATUS_NO_RETRY = [
      400,
      // Bad Request
      401,
      // Unauthorized
      403,
      // Forbidden
      404,
      // Not Found
      405,
      // Method Not Allowed
      406,
      // Not Acceptable
      407,
      // Proxy Authentication Required
      408
      // Request Timeout
    ];
    STATUS_IGNORE = [
      409
      // Conflict
    ];
    AsyncCaller = class {
      constructor(params) {
        Object.defineProperty(this, "maxConcurrency", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "maxRetries", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "queue", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "onFailedResponseHook", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxConcurrency = params.maxConcurrency ?? Infinity;
        this.maxRetries = params.maxRetries ?? 6;
        if ("default" in import_p_queue.default) {
          this.queue = new import_p_queue.default.default({
            concurrency: this.maxConcurrency
          });
        } else {
          this.queue = new import_p_queue.default({ concurrency: this.maxConcurrency });
        }
        this.onFailedResponseHook = params?.onFailedResponseHook;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      call(callable, ...args) {
        const onFailedResponseHook = this.onFailedResponseHook;
        return this.queue.add(() => (0, import_p_retry.default)(() => callable(...args).catch((error) => {
          if (error instanceof Error) {
            throw error;
          } else {
            throw new Error(error);
          }
        }), {
          async onFailedAttempt(error) {
            if (error.message.startsWith("Cancel") || error.message.startsWith("TimeoutError") || error.message.startsWith("AbortError")) {
              throw error;
            }
            if (error?.code === "ECONNABORTED") {
              throw error;
            }
            const response = error?.response;
            const status = response?.status;
            if (status) {
              if (STATUS_NO_RETRY.includes(+status)) {
                throw error;
              } else if (STATUS_IGNORE.includes(+status)) {
                return;
              }
              if (onFailedResponseHook) {
                await onFailedResponseHook(response);
              }
            }
          },
          // If needed we can change some of the defaults here,
          // but they're quite sensible.
          retries: this.maxRetries,
          randomize: true
        }), { throwOnTimeout: true });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callWithOptions(options, callable, ...args) {
        if (options.signal) {
          return Promise.race([
            this.call(callable, ...args),
            new Promise((_, reject) => {
              options.signal?.addEventListener("abort", () => {
                reject(new Error("AbortError"));
              });
            })
          ]);
        }
        return this.call(callable, ...args);
      }
      fetch(...args) {
        return this.call(() => _getFetchImplementation()(...args).then((res) => res.ok ? res : Promise.reject(res)));
      }
    };
  }
});

// node_modules/langsmith/dist/utils/messages.js
function isLangChainMessage(message) {
  return typeof message?._getType === "function";
}
function convertLangChainMessageToExample(message) {
  const converted = {
    type: message._getType(),
    data: { content: message.content }
  };
  if (message?.additional_kwargs && Object.keys(message.additional_kwargs).length > 0) {
    converted.data.additional_kwargs = { ...message.additional_kwargs };
  }
  return converted;
}
var init_messages = __esm({
  "node_modules/langsmith/dist/utils/messages.js"() {
  }
});

// node_modules/langsmith/dist/utils/_uuid.js
function assertUuid(str, which) {
  if (!validate_default(str)) {
    const msg = which !== void 0 ? `Invalid UUID for ${which}: ${str}` : `Invalid UUID: ${str}`;
    throw new Error(msg);
  }
  return str;
}
var init_uuid = __esm({
  "node_modules/langsmith/dist/utils/_uuid.js"() {
    init_esm_browser();
  }
});

// node_modules/langsmith/dist/utils/warn.js
function warnOnce(message) {
  if (!warnedMessages[message]) {
    console.warn(message);
    warnedMessages[message] = true;
  }
}
var warnedMessages;
var init_warn = __esm({
  "node_modules/langsmith/dist/utils/warn.js"() {
    warnedMessages = {};
  }
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports, module) {
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports, module) {
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports, module) {
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports, module) {
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports, module) {
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports, module) {
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version2, options) {
        options = parseOptions(options);
        if (version2 instanceof _SemVer) {
          if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
            return version2;
          } else {
            version2 = version2.version;
          }
        } else if (typeof version2 !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version2}".`);
        }
        if (version2.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version2, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version2.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version2}`);
        }
        this.raw = version2;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (!identifier && identifierBase === false) {
              throw new Error("invalid increment argument: identifier is empty");
            }
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/semver/functions/parse.js"(exports, module) {
    var SemVer = require_semver();
    var parse3 = (version2, options, throwErrors = false) => {
      if (version2 instanceof SemVer) {
        return version2;
      }
      try {
        return new SemVer(version2, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module.exports = parse3;
  }
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "node_modules/semver/functions/valid.js"(exports, module) {
    var parse3 = require_parse();
    var valid = (version2, options) => {
      const v = parse3(version2, options);
      return v ? v.version : null;
    };
    module.exports = valid;
  }
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "node_modules/semver/functions/clean.js"(exports, module) {
    var parse3 = require_parse();
    var clean = (version2, options) => {
      const s = parse3(version2.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module.exports = clean;
  }
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "node_modules/semver/functions/inc.js"(exports, module) {
    var SemVer = require_semver();
    var inc = (version2, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version2 instanceof SemVer ? version2.version : version2,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module.exports = inc;
  }
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "node_modules/semver/functions/diff.js"(exports, module) {
    var parse3 = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse3(version1, null, true);
      const v2 = parse3(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (highVersion.patch) {
          return "patch";
        }
        if (highVersion.minor) {
          return "minor";
        }
        return "major";
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module.exports = diff;
  }
});

// node_modules/semver/functions/major.js
var require_major = __commonJS({
  "node_modules/semver/functions/major.js"(exports, module) {
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module.exports = major;
  }
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "node_modules/semver/functions/minor.js"(exports, module) {
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module.exports = minor;
  }
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "node_modules/semver/functions/patch.js"(exports, module) {
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module.exports = patch;
  }
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "node_modules/semver/functions/prerelease.js"(exports, module) {
    var parse3 = require_parse();
    var prerelease = (version2, options) => {
      const parsed = parse3(version2, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module.exports = prerelease;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports, module) {
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module.exports = compare;
  }
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "node_modules/semver/functions/rcompare.js"(exports, module) {
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module.exports = rcompare;
  }
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "node_modules/semver/functions/compare-loose.js"(exports, module) {
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module.exports = compareLoose;
  }
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "node_modules/semver/functions/compare-build.js"(exports, module) {
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module.exports = compareBuild;
  }
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "node_modules/semver/functions/sort.js"(exports, module) {
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module.exports = sort;
  }
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "node_modules/semver/functions/rsort.js"(exports, module) {
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module.exports = rsort;
  }
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "node_modules/semver/functions/gt.js"(exports, module) {
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module.exports = gt;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/semver/functions/lt.js"(exports, module) {
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module.exports = lt;
  }
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "node_modules/semver/functions/eq.js"(exports, module) {
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module.exports = eq;
  }
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "node_modules/semver/functions/neq.js"(exports, module) {
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module.exports = neq;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports, module) {
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module.exports = gte;
  }
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "node_modules/semver/functions/lte.js"(exports, module) {
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module.exports = lte;
  }
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "node_modules/semver/functions/cmp.js"(exports, module) {
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module.exports = cmp;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/semver/functions/coerce.js"(exports, module) {
    var SemVer = require_semver();
    var parse3 = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version2, options) => {
      if (version2 instanceof SemVer) {
        return version2;
      }
      if (typeof version2 === "number") {
        version2 = String(version2);
      }
      if (typeof version2 !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version2.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version2)) && (!match || match.index + match[0].length !== version2.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse3(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module.exports = coerce;
  }
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "node_modules/semver/internal/lrucache.js"(exports, module) {
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module.exports = LRUCache;
  }
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  "node_modules/semver/classes/range.js"(exports, module) {
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version2) {
        if (!version2) {
          return false;
        }
        if (typeof version2 === "string") {
          try {
            version2 = new SemVer(version2, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version2, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version2, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version2)) {
          return false;
        }
      }
      if (version2.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "node_modules/semver/classes/comparator.js"(exports, module) {
    var ANY = Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version2) {
        debug("Comparator.test", version2, this.options.loose);
        if (this.semver === ANY || version2 === ANY) {
          return true;
        }
        if (typeof version2 === "string") {
          try {
            version2 = new SemVer(version2, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version2, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "node_modules/semver/functions/satisfies.js"(exports, module) {
    var Range = require_range();
    var satisfies = (version2, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version2);
    };
    module.exports = satisfies;
  }
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "node_modules/semver/ranges/to-comparators.js"(exports, module) {
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module.exports = toComparators;
  }
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module.exports = maxSatisfying;
  }
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module.exports = minSatisfying;
  }
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "node_modules/semver/ranges/min-version.js"(exports, module) {
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module.exports = minVersion;
  }
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "node_modules/semver/ranges/valid.js"(exports, module) {
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module.exports = validRange;
  }
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "node_modules/semver/ranges/outside.js"(exports, module) {
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version2, range, hilo, options) => {
      version2 = new SemVer(version2, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version2, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version2, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version2, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module.exports = outside;
  }
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "node_modules/semver/ranges/gtr.js"(exports, module) {
    var outside = require_outside();
    var gtr = (version2, range, options) => outside(version2, range, ">", options);
    module.exports = gtr;
  }
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "node_modules/semver/ranges/ltr.js"(exports, module) {
    var outside = require_outside();
    var ltr = (version2, range, options) => outside(version2, range, "<", options);
    module.exports = ltr;
  }
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "node_modules/semver/ranges/intersects.js"(exports, module) {
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module.exports = intersects;
  }
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "node_modules/semver/ranges/simplify.js"(exports, module) {
    var satisfies = require_satisfies();
    var compare = require_compare();
    module.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version2 of v) {
        const included = satisfies(version2, range, options);
        if (included) {
          prev = version2;
          if (!first) {
            first = version2;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "node_modules/semver/ranges/subset.js"(exports, module) {
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module.exports = subset;
  }
});

// node_modules/semver/index.js
var require_semver2 = __commonJS({
  "node_modules/semver/index.js"(exports, module) {
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse3 = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse: parse3,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// node_modules/langsmith/dist/utils/prompts.js
function parsePromptIdentifier(identifier) {
  if (!identifier || identifier.split("/").length > 2 || identifier.startsWith("/") || identifier.endsWith("/") || identifier.split(":").length > 2) {
    throw new Error(`Invalid identifier format: ${identifier}`);
  }
  const [ownerNamePart, commitPart] = identifier.split(":");
  const commit = commitPart || "latest";
  if (ownerNamePart.includes("/")) {
    const [owner, name] = ownerNamePart.split("/", 2);
    if (!owner || !name) {
      throw new Error(`Invalid identifier format: ${identifier}`);
    }
    return [owner, name, commit];
  } else {
    if (!ownerNamePart) {
      throw new Error(`Invalid identifier format: ${identifier}`);
    }
    return ["-", ownerNamePart, commit];
  }
}
var import_semver;
var init_prompts = __esm({
  "node_modules/langsmith/dist/utils/prompts.js"() {
    import_semver = __toESM(require_semver2(), 1);
  }
});

// node_modules/langsmith/dist/utils/error.js
async function raiseForStatus(response, context, consume) {
  let errorBody;
  if (response.ok) {
    if (consume) {
      errorBody = await response.text();
    }
    return;
  }
  errorBody = await response.text();
  const fullMessage = `Failed to ${context}. Received status [${response.status}]: ${response.statusText}. Server response: ${errorBody}`;
  if (response.status === 409) {
    throw new LangSmithConflictError(fullMessage);
  }
  throw new Error(fullMessage);
}
var LangSmithConflictError;
var init_error = __esm({
  "node_modules/langsmith/dist/utils/error.js"() {
    LangSmithConflictError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "LangSmithConflictError";
      }
    };
  }
});

// node_modules/langsmith/dist/utils/fast-safe-stringify/index.js
function defaultOptions() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function stringify(obj, replacer, spacer, options) {
  try {
    return JSON.stringify(obj, replacer, spacer);
  } catch (e) {
    if (!e.message?.includes("Converting circular structure to JSON")) {
      console.warn("[WARNING]: LangSmith received unserializable value.");
      return "[Unserializable]";
    }
    console.warn("[WARNING]: LangSmith received circular JSON. This will decrease tracer performance.");
    if (typeof options === "undefined") {
      options = defaultOptions();
    }
    decirc(obj, "", 0, [], void 0, 0, options);
    var res;
    try {
      if (replacerStack.length === 0) {
        res = JSON.stringify(obj, replacer, spacer);
      } else {
        res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
      }
    } catch (_) {
      return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
    } finally {
      while (arr.length !== 0) {
        var part = arr.pop();
        if (part.length === 4) {
          Object.defineProperty(part[0], part[1], part[3]);
        } else {
          part[0][part[1]] = part[2];
        }
      }
    }
    return res;
  }
}
function setReplace(replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
  if (propertyDescriptor.get !== void 0) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace });
      arr.push([parent, k, val, propertyDescriptor]);
    } else {
      replacerStack.push([val, k, replace]);
    }
  } else {
    parent[k] = replace;
    arr.push([parent, k, val]);
  }
}
function decirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === "object" && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }
    if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    stack.push(val);
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}
function replaceGetterValues(replacer) {
  replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
    return v;
  };
  return function(key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i];
        if (part[1] === key && part[0] === val) {
          val = part[2];
          replacerStack.splice(i, 1);
          break;
        }
      }
    }
    return replacer.call(this, key, val);
  };
}
var LIMIT_REPLACE_NODE, CIRCULAR_REPLACE_NODE, arr, replacerStack;
var init_fast_safe_stringify = __esm({
  "node_modules/langsmith/dist/utils/fast-safe-stringify/index.js"() {
    LIMIT_REPLACE_NODE = "[...]";
    CIRCULAR_REPLACE_NODE = { result: "[Circular]" };
    arr = [];
    replacerStack = [];
  }
});

// node_modules/langsmith/dist/client.js
function mergeRuntimeEnvIntoRunCreate(run) {
  const runtimeEnv = getRuntimeEnvironment();
  const envVars = getLangChainEnvVarsMetadata();
  const extra = run.extra ?? {};
  const metadata = extra.metadata;
  run.extra = {
    ...extra,
    runtime: {
      ...runtimeEnv,
      ...extra?.runtime
    },
    metadata: {
      ...envVars,
      ...envVars.revision_id || run.revision_id ? { revision_id: run.revision_id ?? envVars.revision_id } : {},
      ...metadata
    }
  };
  return run;
}
async function toArray(iterable) {
  const result = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}
function trimQuotes(str) {
  if (str === void 0) {
    return void 0;
  }
  return str.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}
var getTracingSamplingRate, isLocalhost, handle429, AutoBatchQueue, DEFAULT_BATCH_SIZE_LIMIT_BYTES, SERVER_INFO_REQUEST_TIMEOUT, Client;
var init_client = __esm({
  "node_modules/langsmith/dist/client.js"() {
    init_esm_browser();
    init_async_caller();
    init_messages();
    init_env();
    init_dist();
    init_uuid();
    init_warn();
    init_prompts();
    init_error();
    init_fetch();
    init_fast_safe_stringify();
    getTracingSamplingRate = () => {
      const samplingRateStr = getLangSmithEnvironmentVariable("TRACING_SAMPLING_RATE");
      if (samplingRateStr === void 0) {
        return void 0;
      }
      const samplingRate = parseFloat(samplingRateStr);
      if (samplingRate < 0 || samplingRate > 1) {
        throw new Error(`LANGSMITH_TRACING_SAMPLING_RATE must be between 0 and 1 if set. Got: ${samplingRate}`);
      }
      return samplingRate;
    };
    isLocalhost = (url) => {
      const strippedUrl = url.replace("http://", "").replace("https://", "");
      const hostname = strippedUrl.split("/")[0].split(":")[0];
      return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
    };
    handle429 = async (response) => {
      if (response?.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") ?? "30", 10) * 1e3;
        if (retryAfter > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryAfter));
          return true;
        }
      }
      return false;
    };
    AutoBatchQueue = class {
      constructor() {
        Object.defineProperty(this, "items", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "sizeBytes", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 0
        });
      }
      peek() {
        return this.items[0];
      }
      push(item) {
        let itemPromiseResolve;
        const itemPromise = new Promise((resolve) => {
          itemPromiseResolve = resolve;
        });
        const size = stringify(item.item).length;
        this.items.push({
          action: item.action,
          payload: item.item,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          itemPromiseResolve,
          itemPromise,
          size
        });
        this.sizeBytes += size;
        return itemPromise;
      }
      pop(upToSizeBytes) {
        if (upToSizeBytes < 1) {
          throw new Error("Number of bytes to pop off may not be less than 1.");
        }
        const popped = [];
        let poppedSizeBytes = 0;
        while (poppedSizeBytes + (this.peek()?.size ?? 0) < upToSizeBytes && this.items.length > 0) {
          const item = this.items.shift();
          if (item) {
            popped.push(item);
            poppedSizeBytes += item.size;
            this.sizeBytes -= item.size;
          }
        }
        if (popped.length === 0 && this.items.length > 0) {
          const item = this.items.shift();
          popped.push(item);
          poppedSizeBytes += item.size;
          this.sizeBytes -= item.size;
        }
        return [
          popped.map((it) => ({ action: it.action, item: it.payload })),
          () => popped.forEach((it) => it.itemPromiseResolve())
        ];
      }
    };
    DEFAULT_BATCH_SIZE_LIMIT_BYTES = 20971520;
    SERVER_INFO_REQUEST_TIMEOUT = 2500;
    Client = class _Client {
      constructor(config = {}) {
        Object.defineProperty(this, "apiKey", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "apiUrl", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "webUrl", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "caller", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "batchIngestCaller", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "timeout_ms", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_tenantId", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: null
        });
        Object.defineProperty(this, "hideInputs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "hideOutputs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "tracingSampleRate", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "filteredPostUuids", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: /* @__PURE__ */ new Set()
        });
        Object.defineProperty(this, "autoBatchTracing", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "autoBatchQueue", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: new AutoBatchQueue()
        });
        Object.defineProperty(this, "autoBatchTimeout", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "autoBatchAggregationDelayMs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 250
        });
        Object.defineProperty(this, "batchSizeBytesLimit", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "fetchOptions", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "settings", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "blockOnRootRunFinalization", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: getEnvironmentVariable("LANGSMITH_TRACING_BACKGROUND") === "false"
        });
        Object.defineProperty(this, "traceBatchConcurrency", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 5
        });
        Object.defineProperty(this, "_serverInfo", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_getServerInfoPromise", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "manualFlushMode", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        const defaultConfig = _Client.getDefaultClientConfig();
        this.tracingSampleRate = getTracingSamplingRate();
        this.apiUrl = trimQuotes(config.apiUrl ?? defaultConfig.apiUrl) ?? "";
        if (this.apiUrl.endsWith("/")) {
          this.apiUrl = this.apiUrl.slice(0, -1);
        }
        this.apiKey = trimQuotes(config.apiKey ?? defaultConfig.apiKey);
        this.webUrl = trimQuotes(config.webUrl ?? defaultConfig.webUrl);
        if (this.webUrl?.endsWith("/")) {
          this.webUrl = this.webUrl.slice(0, -1);
        }
        this.timeout_ms = config.timeout_ms ?? 9e4;
        this.caller = new AsyncCaller(config.callerOptions ?? {});
        this.traceBatchConcurrency = config.traceBatchConcurrency ?? this.traceBatchConcurrency;
        if (this.traceBatchConcurrency < 1) {
          throw new Error("Trace batch concurrency must be positive.");
        }
        this.batchIngestCaller = new AsyncCaller({
          maxRetries: 2,
          maxConcurrency: this.traceBatchConcurrency,
          ...config.callerOptions ?? {},
          onFailedResponseHook: handle429
        });
        this.hideInputs = config.hideInputs ?? config.anonymizer ?? defaultConfig.hideInputs;
        this.hideOutputs = config.hideOutputs ?? config.anonymizer ?? defaultConfig.hideOutputs;
        this.autoBatchTracing = config.autoBatchTracing ?? this.autoBatchTracing;
        this.blockOnRootRunFinalization = config.blockOnRootRunFinalization ?? this.blockOnRootRunFinalization;
        this.batchSizeBytesLimit = config.batchSizeBytesLimit;
        this.fetchOptions = config.fetchOptions || {};
        this.manualFlushMode = config.manualFlushMode ?? this.manualFlushMode;
      }
      static getDefaultClientConfig() {
        const apiKey = getLangSmithEnvironmentVariable("API_KEY");
        const apiUrl = getLangSmithEnvironmentVariable("ENDPOINT") ?? "https://api.smith.langchain.com";
        const hideInputs = getLangSmithEnvironmentVariable("HIDE_INPUTS") === "true";
        const hideOutputs = getLangSmithEnvironmentVariable("HIDE_OUTPUTS") === "true";
        return {
          apiUrl,
          apiKey,
          webUrl: void 0,
          hideInputs,
          hideOutputs
        };
      }
      getHostUrl() {
        if (this.webUrl) {
          return this.webUrl;
        } else if (isLocalhost(this.apiUrl)) {
          this.webUrl = "http://localhost:3000";
          return this.webUrl;
        } else if (this.apiUrl.includes("/api") && !this.apiUrl.split(".", 1)[0].endsWith("api")) {
          this.webUrl = this.apiUrl.replace("/api", "");
          return this.webUrl;
        } else if (this.apiUrl.split(".", 1)[0].includes("dev")) {
          this.webUrl = "https://dev.smith.langchain.com";
          return this.webUrl;
        } else if (this.apiUrl.split(".", 1)[0].includes("eu")) {
          this.webUrl = "https://eu.smith.langchain.com";
          return this.webUrl;
        } else {
          this.webUrl = "https://smith.langchain.com";
          return this.webUrl;
        }
      }
      get headers() {
        const headers = {
          "User-Agent": `langsmith-js/${__version__}`
        };
        if (this.apiKey) {
          headers["x-api-key"] = `${this.apiKey}`;
        }
        return headers;
      }
      processInputs(inputs) {
        if (this.hideInputs === false) {
          return inputs;
        }
        if (this.hideInputs === true) {
          return {};
        }
        if (typeof this.hideInputs === "function") {
          return this.hideInputs(inputs);
        }
        return inputs;
      }
      processOutputs(outputs) {
        if (this.hideOutputs === false) {
          return outputs;
        }
        if (this.hideOutputs === true) {
          return {};
        }
        if (typeof this.hideOutputs === "function") {
          return this.hideOutputs(outputs);
        }
        return outputs;
      }
      prepareRunCreateOrUpdateInputs(run) {
        const runParams = { ...run };
        if (runParams.inputs !== void 0) {
          runParams.inputs = this.processInputs(runParams.inputs);
        }
        if (runParams.outputs !== void 0) {
          runParams.outputs = this.processOutputs(runParams.outputs);
        }
        return runParams;
      }
      async _getResponse(path, queryParams) {
        const paramsString = queryParams?.toString() ?? "";
        const url = `${this.apiUrl}${path}?${paramsString}`;
        const response = await this.caller.call(_getFetchImplementation(), url, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, `Failed to fetch ${path}`);
        return response;
      }
      async _get(path, queryParams) {
        const response = await this._getResponse(path, queryParams);
        return response.json();
      }
      async *_getPaginated(path, queryParams = new URLSearchParams(), transform) {
        let offset = Number(queryParams.get("offset")) || 0;
        const limit = Number(queryParams.get("limit")) || 100;
        while (true) {
          queryParams.set("offset", String(offset));
          queryParams.set("limit", String(limit));
          const url = `${this.apiUrl}${path}?${queryParams}`;
          const response = await this.caller.call(_getFetchImplementation(), url, {
            method: "GET",
            headers: this.headers,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions
          });
          await raiseForStatus(response, `Failed to fetch ${path}`);
          const items = transform ? transform(await response.json()) : await response.json();
          if (items.length === 0) {
            break;
          }
          yield items;
          if (items.length < limit) {
            break;
          }
          offset += items.length;
        }
      }
      async *_getCursorPaginatedList(path, body = null, requestMethod = "POST", dataKey = "runs") {
        const bodyParams = body ? { ...body } : {};
        while (true) {
          const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${path}`, {
            method: requestMethod,
            headers: { ...this.headers, "Content-Type": "application/json" },
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions,
            body: JSON.stringify(bodyParams)
          });
          const responseBody = await response.json();
          if (!responseBody) {
            break;
          }
          if (!responseBody[dataKey]) {
            break;
          }
          yield responseBody[dataKey];
          const cursors = responseBody.cursors;
          if (!cursors) {
            break;
          }
          if (!cursors.next) {
            break;
          }
          bodyParams.cursor = cursors.next;
        }
      }
      _filterForSampling(runs, patch = false) {
        if (this.tracingSampleRate === void 0) {
          return runs;
        }
        if (patch) {
          const sampled = [];
          for (const run of runs) {
            if (!this.filteredPostUuids.has(run.id)) {
              sampled.push(run);
            } else {
              this.filteredPostUuids.delete(run.id);
            }
          }
          return sampled;
        } else {
          const sampled = [];
          for (const run of runs) {
            if (run.id !== run.trace_id && !this.filteredPostUuids.has(run.trace_id) || Math.random() < this.tracingSampleRate) {
              sampled.push(run);
            } else {
              this.filteredPostUuids.add(run.id);
            }
          }
          return sampled;
        }
      }
      async _getBatchSizeLimitBytes() {
        const serverInfo = await this._ensureServerInfo();
        return this.batchSizeBytesLimit ?? serverInfo.batch_ingest_config?.size_limit_bytes ?? DEFAULT_BATCH_SIZE_LIMIT_BYTES;
      }
      async _getMultiPartSupport() {
        const serverInfo = await this._ensureServerInfo();
        return serverInfo.instance_flags?.dataset_examples_multipart_enabled ?? false;
      }
      drainAutoBatchQueue(batchSizeLimit) {
        const promises = [];
        while (this.autoBatchQueue.items.length > 0) {
          const [batch, done] = this.autoBatchQueue.pop(batchSizeLimit);
          if (!batch.length) {
            done();
            break;
          }
          const batchPromise = this._processBatch(batch, done).catch(console.error);
          promises.push(batchPromise);
        }
        return Promise.all(promises);
      }
      async _processBatch(batch, done) {
        if (!batch.length) {
          done();
          return;
        }
        try {
          const ingestParams = {
            runCreates: batch.filter((item) => item.action === "create").map((item) => item.item),
            runUpdates: batch.filter((item) => item.action === "update").map((item) => item.item)
          };
          const serverInfo = await this._ensureServerInfo();
          if (serverInfo?.batch_ingest_config?.use_multipart_endpoint) {
            await this.multipartIngestRuns(ingestParams);
          } else {
            await this.batchIngestRuns(ingestParams);
          }
        } finally {
          done();
        }
      }
      async processRunOperation(item) {
        clearTimeout(this.autoBatchTimeout);
        this.autoBatchTimeout = void 0;
        if (item.action === "create") {
          item.item = mergeRuntimeEnvIntoRunCreate(item.item);
        }
        const itemPromise = this.autoBatchQueue.push(item);
        if (this.manualFlushMode) {
          return itemPromise;
        }
        const sizeLimitBytes = await this._getBatchSizeLimitBytes();
        if (this.autoBatchQueue.sizeBytes > sizeLimitBytes) {
          void this.drainAutoBatchQueue(sizeLimitBytes);
        }
        if (this.autoBatchQueue.items.length > 0) {
          this.autoBatchTimeout = setTimeout(() => {
            this.autoBatchTimeout = void 0;
            void this.drainAutoBatchQueue(sizeLimitBytes);
          }, this.autoBatchAggregationDelayMs);
        }
        return itemPromise;
      }
      async _getServerInfo() {
        const response = await _getFetchImplementation()(`${this.apiUrl}/info`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(SERVER_INFO_REQUEST_TIMEOUT),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "get server info");
        return response.json();
      }
      async _ensureServerInfo() {
        if (this._getServerInfoPromise === void 0) {
          this._getServerInfoPromise = (async () => {
            if (this._serverInfo === void 0) {
              try {
                this._serverInfo = await this._getServerInfo();
              } catch (e) {
                console.warn(`[WARNING]: LangSmith failed to fetch info on supported operations. Falling back to batch operations and default limits.`);
              }
            }
            return this._serverInfo ?? {};
          })();
        }
        return this._getServerInfoPromise.then((serverInfo) => {
          if (this._serverInfo === void 0) {
            this._getServerInfoPromise = void 0;
          }
          return serverInfo;
        });
      }
      async _getSettings() {
        if (!this.settings) {
          this.settings = this._get("/settings");
        }
        return await this.settings;
      }
      /**
       * Flushes current queued traces.
       */
      async flush() {
        const sizeLimitBytes = await this._getBatchSizeLimitBytes();
        await this.drainAutoBatchQueue(sizeLimitBytes);
      }
      async createRun(run) {
        if (!this._filterForSampling([run]).length) {
          return;
        }
        const headers = { ...this.headers, "Content-Type": "application/json" };
        const session_name = run.project_name;
        delete run.project_name;
        const runCreate = this.prepareRunCreateOrUpdateInputs({
          session_name,
          ...run,
          start_time: run.start_time ?? Date.now()
        });
        if (this.autoBatchTracing && runCreate.trace_id !== void 0 && runCreate.dotted_order !== void 0) {
          void this.processRunOperation({
            action: "create",
            item: runCreate
          }).catch(console.error);
          return;
        }
        const mergedRunCreateParam = mergeRuntimeEnvIntoRunCreate(runCreate);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs`, {
          method: "POST",
          headers,
          body: stringify(mergedRunCreateParam),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create run", true);
      }
      /**
       * Batch ingest/upsert multiple runs in the Langsmith system.
       * @param runs
       */
      async batchIngestRuns({ runCreates, runUpdates }) {
        if (runCreates === void 0 && runUpdates === void 0) {
          return;
        }
        let preparedCreateParams = runCreates?.map((create) => this.prepareRunCreateOrUpdateInputs(create)) ?? [];
        let preparedUpdateParams = runUpdates?.map((update) => this.prepareRunCreateOrUpdateInputs(update)) ?? [];
        if (preparedCreateParams.length > 0 && preparedUpdateParams.length > 0) {
          const createById = preparedCreateParams.reduce((params, run) => {
            if (!run.id) {
              return params;
            }
            params[run.id] = run;
            return params;
          }, {});
          const standaloneUpdates = [];
          for (const updateParam of preparedUpdateParams) {
            if (updateParam.id !== void 0 && createById[updateParam.id]) {
              createById[updateParam.id] = {
                ...createById[updateParam.id],
                ...updateParam
              };
            } else {
              standaloneUpdates.push(updateParam);
            }
          }
          preparedCreateParams = Object.values(createById);
          preparedUpdateParams = standaloneUpdates;
        }
        const rawBatch = {
          post: this._filterForSampling(preparedCreateParams),
          patch: this._filterForSampling(preparedUpdateParams, true)
        };
        if (!rawBatch.post.length && !rawBatch.patch.length) {
          return;
        }
        const batchChunks = {
          post: [],
          patch: []
        };
        for (const k of ["post", "patch"]) {
          const key = k;
          const batchItems = rawBatch[key].reverse();
          let batchItem = batchItems.pop();
          while (batchItem !== void 0) {
            batchChunks[key].push(batchItem);
            batchItem = batchItems.pop();
          }
        }
        if (batchChunks.post.length > 0 || batchChunks.patch.length > 0) {
          await this._postBatchIngestRuns(stringify(batchChunks));
        }
      }
      async _postBatchIngestRuns(body) {
        const headers = {
          ...this.headers,
          "Content-Type": "application/json",
          Accept: "application/json"
        };
        const response = await this.batchIngestCaller.call(_getFetchImplementation(), `${this.apiUrl}/runs/batch`, {
          method: "POST",
          headers,
          body,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "batch create run", true);
      }
      /**
       * Batch ingest/upsert multiple runs in the Langsmith system.
       * @param runs
       */
      async multipartIngestRuns({ runCreates, runUpdates }) {
        if (runCreates === void 0 && runUpdates === void 0) {
          return;
        }
        const allAttachments = {};
        let preparedCreateParams = [];
        for (const create of runCreates ?? []) {
          const preparedCreate = this.prepareRunCreateOrUpdateInputs(create);
          if (preparedCreate.id !== void 0 && preparedCreate.attachments !== void 0) {
            allAttachments[preparedCreate.id] = preparedCreate.attachments;
          }
          delete preparedCreate.attachments;
          preparedCreateParams.push(preparedCreate);
        }
        let preparedUpdateParams = [];
        for (const update of runUpdates ?? []) {
          preparedUpdateParams.push(this.prepareRunCreateOrUpdateInputs(update));
        }
        const invalidRunCreate = preparedCreateParams.find((runCreate) => {
          return runCreate.trace_id === void 0 || runCreate.dotted_order === void 0;
        });
        if (invalidRunCreate !== void 0) {
          throw new Error(`Multipart ingest requires "trace_id" and "dotted_order" to be set when creating a run`);
        }
        const invalidRunUpdate = preparedUpdateParams.find((runUpdate) => {
          return runUpdate.trace_id === void 0 || runUpdate.dotted_order === void 0;
        });
        if (invalidRunUpdate !== void 0) {
          throw new Error(`Multipart ingest requires "trace_id" and "dotted_order" to be set when updating a run`);
        }
        if (preparedCreateParams.length > 0 && preparedUpdateParams.length > 0) {
          const createById = preparedCreateParams.reduce((params, run) => {
            if (!run.id) {
              return params;
            }
            params[run.id] = run;
            return params;
          }, {});
          const standaloneUpdates = [];
          for (const updateParam of preparedUpdateParams) {
            if (updateParam.id !== void 0 && createById[updateParam.id]) {
              createById[updateParam.id] = {
                ...createById[updateParam.id],
                ...updateParam
              };
            } else {
              standaloneUpdates.push(updateParam);
            }
          }
          preparedCreateParams = Object.values(createById);
          preparedUpdateParams = standaloneUpdates;
        }
        if (preparedCreateParams.length === 0 && preparedUpdateParams.length === 0) {
          return;
        }
        const accumulatedContext = [];
        const accumulatedParts = [];
        for (const [method, payloads] of [
          ["post", preparedCreateParams],
          ["patch", preparedUpdateParams]
        ]) {
          for (const originalPayload of payloads) {
            const { inputs, outputs, events, attachments, ...payload } = originalPayload;
            const fields = { inputs, outputs, events };
            const stringifiedPayload = stringify(payload);
            accumulatedParts.push({
              name: `${method}.${payload.id}`,
              payload: new Blob([stringifiedPayload], {
                type: `application/json; length=${stringifiedPayload.length}`
                // encoding=gzip
              })
            });
            for (const [key, value] of Object.entries(fields)) {
              if (value === void 0) {
                continue;
              }
              const stringifiedValue = stringify(value);
              accumulatedParts.push({
                name: `${method}.${payload.id}.${key}`,
                payload: new Blob([stringifiedValue], {
                  type: `application/json; length=${stringifiedValue.length}`
                })
              });
            }
            if (payload.id !== void 0) {
              const attachments2 = allAttachments[payload.id];
              if (attachments2) {
                delete allAttachments[payload.id];
                for (const [name, attachment] of Object.entries(attachments2)) {
                  let contentType;
                  let content;
                  if (Array.isArray(attachment)) {
                    [contentType, content] = attachment;
                  } else {
                    contentType = attachment.mimeType;
                    content = attachment.data;
                  }
                  if (name.includes(".")) {
                    console.warn(`Skipping attachment '${name}' for run ${payload.id}: Invalid attachment name. Attachment names must not contain periods ('.'). Please rename the attachment and try again.`);
                    continue;
                  }
                  accumulatedParts.push({
                    name: `attachment.${payload.id}.${name}`,
                    payload: new Blob([content], {
                      type: `${contentType}; length=${content.byteLength}`
                    })
                  });
                }
              }
            }
            accumulatedContext.push(`trace=${payload.trace_id},id=${payload.id}`);
          }
        }
        await this._sendMultipartRequest(accumulatedParts, accumulatedContext.join("; "));
      }
      async _sendMultipartRequest(parts, context) {
        try {
          const boundary = "----LangSmithFormBoundary" + Math.random().toString(36).slice(2);
          const chunks = [];
          for (const part of parts) {
            chunks.push(new Blob([`--${boundary}\r
`]));
            chunks.push(new Blob([
              `Content-Disposition: form-data; name="${part.name}"\r
`,
              `Content-Type: ${part.payload.type}\r
\r
`
            ]));
            chunks.push(part.payload);
            chunks.push(new Blob(["\r\n"]));
          }
          chunks.push(new Blob([`--${boundary}--\r
`]));
          const body = new Blob(chunks);
          const arrayBuffer = await body.arrayBuffer();
          const res = await this.batchIngestCaller.call(_getFetchImplementation(), `${this.apiUrl}/runs/multipart`, {
            method: "POST",
            headers: {
              ...this.headers,
              "Content-Type": `multipart/form-data; boundary=${boundary}`
            },
            body: arrayBuffer,
            signal: AbortSignal.timeout(this.timeout_ms),
            ...this.fetchOptions
          });
          await raiseForStatus(res, "ingest multipart runs", true);
        } catch (e) {
          console.warn(`${e.message.trim()}

Context: ${context}`);
        }
      }
      async updateRun(runId, run) {
        assertUuid(runId);
        if (run.inputs) {
          run.inputs = this.processInputs(run.inputs);
        }
        if (run.outputs) {
          run.outputs = this.processOutputs(run.outputs);
        }
        const data = { ...run, id: runId };
        if (!this._filterForSampling([data], true).length) {
          return;
        }
        if (this.autoBatchTracing && data.trace_id !== void 0 && data.dotted_order !== void 0) {
          if (run.end_time !== void 0 && data.parent_run_id === void 0 && this.blockOnRootRunFinalization && !this.manualFlushMode) {
            await this.processRunOperation({ action: "update", item: data }).catch(console.error);
            return;
          } else {
            void this.processRunOperation({ action: "update", item: data }).catch(console.error);
          }
          return;
        }
        const headers = { ...this.headers, "Content-Type": "application/json" };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}`, {
          method: "PATCH",
          headers,
          body: stringify(run),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update run", true);
      }
      async readRun(runId, { loadChildRuns } = { loadChildRuns: false }) {
        assertUuid(runId);
        let run = await this._get(`/runs/${runId}`);
        if (loadChildRuns && run.child_run_ids) {
          run = await this._loadChildRuns(run);
        }
        return run;
      }
      async getRunUrl({ runId, run, projectOpts }) {
        if (run !== void 0) {
          let sessionId;
          if (run.session_id) {
            sessionId = run.session_id;
          } else if (projectOpts?.projectName) {
            sessionId = (await this.readProject({ projectName: projectOpts?.projectName })).id;
          } else if (projectOpts?.projectId) {
            sessionId = projectOpts?.projectId;
          } else {
            const project = await this.readProject({
              projectName: getLangSmithEnvironmentVariable("PROJECT") || "default"
            });
            sessionId = project.id;
          }
          const tenantId = await this._getTenantId();
          return `${this.getHostUrl()}/o/${tenantId}/projects/p/${sessionId}/r/${run.id}?poll=true`;
        } else if (runId !== void 0) {
          const run_ = await this.readRun(runId);
          if (!run_.app_path) {
            throw new Error(`Run ${runId} has no app_path`);
          }
          const baseUrl = this.getHostUrl();
          return `${baseUrl}${run_.app_path}`;
        } else {
          throw new Error("Must provide either runId or run");
        }
      }
      async _loadChildRuns(run) {
        const childRuns = await toArray(this.listRuns({ id: run.child_run_ids }));
        const treemap = {};
        const runs = {};
        childRuns.sort((a, b) => (a?.dotted_order ?? "").localeCompare(b?.dotted_order ?? ""));
        for (const childRun of childRuns) {
          if (childRun.parent_run_id === null || childRun.parent_run_id === void 0) {
            throw new Error(`Child run ${childRun.id} has no parent`);
          }
          if (!(childRun.parent_run_id in treemap)) {
            treemap[childRun.parent_run_id] = [];
          }
          treemap[childRun.parent_run_id].push(childRun);
          runs[childRun.id] = childRun;
        }
        run.child_runs = treemap[run.id] || [];
        for (const runId in treemap) {
          if (runId !== run.id) {
            runs[runId].child_runs = treemap[runId];
          }
        }
        return run;
      }
      /**
       * List runs from the LangSmith server.
       * @param projectId - The ID of the project to filter by.
       * @param projectName - The name of the project to filter by.
       * @param parentRunId - The ID of the parent run to filter by.
       * @param traceId - The ID of the trace to filter by.
       * @param referenceExampleId - The ID of the reference example to filter by.
       * @param startTime - The start time to filter by.
       * @param isRoot - Indicates whether to only return root runs.
       * @param runType - The run type to filter by.
       * @param error - Indicates whether to filter by error runs.
       * @param id - The ID of the run to filter by.
       * @param query - The query string to filter by.
       * @param filter - The filter string to apply to the run spans.
       * @param traceFilter - The filter string to apply on the root run of the trace.
       * @param limit - The maximum number of runs to retrieve.
       * @returns {AsyncIterable<Run>} - The runs.
       *
       * @example
       * // List all runs in a project
       * const projectRuns = client.listRuns({ projectName: "<your_project>" });
       *
       * @example
       * // List LLM and Chat runs in the last 24 hours
       * const todaysLLMRuns = client.listRuns({
       *   projectName: "<your_project>",
       *   start_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
       *   run_type: "llm",
       * });
       *
       * @example
       * // List traces in a project
       * const rootRuns = client.listRuns({
       *   projectName: "<your_project>",
       *   execution_order: 1,
       * });
       *
       * @example
       * // List runs without errors
       * const correctRuns = client.listRuns({
       *   projectName: "<your_project>",
       *   error: false,
       * });
       *
       * @example
       * // List runs by run ID
       * const runIds = [
       *   "a36092d2-4ad5-4fb4-9c0d-0dba9a2ed836",
       *   "9398e6be-964f-4aa4-8ae9-ad78cd4b7074",
       * ];
       * const selectedRuns = client.listRuns({ run_ids: runIds });
       *
       * @example
       * // List all "chain" type runs that took more than 10 seconds and had `total_tokens` greater than 5000
       * const chainRuns = client.listRuns({
       *   projectName: "<your_project>",
       *   filter: 'and(eq(run_type, "chain"), gt(latency, 10), gt(total_tokens, 5000))',
       * });
       *
       * @example
       * // List all runs called "extractor" whose root of the trace was assigned feedback "user_score" score of 1
       * const goodExtractorRuns = client.listRuns({
       *   projectName: "<your_project>",
       *   filter: 'eq(name, "extractor")',
       *   traceFilter: 'and(eq(feedback_key, "user_score"), eq(feedback_score, 1))',
       * });
       *
       * @example
       * // List all runs that started after a specific timestamp and either have "error" not equal to null or a "Correctness" feedback score equal to 0
       * const complexRuns = client.listRuns({
       *   projectName: "<your_project>",
       *   filter: 'and(gt(start_time, "2023-07-15T12:34:56Z"), or(neq(error, null), and(eq(feedback_key, "Correctness"), eq(feedback_score, 0.0))))',
       * });
       *
       * @example
       * // List all runs where `tags` include "experimental" or "beta" and `latency` is greater than 2 seconds
       * const taggedRuns = client.listRuns({
       *   projectName: "<your_project>",
       *   filter: 'and(or(has(tags, "experimental"), has(tags, "beta")), gt(latency, 2))',
       * });
       */
      async *listRuns(props) {
        const { projectId, projectName, parentRunId, traceId, referenceExampleId, startTime, executionOrder, isRoot, runType, error, id, query, filter, traceFilter, treeFilter, limit, select } = props;
        let projectIds = [];
        if (projectId) {
          projectIds = Array.isArray(projectId) ? projectId : [projectId];
        }
        if (projectName) {
          const projectNames = Array.isArray(projectName) ? projectName : [projectName];
          const projectIds_ = await Promise.all(projectNames.map((name) => this.readProject({ projectName: name }).then((project) => project.id)));
          projectIds.push(...projectIds_);
        }
        const default_select = [
          "app_path",
          "child_run_ids",
          "completion_cost",
          "completion_tokens",
          "dotted_order",
          "end_time",
          "error",
          "events",
          "extra",
          "feedback_stats",
          "first_token_time",
          "id",
          "inputs",
          "name",
          "outputs",
          "parent_run_id",
          "parent_run_ids",
          "prompt_cost",
          "prompt_tokens",
          "reference_example_id",
          "run_type",
          "session_id",
          "start_time",
          "status",
          "tags",
          "total_cost",
          "total_tokens",
          "trace_id"
        ];
        const body = {
          session: projectIds.length ? projectIds : null,
          run_type: runType,
          reference_example: referenceExampleId,
          query,
          filter,
          trace_filter: traceFilter,
          tree_filter: treeFilter,
          execution_order: executionOrder,
          parent_run: parentRunId,
          start_time: startTime ? startTime.toISOString() : null,
          error,
          id,
          limit,
          trace: traceId,
          select: select ? select : default_select,
          is_root: isRoot
        };
        let runsYielded = 0;
        for await (const runs of this._getCursorPaginatedList("/runs/query", body)) {
          if (limit) {
            if (runsYielded >= limit) {
              break;
            }
            if (runs.length + runsYielded > limit) {
              const newRuns = runs.slice(0, limit - runsYielded);
              yield* newRuns;
              break;
            }
            runsYielded += runs.length;
            yield* runs;
          } else {
            yield* runs;
          }
        }
      }
      async getRunStats({ id, trace, parentRun, runType, projectNames, projectIds, referenceExampleIds, startTime, endTime, error, query, filter, traceFilter, treeFilter, isRoot, dataSourceType }) {
        let projectIds_ = projectIds || [];
        if (projectNames) {
          projectIds_ = [
            ...projectIds || [],
            ...await Promise.all(projectNames.map((name) => this.readProject({ projectName: name }).then((project) => project.id)))
          ];
        }
        const payload = {
          id,
          trace,
          parent_run: parentRun,
          run_type: runType,
          session: projectIds_,
          reference_example: referenceExampleIds,
          start_time: startTime,
          end_time: endTime,
          error,
          query,
          filter,
          trace_filter: traceFilter,
          tree_filter: treeFilter,
          is_root: isRoot,
          data_source_type: dataSourceType
        };
        const filteredPayload = Object.fromEntries(Object.entries(payload).filter(([_, value]) => value !== void 0));
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/stats`, {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify(filteredPayload),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const result = await response.json();
        return result;
      }
      async shareRun(runId, { shareId } = {}) {
        const data = {
          run_id: runId,
          share_token: shareId || v4_default()
        };
        assertUuid(runId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
          method: "PUT",
          headers: this.headers,
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const result = await response.json();
        if (result === null || !("share_token" in result)) {
          throw new Error("Invalid response from server");
        }
        return `${this.getHostUrl()}/public/${result["share_token"]}/r`;
      }
      async unshareRun(runId) {
        assertUuid(runId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
          method: "DELETE",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "unshare run", true);
      }
      async readRunSharedLink(runId) {
        assertUuid(runId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/runs/${runId}/share`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const result = await response.json();
        if (result === null || !("share_token" in result)) {
          return void 0;
        }
        return `${this.getHostUrl()}/public/${result["share_token"]}/r`;
      }
      async listSharedRuns(shareToken, { runIds } = {}) {
        const queryParams = new URLSearchParams({
          share_token: shareToken
        });
        if (runIds !== void 0) {
          for (const runId of runIds) {
            queryParams.append("id", runId);
          }
        }
        assertUuid(shareToken);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/runs${queryParams}`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const runs = await response.json();
        return runs;
      }
      async readDatasetSharedSchema(datasetId, datasetName) {
        if (!datasetId && !datasetName) {
          throw new Error("Either datasetId or datasetName must be given");
        }
        if (!datasetId) {
          const dataset = await this.readDataset({ datasetName });
          datasetId = dataset.id;
        }
        assertUuid(datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const shareSchema = await response.json();
        shareSchema.url = `${this.getHostUrl()}/public/${shareSchema.share_token}/d`;
        return shareSchema;
      }
      async shareDataset(datasetId, datasetName) {
        if (!datasetId && !datasetName) {
          throw new Error("Either datasetId or datasetName must be given");
        }
        if (!datasetId) {
          const dataset = await this.readDataset({ datasetName });
          datasetId = dataset.id;
        }
        const data = {
          dataset_id: datasetId
        };
        assertUuid(datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
          method: "PUT",
          headers: this.headers,
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const shareSchema = await response.json();
        shareSchema.url = `${this.getHostUrl()}/public/${shareSchema.share_token}/d`;
        return shareSchema;
      }
      async unshareDataset(datasetId) {
        assertUuid(datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/share`, {
          method: "DELETE",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "unshare dataset", true);
      }
      async readSharedDataset(shareToken) {
        assertUuid(shareToken);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/datasets`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const dataset = await response.json();
        return dataset;
      }
      /**
       * Get shared examples.
       *
       * @param {string} shareToken The share token to get examples for. A share token is the UUID (or LangSmith URL, including UUID) generated when explicitly marking an example as public.
       * @param {Object} [options] Additional options for listing the examples.
       * @param {string[] | undefined} [options.exampleIds] A list of example IDs to filter by.
       * @returns {Promise<Example[]>} The shared examples.
       */
      async listSharedExamples(shareToken, options) {
        const params = {};
        if (options?.exampleIds) {
          params.id = options.exampleIds;
        }
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => urlParams.append(key, v));
          } else {
            urlParams.append(key, value);
          }
        });
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/public/${shareToken}/examples?${urlParams.toString()}`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const result = await response.json();
        if (!response.ok) {
          if ("detail" in result) {
            throw new Error(`Failed to list shared examples.
Status: ${response.status}
Message: ${result.detail.join("\n")}`);
          }
          throw new Error(`Failed to list shared examples: ${response.status} ${response.statusText}`);
        }
        return result.map((example) => ({
          ...example,
          _hostUrl: this.getHostUrl()
        }));
      }
      async createProject({ projectName, description = null, metadata = null, upsert = false, projectExtra = null, referenceDatasetId = null }) {
        const upsert_ = upsert ? `?upsert=true` : "";
        const endpoint = `${this.apiUrl}/sessions${upsert_}`;
        const extra = projectExtra || {};
        if (metadata) {
          extra["metadata"] = metadata;
        }
        const body = {
          name: projectName,
          extra,
          description
        };
        if (referenceDatasetId !== null) {
          body["reference_dataset_id"] = referenceDatasetId;
        }
        const response = await this.caller.call(_getFetchImplementation(), endpoint, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create project");
        const result = await response.json();
        return result;
      }
      async updateProject(projectId, { name = null, description = null, metadata = null, projectExtra = null, endTime = null }) {
        const endpoint = `${this.apiUrl}/sessions/${projectId}`;
        let extra = projectExtra;
        if (metadata) {
          extra = { ...extra || {}, metadata };
        }
        const body = {
          name,
          extra,
          description,
          end_time: endTime ? new Date(endTime).toISOString() : null
        };
        const response = await this.caller.call(_getFetchImplementation(), endpoint, {
          method: "PATCH",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update project");
        const result = await response.json();
        return result;
      }
      async hasProject({ projectId, projectName }) {
        let path = "/sessions";
        const params = new URLSearchParams();
        if (projectId !== void 0 && projectName !== void 0) {
          throw new Error("Must provide either projectName or projectId, not both");
        } else if (projectId !== void 0) {
          assertUuid(projectId);
          path += `/${projectId}`;
        } else if (projectName !== void 0) {
          params.append("name", projectName);
        } else {
          throw new Error("Must provide projectName or projectId");
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${path}?${params}`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        try {
          const result = await response.json();
          if (!response.ok) {
            return false;
          }
          if (Array.isArray(result)) {
            return result.length > 0;
          }
          return true;
        } catch (e) {
          return false;
        }
      }
      async readProject({ projectId, projectName, includeStats }) {
        let path = "/sessions";
        const params = new URLSearchParams();
        if (projectId !== void 0 && projectName !== void 0) {
          throw new Error("Must provide either projectName or projectId, not both");
        } else if (projectId !== void 0) {
          assertUuid(projectId);
          path += `/${projectId}`;
        } else if (projectName !== void 0) {
          params.append("name", projectName);
        } else {
          throw new Error("Must provide projectName or projectId");
        }
        if (includeStats !== void 0) {
          params.append("include_stats", includeStats.toString());
        }
        const response = await this._get(path, params);
        let result;
        if (Array.isArray(response)) {
          if (response.length === 0) {
            throw new Error(`Project[id=${projectId}, name=${projectName}] not found`);
          }
          result = response[0];
        } else {
          result = response;
        }
        return result;
      }
      async getProjectUrl({ projectId, projectName }) {
        if (projectId === void 0 && projectName === void 0) {
          throw new Error("Must provide either projectName or projectId");
        }
        const project = await this.readProject({ projectId, projectName });
        const tenantId = await this._getTenantId();
        return `${this.getHostUrl()}/o/${tenantId}/projects/p/${project.id}`;
      }
      async getDatasetUrl({ datasetId, datasetName }) {
        if (datasetId === void 0 && datasetName === void 0) {
          throw new Error("Must provide either datasetName or datasetId");
        }
        const dataset = await this.readDataset({ datasetId, datasetName });
        const tenantId = await this._getTenantId();
        return `${this.getHostUrl()}/o/${tenantId}/datasets/${dataset.id}`;
      }
      async _getTenantId() {
        if (this._tenantId !== null) {
          return this._tenantId;
        }
        const queryParams = new URLSearchParams({ limit: "1" });
        for await (const projects of this._getPaginated("/sessions", queryParams)) {
          this._tenantId = projects[0].tenant_id;
          return projects[0].tenant_id;
        }
        throw new Error("No projects found to resolve tenant.");
      }
      async *listProjects({ projectIds, name, nameContains, referenceDatasetId, referenceDatasetName, referenceFree, metadata } = {}) {
        const params = new URLSearchParams();
        if (projectIds !== void 0) {
          for (const projectId of projectIds) {
            params.append("id", projectId);
          }
        }
        if (name !== void 0) {
          params.append("name", name);
        }
        if (nameContains !== void 0) {
          params.append("name_contains", nameContains);
        }
        if (referenceDatasetId !== void 0) {
          params.append("reference_dataset", referenceDatasetId);
        } else if (referenceDatasetName !== void 0) {
          const dataset = await this.readDataset({
            datasetName: referenceDatasetName
          });
          params.append("reference_dataset", dataset.id);
        }
        if (referenceFree !== void 0) {
          params.append("reference_free", referenceFree.toString());
        }
        if (metadata !== void 0) {
          params.append("metadata", JSON.stringify(metadata));
        }
        for await (const projects of this._getPaginated("/sessions", params)) {
          yield* projects;
        }
      }
      async deleteProject({ projectId, projectName }) {
        let projectId_;
        if (projectId === void 0 && projectName === void 0) {
          throw new Error("Must provide projectName or projectId");
        } else if (projectId !== void 0 && projectName !== void 0) {
          throw new Error("Must provide either projectName or projectId, not both");
        } else if (projectId === void 0) {
          projectId_ = (await this.readProject({ projectName })).id;
        } else {
          projectId_ = projectId;
        }
        assertUuid(projectId_);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/sessions/${projectId_}`, {
          method: "DELETE",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, `delete session ${projectId_} (${projectName})`, true);
      }
      async uploadCsv({ csvFile, fileName, inputKeys, outputKeys, description, dataType, name }) {
        const url = `${this.apiUrl}/datasets/upload`;
        const formData = new FormData();
        formData.append("file", csvFile, fileName);
        inputKeys.forEach((key) => {
          formData.append("input_keys", key);
        });
        outputKeys.forEach((key) => {
          formData.append("output_keys", key);
        });
        if (description) {
          formData.append("description", description);
        }
        if (dataType) {
          formData.append("data_type", dataType);
        }
        if (name) {
          formData.append("name", name);
        }
        const response = await this.caller.call(_getFetchImplementation(), url, {
          method: "POST",
          headers: this.headers,
          body: formData,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "upload CSV");
        const result = await response.json();
        return result;
      }
      async createDataset(name, { description, dataType, inputsSchema, outputsSchema, metadata } = {}) {
        const body = {
          name,
          description,
          extra: metadata ? { metadata } : void 0
        };
        if (dataType) {
          body.data_type = dataType;
        }
        if (inputsSchema) {
          body.inputs_schema_definition = inputsSchema;
        }
        if (outputsSchema) {
          body.outputs_schema_definition = outputsSchema;
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create dataset");
        const result = await response.json();
        return result;
      }
      async readDataset({ datasetId, datasetName }) {
        let path = "/datasets";
        const params = new URLSearchParams({ limit: "1" });
        if (datasetId !== void 0 && datasetName !== void 0) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (datasetId !== void 0) {
          assertUuid(datasetId);
          path += `/${datasetId}`;
        } else if (datasetName !== void 0) {
          params.append("name", datasetName);
        } else {
          throw new Error("Must provide datasetName or datasetId");
        }
        const response = await this._get(path, params);
        let result;
        if (Array.isArray(response)) {
          if (response.length === 0) {
            throw new Error(`Dataset[id=${datasetId}, name=${datasetName}] not found`);
          }
          result = response[0];
        } else {
          result = response;
        }
        return result;
      }
      async hasDataset({ datasetId, datasetName }) {
        try {
          await this.readDataset({ datasetId, datasetName });
          return true;
        } catch (e) {
          if (
            // eslint-disable-next-line no-instanceof/no-instanceof
            e instanceof Error && e.message.toLocaleLowerCase().includes("not found")
          ) {
            return false;
          }
          throw e;
        }
      }
      async diffDatasetVersions({ datasetId, datasetName, fromVersion, toVersion }) {
        let datasetId_ = datasetId;
        if (datasetId_ === void 0 && datasetName === void 0) {
          throw new Error("Must provide either datasetName or datasetId");
        } else if (datasetId_ !== void 0 && datasetName !== void 0) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (datasetId_ === void 0) {
          const dataset = await this.readDataset({ datasetName });
          datasetId_ = dataset.id;
        }
        const urlParams = new URLSearchParams({
          from_version: typeof fromVersion === "string" ? fromVersion : fromVersion.toISOString(),
          to_version: typeof toVersion === "string" ? toVersion : toVersion.toISOString()
        });
        const response = await this._get(`/datasets/${datasetId_}/versions/diff`, urlParams);
        return response;
      }
      async readDatasetOpenaiFinetuning({ datasetId, datasetName }) {
        const path = "/datasets";
        if (datasetId !== void 0) {
        } else if (datasetName !== void 0) {
          datasetId = (await this.readDataset({ datasetName })).id;
        } else {
          throw new Error("Must provide datasetName or datasetId");
        }
        const response = await this._getResponse(`${path}/${datasetId}/openai_ft`);
        const datasetText = await response.text();
        const dataset = datasetText.trim().split("\n").map((line) => JSON.parse(line));
        return dataset;
      }
      async *listDatasets({ limit = 100, offset = 0, datasetIds, datasetName, datasetNameContains, metadata } = {}) {
        const path = "/datasets";
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString()
        });
        if (datasetIds !== void 0) {
          for (const id_ of datasetIds) {
            params.append("id", id_);
          }
        }
        if (datasetName !== void 0) {
          params.append("name", datasetName);
        }
        if (datasetNameContains !== void 0) {
          params.append("name_contains", datasetNameContains);
        }
        if (metadata !== void 0) {
          params.append("metadata", JSON.stringify(metadata));
        }
        for await (const datasets of this._getPaginated(path, params)) {
          yield* datasets;
        }
      }
      /**
       * Update a dataset
       * @param props The dataset details to update
       * @returns The updated dataset
       */
      async updateDataset(props) {
        const { datasetId, datasetName, ...update } = props;
        if (!datasetId && !datasetName) {
          throw new Error("Must provide either datasetName or datasetId");
        }
        const _datasetId = datasetId ?? (await this.readDataset({ datasetName })).id;
        assertUuid(_datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${_datasetId}`, {
          method: "PATCH",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(update),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update dataset");
        return await response.json();
      }
      async deleteDataset({ datasetId, datasetName }) {
        let path = "/datasets";
        let datasetId_ = datasetId;
        if (datasetId !== void 0 && datasetName !== void 0) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (datasetName !== void 0) {
          const dataset = await this.readDataset({ datasetName });
          datasetId_ = dataset.id;
        }
        if (datasetId_ !== void 0) {
          assertUuid(datasetId_);
          path += `/${datasetId_}`;
        } else {
          throw new Error("Must provide datasetName or datasetId");
        }
        const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
          method: "DELETE",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, `delete ${path}`);
        await response.json();
      }
      async indexDataset({ datasetId, datasetName, tag }) {
        let datasetId_ = datasetId;
        if (!datasetId_ && !datasetName) {
          throw new Error("Must provide either datasetName or datasetId");
        } else if (datasetId_ && datasetName) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (!datasetId_) {
          const dataset = await this.readDataset({ datasetName });
          datasetId_ = dataset.id;
        }
        assertUuid(datasetId_);
        const data = {
          tag
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId_}/index`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "index dataset");
        await response.json();
      }
      /**
       * Lets you run a similarity search query on a dataset.
       *
       * Requires the dataset to be indexed. Please see the `indexDataset` method to set up indexing.
       *
       * @param inputs      The input on which to run the similarity search. Must have the
       *                    same schema as the dataset.
       *
       * @param datasetId   The dataset to search for similar examples.
       *
       * @param limit       The maximum number of examples to return. Will return the top `limit` most
       *                    similar examples in order of most similar to least similar. If no similar
       *                    examples are found, random examples will be returned.
       *
       * @param filter      A filter string to apply to the search. Only examples will be returned that
       *                    match the filter string. Some examples of filters
       *
       *                    - eq(metadata.mykey, "value")
       *                    - and(neq(metadata.my.nested.key, "value"), neq(metadata.mykey, "value"))
       *                    - or(eq(metadata.mykey, "value"), eq(metadata.mykey, "othervalue"))
       *
       * @returns           A list of similar examples.
       *
       *
       * @example
       * dataset_id = "123e4567-e89b-12d3-a456-426614174000"
       * inputs = {"text": "How many people live in Berlin?"}
       * limit = 5
       * examples = await client.similarExamples(inputs, dataset_id, limit)
       */
      async similarExamples(inputs, datasetId, limit, { filter } = {}) {
        const data = {
          limit,
          inputs
        };
        if (filter !== void 0) {
          data["filter"] = filter;
        }
        assertUuid(datasetId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId}/search`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "fetch similar examples");
        const result = await response.json();
        return result["examples"];
      }
      async createExample(inputs, outputs, { datasetId, datasetName, createdAt, exampleId, metadata, split, sourceRunId }) {
        let datasetId_ = datasetId;
        if (datasetId_ === void 0 && datasetName === void 0) {
          throw new Error("Must provide either datasetName or datasetId");
        } else if (datasetId_ !== void 0 && datasetName !== void 0) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (datasetId_ === void 0) {
          const dataset = await this.readDataset({ datasetName });
          datasetId_ = dataset.id;
        }
        const createdAt_ = createdAt || /* @__PURE__ */ new Date();
        const data = {
          dataset_id: datasetId_,
          inputs,
          outputs,
          created_at: createdAt_?.toISOString(),
          id: exampleId,
          metadata,
          split,
          source_run_id: sourceRunId
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create example");
        const result = await response.json();
        return result;
      }
      async createExamples(props) {
        const { inputs, outputs, metadata, sourceRunIds, exampleIds, datasetId, datasetName } = props;
        let datasetId_ = datasetId;
        if (datasetId_ === void 0 && datasetName === void 0) {
          throw new Error("Must provide either datasetName or datasetId");
        } else if (datasetId_ !== void 0 && datasetName !== void 0) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (datasetId_ === void 0) {
          const dataset = await this.readDataset({ datasetName });
          datasetId_ = dataset.id;
        }
        const formattedExamples = inputs.map((input, idx) => {
          return {
            dataset_id: datasetId_,
            inputs: input,
            outputs: outputs ? outputs[idx] : void 0,
            metadata: metadata ? metadata[idx] : void 0,
            split: props.splits ? props.splits[idx] : void 0,
            id: exampleIds ? exampleIds[idx] : void 0,
            source_run_id: sourceRunIds ? sourceRunIds[idx] : void 0
          };
        });
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/bulk`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(formattedExamples),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create examples");
        const result = await response.json();
        return result;
      }
      async createLLMExample(input, generation, options) {
        return this.createExample({ input }, { output: generation }, options);
      }
      async createChatExample(input, generations, options) {
        const finalInput = input.map((message) => {
          if (isLangChainMessage(message)) {
            return convertLangChainMessageToExample(message);
          }
          return message;
        });
        const finalOutput = isLangChainMessage(generations) ? convertLangChainMessageToExample(generations) : generations;
        return this.createExample({ input: finalInput }, { output: finalOutput }, options);
      }
      async readExample(exampleId) {
        assertUuid(exampleId);
        const path = `/examples/${exampleId}`;
        const rawExample = await this._get(path);
        const { attachment_urls, ...rest } = rawExample;
        const example = rest;
        if (attachment_urls) {
          example.attachments = Object.entries(attachment_urls).reduce((acc, [key, value]) => {
            acc[key.slice("attachment.".length)] = {
              presigned_url: value.presigned_url
            };
            return acc;
          }, {});
        }
        return example;
      }
      async *listExamples({ datasetId, datasetName, exampleIds, asOf, splits, inlineS3Urls, metadata, limit, offset, filter, includeAttachments } = {}) {
        let datasetId_;
        if (datasetId !== void 0 && datasetName !== void 0) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (datasetId !== void 0) {
          datasetId_ = datasetId;
        } else if (datasetName !== void 0) {
          const dataset = await this.readDataset({ datasetName });
          datasetId_ = dataset.id;
        } else {
          throw new Error("Must provide a datasetName or datasetId");
        }
        const params = new URLSearchParams({ dataset: datasetId_ });
        const dataset_version = asOf ? typeof asOf === "string" ? asOf : asOf?.toISOString() : void 0;
        if (dataset_version) {
          params.append("as_of", dataset_version);
        }
        const inlineS3Urls_ = inlineS3Urls ?? true;
        params.append("inline_s3_urls", inlineS3Urls_.toString());
        if (exampleIds !== void 0) {
          for (const id_ of exampleIds) {
            params.append("id", id_);
          }
        }
        if (splits !== void 0) {
          for (const split of splits) {
            params.append("splits", split);
          }
        }
        if (metadata !== void 0) {
          const serializedMetadata = JSON.stringify(metadata);
          params.append("metadata", serializedMetadata);
        }
        if (limit !== void 0) {
          params.append("limit", limit.toString());
        }
        if (offset !== void 0) {
          params.append("offset", offset.toString());
        }
        if (filter !== void 0) {
          params.append("filter", filter);
        }
        if (includeAttachments === true) {
          ["attachment_urls", "outputs", "metadata"].forEach((field) => params.append("select", field));
        }
        let i = 0;
        for await (const rawExamples of this._getPaginated("/examples", params)) {
          for (const rawExample of rawExamples) {
            const { attachment_urls, ...rest } = rawExample;
            const example = rest;
            if (attachment_urls) {
              example.attachments = Object.entries(attachment_urls).reduce((acc, [key, value]) => {
                acc[key.slice("attachment.".length)] = {
                  presigned_url: value.presigned_url
                };
                return acc;
              }, {});
            }
            yield example;
            i++;
          }
          if (limit !== void 0 && i >= limit) {
            break;
          }
        }
      }
      async deleteExample(exampleId) {
        assertUuid(exampleId);
        const path = `/examples/${exampleId}`;
        const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
          method: "DELETE",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, `delete ${path}`);
        await response.json();
      }
      async updateExample(exampleId, update) {
        assertUuid(exampleId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/${exampleId}`, {
          method: "PATCH",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(update),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update example");
        const result = await response.json();
        return result;
      }
      async updateExamples(update) {
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/examples/bulk`, {
          method: "PATCH",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(update),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update examples");
        const result = await response.json();
        return result;
      }
      async listDatasetSplits({ datasetId, datasetName, asOf }) {
        let datasetId_;
        if (datasetId === void 0 && datasetName === void 0) {
          throw new Error("Must provide dataset name or ID");
        } else if (datasetId !== void 0 && datasetName !== void 0) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (datasetId === void 0) {
          const dataset = await this.readDataset({ datasetName });
          datasetId_ = dataset.id;
        } else {
          datasetId_ = datasetId;
        }
        assertUuid(datasetId_);
        const params = new URLSearchParams();
        const dataset_version = asOf ? typeof asOf === "string" ? asOf : asOf?.toISOString() : void 0;
        if (dataset_version) {
          params.append("as_of", dataset_version);
        }
        const response = await this._get(`/datasets/${datasetId_}/splits`, params);
        return response;
      }
      async updateDatasetSplits({ datasetId, datasetName, splitName, exampleIds, remove = false }) {
        let datasetId_;
        if (datasetId === void 0 && datasetName === void 0) {
          throw new Error("Must provide dataset name or ID");
        } else if (datasetId !== void 0 && datasetName !== void 0) {
          throw new Error("Must provide either datasetName or datasetId, not both");
        } else if (datasetId === void 0) {
          const dataset = await this.readDataset({ datasetName });
          datasetId_ = dataset.id;
        } else {
          datasetId_ = datasetId;
        }
        assertUuid(datasetId_);
        const data = {
          split_name: splitName,
          examples: exampleIds.map((id) => {
            assertUuid(id);
            return id;
          }),
          remove
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/${datasetId_}/splits`, {
          method: "PUT",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update dataset splits", true);
      }
      /**
       * @deprecated This method is deprecated and will be removed in future LangSmith versions, use `evaluate` from `langsmith/evaluation` instead.
       */
      async evaluateRun(run, evaluator, { sourceInfo, loadChildRuns, referenceExample } = { loadChildRuns: false }) {
        warnOnce("This method is deprecated and will be removed in future LangSmith versions, use `evaluate` from `langsmith/evaluation` instead.");
        let run_;
        if (typeof run === "string") {
          run_ = await this.readRun(run, { loadChildRuns });
        } else if (typeof run === "object" && "id" in run) {
          run_ = run;
        } else {
          throw new Error(`Invalid run type: ${typeof run}`);
        }
        if (run_.reference_example_id !== null && run_.reference_example_id !== void 0) {
          referenceExample = await this.readExample(run_.reference_example_id);
        }
        const feedbackResult = await evaluator.evaluateRun(run_, referenceExample);
        const [_, feedbacks] = await this._logEvaluationFeedback(feedbackResult, run_, sourceInfo);
        return feedbacks[0];
      }
      async createFeedback(runId, key, { score, value, correction, comment, sourceInfo, feedbackSourceType = "api", sourceRunId, feedbackId, feedbackConfig, projectId, comparativeExperimentId }) {
        if (!runId && !projectId) {
          throw new Error("One of runId or projectId must be provided");
        }
        if (runId && projectId) {
          throw new Error("Only one of runId or projectId can be provided");
        }
        const feedback_source = {
          type: feedbackSourceType ?? "api",
          metadata: sourceInfo ?? {}
        };
        if (sourceRunId !== void 0 && feedback_source?.metadata !== void 0 && !feedback_source.metadata["__run"]) {
          feedback_source.metadata["__run"] = { run_id: sourceRunId };
        }
        if (feedback_source?.metadata !== void 0 && feedback_source.metadata["__run"]?.run_id !== void 0) {
          assertUuid(feedback_source.metadata["__run"].run_id);
        }
        const feedback = {
          id: feedbackId ?? v4_default(),
          run_id: runId,
          key,
          score,
          value,
          correction,
          comment,
          feedback_source,
          comparative_experiment_id: comparativeExperimentId,
          feedbackConfig,
          session_id: projectId
        };
        const url = `${this.apiUrl}/feedback`;
        const response = await this.caller.call(_getFetchImplementation(), url, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(feedback),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create feedback", true);
        return feedback;
      }
      async updateFeedback(feedbackId, { score, value, correction, comment }) {
        const feedbackUpdate = {};
        if (score !== void 0 && score !== null) {
          feedbackUpdate["score"] = score;
        }
        if (value !== void 0 && value !== null) {
          feedbackUpdate["value"] = value;
        }
        if (correction !== void 0 && correction !== null) {
          feedbackUpdate["correction"] = correction;
        }
        if (comment !== void 0 && comment !== null) {
          feedbackUpdate["comment"] = comment;
        }
        assertUuid(feedbackId);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/feedback/${feedbackId}`, {
          method: "PATCH",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(feedbackUpdate),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update feedback", true);
      }
      async readFeedback(feedbackId) {
        assertUuid(feedbackId);
        const path = `/feedback/${feedbackId}`;
        const response = await this._get(path);
        return response;
      }
      async deleteFeedback(feedbackId) {
        assertUuid(feedbackId);
        const path = `/feedback/${feedbackId}`;
        const response = await this.caller.call(_getFetchImplementation(), this.apiUrl + path, {
          method: "DELETE",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, `delete ${path}`);
        await response.json();
      }
      async *listFeedback({ runIds, feedbackKeys, feedbackSourceTypes } = {}) {
        const queryParams = new URLSearchParams();
        if (runIds) {
          queryParams.append("run", runIds.join(","));
        }
        if (feedbackKeys) {
          for (const key of feedbackKeys) {
            queryParams.append("key", key);
          }
        }
        if (feedbackSourceTypes) {
          for (const type of feedbackSourceTypes) {
            queryParams.append("source", type);
          }
        }
        for await (const feedbacks of this._getPaginated("/feedback", queryParams)) {
          yield* feedbacks;
        }
      }
      /**
       * Creates a presigned feedback token and URL.
       *
       * The token can be used to authorize feedback metrics without
       * needing an API key. This is useful for giving browser-based
       * applications the ability to submit feedback without needing
       * to expose an API key.
       *
       * @param runId - The ID of the run.
       * @param feedbackKey - The feedback key.
       * @param options - Additional options for the token.
       * @param options.expiration - The expiration time for the token.
       *
       * @returns A promise that resolves to a FeedbackIngestToken.
       */
      async createPresignedFeedbackToken(runId, feedbackKey, { expiration, feedbackConfig } = {}) {
        const body = {
          run_id: runId,
          feedback_key: feedbackKey,
          feedback_config: feedbackConfig
        };
        if (expiration) {
          if (typeof expiration === "string") {
            body["expires_at"] = expiration;
          } else if (expiration?.hours || expiration?.minutes || expiration?.days) {
            body["expires_in"] = expiration;
          }
        } else {
          body["expires_in"] = {
            hours: 3
          };
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/feedback/tokens`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const result = await response.json();
        return result;
      }
      async createComparativeExperiment({ name, experimentIds, referenceDatasetId, createdAt, description, metadata, id }) {
        if (experimentIds.length === 0) {
          throw new Error("At least one experiment is required");
        }
        if (!referenceDatasetId) {
          referenceDatasetId = (await this.readProject({
            projectId: experimentIds[0]
          })).reference_dataset_id;
        }
        if (!referenceDatasetId == null) {
          throw new Error("A reference dataset is required");
        }
        const body = {
          id,
          name,
          experiment_ids: experimentIds,
          reference_dataset_id: referenceDatasetId,
          description,
          created_at: (createdAt ?? /* @__PURE__ */ new Date())?.toISOString(),
          extra: {}
        };
        if (metadata)
          body.extra["metadata"] = metadata;
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/datasets/comparative`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        return await response.json();
      }
      /**
       * Retrieves a list of presigned feedback tokens for a given run ID.
       * @param runId The ID of the run.
       * @returns An async iterable of FeedbackIngestToken objects.
       */
      async *listPresignedFeedbackTokens(runId) {
        assertUuid(runId);
        const params = new URLSearchParams({ run_id: runId });
        for await (const tokens of this._getPaginated("/feedback/tokens", params)) {
          yield* tokens;
        }
      }
      _selectEvalResults(results) {
        let results_;
        if ("results" in results) {
          results_ = results.results;
        } else {
          results_ = [results];
        }
        return results_;
      }
      async _logEvaluationFeedback(evaluatorResponse, run, sourceInfo) {
        const evalResults = this._selectEvalResults(evaluatorResponse);
        const feedbacks = [];
        for (const res of evalResults) {
          let sourceInfo_ = sourceInfo || {};
          if (res.evaluatorInfo) {
            sourceInfo_ = { ...res.evaluatorInfo, ...sourceInfo_ };
          }
          let runId_ = null;
          if (res.targetRunId) {
            runId_ = res.targetRunId;
          } else if (run) {
            runId_ = run.id;
          }
          feedbacks.push(await this.createFeedback(runId_, res.key, {
            score: res.score,
            value: res.value,
            comment: res.comment,
            correction: res.correction,
            sourceInfo: sourceInfo_,
            sourceRunId: res.sourceRunId,
            feedbackConfig: res.feedbackConfig,
            feedbackSourceType: "model"
          }));
        }
        return [evalResults, feedbacks];
      }
      async logEvaluationFeedback(evaluatorResponse, run, sourceInfo) {
        const [results] = await this._logEvaluationFeedback(evaluatorResponse, run, sourceInfo);
        return results;
      }
      /**
       * API for managing annotation queues
       */
      /**
       * List the annotation queues on the LangSmith API.
       * @param options - The options for listing annotation queues
       * @param options.queueIds - The IDs of the queues to filter by
       * @param options.name - The name of the queue to filter by
       * @param options.nameContains - The substring that the queue name should contain
       * @param options.limit - The maximum number of queues to return
       * @returns An iterator of AnnotationQueue objects
       */
      async *listAnnotationQueues(options = {}) {
        const { queueIds, name, nameContains, limit } = options;
        const params = new URLSearchParams();
        if (queueIds) {
          queueIds.forEach((id, i) => {
            assertUuid(id, `queueIds[${i}]`);
            params.append("ids", id);
          });
        }
        if (name)
          params.append("name", name);
        if (nameContains)
          params.append("name_contains", nameContains);
        params.append("limit", (limit !== void 0 ? Math.min(limit, 100) : 100).toString());
        let count = 0;
        for await (const queues of this._getPaginated("/annotation-queues", params)) {
          yield* queues;
          count++;
          if (limit !== void 0 && count >= limit)
            break;
        }
      }
      /**
       * Create an annotation queue on the LangSmith API.
       * @param options - The options for creating an annotation queue
       * @param options.name - The name of the annotation queue
       * @param options.description - The description of the annotation queue
       * @param options.queueId - The ID of the annotation queue
       * @returns The created AnnotationQueue object
       */
      async createAnnotationQueue(options) {
        const { name, description, queueId } = options;
        const body = {
          name,
          description,
          id: queueId || v4_default()
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== void 0))),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create annotation queue");
        const data = await response.json();
        return data;
      }
      /**
       * Read an annotation queue with the specified queue ID.
       * @param queueId - The ID of the annotation queue to read
       * @returns The AnnotationQueue object
       */
      async readAnnotationQueue(queueId) {
        const queueIteratorResult = await this.listAnnotationQueues({
          queueIds: [queueId]
        }).next();
        if (queueIteratorResult.done) {
          throw new Error(`Annotation queue with ID ${queueId} not found`);
        }
        return queueIteratorResult.value;
      }
      /**
       * Update an annotation queue with the specified queue ID.
       * @param queueId - The ID of the annotation queue to update
       * @param options - The options for updating the annotation queue
       * @param options.name - The new name for the annotation queue
       * @param options.description - The new description for the annotation queue
       */
      async updateAnnotationQueue(queueId, options) {
        const { name, description } = options;
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}`, {
          method: "PATCH",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update annotation queue");
      }
      /**
       * Delete an annotation queue with the specified queue ID.
       * @param queueId - The ID of the annotation queue to delete
       */
      async deleteAnnotationQueue(queueId) {
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}`, {
          method: "DELETE",
          headers: { ...this.headers, Accept: "application/json" },
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "delete annotation queue");
      }
      /**
       * Add runs to an annotation queue with the specified queue ID.
       * @param queueId - The ID of the annotation queue
       * @param runIds - The IDs of the runs to be added to the annotation queue
       */
      async addRunsToAnnotationQueue(queueId, runIds) {
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}/runs`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(runIds.map((id, i) => assertUuid(id, `runIds[${i}]`).toString())),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "add runs to annotation queue");
      }
      /**
       * Get a run from an annotation queue at the specified index.
       * @param queueId - The ID of the annotation queue
       * @param index - The index of the run to retrieve
       * @returns A Promise that resolves to a RunWithAnnotationQueueInfo object
       * @throws {Error} If the run is not found at the given index or for other API-related errors
       */
      async getRunFromAnnotationQueue(queueId, index) {
        const baseUrl = `/annotation-queues/${assertUuid(queueId, "queueId")}/run`;
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}${baseUrl}/${index}`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "get run from annotation queue");
        return await response.json();
      }
      /**
       * Delete a run from an an annotation queue.
       * @param queueId - The ID of the annotation queue to delete the run from
       * @param queueRunId - The ID of the run to delete from the annotation queue
       */
      async deleteRunFromAnnotationQueue(queueId, queueRunId) {
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}/runs/${assertUuid(queueRunId, "queueRunId")}`, {
          method: "DELETE",
          headers: { ...this.headers, Accept: "application/json" },
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "delete run from annotation queue");
      }
      /**
       * Get the size of an annotation queue.
       * @param queueId - The ID of the annotation queue
       */
      async getSizeFromAnnotationQueue(queueId) {
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/annotation-queues/${assertUuid(queueId, "queueId")}/size`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "get size from annotation queue");
        return await response.json();
      }
      async _currentTenantIsOwner(owner) {
        const settings = await this._getSettings();
        return owner == "-" || settings.tenant_handle === owner;
      }
      async _ownerConflictError(action, owner) {
        const settings = await this._getSettings();
        return new Error(`Cannot ${action} for another tenant.

      Current tenant: ${settings.tenant_handle}

      Requested tenant: ${owner}`);
      }
      async _getLatestCommitHash(promptOwnerAndName) {
        const res = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${promptOwnerAndName}/?limit=${1}&offset=${0}`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        const json = await res.json();
        if (!res.ok) {
          const detail = typeof json.detail === "string" ? json.detail : JSON.stringify(json.detail);
          const error = new Error(`Error ${res.status}: ${res.statusText}
${detail}`);
          error.statusCode = res.status;
          throw error;
        }
        if (json.commits.length === 0) {
          return void 0;
        }
        return json.commits[0].commit_hash;
      }
      async _likeOrUnlikePrompt(promptIdentifier, like) {
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/likes/${owner}/${promptName}`, {
          method: "POST",
          body: JSON.stringify({ like }),
          headers: { ...this.headers, "Content-Type": "application/json" },
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, `${like ? "like" : "unlike"} prompt`);
        return await response.json();
      }
      async _getPromptUrl(promptIdentifier) {
        const [owner, promptName, commitHash] = parsePromptIdentifier(promptIdentifier);
        if (!await this._currentTenantIsOwner(owner)) {
          if (commitHash !== "latest") {
            return `${this.getHostUrl()}/hub/${owner}/${promptName}/${commitHash.substring(0, 8)}`;
          } else {
            return `${this.getHostUrl()}/hub/${owner}/${promptName}`;
          }
        } else {
          const settings = await this._getSettings();
          if (commitHash !== "latest") {
            return `${this.getHostUrl()}/prompts/${promptName}/${commitHash.substring(0, 8)}?organizationId=${settings.id}`;
          } else {
            return `${this.getHostUrl()}/prompts/${promptName}?organizationId=${settings.id}`;
          }
        }
      }
      async promptExists(promptIdentifier) {
        const prompt = await this.getPrompt(promptIdentifier);
        return !!prompt;
      }
      async likePrompt(promptIdentifier) {
        return this._likeOrUnlikePrompt(promptIdentifier, true);
      }
      async unlikePrompt(promptIdentifier) {
        return this._likeOrUnlikePrompt(promptIdentifier, false);
      }
      async *listCommits(promptOwnerAndName) {
        for await (const commits of this._getPaginated(`/commits/${promptOwnerAndName}/`, new URLSearchParams(), (res) => res.commits)) {
          yield* commits;
        }
      }
      async *listPrompts(options) {
        const params = new URLSearchParams();
        params.append("sort_field", options?.sortField ?? "updated_at");
        params.append("sort_direction", "desc");
        params.append("is_archived", (!!options?.isArchived).toString());
        if (options?.isPublic !== void 0) {
          params.append("is_public", options.isPublic.toString());
        }
        if (options?.query) {
          params.append("query", options.query);
        }
        for await (const prompts of this._getPaginated("/repos", params, (res) => res.repos)) {
          yield* prompts;
        }
      }
      async getPrompt(promptIdentifier) {
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        if (response.status === 404) {
          return null;
        }
        await raiseForStatus(response, "get prompt");
        const result = await response.json();
        if (result.repo) {
          return result.repo;
        } else {
          return null;
        }
      }
      async createPrompt(promptIdentifier, options) {
        const settings = await this._getSettings();
        if (options?.isPublic && !settings.tenant_handle) {
          throw new Error(`Cannot create a public prompt without first

        creating a LangChain Hub handle. 
        You can add a handle by creating a public prompt at:

        https://smith.langchain.com/prompts`);
        }
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        if (!await this._currentTenantIsOwner(owner)) {
          throw await this._ownerConflictError("create a prompt", owner);
        }
        const data = {
          repo_handle: promptName,
          ...options?.description && { description: options.description },
          ...options?.readme && { readme: options.readme },
          ...options?.tags && { tags: options.tags },
          is_public: !!options?.isPublic
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create prompt");
        const { repo } = await response.json();
        return repo;
      }
      async createCommit(promptIdentifier, object, options) {
        if (!await this.promptExists(promptIdentifier)) {
          throw new Error("Prompt does not exist, you must create it first.");
        }
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        const resolvedParentCommitHash = options?.parentCommitHash === "latest" || !options?.parentCommitHash ? await this._getLatestCommitHash(`${owner}/${promptName}`) : options?.parentCommitHash;
        const payload = {
          manifest: JSON.parse(JSON.stringify(object)),
          parent_commit: resolvedParentCommitHash
        };
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${owner}/${promptName}`, {
          method: "POST",
          headers: { ...this.headers, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "create commit");
        const result = await response.json();
        return this._getPromptUrl(`${owner}/${promptName}${result.commit_hash ? `:${result.commit_hash}` : ""}`);
      }
      /**
       * Update examples with attachments using multipart form data.
       * @param updates List of ExampleUpdateWithAttachments objects to upsert
       * @returns Promise with the update response
       */
      async updateExamplesMultipart(datasetId, updates = []) {
        if (!await this._getMultiPartSupport()) {
          throw new Error("Your LangSmith version does not allow using the multipart examples endpoint, please update to the latest version.");
        }
        const formData = new FormData();
        for (const example of updates) {
          const exampleId = example.id;
          const exampleBody = {
            ...example.metadata && { metadata: example.metadata },
            ...example.split && { split: example.split }
          };
          const stringifiedExample = stringify(exampleBody);
          const exampleBlob = new Blob([stringifiedExample], {
            type: "application/json"
          });
          formData.append(exampleId, exampleBlob);
          if (example.inputs) {
            const stringifiedInputs = stringify(example.inputs);
            const inputsBlob = new Blob([stringifiedInputs], {
              type: "application/json"
            });
            formData.append(`${exampleId}.inputs`, inputsBlob);
          }
          if (example.outputs) {
            const stringifiedOutputs = stringify(example.outputs);
            const outputsBlob = new Blob([stringifiedOutputs], {
              type: "application/json"
            });
            formData.append(`${exampleId}.outputs`, outputsBlob);
          }
          if (example.attachments) {
            for (const [name, attachment] of Object.entries(example.attachments)) {
              let mimeType;
              let data;
              if (Array.isArray(attachment)) {
                [mimeType, data] = attachment;
              } else {
                mimeType = attachment.mimeType;
                data = attachment.data;
              }
              const attachmentBlob = new Blob([data], {
                type: `${mimeType}; length=${data.byteLength}`
              });
              formData.append(`${exampleId}.attachment.${name}`, attachmentBlob);
            }
          }
          if (example.attachments_operations) {
            const stringifiedAttachmentsOperations = stringify(example.attachments_operations);
            const attachmentsOperationsBlob = new Blob([stringifiedAttachmentsOperations], {
              type: "application/json"
            });
            formData.append(`${exampleId}.attachments_operations`, attachmentsOperationsBlob);
          }
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/v1/platform/datasets/${datasetId}/examples`, {
          method: "PATCH",
          headers: this.headers,
          body: formData
        });
        const result = await response.json();
        return result;
      }
      /**
       * Upload examples with attachments using multipart form data.
       * @param uploads List of ExampleUploadWithAttachments objects to upload
       * @returns Promise with the upload response
       */
      async uploadExamplesMultipart(datasetId, uploads = []) {
        if (!await this._getMultiPartSupport()) {
          throw new Error("Your LangSmith version does not allow using the multipart examples endpoint, please update to the latest version.");
        }
        const formData = new FormData();
        for (const example of uploads) {
          const exampleId = (example.id ?? v4_default()).toString();
          const exampleBody = {
            created_at: example.created_at,
            ...example.metadata && { metadata: example.metadata },
            ...example.split && { split: example.split }
          };
          const stringifiedExample = stringify(exampleBody);
          const exampleBlob = new Blob([stringifiedExample], {
            type: "application/json"
          });
          formData.append(exampleId, exampleBlob);
          const stringifiedInputs = stringify(example.inputs);
          const inputsBlob = new Blob([stringifiedInputs], {
            type: "application/json"
          });
          formData.append(`${exampleId}.inputs`, inputsBlob);
          if (example.outputs) {
            const stringifiedOutputs = stringify(example.outputs);
            const outputsBlob = new Blob([stringifiedOutputs], {
              type: "application/json"
            });
            formData.append(`${exampleId}.outputs`, outputsBlob);
          }
          if (example.attachments) {
            for (const [name, attachment] of Object.entries(example.attachments)) {
              let mimeType;
              let data;
              if (Array.isArray(attachment)) {
                [mimeType, data] = attachment;
              } else {
                mimeType = attachment.mimeType;
                data = attachment.data;
              }
              const attachmentBlob = new Blob([data], {
                type: `${mimeType}; length=${data.byteLength}`
              });
              formData.append(`${exampleId}.attachment.${name}`, attachmentBlob);
            }
          }
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/v1/platform/datasets/${datasetId}/examples`, {
          method: "POST",
          headers: this.headers,
          body: formData
        });
        const result = await response.json();
        return result;
      }
      async updatePrompt(promptIdentifier, options) {
        if (!await this.promptExists(promptIdentifier)) {
          throw new Error("Prompt does not exist, you must create it first.");
        }
        const [owner, promptName] = parsePromptIdentifier(promptIdentifier);
        if (!await this._currentTenantIsOwner(owner)) {
          throw await this._ownerConflictError("update a prompt", owner);
        }
        const payload = {};
        if (options?.description !== void 0)
          payload.description = options.description;
        if (options?.readme !== void 0)
          payload.readme = options.readme;
        if (options?.tags !== void 0)
          payload.tags = options.tags;
        if (options?.isPublic !== void 0)
          payload.is_public = options.isPublic;
        if (options?.isArchived !== void 0)
          payload.is_archived = options.isArchived;
        if (Object.keys(payload).length === 0) {
          throw new Error("No valid update options provided");
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
          headers: {
            ...this.headers,
            "Content-Type": "application/json"
          },
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "update prompt");
        return response.json();
      }
      async deletePrompt(promptIdentifier) {
        if (!await this.promptExists(promptIdentifier)) {
          throw new Error("Prompt does not exist, you must create it first.");
        }
        const [owner, promptName, _] = parsePromptIdentifier(promptIdentifier);
        if (!await this._currentTenantIsOwner(owner)) {
          throw await this._ownerConflictError("delete a prompt", owner);
        }
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/repos/${owner}/${promptName}`, {
          method: "DELETE",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        return await response.json();
      }
      async pullPromptCommit(promptIdentifier, options) {
        const [owner, promptName, commitHash] = parsePromptIdentifier(promptIdentifier);
        const response = await this.caller.call(_getFetchImplementation(), `${this.apiUrl}/commits/${owner}/${promptName}/${commitHash}${options?.includeModel ? "?include_model=true" : ""}`, {
          method: "GET",
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout_ms),
          ...this.fetchOptions
        });
        await raiseForStatus(response, "pull prompt commit");
        const result = await response.json();
        return {
          owner,
          repo: promptName,
          commit_hash: result.commit_hash,
          manifest: result.manifest,
          examples: result.examples
        };
      }
      /**
       * This method should not be used directly, use `import { pull } from "langchain/hub"` instead.
       * Using this method directly returns the JSON string of the prompt rather than a LangChain object.
       * @private
       */
      async _pullPrompt(promptIdentifier, options) {
        const promptObject = await this.pullPromptCommit(promptIdentifier, {
          includeModel: options?.includeModel
        });
        const prompt = JSON.stringify(promptObject.manifest);
        return prompt;
      }
      async pushPrompt(promptIdentifier, options) {
        if (await this.promptExists(promptIdentifier)) {
          if (options && Object.keys(options).some((key) => key !== "object")) {
            await this.updatePrompt(promptIdentifier, {
              description: options?.description,
              readme: options?.readme,
              tags: options?.tags,
              isPublic: options?.isPublic
            });
          }
        } else {
          await this.createPrompt(promptIdentifier, {
            description: options?.description,
            readme: options?.readme,
            tags: options?.tags,
            isPublic: options?.isPublic
          });
        }
        if (!options?.object) {
          return await this._getPromptUrl(promptIdentifier);
        }
        const url = await this.createCommit(promptIdentifier, options?.object, {
          parentCommitHash: options?.parentCommitHash
        });
        return url;
      }
      /**
         * Clone a public dataset to your own langsmith tenant.
         * This operation is idempotent. If you already have a dataset with the given name,
         * this function will do nothing.
      
         * @param {string} tokenOrUrl The token of the public dataset to clone.
         * @param {Object} [options] Additional options for cloning the dataset.
         * @param {string} [options.sourceApiUrl] The URL of the langsmith server where the data is hosted. Defaults to the API URL of your current client.
         * @param {string} [options.datasetName] The name of the dataset to create in your tenant. Defaults to the name of the public dataset.
         * @returns {Promise<void>}
         */
      async clonePublicDataset(tokenOrUrl, options = {}) {
        const { sourceApiUrl = this.apiUrl, datasetName } = options;
        const [parsedApiUrl, tokenUuid] = this.parseTokenOrUrl(tokenOrUrl, sourceApiUrl);
        const sourceClient = new _Client({
          apiUrl: parsedApiUrl,
          // Placeholder API key not needed anymore in most cases, but
          // some private deployments may have API key-based rate limiting
          // that would cause this to fail if we provide no value.
          apiKey: "placeholder"
        });
        const ds = await sourceClient.readSharedDataset(tokenUuid);
        const finalDatasetName = datasetName || ds.name;
        try {
          if (await this.hasDataset({ datasetId: finalDatasetName })) {
            console.log(`Dataset ${finalDatasetName} already exists in your tenant. Skipping.`);
            return;
          }
        } catch (_) {
        }
        const examples = await sourceClient.listSharedExamples(tokenUuid);
        const dataset = await this.createDataset(finalDatasetName, {
          description: ds.description,
          dataType: ds.data_type || "kv",
          inputsSchema: ds.inputs_schema_definition ?? void 0,
          outputsSchema: ds.outputs_schema_definition ?? void 0
        });
        try {
          await this.createExamples({
            inputs: examples.map((e) => e.inputs),
            outputs: examples.flatMap((e) => e.outputs ? [e.outputs] : []),
            datasetId: dataset.id
          });
        } catch (e) {
          console.error(`An error occurred while creating dataset ${finalDatasetName}. You should delete it manually.`);
          throw e;
        }
      }
      parseTokenOrUrl(urlOrToken, apiUrl, numParts = 2, kind = "dataset") {
        try {
          assertUuid(urlOrToken);
          return [apiUrl, urlOrToken];
        } catch (_) {
        }
        try {
          const parsedUrl = new URL(urlOrToken);
          const pathParts = parsedUrl.pathname.split("/").filter((part) => part !== "");
          if (pathParts.length >= numParts) {
            const tokenUuid = pathParts[pathParts.length - numParts];
            return [apiUrl, tokenUuid];
          } else {
            throw new Error(`Invalid public ${kind} URL: ${urlOrToken}`);
          }
        } catch (error) {
          throw new Error(`Invalid public ${kind} URL or token: ${urlOrToken}`);
        }
      }
      /**
       * Awaits all pending trace batches. Useful for environments where
       * you need to be sure that all tracing requests finish before execution ends,
       * such as serverless environments.
       *
       * @example
       * ```
       * import { Client } from "langsmith";
       *
       * const client = new Client();
       *
       * try {
       *   // Tracing happens here
       *   ...
       * } finally {
       *   await client.awaitPendingTraceBatches();
       * }
       * ```
       *
       * @returns A promise that resolves once all currently pending traces have sent.
       */
      awaitPendingTraceBatches() {
        if (this.manualFlushMode) {
          console.warn("[WARNING]: When tracing in manual flush mode, you must call `await client.flush()` manually to submit trace batches.");
          return Promise.resolve();
        }
        return Promise.all([
          ...this.autoBatchQueue.items.map(({ itemPromise }) => itemPromise),
          this.batchIngestCaller.queue.onIdle()
        ]);
      }
    };
  }
});

// node_modules/langsmith/dist/index.js
var __version__;
var init_dist = __esm({
  "node_modules/langsmith/dist/index.js"() {
    init_client();
    init_run_trees();
    init_fetch();
    __version__ = "0.2.15";
  }
});

// node_modules/langsmith/dist/utils/env.js
function getRuntimeEnvironment() {
  if (runtimeEnvironment === void 0) {
    const env = getEnv();
    const releaseEnv = getShas();
    runtimeEnvironment = {
      library: "langsmith",
      runtime: env,
      sdk: "langsmith-js",
      sdk_version: __version__,
      ...releaseEnv
    };
  }
  return runtimeEnvironment;
}
function getLangChainEnvVarsMetadata() {
  const allEnvVars = getEnvironmentVariables() || {};
  const envVars = {};
  const excluded = [
    "LANGCHAIN_API_KEY",
    "LANGCHAIN_ENDPOINT",
    "LANGCHAIN_TRACING_V2",
    "LANGCHAIN_PROJECT",
    "LANGCHAIN_SESSION",
    "LANGSMITH_API_KEY",
    "LANGSMITH_ENDPOINT",
    "LANGSMITH_TRACING_V2",
    "LANGSMITH_PROJECT",
    "LANGSMITH_SESSION"
  ];
  for (const [key, value] of Object.entries(allEnvVars)) {
    if ((key.startsWith("LANGCHAIN_") || key.startsWith("LANGSMITH_")) && typeof value === "string" && !excluded.includes(key) && !key.toLowerCase().includes("key") && !key.toLowerCase().includes("secret") && !key.toLowerCase().includes("token")) {
      if (key === "LANGCHAIN_REVISION_ID") {
        envVars["revision_id"] = value;
      } else {
        envVars[key] = value;
      }
    }
  }
  return envVars;
}
function getEnvironmentVariables() {
  try {
    if (typeof process !== "undefined" && process.env) {
      return Object.entries(process.env).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {});
    }
    return void 0;
  } catch (e) {
    return void 0;
  }
}
function getEnvironmentVariable(name) {
  try {
    return typeof process !== "undefined" ? (
      // eslint-disable-next-line no-process-env
      process.env?.[name]
    ) : void 0;
  } catch (e) {
    return void 0;
  }
}
function getLangSmithEnvironmentVariable(name) {
  return getEnvironmentVariable(`LANGSMITH_${name}`) || getEnvironmentVariable(`LANGCHAIN_${name}`);
}
function getShas() {
  if (cachedCommitSHAs !== void 0) {
    return cachedCommitSHAs;
  }
  const common_release_envs = [
    "VERCEL_GIT_COMMIT_SHA",
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA",
    "COMMIT_REF",
    "RENDER_GIT_COMMIT",
    "CI_COMMIT_SHA",
    "CIRCLE_SHA1",
    "CF_PAGES_COMMIT_SHA",
    "REACT_APP_GIT_SHA",
    "SOURCE_VERSION",
    "GITHUB_SHA",
    "TRAVIS_COMMIT",
    "GIT_COMMIT",
    "BUILD_VCS_NUMBER",
    "bamboo_planRepository_revision",
    "Build.SourceVersion",
    "BITBUCKET_COMMIT",
    "DRONE_COMMIT_SHA",
    "SEMAPHORE_GIT_SHA",
    "BUILDKITE_COMMIT"
  ];
  const shas = {};
  for (const env of common_release_envs) {
    const envVar = getEnvironmentVariable(env);
    if (envVar !== void 0) {
      shas[env] = envVar;
    }
  }
  cachedCommitSHAs = shas;
  return shas;
}
var globalEnv, isBrowser, isWebWorker, isJsDom, isDeno, isNode, getEnv, runtimeEnvironment, cachedCommitSHAs;
var init_env = __esm({
  "node_modules/langsmith/dist/utils/env.js"() {
    init_dist();
    isBrowser = () => typeof window !== "undefined" && typeof window.document !== "undefined";
    isWebWorker = () => typeof globalThis === "object" && globalThis.constructor && globalThis.constructor.name === "DedicatedWorkerGlobalScope";
    isJsDom = () => typeof window !== "undefined" && window.name === "nodejs" || typeof navigator !== "undefined" && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
    isDeno = () => typeof Deno !== "undefined";
    isNode = () => typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined" && !isDeno();
    getEnv = () => {
      if (globalEnv) {
        return globalEnv;
      }
      if (isBrowser()) {
        globalEnv = "browser";
      } else if (isNode()) {
        globalEnv = "node";
      } else if (isWebWorker()) {
        globalEnv = "webworker";
      } else if (isJsDom()) {
        globalEnv = "jsdom";
      } else if (isDeno()) {
        globalEnv = "deno";
      } else {
        globalEnv = "other";
      }
      return globalEnv;
    };
  }
});

// node_modules/langsmith/dist/env.js
var isTracingEnabled;
var init_env2 = __esm({
  "node_modules/langsmith/dist/env.js"() {
    init_env();
    isTracingEnabled = (tracingEnabled) => {
      if (tracingEnabled !== void 0) {
        return tracingEnabled;
      }
      const envVars = ["TRACING_V2", "TRACING"];
      return !!envVars.find((envVar) => getLangSmithEnvironmentVariable(envVar) === "true");
    };
  }
});

// node_modules/langsmith/dist/singletons/constants.js
var _LC_CONTEXT_VARIABLES_KEY;
var init_constants = __esm({
  "node_modules/langsmith/dist/singletons/constants.js"() {
    _LC_CONTEXT_VARIABLES_KEY = Symbol.for("lc:context_variables");
  }
});

// node_modules/langsmith/dist/run_trees.js
function stripNonAlphanumeric(input) {
  return input.replace(/[-:.]/g, "");
}
function convertToDottedOrderFormat(epoch, runId, executionOrder = 1) {
  const paddedOrder = executionOrder.toFixed(0).slice(0, 3).padStart(3, "0");
  return stripNonAlphanumeric(`${new Date(epoch).toISOString().slice(0, -1)}${paddedOrder}Z`) + runId;
}
function isRunTree(x) {
  return x !== void 0 && typeof x.createChild === "function" && typeof x.postRun === "function";
}
function isLangChainTracerLike(x) {
  return typeof x === "object" && x != null && typeof x.name === "string" && x.name === "langchain_tracer";
}
function containsLangChainTracerLike(x) {
  return Array.isArray(x) && x.some((callback) => isLangChainTracerLike(callback));
}
function isCallbackManagerLike(x) {
  return typeof x === "object" && x != null && Array.isArray(x.handlers);
}
function isRunnableConfigLike(x) {
  return x !== void 0 && typeof x.callbacks === "object" && // Callback manager with a langchain tracer
  (containsLangChainTracerLike(x.callbacks?.handlers) || // Or it's an array with a LangChainTracerLike object within it
  containsLangChainTracerLike(x.callbacks));
}
var Baggage, RunTree;
var init_run_trees = __esm({
  "node_modules/langsmith/dist/run_trees.js"() {
    init_esm_browser();
    init_env();
    init_client();
    init_env2();
    init_warn();
    init_constants();
    Baggage = class _Baggage {
      constructor(metadata, tags) {
        Object.defineProperty(this, "metadata", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "tags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.metadata = metadata;
        this.tags = tags;
      }
      static fromHeader(value) {
        const items = value.split(",");
        let metadata = {};
        let tags = [];
        for (const item of items) {
          const [key, uriValue] = item.split("=");
          const value2 = decodeURIComponent(uriValue);
          if (key === "langsmith-metadata") {
            metadata = JSON.parse(value2);
          } else if (key === "langsmith-tags") {
            tags = value2.split(",");
          }
        }
        return new _Baggage(metadata, tags);
      }
      toHeader() {
        const items = [];
        if (this.metadata && Object.keys(this.metadata).length > 0) {
          items.push(`langsmith-metadata=${encodeURIComponent(JSON.stringify(this.metadata))}`);
        }
        if (this.tags && this.tags.length > 0) {
          items.push(`langsmith-tags=${encodeURIComponent(this.tags.join(","))}`);
        }
        return items.join(",");
      }
    };
    RunTree = class _RunTree {
      constructor(originalConfig) {
        Object.defineProperty(this, "id", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "run_type", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "project_name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "parent_run", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "child_runs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "start_time", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "end_time", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "extra", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "tags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "error", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "serialized", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "inputs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "outputs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "reference_example_id", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "client", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "events", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "trace_id", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "dotted_order", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "tracingEnabled", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "execution_order", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "child_execution_order", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "attachments", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        if (isRunTree(originalConfig)) {
          Object.assign(this, { ...originalConfig });
          return;
        }
        const defaultConfig = _RunTree.getDefaultConfig();
        const { metadata, ...config } = originalConfig;
        const client2 = config.client ?? _RunTree.getSharedClient();
        const dedupedMetadata = {
          ...metadata,
          ...config?.extra?.metadata
        };
        config.extra = { ...config.extra, metadata: dedupedMetadata };
        Object.assign(this, { ...defaultConfig, ...config, client: client2 });
        if (!this.trace_id) {
          if (this.parent_run) {
            this.trace_id = this.parent_run.trace_id ?? this.id;
          } else {
            this.trace_id = this.id;
          }
        }
        this.execution_order ?? (this.execution_order = 1);
        this.child_execution_order ?? (this.child_execution_order = 1);
        if (!this.dotted_order) {
          const currentDottedOrder = convertToDottedOrderFormat(this.start_time, this.id, this.execution_order);
          if (this.parent_run) {
            this.dotted_order = this.parent_run.dotted_order + "." + currentDottedOrder;
          } else {
            this.dotted_order = currentDottedOrder;
          }
        }
      }
      static getDefaultConfig() {
        return {
          id: v4_default(),
          run_type: "chain",
          project_name: getEnvironmentVariable("LANGCHAIN_PROJECT") ?? getEnvironmentVariable("LANGCHAIN_SESSION") ?? // TODO: Deprecate
          "default",
          child_runs: [],
          api_url: getEnvironmentVariable("LANGCHAIN_ENDPOINT") ?? "http://localhost:1984",
          api_key: getEnvironmentVariable("LANGCHAIN_API_KEY"),
          caller_options: {},
          start_time: Date.now(),
          serialized: {},
          inputs: {},
          extra: {}
        };
      }
      static getSharedClient() {
        if (!_RunTree.sharedClient) {
          _RunTree.sharedClient = new Client();
        }
        return _RunTree.sharedClient;
      }
      createChild(config) {
        const child_execution_order = this.child_execution_order + 1;
        const child = new _RunTree({
          ...config,
          parent_run: this,
          project_name: this.project_name,
          client: this.client,
          tracingEnabled: this.tracingEnabled,
          execution_order: child_execution_order,
          child_execution_order
        });
        if (_LC_CONTEXT_VARIABLES_KEY in this) {
          child[_LC_CONTEXT_VARIABLES_KEY] = this[_LC_CONTEXT_VARIABLES_KEY];
        }
        const LC_CHILD = Symbol.for("lc:child_config");
        const presentConfig = config.extra?.[LC_CHILD] ?? this.extra[LC_CHILD];
        if (isRunnableConfigLike(presentConfig)) {
          const newConfig = { ...presentConfig };
          const callbacks = isCallbackManagerLike(newConfig.callbacks) ? newConfig.callbacks.copy?.() : void 0;
          if (callbacks) {
            Object.assign(callbacks, { _parentRunId: child.id });
            callbacks.handlers?.find(isLangChainTracerLike)?.updateFromRunTree?.(child);
            newConfig.callbacks = callbacks;
          }
          child.extra[LC_CHILD] = newConfig;
        }
        const visited = /* @__PURE__ */ new Set();
        let current = this;
        while (current != null && !visited.has(current.id)) {
          visited.add(current.id);
          current.child_execution_order = Math.max(current.child_execution_order, child_execution_order);
          current = current.parent_run;
        }
        this.child_runs.push(child);
        return child;
      }
      async end(outputs, error, endTime = Date.now(), metadata) {
        this.outputs = this.outputs ?? outputs;
        this.error = this.error ?? error;
        this.end_time = this.end_time ?? endTime;
        if (metadata && Object.keys(metadata).length > 0) {
          this.extra = this.extra ? { ...this.extra, metadata: { ...this.extra.metadata, ...metadata } } : { metadata };
        }
      }
      _convertToCreate(run, runtimeEnv, excludeChildRuns = true) {
        const runExtra = run.extra ?? {};
        if (!runExtra.runtime) {
          runExtra.runtime = {};
        }
        if (runtimeEnv) {
          for (const [k, v] of Object.entries(runtimeEnv)) {
            if (!runExtra.runtime[k]) {
              runExtra.runtime[k] = v;
            }
          }
        }
        let child_runs;
        let parent_run_id;
        if (!excludeChildRuns) {
          child_runs = run.child_runs.map((child_run) => this._convertToCreate(child_run, runtimeEnv, excludeChildRuns));
          parent_run_id = void 0;
        } else {
          parent_run_id = run.parent_run?.id;
          child_runs = [];
        }
        const persistedRun = {
          id: run.id,
          name: run.name,
          start_time: run.start_time,
          end_time: run.end_time,
          run_type: run.run_type,
          reference_example_id: run.reference_example_id,
          extra: runExtra,
          serialized: run.serialized,
          error: run.error,
          inputs: run.inputs,
          outputs: run.outputs,
          session_name: run.project_name,
          child_runs,
          parent_run_id,
          trace_id: run.trace_id,
          dotted_order: run.dotted_order,
          tags: run.tags,
          attachments: run.attachments
        };
        return persistedRun;
      }
      async postRun(excludeChildRuns = true) {
        try {
          const runtimeEnv = getRuntimeEnvironment();
          const runCreate = await this._convertToCreate(this, runtimeEnv, true);
          await this.client.createRun(runCreate);
          if (!excludeChildRuns) {
            warnOnce("Posting with excludeChildRuns=false is deprecated and will be removed in a future version.");
            for (const childRun of this.child_runs) {
              await childRun.postRun(false);
            }
          }
        } catch (error) {
          console.error(`Error in postRun for run ${this.id}:`, error);
        }
      }
      async patchRun() {
        try {
          const runUpdate = {
            end_time: this.end_time,
            error: this.error,
            inputs: this.inputs,
            outputs: this.outputs,
            parent_run_id: this.parent_run?.id,
            reference_example_id: this.reference_example_id,
            extra: this.extra,
            events: this.events,
            dotted_order: this.dotted_order,
            trace_id: this.trace_id,
            tags: this.tags,
            attachments: this.attachments
          };
          await this.client.updateRun(this.id, runUpdate);
        } catch (error) {
          console.error(`Error in patchRun for run ${this.id}`, error);
        }
      }
      toJSON() {
        return this._convertToCreate(this, void 0, false);
      }
      static fromRunnableConfig(parentConfig, props) {
        const callbackManager = parentConfig?.callbacks;
        let parentRun;
        let projectName;
        let client2;
        let tracingEnabled = isTracingEnabled();
        if (callbackManager) {
          const parentRunId = callbackManager?.getParentRunId?.() ?? "";
          const langChainTracer = callbackManager?.handlers?.find((handler) => handler?.name == "langchain_tracer");
          parentRun = langChainTracer?.getRun?.(parentRunId);
          projectName = langChainTracer?.projectName;
          client2 = langChainTracer?.client;
          tracingEnabled = tracingEnabled || !!langChainTracer;
        }
        if (!parentRun) {
          return new _RunTree({
            ...props,
            client: client2,
            tracingEnabled,
            project_name: projectName
          });
        }
        const parentRunTree = new _RunTree({
          name: parentRun.name,
          id: parentRun.id,
          trace_id: parentRun.trace_id,
          dotted_order: parentRun.dotted_order,
          client: client2,
          tracingEnabled,
          project_name: projectName,
          tags: [
            ...new Set((parentRun?.tags ?? []).concat(parentConfig?.tags ?? []))
          ],
          extra: {
            metadata: {
              ...parentRun?.extra?.metadata,
              ...parentConfig?.metadata
            }
          }
        });
        return parentRunTree.createChild(props);
      }
      static fromDottedOrder(dottedOrder) {
        return this.fromHeaders({ "langsmith-trace": dottedOrder });
      }
      static fromHeaders(headers, inheritArgs) {
        const rawHeaders = "get" in headers && typeof headers.get === "function" ? {
          "langsmith-trace": headers.get("langsmith-trace"),
          baggage: headers.get("baggage")
        } : headers;
        const headerTrace = rawHeaders["langsmith-trace"];
        if (!headerTrace || typeof headerTrace !== "string")
          return void 0;
        const parentDottedOrder = headerTrace.trim();
        const parsedDottedOrder = parentDottedOrder.split(".").map((part) => {
          const [strTime, uuid] = part.split("Z");
          return { strTime, time: Date.parse(strTime + "Z"), uuid };
        });
        const traceId = parsedDottedOrder[0].uuid;
        const config = {
          ...inheritArgs,
          name: inheritArgs?.["name"] ?? "parent",
          run_type: inheritArgs?.["run_type"] ?? "chain",
          start_time: inheritArgs?.["start_time"] ?? Date.now(),
          id: parsedDottedOrder.at(-1)?.uuid,
          trace_id: traceId,
          dotted_order: parentDottedOrder
        };
        if (rawHeaders["baggage"] && typeof rawHeaders["baggage"] === "string") {
          const baggage = Baggage.fromHeader(rawHeaders["baggage"]);
          config.metadata = baggage.metadata;
          config.tags = baggage.tags;
        }
        return new _RunTree(config);
      }
      toHeaders(headers) {
        const result = {
          "langsmith-trace": this.dotted_order,
          baggage: new Baggage(this.extra?.metadata, this.tags).toHeader()
        };
        if (headers) {
          for (const [key, value] of Object.entries(result)) {
            headers.set(key, value);
          }
        }
        return result;
      }
    };
    Object.defineProperty(RunTree, "sharedClient", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null
    });
  }
});

// node_modules/langsmith/dist/singletons/traceable.js
var MockAsyncLocalStorage, TRACING_ALS_KEY, mockAsyncLocalStorage, AsyncLocalStorageProvider, AsyncLocalStorageProviderSingleton, getCurrentRunTree, ROOT;
var init_traceable = __esm({
  "node_modules/langsmith/dist/singletons/traceable.js"() {
    init_run_trees();
    MockAsyncLocalStorage = class {
      getStore() {
        return void 0;
      }
      run(_, callback) {
        return callback();
      }
    };
    TRACING_ALS_KEY = Symbol.for("ls:tracing_async_local_storage");
    mockAsyncLocalStorage = new MockAsyncLocalStorage();
    AsyncLocalStorageProvider = class {
      getInstance() {
        return globalThis[TRACING_ALS_KEY] ?? mockAsyncLocalStorage;
      }
      initializeGlobalInstance(instance) {
        if (globalThis[TRACING_ALS_KEY] === void 0) {
          globalThis[TRACING_ALS_KEY] = instance;
        }
      }
    };
    AsyncLocalStorageProviderSingleton = new AsyncLocalStorageProvider();
    getCurrentRunTree = () => {
      const runTree = AsyncLocalStorageProviderSingleton.getInstance().getStore();
      if (!isRunTree(runTree)) {
        throw new Error([
          "Could not get the current run tree.",
          "",
          "Please make sure you are calling this method within a traceable function or the tracing is enabled."
        ].join("\n"));
      }
      return runTree;
    };
    ROOT = Symbol.for("langsmith:traceable:root");
  }
});

// node_modules/langsmith/singletons/traceable.js
var init_traceable2 = __esm({
  "node_modules/langsmith/singletons/traceable.js"() {
    init_traceable();
  }
});

// node_modules/@langchain/core/dist/utils/fast-json-patch/src/helpers.js
function hasOwnProperty(obj, key) {
  return _hasOwnProperty.call(obj, key);
}
function _objectKeys(obj) {
  if (Array.isArray(obj)) {
    const keys2 = new Array(obj.length);
    for (let k = 0; k < keys2.length; k++) {
      keys2[k] = "" + k;
    }
    return keys2;
  }
  if (Object.keys) {
    return Object.keys(obj);
  }
  let keys = [];
  for (let i in obj) {
    if (hasOwnProperty(obj, i)) {
      keys.push(i);
    }
  }
  return keys;
}
function _deepClone(obj) {
  switch (typeof obj) {
    case "object":
      return JSON.parse(JSON.stringify(obj));
    //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
    case "undefined":
      return null;
    //this is how JSON.stringify behaves for array items
    default:
      return obj;
  }
}
function isInteger(str) {
  let i = 0;
  const len = str.length;
  let charCode;
  while (i < len) {
    charCode = str.charCodeAt(i);
    if (charCode >= 48 && charCode <= 57) {
      i++;
      continue;
    }
    return false;
  }
  return true;
}
function escapePathComponent(path) {
  if (path.indexOf("/") === -1 && path.indexOf("~") === -1)
    return path;
  return path.replace(/~/g, "~0").replace(/\//g, "~1");
}
function unescapePathComponent(path) {
  return path.replace(/~1/g, "/").replace(/~0/g, "~");
}
function hasUndefined(obj) {
  if (obj === void 0) {
    return true;
  }
  if (obj) {
    if (Array.isArray(obj)) {
      for (let i2 = 0, len = obj.length; i2 < len; i2++) {
        if (hasUndefined(obj[i2])) {
          return true;
        }
      }
    } else if (typeof obj === "object") {
      const objKeys = _objectKeys(obj);
      const objKeysLength = objKeys.length;
      for (var i = 0; i < objKeysLength; i++) {
        if (hasUndefined(obj[objKeys[i]])) {
          return true;
        }
      }
    }
  }
  return false;
}
function patchErrorMessageFormatter(message, args) {
  const messageParts = [message];
  for (const key in args) {
    const value = typeof args[key] === "object" ? JSON.stringify(args[key], null, 2) : args[key];
    if (typeof value !== "undefined") {
      messageParts.push(`${key}: ${value}`);
    }
  }
  return messageParts.join("\n");
}
var _hasOwnProperty, PatchError;
var init_helpers = __esm({
  "node_modules/@langchain/core/dist/utils/fast-json-patch/src/helpers.js"() {
    _hasOwnProperty = Object.prototype.hasOwnProperty;
    PatchError = class extends Error {
      constructor(message, name, index, operation, tree) {
        super(patchErrorMessageFormatter(message, { name, index, operation, tree }));
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: name
        });
        Object.defineProperty(this, "index", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: index
        });
        Object.defineProperty(this, "operation", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: operation
        });
        Object.defineProperty(this, "tree", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: tree
        });
        Object.setPrototypeOf(this, new.target.prototype);
        this.message = patchErrorMessageFormatter(message, {
          name,
          index,
          operation,
          tree
        });
      }
    };
  }
});

// node_modules/@langchain/core/dist/utils/fast-json-patch/src/core.js
var core_exports = {};
__export(core_exports, {
  JsonPatchError: () => JsonPatchError,
  _areEquals: () => _areEquals,
  applyOperation: () => applyOperation,
  applyPatch: () => applyPatch,
  applyReducer: () => applyReducer,
  deepClone: () => deepClone,
  getValueByPointer: () => getValueByPointer,
  validate: () => validate2,
  validator: () => validator
});
function getValueByPointer(document2, pointer) {
  if (pointer == "") {
    return document2;
  }
  var getOriginalDestination = { op: "_get", path: pointer };
  applyOperation(document2, getOriginalDestination);
  return getOriginalDestination.value;
}
function applyOperation(document2, operation, validateOperation = false, mutateDocument = true, banPrototypeModifications = true, index = 0) {
  if (validateOperation) {
    if (typeof validateOperation == "function") {
      validateOperation(operation, 0, document2, operation.path);
    } else {
      validator(operation, 0);
    }
  }
  if (operation.path === "") {
    let returnValue = { newDocument: document2 };
    if (operation.op === "add") {
      returnValue.newDocument = operation.value;
      return returnValue;
    } else if (operation.op === "replace") {
      returnValue.newDocument = operation.value;
      returnValue.removed = document2;
      return returnValue;
    } else if (operation.op === "move" || operation.op === "copy") {
      returnValue.newDocument = getValueByPointer(document2, operation.from);
      if (operation.op === "move") {
        returnValue.removed = document2;
      }
      return returnValue;
    } else if (operation.op === "test") {
      returnValue.test = _areEquals(document2, operation.value);
      if (returnValue.test === false) {
        throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document2);
      }
      returnValue.newDocument = document2;
      return returnValue;
    } else if (operation.op === "remove") {
      returnValue.removed = document2;
      returnValue.newDocument = null;
      return returnValue;
    } else if (operation.op === "_get") {
      operation.value = document2;
      return returnValue;
    } else {
      if (validateOperation) {
        throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", index, operation, document2);
      } else {
        return returnValue;
      }
    }
  } else {
    if (!mutateDocument) {
      document2 = _deepClone(document2);
    }
    const path = operation.path || "";
    const keys = path.split("/");
    let obj = document2;
    let t = 1;
    let len = keys.length;
    let existingPathFragment = void 0;
    let key;
    let validateFunction;
    if (typeof validateOperation == "function") {
      validateFunction = validateOperation;
    } else {
      validateFunction = validator;
    }
    while (true) {
      key = keys[t];
      if (key && key.indexOf("~") != -1) {
        key = unescapePathComponent(key);
      }
      if (banPrototypeModifications && (key == "__proto__" || key == "prototype" && t > 0 && keys[t - 1] == "constructor")) {
        throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");
      }
      if (validateOperation) {
        if (existingPathFragment === void 0) {
          if (obj[key] === void 0) {
            existingPathFragment = keys.slice(0, t).join("/");
          } else if (t == len - 1) {
            existingPathFragment = operation.path;
          }
          if (existingPathFragment !== void 0) {
            validateFunction(operation, 0, document2, existingPathFragment);
          }
        }
      }
      t++;
      if (Array.isArray(obj)) {
        if (key === "-") {
          key = obj.length;
        } else {
          if (validateOperation && !isInteger(key)) {
            throw new JsonPatchError("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index", "OPERATION_PATH_ILLEGAL_ARRAY_INDEX", index, operation, document2);
          } else if (isInteger(key)) {
            key = ~~key;
          }
        }
        if (t >= len) {
          if (validateOperation && operation.op === "add" && key > obj.length) {
            throw new JsonPatchError("The specified index MUST NOT be greater than the number of elements in the array", "OPERATION_VALUE_OUT_OF_BOUNDS", index, operation, document2);
          }
          const returnValue = arrOps[operation.op].call(operation, obj, key, document2);
          if (returnValue.test === false) {
            throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document2);
          }
          return returnValue;
        }
      } else {
        if (t >= len) {
          const returnValue = objOps[operation.op].call(operation, obj, key, document2);
          if (returnValue.test === false) {
            throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document2);
          }
          return returnValue;
        }
      }
      obj = obj[key];
      if (validateOperation && t < len && (!obj || typeof obj !== "object")) {
        throw new JsonPatchError("Cannot perform operation at the desired path", "OPERATION_PATH_UNRESOLVABLE", index, operation, document2);
      }
    }
  }
}
function applyPatch(document2, patch, validateOperation, mutateDocument = true, banPrototypeModifications = true) {
  if (validateOperation) {
    if (!Array.isArray(patch)) {
      throw new JsonPatchError("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    }
  }
  if (!mutateDocument) {
    document2 = _deepClone(document2);
  }
  const results = new Array(patch.length);
  for (let i = 0, length = patch.length; i < length; i++) {
    results[i] = applyOperation(document2, patch[i], validateOperation, true, banPrototypeModifications, i);
    document2 = results[i].newDocument;
  }
  results.newDocument = document2;
  return results;
}
function applyReducer(document2, operation, index) {
  const operationResult = applyOperation(document2, operation);
  if (operationResult.test === false) {
    throw new JsonPatchError("Test operation failed", "TEST_OPERATION_FAILED", index, operation, document2);
  }
  return operationResult.newDocument;
}
function validator(operation, index, document2, existingPathFragment) {
  if (typeof operation !== "object" || operation === null || Array.isArray(operation)) {
    throw new JsonPatchError("Operation is not an object", "OPERATION_NOT_AN_OBJECT", index, operation, document2);
  } else if (!objOps[operation.op]) {
    throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902", "OPERATION_OP_INVALID", index, operation, document2);
  } else if (typeof operation.path !== "string") {
    throw new JsonPatchError("Operation `path` property is not a string", "OPERATION_PATH_INVALID", index, operation, document2);
  } else if (operation.path.indexOf("/") !== 0 && operation.path.length > 0) {
    throw new JsonPatchError('Operation `path` property must start with "/"', "OPERATION_PATH_INVALID", index, operation, document2);
  } else if ((operation.op === "move" || operation.op === "copy") && typeof operation.from !== "string") {
    throw new JsonPatchError("Operation `from` property is not present (applicable in `move` and `copy` operations)", "OPERATION_FROM_REQUIRED", index, operation, document2);
  } else if ((operation.op === "add" || operation.op === "replace" || operation.op === "test") && operation.value === void 0) {
    throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_REQUIRED", index, operation, document2);
  } else if ((operation.op === "add" || operation.op === "replace" || operation.op === "test") && hasUndefined(operation.value)) {
    throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)", "OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED", index, operation, document2);
  } else if (document2) {
    if (operation.op == "add") {
      var pathLen = operation.path.split("/").length;
      var existingPathLen = existingPathFragment.split("/").length;
      if (pathLen !== existingPathLen + 1 && pathLen !== existingPathLen) {
        throw new JsonPatchError("Cannot perform an `add` operation at the desired path", "OPERATION_PATH_CANNOT_ADD", index, operation, document2);
      }
    } else if (operation.op === "replace" || operation.op === "remove" || operation.op === "_get") {
      if (operation.path !== existingPathFragment) {
        throw new JsonPatchError("Cannot perform the operation at a path that does not exist", "OPERATION_PATH_UNRESOLVABLE", index, operation, document2);
      }
    } else if (operation.op === "move" || operation.op === "copy") {
      var existingValue = {
        op: "_get",
        path: operation.from,
        value: void 0
      };
      var error = validate2([existingValue], document2);
      if (error && error.name === "OPERATION_PATH_UNRESOLVABLE") {
        throw new JsonPatchError("Cannot perform the operation from a path that does not exist", "OPERATION_FROM_UNRESOLVABLE", index, operation, document2);
      }
    }
  }
}
function validate2(sequence, document2, externalValidator) {
  try {
    if (!Array.isArray(sequence)) {
      throw new JsonPatchError("Patch sequence must be an array", "SEQUENCE_NOT_AN_ARRAY");
    }
    if (document2) {
      applyPatch(_deepClone(document2), _deepClone(sequence), externalValidator || true);
    } else {
      externalValidator = externalValidator || validator;
      for (var i = 0; i < sequence.length; i++) {
        externalValidator(sequence[i], i, document2, void 0);
      }
    }
  } catch (e) {
    if (e instanceof JsonPatchError) {
      return e;
    } else {
      throw e;
    }
  }
}
function _areEquals(a, b) {
  if (a === b)
    return true;
  if (a && b && typeof a == "object" && typeof b == "object") {
    var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
    if (arrA && arrB) {
      length = a.length;
      if (length != b.length)
        return false;
      for (i = length; i-- !== 0; )
        if (!_areEquals(a[i], b[i]))
          return false;
      return true;
    }
    if (arrA != arrB)
      return false;
    var keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length)
      return false;
    for (i = length; i-- !== 0; )
      if (!b.hasOwnProperty(keys[i]))
        return false;
    for (i = length; i-- !== 0; ) {
      key = keys[i];
      if (!_areEquals(a[key], b[key]))
        return false;
    }
    return true;
  }
  return a !== a && b !== b;
}
var JsonPatchError, deepClone, objOps, arrOps;
var init_core = __esm({
  "node_modules/@langchain/core/dist/utils/fast-json-patch/src/core.js"() {
    init_helpers();
    JsonPatchError = PatchError;
    deepClone = _deepClone;
    objOps = {
      add: function(obj, key, document2) {
        obj[key] = this.value;
        return { newDocument: document2 };
      },
      remove: function(obj, key, document2) {
        var removed = obj[key];
        delete obj[key];
        return { newDocument: document2, removed };
      },
      replace: function(obj, key, document2) {
        var removed = obj[key];
        obj[key] = this.value;
        return { newDocument: document2, removed };
      },
      move: function(obj, key, document2) {
        let removed = getValueByPointer(document2, this.path);
        if (removed) {
          removed = _deepClone(removed);
        }
        const originalValue = applyOperation(document2, {
          op: "remove",
          path: this.from
        }).removed;
        applyOperation(document2, {
          op: "add",
          path: this.path,
          value: originalValue
        });
        return { newDocument: document2, removed };
      },
      copy: function(obj, key, document2) {
        const valueToCopy = getValueByPointer(document2, this.from);
        applyOperation(document2, {
          op: "add",
          path: this.path,
          value: _deepClone(valueToCopy)
        });
        return { newDocument: document2 };
      },
      test: function(obj, key, document2) {
        return { newDocument: document2, test: _areEquals(obj[key], this.value) };
      },
      _get: function(obj, key, document2) {
        this.value = obj[key];
        return { newDocument: document2 };
      }
    };
    arrOps = {
      add: function(arr2, i, document2) {
        if (isInteger(i)) {
          arr2.splice(i, 0, this.value);
        } else {
          arr2[i] = this.value;
        }
        return { newDocument: document2, index: i };
      },
      remove: function(arr2, i, document2) {
        var removedList = arr2.splice(i, 1);
        return { newDocument: document2, removed: removedList[0] };
      },
      replace: function(arr2, i, document2) {
        var removed = arr2[i];
        arr2[i] = this.value;
        return { newDocument: document2, removed };
      },
      move: objOps.move,
      copy: objOps.copy,
      test: objOps.test,
      _get: objOps._get
    };
  }
});

// node_modules/@langchain/core/dist/utils/fast-json-patch/src/duplex.js
var init_duplex = __esm({
  "node_modules/@langchain/core/dist/utils/fast-json-patch/src/duplex.js"() {
    init_helpers();
    init_core();
  }
});

// node_modules/@langchain/core/dist/utils/fast-json-patch/index.js
var fast_json_patch_default;
var init_fast_json_patch = __esm({
  "node_modules/@langchain/core/dist/utils/fast-json-patch/index.js"() {
    init_core();
    init_duplex();
    init_helpers();
    init_core();
    init_helpers();
    fast_json_patch_default = {
      ...core_exports,
      // ...duplex,
      JsonPatchError: PatchError,
      deepClone: _deepClone,
      escapePathComponent,
      unescapePathComponent
    };
  }
});

// node_modules/decamelize/index.js
var require_decamelize = __commonJS({
  "node_modules/decamelize/index.js"(exports, module) {
    "use strict";
    module.exports = function(str, sep) {
      if (typeof str !== "string") {
        throw new TypeError("Expected a string");
      }
      sep = typeof sep === "undefined" ? "_" : sep;
      return str.replace(/([a-z\d])([A-Z])/g, "$1" + sep + "$2").replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + sep + "$2").toLowerCase();
    };
  }
});

// node_modules/camelcase/index.js
var require_camelcase = __commonJS({
  "node_modules/camelcase/index.js"(exports, module) {
    "use strict";
    var UPPERCASE = /[\p{Lu}]/u;
    var LOWERCASE = /[\p{Ll}]/u;
    var LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu;
    var IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
    var SEPARATORS = /[_.\- ]+/;
    var LEADING_SEPARATORS = new RegExp("^" + SEPARATORS.source);
    var SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, "gu");
    var NUMBERS_AND_IDENTIFIER = new RegExp("\\d+" + IDENTIFIER.source, "gu");
    var preserveCamelCase = (string, toLowerCase, toUpperCase) => {
      let isLastCharLower = false;
      let isLastCharUpper = false;
      let isLastLastCharUpper = false;
      for (let i = 0; i < string.length; i++) {
        const character = string[i];
        if (isLastCharLower && UPPERCASE.test(character)) {
          string = string.slice(0, i) + "-" + string.slice(i);
          isLastCharLower = false;
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = true;
          i++;
        } else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character)) {
          string = string.slice(0, i - 1) + "-" + string.slice(i - 1);
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = false;
          isLastCharLower = true;
        } else {
          isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character;
          isLastLastCharUpper = isLastCharUpper;
          isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character;
        }
      }
      return string;
    };
    var preserveConsecutiveUppercase = (input, toLowerCase) => {
      LEADING_CAPITAL.lastIndex = 0;
      return input.replace(LEADING_CAPITAL, (m1) => toLowerCase(m1));
    };
    var postProcess = (input, toUpperCase) => {
      SEPARATORS_AND_IDENTIFIER.lastIndex = 0;
      NUMBERS_AND_IDENTIFIER.lastIndex = 0;
      return input.replace(SEPARATORS_AND_IDENTIFIER, (_, identifier) => toUpperCase(identifier)).replace(NUMBERS_AND_IDENTIFIER, (m) => toUpperCase(m));
    };
    var camelCase2 = (input, options) => {
      if (!(typeof input === "string" || Array.isArray(input))) {
        throw new TypeError("Expected the input to be `string | string[]`");
      }
      options = {
        pascalCase: false,
        preserveConsecutiveUppercase: false,
        ...options
      };
      if (Array.isArray(input)) {
        input = input.map((x) => x.trim()).filter((x) => x.length).join("-");
      } else {
        input = input.trim();
      }
      if (input.length === 0) {
        return "";
      }
      const toLowerCase = options.locale === false ? (string) => string.toLowerCase() : (string) => string.toLocaleLowerCase(options.locale);
      const toUpperCase = options.locale === false ? (string) => string.toUpperCase() : (string) => string.toLocaleUpperCase(options.locale);
      if (input.length === 1) {
        return options.pascalCase ? toUpperCase(input) : toLowerCase(input);
      }
      const hasUpperCase = input !== toLowerCase(input);
      if (hasUpperCase) {
        input = preserveCamelCase(input, toLowerCase, toUpperCase);
      }
      input = input.replace(LEADING_SEPARATORS, "");
      if (options.preserveConsecutiveUppercase) {
        input = preserveConsecutiveUppercase(input, toLowerCase);
      } else {
        input = toLowerCase(input);
      }
      if (options.pascalCase) {
        input = toUpperCase(input.charAt(0)) + input.slice(1);
      }
      return postProcess(input, toUpperCase);
    };
    module.exports = camelCase2;
    module.exports.default = camelCase2;
  }
});

// node_modules/@langchain/core/dist/load/map_keys.js
function keyToJson(key, map) {
  return map?.[key] || (0, import_decamelize.default)(key);
}
function mapKeys(fields, mapper, map) {
  const mapped = {};
  for (const key in fields) {
    if (Object.hasOwn(fields, key)) {
      mapped[mapper(key, map)] = fields[key];
    }
  }
  return mapped;
}
var import_decamelize, import_camelcase;
var init_map_keys = __esm({
  "node_modules/@langchain/core/dist/load/map_keys.js"() {
    import_decamelize = __toESM(require_decamelize(), 1);
    import_camelcase = __toESM(require_camelcase(), 1);
  }
});

// node_modules/@langchain/core/dist/load/serializable.js
function shallowCopy(obj) {
  return Array.isArray(obj) ? [...obj] : { ...obj };
}
function replaceSecrets(root2, secretsMap) {
  const result = shallowCopy(root2);
  for (const [path, secretId] of Object.entries(secretsMap)) {
    const [last, ...partsReverse] = path.split(".").reverse();
    let current = result;
    for (const part of partsReverse.reverse()) {
      if (current[part] === void 0) {
        break;
      }
      current[part] = shallowCopy(current[part]);
      current = current[part];
    }
    if (current[last] !== void 0) {
      current[last] = {
        lc: 1,
        type: "secret",
        id: [secretId]
      };
    }
  }
  return result;
}
function get_lc_unique_name(serializableClass) {
  const parentClass = Object.getPrototypeOf(serializableClass);
  const lcNameIsSubclassed = typeof serializableClass.lc_name === "function" && (typeof parentClass.lc_name !== "function" || serializableClass.lc_name() !== parentClass.lc_name());
  if (lcNameIsSubclassed) {
    return serializableClass.lc_name();
  } else {
    return serializableClass.name;
  }
}
var Serializable;
var init_serializable = __esm({
  "node_modules/@langchain/core/dist/load/serializable.js"() {
    init_map_keys();
    Serializable = class _Serializable {
      /**
       * The name of the serializable. Override to provide an alias or
       * to preserve the serialized module name in minified environments.
       *
       * Implemented as a static method to support loading logic.
       */
      static lc_name() {
        return this.name;
      }
      /**
       * The final serialized identifier for the module.
       */
      get lc_id() {
        return [
          ...this.lc_namespace,
          get_lc_unique_name(this.constructor)
        ];
      }
      /**
       * A map of secrets, which will be omitted from serialization.
       * Keys are paths to the secret in constructor args, e.g. "foo.bar.baz".
       * Values are the secret ids, which will be used when deserializing.
       */
      get lc_secrets() {
        return void 0;
      }
      /**
       * A map of additional attributes to merge with constructor args.
       * Keys are the attribute names, e.g. "foo".
       * Values are the attribute values, which will be serialized.
       * These attributes need to be accepted by the constructor as arguments.
       */
      get lc_attributes() {
        return void 0;
      }
      /**
       * A map of aliases for constructor args.
       * Keys are the attribute names, e.g. "foo".
       * Values are the alias that will replace the key in serialization.
       * This is used to eg. make argument names match Python.
       */
      get lc_aliases() {
        return void 0;
      }
      constructor(kwargs, ..._args) {
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "lc_kwargs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.lc_kwargs = kwargs || {};
      }
      toJSON() {
        if (!this.lc_serializable) {
          return this.toJSONNotImplemented();
        }
        if (
          // eslint-disable-next-line no-instanceof/no-instanceof
          this.lc_kwargs instanceof _Serializable || typeof this.lc_kwargs !== "object" || Array.isArray(this.lc_kwargs)
        ) {
          return this.toJSONNotImplemented();
        }
        const aliases = {};
        const secrets = {};
        const kwargs = Object.keys(this.lc_kwargs).reduce((acc, key) => {
          acc[key] = key in this ? this[key] : this.lc_kwargs[key];
          return acc;
        }, {});
        for (let current = Object.getPrototypeOf(this); current; current = Object.getPrototypeOf(current)) {
          Object.assign(aliases, Reflect.get(current, "lc_aliases", this));
          Object.assign(secrets, Reflect.get(current, "lc_secrets", this));
          Object.assign(kwargs, Reflect.get(current, "lc_attributes", this));
        }
        Object.keys(secrets).forEach((keyPath) => {
          let read = this;
          let write = kwargs;
          const [last, ...partsReverse] = keyPath.split(".").reverse();
          for (const key of partsReverse.reverse()) {
            if (!(key in read) || read[key] === void 0)
              return;
            if (!(key in write) || write[key] === void 0) {
              if (typeof read[key] === "object" && read[key] != null) {
                write[key] = {};
              } else if (Array.isArray(read[key])) {
                write[key] = [];
              }
            }
            read = read[key];
            write = write[key];
          }
          if (last in read && read[last] !== void 0) {
            write[last] = write[last] || read[last];
          }
        });
        return {
          lc: 1,
          type: "constructor",
          id: this.lc_id,
          kwargs: mapKeys(Object.keys(secrets).length ? replaceSecrets(kwargs, secrets) : kwargs, keyToJson, aliases)
        };
      }
      toJSONNotImplemented() {
        return {
          lc: 1,
          type: "not_implemented",
          id: this.lc_id
        };
      }
    };
  }
});

// node_modules/@langchain/core/dist/utils/env.js
async function getRuntimeEnvironment2() {
  if (runtimeEnvironment2 === void 0) {
    const env = getEnv2();
    runtimeEnvironment2 = {
      library: "langchain-js",
      runtime: env
    };
  }
  return runtimeEnvironment2;
}
function getEnvironmentVariable2(name) {
  try {
    if (typeof process !== "undefined") {
      return process.env?.[name];
    } else if (isDeno2()) {
      return Deno?.env.get(name);
    } else {
      return void 0;
    }
  } catch (e) {
    return void 0;
  }
}
var isBrowser2, isWebWorker2, isJsDom2, isDeno2, isNode2, getEnv2, runtimeEnvironment2;
var init_env3 = __esm({
  "node_modules/@langchain/core/dist/utils/env.js"() {
    isBrowser2 = () => typeof window !== "undefined" && typeof window.document !== "undefined";
    isWebWorker2 = () => typeof globalThis === "object" && globalThis.constructor && globalThis.constructor.name === "DedicatedWorkerGlobalScope";
    isJsDom2 = () => typeof window !== "undefined" && window.name === "nodejs" || typeof navigator !== "undefined" && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
    isDeno2 = () => typeof Deno !== "undefined";
    isNode2 = () => typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined" && !isDeno2();
    getEnv2 = () => {
      let env;
      if (isBrowser2()) {
        env = "browser";
      } else if (isNode2()) {
        env = "node";
      } else if (isWebWorker2()) {
        env = "webworker";
      } else if (isJsDom2()) {
        env = "jsdom";
      } else if (isDeno2()) {
        env = "deno";
      } else {
        env = "other";
      }
      return env;
    };
  }
});

// node_modules/@langchain/core/dist/callbacks/base.js
var BaseCallbackHandlerMethodsClass, BaseCallbackHandler, isBaseCallbackHandler;
var init_base = __esm({
  "node_modules/@langchain/core/dist/callbacks/base.js"() {
    init_esm_browser();
    init_serializable();
    init_env3();
    BaseCallbackHandlerMethodsClass = class {
    };
    BaseCallbackHandler = class _BaseCallbackHandler extends BaseCallbackHandlerMethodsClass {
      get lc_namespace() {
        return ["langchain_core", "callbacks", this.name];
      }
      get lc_secrets() {
        return void 0;
      }
      get lc_attributes() {
        return void 0;
      }
      get lc_aliases() {
        return void 0;
      }
      /**
       * The name of the serializable. Override to provide an alias or
       * to preserve the serialized module name in minified environments.
       *
       * Implemented as a static method to support loading logic.
       */
      static lc_name() {
        return this.name;
      }
      /**
       * The final serialized identifier for the module.
       */
      get lc_id() {
        return [
          ...this.lc_namespace,
          get_lc_unique_name(this.constructor)
        ];
      }
      constructor(input) {
        super();
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "lc_kwargs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "ignoreLLM", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "ignoreChain", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "ignoreAgent", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "ignoreRetriever", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "ignoreCustomEvent", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "raiseError", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "awaitHandlers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: getEnvironmentVariable2("LANGCHAIN_CALLBACKS_BACKGROUND") === "false"
        });
        this.lc_kwargs = input || {};
        if (input) {
          this.ignoreLLM = input.ignoreLLM ?? this.ignoreLLM;
          this.ignoreChain = input.ignoreChain ?? this.ignoreChain;
          this.ignoreAgent = input.ignoreAgent ?? this.ignoreAgent;
          this.ignoreRetriever = input.ignoreRetriever ?? this.ignoreRetriever;
          this.ignoreCustomEvent = input.ignoreCustomEvent ?? this.ignoreCustomEvent;
          this.raiseError = input.raiseError ?? this.raiseError;
          this.awaitHandlers = this.raiseError || (input._awaitHandler ?? this.awaitHandlers);
        }
      }
      copy() {
        return new this.constructor(this);
      }
      toJSON() {
        return Serializable.prototype.toJSON.call(this);
      }
      toJSONNotImplemented() {
        return Serializable.prototype.toJSONNotImplemented.call(this);
      }
      static fromMethods(methods2) {
        class Handler extends _BaseCallbackHandler {
          constructor() {
            super();
            Object.defineProperty(this, "name", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: v4_default()
            });
            Object.assign(this, methods2);
          }
        }
        return new Handler();
      }
    };
    isBaseCallbackHandler = (x) => {
      const callbackHandler = x;
      return callbackHandler !== void 0 && typeof callbackHandler.copy === "function" && typeof callbackHandler.name === "string" && typeof callbackHandler.awaitHandlers === "boolean";
    };
  }
});

// node_modules/@langchain/core/dist/tracers/base.js
function _coerceToDict(value, defaultKey) {
  return value && !Array.isArray(value) && typeof value === "object" ? value : { [defaultKey]: value };
}
function stripNonAlphanumeric2(input) {
  return input.replace(/[-:.]/g, "");
}
function convertToDottedOrderFormat2(epoch, runId, executionOrder) {
  const paddedOrder = executionOrder.toFixed(0).slice(0, 3).padStart(3, "0");
  return stripNonAlphanumeric2(`${new Date(epoch).toISOString().slice(0, -1)}${paddedOrder}Z`) + runId;
}
function isBaseTracer(x) {
  return typeof x._addRunToRunMap === "function";
}
var BaseTracer;
var init_base2 = __esm({
  "node_modules/@langchain/core/dist/tracers/base.js"() {
    init_base();
    BaseTracer = class extends BaseCallbackHandler {
      constructor(_fields) {
        super(...arguments);
        Object.defineProperty(this, "runMap", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: /* @__PURE__ */ new Map()
        });
      }
      copy() {
        return this;
      }
      stringifyError(error) {
        if (error instanceof Error) {
          return error.message + (error?.stack ? `

${error.stack}` : "");
        }
        if (typeof error === "string") {
          return error;
        }
        return `${error}`;
      }
      _addChildRun(parentRun, childRun) {
        parentRun.child_runs.push(childRun);
      }
      _addRunToRunMap(run) {
        const currentDottedOrder = convertToDottedOrderFormat2(run.start_time, run.id, run.execution_order);
        const storedRun = { ...run };
        if (storedRun.parent_run_id !== void 0) {
          const parentRun = this.runMap.get(storedRun.parent_run_id);
          if (parentRun) {
            this._addChildRun(parentRun, storedRun);
            parentRun.child_execution_order = Math.max(parentRun.child_execution_order, storedRun.child_execution_order);
            storedRun.trace_id = parentRun.trace_id;
            if (parentRun.dotted_order !== void 0) {
              storedRun.dotted_order = [
                parentRun.dotted_order,
                currentDottedOrder
              ].join(".");
            } else {
            }
          } else {
          }
        } else {
          storedRun.trace_id = storedRun.id;
          storedRun.dotted_order = currentDottedOrder;
        }
        this.runMap.set(storedRun.id, storedRun);
        return storedRun;
      }
      async _endTrace(run) {
        const parentRun = run.parent_run_id !== void 0 && this.runMap.get(run.parent_run_id);
        if (parentRun) {
          parentRun.child_execution_order = Math.max(parentRun.child_execution_order, run.child_execution_order);
        } else {
          await this.persistRun(run);
        }
        this.runMap.delete(run.id);
        await this.onRunUpdate?.(run);
      }
      _getExecutionOrder(parentRunId) {
        const parentRun = parentRunId !== void 0 && this.runMap.get(parentRunId);
        if (!parentRun) {
          return 1;
        }
        return parentRun.child_execution_order + 1;
      }
      /**
       * Create and add a run to the run map for LLM start events.
       * This must sometimes be done synchronously to avoid race conditions
       * when callbacks are backgrounded, so we expose it as a separate method here.
       */
      _createRunForLLMStart(llm, prompts, runId, parentRunId, extraParams, tags, metadata, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const finalExtraParams = metadata ? { ...extraParams, metadata } : extraParams;
        const run = {
          id: runId,
          name: name ?? llm.id[llm.id.length - 1],
          parent_run_id: parentRunId,
          start_time,
          serialized: llm,
          events: [
            {
              name: "start",
              time: new Date(start_time).toISOString()
            }
          ],
          inputs: { prompts },
          execution_order,
          child_runs: [],
          child_execution_order: execution_order,
          run_type: "llm",
          extra: finalExtraParams ?? {},
          tags: tags || []
        };
        return this._addRunToRunMap(run);
      }
      async handleLLMStart(llm, prompts, runId, parentRunId, extraParams, tags, metadata, name) {
        const run = this.runMap.get(runId) ?? this._createRunForLLMStart(llm, prompts, runId, parentRunId, extraParams, tags, metadata, name);
        await this.onRunCreate?.(run);
        await this.onLLMStart?.(run);
        return run;
      }
      /**
       * Create and add a run to the run map for chat model start events.
       * This must sometimes be done synchronously to avoid race conditions
       * when callbacks are backgrounded, so we expose it as a separate method here.
       */
      _createRunForChatModelStart(llm, messages, runId, parentRunId, extraParams, tags, metadata, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const finalExtraParams = metadata ? { ...extraParams, metadata } : extraParams;
        const run = {
          id: runId,
          name: name ?? llm.id[llm.id.length - 1],
          parent_run_id: parentRunId,
          start_time,
          serialized: llm,
          events: [
            {
              name: "start",
              time: new Date(start_time).toISOString()
            }
          ],
          inputs: { messages },
          execution_order,
          child_runs: [],
          child_execution_order: execution_order,
          run_type: "llm",
          extra: finalExtraParams ?? {},
          tags: tags || []
        };
        return this._addRunToRunMap(run);
      }
      async handleChatModelStart(llm, messages, runId, parentRunId, extraParams, tags, metadata, name) {
        const run = this.runMap.get(runId) ?? this._createRunForChatModelStart(llm, messages, runId, parentRunId, extraParams, tags, metadata, name);
        await this.onRunCreate?.(run);
        await this.onLLMStart?.(run);
        return run;
      }
      async handleLLMEnd(output, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "llm") {
          throw new Error("No LLM run to end.");
        }
        run.end_time = Date.now();
        run.outputs = output;
        run.events.push({
          name: "end",
          time: new Date(run.end_time).toISOString()
        });
        await this.onLLMEnd?.(run);
        await this._endTrace(run);
        return run;
      }
      async handleLLMError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "llm") {
          throw new Error("No LLM run to end.");
        }
        run.end_time = Date.now();
        run.error = this.stringifyError(error);
        run.events.push({
          name: "error",
          time: new Date(run.end_time).toISOString()
        });
        await this.onLLMError?.(run);
        await this._endTrace(run);
        return run;
      }
      /**
       * Create and add a run to the run map for chain start events.
       * This must sometimes be done synchronously to avoid race conditions
       * when callbacks are backgrounded, so we expose it as a separate method here.
       */
      _createRunForChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const run = {
          id: runId,
          name: name ?? chain.id[chain.id.length - 1],
          parent_run_id: parentRunId,
          start_time,
          serialized: chain,
          events: [
            {
              name: "start",
              time: new Date(start_time).toISOString()
            }
          ],
          inputs,
          execution_order,
          child_execution_order: execution_order,
          run_type: runType ?? "chain",
          child_runs: [],
          extra: metadata ? { metadata } : {},
          tags: tags || []
        };
        return this._addRunToRunMap(run);
      }
      async handleChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name) {
        const run = this.runMap.get(runId) ?? this._createRunForChainStart(chain, inputs, runId, parentRunId, tags, metadata, runType, name);
        await this.onRunCreate?.(run);
        await this.onChainStart?.(run);
        return run;
      }
      async handleChainEnd(outputs, runId, _parentRunId, _tags, kwargs) {
        const run = this.runMap.get(runId);
        if (!run) {
          throw new Error("No chain run to end.");
        }
        run.end_time = Date.now();
        run.outputs = _coerceToDict(outputs, "output");
        run.events.push({
          name: "end",
          time: new Date(run.end_time).toISOString()
        });
        if (kwargs?.inputs !== void 0) {
          run.inputs = _coerceToDict(kwargs.inputs, "input");
        }
        await this.onChainEnd?.(run);
        await this._endTrace(run);
        return run;
      }
      async handleChainError(error, runId, _parentRunId, _tags, kwargs) {
        const run = this.runMap.get(runId);
        if (!run) {
          throw new Error("No chain run to end.");
        }
        run.end_time = Date.now();
        run.error = this.stringifyError(error);
        run.events.push({
          name: "error",
          time: new Date(run.end_time).toISOString()
        });
        if (kwargs?.inputs !== void 0) {
          run.inputs = _coerceToDict(kwargs.inputs, "input");
        }
        await this.onChainError?.(run);
        await this._endTrace(run);
        return run;
      }
      /**
       * Create and add a run to the run map for tool start events.
       * This must sometimes be done synchronously to avoid race conditions
       * when callbacks are backgrounded, so we expose it as a separate method here.
       */
      _createRunForToolStart(tool, input, runId, parentRunId, tags, metadata, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const run = {
          id: runId,
          name: name ?? tool.id[tool.id.length - 1],
          parent_run_id: parentRunId,
          start_time,
          serialized: tool,
          events: [
            {
              name: "start",
              time: new Date(start_time).toISOString()
            }
          ],
          inputs: { input },
          execution_order,
          child_execution_order: execution_order,
          run_type: "tool",
          child_runs: [],
          extra: metadata ? { metadata } : {},
          tags: tags || []
        };
        return this._addRunToRunMap(run);
      }
      async handleToolStart(tool, input, runId, parentRunId, tags, metadata, name) {
        const run = this.runMap.get(runId) ?? this._createRunForToolStart(tool, input, runId, parentRunId, tags, metadata, name);
        await this.onRunCreate?.(run);
        await this.onToolStart?.(run);
        return run;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async handleToolEnd(output, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "tool") {
          throw new Error("No tool run to end");
        }
        run.end_time = Date.now();
        run.outputs = { output };
        run.events.push({
          name: "end",
          time: new Date(run.end_time).toISOString()
        });
        await this.onToolEnd?.(run);
        await this._endTrace(run);
        return run;
      }
      async handleToolError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "tool") {
          throw new Error("No tool run to end");
        }
        run.end_time = Date.now();
        run.error = this.stringifyError(error);
        run.events.push({
          name: "error",
          time: new Date(run.end_time).toISOString()
        });
        await this.onToolError?.(run);
        await this._endTrace(run);
        return run;
      }
      async handleAgentAction(action, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "chain") {
          return;
        }
        const agentRun = run;
        agentRun.actions = agentRun.actions || [];
        agentRun.actions.push(action);
        agentRun.events.push({
          name: "agent_action",
          time: (/* @__PURE__ */ new Date()).toISOString(),
          kwargs: { action }
        });
        await this.onAgentAction?.(run);
      }
      async handleAgentEnd(action, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "chain") {
          return;
        }
        run.events.push({
          name: "agent_end",
          time: (/* @__PURE__ */ new Date()).toISOString(),
          kwargs: { action }
        });
        await this.onAgentEnd?.(run);
      }
      /**
       * Create and add a run to the run map for retriever start events.
       * This must sometimes be done synchronously to avoid race conditions
       * when callbacks are backgrounded, so we expose it as a separate method here.
       */
      _createRunForRetrieverStart(retriever, query, runId, parentRunId, tags, metadata, name) {
        const execution_order = this._getExecutionOrder(parentRunId);
        const start_time = Date.now();
        const run = {
          id: runId,
          name: name ?? retriever.id[retriever.id.length - 1],
          parent_run_id: parentRunId,
          start_time,
          serialized: retriever,
          events: [
            {
              name: "start",
              time: new Date(start_time).toISOString()
            }
          ],
          inputs: { query },
          execution_order,
          child_execution_order: execution_order,
          run_type: "retriever",
          child_runs: [],
          extra: metadata ? { metadata } : {},
          tags: tags || []
        };
        return this._addRunToRunMap(run);
      }
      async handleRetrieverStart(retriever, query, runId, parentRunId, tags, metadata, name) {
        const run = this.runMap.get(runId) ?? this._createRunForRetrieverStart(retriever, query, runId, parentRunId, tags, metadata, name);
        await this.onRunCreate?.(run);
        await this.onRetrieverStart?.(run);
        return run;
      }
      async handleRetrieverEnd(documents, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "retriever") {
          throw new Error("No retriever run to end");
        }
        run.end_time = Date.now();
        run.outputs = { documents };
        run.events.push({
          name: "end",
          time: new Date(run.end_time).toISOString()
        });
        await this.onRetrieverEnd?.(run);
        await this._endTrace(run);
        return run;
      }
      async handleRetrieverError(error, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "retriever") {
          throw new Error("No retriever run to end");
        }
        run.end_time = Date.now();
        run.error = this.stringifyError(error);
        run.events.push({
          name: "error",
          time: new Date(run.end_time).toISOString()
        });
        await this.onRetrieverError?.(run);
        await this._endTrace(run);
        return run;
      }
      async handleText(text, runId) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "chain") {
          return;
        }
        run.events.push({
          name: "text",
          time: (/* @__PURE__ */ new Date()).toISOString(),
          kwargs: { text }
        });
        await this.onText?.(run);
      }
      async handleLLMNewToken(token, idx, runId, _parentRunId, _tags, fields) {
        const run = this.runMap.get(runId);
        if (!run || run?.run_type !== "llm") {
          throw new Error(`Invalid "runId" provided to "handleLLMNewToken" callback.`);
        }
        run.events.push({
          name: "new_token",
          time: (/* @__PURE__ */ new Date()).toISOString(),
          kwargs: { token, idx, chunk: fields?.chunk }
        });
        await this.onLLMNewToken?.(run, token, { chunk: fields?.chunk });
        return run;
      }
    };
  }
});

// node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS({
  "node_modules/ansi-styles/index.js"(exports, module) {
    "use strict";
    var ANSI_BACKGROUND_OFFSET = 10;
    var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
    var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles2 = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          overline: [53, 55],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          // Bright color
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles2.color.gray = styles2.color.blackBright;
      styles2.bgColor.bgGray = styles2.bgColor.bgBlackBright;
      styles2.color.grey = styles2.color.blackBright;
      styles2.bgColor.bgGrey = styles2.bgColor.bgBlackBright;
      for (const [groupName, group] of Object.entries(styles2)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles2[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles2[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles2, groupName, {
          value: group,
          enumerable: false
        });
      }
      Object.defineProperty(styles2, "codes", {
        value: codes,
        enumerable: false
      });
      styles2.color.close = "\x1B[39m";
      styles2.bgColor.close = "\x1B[49m";
      styles2.color.ansi256 = wrapAnsi256();
      styles2.color.ansi16m = wrapAnsi16m();
      styles2.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
      styles2.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
      Object.defineProperties(styles2, {
        rgbToAnsi256: {
          value: (red, green, blue) => {
            if (red === green && green === blue) {
              if (red < 8) {
                return 16;
              }
              if (red > 248) {
                return 231;
              }
              return Math.round((red - 8) / 247 * 24) + 232;
            }
            return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
          },
          enumerable: false
        },
        hexToRgb: {
          value: (hex) => {
            const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
            if (!matches) {
              return [0, 0, 0];
            }
            let { colorString } = matches.groups;
            if (colorString.length === 3) {
              colorString = colorString.split("").map((character) => character + character).join("");
            }
            const integer = Number.parseInt(colorString, 16);
            return [
              integer >> 16 & 255,
              integer >> 8 & 255,
              integer & 255
            ];
          },
          enumerable: false
        },
        hexToAnsi256: {
          value: (hex) => styles2.rgbToAnsi256(...styles2.hexToRgb(hex)),
          enumerable: false
        }
      });
      return styles2;
    }
    Object.defineProperty(module, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  }
});

// node_modules/@langchain/core/dist/tracers/console.js
function wrap(style, text) {
  return `${style.open}${text}${style.close}`;
}
function tryJsonStringify(obj, fallback) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (err) {
    return fallback;
  }
}
function formatKVMapItem(value) {
  if (typeof value === "string") {
    return value.trim();
  }
  if (value === null || value === void 0) {
    return value;
  }
  return tryJsonStringify(value, value.toString());
}
function elapsed(run) {
  if (!run.end_time)
    return "";
  const elapsed2 = run.end_time - run.start_time;
  if (elapsed2 < 1e3) {
    return `${elapsed2}ms`;
  }
  return `${(elapsed2 / 1e3).toFixed(2)}s`;
}
var import_ansi_styles, color, ConsoleCallbackHandler;
var init_console = __esm({
  "node_modules/@langchain/core/dist/tracers/console.js"() {
    import_ansi_styles = __toESM(require_ansi_styles(), 1);
    init_base2();
    ({ color } = import_ansi_styles.default);
    ConsoleCallbackHandler = class extends BaseTracer {
      constructor() {
        super(...arguments);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "console_callback_handler"
        });
      }
      /**
       * Method used to persist the run. In this case, it simply returns a
       * resolved promise as there's no persistence logic.
       * @param _run The run to persist.
       * @returns A resolved promise.
       */
      persistRun(_run) {
        return Promise.resolve();
      }
      // utility methods
      /**
       * Method used to get all the parent runs of a given run.
       * @param run The run whose parents are to be retrieved.
       * @returns An array of parent runs.
       */
      getParents(run) {
        const parents = [];
        let currentRun = run;
        while (currentRun.parent_run_id) {
          const parent = this.runMap.get(currentRun.parent_run_id);
          if (parent) {
            parents.push(parent);
            currentRun = parent;
          } else {
            break;
          }
        }
        return parents;
      }
      /**
       * Method used to get a string representation of the run's lineage, which
       * is used in logging.
       * @param run The run whose lineage is to be retrieved.
       * @returns A string representation of the run's lineage.
       */
      getBreadcrumbs(run) {
        const parents = this.getParents(run).reverse();
        const string = [...parents, run].map((parent, i, arr2) => {
          const name = `${parent.execution_order}:${parent.run_type}:${parent.name}`;
          return i === arr2.length - 1 ? wrap(import_ansi_styles.default.bold, name) : name;
        }).join(" > ");
        return wrap(color.grey, string);
      }
      // logging methods
      /**
       * Method used to log the start of a chain run.
       * @param run The chain run that has started.
       * @returns void
       */
      onChainStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.green, "[chain/start]")} [${crumbs}] Entering Chain run with input: ${tryJsonStringify(run.inputs, "[inputs]")}`);
      }
      /**
       * Method used to log the end of a chain run.
       * @param run The chain run that has ended.
       * @returns void
       */
      onChainEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[chain/end]")} [${crumbs}] [${elapsed(run)}] Exiting Chain run with output: ${tryJsonStringify(run.outputs, "[outputs]")}`);
      }
      /**
       * Method used to log any errors of a chain run.
       * @param run The chain run that has errored.
       * @returns void
       */
      onChainError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[chain/error]")} [${crumbs}] [${elapsed(run)}] Chain run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
      }
      /**
       * Method used to log the start of an LLM run.
       * @param run The LLM run that has started.
       * @returns void
       */
      onLLMStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        const inputs = "prompts" in run.inputs ? { prompts: run.inputs.prompts.map((p) => p.trim()) } : run.inputs;
        console.log(`${wrap(color.green, "[llm/start]")} [${crumbs}] Entering LLM run with input: ${tryJsonStringify(inputs, "[inputs]")}`);
      }
      /**
       * Method used to log the end of an LLM run.
       * @param run The LLM run that has ended.
       * @returns void
       */
      onLLMEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[llm/end]")} [${crumbs}] [${elapsed(run)}] Exiting LLM run with output: ${tryJsonStringify(run.outputs, "[response]")}`);
      }
      /**
       * Method used to log any errors of an LLM run.
       * @param run The LLM run that has errored.
       * @returns void
       */
      onLLMError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[llm/error]")} [${crumbs}] [${elapsed(run)}] LLM run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
      }
      /**
       * Method used to log the start of a tool run.
       * @param run The tool run that has started.
       * @returns void
       */
      onToolStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.green, "[tool/start]")} [${crumbs}] Entering Tool run with input: "${formatKVMapItem(run.inputs.input)}"`);
      }
      /**
       * Method used to log the end of a tool run.
       * @param run The tool run that has ended.
       * @returns void
       */
      onToolEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[tool/end]")} [${crumbs}] [${elapsed(run)}] Exiting Tool run with output: "${formatKVMapItem(run.outputs?.output)}"`);
      }
      /**
       * Method used to log any errors of a tool run.
       * @param run The tool run that has errored.
       * @returns void
       */
      onToolError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[tool/error]")} [${crumbs}] [${elapsed(run)}] Tool run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
      }
      /**
       * Method used to log the start of a retriever run.
       * @param run The retriever run that has started.
       * @returns void
       */
      onRetrieverStart(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.green, "[retriever/start]")} [${crumbs}] Entering Retriever run with input: ${tryJsonStringify(run.inputs, "[inputs]")}`);
      }
      /**
       * Method used to log the end of a retriever run.
       * @param run The retriever run that has ended.
       * @returns void
       */
      onRetrieverEnd(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.cyan, "[retriever/end]")} [${crumbs}] [${elapsed(run)}] Exiting Retriever run with output: ${tryJsonStringify(run.outputs, "[outputs]")}`);
      }
      /**
       * Method used to log any errors of a retriever run.
       * @param run The retriever run that has errored.
       * @returns void
       */
      onRetrieverError(run) {
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.red, "[retriever/error]")} [${crumbs}] [${elapsed(run)}] Retriever run errored with error: ${tryJsonStringify(run.error, "[error]")}`);
      }
      /**
       * Method used to log the action selected by the agent.
       * @param run The run in which the agent action occurred.
       * @returns void
       */
      onAgentAction(run) {
        const agentRun = run;
        const crumbs = this.getBreadcrumbs(run);
        console.log(`${wrap(color.blue, "[agent/action]")} [${crumbs}] Agent selected action: ${tryJsonStringify(agentRun.actions[agentRun.actions.length - 1], "[action]")}`);
      }
    };
  }
});

// node_modules/@langchain/core/dist/errors/index.js
var init_errors = __esm({
  "node_modules/@langchain/core/dist/errors/index.js"() {
  }
});

// node_modules/@langchain/core/dist/tools/utils.js
var init_utils = __esm({
  "node_modules/@langchain/core/dist/tools/utils.js"() {
  }
});

// node_modules/@langchain/core/dist/utils/json.js
var init_json = __esm({
  "node_modules/@langchain/core/dist/utils/json.js"() {
  }
});

// node_modules/@langchain/core/dist/messages/base.js
function stringifyWithDepthLimit(obj, depthLimit) {
  function helper(obj2, currentDepth) {
    if (typeof obj2 !== "object" || obj2 === null || obj2 === void 0) {
      return obj2;
    }
    if (currentDepth >= depthLimit) {
      if (Array.isArray(obj2)) {
        return "[Array]";
      }
      return "[Object]";
    }
    if (Array.isArray(obj2)) {
      return obj2.map((item) => helper(item, currentDepth + 1));
    }
    const result = {};
    for (const key of Object.keys(obj2)) {
      result[key] = helper(obj2[key], currentDepth + 1);
    }
    return result;
  }
  return JSON.stringify(helper(obj, 0), null, 2);
}
var BaseMessage;
var init_base3 = __esm({
  "node_modules/@langchain/core/dist/messages/base.js"() {
    init_serializable();
    BaseMessage = class extends Serializable {
      get lc_aliases() {
        return {
          additional_kwargs: "additional_kwargs",
          response_metadata: "response_metadata"
        };
      }
      /**
       * @deprecated
       * Use {@link BaseMessage.content} instead.
       */
      get text() {
        return typeof this.content === "string" ? this.content : "";
      }
      /** The type of the message. */
      getType() {
        return this._getType();
      }
      constructor(fields, kwargs) {
        if (typeof fields === "string") {
          fields = {
            content: fields,
            additional_kwargs: kwargs,
            response_metadata: {}
          };
        }
        if (!fields.additional_kwargs) {
          fields.additional_kwargs = {};
        }
        if (!fields.response_metadata) {
          fields.response_metadata = {};
        }
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "messages"]
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "content", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "additional_kwargs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "response_metadata", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "id", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.name = fields.name;
        this.content = fields.content;
        this.additional_kwargs = fields.additional_kwargs;
        this.response_metadata = fields.response_metadata;
        this.id = fields.id;
      }
      toDict() {
        return {
          type: this._getType(),
          data: this.toJSON().kwargs
        };
      }
      static lc_name() {
        return "BaseMessage";
      }
      // Can't be protected for silly reasons
      get _printableFields() {
        return {
          id: this.id,
          content: this.content,
          name: this.name,
          additional_kwargs: this.additional_kwargs,
          response_metadata: this.response_metadata
        };
      }
      // this private method is used to update the ID for the runtime
      // value as well as in lc_kwargs for serialisation
      _updateId(value) {
        this.id = value;
        this.lc_kwargs.id = value;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.lc_name();
      }
      // Override the default behavior of console.log
      [Symbol.for("nodejs.util.inspect.custom")](depth) {
        if (depth === null) {
          return this;
        }
        const printable = stringifyWithDepthLimit(this._printableFields, Math.max(4, depth));
        return `${this.constructor.lc_name()} ${printable}`;
      }
    };
  }
});

// node_modules/@langchain/core/dist/messages/tool.js
var init_tool = __esm({
  "node_modules/@langchain/core/dist/messages/tool.js"() {
    init_base3();
  }
});

// node_modules/@langchain/core/dist/messages/ai.js
var init_ai = __esm({
  "node_modules/@langchain/core/dist/messages/ai.js"() {
    init_json();
    init_base3();
    init_tool();
  }
});

// node_modules/@langchain/core/dist/messages/chat.js
var init_chat = __esm({
  "node_modules/@langchain/core/dist/messages/chat.js"() {
    init_base3();
  }
});

// node_modules/@langchain/core/dist/messages/function.js
var init_function = __esm({
  "node_modules/@langchain/core/dist/messages/function.js"() {
    init_base3();
  }
});

// node_modules/@langchain/core/dist/messages/human.js
var init_human = __esm({
  "node_modules/@langchain/core/dist/messages/human.js"() {
    init_base3();
  }
});

// node_modules/@langchain/core/dist/messages/system.js
var init_system = __esm({
  "node_modules/@langchain/core/dist/messages/system.js"() {
    init_base3();
  }
});

// node_modules/@langchain/core/dist/messages/utils.js
function getBufferString(messages, humanPrefix = "Human", aiPrefix = "AI") {
  const string_messages = [];
  for (const m of messages) {
    let role;
    if (m._getType() === "human") {
      role = humanPrefix;
    } else if (m._getType() === "ai") {
      role = aiPrefix;
    } else if (m._getType() === "system") {
      role = "System";
    } else if (m._getType() === "function") {
      role = "Function";
    } else if (m._getType() === "tool") {
      role = "Tool";
    } else if (m._getType() === "generic") {
      role = m.role;
    } else {
      throw new Error(`Got unsupported message type: ${m._getType()}`);
    }
    const nameStr = m.name ? `${m.name}, ` : "";
    const readableContent = typeof m.content === "string" ? m.content : JSON.stringify(m.content, null, 2);
    string_messages.push(`${role}: ${nameStr}${readableContent}`);
  }
  return string_messages.join("\n");
}
var init_utils2 = __esm({
  "node_modules/@langchain/core/dist/messages/utils.js"() {
    init_errors();
    init_utils();
    init_ai();
    init_base3();
    init_chat();
    init_function();
    init_human();
    init_system();
    init_tool();
  }
});

// node_modules/langsmith/run_trees.js
var init_run_trees2 = __esm({
  "node_modules/langsmith/run_trees.js"() {
    init_run_trees();
  }
});

// node_modules/langsmith/index.js
var init_langsmith = __esm({
  "node_modules/langsmith/index.js"() {
    init_dist();
  }
});

// node_modules/@langchain/core/dist/singletons/tracer.js
var client, getDefaultLangChainClientSingleton;
var init_tracer = __esm({
  "node_modules/@langchain/core/dist/singletons/tracer.js"() {
    init_langsmith();
    init_env3();
    getDefaultLangChainClientSingleton = () => {
      if (client === void 0) {
        const clientParams = getEnvironmentVariable2("LANGCHAIN_CALLBACKS_BACKGROUND") === "false" ? {
          // LangSmith has its own backgrounding system
          blockOnRootRunFinalization: true
        } : {};
        client = new Client(clientParams);
      }
      return client;
    };
  }
});

// node_modules/@langchain/core/dist/tracers/tracer_langchain.js
var LangChainTracer;
var init_tracer_langchain = __esm({
  "node_modules/@langchain/core/dist/tracers/tracer_langchain.js"() {
    init_run_trees2();
    init_traceable2();
    init_env3();
    init_base2();
    init_tracer();
    LangChainTracer = class _LangChainTracer extends BaseTracer {
      constructor(fields = {}) {
        super(fields);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "langchain_tracer"
        });
        Object.defineProperty(this, "projectName", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "exampleId", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "client", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        const { exampleId, projectName, client: client2 } = fields;
        this.projectName = projectName ?? getEnvironmentVariable2("LANGCHAIN_PROJECT") ?? getEnvironmentVariable2("LANGCHAIN_SESSION");
        this.exampleId = exampleId;
        this.client = client2 ?? getDefaultLangChainClientSingleton();
        const traceableTree = _LangChainTracer.getTraceableRunTree();
        if (traceableTree) {
          this.updateFromRunTree(traceableTree);
        }
      }
      async _convertToCreate(run, example_id = void 0) {
        return {
          ...run,
          extra: {
            ...run.extra,
            runtime: await getRuntimeEnvironment2()
          },
          child_runs: void 0,
          session_name: this.projectName,
          reference_example_id: run.parent_run_id ? void 0 : example_id
        };
      }
      async persistRun(_run) {
      }
      async onRunCreate(run) {
        const persistedRun = await this._convertToCreate(run, this.exampleId);
        await this.client.createRun(persistedRun);
      }
      async onRunUpdate(run) {
        const runUpdate = {
          end_time: run.end_time,
          error: run.error,
          outputs: run.outputs,
          events: run.events,
          inputs: run.inputs,
          trace_id: run.trace_id,
          dotted_order: run.dotted_order,
          parent_run_id: run.parent_run_id
        };
        await this.client.updateRun(run.id, runUpdate);
      }
      getRun(id) {
        return this.runMap.get(id);
      }
      updateFromRunTree(runTree) {
        let rootRun = runTree;
        const visited = /* @__PURE__ */ new Set();
        while (rootRun.parent_run) {
          if (visited.has(rootRun.id))
            break;
          visited.add(rootRun.id);
          if (!rootRun.parent_run)
            break;
          rootRun = rootRun.parent_run;
        }
        visited.clear();
        const queue2 = [rootRun];
        while (queue2.length > 0) {
          const current = queue2.shift();
          if (!current || visited.has(current.id))
            continue;
          visited.add(current.id);
          this.runMap.set(current.id, current);
          if (current.child_runs) {
            queue2.push(...current.child_runs);
          }
        }
        this.client = runTree.client ?? this.client;
        this.projectName = runTree.project_name ?? this.projectName;
        this.exampleId = runTree.reference_example_id ?? this.exampleId;
      }
      convertToRunTree(id) {
        const runTreeMap = {};
        const runTreeList = [];
        for (const [id2, run] of this.runMap) {
          const runTree = new RunTree({
            ...run,
            child_runs: [],
            parent_run: void 0,
            // inherited properties
            client: this.client,
            project_name: this.projectName,
            reference_example_id: this.exampleId,
            tracingEnabled: true
          });
          runTreeMap[id2] = runTree;
          runTreeList.push([id2, run.dotted_order]);
        }
        runTreeList.sort((a, b) => {
          if (!a[1] || !b[1])
            return 0;
          return a[1].localeCompare(b[1]);
        });
        for (const [id2] of runTreeList) {
          const run = this.runMap.get(id2);
          const runTree = runTreeMap[id2];
          if (!run || !runTree)
            continue;
          if (run.parent_run_id) {
            const parentRunTree = runTreeMap[run.parent_run_id];
            if (parentRunTree) {
              parentRunTree.child_runs.push(runTree);
              runTree.parent_run = parentRunTree;
            }
          }
        }
        return runTreeMap[id];
      }
      static getTraceableRunTree() {
        try {
          return getCurrentRunTree();
        } catch {
          return void 0;
        }
      }
    };
  }
});

// node_modules/@langchain/core/dist/singletons/async_local_storage/globals.js
var TRACING_ALS_KEY2, _CONTEXT_VARIABLES_KEY, setGlobalAsyncLocalStorageInstance, getGlobalAsyncLocalStorageInstance;
var init_globals = __esm({
  "node_modules/@langchain/core/dist/singletons/async_local_storage/globals.js"() {
    TRACING_ALS_KEY2 = Symbol.for("ls:tracing_async_local_storage");
    _CONTEXT_VARIABLES_KEY = Symbol.for("lc:context_variables");
    setGlobalAsyncLocalStorageInstance = (instance) => {
      globalThis[TRACING_ALS_KEY2] = instance;
    };
    getGlobalAsyncLocalStorageInstance = () => {
      return globalThis[TRACING_ALS_KEY2];
    };
  }
});

// node_modules/@langchain/core/dist/singletons/callbacks.js
function createQueue() {
  const PQueue = "default" in import_p_queue2.default ? import_p_queue2.default.default : import_p_queue2.default;
  return new PQueue({
    autoStart: true,
    concurrency: 1
  });
}
function getQueue() {
  if (typeof queue === "undefined") {
    queue = createQueue();
  }
  return queue;
}
async function consumeCallback(promiseFn, wait) {
  if (wait === true) {
    const asyncLocalStorageInstance = getGlobalAsyncLocalStorageInstance();
    if (asyncLocalStorageInstance !== void 0) {
      await asyncLocalStorageInstance.run(void 0, async () => promiseFn());
    } else {
      await promiseFn();
    }
  } else {
    queue = getQueue();
    void queue.add(async () => {
      const asyncLocalStorageInstance = getGlobalAsyncLocalStorageInstance();
      if (asyncLocalStorageInstance !== void 0) {
        await asyncLocalStorageInstance.run(void 0, async () => promiseFn());
      } else {
        await promiseFn();
      }
    });
  }
}
var import_p_queue2, queue;
var init_callbacks = __esm({
  "node_modules/@langchain/core/dist/singletons/callbacks.js"() {
    import_p_queue2 = __toESM(require_dist(), 1);
    init_globals();
  }
});

// node_modules/@langchain/core/dist/callbacks/promises.js
var init_promises = __esm({
  "node_modules/@langchain/core/dist/callbacks/promises.js"() {
    init_callbacks();
  }
});

// node_modules/@langchain/core/dist/utils/callbacks.js
var isTracingEnabled2;
var init_callbacks2 = __esm({
  "node_modules/@langchain/core/dist/utils/callbacks.js"() {
    init_env3();
    isTracingEnabled2 = (tracingEnabled) => {
      if (tracingEnabled !== void 0) {
        return tracingEnabled;
      }
      const envVars = [
        "LANGSMITH_TRACING_V2",
        "LANGCHAIN_TRACING_V2",
        "LANGSMITH_TRACING",
        "LANGCHAIN_TRACING"
      ];
      return !!envVars.find((envVar) => getEnvironmentVariable2(envVar) === "true");
    };
  }
});

// node_modules/@langchain/core/dist/singletons/async_local_storage/context.js
function getContextVariable(name) {
  const asyncLocalStorageInstance = getGlobalAsyncLocalStorageInstance();
  if (asyncLocalStorageInstance === void 0) {
    return void 0;
  }
  const runTree = asyncLocalStorageInstance.getStore();
  return runTree?.[_CONTEXT_VARIABLES_KEY]?.[name];
}
var LC_CONFIGURE_HOOKS_KEY, _getConfigureHooks;
var init_context = __esm({
  "node_modules/@langchain/core/dist/singletons/async_local_storage/context.js"() {
    init_run_trees2();
    init_globals();
    LC_CONFIGURE_HOOKS_KEY = Symbol("lc:configure_hooks");
    _getConfigureHooks = () => getContextVariable(LC_CONFIGURE_HOOKS_KEY) || [];
  }
});

// node_modules/@langchain/core/dist/callbacks/manager.js
function ensureHandler(handler) {
  if ("name" in handler) {
    return handler;
  }
  return BaseCallbackHandler.fromMethods(handler);
}
var BaseCallbackManager, BaseRunManager, CallbackManagerForRetrieverRun, CallbackManagerForLLMRun, CallbackManagerForChainRun, CallbackManagerForToolRun, CallbackManager;
var init_manager = __esm({
  "node_modules/@langchain/core/dist/callbacks/manager.js"() {
    init_esm_browser();
    init_base();
    init_console();
    init_utils2();
    init_env3();
    init_tracer_langchain();
    init_promises();
    init_callbacks2();
    init_base2();
    init_context();
    BaseCallbackManager = class {
      setHandler(handler) {
        return this.setHandlers([handler]);
      }
    };
    BaseRunManager = class {
      constructor(runId, handlers, inheritableHandlers, tags, inheritableTags, metadata, inheritableMetadata, _parentRunId) {
        Object.defineProperty(this, "runId", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: runId
        });
        Object.defineProperty(this, "handlers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: handlers
        });
        Object.defineProperty(this, "inheritableHandlers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: inheritableHandlers
        });
        Object.defineProperty(this, "tags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: tags
        });
        Object.defineProperty(this, "inheritableTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: inheritableTags
        });
        Object.defineProperty(this, "metadata", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: metadata
        });
        Object.defineProperty(this, "inheritableMetadata", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: inheritableMetadata
        });
        Object.defineProperty(this, "_parentRunId", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: _parentRunId
        });
      }
      get parentRunId() {
        return this._parentRunId;
      }
      async handleText(text) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          try {
            await handler.handleText?.(text, this.runId, this._parentRunId, this.tags);
          } catch (err) {
            const logFunction = handler.raiseError ? console.error : console.warn;
            logFunction(`Error in handler ${handler.constructor.name}, handleText: ${err}`);
            if (handler.raiseError) {
              throw err;
            }
          }
        }, handler.awaitHandlers)));
      }
      async handleCustomEvent(eventName, data, _runId, _tags, _metadata) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          try {
            await handler.handleCustomEvent?.(eventName, data, this.runId, this.tags, this.metadata);
          } catch (err) {
            const logFunction = handler.raiseError ? console.error : console.warn;
            logFunction(`Error in handler ${handler.constructor.name}, handleCustomEvent: ${err}`);
            if (handler.raiseError) {
              throw err;
            }
          }
        }, handler.awaitHandlers)));
      }
    };
    CallbackManagerForRetrieverRun = class extends BaseRunManager {
      getChild(tag) {
        const manager = new CallbackManager(this.runId);
        manager.setHandlers(this.inheritableHandlers);
        manager.addTags(this.inheritableTags);
        manager.addMetadata(this.inheritableMetadata);
        if (tag) {
          manager.addTags([tag], false);
        }
        return manager;
      }
      async handleRetrieverEnd(documents) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreRetriever) {
            try {
              await handler.handleRetrieverEnd?.(documents, this.runId, this._parentRunId, this.tags);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleRetriever`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
      async handleRetrieverError(err) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreRetriever) {
            try {
              await handler.handleRetrieverError?.(err, this.runId, this._parentRunId, this.tags);
            } catch (error) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleRetrieverError: ${error}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
    };
    CallbackManagerForLLMRun = class extends BaseRunManager {
      async handleLLMNewToken(token, idx, _runId, _parentRunId, _tags, fields) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreLLM) {
            try {
              await handler.handleLLMNewToken?.(token, idx ?? { prompt: 0, completion: 0 }, this.runId, this._parentRunId, this.tags, fields);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleLLMNewToken: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
      async handleLLMError(err) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreLLM) {
            try {
              await handler.handleLLMError?.(err, this.runId, this._parentRunId, this.tags);
            } catch (err2) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleLLMError: ${err2}`);
              if (handler.raiseError) {
                throw err2;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
      async handleLLMEnd(output) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreLLM) {
            try {
              await handler.handleLLMEnd?.(output, this.runId, this._parentRunId, this.tags);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleLLMEnd: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
    };
    CallbackManagerForChainRun = class extends BaseRunManager {
      getChild(tag) {
        const manager = new CallbackManager(this.runId);
        manager.setHandlers(this.inheritableHandlers);
        manager.addTags(this.inheritableTags);
        manager.addMetadata(this.inheritableMetadata);
        if (tag) {
          manager.addTags([tag], false);
        }
        return manager;
      }
      async handleChainError(err, _runId, _parentRunId, _tags, kwargs) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreChain) {
            try {
              await handler.handleChainError?.(err, this.runId, this._parentRunId, this.tags, kwargs);
            } catch (err2) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleChainError: ${err2}`);
              if (handler.raiseError) {
                throw err2;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
      async handleChainEnd(output, _runId, _parentRunId, _tags, kwargs) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreChain) {
            try {
              await handler.handleChainEnd?.(output, this.runId, this._parentRunId, this.tags, kwargs);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleChainEnd: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
      async handleAgentAction(action) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreAgent) {
            try {
              await handler.handleAgentAction?.(action, this.runId, this._parentRunId, this.tags);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleAgentAction: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
      async handleAgentEnd(action) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreAgent) {
            try {
              await handler.handleAgentEnd?.(action, this.runId, this._parentRunId, this.tags);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleAgentEnd: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
    };
    CallbackManagerForToolRun = class extends BaseRunManager {
      getChild(tag) {
        const manager = new CallbackManager(this.runId);
        manager.setHandlers(this.inheritableHandlers);
        manager.addTags(this.inheritableTags);
        manager.addMetadata(this.inheritableMetadata);
        if (tag) {
          manager.addTags([tag], false);
        }
        return manager;
      }
      async handleToolError(err) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreAgent) {
            try {
              await handler.handleToolError?.(err, this.runId, this._parentRunId, this.tags);
            } catch (err2) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleToolError: ${err2}`);
              if (handler.raiseError) {
                throw err2;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async handleToolEnd(output) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreAgent) {
            try {
              await handler.handleToolEnd?.(output, this.runId, this._parentRunId, this.tags);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleToolEnd: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
    };
    CallbackManager = class _CallbackManager extends BaseCallbackManager {
      constructor(parentRunId, options) {
        super();
        Object.defineProperty(this, "handlers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "inheritableHandlers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "tags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "inheritableTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "metadata", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: {}
        });
        Object.defineProperty(this, "inheritableMetadata", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: {}
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "callback_manager"
        });
        Object.defineProperty(this, "_parentRunId", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.handlers = options?.handlers ?? this.handlers;
        this.inheritableHandlers = options?.inheritableHandlers ?? this.inheritableHandlers;
        this.tags = options?.tags ?? this.tags;
        this.inheritableTags = options?.inheritableTags ?? this.inheritableTags;
        this.metadata = options?.metadata ?? this.metadata;
        this.inheritableMetadata = options?.inheritableMetadata ?? this.inheritableMetadata;
        this._parentRunId = parentRunId;
      }
      /**
       * Gets the parent run ID, if any.
       *
       * @returns The parent run ID.
       */
      getParentRunId() {
        return this._parentRunId;
      }
      async handleLLMStart(llm, prompts, runId = void 0, _parentRunId = void 0, extraParams = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        return Promise.all(prompts.map(async (prompt, idx) => {
          const runId_ = idx === 0 && runId ? runId : v4_default();
          await Promise.all(this.handlers.map((handler) => {
            if (handler.ignoreLLM) {
              return;
            }
            if (isBaseTracer(handler)) {
              handler._createRunForLLMStart(llm, [prompt], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
            }
            return consumeCallback(async () => {
              try {
                await handler.handleLLMStart?.(llm, [prompt], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
              } catch (err) {
                const logFunction = handler.raiseError ? console.error : console.warn;
                logFunction(`Error in handler ${handler.constructor.name}, handleLLMStart: ${err}`);
                if (handler.raiseError) {
                  throw err;
                }
              }
            }, handler.awaitHandlers);
          }));
          return new CallbackManagerForLLMRun(runId_, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
        }));
      }
      async handleChatModelStart(llm, messages, runId = void 0, _parentRunId = void 0, extraParams = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        return Promise.all(messages.map(async (messageGroup, idx) => {
          const runId_ = idx === 0 && runId ? runId : v4_default();
          await Promise.all(this.handlers.map((handler) => {
            if (handler.ignoreLLM) {
              return;
            }
            if (isBaseTracer(handler)) {
              handler._createRunForChatModelStart(llm, [messageGroup], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
            }
            return consumeCallback(async () => {
              try {
                if (handler.handleChatModelStart) {
                  await handler.handleChatModelStart?.(llm, [messageGroup], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
                } else if (handler.handleLLMStart) {
                  const messageString = getBufferString(messageGroup);
                  await handler.handleLLMStart?.(llm, [messageString], runId_, this._parentRunId, extraParams, this.tags, this.metadata, runName);
                }
              } catch (err) {
                const logFunction = handler.raiseError ? console.error : console.warn;
                logFunction(`Error in handler ${handler.constructor.name}, handleLLMStart: ${err}`);
                if (handler.raiseError) {
                  throw err;
                }
              }
            }, handler.awaitHandlers);
          }));
          return new CallbackManagerForLLMRun(runId_, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
        }));
      }
      async handleChainStart(chain, inputs, runId = v4_default(), runType = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        await Promise.all(this.handlers.map((handler) => {
          if (handler.ignoreChain) {
            return;
          }
          if (isBaseTracer(handler)) {
            handler._createRunForChainStart(chain, inputs, runId, this._parentRunId, this.tags, this.metadata, runType, runName);
          }
          return consumeCallback(async () => {
            try {
              await handler.handleChainStart?.(chain, inputs, runId, this._parentRunId, this.tags, this.metadata, runType, runName);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleChainStart: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }, handler.awaitHandlers);
        }));
        return new CallbackManagerForChainRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
      }
      async handleToolStart(tool, input, runId = v4_default(), _parentRunId = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        await Promise.all(this.handlers.map((handler) => {
          if (handler.ignoreAgent) {
            return;
          }
          if (isBaseTracer(handler)) {
            handler._createRunForToolStart(tool, input, runId, this._parentRunId, this.tags, this.metadata, runName);
          }
          return consumeCallback(async () => {
            try {
              await handler.handleToolStart?.(tool, input, runId, this._parentRunId, this.tags, this.metadata, runName);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleToolStart: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }, handler.awaitHandlers);
        }));
        return new CallbackManagerForToolRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
      }
      async handleRetrieverStart(retriever, query, runId = v4_default(), _parentRunId = void 0, _tags = void 0, _metadata = void 0, runName = void 0) {
        await Promise.all(this.handlers.map((handler) => {
          if (handler.ignoreRetriever) {
            return;
          }
          if (isBaseTracer(handler)) {
            handler._createRunForRetrieverStart(retriever, query, runId, this._parentRunId, this.tags, this.metadata, runName);
          }
          return consumeCallback(async () => {
            try {
              await handler.handleRetrieverStart?.(retriever, query, runId, this._parentRunId, this.tags, this.metadata, runName);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleRetrieverStart: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }, handler.awaitHandlers);
        }));
        return new CallbackManagerForRetrieverRun(runId, this.handlers, this.inheritableHandlers, this.tags, this.inheritableTags, this.metadata, this.inheritableMetadata, this._parentRunId);
      }
      async handleCustomEvent(eventName, data, runId, _tags, _metadata) {
        await Promise.all(this.handlers.map((handler) => consumeCallback(async () => {
          if (!handler.ignoreCustomEvent) {
            try {
              await handler.handleCustomEvent?.(eventName, data, runId, this.tags, this.metadata);
            } catch (err) {
              const logFunction = handler.raiseError ? console.error : console.warn;
              logFunction(`Error in handler ${handler.constructor.name}, handleCustomEvent: ${err}`);
              if (handler.raiseError) {
                throw err;
              }
            }
          }
        }, handler.awaitHandlers)));
      }
      addHandler(handler, inherit = true) {
        this.handlers.push(handler);
        if (inherit) {
          this.inheritableHandlers.push(handler);
        }
      }
      removeHandler(handler) {
        this.handlers = this.handlers.filter((_handler) => _handler !== handler);
        this.inheritableHandlers = this.inheritableHandlers.filter((_handler) => _handler !== handler);
      }
      setHandlers(handlers, inherit = true) {
        this.handlers = [];
        this.inheritableHandlers = [];
        for (const handler of handlers) {
          this.addHandler(handler, inherit);
        }
      }
      addTags(tags, inherit = true) {
        this.removeTags(tags);
        this.tags.push(...tags);
        if (inherit) {
          this.inheritableTags.push(...tags);
        }
      }
      removeTags(tags) {
        this.tags = this.tags.filter((tag) => !tags.includes(tag));
        this.inheritableTags = this.inheritableTags.filter((tag) => !tags.includes(tag));
      }
      addMetadata(metadata, inherit = true) {
        this.metadata = { ...this.metadata, ...metadata };
        if (inherit) {
          this.inheritableMetadata = { ...this.inheritableMetadata, ...metadata };
        }
      }
      removeMetadata(metadata) {
        for (const key of Object.keys(metadata)) {
          delete this.metadata[key];
          delete this.inheritableMetadata[key];
        }
      }
      copy(additionalHandlers = [], inherit = true) {
        const manager = new _CallbackManager(this._parentRunId);
        for (const handler of this.handlers) {
          const inheritable = this.inheritableHandlers.includes(handler);
          manager.addHandler(handler, inheritable);
        }
        for (const tag of this.tags) {
          const inheritable = this.inheritableTags.includes(tag);
          manager.addTags([tag], inheritable);
        }
        for (const key of Object.keys(this.metadata)) {
          const inheritable = Object.keys(this.inheritableMetadata).includes(key);
          manager.addMetadata({ [key]: this.metadata[key] }, inheritable);
        }
        for (const handler of additionalHandlers) {
          if (
            // Prevent multiple copies of console_callback_handler
            manager.handlers.filter((h) => h.name === "console_callback_handler").some((h) => h.name === handler.name)
          ) {
            continue;
          }
          manager.addHandler(handler, inherit);
        }
        return manager;
      }
      static fromHandlers(handlers) {
        class Handler extends BaseCallbackHandler {
          constructor() {
            super();
            Object.defineProperty(this, "name", {
              enumerable: true,
              configurable: true,
              writable: true,
              value: v4_default()
            });
            Object.assign(this, handlers);
          }
        }
        const manager = new this();
        manager.addHandler(new Handler());
        return manager;
      }
      static configure(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options) {
        return this._configureSync(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options);
      }
      // TODO: Deprecate async method in favor of this one.
      static _configureSync(inheritableHandlers, localHandlers, inheritableTags, localTags, inheritableMetadata, localMetadata, options) {
        let callbackManager;
        if (inheritableHandlers || localHandlers) {
          if (Array.isArray(inheritableHandlers) || !inheritableHandlers) {
            callbackManager = new _CallbackManager();
            callbackManager.setHandlers(inheritableHandlers?.map(ensureHandler) ?? [], true);
          } else {
            callbackManager = inheritableHandlers;
          }
          callbackManager = callbackManager.copy(Array.isArray(localHandlers) ? localHandlers.map(ensureHandler) : localHandlers?.handlers, false);
        }
        const verboseEnabled = getEnvironmentVariable2("LANGCHAIN_VERBOSE") === "true" || options?.verbose;
        const tracingV2Enabled = LangChainTracer.getTraceableRunTree()?.tracingEnabled || isTracingEnabled2();
        const tracingEnabled = tracingV2Enabled || (getEnvironmentVariable2("LANGCHAIN_TRACING") ?? false);
        if (verboseEnabled || tracingEnabled) {
          if (!callbackManager) {
            callbackManager = new _CallbackManager();
          }
          if (verboseEnabled && !callbackManager.handlers.some((handler) => handler.name === ConsoleCallbackHandler.prototype.name)) {
            const consoleHandler = new ConsoleCallbackHandler();
            callbackManager.addHandler(consoleHandler, true);
          }
          if (tracingEnabled && !callbackManager.handlers.some((handler) => handler.name === "langchain_tracer")) {
            if (tracingV2Enabled) {
              const tracerV2 = new LangChainTracer();
              callbackManager.addHandler(tracerV2, true);
              callbackManager._parentRunId = LangChainTracer.getTraceableRunTree()?.id ?? callbackManager._parentRunId;
            }
          }
        }
        for (const { contextVar, inheritable = true, handlerClass, envVar } of _getConfigureHooks()) {
          const createIfNotInContext = envVar && getEnvironmentVariable2(envVar) === "true" && handlerClass;
          let handler;
          const contextVarValue = contextVar !== void 0 ? getContextVariable(contextVar) : void 0;
          if (contextVarValue && isBaseCallbackHandler(contextVarValue)) {
            handler = contextVarValue;
          } else if (createIfNotInContext) {
            handler = new handlerClass({});
          }
          if (handler !== void 0) {
            if (!callbackManager) {
              callbackManager = new _CallbackManager();
            }
            if (!callbackManager.handlers.some((h) => h.name === handler.name)) {
              callbackManager.addHandler(handler, inheritable);
            }
          }
        }
        if (inheritableTags || localTags) {
          if (callbackManager) {
            callbackManager.addTags(inheritableTags ?? []);
            callbackManager.addTags(localTags ?? [], false);
          }
        }
        if (inheritableMetadata || localMetadata) {
          if (callbackManager) {
            callbackManager.addMetadata(inheritableMetadata ?? {});
            callbackManager.addMetadata(localMetadata ?? {}, false);
          }
        }
        return callbackManager;
      }
    };
  }
});

// node_modules/@langchain/core/dist/singletons/async_local_storage/index.js
var MockAsyncLocalStorage2, mockAsyncLocalStorage2, LC_CHILD_KEY, AsyncLocalStorageProvider2, AsyncLocalStorageProviderSingleton2;
var init_async_local_storage = __esm({
  "node_modules/@langchain/core/dist/singletons/async_local_storage/index.js"() {
    init_langsmith();
    init_globals();
    init_manager();
    MockAsyncLocalStorage2 = class {
      getStore() {
        return void 0;
      }
      run(_store, callback) {
        return callback();
      }
      enterWith(_store) {
        return void 0;
      }
    };
    mockAsyncLocalStorage2 = new MockAsyncLocalStorage2();
    LC_CHILD_KEY = Symbol.for("lc:child_config");
    AsyncLocalStorageProvider2 = class {
      getInstance() {
        return getGlobalAsyncLocalStorageInstance() ?? mockAsyncLocalStorage2;
      }
      getRunnableConfig() {
        const storage = this.getInstance();
        return storage.getStore()?.extra?.[LC_CHILD_KEY];
      }
      runWithConfig(config, callback, avoidCreatingRootRunTree) {
        const callbackManager = CallbackManager._configureSync(config?.callbacks, void 0, config?.tags, void 0, config?.metadata);
        const storage = this.getInstance();
        const previousValue = storage.getStore();
        const parentRunId = callbackManager?.getParentRunId();
        const langChainTracer = callbackManager?.handlers?.find((handler) => handler?.name === "langchain_tracer");
        let runTree;
        if (langChainTracer && parentRunId) {
          runTree = langChainTracer.convertToRunTree(parentRunId);
        } else if (!avoidCreatingRootRunTree) {
          runTree = new RunTree({
            name: "<runnable_lambda>",
            tracingEnabled: false
          });
        }
        if (runTree) {
          runTree.extra = { ...runTree.extra, [LC_CHILD_KEY]: config };
        }
        if (previousValue !== void 0 && previousValue[_CONTEXT_VARIABLES_KEY] !== void 0) {
          runTree[_CONTEXT_VARIABLES_KEY] = previousValue[_CONTEXT_VARIABLES_KEY];
        }
        return storage.run(runTree, callback);
      }
      initializeGlobalInstance(instance) {
        if (getGlobalAsyncLocalStorageInstance() === void 0) {
          setGlobalAsyncLocalStorageInstance(instance);
        }
      }
    };
    AsyncLocalStorageProviderSingleton2 = new AsyncLocalStorageProvider2();
  }
});

// node_modules/@langchain/core/dist/singletons/index.js
var init_singletons = __esm({
  "node_modules/@langchain/core/dist/singletons/index.js"() {
    init_async_local_storage();
    init_globals();
  }
});

// node_modules/@langchain/core/dist/runnables/config.js
var init_config = __esm({
  "node_modules/@langchain/core/dist/runnables/config.js"() {
    init_manager();
    init_singletons();
  }
});

// node_modules/@langchain/core/dist/utils/signal.js
var init_signal = __esm({
  "node_modules/@langchain/core/dist/utils/signal.js"() {
  }
});

// node_modules/@langchain/core/dist/utils/stream.js
var init_stream = __esm({
  "node_modules/@langchain/core/dist/utils/stream.js"() {
    init_config();
    init_singletons();
    init_signal();
  }
});

// node_modules/@langchain/core/dist/tracers/log_stream.js
var init_log_stream = __esm({
  "node_modules/@langchain/core/dist/tracers/log_stream.js"() {
    init_fast_json_patch();
    init_base2();
    init_stream();
    init_ai();
  }
});

// node_modules/@langchain/core/dist/outputs.js
var init_outputs = __esm({
  "node_modules/@langchain/core/dist/outputs.js"() {
  }
});

// node_modules/@langchain/core/dist/tracers/event_stream.js
var init_event_stream = __esm({
  "node_modules/@langchain/core/dist/tracers/event_stream.js"() {
    init_base2();
    init_stream();
    init_ai();
    init_outputs();
  }
});

// node_modules/@langchain/core/dist/utils/async_caller.js
var import_p_retry2, import_p_queue3;
var init_async_caller2 = __esm({
  "node_modules/@langchain/core/dist/utils/async_caller.js"() {
    import_p_retry2 = __toESM(require_p_retry(), 1);
    import_p_queue3 = __toESM(require_dist(), 1);
  }
});

// node_modules/@langchain/core/dist/tracers/root_listener.js
var init_root_listener = __esm({
  "node_modules/@langchain/core/dist/tracers/root_listener.js"() {
    init_base2();
  }
});

// node_modules/@langchain/core/dist/runnables/utils.js
var init_utils3 = __esm({
  "node_modules/@langchain/core/dist/runnables/utils.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/Options.js
var ignoreOverride;
var init_Options = __esm({
  "node_modules/zod-to-json-schema/dist/esm/Options.js"() {
    ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
  }
});

// node_modules/zod-to-json-schema/dist/esm/Refs.js
var init_Refs = __esm({
  "node_modules/zod-to-json-schema/dist/esm/Refs.js"() {
    init_Options();
  }
});

// node_modules/zod-to-json-schema/dist/esm/errorMessages.js
var init_errorMessages = __esm({
  "node_modules/zod-to-json-schema/dist/esm/errorMessages.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/any.js
var init_any = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/any.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/array.js
var init_array = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/array.js"() {
    init_errorMessages();
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
var init_bigint = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js"() {
    init_errorMessages();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js
var init_boolean = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/branded.js
var init_branded = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/branded.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/catch.js
var init_catch = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/catch.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/date.js
var init_date = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/date.js"() {
    init_errorMessages();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/default.js
var init_default = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/default.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
var init_effects = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/effects.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/enum.js
var init_enum = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/enum.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
var init_intersection = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/literal.js
var init_literal = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/literal.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/string.js
var ALPHA_NUMERIC;
var init_string = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/string.js"() {
    init_errorMessages();
    ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/record.js
var init_record = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/record.js"() {
    init_parseDef();
    init_string();
    init_branded();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/map.js
var init_map = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/map.js"() {
    init_parseDef();
    init_record();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js
var init_nativeEnum = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/never.js
var init_never = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/never.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/null.js
var init_null = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/null.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/union.js
var init_union = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/union.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
var init_nullable = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js"() {
    init_parseDef();
    init_union();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/number.js
var init_number = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/number.js"() {
    init_errorMessages();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/object.js
var init_object = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/object.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/optional.js
var init_optional = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/optional.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/pipeline.js
var init_pipeline = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/pipeline.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/promise.js
var init_promise = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/promise.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/set.js
var init_set = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/set.js"() {
    init_errorMessages();
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js
var init_tuple = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js
var init_undefined = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js
var init_unknown = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js
var init_readonly = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parseDef.js
var init_parseDef = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parseDef.js"() {
    init_any();
    init_array();
    init_bigint();
    init_boolean();
    init_branded();
    init_catch();
    init_date();
    init_default();
    init_effects();
    init_enum();
    init_intersection();
    init_literal();
    init_map();
    init_nativeEnum();
    init_never();
    init_null();
    init_nullable();
    init_number();
    init_object();
    init_optional();
    init_pipeline();
    init_promise();
    init_record();
    init_set();
    init_string();
    init_tuple();
    init_undefined();
    init_union();
    init_unknown();
    init_readonly();
    init_Options();
  }
});

// node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js
var init_zodToJsonSchema = __esm({
  "node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js"() {
    init_parseDef();
    init_Refs();
  }
});

// node_modules/zod-to-json-schema/dist/esm/index.js
var init_esm = __esm({
  "node_modules/zod-to-json-schema/dist/esm/index.js"() {
    init_Options();
    init_Refs();
    init_errorMessages();
    init_parseDef();
    init_any();
    init_array();
    init_bigint();
    init_boolean();
    init_branded();
    init_catch();
    init_date();
    init_default();
    init_effects();
    init_enum();
    init_intersection();
    init_literal();
    init_map();
    init_nativeEnum();
    init_never();
    init_null();
    init_nullable();
    init_number();
    init_object();
    init_optional();
    init_pipeline();
    init_promise();
    init_readonly();
    init_record();
    init_set();
    init_string();
    init_tuple();
    init_undefined();
    init_union();
    init_unknown();
    init_zodToJsonSchema();
    init_zodToJsonSchema();
  }
});

// node_modules/@langchain/core/dist/runnables/graph_mermaid.js
var init_graph_mermaid = __esm({
  "node_modules/@langchain/core/dist/runnables/graph_mermaid.js"() {
  }
});

// node_modules/@langchain/core/dist/runnables/graph.js
var init_graph = __esm({
  "node_modules/@langchain/core/dist/runnables/graph.js"() {
    init_esm();
    init_utils3();
    init_graph_mermaid();
  }
});

// node_modules/@langchain/core/dist/runnables/wrappers.js
var init_wrappers = __esm({
  "node_modules/@langchain/core/dist/runnables/wrappers.js"() {
    init_stream();
  }
});

// node_modules/@langchain/core/dist/runnables/iter.js
var init_iter = __esm({
  "node_modules/@langchain/core/dist/runnables/iter.js"() {
    init_singletons();
    init_config();
  }
});

// node_modules/@langchain/core/dist/runnables/base.js
var import_p_retry3;
var init_base4 = __esm({
  "node_modules/@langchain/core/dist/runnables/base.js"() {
    import_p_retry3 = __toESM(require_p_retry(), 1);
    init_traceable2();
    init_log_stream();
    init_event_stream();
    init_serializable();
    init_stream();
    init_signal();
    init_config();
    init_async_caller2();
    init_root_listener();
    init_utils3();
    init_singletons();
    init_graph();
    init_wrappers();
    init_iter();
    init_utils();
  }
});

// node_modules/@langchain/core/dist/prompts/base.js
var init_base5 = __esm({
  "node_modules/@langchain/core/dist/prompts/base.js"() {
    init_base4();
  }
});

// node_modules/@langchain/core/dist/messages/modifier.js
var init_modifier = __esm({
  "node_modules/@langchain/core/dist/messages/modifier.js"() {
    init_base3();
  }
});

// node_modules/@langchain/core/dist/messages/transformers.js
var init_transformers = __esm({
  "node_modules/@langchain/core/dist/messages/transformers.js"() {
    init_base4();
    init_ai();
    init_chat();
    init_function();
    init_human();
    init_modifier();
    init_system();
    init_tool();
    init_utils2();
  }
});

// node_modules/@langchain/core/dist/messages/index.js
var init_messages2 = __esm({
  "node_modules/@langchain/core/dist/messages/index.js"() {
    init_ai();
    init_base3();
    init_chat();
    init_function();
    init_human();
    init_system();
    init_utils2();
    init_transformers();
    init_modifier();
    init_tool();
  }
});

// node_modules/@langchain/core/dist/prompt_values.js
var init_prompt_values = __esm({
  "node_modules/@langchain/core/dist/prompt_values.js"() {
    init_serializable();
    init_human();
    init_utils2();
  }
});

// node_modules/@langchain/core/dist/prompts/string.js
var init_string2 = __esm({
  "node_modules/@langchain/core/dist/prompts/string.js"() {
    init_prompt_values();
    init_base5();
  }
});

// node_modules/mustache/mustache.mjs
function isFunction(object) {
  return typeof object === "function";
}
function typeStr(obj) {
  return isArray(obj) ? "array" : typeof obj;
}
function escapeRegExp(string) {
  return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function hasProperty(obj, propName) {
  return obj != null && typeof obj === "object" && propName in obj;
}
function primitiveHasOwnProperty(primitive, propName) {
  return primitive != null && typeof primitive !== "object" && primitive.hasOwnProperty && primitive.hasOwnProperty(propName);
}
function testRegExp(re, string) {
  return regExpTest.call(re, string);
}
function isWhitespace(string) {
  return !testRegExp(nonSpaceRe, string);
}
function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
    return entityMap[s];
  });
}
function parseTemplate(template, tags) {
  if (!template)
    return [];
  var lineHasNonSpace = false;
  var sections = [];
  var tokens = [];
  var spaces = [];
  var hasTag = false;
  var nonSpace = false;
  var indentation = "";
  var tagIndex = 0;
  function stripSpace() {
    if (hasTag && !nonSpace) {
      while (spaces.length)
        delete tokens[spaces.pop()];
    } else {
      spaces = [];
    }
    hasTag = false;
    nonSpace = false;
  }
  var openingTagRe, closingTagRe, closingCurlyRe;
  function compileTags(tagsToCompile) {
    if (typeof tagsToCompile === "string")
      tagsToCompile = tagsToCompile.split(spaceRe, 2);
    if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
      throw new Error("Invalid tags: " + tagsToCompile);
    openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*");
    closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1]));
    closingCurlyRe = new RegExp("\\s*" + escapeRegExp("}" + tagsToCompile[1]));
  }
  compileTags(tags || mustache.tags);
  var scanner = new Scanner(template);
  var start, type, value, chr, token, openSection;
  while (!scanner.eos()) {
    start = scanner.pos;
    value = scanner.scanUntil(openingTagRe);
    if (value) {
      for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
        chr = value.charAt(i);
        if (isWhitespace(chr)) {
          spaces.push(tokens.length);
          indentation += chr;
        } else {
          nonSpace = true;
          lineHasNonSpace = true;
          indentation += " ";
        }
        tokens.push(["text", chr, start, start + 1]);
        start += 1;
        if (chr === "\n") {
          stripSpace();
          indentation = "";
          tagIndex = 0;
          lineHasNonSpace = false;
        }
      }
    }
    if (!scanner.scan(openingTagRe))
      break;
    hasTag = true;
    type = scanner.scan(tagRe) || "name";
    scanner.scan(whiteRe);
    if (type === "=") {
      value = scanner.scanUntil(equalsRe);
      scanner.scan(equalsRe);
      scanner.scanUntil(closingTagRe);
    } else if (type === "{") {
      value = scanner.scanUntil(closingCurlyRe);
      scanner.scan(curlyRe);
      scanner.scanUntil(closingTagRe);
      type = "&";
    } else {
      value = scanner.scanUntil(closingTagRe);
    }
    if (!scanner.scan(closingTagRe))
      throw new Error("Unclosed tag at " + scanner.pos);
    if (type == ">") {
      token = [type, value, start, scanner.pos, indentation, tagIndex, lineHasNonSpace];
    } else {
      token = [type, value, start, scanner.pos];
    }
    tagIndex++;
    tokens.push(token);
    if (type === "#" || type === "^") {
      sections.push(token);
    } else if (type === "/") {
      openSection = sections.pop();
      if (!openSection)
        throw new Error('Unopened section "' + value + '" at ' + start);
      if (openSection[1] !== value)
        throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
    } else if (type === "name" || type === "{" || type === "&") {
      nonSpace = true;
    } else if (type === "=") {
      compileTags(value);
    }
  }
  stripSpace();
  openSection = sections.pop();
  if (openSection)
    throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);
  return nestTokens(squashTokens(tokens));
}
function squashTokens(tokens) {
  var squashedTokens = [];
  var token, lastToken;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];
    if (token) {
      if (token[0] === "text" && lastToken && lastToken[0] === "text") {
        lastToken[1] += token[1];
        lastToken[3] = token[3];
      } else {
        squashedTokens.push(token);
        lastToken = token;
      }
    }
  }
  return squashedTokens;
}
function nestTokens(tokens) {
  var nestedTokens = [];
  var collector = nestedTokens;
  var sections = [];
  var token, section;
  for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
    token = tokens[i];
    switch (token[0]) {
      case "#":
      case "^":
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case "/":
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
    }
  }
  return nestedTokens;
}
function Scanner(string) {
  this.string = string;
  this.tail = string;
  this.pos = 0;
}
function Context(view, parentContext) {
  this.view = view;
  this.cache = { ".": this.view };
  this.parent = parentContext;
}
function Writer() {
  this.templateCache = {
    _cache: {},
    set: function set(key, value) {
      this._cache[key] = value;
    },
    get: function get2(key) {
      return this._cache[key];
    },
    clear: function clear() {
      this._cache = {};
    }
  };
}
var objectToString, isArray, regExpTest, nonSpaceRe, entityMap, whiteRe, spaceRe, equalsRe, curlyRe, tagRe, mustache, defaultWriter;
var init_mustache = __esm({
  "node_modules/mustache/mustache.mjs"() {
    objectToString = Object.prototype.toString;
    isArray = Array.isArray || function isArrayPolyfill(object) {
      return objectToString.call(object) === "[object Array]";
    };
    regExpTest = RegExp.prototype.test;
    nonSpaceRe = /\S/;
    entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    };
    whiteRe = /\s*/;
    spaceRe = /\s+/;
    equalsRe = /\s*=/;
    curlyRe = /\s*\}/;
    tagRe = /#|\^|\/|>|\{|&|=|!/;
    Scanner.prototype.eos = function eos() {
      return this.tail === "";
    };
    Scanner.prototype.scan = function scan(re) {
      var match = this.tail.match(re);
      if (!match || match.index !== 0)
        return "";
      var string = match[0];
      this.tail = this.tail.substring(string.length);
      this.pos += string.length;
      return string;
    };
    Scanner.prototype.scanUntil = function scanUntil(re) {
      var index = this.tail.search(re), match;
      switch (index) {
        case -1:
          match = this.tail;
          this.tail = "";
          break;
        case 0:
          match = "";
          break;
        default:
          match = this.tail.substring(0, index);
          this.tail = this.tail.substring(index);
      }
      this.pos += match.length;
      return match;
    };
    Context.prototype.push = function push(view) {
      return new Context(view, this);
    };
    Context.prototype.lookup = function lookup(name) {
      var cache = this.cache;
      var value;
      if (cache.hasOwnProperty(name)) {
        value = cache[name];
      } else {
        var context = this, intermediateValue, names, index, lookupHit = false;
        while (context) {
          if (name.indexOf(".") > 0) {
            intermediateValue = context.view;
            names = name.split(".");
            index = 0;
            while (intermediateValue != null && index < names.length) {
              if (index === names.length - 1)
                lookupHit = hasProperty(intermediateValue, names[index]) || primitiveHasOwnProperty(intermediateValue, names[index]);
              intermediateValue = intermediateValue[names[index++]];
            }
          } else {
            intermediateValue = context.view[name];
            lookupHit = hasProperty(context.view, name);
          }
          if (lookupHit) {
            value = intermediateValue;
            break;
          }
          context = context.parent;
        }
        cache[name] = value;
      }
      if (isFunction(value))
        value = value.call(this.view);
      return value;
    };
    Writer.prototype.clearCache = function clearCache() {
      if (typeof this.templateCache !== "undefined") {
        this.templateCache.clear();
      }
    };
    Writer.prototype.parse = function parse(template, tags) {
      var cache = this.templateCache;
      var cacheKey = template + ":" + (tags || mustache.tags).join(":");
      var isCacheEnabled = typeof cache !== "undefined";
      var tokens = isCacheEnabled ? cache.get(cacheKey) : void 0;
      if (tokens == void 0) {
        tokens = parseTemplate(template, tags);
        isCacheEnabled && cache.set(cacheKey, tokens);
      }
      return tokens;
    };
    Writer.prototype.render = function render(template, view, partials, config) {
      var tags = this.getConfigTags(config);
      var tokens = this.parse(template, tags);
      var context = view instanceof Context ? view : new Context(view, void 0);
      return this.renderTokens(tokens, context, partials, template, config);
    };
    Writer.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate, config) {
      var buffer = "";
      var token, symbol, value;
      for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        value = void 0;
        token = tokens[i];
        symbol = token[0];
        if (symbol === "#") value = this.renderSection(token, context, partials, originalTemplate, config);
        else if (symbol === "^") value = this.renderInverted(token, context, partials, originalTemplate, config);
        else if (symbol === ">") value = this.renderPartial(token, context, partials, config);
        else if (symbol === "&") value = this.unescapedValue(token, context);
        else if (symbol === "name") value = this.escapedValue(token, context, config);
        else if (symbol === "text") value = this.rawValue(token);
        if (value !== void 0)
          buffer += value;
      }
      return buffer;
    };
    Writer.prototype.renderSection = function renderSection(token, context, partials, originalTemplate, config) {
      var self2 = this;
      var buffer = "";
      var value = context.lookup(token[1]);
      function subRender(template) {
        return self2.render(template, context, partials, config);
      }
      if (!value) return;
      if (isArray(value)) {
        for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
          buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate, config);
        }
      } else if (typeof value === "object" || typeof value === "string" || typeof value === "number") {
        buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate, config);
      } else if (isFunction(value)) {
        if (typeof originalTemplate !== "string")
          throw new Error("Cannot use higher-order sections without the original template");
        value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);
        if (value != null)
          buffer += value;
      } else {
        buffer += this.renderTokens(token[4], context, partials, originalTemplate, config);
      }
      return buffer;
    };
    Writer.prototype.renderInverted = function renderInverted(token, context, partials, originalTemplate, config) {
      var value = context.lookup(token[1]);
      if (!value || isArray(value) && value.length === 0)
        return this.renderTokens(token[4], context, partials, originalTemplate, config);
    };
    Writer.prototype.indentPartial = function indentPartial(partial, indentation, lineHasNonSpace) {
      var filteredIndentation = indentation.replace(/[^ \t]/g, "");
      var partialByNl = partial.split("\n");
      for (var i = 0; i < partialByNl.length; i++) {
        if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
          partialByNl[i] = filteredIndentation + partialByNl[i];
        }
      }
      return partialByNl.join("\n");
    };
    Writer.prototype.renderPartial = function renderPartial(token, context, partials, config) {
      if (!partials) return;
      var tags = this.getConfigTags(config);
      var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
      if (value != null) {
        var lineHasNonSpace = token[6];
        var tagIndex = token[5];
        var indentation = token[4];
        var indentedValue = value;
        if (tagIndex == 0 && indentation) {
          indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
        }
        var tokens = this.parse(indentedValue, tags);
        return this.renderTokens(tokens, context, partials, indentedValue, config);
      }
    };
    Writer.prototype.unescapedValue = function unescapedValue(token, context) {
      var value = context.lookup(token[1]);
      if (value != null)
        return value;
    };
    Writer.prototype.escapedValue = function escapedValue(token, context, config) {
      var escape = this.getConfigEscape(config) || mustache.escape;
      var value = context.lookup(token[1]);
      if (value != null)
        return typeof value === "number" && escape === mustache.escape ? String(value) : escape(value);
    };
    Writer.prototype.rawValue = function rawValue(token) {
      return token[1];
    };
    Writer.prototype.getConfigTags = function getConfigTags(config) {
      if (isArray(config)) {
        return config;
      } else if (config && typeof config === "object") {
        return config.tags;
      } else {
        return void 0;
      }
    };
    Writer.prototype.getConfigEscape = function getConfigEscape(config) {
      if (config && typeof config === "object" && !isArray(config)) {
        return config.escape;
      } else {
        return void 0;
      }
    };
    mustache = {
      name: "mustache.js",
      version: "4.2.0",
      tags: ["{{", "}}"],
      clearCache: void 0,
      escape: void 0,
      parse: void 0,
      render: void 0,
      Scanner: void 0,
      Context: void 0,
      Writer: void 0,
      /**
       * Allows a user to override the default caching strategy, by providing an
       * object with set, get and clear methods. This can also be used to disable
       * the cache by setting it to the literal `undefined`.
       */
      set templateCache(cache) {
        defaultWriter.templateCache = cache;
      },
      /**
       * Gets the default or overridden caching object from the default writer.
       */
      get templateCache() {
        return defaultWriter.templateCache;
      }
    };
    defaultWriter = new Writer();
    mustache.clearCache = function clearCache2() {
      return defaultWriter.clearCache();
    };
    mustache.parse = function parse2(template, tags) {
      return defaultWriter.parse(template, tags);
    };
    mustache.render = function render2(template, view, partials, config) {
      if (typeof template !== "string") {
        throw new TypeError('Invalid template! Template should be a "string" but "' + typeStr(template) + '" was given as the first argument for mustache#render(template, view, partials)');
      }
      return defaultWriter.render(template, view, partials, config);
    };
    mustache.escape = escapeHtml;
    mustache.Scanner = Scanner;
    mustache.Context = Context;
    mustache.Writer = Writer;
  }
});

// node_modules/@langchain/core/dist/prompts/template.js
var init_template = __esm({
  "node_modules/@langchain/core/dist/prompts/template.js"() {
    init_mustache();
    init_errors();
  }
});

// node_modules/@langchain/core/dist/prompts/prompt.js
var init_prompt = __esm({
  "node_modules/@langchain/core/dist/prompts/prompt.js"() {
    init_string2();
    init_template();
  }
});

// node_modules/@langchain/core/dist/prompts/image.js
var init_image = __esm({
  "node_modules/@langchain/core/dist/prompts/image.js"() {
    init_prompt_values();
    init_base5();
    init_template();
  }
});

// node_modules/@langchain/core/dist/prompts/chat.js
var init_chat2 = __esm({
  "node_modules/@langchain/core/dist/prompts/chat.js"() {
    init_messages2();
    init_prompt_values();
    init_base4();
    init_string2();
    init_base5();
    init_prompt();
    init_image();
    init_template();
    init_errors();
  }
});

// node_modules/@langchain/core/dist/prompts/few_shot.js
var init_few_shot = __esm({
  "node_modules/@langchain/core/dist/prompts/few_shot.js"() {
    init_string2();
    init_template();
    init_prompt();
    init_chat2();
  }
});

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup2 = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup2[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr2 = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr2[curByte++] = tmp >> 16 & 255;
        arr2[curByte++] = tmp >> 8 & 255;
        arr2[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr2[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr2[curByte++] = tmp >> 8 & 255;
        arr2[curByte++] = tmp & 255;
      }
      return arr2;
    }
    function tripletToBase64(num) {
      return lookup2[num >> 18 & 63] + lookup2[num >> 12 & 63] + lookup2[num >> 6 & 63] + lookup2[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup2[tmp >> 2] + lookup2[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup2[tmp >> 10] + lookup2[tmp >> 4 & 63] + lookup2[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// node_modules/@langchain/core/dist/prompts/index.js
init_base5();
init_chat2();
init_few_shot();

// node_modules/@langchain/core/dist/prompts/pipeline.js
init_base5();
init_chat2();

// node_modules/@langchain/core/dist/prompts/index.js
init_prompt();
init_string2();
init_template();
init_image();

// node_modules/@langchain/core/dist/prompts/structured.js
init_chat2();

// node_modules/@langchain/core/messages.js
init_messages2();

// node_modules/@langchain/core/dist/language_models/chat_models.js
init_esm();
init_messages2();
init_outputs();

// node_modules/@langchain/core/dist/utils/js-sha1/hash.js
var root = typeof window === "object" ? window : {};
var HEX_CHARS = "0123456789abcdef".split("");
var EXTRA = [-2147483648, 8388608, 32768, 128];
var SHIFT = [24, 16, 8, 0];
var blocks = [];
function Sha1(sharedMemory) {
  if (sharedMemory) {
    blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    this.blocks = blocks;
  } else {
    this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
  this.h0 = 1732584193;
  this.h1 = 4023233417;
  this.h2 = 2562383102;
  this.h3 = 271733878;
  this.h4 = 3285377520;
  this.block = this.start = this.bytes = this.hBytes = 0;
  this.finalized = this.hashed = false;
  this.first = true;
}
Sha1.prototype.update = function(message) {
  if (this.finalized) {
    return;
  }
  var notString = typeof message !== "string";
  if (notString && message.constructor === root.ArrayBuffer) {
    message = new Uint8Array(message);
  }
  var code, index = 0, i, length = message.length || 0, blocks2 = this.blocks;
  while (index < length) {
    if (this.hashed) {
      this.hashed = false;
      blocks2[0] = this.block;
      blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
    }
    if (notString) {
      for (i = this.start; index < length && i < 64; ++index) {
        blocks2[i >> 2] |= message[index] << SHIFT[i++ & 3];
      }
    } else {
      for (i = this.start; index < length && i < 64; ++index) {
        code = message.charCodeAt(index);
        if (code < 128) {
          blocks2[i >> 2] |= code << SHIFT[i++ & 3];
        } else if (code < 2048) {
          blocks2[i >> 2] |= (192 | code >> 6) << SHIFT[i++ & 3];
          blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
        } else if (code < 55296 || code >= 57344) {
          blocks2[i >> 2] |= (224 | code >> 12) << SHIFT[i++ & 3];
          blocks2[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
          blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
        } else {
          code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
          blocks2[i >> 2] |= (240 | code >> 18) << SHIFT[i++ & 3];
          blocks2[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[i++ & 3];
          blocks2[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
          blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
        }
      }
    }
    this.lastByteIndex = i;
    this.bytes += i - this.start;
    if (i >= 64) {
      this.block = blocks2[16];
      this.start = i - 64;
      this.hash();
      this.hashed = true;
    } else {
      this.start = i;
    }
  }
  if (this.bytes > 4294967295) {
    this.hBytes += this.bytes / 4294967296 << 0;
    this.bytes = this.bytes % 4294967296;
  }
  return this;
};
Sha1.prototype.finalize = function() {
  if (this.finalized) {
    return;
  }
  this.finalized = true;
  var blocks2 = this.blocks, i = this.lastByteIndex;
  blocks2[16] = this.block;
  blocks2[i >> 2] |= EXTRA[i & 3];
  this.block = blocks2[16];
  if (i >= 56) {
    if (!this.hashed) {
      this.hash();
    }
    blocks2[0] = this.block;
    blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
  }
  blocks2[14] = this.hBytes << 3 | this.bytes >>> 29;
  blocks2[15] = this.bytes << 3;
  this.hash();
};
Sha1.prototype.hash = function() {
  var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4;
  var f, j, t, blocks2 = this.blocks;
  for (j = 16; j < 80; ++j) {
    t = blocks2[j - 3] ^ blocks2[j - 8] ^ blocks2[j - 14] ^ blocks2[j - 16];
    blocks2[j] = t << 1 | t >>> 31;
  }
  for (j = 0; j < 20; j += 5) {
    f = b & c | ~b & d;
    t = a << 5 | a >>> 27;
    e = t + f + e + 1518500249 + blocks2[j] << 0;
    b = b << 30 | b >>> 2;
    f = a & b | ~a & c;
    t = e << 5 | e >>> 27;
    d = t + f + d + 1518500249 + blocks2[j + 1] << 0;
    a = a << 30 | a >>> 2;
    f = e & a | ~e & b;
    t = d << 5 | d >>> 27;
    c = t + f + c + 1518500249 + blocks2[j + 2] << 0;
    e = e << 30 | e >>> 2;
    f = d & e | ~d & a;
    t = c << 5 | c >>> 27;
    b = t + f + b + 1518500249 + blocks2[j + 3] << 0;
    d = d << 30 | d >>> 2;
    f = c & d | ~c & e;
    t = b << 5 | b >>> 27;
    a = t + f + a + 1518500249 + blocks2[j + 4] << 0;
    c = c << 30 | c >>> 2;
  }
  for (; j < 40; j += 5) {
    f = b ^ c ^ d;
    t = a << 5 | a >>> 27;
    e = t + f + e + 1859775393 + blocks2[j] << 0;
    b = b << 30 | b >>> 2;
    f = a ^ b ^ c;
    t = e << 5 | e >>> 27;
    d = t + f + d + 1859775393 + blocks2[j + 1] << 0;
    a = a << 30 | a >>> 2;
    f = e ^ a ^ b;
    t = d << 5 | d >>> 27;
    c = t + f + c + 1859775393 + blocks2[j + 2] << 0;
    e = e << 30 | e >>> 2;
    f = d ^ e ^ a;
    t = c << 5 | c >>> 27;
    b = t + f + b + 1859775393 + blocks2[j + 3] << 0;
    d = d << 30 | d >>> 2;
    f = c ^ d ^ e;
    t = b << 5 | b >>> 27;
    a = t + f + a + 1859775393 + blocks2[j + 4] << 0;
    c = c << 30 | c >>> 2;
  }
  for (; j < 60; j += 5) {
    f = b & c | b & d | c & d;
    t = a << 5 | a >>> 27;
    e = t + f + e - 1894007588 + blocks2[j] << 0;
    b = b << 30 | b >>> 2;
    f = a & b | a & c | b & c;
    t = e << 5 | e >>> 27;
    d = t + f + d - 1894007588 + blocks2[j + 1] << 0;
    a = a << 30 | a >>> 2;
    f = e & a | e & b | a & b;
    t = d << 5 | d >>> 27;
    c = t + f + c - 1894007588 + blocks2[j + 2] << 0;
    e = e << 30 | e >>> 2;
    f = d & e | d & a | e & a;
    t = c << 5 | c >>> 27;
    b = t + f + b - 1894007588 + blocks2[j + 3] << 0;
    d = d << 30 | d >>> 2;
    f = c & d | c & e | d & e;
    t = b << 5 | b >>> 27;
    a = t + f + a - 1894007588 + blocks2[j + 4] << 0;
    c = c << 30 | c >>> 2;
  }
  for (; j < 80; j += 5) {
    f = b ^ c ^ d;
    t = a << 5 | a >>> 27;
    e = t + f + e - 899497514 + blocks2[j] << 0;
    b = b << 30 | b >>> 2;
    f = a ^ b ^ c;
    t = e << 5 | e >>> 27;
    d = t + f + d - 899497514 + blocks2[j + 1] << 0;
    a = a << 30 | a >>> 2;
    f = e ^ a ^ b;
    t = d << 5 | d >>> 27;
    c = t + f + c - 899497514 + blocks2[j + 2] << 0;
    e = e << 30 | e >>> 2;
    f = d ^ e ^ a;
    t = c << 5 | c >>> 27;
    b = t + f + b - 899497514 + blocks2[j + 3] << 0;
    d = d << 30 | d >>> 2;
    f = c ^ d ^ e;
    t = b << 5 | b >>> 27;
    a = t + f + a - 899497514 + blocks2[j + 4] << 0;
    c = c << 30 | c >>> 2;
  }
  this.h0 = this.h0 + a << 0;
  this.h1 = this.h1 + b << 0;
  this.h2 = this.h2 + c << 0;
  this.h3 = this.h3 + d << 0;
  this.h4 = this.h4 + e << 0;
};
Sha1.prototype.hex = function() {
  this.finalize();
  var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;
  return HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >> 28 & 15] + HEX_CHARS[h4 >> 24 & 15] + HEX_CHARS[h4 >> 20 & 15] + HEX_CHARS[h4 >> 16 & 15] + HEX_CHARS[h4 >> 12 & 15] + HEX_CHARS[h4 >> 8 & 15] + HEX_CHARS[h4 >> 4 & 15] + HEX_CHARS[h4 & 15];
};
Sha1.prototype.toString = Sha1.prototype.hex;
Sha1.prototype.digest = function() {
  this.finalize();
  var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;
  return [
    h0 >> 24 & 255,
    h0 >> 16 & 255,
    h0 >> 8 & 255,
    h0 & 255,
    h1 >> 24 & 255,
    h1 >> 16 & 255,
    h1 >> 8 & 255,
    h1 & 255,
    h2 >> 24 & 255,
    h2 >> 16 & 255,
    h2 >> 8 & 255,
    h2 & 255,
    h3 >> 24 & 255,
    h3 >> 16 & 255,
    h3 >> 8 & 255,
    h3 & 255,
    h4 >> 24 & 255,
    h4 >> 16 & 255,
    h4 >> 8 & 255,
    h4 & 255
  ];
};
Sha1.prototype.array = Sha1.prototype.digest;
Sha1.prototype.arrayBuffer = function() {
  this.finalize();
  var buffer = new ArrayBuffer(20);
  var dataView = new DataView(buffer);
  dataView.setUint32(0, this.h0);
  dataView.setUint32(4, this.h1);
  dataView.setUint32(8, this.h2);
  dataView.setUint32(12, this.h3);
  dataView.setUint32(16, this.h4);
  return buffer;
};

// node_modules/@langchain/core/dist/caches/base.js
init_utils2();

// node_modules/@langchain/core/dist/language_models/base.js
init_prompt_values();
init_utils2();
init_async_caller2();

// node_modules/js-tiktoken/dist/chunk-3652LHBA.js
var import_base64_js = __toESM(require_base64_js(), 1);
var __defProp2 = Object.defineProperty;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField2 = (obj, key, value) => {
  __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function bytePairMerge(piece, ranks) {
  let parts = Array.from(
    { length: piece.length },
    (_, i) => ({ start: i, end: i + 1 })
  );
  while (parts.length > 1) {
    let minRank = null;
    for (let i = 0; i < parts.length - 1; i++) {
      const slice = piece.slice(parts[i].start, parts[i + 1].end);
      const rank = ranks.get(slice.join(","));
      if (rank == null)
        continue;
      if (minRank == null || rank < minRank[0]) {
        minRank = [rank, i];
      }
    }
    if (minRank != null) {
      const i = minRank[1];
      parts[i] = { start: parts[i].start, end: parts[i + 1].end };
      parts.splice(i + 1, 1);
    } else {
      break;
    }
  }
  return parts;
}
function bytePairEncode(piece, ranks) {
  if (piece.length === 1)
    return [ranks.get(piece.join(","))];
  return bytePairMerge(piece, ranks).map((p) => ranks.get(piece.slice(p.start, p.end).join(","))).filter((x) => x != null);
}
function escapeRegex(str) {
  return str.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}
var _Tiktoken = class {
  constructor(ranks, extendedSpecialTokens) {
    /** @internal */
    __publicField(this, "specialTokens");
    /** @internal */
    __publicField(this, "inverseSpecialTokens");
    /** @internal */
    __publicField(this, "patStr");
    /** @internal */
    __publicField(this, "textEncoder", new TextEncoder());
    /** @internal */
    __publicField(this, "textDecoder", new TextDecoder("utf-8"));
    /** @internal */
    __publicField(this, "rankMap", /* @__PURE__ */ new Map());
    /** @internal */
    __publicField(this, "textMap", /* @__PURE__ */ new Map());
    this.patStr = ranks.pat_str;
    const uncompressed = ranks.bpe_ranks.split("\n").filter(Boolean).reduce((memo, x) => {
      const [_, offsetStr, ...tokens] = x.split(" ");
      const offset = Number.parseInt(offsetStr, 10);
      tokens.forEach((token, i) => memo[token] = offset + i);
      return memo;
    }, {});
    for (const [token, rank] of Object.entries(uncompressed)) {
      const bytes = import_base64_js.default.toByteArray(token);
      this.rankMap.set(bytes.join(","), rank);
      this.textMap.set(rank, bytes);
    }
    this.specialTokens = { ...ranks.special_tokens, ...extendedSpecialTokens };
    this.inverseSpecialTokens = Object.entries(this.specialTokens).reduce((memo, [text, rank]) => {
      memo[rank] = this.textEncoder.encode(text);
      return memo;
    }, {});
  }
  encode(text, allowedSpecial = [], disallowedSpecial = "all") {
    const regexes = new RegExp(this.patStr, "ug");
    const specialRegex = _Tiktoken.specialTokenRegex(
      Object.keys(this.specialTokens)
    );
    const ret = [];
    const allowedSpecialSet = new Set(
      allowedSpecial === "all" ? Object.keys(this.specialTokens) : allowedSpecial
    );
    const disallowedSpecialSet = new Set(
      disallowedSpecial === "all" ? Object.keys(this.specialTokens).filter(
        (x) => !allowedSpecialSet.has(x)
      ) : disallowedSpecial
    );
    if (disallowedSpecialSet.size > 0) {
      const disallowedSpecialRegex = _Tiktoken.specialTokenRegex([
        ...disallowedSpecialSet
      ]);
      const specialMatch = text.match(disallowedSpecialRegex);
      if (specialMatch != null) {
        throw new Error(
          `The text contains a special token that is not allowed: ${specialMatch[0]}`
        );
      }
    }
    let start = 0;
    while (true) {
      let nextSpecial = null;
      let startFind = start;
      while (true) {
        specialRegex.lastIndex = startFind;
        nextSpecial = specialRegex.exec(text);
        if (nextSpecial == null || allowedSpecialSet.has(nextSpecial[0]))
          break;
        startFind = nextSpecial.index + 1;
      }
      const end = nextSpecial?.index ?? text.length;
      for (const match of text.substring(start, end).matchAll(regexes)) {
        const piece = this.textEncoder.encode(match[0]);
        const token2 = this.rankMap.get(piece.join(","));
        if (token2 != null) {
          ret.push(token2);
          continue;
        }
        ret.push(...bytePairEncode(piece, this.rankMap));
      }
      if (nextSpecial == null)
        break;
      let token = this.specialTokens[nextSpecial[0]];
      ret.push(token);
      start = nextSpecial.index + nextSpecial[0].length;
    }
    return ret;
  }
  decode(tokens) {
    const res = [];
    let length = 0;
    for (let i2 = 0; i2 < tokens.length; ++i2) {
      const token = tokens[i2];
      const bytes = this.textMap.get(token) ?? this.inverseSpecialTokens[token];
      if (bytes != null) {
        res.push(bytes);
        length += bytes.length;
      }
    }
    const mergedArray = new Uint8Array(length);
    let i = 0;
    for (const bytes of res) {
      mergedArray.set(bytes, i);
      i += bytes.length;
    }
    return this.textDecoder.decode(mergedArray);
  }
};
var Tiktoken = _Tiktoken;
__publicField2(Tiktoken, "specialTokenRegex", (tokens) => {
  return new RegExp(tokens.map((i) => escapeRegex(i)).join("|"), "g");
});

// node_modules/@langchain/core/dist/utils/tiktoken.js
init_async_caller2();

// node_modules/@langchain/core/dist/language_models/base.js
init_base4();

// node_modules/@langchain/core/dist/language_models/chat_models.js
init_manager();
init_base4();
init_stream();

// node_modules/@langchain/core/dist/runnables/passthrough.js
init_stream();
init_base4();
init_config();

// node_modules/@langchain/core/dist/language_models/chat_models.js
init_base();

// node_modules/whatwg-fetch/fetch.js
var g = typeof globalThis !== "undefined" && globalThis || typeof self !== "undefined" && self || // eslint-disable-next-line no-undef
typeof global !== "undefined" && global || {};
var support = {
  searchParams: "URLSearchParams" in g,
  iterable: "Symbol" in g && "iterator" in Symbol,
  blob: "FileReader" in g && "Blob" in g && function() {
    try {
      new Blob();
      return true;
    } catch (e) {
      return false;
    }
  }(),
  formData: "FormData" in g,
  arrayBuffer: "ArrayBuffer" in g
};
function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}
if (support.arrayBuffer) {
  viewClasses = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ];
  isArrayBufferView = ArrayBuffer.isView || function(obj) {
    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
  };
}
var viewClasses;
var isArrayBufferView;
function normalizeName(name) {
  if (typeof name !== "string") {
    name = String(name);
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
    throw new TypeError('Invalid character in header field name: "' + name + '"');
  }
  return name.toLowerCase();
}
function normalizeValue(value) {
  if (typeof value !== "string") {
    value = String(value);
  }
  return value;
}
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift();
      return { done: value === void 0, value };
    }
  };
  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }
  return iterator;
}
function Headers2(headers) {
  this.map = {};
  if (headers instanceof Headers2) {
    headers.forEach(function(value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      if (header.length != 2) {
        throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + header.length);
      }
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name]);
    }, this);
  }
}
Headers2.prototype.append = function(name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ", " + value : value;
};
Headers2.prototype["delete"] = function(name) {
  delete this.map[normalizeName(name)];
};
Headers2.prototype.get = function(name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};
Headers2.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name));
};
Headers2.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};
Headers2.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};
Headers2.prototype.keys = function() {
  var items = [];
  this.forEach(function(value, name) {
    items.push(name);
  });
  return iteratorFor(items);
};
Headers2.prototype.values = function() {
  var items = [];
  this.forEach(function(value) {
    items.push(value);
  });
  return iteratorFor(items);
};
Headers2.prototype.entries = function() {
  var items = [];
  this.forEach(function(value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};
if (support.iterable) {
  Headers2.prototype[Symbol.iterator] = Headers2.prototype.entries;
}
function consumed(body) {
  if (body._noBody) return;
  if (body.bodyUsed) {
    return Promise.reject(new TypeError("Already read"));
  }
  body.bodyUsed = true;
}
function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result);
    };
    reader.onerror = function() {
      reject(reader.error);
    };
  });
}
function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}
function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
  var encoding = match ? match[1] : "utf-8";
  reader.readAsText(blob, encoding);
  return promise;
}
function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);
  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }
  return chars.join("");
}
function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0);
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer;
  }
}
function Body() {
  this.bodyUsed = false;
  this._initBody = function(body) {
    this.bodyUsed = this.bodyUsed;
    this._bodyInit = body;
    if (!body) {
      this._noBody = true;
      this._bodyText = "";
    } else if (typeof body === "string") {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer);
      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }
    if (!this.headers.get("content-type")) {
      if (typeof body === "string") {
        this.headers.set("content-type", "text/plain;charset=UTF-8");
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set("content-type", this._bodyBlob.type);
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
      }
    }
  };
  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }
      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
      } else if (this._bodyFormData) {
        throw new Error("could not read FormData body as blob");
      } else {
        return Promise.resolve(new Blob([this._bodyText]));
      }
    };
  }
  this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var isConsumed = consumed(this);
      if (isConsumed) {
        return isConsumed;
      } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
        return Promise.resolve(
          this._bodyArrayBuffer.buffer.slice(
            this._bodyArrayBuffer.byteOffset,
            this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
          )
        );
      } else {
        return Promise.resolve(this._bodyArrayBuffer);
      }
    } else if (support.blob) {
      return this.blob().then(readBlobAsArrayBuffer);
    } else {
      throw new Error("could not read as ArrayBuffer");
    }
  };
  this.text = function() {
    var rejected = consumed(this);
    if (rejected) {
      return rejected;
    }
    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error("could not read FormData body as text");
    } else {
      return Promise.resolve(this._bodyText);
    }
  };
  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode);
    };
  }
  this.json = function() {
    return this.text().then(JSON.parse);
  };
  return this;
}
var methods = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}
function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  }
  options = options || {};
  var body = options.body;
  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError("Already read");
    }
    this.url = input.url;
    this.credentials = input.credentials;
    if (!options.headers) {
      this.headers = new Headers2(input.headers);
    }
    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;
    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  } else {
    this.url = String(input);
  }
  this.credentials = options.credentials || this.credentials || "same-origin";
  if (options.headers || !this.headers) {
    this.headers = new Headers2(options.headers);
  }
  this.method = normalizeMethod(options.method || this.method || "GET");
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal || function() {
    if ("AbortController" in g) {
      var ctrl = new AbortController();
      return ctrl.signal;
    }
  }();
  this.referrer = null;
  if ((this.method === "GET" || this.method === "HEAD") && body) {
    throw new TypeError("Body not allowed for GET or HEAD requests");
  }
  this._initBody(body);
  if (this.method === "GET" || this.method === "HEAD") {
    if (options.cache === "no-store" || options.cache === "no-cache") {
      var reParamSearch = /([?&])_=[^&]*/;
      if (reParamSearch.test(this.url)) {
        this.url = this.url.replace(reParamSearch, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
      } else {
        var reQueryString = /\?/;
        this.url += (reQueryString.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
      }
    }
  }
}
Request.prototype.clone = function() {
  return new Request(this, { body: this._bodyInit });
};
function decode(body) {
  var form = new FormData();
  body.trim().split("&").forEach(function(bytes) {
    if (bytes) {
      var split = bytes.split("=");
      var name = split.shift().replace(/\+/g, " ");
      var value = split.join("=").replace(/\+/g, " ");
      form.append(decodeURIComponent(name), decodeURIComponent(value));
    }
  });
  return form;
}
function parseHeaders(rawHeaders) {
  var headers = new Headers2();
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
  preProcessedHeaders.split("\r").map(function(header) {
    return header.indexOf("\n") === 0 ? header.substr(1, header.length) : header;
  }).forEach(function(line) {
    var parts = line.split(":");
    var key = parts.shift().trim();
    if (key) {
      var value = parts.join(":").trim();
      try {
        headers.append(key, value);
      } catch (error) {
        console.warn("Response " + error.message);
      }
    }
  });
  return headers;
}
Body.call(Request.prototype);
function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  }
  if (!options) {
    options = {};
  }
  this.type = "default";
  this.status = options.status === void 0 ? 200 : options.status;
  if (this.status < 200 || this.status > 599) {
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  }
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = options.statusText === void 0 ? "" : "" + options.statusText;
  this.headers = new Headers2(options.headers);
  this.url = options.url || "";
  this._initBody(bodyInit);
}
Body.call(Response.prototype);
Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers2(this.headers),
    url: this.url
  });
};
Response.error = function() {
  var response = new Response(null, { status: 200, statusText: "" });
  response.ok = false;
  response.status = 0;
  response.type = "error";
  return response;
};
var redirectStatuses = [301, 302, 303, 307, 308];
Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError("Invalid status code");
  }
  return new Response(null, { status, headers: { location: url } });
};
var DOMException = g.DOMException;
try {
  new DOMException();
} catch (err) {
  DOMException = function(message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };
  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}
function fetch2(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init);
    if (request.signal && request.signal.aborted) {
      return reject(new DOMException("Aborted", "AbortError"));
    }
    var xhr = new XMLHttpRequest();
    function abortXhr() {
      xhr.abort();
    }
    xhr.onload = function() {
      var options = {
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || "")
      };
      if (request.url.indexOf("file://") === 0 && (xhr.status < 200 || xhr.status > 599)) {
        options.status = 200;
      } else {
        options.status = xhr.status;
      }
      options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
      var body = "response" in xhr ? xhr.response : xhr.responseText;
      setTimeout(function() {
        resolve(new Response(body, options));
      }, 0);
    };
    xhr.onerror = function() {
      setTimeout(function() {
        reject(new TypeError("Network request failed"));
      }, 0);
    };
    xhr.ontimeout = function() {
      setTimeout(function() {
        reject(new TypeError("Network request timed out"));
      }, 0);
    };
    xhr.onabort = function() {
      setTimeout(function() {
        reject(new DOMException("Aborted", "AbortError"));
      }, 0);
    };
    function fixUrl(url) {
      try {
        return url === "" && g.location.href ? g.location.href : url;
      } catch (e) {
        return url;
      }
    }
    xhr.open(request.method, fixUrl(request.url), true);
    if (request.credentials === "include") {
      xhr.withCredentials = true;
    } else if (request.credentials === "omit") {
      xhr.withCredentials = false;
    }
    if ("responseType" in xhr) {
      if (support.blob) {
        xhr.responseType = "blob";
      } else if (support.arrayBuffer) {
        xhr.responseType = "arraybuffer";
      }
    }
    if (init && typeof init.headers === "object" && !(init.headers instanceof Headers2 || g.Headers && init.headers instanceof g.Headers)) {
      var names = [];
      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
        names.push(normalizeName(name));
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
      });
      request.headers.forEach(function(value, name) {
        if (names.indexOf(name) === -1) {
          xhr.setRequestHeader(name, value);
        }
      });
    } else {
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });
    }
    if (request.signal) {
      request.signal.addEventListener("abort", abortXhr);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          request.signal.removeEventListener("abort", abortXhr);
        }
      };
    }
    xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
  });
}
fetch2.polyfill = true;
if (!g.fetch) {
  g.fetch = fetch2;
  g.Headers = Headers2;
  g.Request = Request;
  g.Response = Response;
}

// node_modules/ollama/dist/shared/ollama.cddbc85b.mjs
var version = "0.5.11";
var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var ResponseError = class _ResponseError extends Error {
  constructor(error, status_code) {
    super(error);
    this.error = error;
    this.status_code = status_code;
    this.name = "ResponseError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _ResponseError);
    }
  }
};
var AbortableAsyncIterator = class {
  constructor(abortController, itr, doneCallback) {
    __publicField$1(this, "abortController");
    __publicField$1(this, "itr");
    __publicField$1(this, "doneCallback");
    this.abortController = abortController;
    this.itr = itr;
    this.doneCallback = doneCallback;
  }
  abort() {
    this.abortController.abort();
  }
  async *[Symbol.asyncIterator]() {
    for await (const message of this.itr) {
      if ("error" in message) {
        throw new Error(message.error);
      }
      yield message;
      if (message.done || message.status === "success") {
        this.doneCallback();
        return;
      }
    }
    throw new Error("Did not receive done or success response in stream.");
  }
};
var checkOk = async (response) => {
  if (response.ok) {
    return;
  }
  let message = `Error ${response.status}: ${response.statusText}`;
  let errorData = null;
  if (response.headers.get("content-type")?.includes("application/json")) {
    try {
      errorData = await response.json();
      message = errorData.error || message;
    } catch (error) {
      console.log("Failed to parse error response as JSON");
    }
  } else {
    try {
      console.log("Getting text from response");
      const textResponse = await response.text();
      message = textResponse || message;
    } catch (error) {
      console.log("Failed to get text from error response");
    }
  }
  throw new ResponseError(message, response.status);
};
function getPlatform() {
  if (typeof window !== "undefined" && window.navigator) {
    return `${window.navigator.platform.toLowerCase()} Browser/${navigator.userAgent};`;
  } else if (typeof process !== "undefined") {
    return `${process.arch} ${process.platform} Node.js/${process.version}`;
  }
  return "";
}
var fetchWithHeaders = async (fetch3, url, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": `ollama-js/${version} (${getPlatform()})`
  };
  if (!options.headers) {
    options.headers = {};
  }
  const customHeaders = Object.fromEntries(
    Object.entries(options.headers).filter(([key]) => !Object.keys(defaultHeaders).some((defaultKey) => defaultKey.toLowerCase() === key.toLowerCase()))
  );
  options.headers = {
    ...defaultHeaders,
    ...customHeaders
  };
  return fetch3(url, options);
};
var get = async (fetch3, host, options) => {
  const response = await fetchWithHeaders(fetch3, host, {
    headers: options?.headers
  });
  await checkOk(response);
  return response;
};
var post = async (fetch3, host, data, options) => {
  const isRecord = (input) => {
    return input !== null && typeof input === "object" && !Array.isArray(input);
  };
  const formattedData = isRecord(data) ? JSON.stringify(data) : data;
  const response = await fetchWithHeaders(fetch3, host, {
    method: "POST",
    body: formattedData,
    signal: options?.signal,
    headers: options?.headers
  });
  await checkOk(response);
  return response;
};
var del = async (fetch3, host, data, options) => {
  const response = await fetchWithHeaders(fetch3, host, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: options?.headers
  });
  await checkOk(response);
  return response;
};
var parseJSON = async function* (itr) {
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  const reader = itr.getReader();
  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(chunk);
    const parts = buffer.split("\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      try {
        yield JSON.parse(part);
      } catch (error) {
        console.warn("invalid json: ", part);
      }
    }
  }
  for (const part of buffer.split("\n").filter((p) => p !== "")) {
    try {
      yield JSON.parse(part);
    } catch (error) {
      console.warn("invalid json: ", part);
    }
  }
};
var formatHost = (host) => {
  if (!host) {
    return "http://127.0.0.1:11434";
  }
  let isExplicitProtocol = host.includes("://");
  if (host.startsWith(":")) {
    host = `http://127.0.0.1${host}`;
    isExplicitProtocol = true;
  }
  if (!isExplicitProtocol) {
    host = `http://${host}`;
  }
  const url = new URL(host);
  let port = url.port;
  if (!port) {
    if (!isExplicitProtocol) {
      port = "11434";
    } else {
      port = url.protocol === "https:" ? "443" : "80";
    }
  }
  let formattedHost = `${url.protocol}//${url.hostname}:${port}${url.pathname}`;
  if (formattedHost.endsWith("/")) {
    formattedHost = formattedHost.slice(0, -1);
  }
  return formattedHost;
};
var __defProp3 = Object.defineProperty;
var __defNormalProp3 = (obj, key, value) => key in obj ? __defProp3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField3 = (obj, key, value) => {
  __defNormalProp3(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var Ollama$1 = class Ollama {
  constructor(config) {
    __publicField3(this, "config");
    __publicField3(this, "fetch");
    __publicField3(this, "ongoingStreamedRequests", []);
    this.config = {
      host: "",
      headers: config?.headers
    };
    if (!config?.proxy) {
      this.config.host = formatHost(config?.host ?? "http://127.0.0.1:11434");
    }
    this.fetch = config?.fetch ?? fetch;
  }
  // Abort any ongoing streamed requests to Ollama
  abort() {
    for (const request of this.ongoingStreamedRequests) {
      request.abort();
    }
    this.ongoingStreamedRequests.length = 0;
  }
  /**
   * Processes a request to the Ollama server. If the request is streamable, it will return a
   * AbortableAsyncIterator that yields the response messages. Otherwise, it will return the response
   * object.
   * @param endpoint {string} - The endpoint to send the request to.
   * @param request {object} - The request object to send to the endpoint.
   * @protected {T | AbortableAsyncIterator<T>} - The response object or a AbortableAsyncIterator that yields
   * response messages.
   * @throws {Error} - If the response body is missing or if the response is an error.
   * @returns {Promise<T | AbortableAsyncIterator<T>>} - The response object or a AbortableAsyncIterator that yields the streamed response.
   */
  async processStreamableRequest(endpoint, request) {
    request.stream = request.stream ?? false;
    const host = `${this.config.host}/api/${endpoint}`;
    if (request.stream) {
      const abortController = new AbortController();
      const response2 = await post(this.fetch, host, request, {
        signal: abortController.signal,
        headers: this.config.headers
      });
      if (!response2.body) {
        throw new Error("Missing body");
      }
      const itr = parseJSON(response2.body);
      const abortableAsyncIterator = new AbortableAsyncIterator(
        abortController,
        itr,
        () => {
          const i = this.ongoingStreamedRequests.indexOf(abortableAsyncIterator);
          if (i > -1) {
            this.ongoingStreamedRequests.splice(i, 1);
          }
        }
      );
      this.ongoingStreamedRequests.push(abortableAsyncIterator);
      return abortableAsyncIterator;
    }
    const response = await post(this.fetch, host, request, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
  * Encodes an image to base64 if it is a Uint8Array.
  * @param image {Uint8Array | string} - The image to encode.
  * @returns {Promise<string>} - The base64 encoded image.
  */
  async encodeImage(image) {
    if (typeof image !== "string") {
      const uint8Array = new Uint8Array(image);
      let byteString = "";
      const len = uint8Array.byteLength;
      for (let i = 0; i < len; i++) {
        byteString += String.fromCharCode(uint8Array[i]);
      }
      return btoa(byteString);
    }
    return image;
  }
  /**
   * Generates a response from a text prompt.
   * @param request {GenerateRequest} - The request object.
   * @returns {Promise<GenerateResponse | AbortableAsyncIterator<GenerateResponse>>} - The response object or
   * an AbortableAsyncIterator that yields response messages.
   */
  async generate(request) {
    if (request.images) {
      request.images = await Promise.all(request.images.map(this.encodeImage.bind(this)));
    }
    return this.processStreamableRequest("generate", request);
  }
  /**
   * Chats with the model. The request object can contain messages with images that are either
   * Uint8Arrays or base64 encoded strings. The images will be base64 encoded before sending the
   * request.
   * @param request {ChatRequest} - The request object.
   * @returns {Promise<ChatResponse | AbortableAsyncIterator<ChatResponse>>} - The response object or an
   * AbortableAsyncIterator that yields response messages.
   */
  async chat(request) {
    if (request.messages) {
      for (const message of request.messages) {
        if (message.images) {
          message.images = await Promise.all(
            message.images.map(this.encodeImage.bind(this))
          );
        }
      }
    }
    return this.processStreamableRequest("chat", request);
  }
  /**
   * Creates a new model from a stream of data.
   * @param request {CreateRequest} - The request object.
   * @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or a stream of progress responses.
   */
  async create(request) {
    return this.processStreamableRequest("create", {
      name: request.model,
      stream: request.stream,
      modelfile: request.modelfile,
      quantize: request.quantize
    });
  }
  /**
   * Pulls a model from the Ollama registry. The request object can contain a stream flag to indicate if the
   * response should be streamed.
   * @param request {PullRequest} - The request object.
   * @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or
   * an AbortableAsyncIterator that yields response messages.
   */
  async pull(request) {
    return this.processStreamableRequest("pull", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure
    });
  }
  /**
   * Pushes a model to the Ollama registry. The request object can contain a stream flag to indicate if the
   * response should be streamed.
   * @param request {PushRequest} - The request object.
   * @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or
   * an AbortableAsyncIterator that yields response messages.
   */
  async push(request) {
    return this.processStreamableRequest("push", {
      name: request.model,
      stream: request.stream,
      insecure: request.insecure
    });
  }
  /**
   * Deletes a model from the server. The request object should contain the name of the model to
   * delete.
   * @param request {DeleteRequest} - The request object.
   * @returns {Promise<StatusResponse>} - The response object.
   */
  async delete(request) {
    await del(
      this.fetch,
      `${this.config.host}/api/delete`,
      { name: request.model },
      { headers: this.config.headers }
    );
    return { status: "success" };
  }
  /**
   * Copies a model from one name to another. The request object should contain the name of the
   * model to copy and the new name.
   * @param request {CopyRequest} - The request object.
   * @returns {Promise<StatusResponse>} - The response object.
   */
  async copy(request) {
    await post(this.fetch, `${this.config.host}/api/copy`, { ...request }, {
      headers: this.config.headers
    });
    return { status: "success" };
  }
  /**
   * Lists the models on the server.
   * @returns {Promise<ListResponse>} - The response object.
   * @throws {Error} - If the response body is missing.
   */
  async list() {
    const response = await get(this.fetch, `${this.config.host}/api/tags`, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Shows the metadata of a model. The request object should contain the name of the model.
   * @param request {ShowRequest} - The request object.
   * @returns {Promise<ShowResponse>} - The response object.
   */
  async show(request) {
    const response = await post(this.fetch, `${this.config.host}/api/show`, {
      ...request
    }, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Embeds text input into vectors.
   * @param request {EmbedRequest} - The request object.
   * @returns {Promise<EmbedResponse>} - The response object.
   */
  async embed(request) {
    const response = await post(this.fetch, `${this.config.host}/api/embed`, {
      ...request
    }, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Embeds a text prompt into a vector.
   * @param request {EmbeddingsRequest} - The request object.
   * @returns {Promise<EmbeddingsResponse>} - The response object.
   */
  async embeddings(request) {
    const response = await post(this.fetch, `${this.config.host}/api/embeddings`, {
      ...request
    }, {
      headers: this.config.headers
    });
    return await response.json();
  }
  /**
   * Lists the running models on the server
   * @returns {Promise<ListResponse>} - The response object.
   * @throws {Error} - If the response body is missing.
   */
  async ps() {
    const response = await get(this.fetch, `${this.config.host}/api/ps`, {
      headers: this.config.headers
    });
    return await response.json();
  }
};
var browser = new Ollama$1();

// node_modules/@langchain/core/outputs.js
init_outputs();

// node_modules/@langchain/core/dist/utils/function_calling.js
init_esm();
init_base4();

// node_modules/@langchain/core/utils/stream.js
init_stream();

// node_modules/@langchain/core/dist/embeddings.js
init_async_caller2();

// node_modules/@langchain/core/dist/language_models/llms.js
init_messages2();
init_outputs();
init_manager();
init_stream();
init_base();

// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get-html") {
    console.log("Background.js Received message:", request);
    const activeTab = request.tabId;
    console.log("Active tab found:", activeTab);
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab },
        func: getHTMLContent
      },
      (results) => {
        if (results && results[0]?.result) {
          console.log("Sending response with HTML content.");
          sendResponse({ html: results[0].result });
        } else {
          console.error("No results or invalid response from scripting.");
          sendResponse({ html: "" });
        }
      }
    );
    return true;
  }
  return true;
});
function getHTMLContent() {
  return document.documentElement.outerHTML;
}
/*! Bundled license information:

@langchain/core/dist/utils/fast-json-patch/src/helpers.js:
  (*!
   * https://github.com/Starcounter-Jack/JSON-Patch
   * (c) 2017-2022 Joachim Wester
   * MIT licensed
   *)

@langchain/core/dist/utils/fast-json-patch/src/duplex.js:
  (*!
   * https://github.com/Starcounter-Jack/JSON-Patch
   * (c) 2013-2021 Joachim Wester
   * MIT license
   *)

mustache/mustache.mjs:
  (*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   *)

@langchain/core/dist/utils/js-sha1/hash.js:
  (*
   * [js-sha1]{@link https://github.com/emn178/js-sha1}
   *
   * @version 0.6.0
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2017
   * @license MIT
   *)
*/
