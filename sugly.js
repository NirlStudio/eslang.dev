/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./web/lib/shell.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/loader-cache.js":
/*!*****************************!*\
  !*** ./lib/loader-cache.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var KeyPrefix = '/sugly/loaded:'
var KeyVersion = KeyPrefix + 'version:'

function createStore (localStorage) {
  function enumKeys () {
    var keys = []
    for (var i = 0, len = localStorage.length; i < len; i++) {
      var key = localStorage.key(i)
      if (key.startsWith(KeyPrefix)) {
        keys.push(localStorage.key(i))
      }
    }
    return keys
  }
  return {
    keys: enumKeys,
    getItem: localStorage.getItem.bind(localStorage),
    setItem: localStorage.setItem.bind(localStorage),
    removeItem: localStorage.removeItem.bind(localStorage),
    clear: function () {
      var keys = enumKeys()
      for (var i = 0, len = keys.length; i < len; i++) {
        localStorage.removeItem(keys[i])
      }
      return keys
    }
  }
}

function tryGlobal () {
  return typeof window === 'undefined' ? null
    : window.localStorage ? createStore(window.localStorage) : useMemory()
}

function tryModule () {
  if (typeof window !== 'undefined') {
    return null
  }
  try {
    // optional dependency
    var LocalStorage = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'node-localstorage'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())).LocalStorage
    return createStore(new LocalStorage('./.sugly/loaded'))
  } catch (err) {
    return null
  }
}

function useMemory () {
  var store = Object.create(null)
  return {
    keys: function () {
      return Object.getOwnPropertyNames(store)
    },
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value
    },
    removeItem: function (key) {
      delete store[key]
    },
    clear: function () {
      store = Object.create(null)
    }
  }
}

function keyOf (uri) {
  return typeof uri === 'string' && uri ? KeyPrefix + uri : null
}

function versionKeyOf (uri) {
  return typeof uri === 'string' && uri ? KeyVersion + uri : null
}

function generateTimestamp (version) {
  return 'local:' + Math.trunc(Date.now() / 600 / 1000)
}

module.exports = function (inStorage) {
  var store = inStorage ? tryGlobal() || tryModule() || useMemory()
    : useMemory()

  return {
    store: { // management API
      list: function (filter) {
        var uris = []
        var keys = store.keys()
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].startsWith(KeyVersion)) {
            if (typeof filter !== 'string' || keys[i].indexOf(filter) > 0) {
              uris.push([keys[i].substring(KeyVersion.length), store.getItem(keys[i])])
            }
          }
        }
        return uris
      },
      read: function (uri) {
        var keys = store.keys()
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].startsWith(KeyVersion)) {
            if (typeof uri !== 'string' || keys[i].indexOf(uri) > 0) {
              return store.getItem(keyOf(keys[i].substring(KeyVersion.length)))
            }
          }
        }
      },
      reset: function (filter) {
        var counter = 0
        var keys = store.keys()
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].startsWith(KeyVersion)) {
            if (typeof filter !== 'string' || keys[i].indexOf(filter) > 0) {
              counter++
              store.removeItem(keys[i])
              store.removeItem(keyOf(keys[i].substring(KeyVersion.length)))
            }
          }
        }
        return counter
      },
      clear: function () {
        store.clear()
        return true
      }
    },

    get: function (uri) {
      var key = keyOf(uri)
      return key ? store.getItem(key) : null
    },
    ver: function (uri) {
      var key = versionKeyOf(uri)
      return key ? store.getItem(key) : null
    },
    isTimestamp: function (version) {
      return version.startsWith('local:')
    },
    isExpired: function (version) {
      return version !== generateTimestamp()
    },
    set: function (uri, value, version) {
      if (typeof value !== 'string') {
        return null // invalid call.
      }
      var key = keyOf(uri)
      var verKey = versionKeyOf(uri)
      if (!key || !verKey) {
        return null // invalid call.
      }
      if (typeof version !== 'string' || !key) {
        version = generateTimestamp()
      }
      store.setItem(key, value)
      store.setItem(verKey, version)
      return version
    }
  }
}


/***/ }),

/***/ "./lib/loader-http.js":
/*!****************************!*\
  !*** ./lib/loader-http.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js")
var cache = __webpack_require__(/*! ./loader-cache */ "./lib/loader-cache.js")(true)

function isResolved (url) {
  return /^(http[s]?:\/\/)/i.test(url)
}

function join (base, path) {
  while (base.charAt(base.length - 1) === '/') {
    base = base.substring(0, base.length - 1)
  }
  while (path.charAt(0) === '/') {
    base = base.substring(1)
  }
  var origin = base.indexOf('://');
  (origin > 0) && (origin += 3)
  while (path.startsWith('./') || path.startsWith('../')) {
    if (path.charAt(1) === '/') {
      path = path.substring(2) // skipping leading ./
    } else {
      path = path.substring(3)
      var offset = base.lastIndexOf('/')
      while (base.charAt(offset - 1) === '/') {
        offset--
      }
      if (offset > origin) {
        base = base.substring(0, offset)
      }
    }
  }
  return base + '/' + path
}

function getHostUrl (moduleUri) {
  var offset = moduleUri ? moduleUri.indexOf('://') : 0
  return offset > 0
    ? moduleUri.substring(0, moduleUri.indexOf('/', offset + 3))
    : typeof window === 'undefined' ? 'http://localhost'
      : window.location.origin
}

function getBaseUrl (moduleUri) {
  return moduleUri && moduleUri.indexOf('://') > 0 ? moduleUri
    : typeof window === 'undefined' ? 'http://localhost'
      : window.location.origin + window.location.pathname
}

function allowNotModified (status) {
  return (status >= 200 && status < 300) || status === 304
}

function generateConfig (version) {
  return !version || cache.isTimestamp(version) ? null : {
    validateStatus: allowNotModified,
    headers: {
      'If-None-Match': version
    }
  }
}

function notCached (url, dirs) {
  return [404, 'Not Cached', dirs ? [url, dirs] : [url]]
}

function responseError (url, response) {
  return [response.status, response.statusText, [url]]
}

function responseUnavailable (url, error) {
  return [503, 'Response Unavailable', [url, error]]
}

module.exports = function ($void) {
  var $ = $void.$
  var $Promise = $.promise
  var promiseOfResolved = $Promise['of-resolved']

  var proxy = axios.create({
    timeout: 30000,
    responseType: 'text'
  })

  return {
    cache: cache, // for mgmt. purpose only.

    dir: function (url) {
      var offset = url.lastIndexOf('/')
      return offset === 0 ? '/'
        : offset > 0 ? url.substring(0, offset) : ''
    },
    isResolved: isResolved,
    resolve: function (source, dirs) {
      if (isResolved(source)) {
        return source
      }
      if (dirs.length <= 0) {
        dirs = [source.startsWith('/') ? getHostUrl() : getBaseUrl()]
      }
      if (dirs.length === 1) {
        return join(dirs[0], source)
      }
      for (var i = 0; i < dirs.length; i++) {
        var url = join(dirs[i], source)
        if (cache.ver(url)) {
          return url
        }
      }
      return notCached(source, dirs)
    },
    load: function (url) {
      var data = cache.get(url)
      return data ? [data, cache.ver(url)] : [null, notCached(url)]
    },
    fetch: function (url) {
      var version = cache.ver(url)
      return !cache.isExpired(version) ? promiseOfResolved(url)
        : $Promise.of(function (async) {
          proxy.get(url,
            generateConfig(version)
          ).then(function (response) {
            if (response.status !== 304) {
              cache.set(url, response.data, response.headers['etag'])
            }
            async.resolve(url)
          }).catch(function (error) {
            async.reject(error.response
              ? responseError(url, error.response)
              : responseUnavailable(url, error)
            )
          })
        })
    }
  }
}


/***/ }),

/***/ "./lib/loader.js":
/*!***********************!*\
  !*** ./lib/loader.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var httpLoader = __webpack_require__(/*! ./loader-http */ "./lib/loader-http.js")

function localLoader ($void, http) {
  var fileLoader = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module './loader-fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
  var fs = fileLoader($void)

  return {
    cache: http.cache,
    fsCache: fs.cache,

    dir: fs.dir,
    isResolved: function (uri) {
      return fs.isResolved(uri) || http.isResolved(uri)
    },
    resolve: function (path, dirs) {
      return http.isResolved(path) || fs.isResolved(path) ? path
        : dirs && dirs.length > 0 && http.isResolved(dirs[0])
          ? http.resolve(path, dirs)
          : fs.resolve(path, dirs)
    },
    load: function (uri) {
      return http.isResolved(uri) ? http.load(uri) : fs.load(uri)
    },
    fetch: function (uri) {
      return http.isResolved(uri) ? http.fetch(uri) : fs.fetch(uri)
    }
  }
}

module.exports = function ($void) {
  var http = httpLoader($void)
  return typeof window === 'undefined' ? localLoader($void, http) : http
}


/***/ }),

/***/ "./lib/polyfill.js":
/*!*************************!*\
  !*** ./lib/polyfill.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var records = module.exports = []
var JS = global || window

/* functions are ported from MDN */
if (typeof Object.assign !== 'function') {
  records.push('Object.assign')

  JS.Object.assign = function (target) {
    if (typeof target === 'undefined' || target === null) {
      return null
    }
    var output = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index]
      if (typeof source !== 'undefined' && source !== null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            output[key] = source[key]
          }
        }
      }
    }
    return output
  }
}

if (typeof Object.create !== 'function') {
  records.push('Object.create')

  JS.Object.create = (function () {
    var Temp = function () {}
    return function (prototype) {
      if (prototype === null) {
        prototype = {}
      } else if (prototype !== Object(prototype)) {
        return null
      }
      Temp.prototype = prototype
      var result = new Temp()
      Temp.prototype = null
      return result
    }
  })()
}

if (typeof Object.is !== 'function') {
  records.push('Object.is')

  JS.Object.is = function (x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y // eslint-disable-line no-self-compare
    }
  }
}

if (typeof Object.getOwnPropertyNames !== 'function') {
  records.push('Object.getOwnPropertyNames')

  JS.Object.getOwnPropertyNames = function (obj) {
    var names = []
    for (var name in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, name)) {
        names.push(name)
      }
    }
    return names
  }
}

if (typeof Object.freeze !== 'function') {
  records.push('Object.freeze')

  JS.Object.freeze = function (obj) {
    obj && typeof obj === 'object' && (obj.__sugly_frozen = true)
    return obj
  }
}

if (typeof Object.isFrozen !== 'function') {
  records.push('Object.isFrozen')

  JS.Object.isFrozen = function (obj) {
    return obj ? obj.__sugly_frozen === true : false
  }
}

if (typeof String.prototype.startsWith !== 'function') {
  records.push('String.prototype.startsWith')

  JS.String.prototype.startsWith = function (searchString, position) {
    position = position || 0
    return this.substr(position, searchString.length) === searchString
  }
}

if (typeof String.prototype.endsWith !== 'function') {
  records.push('String.prototype.endsWith')

  JS.String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString()
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length
    }
    position -= searchString.length
    var lastIndex = subjectString.indexOf(searchString, position)
    return lastIndex !== -1 && lastIndex === position
  }
}

if (typeof String.prototype.trim !== 'function') {
  records.push('String.prototype.trim')

  JS.String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}

if (typeof String.prototype.trimLeft !== 'function') {
  records.push('String.prototype.trimLeft')

  JS.String.prototype.trimLeft = function () {
    return this.replace(/^[\s\uFEFF\xA0]+/g, '')
  }
}

if (typeof String.prototype.trimRight !== 'function') {
  records.push('String.prototype.trimRight')

  JS.String.prototype.trimRight = function () {
    return this.replace(/[\s\uFEFF\xA0]+$/g, '')
  }
}

if (typeof Array.isArray !== 'function') {
  records.push('Array.isArray')

  JS.Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}

if (typeof Number.isInteger !== 'function') {
  records.push('Number.isInteger')

  JS.Number.isInteger = function (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
  }
}

if (typeof Number.MAX_SAFE_INTEGER !== 'number') {
  records.push('Number.MAX_SAFE_INTEGER')

  JS.Number.MAX_SAFE_INTEGER = (Math.pow(2, 53) - 1)
}

if (typeof Number.MIN_SAFE_INTEGER !== 'number') {
  records.push('Number.MIN_SAFE_INTEGER')

  JS.Number.MIN_SAFE_INTEGER = -(Math.pow(2, 53) - 1)
}

if (typeof Number.isSafeInteger !== 'function') {
  records.push('Number.isSafeInteger')

  JS.Number.isSafeInteger = function (value) {
    return Number.isInteger(value) &&
      value >= Number.MIN_SAFE_INTEGER &&
      value <= Number.MAX_SAFE_INTEGER
  }
}

if (typeof Date.now !== 'function') {
  records.push('Date.now')

  JS.Date.now = function () {
    return (new Date()).getTime()
  }
}

if (typeof Math.trunc !== 'function') {
  records.push('Math.trunc')

  JS.Math.trunc = function (x) {
    return isNaN(x) || Number.isInteger(x) ? x
      : x > 0 ? Math.floor(x) : Math.ceil(x)
  }
}

if (typeof Math.log2 !== 'function') {
  records.push('Math.log2')

  JS.Math.log2 = function (x) {
    return Math.log(x) * Math.LOG2E
  }
}

if (typeof Math.log10 !== 'function') {
  records.push('Math.log10')

  JS.Math.log10 = function (x) {
    return Math.log(x) * Math.LOG10E
  }
}

if (typeof console !== 'object') {
  records.push('console.log')
  records.push('console.warn')

  JS.console = {
    log: function () {},
    warn: function () {}
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./lib/shell.js":
/*!**********************!*\
  !*** ./lib/shell.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void, reader, proc) {
  var $ = $void.$
  var typeOf = $.type.of
  var warn = $void.$warn
  var print = $void.$print
  var printf = $void.$printf
  var thisCall = $void.thisCall

  return function agent (args, echo, profile) {
    var echoing = false
    if (typeof echo !== 'function') {
      echo = print.bind(null, '=')
    }
    if (typeof profile !== 'string' || !profile) {
      profile = '(var * (load "profile"))'
    }

    function exit () {
      print('See you again.')
      reader.close()
      return proc.exit(0)
    }

    // create the interpreter
    function typeInfoOf (prefix, value) {
      var info = '#(' + prefix + thisCall(typeOf(value), 'to-string')
      var name = !value ? ''
        : typeof value.$name === 'string' ? value.$name
          : typeof value.name === 'string' ? value.name
            : ''
      return name ? info + ': ' + name + ')# ' : info + ')# '
    }

    function format (value, prefix) {
      return typeInfoOf(prefix || '', value) + thisCall(value, 'to-string')
    }

    function resolve (value) {
      if (!(value instanceof Promise)) {
        return echo(format(value))
      }
      echo('#(promise: waiting ...)#')
      value.then(function (result) {
        echo(format(result, '... result: '))
      }, function (err) {
        echo(format(err, '... excuse: '))
      })
    }

    function explain (status) {
      status === 'exiting' ? echo(exit())
        : warn.apply(null, Array.prototype.slice.call(arguments, 1))
    }

    var interpret = $void.$interpreter(function (value, status) {
      if (status) {
        explain(status)
      } else if (echoing) {
        resolve(value)
      }
    }, args, proc.env('PWD'))

    // display version.
    interpret('(run "tools/version")\n')

    // expose local loader cache.
    printf('# shell object', 'gray'); printf(' .loader', 'yellow')
    $['.loader'] = $void.loader.cache.store

    printf(', and', 'gray')
    printf(' functions', 'gray'); printf(' .echo', 'blue')
    //  toggle on/of the printing of evaluaion result.
    $['.echo'] = function echo () {
      echoing = !echoing
      if (echoing) {
        return true
      }
      printf('  ') // this is only visible on console.
      return printf('#(bool)# false\n', 'gray')
    }

    printf(',', 'gray'); printf(' .debug', 'blue')
    //  display, enable or disable debug output.
    $['.debug'] = function debug (enabled) {
      var isDebugging = $void.env('is-debugging')
      return typeof enabled === 'undefined' ? isDebugging
        : $void.env('is-debugging',
          enabled !== null && enabled !== 0 && enabled !== false
        )
    }

    printf(' and', 'gray'); printf(' .logging', 'blue')
    //  display or update logging level.
    $['.logging'] = function logging (level) {
      var loggingLevel = $void.env('logging-level')
      return typeof level !== 'number' ? loggingLevel
        : $void.env('logging-level', (level >>= 0) < 0 ? 0
          : level > 127 ? 127 : level
        )
    }
    printf(' are imported.\n', 'gray')

    // initialize shell environment
    interpret(profile + '\n')
    echoing = true

    // waiting for input
    reader.prompt()
    reader.on('line', function (input) {
      interpret(input)
      var depth = interpret('\n')
      reader.prompt(depth > 1 ? '..' : '> ')
    })
  }
}


/***/ }),

/***/ "./lib/stdout.js":
/*!***********************!*\
  !*** ./lib/stdout.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var render, isIE
if (typeof window === 'undefined') {
  render = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'colors/safe'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
  isIE = false
} else {
  render = null
  isIE = /MSIE \d|Trident.*rv:/.test(navigator.userAgent)
}

var styleClasses = Object.assign(Object.create(null), {
  red: 'color',
  green: 'color',
  blue: 'color',
  yellow: 'color',
  grey: 'color',
  gray: 'color',
  underline: 'text-decoration'
})

function formatterOf (props) {
  return render ? function format (text) {
    for (var key in props) {
      var value = props[key]
      text = render[value](text)
    }
    return text
  } : null
}

function applyClass (cls) {
  var values = cls.split(/\s/)
  var props = {}
  var enabled = false
  for (var i = 0; i < values.length; i++) {
    var value = values[i]
    if (styleClasses[value]) {
      enabled = true
      props[styleClasses[value]] = value
    }
  }
  return enabled && formatterOf(props)
}

function applyStyle (obj) {
  var props = {}
  var enabled = false
  for (var key in obj) {
    var value = obj[key]
    if (styleClasses[value] === key) {
      enabled = true
      props[key] = value
    }
  }
  return enabled && formatterOf(props)
}

var bindToConsole = isIE ? function (method, prompt) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(prompt)
    console[method].apply(console, args)
  }
} : function (method, prompt) {
  return console[method].bind(console, prompt)
}

module.exports = function ($void, tracing) {
  var $ = $void.$
  var stringOf = $.string.of

  const write = tracing || typeof window !== 'undefined' ? null
    : function (text) {
      process.stdout.write(text)
      return text
    }

  function formatArgs () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      strings.push(stringOf(arguments[i]))
    }
    return strings.join(' ')
  }

  function bindTo (method, type, color) {
    var log = !console[method]
      ? bindToConsole('log', '#' + type)
      : $void.isNativeHost
        ? bindToConsole(method, render.gray('#' + type))
        : bindToConsole(method, '#')

    return $void.isNativeHost ? function () {
      var text = formatArgs.apply(null, arguments)
      log(color ? color(text) : text)
      return text
    } : function () {
      log.apply(null, arguments)
      return formatArgs.apply(null, arguments)
    }
  }

  // default native output methods
  return {
    print: function () {
      var text = formatArgs.apply(null, arguments)
      !tracing && console.log(text)
      return text
    },
    printf: function (value, format) {
      var text = formatArgs(value)
      if (write) {
        var formatted = null
        if (format && render) {
          var formatter = typeof format === 'string' ? applyClass(format)
            : typeof format === 'object' ? applyStyle(format) : null
          formatted = formatter ? formatter(text) : text
        }
        write(formatted || text)
      }
      return text
    },
    // by default, write logs to js console even in tracing mode (web browser).
    verbose: bindTo('info', 'V', render && render.gray),
    info: bindTo('info', 'I', render && render.gray),
    warn: bindTo('warn', 'W', render && render.yellow),
    error: bindTo('error', 'E', render && render.red),
    debug: bindTo('debug', 'D', render && render.blue)
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./modules/index.js":
/*!**************************!*\
  !*** ./modules/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var loaders = []

module.exports = function (uri) {
  switch (uri) {
    case 'restful':
      return __webpack_require__(/*! ./restful */ "./modules/restful.js")
    case 'symbols':
      return __webpack_require__(/*! ./symbols */ "./modules/symbols.js")
    case 'web':
      return __webpack_require__(/*! ./web */ "./modules/web.js")
    default:
      break
  }
  for (var i = loaders.length - 1; i >= 0; i--) {
    var module_ = loaders[i](uri)
    if (module_) {
      return module_
    }
  }
  throw new Error('Undefine native module: ' + uri)
}

module.exports.register = function (loader) {
  loaders.unshift(loader)
}

module.exports.unregister = function (loader) {
  for (var i = loaders.length - 1; i >= 0; i--) {
    if (loaders[i] === loader) {
      loaders.splice(i, 1)
    }
  }
}


/***/ }),

/***/ "./modules/restful.js":
/*!****************************!*\
  !*** ./modules/restful.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js")

var AxiosMethods = [
  'request', 'options', 'head', 'get', 'post', 'put', 'patch', 'delete'
]

function bind (agent, service) {
  for (var i = 0; i < AxiosMethods.length; i++) {
    var method = AxiosMethods[i]
    agent[method] = service[method].bind(service)
  }
  return agent
}

module.exports = function (exporting, context, $void) {
  var $ = $void.$
  var $Object = $.object

  // export operations on default instance.
  bind(exporting, axios)

  // create a service instance with a particular configuration set.
  exporting.of = function (config) {
    if (!config || typeof config !== 'object') {
      config = $Object.empty()
    }
    return bind($Object.of({ config: config }), axios.create(config))
  }

  return true
}


/***/ }),

/***/ "./modules/symbols.js":
/*!****************************!*\
  !*** ./modules/symbols.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var proc = typeof window === 'undefined' ? global.process : {
  // a fake process object for web browser.
  platform: 'browser',
  env: {
    'DISPLAY': window.navigator.userAgent
  }
}
var os = proc.platform

module.exports = function (exporting) {
  // define special indicator characters.
  if (os === 'win32') {
    exporting.passed = '\u221a '
    exporting.failed = '\u00d7 '
    exporting.pending = '~ '
  } else if (os === 'darwin' || proc.env['DISPLAY']) {
    exporting.passed = '✓ '
    exporting.failed = '✘ '
    exporting.pending = '\u22EF '
  } else { // *nix without X.
    exporting.passed = '= '
    exporting.failed = 'x '
    exporting.pending = '~ '
  }
  // it always succeeds.
  return true
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./modules/web.js":
/*!************************!*\
  !*** ./modules/web.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (exporting) {
  if (typeof window === 'undefined') {
    return 'web module is only available when hosted in web browser'
  }

  // exports here may be wrapped in future.
  exporting.window = window
  exporting.location = window.location
  exporting.document = window.document
  exporting.navigator = window.navigator
  return true
}


/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ( true &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./sugly.js":
/*!******************!*\
  !*** ./sugly.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

__webpack_require__(/*! ./lib/polyfill */ "./lib/polyfill.js")

module.exports = function sugly (stdout, loader) {
  // create the void.
  var start = __webpack_require__(/*! ./sugly/start */ "./sugly/start.js")
  var $void = start(stdout)
  // mount native module loader
  $void.require = __webpack_require__(/*! ./modules */ "./modules/index.js")
  // create the source loader
  $void.loader = loader($void)
  // set the location of the runtime
  $void.runtime('home',
    typeof window === 'undefined' ? __dirname : window.location.origin
  )
  // now we got a complete runtime.
  return $void
}

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./sugly/compiler.js":
/*!***************************!*\
  !*** ./sugly/compiler.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Tuple$ = $void.Tuple
  var warn = $void.$warn
  var $export = $void.export
  var tokenizer = $.tokenizer
  var isApplicable = $void.isApplicable
  var formatPattern = $void.formatPattern
  var sharedSymbolOf = $void.sharedSymbolOf

  var symbolPairing = $.symbol.pairing
  var symbolSubject = $.symbol.subject
  var symbolString = sharedSymbolOf('string')
  var symbolFormat = sharedSymbolOf('format')
  var symbolToString = sharedSymbolOf('to-string')

  var makeSourceUri = function (uri, version) {
    return !uri || typeof uri !== 'string' ? ''
      : !version || typeof version !== 'string' ? uri
        : uri + '@' + version
  }

  var compiler = $export($, 'compiler', function (evaluate, srcUri) {
    if (!isApplicable(evaluate)) {
      return $.compile
    }

    var srcText = ''
    if (!srcUri || typeof srcUri !== 'string') {
      srcUri = ''
    }

    var stack, sourceStack, waiter, lastToken, openningLine, openningOffset
    resetContext()

    function resetContext () {
      stack = [[]]
      sourceStack = [[[[0, 0, 0]]]]
      waiter = null
      lastToken = ['space', '', [0, 0, 0]]
      openningLine = -1
      openningOffset = 0
    }

    var tokenizing = tokenizer(compileToken, srcUri)
    return function compiling (text) {
      srcText = text && typeof text === 'string' ? text : ''
      if (tokenizing(text)) {
        return stack.length
      }
      // reset compiling context.
      waiter && waiter()
      if (stack.length > 1) {
        warn('compiler', 'open statements are not properly closed.',
          [lastToken, srcUri || srcText])
        endAll(null, lastToken[2])
      }
      tryToRaise()
      resetContext()
      return 0
    }

    function compileToken (type, value, source) {
      var endingLine = source[source.length - 2]
      if (endingLine !== openningLine) {
        openningLine = endingLine
        openningOffset = stack[stack.length - 1].length
      }
      if (!waiter || !waiter(type, value, source)) {
        parseToken(type, value, source)
      }
      lastToken = [type, value, source]
    }

    function parseToken (type, value, source) {
      switch (type) {
        case 'value':
          pushValue(value, source)
          break
        case 'symbol':
          pushSymbol(value, source)
          break
        case 'punctuation':
          pushPunctuation(value, source)
          break
        case 'format':
          pushFormat(value, source)
          break
        case 'space':
          if (value === '\n') {
            tryToRaise()
          }
          break
        case 'comment':
          // comment document should be put in specs.
          break
        default:
          // do nothing for a free space.
          break
      }
    }

    function tryToRaise () {
      while (stack[0].length > 0) {
        evaluate([stack[0].shift(), sourceStack[0].splice(0, 1)])
      }
    }

    function pushValue (value, source) {
      stack[stack.length - 1].push(value)
      sourceStack[sourceStack.length - 1].push(source)
    }

    function pushSymbol (value, source) {
      switch (value.key) {
        case ',':
          // a free comma functions only as a stronger visual indicator like
          // a whitespace, so it will be just skipped in building AST.
          if (lastToken[0] === 'symbol' && lastToken[1].key === ',') {
            pushValue(null, source)
          }
          break
        case ';':
          endLine(value, source)
          if (!crossingLines()) {
            closeLine(value, source)
          }
          break
        default:
          pushValue(value, source)
      }
    }

    function pushPunctuation (value, source) {
      switch (value) {
        case '(': // begin a new clause
          stack.push([])
          sourceStack.push([[source]])
          break
        case ')':
          // wait for next token to decide
          waiter = endingWaiter
          break
        default: // just skip unknow punctuations as some placeholders.
          break
      }
    }

    function pushFormat (pattern, source) {
      var args = formatPattern(pattern)
      if (!(args.length > 1)) {
        if (pattern.indexOf('"') < 0) {
          warn('compiler', 'unnecessary format string.',
            pattern, ['format', pattern, source, srcUri || srcText])
        }
        return pushValue(args[0], source)
      }

      var beginning = source.slice(0, 3).concat(source.slice(1, 2))
      var ending = source.slice(0, 1).concat(source.slice(-2))
      stack.push([symbolString, symbolFormat])
      sourceStack.push([[beginning], beginning, beginning])

      pushValue(args[0], source)
      for (var i = 1; i < args.length; i++) {
        var code = $.compile(args[i])
        pushValue(code.$.length > 0 ? code.$[0] : null, ending)
      }
      endTopWith(ending)
    }

    function endingWaiter (type, value, source) {
      waiter = null // wait only once.
      if (type !== 'symbol') {
        endClause()
        return false // stop waiting
      }
      switch (value.key) {
        case '.':
          if (stack.length > 1) {
            endMatched(value, source)
          } else {
            warn('compiler', 'extra enclosing ")." is found and ignored.',
              [lastToken, ['symbol', value, source], srcUri || srcText])
          }
          return true
        default:
          endClause()
          return false
      }
    }

    function endTopWith (source) {
      // create a tuple for the top clause, and
      var statement = stack.pop()
      // append ending token(s)' source info.
      var sourceMap = sourceStack.pop()
      sourceMap[0].push(source || lastToken[2])
      while (statement.length > 2 &&
        tryTofoldStatement(statement, sourceMap)
      );
      // push it to the end of container clause.
      sourceMap[0].unshift(srcUri || srcText)
      stack[stack.length - 1].push(new Tuple$(statement, false, sourceMap))
      // since the source has been saved into the tuple, only keeps its overall range.
      sourceStack[sourceStack.length - 1].push(sourceMap[0].slice(1))
    }

    function tryTofoldStatement (statement, sourceMap) { // sweeter time.
      var max = statement.length - 1
      for (var i = 1; i < max; i++) {
        if (statement[i] === symbolPairing && statement[i + 1] === symbolPairing) {
          statement.splice(i, 2)
          sourceMap.splice(i + 1, 2)
          foldStatement(statement, sourceMap, i)
          return true
        }
      }
      return false
    }

    function foldStatement (statement, sourceMap, length) {
      // (x :: y) => ($(x) y)
      var expr = statement.splice(0, length)
      // re-arrange source map
      var exprSrcMap = sourceMap.splice(1, length + 1)
      var beginning = exprSrcMap[0].slice(0, 3)
      var ending = exprSrcMap[exprSrcMap.length - 1]
      exprSrcMap.unshift(beginning.concat(ending.slice(-2)))

      // (x ::) => ($(x) to-string)
      if (statement.length < 1) {
        statement.push(symbolToString)
        sourceMap.push(ending.slice(0, 1).concat(ending.slice(-2)))
      }

      exprSrcMap[0].unshift(srcUri || srcText)
      statement.unshift(symbolSubject, new Tuple$(expr, false, exprSrcMap))
      sourceMap.splice(1, 0,
        beginning.concat(beginning.slice(1)), exprSrcMap[0].slice(1)
      )
    }

    function endClause () {
      if (stack.length < 2) {
        warn('compiler', 'extra enclosing parentheses is found and ignored.',
          [lastToken, srcUri || srcText])
        return // allow & ignore extra enclosing parentheses
      }
      endTopWith()
    }

    function endMatched (value, source) {
      if (stack.length < 2) {
        warn('compiler', 'extra ")," is found and ignored.',
          [lastToken, ['symbol', value, source], srcUri || srcText])
        return // allow & ignore extra enclosing parentheses
      }
      lastToken[2][0] >= 0 // the indent value of ')'
        ? endIndent(value, source) : endLine(value, source)
    }

    function endLine (value, source) { // sugar time
      var depth = stack.length - 1
      while (depth > 0) {
        var startSource = sourceStack[depth][0][0] // start source.
        if (startSource[1] < source[1]) { // comparing line numbers.
          break
        }
        endTopWith(source)
        depth = stack.length - 1
      }
    }

    function crossingLines () {
      var depth = sourceStack.length - 1
      var srcOffset = openningOffset + 1
      var topSource = sourceStack[depth]
      return topSource.length > srcOffset &&
        openningLine > topSource[srcOffset][1]
    }

    function closeLine (value, source) { // sweeter time.
      var depth = stack.length - 1
      stack.push(stack[depth].splice(openningOffset))
      var src = sourceStack[depth].splice(openningOffset + 1)
      src.length > 0 ? src.unshift(src[0]) : src.push(source)
      sourceStack.push(src)
      endTopWith(source)
      openningOffset = stack[depth].length
    }

    function endIndent (value, source) { // sugar time
      var endingIndent = lastToken[2][0]
      var depth = stack.length - 1
      while (depth > 0) {
        var indent = sourceStack[depth][0][0][0]
        // try to looking for and stop with the first matched indent.
        if (indent >= 0 && indent <= endingIndent) {
          if (indent === endingIndent) {
            endTopWith(source)
          }
          break
        }
        endTopWith(source)
        depth = stack.length - 1
      }
    }

    function endAll (value, source) { // sugar time
      while (stack.length > 1) {
        endTopWith(source)
      }
    }
  })

  // a simple memory cache
  var cache = {
    code: Object.create(null),
    versions: Object.create(null),

    get: function (uri, version) {
      return !uri || typeof uri !== 'string' ? null
        : !version || typeof version !== 'string' ? this.code[uri]
          : this.versions[uri] === version ? this.code[uri] : null
    },
    set: function (code, uri, version) {
      if (uri && typeof uri === 'string') {
        this.code[uri] = code
        if (version && typeof version === 'string') {
          this.versions[uri] = version
        }
      }
      return code
    }
  }

  // a helper function to compile a piece of source code.
  $export($, 'compile', function (text, uri, version) {
    var code = cache.get(uri, version)
    if (code) {
      return code
    }

    var srcUri = makeSourceUri(uri || text, version)
    var list = []
    var src = [[[srcUri, 0, 0, 0]]]
    var compiling = compiler(function collector (expr) {
      list.push(expr[0])
      src.push(expr[1])
    }, srcUri)
    if (compiling(text) > 1) {
      compiling('\n') // end any pending waiter.
    }
    compiling() // notify the end of stream.
    code = new Tuple$(list, true, src)
    return cache.set(code, uri, version)
  })
}


/***/ }),

/***/ "./sugly/generic/array.js":
/*!********************************!*\
  !*** ./sugly/generic/array.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function offsetOf (length, index) {
  index >>= 0
  return index >= 0 ? index : index + length
}

function beginOf (length, from) {
  from = offsetOf(length, from)
  return from < 0 ? 0 : from
}

function endOf (length, to) {
  return typeof to === 'undefined' ? length : beginOf(length, to)
}

function isSimple (arr) {
  return arr.length <= 16 || !arr.isSparse
}

function checkSpacing (s, i, last) {
  switch (i - last) {
    case 1: return
    case 2: s.push('*'); return
    case 3: s.push('*', '*'); return
    case 4: s.push('*', '*', '*'); return
    default: s.push('...')
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.array
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall
  var iterateOf = $void.iterateOf
  var boolValueOf = $void.boolValueOf
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var EncodingContext$ = $void.EncodingContext
  var defineProperty = $void.defineProperty
  var defineTypeProperty = $void.defineTypeProperty

  // create an empty array.
  link(Type, 'empty', function () {
    return []
  }, true)

  // create an array of the arguments
  link(Type, 'of', function (x, y, z) {
    switch (arguments.length) {
      case 0: return []
      case 1: return [x]
      case 2: return [x, y]
      case 3: return [x, y, z]
      default: return Array.prototype.slice.call(arguments)
    }
  }, true)

  // create an array with items from iterable arguments, or the argument itself
  // if its value is not iterable.
  var ShortArray = 16
  var arrayFrom = link(Type, 'from', function () {
    var list = []
    var isSparse
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (Array.isArray(source)) {
        source <= ShortArray ? list.push.apply(list, source)
          : (list = list.concat(source))
        isSparse = isSparse || source.isSparse
      } else {
        var next = iterateOf(source)
        if (!next) {
          list.push(source)
        } else {
          var item = next()
          while (typeof item !== 'undefined' && item !== null) {
            list.push(Array.isArray(item) ? item.length > 0 ? item[0] : null : item)
            item = next()
          }
        }
      }
    }
    isSparse && asSparse.call(list)
    return list
  }, true)

  var proto = Type.proto
  // return the length of this array.
  link(proto, 'length', function () {
    return this.length
  })
  // check whether this array is a sparse one.
  link(proto, 'is-sparse', function () {
    return this.isSparse || false
  })
  link(proto, 'not-sparse', function () {
    return !this.isSparse
  })
  // mark this array as a sparse or common array.
  var asSparse = link(proto, 'as-sparse', function (flag) {
    defineProperty(this, 'isSparse',
      typeof flag === 'undefined' || boolValueOf(flag)
    )
    return this
  })
  // return the amount of elements.
  var count = function (filter) {
    var i = 0
    var counter = 0
    if (isApplicable(filter)) {
      for (; i < this.length; i++) {
        typeof this[i] !== 'undefined' &&
          boolValueOf(filter.call(this, this[i], i)) && counter++
      }
    } else {
      for (; i < this.length; i++) {
        typeof this[i] !== 'undefined' && counter++
      }
    }
    return counter
  }
  link(proto, ['count', 'for-each'], Array.prototype.forEach ? function (filter) {
    if (isSimple(this)) {
      return count.call(this, filter)
    }
    var counter = 0
    if (isApplicable(filter)) {
      this.forEach(function (v, i) {
        typeof v !== 'undefined' &&
          boolValueOf(filter.call(this, v, i)) && counter++
      })
    } else {
      this.forEach(function (v) {
        typeof v !== 'undefined' && counter++
      })
    }
    return counter
  } : count)

  // Mutability
  link(proto, 'seal', function () {
    return Object.freeze(this)
  })
  link(proto, 'is-sealed', function () {
    return Object.isFrozen(this)
  })

  var stopSignal = new Error('tracing.stopped')
  // call a handler for each element until it returns a truthy value.
  var each = function (tracer) {
    var value
    if (isApplicable(tracer)) {
      for (var i = 0; i < this.length; i++) {
        value = this[i]
        if (typeof value !== 'undefined' &&
          boolValueOf(tracer.call(this, value, i))) break
      }
    }
    return this
  }
  var trace = link(proto, 'trace', Array.prototype.forEach ? function (tracer) {
    if (isSimple(this)) {
      return each.call(this, tracer)
    }
    if (isApplicable(tracer)) {
      try {
        this.forEach(function (v, i, s) {
          if (typeof v !== 'undefined' && boolValueOf(tracer.call(s, v, i))) {
            throw stopSignal
          }
        }, this)
      } catch (err) {
        if (err !== stopSignal) throw err
      }
    }
    return this
  } : each)

  // like trace, but to traverse all element from the end.
  var eachRight = function (tracer) {
    var value
    if (isApplicable(tracer)) {
      for (var i = this.length - 1; i >= 0; i--) {
        value = this[i]
        if (typeof value !== 'undefined' &&
          boolValueOf(tracer.call(this, value, i))) break
      }
    }
    return this
  }
  var retrace = link(proto, 'retrace', Array.prototype.reduceRight ? function (tracer) {
    if (isSimple(this)) {
      return eachRight.call(this, tracer)
    }
    if (isApplicable(tracer)) {
      try {
        this.reduceRight(function (_, v, i, s) {
          if (typeof v !== 'undefined' && boolValueOf(tracer.call(s, v, i))) {
            throw stopSignal
          }
        }, this)
      } catch (err) {
        if (err !== stopSignal) throw err
      }
    }
    return this
  } : eachRight)

  // generate an iterator function to traverse all array items.
  var iterate = function (list, begin, end) {
    var current
    return function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      while (begin < end && typeof list[begin] === 'undefined') {
        begin++
      }
      return begin >= end ? null : (current = [list[begin], begin++])
    }
  }
  link(proto, 'iterate', function (begin, end) {
    begin = beginOf(this.length, begin)
    end = endOf(this.length, end)
    if (isSimple(this)) {
      return iterate(this, begin, end)
    }
    var list = this
    var indices = []
    trace.call(this, function (_, i) {
      return i >= end || (
        (i >= begin && indices.push(i)) && false
      )
    })
    var current
    begin = 0; end = indices.length
    return function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      if (begin >= end) {
        return null
      }
      var index = indices[begin++]
      return (current = [list[index], index])
    }
  })

  // to create a shallow copy of this instance with all items,
  // or selected items in a range.
  link(proto, 'copy', function (begin, count) {
    begin = beginOf(this.length, begin)
    count = typeof count === 'undefined' ? this.length : count >> 0
    if (count < 0) {
      count = 0
    }
    var list = this.slice(begin, begin + count)
    return this.isSparse ? asSparse.call(list) : list
  })
  link(proto, 'slice', function (begin, end) {
    var list = this.slice(beginOf(this.length, begin), endOf(this.length, end))
    return this.isSparse ? asSparse.call(list) : list
  })

  // create a new array with items in this array and argument values.
  link(proto, 'concat', function () {
    var list = this.concat(Array.prototype.slice.call(arguments))
    return this.isSparse ? asSparse.call(list) : list
  })

  // append more items to the end of this array
  var appendFrom = link(proto, ['append', '+='], function () {
    var isSparse
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i]
      src = Array.isArray(src) ? src : arrayFrom(src)
      this.push.apply(this, src)
      isSparse = isSparse || src.isSparse
    }
    return isSparse && !this.isSparse ? asSparse.call(this) : this
  })

  // create a new array with items in this array and argument arrays.
  link(proto, ['merge', '+'], function () {
    var copy = this.slice()
    this.isSparse && asSparse.call(copy)
    return appendFrom.apply(copy, arguments)
  })

  // getter by index
  var getter = link(proto, 'get', function (index) {
    index = offsetOf(this.length, index)
    return index >= 0 ? this[index] : null
  })
  // setter by index
  var setter = link(proto, 'set', function (index, value) {
    index = offsetOf(this.length, index);
    ((index > 16) && (index + 1) >= (this.length / 2 * 3)) &&
      !this.isSparse && asSparse.call(this, true)
    return index < 0 ? null
      : (this[index] = typeof value === 'undefined' ? null : value)
  })
  // reset one or more entries by indices
  link(proto, 'reset', function (index) {
    var length = this.length
    for (var i = 0; i < arguments.length; i++) {
      index = offsetOf(length, arguments[i]);
      (index >= 0) && (delete this[index])
    }
    return this
  })

  // remove all entries or some values from this array.
  var clear = function (value) {
    var argc = arguments.length
    if (argc < 1) {
      this.splice(0)
    } else {
      for (var i = this.length - 1; i >= 0; i--) {
        for (var j = 0; j < argc; j++) {
          value = this[i]
          if (typeof value !== 'undefined' &&
            thisCall(this[i], 'equals', arguments[j])) {
            this.splice(i, 1); break
          }
        }
      }
    }
    return this
  }
  link(proto, 'clear', function (value) {
    var argc = arguments.length
    if (argc < 1) {
      this.splice(0)
      return this
    }
    if (isSimple(this)) {
      return clear.apply(this, arguments)
    }
    var args = Array.prototype.slice.call(arguments)
    retrace.call(this, function (v, i) {
      for (var j = 0; j < argc; j++) {
        if (thisCall(v, 'equals', args[j])) {
          this.splice(i, 1); return
        }
      }
    })
    return this
  })
  // remove one or more values to create a new array.
  var remove = function (value) {
    var argc = arguments.length
    var result = this.isSparse ? asSparse.call([]) : []
    for (var i = 0, offset = 0; i < this.length; i++) {
      value = this[i]
      if (typeof value === 'undefined') {
        offset++; continue
      }
      var keep = true
      for (var j = 0; j < argc; j++) {
        if (thisCall(value, 'equals', arguments[j])) {
          keep = false; break
        }
      }
      keep && (result[offset++] = value)
    }
    return result
  }
  link(proto, 'remove', function (value) {
    var argc = arguments.length
    if (argc < 1) {
      return this.isSparse ? asSparse.call(this.slice()) : this.slice()
    }
    if (isSimple(this)) {
      return remove.apply(this, arguments)
    }
    var args = Array.prototype.slice.call(arguments)
    var result = this.isSparse ? asSparse.call([]) : []
    var removed = 0
    trace.call(this, function (v, i) {
      var keep = true
      for (var j = 0; j < argc; j++) {
        if (thisCall(v, 'equals', args[j])) {
          keep = false; break
        }
      }
      keep ? (result[i - removed] = v) : removed++
    })
    return result
  })

  // replace all occurances of a value to another value or reset them.
  var replace = function (value, newValue) {
    var i, current
    if (typeof newValue === 'undefined') {
      for (i = this.length - 1; i >= 0; i--) {
        current = this[i]
        if (typeof current !== 'undefined' &&
          thisCall(current, 'equals', value)) {
          delete this[i]
        }
      }
    } else {
      for (i = 0; i < this.length; i++) {
        current = this[i]
        if (typeof current !== 'undefined' &&
          thisCall(current, 'equals', value)) {
          this[i] = newValue
        }
      }
    }
    return this
  }
  link(proto, 'replace', function (value, newValue) {
    if (typeof value === 'undefined') {
      return this
    }
    if (isSimple(this)) {
      return replace.call(this, value, newValue)
    }
    typeof newValue === 'undefined' ? retrace.call(this, function (v, i) {
      thisCall(v, 'equals', value) && delete this[i]
    }) : trace.call(this, function (v, i) {
      thisCall(v, 'equals', value) && (this[i] = newValue)
    })
    return this
  })

  // check the existence of an elememt by a filter function
  link(proto, 'has', function (filter) {
    if (!isApplicable(filter)) { // as an index number
      return typeof this[offsetOf(this.length, filter)] !== 'undefined'
    }
    var found = false
    trace.call(this, function (v, i) {
      return (found = boolValueOf(filter.call(this, v, i)))
    })
    return found
  })
  // check the existence of a value
  var contains = function (value) {
    var current
    for (var i = 0; i < this.length; i++) {
      current = this[i]
      if (typeof current !== 'undefined' &&
        thisCall(current, 'equals', value)) {
        return true
      }
    }
    return false
  }
  link(proto, 'contains', function (value) {
    if (typeof value === 'undefined') {
      return false
    }
    if (isSimple(this)) {
      return contains.call(this, value)
    }
    var found = false
    trace.call(this, function (v, i) {
      return (found = thisCall(v, 'equals', value))
    })
    return found
  })

  // sawp two value by offsets.
  link(proto, 'swap', function (i, j) {
    var length = this.length
    i = offsetOf(length, i)
    j = offsetOf(length, j)
    if (i === j || i < 0 || i >= length || j < 0 || j >= length) {
      return false
    }
    var tmp = this[i]
    typeof this[j] === 'undefined' ? delete this[i] : this[i] = this[j]
    typeof tmp === 'undefined' ? delete this[j] : this[j] = tmp
    return true
  })

  // retrieve the first n element(s).
  link(proto, 'first', function (count, filter) {
    if (typeof count === 'undefined') {
      return this[0]
    }
    if (isApplicable(count)) {
      var found
      trace.call(this, function (v, i) {
        return boolValueOf(count.call(this, v, i)) ? (found = v) || true : false
      })
      return found
    }
    count >>= 0
    if (count <= 0) {
      return []
    }
    var result = []
    if (isApplicable(filter)) {
      trace.call(this, function (v, i) {
        if (boolValueOf(filter.call(this, v, i))) {
          result.push(v)
          return (--count) <= 0
        } // else return false
      })
    } else {
      trace.call(this, function (v) {
        result.push(v)
        return (--count) <= 0
      })
    }
    return result
  })
  // find the index of first occurance of a value.
  var firstOf = function (value) {
    for (var i = 0; i < this.length; i++) {
      var v = this[i]
      if (typeof v !== 'undefined' && (
        v === value || thisCall(v, 'equals', value)
      )) {
        return i
      }
    }
    return null
  }
  var indexOf = link(proto, 'first-of', function (value) {
    if (typeof value === 'undefined') {
      return null
    }
    if (isSimple(this)) {
      return firstOf.call(this, value)
    }
    var found = null
    trace.call(this, function (v, i) {
      return v === value || thisCall(v, 'equals', value)
        ? (found = i) || true : false
    })
    return found
  })
  // retrieve the last n element(s).
  link(proto, 'last', function (count, filter) {
    if (typeof count === 'undefined') {
      return this[this.length - 1]
    }
    if (isApplicable(count)) {
      var found
      retrace.call(this, function (v, i) {
        return boolValueOf(count.call(this, v, i)) ? (found = v) || true : false
      })
      return found
    }
    count >>= 0
    if (count <= 0) {
      return []
    }
    var result = []
    if (isApplicable(filter)) {
      retrace.call(this, function (v, i) {
        if (!boolValueOf(filter.call(this, v, i))) return
        result.unshift(v); count--
        return count <= 0
      })
    } else {
      retrace.call(this, function (v) {
        result.unshift(v); count--
        return count <= 0
      })
    }
    return result
  })
  // find the index of the last occurance of a value.
  var lastOf = function (value) {
    for (var i = this.length - 1; i >= 0; i--) {
      var v = this[i]
      if (typeof v !== 'undefined' && (
        v === value || thisCall(v, 'equals', value)
      )) {
        return i
      }
    }
    return null
  }
  link(proto, 'last-of', function (value) {
    if (typeof value === 'undefined') {
      return null
    }
    if (isSimple(this)) {
      return lastOf.call(this, value)
    }
    var found = null
    retrace.call(this, function (v, i) {
      return v === value || thisCall(v, 'equals', value)
        ? (found = i) || true : false
    })
    return found
  })

  // edit current array
  link(proto, 'insert', function (index, item) {
    index = beginOf(this.length, index)
    if (arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2)
      args.unshift(index, 0, item)
      this.splice.apply(this, args)
    } else {
      this.splice(index, 0, item)
    }
    return this
  })
  link(proto, 'delete', function (index, count) {
    index = offsetOf(this.length, index)
    count = typeof count === 'undefined' ? 1 : count >> 0
    index >= 0 && this.splice(index, count)
    return this
  })
  link(proto, 'splice', function (index, count) {
    if ((index >>= 0) < -this.length) {
      if (arguments.length < 3) {
        return []
      }
      var args = Array.prototype.slice.call(arguments)
      args[0] = 0; args[1] = 0
      return this.splice.apply(this, args)
    }
    switch (arguments.length) {
      case 0:
        return this.splice()
      case 1:
        return this.splice(index)
      case 2:
        return this.splice(index, count)
      default:
        return this.splice.apply(this, arguments)
    }
  })

  // stack operations.
  link(proto, 'push', function () {
    Array.prototype.push.apply(this, arguments)
    return this
  })
  link(proto, 'pop', function (count) {
    return typeof count === 'undefined' ? this.pop()
      : (count >>= 0) >= this.length ? this.splice(0)
        : count > 0 ? this.splice(this.length - count)
          : this.splice(-1)
  })

  // queue operations.
  link(proto, 'enqueue', function () {
    this.unshift.apply(this, arguments)
    return this
  })
  proto.dequeue = proto.pop

  // reverse the order of all elements
  link(proto, 'reverse', function () {
    return this.reverse()
  })

  // re-arrange elements in an array.
  var comparerOf = function (reversing, comparer) {
    return reversing ? function (a, b) {
      var order = comparer(a, b)
      return order > 0 ? -1 : order < 0 ? 1 : 0
    } : function (a, b) {
      var order = comparer(a, b)
      return order > 0 ? 1 : order < 0 ? -1 : 0
    }
  }
  var ascComparer = function (a, b) {
    var order = thisCall(a, 'compare', b)
    return order > 0 ? 1 : order < 0 ? -1 : 0
  }
  var descComparer = function (a, b) {
    var order = thisCall(a, 'compare', b)
    return order > 0 ? -1 : order < 0 ? 1 : 0
  }
  link(proto, 'sort', function (order, comparer) {
    var reversing = false
    if (typeof order === 'function') {
      comparer = order
    } else if ((order >> 0) > 0) {
      reversing = true
    }
    var comparing = typeof comparer === 'function'
      ? comparerOf(reversing, comparer)
      : reversing ? descComparer : ascComparer
    return this.sort(comparing)
  })

  // collection operations
  link(proto, 'find', function (filter) {
    var result = []
    if (isApplicable(filter)) {
      trace.call(this, function (v, i) {
        boolValueOf(filter.call(this, v, i)) && result.push(i)
      })
    } else { // pick all valid indices.
      trace.call(this, function (v, i) { result.push(i) })
    }
    return result
  })
  link(proto, 'select', Array.prototype.filter ? function (filter) {
    return isApplicable(filter) ? this.filter(function (v, i) {
      return typeof v !== 'undefined' && boolValueOf(filter.call(this, v, i))
    }, this) : this.filter(function (v) {
      return typeof v !== 'undefined' // pick all valid indices.
    }, this)
  } : function (filter) {
    var result = []
    if (isApplicable(filter)) {
      trace.call(this, function (v, i) {
        boolValueOf(filter.call(this, v, i)) && result.push(v)
      })
    } else { // pick all valid indices.
      trace.call(this, function (v) { result.push(v) })
    }
    return result
  })
  link(proto, 'map', Array.prototype.map ? function (converter) {
    var result = isApplicable(converter)
      ? this.map(function (v, i) {
        if (typeof v !== 'undefined') {
          return converter.call(this, v, i)
        }
      }, this) : this.slice()
    this.isSparse && asSparse.call(result)
    return result
  } : function (converter) {
    var result = this.slice()
    this.isSparse && asSparse.call(result)
    if (isApplicable(converter)) {
      trace.call(this, function (v, i) {
        var value = converter.call(this, v, i)
        result[i] = typeof value === 'undefined' ? null : value
      })
    }
    return result
  })
  link(proto, 'reduce', Array.prototype.reduce ? function (value, reducer) {
    if (!isApplicable(reducer)) {
      if (!isApplicable(value)) {
        return value
      }
      reducer = value
      value = null
    }
    return this.reduce(function (s, v, i, t) {
      return typeof v !== 'undefined' ? reducer.call(t, s, v, i) : s
    }, value)
  } : function (value, reducer) {
    if (!isApplicable(reducer)) {
      if (!isApplicable(value)) {
        return value
      }
      reducer = value
      value = null
    }
    trace.call(this, function (v, i) {
      value = reducer.call(this, value, v, i)
    })
    return value
  })

  link(proto, 'join', Array.prototype.reduce ? function (separator) {
    var last = -1
    var strings = this.reduce(function (s, v, i, t) {
      if (typeof v !== 'undefined') {
        checkSpacing(s, i, last)
        s.push(typeof v === 'string' ? v : thisCall(v, 'to-string'))
        last = i
      }
      return s
    }, [])
    checkSpacing(strings, this.length, last)
    return strings.join(typeof separator === 'string' ? separator : ' ')
  } : function (separator) {
    var last = -1
    var s = []
    trace.call(this, function (v, i) {
      checkSpacing(s, i, last)
      s.push(typeof v === 'string' ? v : thisCall(v, 'to-string'))
      last = i
    })
    checkSpacing(s, this.length, last)
    return s.join(typeof separator === 'string' ? separator : ' ')
  })

  // determine emptiness by array's length
  link(proto, 'is-empty', function () {
    return !(this.length > 0)
  })
  link(proto, 'not-empty', function () {
    return this.length > 0
  })

  // default object persistency & describing logic
  var toCode = link(proto, 'to-code', function (ctx) {
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) { return sym }
    } else {
      ctx = new EncodingContext$(this)
    }
    var code = [$Symbol.literal]
    var last = -1
    trace.call(this, function (v, i) {
      v = ctx.encode(v);
      (i - last) > 1 ? code.push(i, $Symbol.pairing, v) : code.push(v)
      last = i
    })
    return ctx.end(this, Type, new Tuple$(code))
  })

  // Description
  link(proto, 'to-string', function () {
    return thisCall(toCode.call(this), 'to-string')
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'number'
      ? typeof value === 'undefined' ? getter.call(this, index)
        : setter.call(this, index, value)
      : typeof index === 'string' ? protoValueOf(this, proto, index)
        : index instanceof Symbol$ ? protoValueOf(this, proto, index.key)
          : indexOf.call(this, index)
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  defineTypeProperty(Array.prototype, Type)
}


/***/ }),

/***/ "./sugly/generic/bool.js":
/*!*******************************!*\
  !*** ./sugly/generic/bool.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Type = $.bool
  var link = $void.link
  var Symbol$ = $void.Symbol
  var protoValueOf = $void.protoValueOf
  var defineTypeProperty = $void.defineTypeProperty

  // the empty value of bool is the false.
  link(Type, 'empty', false)

  // booleanize
  $void.boolValueOf = link(Type, 'of', function (value) {
    return value !== null && value !== 0 && value !== false && typeof value !== 'undefined'
  }, true)

  var proto = Type.proto
  // Emptiness
  link(proto, 'is-empty', function () {
    return this === false
  })
  link(proto, 'not-empty', function () {
    return this !== false
  })

  // Representation
  link(proto, 'to-string', function () {
    return this === true ? 'true' : 'false'
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  defineTypeProperty(Boolean.prototype, Type)
}


/***/ }),

/***/ "./sugly/generic/class.js":
/*!********************************!*\
  !*** ./sugly/generic/class.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Type = $.class
  var $Type = $.type
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var $Object = $.object
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var ClassType$ = $void.ClassType
  var ClassInst$ = $void.ClassInst
  var link = $void.link
  var bindThis = $void.bindThis
  var isObject = $void.isObject
  var thisCall = $void.thisCall
  var boolValueOf = $void.boolValueOf
  var createClass = $void.createClass
  var isApplicable = $void.isApplicable
  var ownsProperty = $void.ownsProperty
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf
  var EncodingContext$ = $void.EncodingContext

  // initialize the meta class.
  link(Type, 'empty', createClass, true)

  // define a class by classes and/or class descriptors.
  link(Type, 'of', function () {
    return as.apply(createClass(), arguments)
  }, true)

  // copy fields from source objects to the target class instance or an object.
  var objectAssign = $Object.assign
  link(Type, 'attach', function (target) {
    if (target instanceof ClassInst$) {
      for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i]
        if (isObject(src)) {
          Object.assign(target, src)
          activate.call(target, src)
        }
      }
      return target
    }
    // fallback to object assign for the class may not exist on target context.
    return objectAssign.apply($Object, arguments)
  }, true)

  // the prototype of classes
  var proto = Type.proto

  // generate an empty instance.
  link(proto, 'empty', function () {
    return Object.create(this.proto)
  })

  // generate an instance without arguments.
  link(proto, 'default', function () {
    return construct.call(Object.create(this.proto))
  })

  // static construction: create an instance by arguments.
  link(proto, 'of', function () {
    return construct.apply(Object.create(this.proto), arguments)
  })

  // static activation: restore an instance by one or more property set.
  link(proto, 'from', function () {
    var inst = Object.create(this.proto)
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i]
      if (isObject(src)) {
        Object.assign(inst, src)
        activate.call(inst, src)
      }
    }
    return inst
  })

  // make this class to act as other classes and/or class descriptors.
  var isAtom = $Tuple.accepts
  var as = link(proto, 'as', function () {
    if (Object.isFrozen(this)) {
      return this
    }
    var type_ = Object.create(null)
    var proto_ = Object.create(null)
    var args = Array.prototype.slice.call(arguments)
    for (var i = 0; i < args.length; i++) {
      var src = args[i]
      var t, p
      if (src instanceof ClassType$) {
        t = src
        p = src.proto
      } else if (isObject(src)) {
        p = src
        if (isObject(src.type)) {
          t = src.type
        } else {
          if (src.type instanceof ClassType$) {
            args.splice(i + 1, 0, src.type)
          }
          t = {}
        }
      } else {
        t = {}; p = {}
      }
      var j, key
      var names = Object.getOwnPropertyNames(t)
      for (j = 0; j < names.length; j++) {
        key = names[j]
        if (key === 'indexer') {
          // allow customized indexer for class
          !ownsProperty(proto_, ':') && isApplicable(t.indexer) && (
            proto_[':'] = t.indexer
          )
        } else if ((typeof this[key] === 'undefined') &&
          !ownsProperty(type_, key)
        ) {
          if (key !== 'name' || !(t instanceof ClassType$)) {
            // not to copy a type's name, but copy a definition name field
            type_[key] = t[key]
          }
        }
      }
      names = Object.getOwnPropertyNames(p)
      var value
      for (j = 0; j < names.length; j++) {
        key = names[j]
        if (key !== 'type' && !ownsProperty(this.proto, key) && !ownsProperty(proto_, key)) {
          value = p[key]
          proto_[key] = isAtom(value) || (typeof value === 'function') ? value : null
        }
      }
    }
    Object.assign(this, type_)
    Object.assign(this.proto, proto_)
    return this
  })

  // Convert this class's definition to a type descriptor object.
  var toObject = link(proto, 'to-object', function () {
    var typeDef = $Object.empty()
    var names = Object.getOwnPropertyNames(this.proto)
    var i, name, value, thisEmpty
    for (i = 0; i < names.length; i++) {
      name = names[i]
      if (name !== 'type') {
        value = this.proto[name]
        typeDef[name] = !isApplicable(value) ? value
          : thisCall(value, 'bind', typeof thisEmpty !== 'undefined'
            ? thisEmpty : (thisEmpty = this.empty())
          )
      }
    }
    var typeStatic = $Object.empty()
    var hasStatic = false
    names = Object.getOwnPropertyNames(this)
    for (i = 0; i < names.length; i++) {
      name = names[i]
      if (name !== 'proto') {
        value = this[name]
        typeStatic[name] = !isApplicable(value) ? value
          : thisCall(value, 'bind', this)
        hasStatic = true
      }
    }
    hasStatic && (typeDef.type = typeStatic)
    return typeDef
  })

  // Mutability
  link(proto, 'seal', function () {
    return Object.freeze(this)
  })
  link(proto, 'is-sealed', function () {
    return Object.isFrozen(this)
  })

  // Type Verification: a class is a class and a type.
  link(proto, 'is-a', function (type) {
    return type === Type || type === $Type
  })
  link(proto, 'is-not-a', function (type) {
    return type !== Type && type !== $Type
  })

  // Emptiness: shared by all classes.
  link(proto, 'is-empty', function () {
    return !(Object.getOwnPropertyNames(this.proto).length > 1) && !(
      Object.getOwnPropertyNames(this).length > (
        ownsProperty(this, 'name') ? 2 : 1
      )
    )
  })
  link(proto, 'not-empty', function () {
    return Object.getOwnPropertyNames(this.proto).length > 1 || (
      Object.getOwnPropertyNames(this).length > (
        ownsProperty(this, 'name') ? 2 : 1
      )
    )
  })

  // Encoding
  var protoToCode = link(proto, 'to-code', function () {
    return typeof this.name === 'string' && this.name
      ? sharedSymbolOf(this.name.trim()) : $Symbol.empty
  })

  // Description
  var symbolClass = sharedSymbolOf('class')
  var symbolOf = sharedSymbolOf('of')
  var objectToCode = $Object.proto['to-code']
  var tupleToString = $Tuple.proto['to-string']
  link(proto, 'to-string', function () {
    var code = protoToCode.call(this)
    if (code !== $Symbol.empty) {
      return thisCall(code, 'to-string')
    }
    code = objectToCode.call(toObject.call(this))
    if (code.$[0] === $Symbol.literal) {
      code.$[1] === $Symbol.pairing ? code.$.splice(2, 0, symbolClass)
        : code.$.splice(1, 0, $Symbol.pairing, symbolClass)
    } else {
      code = new Tuple$([symbolClass, symbolOf, code])
    }
    return tupleToString.call(code)
  })

  // the prototype of class instances
  var instance = proto.proto

  // root instance constructor
  var construct = link(instance, 'constructor', function () {
    if (this.constructor !== construct) {
      this.constructor.apply(this, arguments)
    } else { // behave like (object assign this ...)
      var args = [this]
      args.push.apply(args, arguments)
      $Object.assign.apply($Object, args)
    }
    return this
  })

  // root instance activator: accept a plain object and apply the activator logic too.
  var activate = link(instance, 'activator', function (source) {
    if (this.activator !== activate) {
      this.activator(source)
    }
    return this
  })

  // Generate a persona to act like another class.
  link(instance, 'as', function (cls, member) {
    if (!(cls instanceof ClassType$)) {
      return null
    }
    if (member instanceof Symbol$) {
      member = member.key
    } else if (typeof member !== 'string' || !member) {
      member = null
    }

    var value
    if (member) {
      value = cls.proto[member]
      return isApplicable(value) ? bindThis(this, value) : value
    }

    var names = Object.getOwnPropertyNames(cls.proto)
    var persona = Object.create($Object.proto)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      value = cls.proto[name]
      persona[name] = isApplicable(value) ? bindThis(this, value) : value
    }
    return persona
  })

  // Enable the customization of Identity.
  var is = link(instance, ['is', '==='], function (another) {
    return (this === another) || (
      this.is !== is && isApplicable(this.is) && boolValueOf(this.is(another))
    )
  })
  link(instance, ['is-not', '!=='], function (another) {
    return !is.call(this, another)
  })

  // Enable the customization of Equivalence.
  var equals = link(instance, ['equals', '=='], function (another) {
    return this === another || is.call(this, another) || (
      this.equals !== equals && isApplicable(this.equals) &&
        boolValueOf(this.equals(another))
    )
  })
  link(instance, ['not-equals', '!='], function (another) {
    return !equals.call(this, another)
  })

  // Enable the customizaztion of Ordering.
  var compare = link(instance, 'compare', function (another) {
    var ordering
    return this === another || equals.call(this, another) ? 0
      : this.compare === compare || !isApplicable(this.compare) ? null
        : (ordering = this.compare(another)) > 0 ? 1
          : ordering < 0 ? -1
            : ordering === 0 ? 0 : null
  })

  // Emptiness: allow customization.
  var isEmpty = link(instance, 'is-empty', function () {
    var overriding = this['is-empty']
    return overriding !== isEmpty && isApplicable(overriding)
      ? boolValueOf(overriding.call(this))
      : Object.getOwnPropertyNames(this).length < 1
  })
  link(instance, 'not-empty', function () {
    return !isEmpty.call(this)
  })

  // Type Verification
  var isA = link(instance, 'is-a', function (t) {
    if (t === $Object || t === this.type) {
      return true
    }
    var overriding = this['is-a']
    if (overriding !== isA && isApplicable(overriding)) {
      return boolValueOf(overriding.call(this, t))
    }
    if (!(t instanceof ClassType$) || !t.proto) {
      return false
    }
    var members = Object.getOwnPropertyNames(t.proto)
    for (var i = 0; i < members.length; i++) {
      if (typeof this[members[i]] === 'undefined') {
        return false
      }
    }
    return true
  })
  link(instance, 'is-not-a', function (t) {
    return !isA.call(this, t)
  })

  // Enable the customization of Encoding.
  var toCode = link(instance, 'to-code', function (ctx) {
    var overriding = this['to-code']
    if (overriding === toCode || typeof overriding !== 'function') {
      return objectToCode.call(this, ctx) // not overridden
    }
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) { return sym }
    } else {
      ctx = new EncodingContext$(this)
    }
    var code = overriding.call(this)
    return $Type.of(code) === $Object
      ? ctx.end(this, this.type, objectToCode.call(code))
      : code instanceof Tuple$ && code.plain !== true
        ? ctx.end(this, $Object, code) // app handle its type information.
        : ctx.end(this, this.type, objectToCode.call(this))
  })

  // Enable the customization of Description.
  var toString = link(instance, 'to-string', function () {
    var overriding = this['to-string']
    return overriding === toString || typeof overriding !== 'function'
      ? thisCall(toCode.call(this), 'to-string')
      : overriding.apply(this, arguments)
  })

  var typeOf = $.type.of
  var indexer = link(instance, ':', function (index, value) {
    var overriding
    if (typeof index === 'string') {
      overriding = indexer
    } else if (index instanceof Symbol$) {
      index = index.key
      overriding = indexer
    } else {
      overriding = this[':']
    }
    // setter
    if (typeof value !== 'undefined') {
      return typeof index === 'string' ? (this[index] = value)
        : overriding === indexer ? null
          : overriding.apply(this, arguments)
    }
    // getting
    if (typeof index !== 'string') {
      return overriding === indexer ? null : overriding.call(this, index)
    }
    value = protoValueOf(this, typeOf(this).proto || instance, index)
    return typeof value === 'function' ? value : this[index]
  })
  indexer.get = function (key) {
    var value = instance[key]
    return typeof value === 'function' ? value : this[key]
  }

  // export type indexer.
  link(proto, 'indexer', indexer)
}


/***/ }),

/***/ "./sugly/generic/date.js":
/*!*******************************!*\
  !*** ./sugly/generic/date.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

function getTimezoneName () {
  var format, options
  return (
    (format = Intl && Intl.DateTimeFormat && Intl.DateTimeFormat()) &&
    (options = format && format.resolveOptions && format.resolveOptions()) &&
    options.timeZone
  ) || (
    process && process.env.TZ
  ) || UtcTimezoneOffset()
}

function UtcTimezoneOffset () {
  var offset = (new Date()).getTimezoneOffset() / 60
  return offset >= 0 ? 'UTC+' + offset.toString() : 'UTC' + offset.toString()
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.date
  var $Object = $.object
  var link = $void.link
  var Symbol$ = $void.Symbol
  var protoValueOf = $void.protoValueOf
  var numberCompare = $.number.proto.compare
  var numberToString = $.number.proto['to-string']
  var defineTypeProperty = $void.defineTypeProperty

  // the empty value
  var empty = link(Type, 'empty', new Date(0))

  // the invalid value.
  var invalid = link(Type, 'invalid', new Date(NaN))

  // parse a date/time string representation to a date object.
  link(Type, 'parse', function (str) {
    return typeof str !== 'string' ? invalid : new Date(str)
  }, true)

  // get current time or the time as a string, a timestamp or data fields.
  link(Type, 'of', function (a, b, c, d, e, f, g) {
    switch (arguments.length) {
      case 0:
        return empty
      case 1: // string or timestamp
        return a instanceof Date ? a : new Date(a)
      case 2:
        return new Date(a, b - 1)
      case 3:
        return new Date(a, b - 1, c)
      case 4:
        return new Date(a, b - 1, c, d)
      case 5:
        return new Date(a, b - 1, c, d, e)
      case 6:
        return new Date(a, b - 1, c, d, e, f)
      default: // field values
        return new Date(a, b - 1, c, d, e, f, g)
    }
  }, true)

  // compose a date object with utc values of its fields
  link(Type, 'of-utc', function (a, b, c, d, e, f, g) {
    switch (arguments.length) {
      case 0:
        return empty
      case 1: // string or timestamp
        return new Date(Date.UTC(a, 0))
      case 2:
        return new Date(Date.UTC(a, b - 1))
      case 3:
        return new Date(Date.UTC(a, b - 1, c))
      case 4:
        return new Date(Date.UTC(a, b - 1, c, d))
      case 5:
        return new Date(Date.UTC(a, b - 1, c, d, e))
      case 6:
        return new Date(Date.UTC(a, b - 1, c, d, e, f))
      default: // field values
        return new Date(Date.UTC(a, b - 1, c, d, e, f, g))
    }
  }, true)

  // get current time as a date object.
  link(Type, 'now', function () {
    return new Date()
  }, true)

  // get current time as its timestamp value.
  link(Type, 'timestamp', function () {
    return Date.now()
  }, true)

  link(Type, 'timezone', function () {
    return $Object.of({
      name: getTimezoneName(),
      offset: (new Date()).getTimezoneOffset()
    })
  }, true)

  var proto = Type.proto

  // test if this is a valid date.
  link(proto, 'is-valid', function () {
    return !isNaN(this.getTime())
  })
  link(proto, 'is-invalid', function () {
    return isNaN(this.getTime())
  })

  // retrieve the date fields: year, month, day
  link(proto, 'date-fields', function (utc) {
    return isNaN(this.getTime()) ? null : utc
      ? [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate()]
      : [this.getFullYear(), this.getMonth() + 1, this.getDate()]
  })
  // retrieve the time fields: hours, minutes, seconds, milliseconds
  link(proto, 'time-fields', function (utc) {
    return isNaN(this.getTime()) ? null : utc
      ? [this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()]
      : [this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]
  })
  // retrieve all fields: year, month, day, hours, minutes, seconds, milliseconds
  link(proto, 'all-fields', function (utc) {
    return isNaN(this.getTime()) ? null : utc
      ? [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(),
        this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()]
      : [this.getFullYear(), this.getMonth() + 1, this.getDate(),
        this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]
  })
  // get the week day value, which starts from 0 for Sunday.
  link(proto, 'week-day', function (utc) {
    return isNaN(this.getTime()) ? null
      : utc ? this.getUTCDay() : this.getDay()
  })

  link(proto, 'timestamp', function (utc) {
    return this.getTime()
  })

  // support & override general operators
  link(proto, '+', function (milliseconds) {
    return typeof milliseconds === 'number'
      ? new Date(this.getTime() + milliseconds)
      : this
  })
  link(proto, '-', function (dateOrTime) {
    return typeof dateOrTime === 'number'
      ? new Date(this.getTime() - dateOrTime)
      : dateOrTime instanceof Date
        ? this.getTime() - dateOrTime.getTime()
        : this
  })

  // Ordering: date comparison
  var compare = link(proto, 'compare', function (another) {
    return another instanceof Date
      ? numberCompare.call(this.getTime(), another.getTime())
      : null
  })

  // override Identity and Equivalence logic to test by timestamp value
  link(proto, ['is', '===', 'equals', '=='], function (another) {
    return this === another || compare.call(this, another) === 0
  })
  link(proto, ['is-not', '!==', 'not-equals', '!='], function (another) {
    return this !== another && compare.call(this, another) !== 0
  })

  // ordering operators for instance values
  link(proto, '>', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order > 0 : null
  })
  link(proto, '>=', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order >= 0 : null
  })
  link(proto, '<', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order < 0 : null
  })
  link(proto, '<=', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order <= 0 : null
  })

  // emptiness is defined to the 0 value of timestamp.
  link(proto, 'is-empty', function () {
    var ts = this.getTime()
    return ts === 0 || isNaN(ts)
  })
  link(proto, 'not-empty', function () {
    var ts = this.getTime()
    return ts !== 0 && !isNaN(ts)
  })

  // Representation for instance & description for proto itself.
  link(proto, 'to-string', function (format) {
    if (typeof format === 'undefined') {
      // encoding as source code by default.
      var ts = this.getTime()
      return isNaN(ts) ? '(date invalid)'
        : ts === 0 ? '(date empty)'
          : '(date of ' + numberToString.call(this.getTime()) + ')'
    }
    switch (format) {
      case 'utc':
        return this.toUTCString()
      case 'date':
        return this.toLocaleDateString()
      case 'time':
        return this.toLocaleTimeString()
      default:
        return this.toLocaleString()
    }
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  defineTypeProperty(Date.prototype, Type)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./sugly/generic/encoding.js":
/*!***********************************!*\
  !*** ./sugly/generic/encoding.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// for any object, the object.proto.to-code will always be called firstly,
// in the default to-code, the object.to-code will be called.
// the same for the constructor: to ensure the instance will always be returned.
// for object:
//  - anything defined in type cannot be overridden in instance
//  - object.proto.* will allow the overridden and ensure the consistency and type safe.

// ployfill Map & Array.prototype.indexOf
var createIndex = typeof Map === 'function' ? function () {
  var index = new Map()
  return {
    get: index.get.bind(index),
    set: function (key, value) {
      index.set(key, value)
      return value
    },
    add: function (key, value) {
      index.set(key, value)
      return value
    }
  }
} : typeof Array.prototype.indexOf === 'function' ? function () {
  var keys = []
  var values = []
  return {
    get: function (key) {
      var offset = keys.indexOf(key)
      if (offset >= 0) {
        return values[offset]
      }
    },
    set: function (key, value) {
      var offset = keys.indexOf(key)
      return offset >= 0 ? (values[offset] = value) : this.add(key, value)
    },
    add: function (key, value) {
      keys.push(key)
      values.push(value)
      return value
    }
  }
} : function () {
  var keys = []
  var values = []
  return {
    get: function (key) {
      for (var i = keys.length - 1; i >= 0; i--) {
        if (keys[i] === key) {
          return values[i]
        }
      }
    },
    set: function (key, value) {
      for (var i = keys.length - 1; i >= 0; i--) {
        if (keys[i] === key) {
          return (values[i] = value)
        }
      }
      return this.add(key, value)
    },
    add: function (key, value) {
      keys.push(key)
      values.push(value)
      return value
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var $Type = $.type
  var $Tuple = $.tuple
  var $Array = $.array
  var $Object = $.object
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Object$ = $void.Object
  var Symbol$ = $void.Symbol
  var thisCall = $void.thisCall
  var sharedSymbolOf = $void.sharedSymbolOf

  var symbolLocals = sharedSymbolOf('_')
  var symbolObject = sharedSymbolOf('object')
  var symbolClass = sharedSymbolOf('class')

  var normalize = function (type) {
    type = type['to-code']()
    return type === $Symbol.empty ? symbolObject : type
  }
  var createInst = function (type) {
    return type === $Array ? $Tuple.array
      : type === $Object || (type = normalize(type)) === symbolObject
        ? $Tuple.object
        : new Tuple$([$Symbol.literal, $Symbol.pairing, type])
  }
  var updateInst = function (ref, type, code) {
    // remove unnecessary activation for data entity.
    var items = code.$
    if (items.length > 2 && items[0] === $Symbol.literal &&
      items[1] === $Symbol.pairing && (items[2] instanceof Symbol$)
    ) {
      var cls = items[2].key
      if (cls !== 'array' && cls !== 'object' && cls !== 'class') {
        items.length > 3 ? items.splice(1, 2) : items.splice(2, 1)
      }
    }
    return type === $Array
      ? new Tuple$([ref, $Symbol.of('append'), code])
      : type === $Object || (type = normalize(type)) === symbolObject
        ? new Tuple$([symbolObject, $Symbol.of('assign'), ref, code])
        : new Tuple$([symbolClass, $Symbol.of('attach'), ref, code])
  }

  $void.EncodingContext = function (root) {
    this.objs = createIndex()
    this.objs.add(this.root = root, null)
    this.clist = []
    this.shared = []
  }
  $void.EncodingContext.prototype = {
    _createRef: function (offset) {
      var ref = new Tuple$([symbolLocals, this.shared.length])
      this.shared.push(offset)
      return ref
    },
    begin: function (obj) {
      var offset = this.objs.get(obj)
      if (typeof offset === 'undefined') { // first touch
        return this.objs.add(obj, null)
      }
      var ref
      if (offset === null) { // to be recursively reused.
        offset = this.clist.length
        ref = this._createRef(offset)
        this.objs.set(obj, offset)
        this.clist.push([ref, null, null])
        return ref
      }
      var record = this.clist[offset]
      ref = record[0]
      if (!ref) { // to be reused.
        ref = record[0] = this._createRef(offset)
        var code = record[2]
        var newCode = new Tuple$(code.$) // copy code of value.
        code.$ = ref.$ // update original code from value to ref.
        record[2] = newCode // save the new code of value.
      }
      return ref
    },
    encode: function (obj) {
      return typeof obj === 'undefined' || obj === null ? null
        : typeof obj === 'number' || typeof obj === 'string' ? obj
          : (Array.isArray(obj) || $Type.of(obj) === $Object ||
            obj instanceof Object$ // class instances
          ) ? thisCall(obj, 'to-code', this) : thisCall(obj, 'to-code')
    },
    end: function (obj, type, code) {
      // try to supplement type to code
      if (type !== $Array && type !== $Object && type.name) {
        if (code.$[1] !== $Symbol.pairing) {
          code.$.splice(1, 0, $Symbol.pairing, sharedSymbolOf(type.name))
        } else if (code.$.length < 3) {
          code.$.splice(2, 0, sharedSymbolOf(type.name))
        }
      }
      // assert(code instanceof Tuple$)
      var offset = this.objs.get(obj)
      // assert(typeof offset !== 'undefined')
      if (offset === null) {
        offset = this.clist.length
        this.objs.set(obj, offset)
        this.clist.push([null, type, code])
        return obj === this.root ? this._finalize(offset) : code
      }
      // recursive reference
      var record = this.clist[offset]
      record[1] = type
      record[2] = code
      return obj === this.root ? this._finalize(offset) : record[0]
    },
    _finalize: function (rootOffset) {
      if (this.shared.length < 1) {
        // no circular or shared array/object.
        return this.clist[rootOffset][2]
      }
      var args = [$Symbol.literal] // (@ ...)
      var body = [new Tuple$([ // (local _ args) ...
        $Symbol.local, symbolLocals, new Tuple$(args)
      ])]
      var root
      for (var i = 0; i < this.shared.length; i++) {
        var offset = this.shared[i]
        var record = this.clist[offset]
        args.push(createInst(record[1]))
        offset === rootOffset
          ? (root = updateInst.apply(null, record))
          : body.push(updateInst.apply(null, record))
      }
      body.push(root || this.clist[rootOffset][2])
      return new Tuple$([ // (=>:() (local _ (@ ...)) ...)
        $Symbol.function, $Symbol.pairing, $Tuple.empty, new Tuple$(body, true)
      ])
    }
  }
}


/***/ }),

/***/ "./sugly/generic/function.js":
/*!***********************************!*\
  !*** ./sugly/generic/function.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = function ($void) {
  var $ = $void.$
  var Type = $.function
  var $Tuple = $.tuple
  var link = $void.link
  var bindThis = $void.bindThis
  var prepareOperation = $void.prepareOperation
  var prepareApplicable = $void.prepareApplicable
  var defineTypeProperty = $void.defineTypeProperty

  // the noop function
  var noop = link(Type, 'noop', $void.function(function () {
    return null
  }, $Tuple.function), true)

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.function)

  var proto = Type.proto
  // bind a function to a fixed subject.
  link(proto, 'bind', function ($this) {
    return bindThis(typeof $this !== 'undefined' ? $this : null, this)
  })

  // implement applicable operation features.
  prepareApplicable(Type, $Tuple.function)

  // inject function as the default type for native functions.
  defineTypeProperty(Function.prototype, Type)
}


/***/ }),

/***/ "./sugly/generic/genesis.js":
/*!**********************************!*\
  !*** ./sugly/generic/genesis.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  /*
    The Prologue.
  */
  // The Void is out of the scope of the Being and cannot be analyzed in the
  // scope of Being. Therefore, it cannot be described as either existent or
  // nonexistent. Boolean logic is part of the Being.
  var $void = {}

  /*
    The Beginning.
  */
  /* In the beginning God created the heavens and the earth. */
  var Null = $void.null = Object.create(null)
  /* Now the earth was formless and empty, */
  var $ = $void.$ = Object.create(null) /* 0. Generation */

  /* “Let there be light,” and there was light. */
  // The light is the laws, which are the foundation of all beings.
  var Prototype = Object.create(Null) /* 1. Derivation */
  function Type$ () { /* 2. Separation & Aggregation */
    // This function should be executed once, and only once.
    // The primal type is derived from the supreme prototype.
    this.proto = Prototype
    // The primal type is the container type of the supreme prototype.
    defineTypeProperty(Prototype, this)
  }
  Type$.prototype = Prototype

  /* Nameless beginning of heaven and earth, the famous mother of all things. */
  function naming (type, name) {
    $[name] = type
    type.name = name
    return type
  }

  /* ... he separated the light from the darkness, */
  var Type = new Type$()
  /* ... called the light “day,”  */
  naming(Type, 'type')
  /* ... and the darkness he called “night.” */
  $.null = null

  // The logical noumenon of null is not accessible directly, otherwise it will
  // cause some confusion in evalution process.
  // P.S, so is our fate too?

  /* A placeholder constructor to test a type. */
  $void.Type = function () {}
  $void.Type.prototype = Type

  /* It's ready to create primitive types, */
  function create (name) {
    var type = Object.create(Type)
    // a new type should have a new nature.
    type.proto = Object.create(Type.proto)
    // a proto always intrinsically knows its container type.
    defineTypeProperty(type.proto, type)
    // give a name to the new type.
    naming(type, name)
    return type
  }

  /* And there was evening, and there was morning — the first day. */
  /*   - from Bible and Dao Te Ching */

  /*
    The Creating.
  */
  /* Static Value Types */
  /* All static values are fixed points of evaluation function. */
  /* All static values can be fully encoded and recovered by evaluation. */

  // A boolean type is not a prerequisite to implement boolean logic, but it
  // may help to avoid ambiguity in many cases.
  create('bool')

  // A string is a piece of free form text.
  create('string')

  // A number may have a real number value in the proper range.
  create('number')

  // A date value is a combination of a timestamp and a associated locale string.
  create('date')
  $void.Date = Date

  // A range value represents a descrete sequence of numbers in the interval of
  // [begin, end) and a step value.
  create('range')
  var Range$ = $void.Range = function (begin, end, step) {
    this.begin = begin
    this.end = end
    this.step = step
  }
  Range$.prototype = $.range.proto

  /* Expression Types */
  /* An expression entity may produce another entity after evaluation. */
  /* An expression value can be fully encoded and recevered. */
  /* A static value can also be a part of an expression. */

  // A symbol is an identifer of a semantic element, so the string value of its
  // key must comply with some fundamental exical rules.
  // A symbol will be resolved to the associated value under current context or
  // null by the evaluation function.
  create('symbol')
  var Symbol$ = $void.Symbol = function (key) {
    this.key = key
  }
  Symbol$.prototype = $.symbol.proto

  // A tuple is a list of other static values, symbols and tuples.
  // A tuple will be interpreted as a statement under current context to produce
  // an output value by the evaluation function.
  // The name 'list' is left to be used for more common scenarios.
  create('tuple')
  var Tuple$ = $void.Tuple = function (list, plain, source) {
    this.$ = list // hidden native data
    this.plain = plain === true // as code block.
    if (source) { // reserved for source map and other debug information.
      this.source = source
    }
  }
  Tuple$.prototype = $.tuple.proto

  /* Operation Types */
  /* All operations will be evaluated to the output of its invocation. */

  // An operator is an operation which accepts raw argument expressions, which
  // means no evaluation happens to arguments before the invocation, to allow
  // more syntax structures can be defined.
  // An operator is an immutable entity and can be fully encoded.
  var operator = create('operator')
  $void.operator = function (impl, code) {
    impl.type = $.operator
    impl.code = code
    return impl
  }

  // the contaier for static operators. Static operators are taken as an
  // essential part of the language itself. They cannot be overridden.
  $void.staticOperators = Object.create(null)

  // A lambda is another type of operation which wants the values of its arguments
  // as input, so the runtime helps to evaluate all them before invocation.
  // A lambda is an immutable entity and can be fully encoded.
  create('lambda')
  $void.lambda = function (impl, code) {
    impl.type = $.lambda
    impl.code = code
    return impl
  }
  $void.stambda = function (impl, code) {
    impl.type = $.lambda
    impl.code = code
    impl.static = true
    return impl
  }
  $void.constambda = function (impl, code) {
    impl.type = $.lambda
    impl.code = code
    impl.const = true
    if (typeof impl.this === 'undefined') {
      impl.this = null
    }
    if (typeof impl.bound !== 'function') {
      impl.bound = impl
    }
    return impl
  }

  // A function is an operation which works like a Closure. Its behaviour depends
  // on both the values of arguments and current values in its outer context.
  // A function is not explicitly alterable but its implicit context is dynamic
  // and persistent in running. So its overall state is mutable.
  // For the existence of the context, a function cannot be fully encoded. But
  // it may be automatically downgraded to a lambda when the encoding is required.
  create('function')
  $void.function = function (impl, code) {
    impl.type = $.function
    impl.code = code
    return impl
  }

  // an operator is not a first-class value, so it can only be a direct predicate.
  $void.isApplicable = function (func) {
    return typeof func === 'function' && func.type !== operator
  }

  /* Transient Entity Types */
  /* All transient entities will be encoded to empty instances. */

  // A special type to wrap the transient state of an ongoing iteration.
  create('iterator')
  var Iterator$ = $void.Iterator = function (next) {
    this.next = next
  }
  Iterator$.prototype = $.iterator.proto

  // A special type to wrap the transient state of an ongoing action.
  create('promise')
  // TODO: to be polyfilled ?
  $void.Promise = Promise

  /* Compound Types */
  /* By default, compound entities are mutable. */
  /* All compound entities are also fixed points of evaluation funtion. */

  // A collection of values indexed by zero-based integers.
  create('array')

  // The object is the fundamental type of all compound entities.
  create('object')
  var Object$ = $void.Object = function (src) {
    if (src) {
      Object.assign(this, src)
    }
  }
  Object$.prototype = $.object.proto

  /*
    The Evoluation.
  */
  // Class is a meta type to create more types.
  var $Class = naming(Object.create(Type), 'class')

  // the prototype of classes is also a type.
  var $ClassProto = $Class.proto = Object.create(Type)
  $ClassProto.name = undefined
  $ClassProto.type = $Class

  // A fake constructor for instanceof checking for a class.
  var ClassType$ = $void.ClassType = function () {}
  ClassType$.prototype = $ClassProto

  // the prototype of class instances is object.proto.
  var $Instance = $ClassProto.proto = Object.create($.object.proto)
  // A fake constructor for instanceof checking for an instance of a class.
  var ClassInst$ = $void.ClassInst = function () {}
  ClassInst$.prototype = $Instance

  // export the ability of creation to enable an autonomous process.
  $void.createClass = function () {
    var class_ = Object.create($ClassProto)
    // a new type should have a new nature.
    class_.proto = Object.create($Instance)
    // a proto always intrinsically knows its container type.
    defineTypeProperty(class_.proto, class_)
    return class_
  }

  // type is not enumerable.
  $void.defineProperty = defineProperty
  function defineProperty (obj, name, value) {
    Object.defineProperty ? Object.defineProperty(obj, name, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: value
    }) : (obj[name] = value)
    return value
  }

  $void.defineTypeProperty = defineTypeProperty
  function defineTypeProperty (proto, type) {
    return defineProperty(proto, 'type', type)
  }

  $void.defineConst = defineConst
  function defineConst (ctx, key, value) {
    Object.defineProperty ? Object.defineProperty(ctx, key, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    }) : (ctx[key] = value)
    return value
  }

  return $void
}


/***/ }),

/***/ "./sugly/generic/global.js":
/*!*********************************!*\
  !*** ./sugly/generic/global.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var $export = $void.export
  var sharedSymbolOf = $void.sharedSymbolOf

  // an empty symbol to be resolve to null.
  $export($, '', null)

  // special empty symbols
  $export($, '*', null)
  $export($, '...', null)

  // constant values
  $export($, 'null', null)
  $export($, 'true', true)
  $export($, 'false', false)

  // punctuation pure Symbols
  $export($, '\\', sharedSymbolOf('\\'))
  $export($, '(', sharedSymbolOf('('))
  $export($, ')', sharedSymbolOf(')'))
  $export($, ',', sharedSymbolOf(','))
  $export($, ';', sharedSymbolOf(';'))
  $export($, '.', sharedSymbolOf('.'))
  $export($, '@', sharedSymbolOf('@'))
  $export($, ':', sharedSymbolOf(':'))
  $export($, '$', sharedSymbolOf('$'))
  $export($, '#', sharedSymbolOf('#'))
  $export($, '[', sharedSymbolOf('['))
  $export($, ']', sharedSymbolOf(']'))
  $export($, '{', sharedSymbolOf('{'))
  $export($, '}', sharedSymbolOf('}'))

  // other pure symbols
  $export($, 'in', sharedSymbolOf('in'))
  $export($, 'else', sharedSymbolOf('else'))

  // global enum value.
  $export($, sharedSymbolOf('descending').key, 1)
  $export($, sharedSymbolOf('equivalent').key, 0)
  $export($, sharedSymbolOf('ascending').key, -1)

  // ensure type name symbols are shared.
  var typeNames = [
    'type',
    'bool', 'string', 'number', 'date', 'range',
    'symbol', 'tuple',
    'operator', 'lambda', 'function',
    'array', 'iterator', 'object', 'class'
  ]
  for (var i = 0; i < typeNames.length; i++) {
    sharedSymbolOf(typeNames[i])
  }
}


/***/ }),

/***/ "./sugly/generic/iterator.js":
/*!***********************************!*\
  !*** ./sugly/generic/iterator.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function iterate ($void) {
  var $ = $void.$
  var Type = $.iterator
  var $Array = $.array
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var Iterator$ = $void.Iterator
  var numberOf = $.number.of
  var link = $void.link
  var thisCall = $void.thisCall
  var boolValueOf = $void.boolValueOf
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf

  // try to get an iterator function for an entity
  var iterateOf = $void.iterateOf = function (source) {
    return isApplicable(source) ? source
      : isApplicable(source = thisCall(source, 'iterate')) ? source : null
  }

  // create an empty iterator.
  var empty = link(Type, 'empty', new Iterator$(null))

  // create an iterator object for an iterable entity.
  link(Type, 'of', function (iterable) {
    if (iterable instanceof Iterator$) {
      return iterable
    }
    var next = iterateOf(iterable)
    return next ? new Iterator$(next) : empty
  }, true)

  // create an iterator object for an unsafe iterable entity.
  var unsafe = function (next) {
    var last
    return function (inSitu) {
      if (typeof last !== 'undefined' && boolValueOf(inSitu)) {
        return last
      }
      if (next === null) {
        return null
      }
      var current = next()
      return current === last || Object.is(current, last)
        ? (next = null) // each iteration must vary.
        : (last = current)
    }
  }
  link(Type, 'of-unsafe', function (iterable) {
    var next = iterateOf(iterable)
    return next ? new Iterator$(unsafe(next)) : empty
  }, true)

  var proto = Type.proto
  // an iterator objecct is also iterable.
  link(proto, 'iterate', function () {
    return this.next
  })

  // an iterator objecct is also iterable.
  link(proto, 'skip', function (count) {
    count >>= 0
    if (!this.next || count <= 0) {
      return this
    }

    var current
    var next = this.next
    this.next = function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      var value
      while (count > 0) {
        value = next(); count--
        if (typeof value === 'undefined' || value === null) {
          next = null; break
        }
      }
      value = next && next()
      return typeof value === 'undefined' || value === null ? null
        : (current = value)
    }
    return this
  })

  // an iterator objecct is also iterable.
  link(proto, 'keep', function (count) {
    if (!this.next) {
      return this
    }
    count >>= 0
    if (count <= 0) {
      this.next = null
      return this
    }
    var current
    var next = this.next
    this.next = function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      if (count <= 0) {
        return null
      }
      var value = next()
      if (--count <= 0) {
        next = null
      }
      return typeof value === 'undefined' || value === null ? null
        : (current = value)
    }
    return this
  })

  // select a subset of all items.
  link(proto, 'select', function (filter) {
    if (!this.next) {
      return this
    }
    if (!isApplicable(filter)) {
      if (!boolValueOf(filter)) {
        this.next = null
      }
      return this
    }
    var current
    var next = this.next
    this.next = function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      var value = next && next()
      while (typeof value !== 'undefined' && value !== null) {
        if (boolValueOf(Array.isArray(value)
          ? filter.apply(this, value) : filter.call(this, value))
        ) {
          return (current = value)
        }
        value = next()
      }
      return (next = null)
    }
    return this
  })

  // map each item to a new value.
  link(proto, 'map', function (converter) {
    if (!this.next) {
      return this
    }
    var convert = isApplicable(converter) ? converter : function () {
      return converter
    }
    var current
    var next = this.next
    this.next = function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      var value = next && next()
      if (typeof value === 'undefined' || value === null) {
        return (next = null)
      }
      current = Array.isArray(value)
        ? convert.apply(this, value) : convert.call(this, value)
      return Array.isArray(current) ? current : (current = [current])
    }
    return this
  })

  // accumulate all items to produce a value.
  link(proto, 'reduce', function (value, reducer) {
    if (!isApplicable(reducer)) {
      if (!isApplicable(value)) {
        return typeof value === 'undefined'
          ? count.call(this)
          : finish.call(this, value)
      } else {
        reducer = value
        value = null
      }
    }
    var args
    var item = this.next && this.next()
    while (typeof item !== 'undefined' && item !== null) {
      if (Array.isArray(item)) {
        args = item.slice()
        args.unshift(value)
      } else {
        args = [value, item]
      }
      value = reducer.apply(this, args)
      item = this.next()
    }
    this.next = null
    return value
  })

  // count the number of iterations.
  var count = link(proto, ['count', 'for-each'], function (filter) {
    var counter = 0
    var value = this.next && this.next()
    if (isApplicable(filter)) {
      while (typeof value !== 'undefined' && value != null) {
        (boolValueOf(Array.isArray(value)
          ? filter.apply(this, value) : filter.call(this, value))
        ) && counter++
        value = this.next()
      }
    } else {
      while (typeof value !== 'undefined' && value != null) {
        counter++
        value = this.next()
      }
    }
    this.next = null
    return counter
  })

  // sum the values of all iterations.
  link(proto, 'sum', function (base) {
    var sum = typeof base === 'number' ? base : numberOf(base)
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      if (Array.isArray(value)) {
        value = value.length > 0 ? value[0] : 0
      }
      sum += typeof value === 'number' ? value : numberOf(value)
      value = this.next()
    }
    this.next = null
    return sum
  })

  // calculate the average value of all iterations.
  link(proto, 'average', function (defaultValue) {
    var counter = 0
    var sum = 0
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      counter++
      if (Array.isArray(value)) {
        value = value.length > 0 ? value[0] : 0
      }
      sum += typeof value === 'number' ? value : numberOf(value)
      value = this.next()
    }
    this.next = null
    return (counter > 0) && !isNaN(sum /= counter) ? sum
      : typeof defaultValue === 'number' ? defaultValue : 0
  })

  // find the maximum value of all iterations.
  link(proto, 'max', function (filter) {
    var max = null
    var value = this.next && this.next()
    if (isApplicable(filter)) {
      while (typeof value !== 'undefined' && value != null) {
        if (Array.isArray(value) && value.length > 0) {
          value = value[0]
          if (filter.call(this, value) && (max === null ||
            thisCall(value, 'compare', max) > 0)) {
            max = value
          }
        }
        value = this.next()
      }
    } else {
      while (typeof value !== 'undefined' && value != null) {
        if (Array.isArray(value) && value.length > 0) {
          value = value[0]
          if (max === null || thisCall(value, 'compare', max) > 0) {
            max = value
          }
        }
        value = this.next()
      }
    }
    this.next = null
    return max
  })

  // find the minimum value of all iterations.
  link(proto, 'min', function (filter) {
    var min = null
    var value = this.next && this.next()
    if (isApplicable(filter)) {
      while (typeof value !== 'undefined' && value != null) {
        if (Array.isArray(value) && value.length > 0) {
          value = value[0]
          if (filter.call(this, value) && (min === null ||
            thisCall(value, 'compare', min) < 0)) {
            min = value
          }
        }
        value = this.next()
      }
    } else {
      while (typeof value !== 'undefined' && value != null) {
        if (Array.isArray(value) && value.length > 0) {
          value = value[0]
          if (min === null || thisCall(value, 'compare', min) < 0) {
            min = value
          }
        }
        value = this.next()
      }
    }
    this.next = null
    return min
  })

  // determine emptiness by its inner iterator function.
  link(proto, 'is-empty', function () {
    return !this.next
  })
  link(proto, 'not-empty', function () {
    return !!this.next
  })

  // concatenate the values of all iterations.
  link(proto, 'join', function (separator) {
    var str = ''
    if (typeof separator !== 'string') {
      separator = ' '
    }
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      if (Array.isArray(value)) {
        value = value.length > 0 ? value[0] : ''
      }
      if (str.length > 0) { str += separator }
      str += typeof value === 'string' ? value : thisCall(value, 'to-string')
      value = this.next()
    }
    this.next = null
    return str
  })

  // collect the main value of all iterations.
  link(proto, 'collect', function (list) {
    if (!Array.isArray(list)) {
      list = []
    }
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      list.push(!Array.isArray(value) ? value
        : value = value.length > 0 ? value[0] : null)
      value = this.next()
    }
    this.next = null
    return list
  })

  // finish all iterations.
  var finish = link(proto, 'finish', function (nil) {
    nil = [nil]
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      nil = value
      value = this.next()
    }
    this.next = null
    return !Array.isArray(nil) ? nil
      : nil.length > 0 ? nil[0] : null
  })

  // all interators will be encoded to an empty iterator.
  var arrayProto = $Array.proto
  var symbolOf = sharedSymbolOf('of')
  var symbolIterator = sharedSymbolOf('iterator')
  var emptyCode = new Tuple$([symbolIterator, sharedSymbolOf('empty')])
  var toCode = link(proto, 'to-code', function () {
    if (!this.next) {
      return emptyCode
    }
    var list = this.collect()
    this.next = arrayProto.iterate.call(list)
    return new Tuple$([
      symbolIterator, symbolOf, arrayProto['to-code'].call(list)
    ])
  })

  // Description
  var tupleToString = $.tuple.proto['to-string']
  var emptyCodeStr = tupleToString.call(emptyCode)
  link(proto, 'to-string', function (separator) {
    return !this.next ? emptyCodeStr
      : tupleToString.call(toCode.call(this))
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}


/***/ }),

/***/ "./sugly/generic/lambda.js":
/*!*********************************!*\
  !*** ./sugly/generic/lambda.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = function ($void) {
  var $ = $void.$
  var Type = $.lambda
  var $Tuple = $.tuple
  var link = $void.link
  var bindThis = $void.bindThis
  var constambda = $void.constambda
  var prepareOperation = $void.prepareOperation
  var prepareApplicable = $void.prepareApplicable

  // the noop lambda
  var noop = link(Type, 'noop', $void.lambda(function () {
    return null
  }, $Tuple.lambda), true)

  link(Type, 'static', $void.constambda(function () {
    return null
  }, $Tuple.stambda), true)

  var proto = Type.proto
  link(proto, 'is-static', function () {
    return this.static === true || this.const === true
  })

  link(proto, 'is-const', function () {
    return this.const === true
  })

  // bind a lambda to a fixed subject.
  link(proto, 'bind', function (arg) {
    if (typeof this.bound === 'function') {
      return this
    }
    if (typeof arg === 'undefined') {
      arg = null
    }
    return this.static !== true || typeof this.this === 'undefined'
      ? bindThis(arg, this)
      : constambda(this.bind(null, arg), this.code)
  })

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.lambda)

  // implement applicable operation features.
  prepareApplicable(Type, $Tuple.lambda)
}


/***/ }),

/***/ "./sugly/generic/null.js":
/*!*******************************!*\
  !*** ./sugly/generic/null.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var Null = $void.null
  var link = $void.link
  var Symbol$ = $void.Symbol

  // Fundamental Entity Relationships: Identity, Equivalence and Ordering
  // Identity, Equivalence and Ordering logics must be symmetrical.
  // An identity must be equivalent with itself.
  // Ordering Equal must comply with Equivalence Equal.

  link(Null, [
    // Identity: to recognize two different entities.
    'is', '===',
    // Equivalence: to test if two entities are equivalent in effect.
    // Equivalence logic should be implemented symmetrically.
    // So it's different with the behaviour of NaN in JS, since an identity must be
    // equivalent in effect with itself, or as an identity's behaviour cannot be
    // defined by any property that's unrelevant with its effect to its environment.
    'equals', '=='
  ], function (another) {
    return Object.is(typeof this === 'undefined' ? null : this,
      typeof another === 'undefined' ? null : another)
  })
  link(Null, [
    // the negative method of Identity test.
    'is-not', '!==',
    // the negative method of Equivalence test.
    'not-equals', '!='
  ], function (another) {
    return !Object.is(typeof this === 'undefined' ? null : this,
      typeof another === 'undefined' ? null : another)
  })

  // Ordering: general comparison
  //     0 - identical
  //     1 - from this to another is descending.
  //    -1 - from this to another is ascending.
  //  null - not-sortable
  link(Null, 'compare', function (another) {
    return Object.is(this, typeof another === 'undefined' ? null : another)
      ? 0 : null
  })

  // Emptiness: null, type.proto and all protos are empty.
  link(Null, 'is-empty', function () {
    return true
  })
  link(Null, 'not-empty', function () {
    return false
  })

  // Type Verification: to test if an entity is an instance of a type.
  link(Null, 'is-a', function (type) {
    // null is null and null is a null.
    // type.proto is not null but is a null.
    return typeof type === 'undefined' || type === null
  })
  link(Null, 'is-not-a', function (type) {
    return typeof type !== 'undefined' && type !== null
  })

  // Encoding
  link(Null, 'to-code', function () {
    return this
  })

  // Representation (static values) or Description (non-static values)
  link(Null, 'to-string', function () {
    return 'null'
  })

  // Indexer
  link(Null, ':', function (index) {
    return typeof index === 'string' ? Null[index]
      : index instanceof Symbol$ ? Null[index.key] : null
  })
}


/***/ }),

/***/ "./sugly/generic/number.js":
/*!*********************************!*\
  !*** ./sugly/generic/number.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function createValueOf ($void, parse, parseInteger) {
  return function (input, defaultValue) {
    var value
    if (typeof input === 'string') {
      value = input.startsWith('0x') || input.startsWith('0b') ? parseInteger(input) : parse(input)
    } else if (typeof input === 'boolean') {
      value = input ? 1 : 0
    } else if (input instanceof Date) {
      value = input.getTime()
    } else if (typeof input === 'undefined' || input === null) {
      value = 0
    } else if (typeof input === 'number') {
      value = input
    } else {
      value = NaN
    }
    return isNaN(value) && typeof defaultValue === 'number' ? defaultValue : value
  }
}

function createIntValueOf ($void, parse) {
  return function (input, defaultValue) {
    var result
    if (typeof input === 'string') {
      result = parse(input)
    } else if (typeof input === 'number') {
      result = Math.trunc(input)
    } else if (typeof input === 'boolean') {
      return input ? 1 : 0
    }
    return Number.isSafeInteger(result) ? result
      : Number.isSafeInteger(defaultValue) ? defaultValue : 0
  }
}

function createIntParser ($void) {
  return function (input) {
    var value
    if (typeof input !== 'string') {
      return typeof input !== 'number' ? NaN
        : input === 0 ? 0 : isNaN(input) ? NaN
          : (value = Math.trunc(input)) === 0 ? 0
            : Number.isSafeInteger(value) ? value : NaN
    }
    var radix
    if (input.startsWith('0x')) {
      radix = 16
      input = input.substring(2)
    } else if (input.startsWith('0b')) {
      radix = 2
      input = input.substring(2)
    } else if (input.length > 1 && input.startsWith('0')) {
      radix = 8
      input = input.substring(1)
    } else {
      radix = 10
      var offset = input.indexOf('.')
      if (offset >= 0) {
        input = input.substr(0, offset)
      }
    }
    value = parseInt(input, radix)
    return value === 0 ? 0
      : input.endsWith('i') ? value >> 0
        : Number.isSafeInteger(value) ? value : NaN
  }
}

function numberAnd (valueOf) {
  return function () {
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result += typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberSubtract (valueOf) {
  return function () {
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result -= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberTimes (valueOf) {
  return function () {
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result *= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberDivide (valueOf) {
  return function () {
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result /= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function normalize (value) {
  return value >= 0 ? Math.trunc(value) : (0x100000000 + (value >> 0))
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.number
  var $Range = $.range
  var link = $void.link
  var Symbol$ = $void.Symbol
  var copyType = $void.copyType
  var protoValueOf = $void.protoValueOf
  var defineTypeProperty = $void.defineTypeProperty

  // the value range and constant values.
  copyType(Type, Number, {
    MAX_VALUE: 'max',
    MIN_VALUE: 'smallest',
    MAX_SAFE_INTEGER: 'max-int',
    MIN_SAFE_INTEGER: 'min-int',
    POSITIVE_INFINITY: 'infinite',
    NEGATIVE_INFINITY: '-infinite'
  })
  link(Type, 'min', -Number.MAX_VALUE)

  // support bitwise operations for 32-bit integer values.
  link(Type, 'bits', 32)
  var maxBits = link(Type, 'max-bits', 0x7FFFFFFF)
  var minBits = link(Type, 'min-bits', 0x80000000 >> 0)

  // The empty value
  link(Type, 'empty', 0)

  // An empty value indicating an invalid number.
  link(Type, 'invalid', NaN)

  // parse a string to its number value.
  var regexParse = /\s*\(number\s+(invalid|[-]?infinite)\s*\)\s*/
  var parse = link(Type, 'parse', function (value) {
    if (typeof value !== 'string') {
      return typeof value === 'number' ? value : NaN
    }
    var keys = value.match(regexParse)
    switch (keys && keys.length > 1 ? keys[1] : '') {
      case 'invalid':
        return NaN
      case 'infinite':
        return Number.POSITIVE_INFINITY
      case '-infinite':
        return Number.NEGATIVE_INFINITY
      default:
        return parseFloat(value)
    }
  }, true)

  // parse a string as an integer value.
  var parseInteger = link(Type, 'parse-int', createIntParser($void), true)

  // get a number value from the input
  var valueOf = link(
    Type, 'of', createValueOf($void, parse, parseInteger), true
  )

  // get an integer value from the input
  var intOf = link(Type, 'of-int', createIntValueOf($void, parseInteger), true)

  // get an signed integer value which is stable with bitwise operation.
  link(Type, 'of-bits', function (input) {
    return intOf(input) >> 0
  }, true)

  var proto = Type.proto
  // test for special values
  link(proto, 'is-valid', function () {
    return !isNaN(this)
  })
  link(proto, 'is-invalid', function () {
    return isNaN(this)
  })
  // test for special value ranges
  link(proto, 'is-finite', function () {
    return isFinite(this)
  })
  link(proto, 'is-infinite', function () {
    return !isFinite(this)
  })
  link(proto, 'is-int', function () {
    return Number.isSafeInteger(this) && (this !== 0 || 1 / this === Infinity)
  })
  link(proto, 'is-not-int', function () {
    return !Number.isSafeInteger(this) || (this === 0 && 1 / this !== Infinity)
  })
  link(proto, 'is-bits', function () {
    return Number.isSafeInteger(this) &&
      this >= minBits && this <= maxBits &&
      (this !== 0 || 1 / this === Infinity)
  })
  link(proto, 'is-not-bits', function () {
    return !Number.isSafeInteger(this) ||
      this < minBits || this > maxBits ||
      (this === 0 && 1 / this !== Infinity)
  })

  // convert to special sub-types
  link(proto, 'as-int', function () {
    var intValue = Number.isSafeInteger(this) ? this
      : isNaN(this) ? 0
        : this >= Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER
          : this <= Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER
            : Math.trunc(this)
    return intValue === 0 ? 0 : intValue
  })
  link(proto, 'as-bits', function () {
    return this >> 0
  })

  // support basic arithmetic operations
  link(proto, ['+', 'plus'], numberAnd(valueOf))
  link(proto, ['-', 'minus'], numberSubtract(valueOf))
  link(proto, ['*', 'times'], numberTimes(valueOf))
  link(proto, ['/', 'divided-by'], numberDivide(valueOf))

  // remainder / modulus
  link(proto, '%', function (base) {
    return typeof base === 'undefined' ? this
      : isNaN(base) || typeof base !== 'number' ? NaN
        : isFinite(base) ? this % valueOf(base) : this
  })

  // bitwise operations
  link(proto, '&', function (value) {
    return this & value
  })
  link(proto, '|', function (value) {
    return this | value
  })
  link(proto, '^', function (value) {
    return this ^ value
  })
  link(proto, '<<', function (offset) {
    offset >>= 0
    return offset <= 0 ? this << 0
      : offset >= 32 ? 0 : this << offset
  })
  // signed right-shift.
  link(proto, '>>', function (offset) {
    offset >>= 0
    return offset <= 0 ? this >> 0
      : offset >= 32 ? (this >> 0) >= 0 ? 0 : -1
        : this >> offset
  })
  // zero-based right shift.
  link(proto, '>>>', function (offset) {
    offset >>= 0
    return offset <= 0 ? this >> 0
      : offset >= 32 ? 0 : this >>> offset
  })

  // support ordering logic - comparable
  // For uncomparable entities, comparison result is consistent with the Equivalence.
  // Uncomparable state is indicated by a null and is taken as inequivalent.
  var compare = link(proto, 'compare', function (another) {
    return typeof another !== 'number' ? null
      : this === another ? 0 // two same valid values.
        : !isNaN(this) && !isNaN(another)
          ? this > another ? 1 : -1
          : isNaN(this) && isNaN(another)
            ? 0 // NaN is equivalent with itself.
            : null // NaN is not comparable with a real number.
  })

  // comparing operators for instance values
  link(proto, '>', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order > 0 : null
  })
  link(proto, '>=', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order >= 0 : null
  })
  link(proto, '<', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order < 0 : null
  })
  link(proto, '<=', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order <= 0 : null
  })

  // override equivalence logic since 0 != -0 by identity-base test.
  link(proto, ['equals', '=='], function (another) {
    return typeof another === 'number' && (
      this === another || (isNaN(this) && isNaN(another))
    )
  })
  link(proto, ['not-equals', '!='], function (another) {
    return typeof another !== 'number' || (
      this !== another && !(isNaN(this) && isNaN(another))
    )
  })

  // support common math operations
  link(proto, 'ceil', function () {
    return Math.ceil(this)
  })
  link(proto, 'floor', function () {
    return Math.floor(this)
  })
  link(proto, 'round', function () {
    return Math.round(this)
  })
  link(proto, 'trunc', function () {
    return Math.trunc(this)
  })

  // O and NaN are defined as empty.
  link(proto, 'is-empty', function () {
    return this === 0 || isNaN(this)
  })
  link(proto, 'not-empty', function () {
    return this !== 0 && !isNaN(this)
  })

  // Representation & Description
  link(proto, 'to-string', function (format) {
    if (isNaN(this)) {
      return '(number invalid)'
    } else if (this === Number.POSITIVE_INFINITY) {
      return '(number infinite)'
    } else if (this === Number.NEGATIVE_INFINITY) {
      return '(number -infinite)'
    } else if (!format) {
      return Object.is(this, -0) ? '-0' : this.toString()
    }

    switch (format) {
      case 'H':
      case 'HEX':
        return normalize(this).toString(16)
      case 'h':
      case 'hex':
        return '0x' + normalize(this).toString(16)
      case 'O':
      case 'OCT':
        return normalize(this).toString(8)
      case 'o':
      case 'oct':
        return '0' + normalize(this).toString(8)
      case 'B':
      case 'BIN':
        return normalize(this).toString(2)
      case 'b':
      case 'bin':
        return '0b' + normalize(this).toString(2)
      default:
        return this.toString()
    }
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : typeof index === 'number' ? $Range.of(this, index, value)
        : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  defineTypeProperty(Number.prototype, Type)
}


/***/ }),

/***/ "./sugly/generic/object.js":
/*!*********************************!*\
  !*** ./sugly/generic/object.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Type = $.object
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var link = $void.link
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var isObject = $void.isObject
  var thisCall = $void.thisCall
  var ClassType$ = $void.ClassType
  var ownsProperty = $void.ownsProperty
  var protoValueOf = $void.protoValueOf
  var encodeFieldName = $void.encodeFieldName
  var EncodingContext$ = $void.EncodingContext
  var defineTypeProperty = $void.defineTypeProperty

  // create an empty object.
  var createObject = link(Type, 'empty', Object.create.bind(Object, Type.proto))

  // create a new object and copy fields from source objects.
  link(Type, 'of', function () {
    var obj = createObject()
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (isObject(source)) {
        Object.assign(obj, source)
      }
    }
    return obj
  }, true)

  // copy fields from source objects to the target object
  link(Type, 'assign', function (target) {
    if (isObject(target)) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        if (source instanceof Object$) {
          Object.assign(target, source)
        }
      }
      return target
    }
    return null
  }, true)

  // get the value of a field.
  link(Type, 'get', function (obj, name, value) {
    if (name instanceof Symbol$) {
      name = name.key
    } else if (typeof name !== 'string') {
      return value
    }
    var pValue
    return !isObject(obj) ? value
      : ownsProperty(obj, name)
        ? typeof obj[name] === 'undefined' ? value : obj[name]
        : typeof (pValue = protoValueOf(obj, obj, name)) === 'undefined'
          ? value : pValue
  }, true)
  // set the value of a field.
  link(Type, 'set', function (obj, name, value) {
    if (name instanceof Symbol$) {
      name = name.key
    } else if (typeof name !== 'string') {
      return null
    }
    return !isObject(obj) ? null
      : (obj[name] = (typeof value !== 'undefined' ? value : null))
  }, true)
  // remove a field.
  link(Type, 'reset', function (obj, name, more) {
    if (!isObject(obj)) {
      return 0
    }
    if (typeof more === 'undefined') {
      if (name instanceof Symbol$) {
        name = name.key
      }
      return typeof name !== 'string' ? 0
        : delete obj[name] ? 1 : 0
    }
    var i = 1
    var counter = 0
    do {
      if (typeof name === 'string') {
        (delete obj[name]) && counter++
      } else if (name instanceof Symbol$) {
        (delete obj[name.key]) && counter++
      }
      name = arguments[++i]
    } while (i < arguments.length)
    return counter
  }, true)

  // make a copy with selected or all fields.
  link(Type, 'copy', function (src, fields) {
    if (!isObject(src)) {
      return null
    }
    var obj = Object.create(src.type.proto)
    var names = arguments.length > 1
      ? Array.prototype.slice.call(arguments, 1)
      : Object.getOwnPropertyNames(src)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (name instanceof Symbol$) {
        name = name.key
      }
      if (typeof name === 'string') {
        obj[name] = src[name]
      }
    }
    var activator = src.type.proto.activator
    if (typeof activator === 'function') {
      activator.call(obj, obj)
    }
    return obj
  }, true)
  // remove given or all fields.
  link(Type, 'clear', function (obj, fields) {
    if (!isObject(obj)) {
      return null
    }
    var names = arguments.length > 1
      ? Array.prototype.slice.call(arguments, 1)
      : Object.getOwnPropertyNames(obj)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (typeof name === 'string') {
        delete obj[name]
      } else if (name instanceof Symbol$) {
        delete obj[name.key]
      }
    }
    return obj
  }, true)
  // remove one or more values to create a new object.
  link(Type, 'remove', function (src, fields) {
    if (!isObject(src)) {
      return null
    }
    var obj = Object.assign(Object.create(src.type.proto), src)
    var names = arguments.length <= 1 ? []
      : Array.prototype.slice.call(arguments, 1)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (typeof name === 'string') {
        delete obj[name]
      } else if (name instanceof Symbol$) {
        delete obj[name.key]
      } else if (name instanceof Object$) {
        fields = Object.getOwnPropertyNames(name)
        for (var j = 0; j < fields.length; j++) {
          delete obj[fields[j]]
        }
      }
    }
    var activator = src.type.proto.activator
    if (typeof activator === 'function') {
      activator.call(obj, obj)
    }
    return obj
  }, true)

  // check the existence of a property
  link(Type, 'has', function (obj, name) {
    if (typeof name !== 'string') {
      if (name instanceof Symbol$) {
        name = name.key
      } else {
        return false
      }
    }
    return isObject(obj) && typeof obj[name] !== 'undefined'
  }, true)
  // check the existence of a field
  link(Type, 'owns', function (obj, name) {
    if (typeof name !== 'string') {
      if (name instanceof Symbol$) {
        name = name.key
      } else {
        return false
      }
    }
    return isObject(obj) && ownsProperty(obj, name)
  }, true)
  // retrieve field names.
  link(Type, 'fields-of', function (obj) {
    return isObject(obj) ? Object.getOwnPropertyNames(obj) : []
  }, true)

  // Mutability
  link(Type, 'seal', function (obj) {
    return typeof obj === 'undefined' ? Type // operating on the type
      : isObject(obj) || Array.isArray(obj) ? Object.freeze(obj) : null
  })
  link(Type, 'is-sealed', function (obj) {
    return typeof obj === 'undefined' ? true // asking the type
      : isObject(obj) || Array.isArray(obj) ? Object.isFrozen(obj) : false
  })

  var proto = Type.proto
  // generate an iterator function to traverse all fields as [name, value].
  link(proto, 'iterate', function () {
    var fields = Object.getOwnPropertyNames(this)
    var obj = this
    var current = null
    var next = 0
    var field
    return function (inSitu) {
      return current !== null && inSitu === true ? current // cached current value
        : next >= fields.length ? null // no more
          : (current = [(field = fields[next++]), obj[field]])
    }
  })

  // Type Verification
  link(proto, 'is-a', function (t) {
    return t === Type
  })
  link(proto, 'is-not-a', function (t) {
    return t !== Type
  })

  // default object emptiness logic
  link(proto, 'is-empty', function () {
    return !(Object.getOwnPropertyNames(this).length > 0)
  })
  link(proto, 'not-empty', function () {
    return Object.getOwnPropertyNames(this).length > 0
  })

  // Encoding
  // encoding logic for all object instances.
  var typeOf = $.type.of
  var toCode = link(proto, 'to-code', function (ctx) {
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) { return sym }
    } else {
      ctx = new EncodingContext$(this)
    }
    var props = Object.getOwnPropertyNames(this)
    var code = [$Symbol.literal]
    for (var i = 0; i < props.length; i++) {
      var name = props[i]
      code.push(encodeFieldName(name), $Symbol.pairing, ctx.encode(this[name]))
    }
    if (code.length < 2) {
      code.push($Symbol.pairing) // (@:) for empty object
    }
    var type = this.type instanceof ClassType$ ? this.type : typeOf(this)
    return ctx.end(this, type, new Tuple$(code))
  })

  // Description
  link(proto, 'to-string', function () {
    return thisCall(toCode.call(this), 'to-string')
  })

  // Indexer:
  var indexer = link(proto, ':', function (index, value) {
    if (typeof index !== 'string') {
      if (index instanceof Symbol$) {
        index = index.key // use the key of a symbol
      } else {
        return null // unsupported property key.
      }
    }
    return typeof value === 'undefined'
      ? typeof proto[index] === 'undefined' || index === 'type'
        ? this[index] : protoValueOf(this, proto, index) // getting
      : (this[index] = value) // setting
  })
  indexer.get = function (key) {
    return typeof proto[key] === 'undefined' || key === 'type'
      ? this[key] : proto[key] // getting
  }

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  defineTypeProperty(Object.prototype, Type)
}


/***/ }),

/***/ "./sugly/generic/operator.js":
/*!***********************************!*\
  !*** ./sugly/generic/operator.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = function ($void) {
  var $ = $void.$
  var Type = $.operator
  var $Tuple = $.tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation

  // the noop operator
  var noop = link(Type, 'noop', $void.operator(function () {
    return null
  }, $Tuple.operator), true)

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.operator)
}


/***/ }),

/***/ "./sugly/generic/promise.js":
/*!**********************************!*\
  !*** ./sugly/generic/promise.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

function ingoreUnhandledRejectionsBy (filter) {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', function (event) {
      var detail = event.promise ? event
        : event.detail // for bluebird polyfill.
      if (detail.promise && filter(detail.promise, detail.reason)) {
        event.preventDefault()
      }
    })
  } else if (typeof process !== 'undefined') {
    process.on('unhandledRejection', function (reason, promise) {
      filter(promise, reason)
    })
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.promise
  var $Tuple = $.tuple
  var $Object = $.object
  var $Symbol = $.symbol
  var Symbol$ = $void.Symbol
  var Promise$ = $void.Promise
  var link = $void.link
  var $export = $void.export
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf
  var defineTypeProperty = $void.defineTypeProperty

  function hasExcuse (excuse) {
    return typeof excuse !== 'undefined' && excuse !== null
  }

  // use true to make sure it's not a boolean false by default.
  var NoExcuse = true
  function safeExcuse (excuse, waiting) {
    return hasExcuse(excuse) ? excuse
      : waiting && hasExcuse(waiting.excuse) ? waiting.excuse : NoExcuse
  }

  function assemble (promise, cancel) {
    if (promise.excusable !== true) {
      promise.excusable = true
    }
    if (isApplicable(cancel)) {
      promise.$cancel = cancel
    }
    return promise
  }

  function promiseOfAsync (async) {
    var cancel
    var promise = new Promise$(function (resolve, reject) {
      cancel = async(Object.freeze($Object.of({
        resolve: resolve,
        reject: reject
      })))
    })
    return assemble(promise, cancel)
  }

  function promiseOfExecutor (executor) {
    var cancel
    var promise = new Promise$(function (resolve, reject) {
      cancel = executor(resolve, reject)
    })
    return assemble(promise, cancel)
  }

  function resolvedTo (next, result) {
    return next(Object.freeze($Object.of({
      result: result
    })))
  }

  function rejectedTo (next, excuse) {
    return next(Object.freeze($Object.of({
      excuse: safeExcuse(excuse)
    })))
  }

  function staticPromiseOf (result) {
    var value
    return assemble(!Array.isArray(result)
      // intercept a non-array value as an excuse. Otherwise,
      ? (value = safeExcuse(result)) === NoExcuse ? nothing
        : Promise$.reject(value)
      // reject if any excuse exists. Otherwise,
      : hasExcuse((value = result[1])) ? Promise$.reject(value)
        // resolve even the final result value is null.
        : ((value = result[0]) === undefined || value === null) ? empty
          : Promise$.resolve(value)
    )
  }

  function makePromise (promising, isExecutor) {
    return promising instanceof Promise$ ? assemble(promising)
      : !isApplicable(promising) ? staticPromiseOf(promising)
        : isExecutor ? promiseOfExecutor(promising)
          : promiseOfAsync(promising)
  }

  function wrapStepResult (result, waiting) {
    return function (resolve, reject) {
      // any non-array result will be intercepted as an excuse
      !Array.isArray(result) ? reject(safeExcuse(result, waiting))
        // finally reject if any excuse exists. Otherwise,
        : hasExcuse(result[1]) ? reject(result[1])
          // resolve even the final result value is null.
          : resolve(result[0] === undefined ? null : result[0])
    }
  }

  function rejectWith (safeExcuse) {
    return function (resolve, reject) {
      reject(safeExcuse)
    }
  }

  function wrap (step) {
    return isApplicable(step) ? function (waiting) {
      // let a step function to decide if it forgives an existing excuse.
      var result = step.apply(null, arguments)
      return result instanceof Promise$ // continue and
        ? result.then.bind(result) // forward final promise's result.
        : isApplicable(result) // continue too, and
          // generate a final promise and forward its result.
          ? (result = makePromise(result)).then.bind(result)
          // other value will be intercepted as a sync step result.
          : wrapStepResult(result, waiting)
    } : function (waiting) {
      // any value other than a promise or an function will be intercepted as
      // a sync step result.
      return waiting && hasExcuse(waiting.excuse)
        ? rejectWith(waiting.excuse)
        : wrapStepResult(step)
    }
  }

  function awaitFor (promise, next) {
    return function (resolve, reject) {
      promise.then(function (result) {
        resolvedTo(next, result)(resolve, reject)
      }, function (excuse) {
        rejectedTo(next, excuse)(resolve, reject)
      })
    }
  }

  function compose (promise, next) {
    return function (waiting) {
      return waiting && hasExcuse(waiting.excuse)
        // the overall promise will reject immediately if found an tolerated
        // rejection, since a parallelizing promise cannot react to it.
        ? rejectWith(waiting.excuse)
        // otherwise, the current promise's result will be taken into account in turn.
        : awaitFor(promise, next)
    }
  }

  function connect (step, next) {
    return function (waiting) {
      var result = step.apply(null, arguments)
      return result instanceof Promise$
        // a step function may return another promise, or
        ? awaitFor(result, next)
        // return a new promisee function to generate a promise.
        : isApplicable(result) ? awaitFor(makePromise(result), next)
          // any value other than a sync step result will be intercepted as
          // the excuse of a final rejection.
          : !Array.isArray(result) ? rejectWith(safeExcuse(result, waiting))
            // a sync step result will be relayed literally, so it may have
            // any number of values in theory.
            : function (resolve, reject) {
              next.apply(null, result)(resolve, reject)
            }
    }
  }

  function makePromises (promises) {
    if (!Array.isArray(promises)) {
      promises = []
    }
    for (var i = 0; i < promises.length; i++) {
      promises[i] = makePromise(promises[i])
    }
    return promises
  }

  // the empty value which has been resolved to null.
  var empty = link(Type, 'empty', Promise$.resolve(null))

  // guard sugly promises to ingore unhandled rejections.
  ingoreUnhandledRejectionsBy(function (promise, excuse) {
    // create warnings
    return promise.excusable === true
  })

  // another special value which has been rejected.
  var nothing = link(Type, 'nothing', Promise$.reject(NoExcuse))
  // catch the rejection of nothing.
  nothing.catch(function () {})

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when all promise handlers have been invoked sequentially.
  var noop = function () { return this }
  $export($, 'commit', link(Type, 'of', function (promising, next) {
    var last = arguments.length - 1
    next = last > 0 ? wrap(arguments[last]) : null
    for (var i = last - 1; i > 0; i--) {
      var current = arguments[i]
      if (!isApplicable(current)) {
        current = noop.bind(current)
      }
      next = connect(current, next)
    }
    promising = typeof promising === 'undefined' || promising === null
      ? nothing : makePromise(promising)
    return next ? makePromise(compose(promising, next)(), true) : promising
  }, true))

  // to make a resolved promise for a value.
  link(Type, 'of-resolved', function (result) {
    return typeof result === 'undefined' || result === null ? empty
      : assemble(Promise$.resolve(result))
  }, true)

  // to make a rejected promise with a cause.
  link(Type, 'of-rejected', function (excuse) {
    excuse = safeExcuse(excuse)
    return excuse === NoExcuse ? nothing
      : assemble(Promise$.reject(excuse))
  }, true)

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when all promise handlers have been invoked separately.
  $export($, 'commit*', link(Type, 'of-all', function (promising) {
    var promises = makePromises(Array.prototype.slice.call(arguments))
    return promises.length > 0 ? assemble(Promise$.all(promises)) : empty
  }, true))

  // the array argument version of (promise of-all promisings)
  link(Type, 'all', function (promisings) {
    if (!Array.isArray(promisings)) {
      return empty
    }
    var promises = makePromises(promisings)
    return promises.length > 0 ? assemble(Promise$.all(promises)) : empty
  }, true)

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when any one of them is fulfilled.
  $export($, 'commit?', link(Type, 'of-any', function (promising) {
    var promises = makePromises(Array.prototype.slice.call(arguments))
    return promises.length > 1 ? assemble(Promise$.race(promises))
      : promises.length > 0 ? promises[0] : nothing
  }, true))

  // the array argument version of (promise of-any promisings)
  link(Type, 'any', function (promisings) {
    if (!Array.isArray(promisings)) {
      return nothing
    }
    var promises = makePromises(promisings)
    return promises.length > 1 ? assemble(Promise$.race(promises))
      : promises.length > 0 ? promises[0] : nothing
  }, true)

  var proto = Type.proto
  // the optional cancellation capability of a promise.
  link(proto, 'is-cancellable', function () {
    return isApplicable(this.$cancel)
  })
  // try to cancel the promised operation.
  link(proto, 'cancel', function () {
    // a cancel function should be ready for being called multiple times.
    return isApplicable(this.$cancel) ? this.$cancel.apply(this, arguments) : null
  })

  // the next step after this promise has been either resolved or rejected.
  // this returns a new promise or this (only when step is missing).
  link(proto, 'then', function (step) {
    return typeof step === 'undefined' ? this
      : makePromise(awaitFor(this, wrap(step)), true)
  })

  // the last step after this promise has been either resolved or rejected.
  // this returns current promise
  link(proto, 'finally', function (waiter) {
    if (isApplicable(waiter)) {
      this.then(
        resolvedTo.bind(null, waiter),
        rejectedTo.bind(null, waiter)
      )
    }
    return this
  })

  // range is empty if it cannot iterate at least once.
  link(proto, 'is-empty', function () {
    return this === empty || this === nothing
  })
  link(proto, 'not-empty', function () {
    return this !== empty && this !== nothing
  })

  // Encoding
  var symbolPromise = sharedSymbolOf('promise')
  var emptyPromise = $Tuple.of(symbolPromise, sharedSymbolOf('empty'))
  var nothingPromise = $Tuple.of(symbolPromise, sharedSymbolOf('nothing'))
  var otherPromise = $Tuple.of(symbolPromise, sharedSymbolOf('of'), $Symbol.etc)
  var toCode = link(proto, 'to-code', function () {
    return this === empty ? emptyPromise
      : this === nothing ? nothingPromise
        : otherPromise
  })

  // Description
  link(proto, 'to-string', function () {
    return toCode.call(this)['to-string']()
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject function as the default type for native functions.
  defineTypeProperty(Promise$.prototype, Type)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./sugly/generic/range.js":
/*!********************************!*\
  !*** ./sugly/generic/range.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Type = $.range
  var Range$ = $void.Range
  var Symbol$ = $void.Symbol
  var link = $void.link
  var protoValueOf = $void.protoValueOf

  // the empty value
  link(Type, 'empty', new Range$(0, 0, 1))

  // create a range
  link(Type, 'of', function (begin, end, step) {
    if (begin instanceof Range$) {
      return begin // null op for the same type.
    }
    if (typeof begin !== 'number' || isNaN(begin) || !isFinite(begin)) {
      begin = 0
    }
    if (typeof end === 'undefined') {
      end = begin
      begin = 0
    } else if (typeof end !== 'number' || isNaN(end) || !isFinite(end)) {
      end = 0
    }
    if (typeof step !== 'number' || isNaN(step) || !isFinite(step)) {
      step = 0
    }
    return new Range$(begin, end, step || (begin <= end ? 1 : -1))
  }, true)

  var proto = Type.proto

  link(proto, 'begin', function () {
    return this.begin
  })
  link(proto, 'end', function () {
    return this.end
  })
  link(proto, 'step', function () {
    return this.step
  })

  link(proto, 'count', function () {
    var diff = this.end - this.begin
    var count = Math.trunc(diff / this.step)
    var remainder = diff % this.step
    return count < 0 ? 0 : remainder ? count + 1 : count
  })

  // generate an iterator function
  link(proto, 'iterate', function () {
    var range = this
    var current = null
    var next = this.begin
    return function (inSitu) {
      if (current !== null && inSitu === true) {
        return current
      }
      if (range.step > 0 ? next >= range.end : next <= range.end) {
        return null
      }
      current = next; next += range.step
      return current
    }
  })

  // Identity and Equivalence: to be determined by field values.
  link(proto, ['is', '===', 'equals', '=='], function (another) {
    return this === another || (
      another instanceof Range$ &&
      this.begin === another.begin &&
      this.end === another.end &&
      this.step === another.step
    )
  })
  link(proto, ['is-not', '!==', 'not-equals', '!='], function (another) {
    return this !== another && (
      !(another instanceof Range$) ||
      this.begin !== another.begin ||
      this.end !== another.end ||
      this.step !== another.step
    )
  })

  // override comparison logic to keep consistent with Identity & Equivalence.
  link(proto, 'compare', function (another) {
    return this === another ? 0
      : !(another instanceof Range$) || this.step !== another.step ? null
        : this.step > 0
          ? this.begin < another.begin
            ? this.end >= another.end ? 1 : null
            : this.begin === another.begin
              ? this.end < another.end ? -1
                : this.end === another.end ? 0 : 1
              : this.end <= another.end ? -1 : null
          : this.begin > another.begin
            ? this.end <= another.end ? 1 : null
            : this.begin === another.begin
              ? this.end > another.end ? -1
                : this.end === another.end ? 0 : 1
              : this.end >= another.end ? -1 : null
  })

  // range is empty if it cannot iterate at least once.
  link(proto, 'is-empty', function () {
    return this.step > 0 ? this.begin >= this.end : this.begin <= this.end
  })
  link(proto, 'not-empty', function () {
    return this.step > 0 ? this.begin < this.end : this.begin > this.end
  })

  // Representation
  link(proto, 'to-string', function () {
    return '(' + [this.begin, this.end, this.step].join(' ') + ')'
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}


/***/ }),

/***/ "./sugly/generic/string.js":
/*!*********************************!*\
  !*** ./sugly/generic/string.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Type = $.string
  var link = $void.link
  var Symbol$ = $void.Symbol
  var thisCall = $void.thisCall
  var protoValueOf = $void.protoValueOf
  var defineTypeProperty = $void.defineTypeProperty

  // the empty value
  link(Type, 'empty', '')

  // generate a string from inputs.
  link(Type, 'of', function (value) {
    // return the empty value without an argument.
    if (typeof value === 'undefined') {
      return ''
    }
    // concat the trimed values of strings and to-string results of non-strings.
    var result = []
    for (var i = 0; i < arguments.length; i++) {
      var str = arguments[i]
      if (typeof str !== 'string') {
        str = thisCall(str, 'to-string')
        if (typeof str !== 'string') {
          str = ''
        }
      }
      if (str) {
        result.push(str)
      }
    }
    return result.join('')
  }, true)

  // generate a string from a series of unicode values
  link(Type, 'of-chars', function () {
    return String.fromCharCode.apply(String, arguments)
  }, true)

  // generate the source code string for any value.
  link(Type, 'of-code', function (value) {
    return typeof value === 'undefined' ? ''
      : thisCall(thisCall(value, 'to-code'), 'to-string')
  }, true)

  var proto = Type.proto
  // return the length of this string.
  link(proto, 'length', function () {
    return this.length
  })

  // Searching
  // retrieve the first char.
  link(proto, 'first', function (count) {
    return typeof count === 'undefined'
      ? this.length > 0 ? this.charAt(0) : null
      : this.substr(0, count >> 0)
  })
  // try to find the index of the first occurence of value.
  link(proto, 'first-of', function (value, from) {
    from >>= 0
    return this.indexOf(value, from < 0 ? from + this.length : from)
  })
  // retrieve the last char.
  link(proto, 'last', function (count) {
    return typeof count === 'undefined'
      ? this.length > 0 ? this.charAt(this.length - 1) : null
      : this.substr(Math.max(0, this.length - (count >>= 0)), count)
  })
  // retrieve the last char or the index of the last occurence of value.
  link(proto, 'last-of', function (value, from) {
    return typeof value === 'undefined' ? -1
      : typeof value !== 'string' || !value ? this.length
        : this.lastIndexOf(value,
          (from = typeof from === 'undefined' ? this.length : from >> 0) < 0
            ? from + this.length : from
        )
  })

  link(proto, 'contains', function (str) {
    return typeof str === 'string' && (this.indexOf(str) >= 0)
  })
  link(proto, 'starts-with', function (prefix) {
    return typeof prefix === 'string' && this.startsWith(prefix)
  })
  link(proto, 'ends-with', function (suffix) {
    return typeof suffix === 'string' && this.endsWith(suffix)
  })

  // Converting
  // generate sub-string from this string.
  var copy = link(proto, 'copy', function (begin, count) {
    begin >>= 0
    count = typeof count === 'undefined' ? Infinity : count >> 0
    if (count < 0) {
      begin += count
      count = -count
    }
    if (begin < 0) {
      begin += this.length
      if (begin < 0) {
        count += begin
        begin = 0
      }
    }
    return this.substr(begin, count)
  })
  var slice = link(proto, 'slice', function (begin, end) {
    begin >>= 0
    if (begin < 0) {
      begin += this.length
      if (begin < 0) {
        begin = 0
      }
    }
    end = typeof end === 'undefined' ? this.length : end >> 0
    if (end < 0) {
      end += this.length
      if (end < 0) {
        end = 0
      }
    }
    return this.substr(begin, end - begin)
  })

  link(proto, 'trim', String.prototype.trim)
  link(proto, 'trim-left', String.prototype.trimLeft)
  link(proto, 'trim-right', String.prototype.trimRight)

  link(proto, 'replace', function (value, newValue) {
    return typeof value !== 'string' || !value ? this
      : this.replace(
        new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        typeof newValue === 'string' ? newValue : ''
      )
  })
  link(proto, 'to-upper', function (localed) {
    return localed === true ? this.toLocaleUpperCase() : this.toUpperCase()
  })
  link(proto, 'to-lower', function (localed) {
    return localed === true ? this.toLocaleLowerCase() : this.toLowerCase()
  })

  // combination and splitting of strings
  link(proto, ['concat', '+'], function () {
    var result = this ? [this] : []
    for (var i = 0; i < arguments.length; i++) {
      var str = arguments[i]
      if (typeof str !== 'string') {
        str = $void.thisCall(str, 'to-string')
        if (typeof str !== 'string') {
          str = ''
        }
      }
      if (str) {
        result.push(str)
      }
    }
    return result.join('')
  })
  // the reversed operation of '-':
  // if the argument value is a string, to removes a substring if it's the suffix.
  // if the argument value is a number, to removes a suffix with the length of this number.
  // other argument values will be converted to a string and to be removed as suffix.
  link(proto, '-', function () {
    if (this.length < 1 || arguments.length < 1) {
      return this
    }
    var result = this
    for (var i = arguments.length - 1; i >= 0; i--) {
      var value = arguments[i]
      if (typeof value === 'string') {
        if (result.endsWith(value)) {
          result = result.substring(0, result.length - value.length)
        }
      } else if (typeof value === 'number') {
        result = result.substring(0, result.length - value)
      } else {
        value = thisCall(value, 'to-string')
        if (typeof value !== 'string') {
          value = ''
        }
        if (value && result.endsWith(value)) {
          result = result.substring(0, result.length - value.length)
        }
      }
    }
    return result
  })
  link(proto, 'split', function (value) {
    return typeof value !== 'string' || value.length < 1 ? [this] : this.split(value)
  })

  // get a character's unicode value by its offset in this string.
  link(proto, 'char-at', function (offset) {
    offset >>= 0
    var code = this.charCodeAt(offset < 0 ? offset + this.length : offset)
    return isNaN(code) ? null : code
  })

  // Ordering: override general comparison logic.
  link(proto, 'compare', function (another) {
    return typeof another !== 'string' ? null
      : this === another ? 0 : this > another ? 1 : -1
  })

  // comparing operators
  link(proto, '>', function (another) {
    return typeof another === 'string' ? this > another : null
  })
  link(proto, '>=', function (another) {
    return typeof another === 'string' ? this >= another : null
  })
  link(proto, '<', function (another) {
    return typeof another === 'string' ? this < another : null
  })
  link(proto, '<=', function (another) {
    return typeof another === 'string' ? this <= another : null
  })

  // the emptiness of string is determined by its length.
  link(proto, 'is-empty', function () {
    return this === ''
  })
  link(proto, 'not-empty', function () {
    return this !== ''
  })

  // Representation
  link(proto, 'to-string', function () {
    return JSON.stringify(this)
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key)
        : typeof index !== 'number' ? null
          : arguments.length > 1
            ? slice.apply(this, arguments) // chars in a range.
            : copy.apply(this, [index, 1])
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  defineTypeProperty(String.prototype, Type)
}


/***/ }),

/***/ "./sugly/generic/symbol.js":
/*!*********************************!*\
  !*** ./sugly/generic/symbol.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Type = $.symbol
  var $Tuple = $.tuple
  var $String = $.string
  var Symbol$ = $void.Symbol
  var link = $void.link
  var isSafeName = $void.isSafeName
  var isSafeSymbol = $void.isSafeSymbol
  var escapeSymbol = $void.escapeSymbol
  var protoValueOf = $void.protoValueOf

  var strCompare = $String.proto.compare
  var strToString = $String.proto['to-string']

  // common symbol repository
  var sharedSymbols = $void.sharedSymbols
  var sharedSymbolOf = $void.sharedSymbolOf

  // the empty value.
  var empty = link(Type, 'empty', sharedSymbolOf(''))

  // a sepcial symbol to indicate "etc." or "more" for parser and operator
  link(Type, 'etc', sharedSymbolOf('...'))

  // a sepcial symbol to indicate "all" or "any" for parser and operator
  link(Type, 'all', sharedSymbolOf('*'))
  link(Type, 'any', sharedSymbolOf('?'))

  // symbols for common operators
  link(Type, 'quote', sharedSymbolOf('`'))

  link(Type, 'lambda', sharedSymbolOf('='))
  link(Type, 'stambda', sharedSymbolOf('->'))
  link(Type, 'function', sharedSymbolOf('=>'))
  link(Type, 'operator', sharedSymbolOf('=?'))

  link(Type, 'let', sharedSymbolOf('let'))
  link(Type, 'var', sharedSymbolOf('var'))
  link(Type, 'const', sharedSymbolOf('const'))
  link(Type, 'local', sharedSymbolOf('local'))
  link(Type, 'locon', sharedSymbolOf('locon'))

  // symbols for common punctuations
  link(Type, 'escape', sharedSymbolOf('\\'))
  link(Type, 'begin', sharedSymbolOf('('))
  link(Type, 'end', sharedSymbolOf(')'))
  link(Type, 'comma', sharedSymbolOf(','))
  // period is only special when it's immediately after a ')'.
  link(Type, 'period', sharedSymbolOf('.'))
  link(Type, 'semicolon', sharedSymbolOf(';'))
  link(Type, 'literal', sharedSymbolOf('@'))
  link(Type, 'pairing', sharedSymbolOf(':'))
  link(Type, 'subject', sharedSymbolOf('$'))
  link(Type, 'comment', sharedSymbolOf('#'))

  // create a symbol from a key.
  link(Type, 'of', function (key) {
    return typeof key === 'string'
      ? sharedSymbols[key] || new Symbol$(key)
      : key instanceof Symbol$ ? key : empty
  }, true)

  // create a shared symbol from a key.
  link(Type, 'of-shared', function (key) {
    return typeof key === 'string' ? sharedSymbolOf(key)
      : key instanceof Symbol$ ? sharedSymbolOf(key.key)
        : empty
  }, true)

  // to test if a string is a safe key or a symbol has a safe key.
  link(Type, 'is-safe', function (key, type) {
    return typeof key === 'string'
      ? type === Type ? isSafeSymbol(key) : isSafeName(key)
      : key instanceof Symbol$
        ? type === Type ? isSafeSymbol(key.key) : isSafeName(this.key)
        : false
  }, true)

  var proto = Type.proto
  link(proto, 'key', function () {
    return this.key
  })

  // test if this symbol has a safe key.
  link(proto, 'is-safe', function (type) {
    return type === Type ? isSafeSymbol(this.key) : isSafeName(this.key)
  })
  link(proto, 'is-unsafe', function (type) {
    return type === Type ? !isSafeSymbol(this.key) : !isSafeName(this.key)
  })

  // Identity and Equivalence is determined by the key
  link(proto, ['is', '===', 'equals', '=='], function (another) {
    return this === another || (
      another instanceof Symbol$ && this.key === another.key
    )
  })
  link(proto, ['is-not', '!==', 'not-equals', '!='], function (another) {
    return this !== another && (
      !(another instanceof Symbol$) || this.key !== another.key
    )
  })

  // Ordering: to determine by the string value of key.
  link(proto, 'compare', function (another) {
    return this === another ? 0
      : another instanceof Symbol$
        ? strCompare.call(this.key, another.key)
        : null
  })

  // Emptiness: The empty symbol's key is an empty string.
  link(proto, 'is-empty', function () {
    return this.key === '' || this.key === '\t'
  })
  link(proto, 'not-empty', function () {
    return this.key !== '' && this.key !== '\t'
  })

  // Representation
  link(proto, 'to-string', function (format) {
    switch (format) {
      case $String:
        // result can be either a literal symbol or string, like field name.
        return isSafeSymbol(this.key) ? this.key : strToString.call(this.key)
      case $Tuple:
        // make sure the result can be recover to a symbol.
        return !this.key ? '(`)'
          : isSafeSymbol(this.key) ? '(`' + this.key + ')'
            : '(symbol of ' + strToString.call(this.key) + ')'
      case Type:
        // result can be either a literal symbol or other literal value.
        return isSafeSymbol(this.key) ? this.key : escapeSymbol(this.key)
      default:
        return this.key
    }
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}


/***/ }),

/***/ "./sugly/generic/tuple.js":
/*!********************************!*\
  !*** ./sugly/generic/tuple.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Type = $.tuple
  var $Array = $.array
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Range$ = $void.Range
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf

  // the empty value
  var empty = link(Type, 'empty', new Tuple$([]))
  // the empty value for a plain tuple.
  var blank = link(Type, 'blank', new Tuple$([], true))
  // an unknown structure.
  var unknown = link(Type, 'unknown', new Tuple$([$Symbol.etc]))

  // empty operations
  link(Type, 'lambda', new Tuple$([$Symbol.lambda, empty, blank]))
  link(Type, 'stambda', new Tuple$([$Symbol.stambda, empty, blank]))
  link(Type, 'function', new Tuple$([$Symbol.function, empty, blank]))
  link(Type, 'operator', new Tuple$([$Symbol.operator, empty, blank]))

  // empty objects
  link(Type, 'array', new Tuple$([$Symbol.literal]))
  link(Type, 'object', new Tuple$([$Symbol.literal, $Symbol.pairing]))
  link(Type, 'class', new Tuple$([
    $Symbol.literal, $Symbol.pairing, sharedSymbolOf('class')
  ]))

  // check if the value can be accepted as an element of a tuple.
  link(Type, 'accepts', function (value) {
    return value instanceof Symbol$ ||
      value instanceof Tuple$ ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value instanceof Range$ ||
      value instanceof Date ||
      value === null ||
      typeof value === 'undefined'
  }, true)

  var atomOf = link(Type, 'atom-of', function (value) {
    return value instanceof Symbol$ ||
      value instanceof Tuple$ ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value instanceof Range$ ||
      value instanceof Date ||
      value === null ? value : typeof value === 'undefined' ? null : unknown
  }, true)

  var append = function () {
    var i = this.length
    this.push.apply(this, arguments)
    for (; i < this.length; i++) {
      this[i] = atomOf(this[i])
    }
    return this
  }

  // create a common tuple (statement) of the argument values.
  link(Type, 'of', function () {
    return arguments.length ? new Tuple$(append.apply([], arguments)) : empty
  }, true)

  // create a plain tuple (code block or list of statements) of the argument values
  link(Type, 'of-plain', function () {
    return arguments.length
      ? new Tuple$(append.apply([], arguments), true) : blank
  }, true)

  // create a tuple by elements from the iterable arguments or the argument
  // values itself if it's not iterable.
  link(Type, 'from', function () {
    return merge.apply(empty, arguments)
  }, true)
  link(Type, 'from-plain', function () {
    return merge.apply(blank, arguments)
  }, true)

  var proto = Type.proto
  // the length of this tuple.
  link(proto, 'length', function () {
    return this.$.length
  })

  // the flag of a plain tuple.
  link(proto, 'is-plain', function () {
    return this.plain === true
  })
  link(proto, 'not-plain', function () {
    return this.plain !== true
  })

  // generate a plain tuple.
  link(proto, 'as-plain', function () {
    return this.plain === true ? this
      : this.$.length < 1 ? blank : new Tuple$(this.$, true)
  })

  // the source map of this tuple.
  link(proto, 'source-map', function () {
    return this.source
  })

  var array = $Array.proto
  // generate an iterator function to traverse all items.
  link(proto, 'iterate', function () {
    return array.iterate.apply(this.$, arguments)
  })

  // make a new copy with all items or some in a range of (begin, begin + count).
  link(proto, 'copy', function (begin, count) {
    var s = array.copy.apply(this.$, arguments)
    return s && s.length > 0
      ? s.length === this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? blank : empty
  })
  // make a new copy with all items or some in a range of (begin, end).
  link(proto, 'slice', function (begin, end) {
    var s = array.slice.apply(this.$, arguments)
    return s && s.length > 0
      ? s.length === this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? blank : empty
  })

  // retrieve the first n element(s).
  link(proto, 'first', function (count) {
    if (typeof count === 'undefined') {
      return array.first.call(this.$)
    }
    var s = array.first.call(this.$, count >> 0)
    return s && s.length > 0
      ? s.length >= this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? blank : empty
  })
  // find the first occurance of a value.
  link(proto, 'first-of', function (value) {
    return array['first-of'].call(this.$, value)
  })
  // retrieve the last n element(s).
  link(proto, 'last', function (count) {
    if (typeof count === 'undefined') {
      return array.last.call(this.$)
    }
    var s = array.last.call(this.$, count >> 0)
    return s && s.length > 0
      ? s.length >= this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? blank : empty
  })
  // find the last occurance of a value.
  link(proto, 'last-of', function (value) {
    return array['last-of'].call(this.$, value)
  })

  // merge this tuple's items and argument values to create a new one.
  link(proto, 'concat', function () {
    var list = append.apply(this.$.slice(0), arguments)
    return list.length > this.$.length ? new Tuple$(list, this.plain) : this
  })

  // merge this tuple and items from the argument tuples or arrays.
  var merge = link(proto, ['merge', '+'], function () {
    var list = this.$.slice(0)
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (Array.isArray(source)) {
        append.apply(list, array.select.call(source)) // compress discrete array.
      } else if (source instanceof Tuple$) {
        list.push.apply(list, source.$)
      } else {
        list.push(atomOf(source))
      }
    }
    return list.length > this.$.length ? new Tuple$(list, this.plain) : this
  })

  // convert to an array, the items will be left as they're.
  link(proto, 'to-array', function () {
    return this.$.slice(0)
  })

  // Equivalence: to be determined by field values.
  var equals = link(proto, ['equals', '=='], function (another) {
    if (this === another) {
      return true
    }
    if (!(another instanceof Tuple$) ||
      this.plain !== another.plain ||
      this.$.length !== another.$.length) {
      return false
    }
    var t$ = this.$
    var a$ = another.$
    for (var i = t$.length - 1; i >= 0; i--) {
      if (!thisCall(t$[i], 'equals', a$[i])) {
        return false
      }
    }
    return true
  })
  link(proto, ['not-equals', '!='], function (another) {
    return !equals.call(this, another)
  })

  // override comparison logic to keep consistent with Equivalence.
  link(proto, 'compare', function (another) {
    return equals.call(this, another) ? 0 : null
  })

  // Emptiness: an empty tuple has no items.
  link(proto, 'is-empty', function () {
    return !(this.$.length > 0)
  })
  link(proto, 'not-empty', function () {
    return this.$.length > 0
  })

  // expand to a string list as an enclosed expression or a series of expressions.
  var encode = function (list, indent, padding) {
    if (!Array.isArray(list)) {
      list = []
    }
    if (typeof indent !== 'string') {
      indent = '  '
    }
    if (typeof padding !== 'string') {
      padding = ''
    }
    if (this.plain && this.$.length === 1) { // unwrap a container block
      if (list.length > 0) {
        list.push(' ')
      }
      if (this.$[0] instanceof Tuple$) {
        encode.call(this.$[0], list, indent, padding)
      } else {
        list.push(thisCall(this.$[0], 'to-string'))
      }
      return list
    }

    var i, item
    var lineBreak = '\n' + padding
    if (this.plain) {
      for (i = 0; i < this.$.length; i++) {
        list.push(lineBreak)
        item = this.$[i]
        if (item instanceof Tuple$) {
          encode.call(item, list, indent, padding)
        } else {
          list.push(thisCall(item, 'to-string'))
        }
      }
      return list
    }

    list.push('(')
    var first = true
    for (i = 0; i < this.$.length; i++) {
      item = this.$[i]
      if (item instanceof Tuple$) {
        if (item.plain) {
          if (item.$.length > 0) {
            encode.call(item, list, indent, padding + indent)
            item.$.length > 1 && list.push(lineBreak)
          }
        } else {
          first ? (first = false) : list.push(' ')
          encode.call(item, list, indent, padding)
        }
      } else {
        first || item === $Symbol.pairing || (
          i === 2 && list[1] === '@' && list[2] === ':'
        ) ? (first = false) : list.push(' ')
        list.push($void.thisCall(item, 'to-string'))
      }
    }
    list.push(')')
    return list
  }

  // Representation: as an enclosed expression or a plain series of expression.
  link(proto, 'to-string', function (indent, padding) {
    return encode.call(this, [], indent, padding).join('')
  })

  // Indexer
  var indexer = link(proto, ':', function (index, end) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key)
        : typeof index !== 'number' ? null
          : typeof end === 'undefined' ? this.$[index]
            : new Tuple$(array.slice.apply(this.$, arguments), this.plain)
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}


/***/ }),

/***/ "./sugly/generic/type.js":
/*!*******************************!*\
  !*** ./sugly/generic/type.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var Type = $.type
  var $Symbol = $.symbol
  var $Object = $.object
  var Null = $void.null
  var Symbol$ = $void.Symbol
  var link = $void.link
  var bindThis = $void.bindThis
  var isApplicable = $void.isApplicable
  var ownsProperty = $void.ownsProperty
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf

  /* The Supreme Prototype */
  var proto = Type.proto

  // Identity inherits null.
  // Equivalence inherits null.
  // Ordering inherits null.

  // Type Verification: Any non-empty value is an instance of its type.
  link(proto, 'is-a', function (type) {
    return this.type === type
  })
  link(proto, 'is-not-a', function (type) {
    return this.type !== type
  })

  // Emptiness needs to be customized by each type.

  // Encoding inherits null.

  // Representation and Description need be customized by each type.

  // Indexer: default readonly accessor for all types.
  // all value types' protos must provide a customized indexer.
  var indexer = link(proto, ':', function (index) {
    var name = typeof index === 'string' ? index
      : index instanceof Symbol$ ? index.key : ''
    return name === 'proto' ? this.reflect()
      : name !== 'indexer' ? protoValueOf(this, this, name)
        : bindThis(isApplicable(this.empty) ? this.empty() : this.empty,
          this.indexer
        )
  })
  indexer.get = function (key) {
    return key === 'proto' ? this.reflect()
      : key === 'indexer' ? null : this[key]
  }

  // the type is its own empty value.
  link(Type, 'empty', Type)

  // Retrieve the real type of an entity.
  var typeOf = link(Type, 'of', function (entity) {
    var proto
    return entity === null || typeof entity === 'undefined' ? null
      : typeof entity === 'object' && ownsProperty(entity, 'type')
        ? (proto = Object.getPrototypeOf(entity)) === null
          ? $Object : proto.type
        : entity.type
  }, true)

  // Retrieve the indexer for this type's instances.
  link(Type, 'indexer', indexer)

  // Type Reflection: Convert this type to a type descriptor object.
  link(Type, 'reflect', function (entity) {
    var typeDef = $Object.empty()
    var name
    if (this === Type && entity === null) {
      for (name in Null) {
        typeDef[name] = bindThis(null, Null[name])
      }
      typeDef.type = null
      return typeDef
    }

    var proto_ = this.proto
    var value, thisEmpty
    if (typeOf(entity) === this) {
      thisEmpty = entity
    }
    for (name in proto_) {
      if (name !== 'type' && typeof proto[name] === 'undefined') {
        value = proto_[name]
        typeDef[name] = !isApplicable(value) ? value
          : bindThis(typeof thisEmpty !== 'undefined' ? thisEmpty
            : (thisEmpty = isApplicable(this.empty) ? this.empty() : this.empty)
          , value)
      }
    }
    var typeStatic = typeDef.type = $Object.empty()
    for (name in this) {
      if (name !== 'proto' && name !== 'type' && typeof proto[name] === 'undefined') {
        value = this[name]
        typeStatic[name] = !isApplicable(value) ? value
          : bindThis(name !== 'indexer' ? this
            : typeof thisEmpty !== 'undefined' ? thisEmpty
              : (thisEmpty = isApplicable(this.empty) ? this.empty() : this.empty)
          , value)
      }
    }
    return typeDef
  })

  // Mutability
  link(Type, 'seal', function () {
    return this
  })
  link(Type, 'is-sealed', function () {
    return true // all primary types are sealed.
  })

  // Type Verification: Any type is a type.
  link(Type, 'is-a', function (type) {
    return Type === type
  }, true)
  link(Type, 'is-not-a', function (type) {
    return Type !== type
  }, true)

  // Emptiness for types:
  //  The primal type is taken as an empty entity.
  //  Any other type is not empty.
  link(Type, 'is-empty', function () {
    return this === Type
  })
  link(Type, 'not-empty', function () {
    return this !== Type
  })

  // Encoding a type by its name
  link(Type, 'to-code', function () {
    return typeof this.name === 'string'
      ? sharedSymbolOf(this.name) : $Symbol.empty
  })

  // Description for all types
  link(Type, 'to-string', function () {
    return typeof this.name === 'string' ? this.name : ''
  })
}


/***/ }),

/***/ "./sugly/generic/void.js":
/*!*******************************!*\
  !*** ./sugly/generic/void.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function createEmptyOperation () {
  return function () {
    return null
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var $Type = $.type
  var $Tuple = $.tuple
  var $Lambda = $.lambda
  var $Function = $.function
  var $Object = $.object
  var Null = $void.null
  var Tuple$ = $void.Tuple
  var Object$ = $void.Object
  var Symbol$ = $void.Symbol
  var operator = $void.operator
  var ClassType$ = $void.ClassType
  var isApplicable = $void.isApplicable

  // flag indicates if it's running in native host.
  $void.isNativeHost = typeof window === 'undefined'

  // generate an empty function.
  $void.createEmptyOperation = createEmptyOperation

  // a static version of isPrototypeOf.
  var isPrototypeOf = Function.prototype.call.bind(Object.prototype.isPrototypeOf)
  $void.isPrototypeOf = isPrototypeOf

  // a static version of hasOwnProperty.
  var ownsProperty = Function.prototype.call.bind(
    Object.prototype.hasOwnProperty
  )
  $void.ownsProperty = ownsProperty

  // make sure a file uri has correct sugly extension
  $void.appendExt = function (path) {
    return !path || typeof path !== 'string' ? path
      : path.endsWith('.s') || path.endsWith('.sugly') ? path
        : path + '.s'
  }

  // to retrieve or create a shared symbol.
  var sharedSymbols = $void.sharedSymbols = Object.create(null)
  function sharedSymbolOf (key) {
    return sharedSymbols[key] || (sharedSymbols[key] = new Symbol$(key))
  }
  $void.sharedSymbolOf = sharedSymbolOf

  // generic operators cannot be overridden in program. They are interpreted
  // directly in core evaluation function.
  function staticOperator (name, impl) {
    // make the symbol a pure symbol.
    $[name] = sharedSymbolOf(name)
    // export the implementation.
    $void.staticOperators[name] = operator(impl, $Tuple.operator)
    return impl
  }
  $void.staticOperator = staticOperator

  $void.regexNumber = /(^)([-+]?\d*\.\d+|[-+]?\d+\.\d*|[+-]\d+|\d+)/
  $void.regexDecimal = /(^)([-+]?\d*\.\d+|[-+]?\d+\.\d*|[+-]\d+|\d\b|[1-9]\d*)/
  $void.regexPunctuation = /[\\(,)\s]/
  $void.regexSpecialSymbol = /[(`@:$"#)',;\\\s[\]{}]/

  $void.regexConstants = /^(null|true|false)$/
  $void.constantValues = Object.assign(Object.create(null), {
    'null': null,
    'true': true,
    'false': false
  })

  var regexNumber = $void.regexNumber
  var regexConstants = $void.regexConstants
  var regexPunctuation = $void.regexPunctuation
  var regexSpecialSymbol = $void.regexSpecialSymbol

  var isSafeName = $void.isSafeName = function (key) {
    return !!key && !regexSpecialSymbol.test(key) &&
      !regexConstants.test(key) &&
        !regexNumber.test(key)
  }
  $void.isSafeSymbol = function (key) {
    return !!key && !regexPunctuation.test(key) &&
      (!regexSpecialSymbol.test(key) || key.length < 2) &&
        !regexConstants.test(key) &&
          !regexNumber.test(key)
  }
  $void.escapeSymbol = function (key) {
    var chars = []
    for (var i = 0; i < key.length; i++) {
      regexSpecialSymbol.test(key[i]) && chars.push('\\')
      chars.push(key[i])
    }
    return chars.join('')
  }
  $void.encodeFieldName = function (name) {
    return isSafeName(name)
      ? (sharedSymbols[name] || new Symbol$(name)) // print as a symbol.
      : name // print as a literal string.
  }

  // to check if an value is a compatible object.
  $void.isObject = function (obj) {
    return obj instanceof Object$ || (!!obj && obj.type === $Object)
  }

  // retrieve the system indexer of an entity.
  var indexerOf = $void.indexerOf = function (entity) {
    var type = $Type.of(entity)
    return (type && type.indexer) || Null[':']
  }

  // retrieve a field value from prototype; it will be bound to its subject
  // if it's a function.
  var protoValueOf = $void.protoValueOf = function (subject, proto, key) {
    var value = proto[key]
    return typeof value === 'function' && (
      value.type === $Lambda || value.type === $Function
    ) ? bindThis(subject, value) : value
  }

  function thisCall (subject, methodName) {
    var method = indexerOf(subject).call(subject, methodName)
    return typeof method !== 'function' ? method
      : arguments.length < 3 ? method.call(subject)
        : method.apply(subject, Array.prototype.slice.call(arguments, 2))
  }
  $void.thisCall = thisCall

  // try to update the name of a function or a class.
  var tryToUpdateName = $void.tryToUpdateName = function (entity, name) {
    if (typeof entity === 'function') {
      if (!entity.$name) {
        entity.$name = name
      }
    } else if (entity instanceof ClassType$) {
      if (!entity.name) {
        entity.name = name
      }
    }
    return entity
  }

  // to export an entity to a space.
  $void.export = function (space, name, entity) {
    // ensure exported names are shared.
    sharedSymbolOf(name)
    // automatically bind null for static methods
    if (isApplicable(entity)) {
      entity = bindThis(null, entity)
    }
    tryToUpdateName(entity, name)
    if (entity && typeof entity === 'object') {
      entity.seal ? entity.seal() : Object.freeze(entity)
    }
    return (space[name] = entity)
  }

  // create a bound function from the original function or lambda.
  function bindThis ($this, func) {
    if (typeof func.this !== 'undefined') {
      // a this-bound static lambda may not be bound.
      return func
    }
    var binding = func.bind($this)
    binding.this = $this
    binding.bound = func
    typeof func.code !== 'undefined' && (
      binding.code = func.code
    )
    if (typeof func.$name === 'string') {
      binding.$name = func.$name
    }
    if (binding.type !== func.type) {
      binding.type = func.type
    }
    if (func.type === $Lambda && func.static === true) {
      binding.const = true // upgrade static to const lambda
    }
    return binding
  }
  $void.bindThis = bindThis

  // to link an entity to its owner.
  function link (owner, names, entity, autoBind) {
    if (typeof entity === 'function') {
      if (!ownsProperty(entity, 'type')) {
        entity.type = $Lambda
      }
      if (!entity.$name) {
        entity.$name = typeof names === 'string' ? names : names[0]
      }
      if (autoBind && isApplicable(entity)) {
        entity = bindThis(owner, entity)
      }
    }
    if (typeof names === 'string') {
      sharedSymbolOf(names)
      owner[names] = entity
    } else {
      for (var i = 0; i < names.length; i++) {
        sharedSymbolOf(names[i])
        owner[names[i]] = entity
      }
    }
    return entity
  }
  $void.link = link

  // to export native type (static) methods.
  $void.copyType = function (target, src, mapping) {
    var names = Object.getOwnPropertyNames(mapping)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      var entity = src[name]
      if (typeof entity === 'function') {
        entity = entity.bind(src)
        entity.type = $Lambda
        entity.$name = mapping[name]
      }
      target[mapping[name]] = entity
    }
    return target
  }

  $void.prepareOperation = function (type, noop, emptyCode) {
    // the empty function
    noop.$name = 'noop'
    var empty = link(type, 'empty', function () {
      return noop
    }, true)

    // a placeholder of function
    link(type, 'of', empty, true)

    var proto = type.proto
    // return operation's name
    link(proto, 'name', function () {
      return this.$name || ''
    })

    // return operation's parameters
    link(proto, 'parameters', function () {
      return (this.code || emptyCode).$[1]
    })

    // return operation's body
    link(proto, 'body', function () {
      return (this.code || emptyCode).$[2]
    })

    // test if the operation is a generic one.
    link(proto, 'is-generic', function () {
      return !(this.code instanceof Tuple$)
    })
    link(proto, 'not-generic', function () {
      return this.code instanceof Tuple$
    })

    // Emptiness: a managed operation without a body.
    link(proto, 'is-empty', function () {
      return this.code instanceof Tuple$ &&
          (this.code.$.length < 3 || this.code.$[2].$.length < 1)
    })
    link(proto, 'not-empty', function () {
      return !(this.code instanceof Tuple$) ||
          (this.code.$.length > 2 && this.code.$[2].$.length > 0)
    })

    // Encoding
    link(proto, 'to-code', function (ctx) {
      return this.code || emptyCode
    })

    // Desccription
    link(proto, 'to-string', function () {
      return (this.code || emptyCode)['to-string']()
    })

    // Indexer
    var indexer = link(proto, ':', function (index) {
      return typeof index === 'string' ? protoValueOf(this, proto, index)
        : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
    })
    indexer.get = function (key) {
      return proto[key]
    }

    // export type indexer.
    link(type, 'indexer', indexer)
  }

  $void.prepareApplicable = function (type, emptyCode) {
    var proto = type.proto

    // test if the lambda/function has been bound to a subject.
    link(proto, 'is-bound', function () {
      return typeof this.bound === 'function'
    })
    link(proto, 'not-bound', function () {
      return typeof this.bound !== 'function'
    })

    // return operation's parameters
    link(proto, 'this', function () {
      return typeof this.bound === 'function' ? this.this : null
    })

    // apply a function and expand arguments from an array.
    link(proto, 'apply', function (subject, args) {
      return typeof subject === 'undefined' ? this.apply(null)
        : Array.isArray(args) ? this.apply(subject, args)
          : typeof args === 'undefined'
            ? this.call(subject)
            : this.call(subject, args)
    })

    link(proto, ['is', '==='], function (another) {
      return typeof another === 'function' && (this === another || (
        typeof this.this !== 'undefined' && (
          this.this === another.this || Object.is(this.this, another.this)
        ) && typeof this.bound !== 'undefined' && this.bound === another.bound
      ))
    })
    link(proto, ['is-not', '!=='], function (another) {
      return typeof another !== 'function' || (this !== another && (
        typeof this.this === 'undefined' || (
          this.this !== another.this && !Object.is(this.this, another.this)
        ) || typeof this.bound === 'undefined' || this.bound !== another.bound
      ))
    })

    link(proto, ['equals', '=='], function (another) {
      return typeof another === 'function' && (
        this === another || this === another.bound || (
          typeof this.bound !== 'undefined' && (
            this.bound === another || this.bound === another.bound
          )
        )
      )
    })
    link(proto, ['not-equals', '!='], function (another) {
      return typeof another !== 'function' || (
        this !== another && this !== another.bound && (
          typeof this.bound === 'undefined' || (
            this.bound !== another && this.bound !== another.bound
          )
        )
      )
    })
  }
}


/***/ }),

/***/ "./sugly/lib/emitter.js":
/*!******************************!*\
  !*** ./sugly/lib/emitter.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function device ($void) {
  var $ = $void.$
  var $Object = $.object
  var Object$ = $void.Object
  var link = $void.link
  var $export = $void.export
  var thisCall = $void.thisCall
  var createClass = $void.createClass
  var isApplicable = $void.isApplicable

  var emitter = createClass()
  var proto = emitter.proto
  link(proto, 'listeners', null)

  // define allowed events for this emitter
  link(proto, 'constructor', function () {
    var listeners = this.listeners = $Object.empty()
    for (var i = 0; i < arguments.length; i++) {
      var event = arguments[i]
      if (typeof event === 'string') {
        listeners[event] = []
      }
    }
  })

  // clear legacy event handler on activation.
  link(proto, 'activator', function () {
    if (!(this.listeners instanceof Object$)) {
      this.listeners = $Object.empty()
      return
    }
    var events = Object.getOwnPropertyNames(this.listeners)
    for (var i = 0; i < events.length; i++) {
      var listeners = this.listeners[events[i]]
      if (Array.isArray(listeners)) {
        for (var j = listeners.length - 1; j >= 0; j--) {
          if (thisCall(listeners[j], 'is-empty')) {
            listeners.splice(j, 1) // remove empty listeners
          }
        }
      }
    }
  })

  // (an-emitter on) queries allowed events.
  // (an-emitter on event) queries all listeners for an event
  // (an-emitter on event listener) registers a listener for the event.
  link(proto, 'on', function (event, listener) {
    if (!(this.listeners instanceof Object$)) {
      return null // invalid emitter instance.
    }
    // query events
    if (typeof event !== 'string') {
      return Object.getOwnPropertyNames(this.listeners)
    }
    // query listeners for an event.
    if (!isApplicable(listener)) {
      return this.listeners[event] || null
    }
    // register an event listener
    var listeners = this.listeners[event]
    if (!Array.isArray(listeners)) {
      return null // invalid emitter instance
    }
    listeners.push(listener)
    return listeners
  })

  // (an-emitter off) clears all listeners for all events.
  // (an-emitter off event) clears all listeners for the event.
  // (an-emitter on event listener) clears a listener for the event.
  link(proto, 'off', function (event, listener) {
    if (!(this.listeners instanceof Object$)) {
      return null
    }
    var i, listeners
    // clear all event listeners.
    if (typeof event !== 'string') {
      var events = Object.getOwnPropertyNames(this.listeners)
      for (i = 0; i < events.length; i++) {
        listeners = this.listeners[events[i]]
        if (Array.isArray(listeners)) {
          listeners.splice(0)
        }
      }
      return events
    }
    // clear listeners for an event.
    listeners = this.listeners[event]
    if (!Array.isArray(listeners)) {
      return null
    }
    if (!isApplicable(listener)) {
      listeners.splice(0)
      return listeners
    }
    // clear a particular listener
    for (i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1)
        break
      }
    }
    return listeners
  })

  link(proto, 'emit', function (event, args) {
    if (!(this.listeners instanceof Object$) || typeof event !== 'string') {
      return null // invalid emitter instance.
    }
    var listeners = this.listeners[event]
    if (!Array.isArray(listeners)) {
      return null // partially invalid emitter instance at least.
    }
    if (typeof args === 'undefined') {
      args = event
    }
    var handled = false
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i]
      if (isApplicable(listener)) {
        if (listener(args, this, event) === true) {
          return true // event has been handled at least once.
        }
        handled = true
      }
    }
    return handled // no listener to handle this event.
  })

  $export($, 'emitter', emitter)
}


/***/ }),

/***/ "./sugly/lib/format.js":
/*!*****************************!*\
  !*** ./sugly/lib/format.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function parseOffset (str, length) {
  var value
  try {
    value = parseInt(str)
  } catch (e) {
    return e
  }
  if (value < 0) {
    value += length
    if (value < 0) {
      value = length
    }
  } else if (value >= length) {
    value = length
  }
  return value
}

function formatValue (cache, offset, rawValue, fmt, thisCall) {
  if (offset >= cache.length) {
    return '...'
  }
  var value = cache[offset]
  var map
  if (value) {
    if (typeof fmt !== 'string' || typeof rawValue === 'string') {
      return value[0] !== null ? value[0] : (
        value[0] = typeof rawValue === 'string' ? rawValue
          : thisCall(rawValue, 'to-string')
      )
    }
    map = value[1] || (value[1] = Object.create(null))
    return (map[fmt] || (map[fmt] = thisCall(rawValue, 'to-string', fmt)))
  }
  value = cache[offset] = [null, null]
  if (typeof fmt !== 'string' || typeof rawValue === 'string') {
    return (value[0] = typeof rawValue === 'string' ? rawValue
      : thisCall(rawValue, 'to-string'))
  }
  map = value[1] = Object.create(null)
  return (map[fmt] = thisCall(rawValue, 'to-string', fmt))
}

module.exports = function ($void) {
  var $ = $void.$
  var warn = $void.$warn
  var link = $void.link
  var thisCall = $void.thisCall

  link($.string, 'unescape', function (source) {
    if (typeof source !== 'string') {
      warn('string:unescape', 'a string source should be a string.',
        '\n', source)
      return null
    }
    if (!source.startsWith('"')) {
      warn('string:unescape', 'a string source should start with a \'"\'.',
        '\n', source)
      return source
    }
    if (!source.endsWith('"')) {
      warn('string:unescape', 'a string source should end with a \'"\'.',
        '\n', source)
      return source
    }
    var value, error
    try {
      // TODO: to be replaced a to native unescape processor.
      value = JSON.parse(source)
    } catch (err) {
      error = err
    }
    if (typeof value === 'string') {
      return value
    }
    warn('string:unescape', '[JSON] invalid string input: ',
      (error && error.message) || 'unknow error.', '\n', source)
    return source.substring(1, source.length - 1)
  }, true)

  link($.string, 'format', function (pattern) {
    if (typeof pattern !== 'string') {
      warn('string:format', 'the pattern must be a string.', pattern)
      return null
    }
    var args = []
    if (arguments.length > 1) {
      args[arguments.length - 2] = undefined
    }
    var values = []
    var i = 0
    var counter = 0
    var c, end, placeholder, offset, fmt
    while (i < pattern.length) {
      c = pattern[i++]
      if (c !== '{') {
        values.push(c); continue
      }
      if (pattern[i] === '{') {
        values.push('{'); i++; continue
      }
      end = pattern.indexOf('}', i)
      if (end < i) {
        end = pattern.length
        warn('string:format', 'missing an ending "}".', pattern, i)
      }
      placeholder = pattern.substring(i, end)
      i = end + 1
      end = placeholder.indexOf(':')
      if (end < 0) {
        end = placeholder.length
      }
      offset = placeholder.substring(0, end)
      if (offset) {
        offset = parseOffset(offset, args.length)
      } else if (counter >= args.length) {
        // replace missing implicit placeholder to empty.
        counter++; continue
      } else {
        offset = counter
      }
      if (typeof offset !== 'number') {
        warn('string:format', 'invalid offset value gets ingored',
          pattern, i, placeholder.substring(0, end))
        offset = counter
      } else if (offset >= args.length) {
        warn('string:format', 'offset value is out of range',
          pattern, offset, args.length - 1)
      }
      fmt = end < placeholder.length ? placeholder.substring(end + 1) : null
      values.push(formatValue(args, offset, arguments[offset + 1], fmt, thisCall))
      counter++
    }
    return values.join('')
  }, true)

  $void.formatPattern = function (pattern) {
    if (pattern.indexOf('$') < 0) {
      return [pattern]
    }
    var expr = ''
    var format = []
    var escaping = ''
    var depth = 0
    var args = []
    var pushExpr = function (ending) {
      format.push('{' + args.length + '}')
      args.push(ending ? expr + ending : expr)
      expr = ''; escaping = ''; depth = 0
    }
    var endExpr = function (ending) {
      switch (escaping) {
        case '$':
          if (expr.length > 0) {
            pushExpr()
          } else {
            format.push('$'); escaping = ''
          }
          break
        case ' ':
          pushExpr()
          break
        case '(':
          pushExpr(ending)
          ending !== ')' && warn(
            'format:pattern', 'missing ending parenthesis.', expr
          )
          break
        default:
          break
      }
    }
    for (var i = 0; i < pattern.length; i++) {
      var c = pattern[i]
      switch (escaping) {
        case '$':
          switch (c) {
            case '$':
              format.push('$'); escaping = ''
              break
            case '(':
              if (expr.length > 0) {
                endExpr(); format.push('(')
              } else {
                expr += '('; escaping = '('; depth = 1
              }
              break
            default:
              if (/\)|\s/.test(c)) {
                endExpr(); format.push(c)
              } else {
                expr += c; escaping = ' '
              }
              break
          }
          break
        case ' ':
          if (c === '$') {
            endExpr(); escaping = '$'
          } else if (/\(|\)|\s/.test(c)) {
            endExpr(); format.push(c)
          } else {
            expr += c
          }
          break
        case '(':
          if (c === ')') {
            if (--depth > 0) {
              expr += c
            } else {
              endExpr(')')
            }
          } else {
            if (c === '(') {
              depth += 1
            }
            expr += c
          }
          break
        default:
          c === '$' ? escaping = '$' : format.push(c)
          break
      }
    }
    endExpr()
    return [format.join('')].concat(args)
  }
}


/***/ }),

/***/ "./sugly/lib/json.js":
/*!***************************!*\
  !*** ./sugly/lib/json.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var $Object = $.object
  var link = $void.link
  var $export = $void.export

  var json = $Object.empty()
  link(json, 'of', function (value, defaultJson) {
    if (typeof value === 'undefined') {
      return 'null'
    }
    if (typeof defaultJson === 'undefined') {
      return JSON.stringify(value)
    }
    try {
      return JSON.stringify(value)
    } catch (err) {
      return defaultJson
    }
  })

  link(json, 'parse', function (json, defaultValue) {
    if (typeof json !== 'string') {
      return typeof defaultValue === 'undefined' ? null : defaultValue
    }
    if (typeof defaultValue === 'undefined') {
      return JSON.parse(json)
    }
    try {
      return JSON.parse(json)
    } catch (err) {
      return defaultValue
    }
  })

  $export($, 'json', json)
}


/***/ }),

/***/ "./sugly/lib/math.js":
/*!***************************!*\
  !*** ./sugly/lib/math.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isFirefox = (typeof window !== 'undefined') &&
  (typeof firefox !== 'undefined' || navigator.userAgent.indexOf('Firefox/') > 0)

module.exports = function ($void) {
  var $ = $void.$
  var link = $void.link
  var $export = $void.export
  var thisCall = $void.thisCall
  var copyType = $void.copyType

  var math = copyType($.object.empty(), Math, {
    'E': 'e',
    'PI': 'pi',
    'LN2': 'ln2',
    'LN10': 'ln10',
    'LOG10E': 'log-e',
    'LOG2E': 'log2-e',
    'SQRT2': 'sqrt-2',
    'SQRT1_2': 'sqrt-1/2',

    'sin': 'sin',
    'cos': 'cos',
    'tan': 'tan',
    'asin': 'asin',
    'acos': 'acos',
    'atan': 'atan',
    'atan2': 'atan2',

    'exp': 'exp',
    'pow': 'pow',
    'log': 'ln',
    'log10': 'log',
    'log2': 'log2',
    'sqrt': 'sqrt',

    'abs': 'abs',
    'max': 'max',
    'min': 'min',

    'random': 'random'
  })

  // hotfix for Firefox, in which Math.exp(1) does not returns Math.E.
  isFirefox && link(math, 'exp', function exp (x) {
    return x === 1 ? Math.E : Math.exp(x)
  }, true)

  $export($, 'math', math)

  $export($, 'max', function (x, y) {
    switch (arguments.length) {
      case 0:
        return null
      case 1:
        return x
      case 2:
        return x === null || typeof x === 'undefined' ? y
          : thisCall(x, 'compare', y) === -1 ? y : x
      default:
        break
    }
    for (var i = 1; i < arguments.length; i++) {
      y = arguments[i]
      if (y !== null && typeof y !== 'undefined') {
        if (x === null || typeof x === 'undefined' ||
          thisCall(y, 'compare', x) === 1) {
          x = y
        }
      }
    }
    return x
  })

  $export($, 'min', function (x, y) {
    switch (arguments.length) {
      case 0:
        return null
      case 1:
        return x
      case 2:
        return x === null || typeof x === 'undefined' ? y
          : thisCall(x, 'compare', y) === 1 ? y : x
      default:
        break
    }
    for (var i = 1; i < arguments.length; i++) {
      y = arguments[i]
      if (y !== null && typeof y !== 'undefined') {
        if (x === null || typeof x === 'undefined' ||
          thisCall(y, 'compare', x) === -1) {
          x = y
        }
      }
    }
    return x
  })
}


/***/ }),

/***/ "./sugly/lib/stdout.js":
/*!*****************************!*\
  !*** ./sugly/lib/stdout.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void, stdout) {
  var Symbol$ = $void.Symbol
  var $export = $void.export
  var staticOperator = $void.staticOperator

  // standard output.
  $export($void, '$print', function (value) {
    return stdout.print.apply(stdout, arguments)
  })

  // standard output.
  $export($void, '$printf', function (value, format) {
    return stdout.printf(
      typeof value === 'undefined' ? '' : value,
      typeof format === 'undefined' ? null : format
    )
  })

  // standard error, but only warning exists in sugly space.
  var lastWarning = null // save to make it testable.
  function generateWarningId () {
    var ts = Date.now()
    return !lastWarning || ts !== lastWarning[1][0] ? [ts, 0]
      : [ts, lastWarning[1][1] + 1]
  }

  $export($void, '$warn', function (category) {
    if (typeof category === 'undefined') {
      return lastWarning
    }

    if (typeof category !== 'string' && category !== null) {
      lastWarning = ['stdout:warn', generateWarningId(),
        'category should be a string:', category
      ]
    } else if (category) { // clear warning
      lastWarning = [category, generateWarningId()]
        .concat(Array.prototype.slice.call(arguments, 1))
    } else {
      return (lastWarning = ['', generateWarningId()])
    }
    stdout.warn.apply(stdout, lastWarning)
    return lastWarning
  })

  var evaluate = function (clause, space) {
    evaluate = $void.evaluate
    return evaluate(clause, space)
  }
  var env = function (name) {
    env = $void.env
    return env(name)
  }

  staticOperator('debug', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2 || !space.app) {
      return null
    }
    var args = [clause, '\n ']
    for (var i = 1; i < clist.length; i++) {
      (i > 1) && args.push('\n ')
      args.push(clist[i], '=', evaluate(clist[i], space))
    }
    if (env('is-debugging') === true) {
      stdout.debug.apply(stdout, args)
    } else if ($void.env('logging-level') >= 2) {
      lastWarning = ['stdout:debug',
        '(debug ...) is only for temporary usage in coding.',
        'Please consider to remove it or replace it with (log d ...) for',
        clause
      ]
      stdout.warn.apply(stdout, lastWarning)
    }
    return args[args.length - 1]
  })

  staticOperator('log', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2 || !space.app) {
      return false
    }
    var log = normalizeLevel(clist[1])
    if (log === null) {
      return false
    } else if (!log) {
      lastWarning = ['stdout:log', 'invalid log level (v/i/w/e/d):',
        clist[1], 'in clause', clause
      ]
      stdout.warn.apply(stdout, lastWarning)
      return false
    }

    var args = []
    for (var i = 2; i < clist.length; i++) {
      args.push(evaluate(clist[i], space))
    }
    log.apply(stdout, args)
    return true
  })

  function normalizeLevel (type) {
    if (type instanceof Symbol$) {
      type = type.key
    } else if (typeof type !== 'string') {
      return false
    }

    switch (type.toLowerCase()) {
      case 'd':
      case 'debug':
        return $void.env('is-debugging') === true ? stdout.debug : null
      case 'v':
      case 'verbose':
        return $void.env('logging-level') >= 4 ? stdout.verbose : null
      case 'i':
      case 'info':
        return $void.env('logging-level') >= 3 ? stdout.info : null
      case 'w':
      case 'warn':
      case 'warning':
        return $void.env('logging-level') >= 2 ? stdout.warn : null
      case 'e':
      case 'err':
      case 'error':
        return $void.env('logging-level') >= 1 ? stdout.error : null
      default:
        return false
    }
  }
}


/***/ }),

/***/ "./sugly/lib/timer.js":
/*!****************************!*\
  !*** ./sugly/lib/timer.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Started = 'started'
var Elapsed = 'elapsed'
var Stopped = 'stopped'
var DefaultInterval = 1000

function safeDelayOf (milliseconds, defaultValue) {
  return typeof milliseconds !== 'number' ? (defaultValue || 0)
    : (milliseconds >>= 0) <= 0 ? (defaultValue || 0)
      : milliseconds
}

module.exports = function timer ($void) {
  var $ = $void.$
  var $Emitter = $.emitter
  var promiseOf = $.promise.of
  var link = $void.link
  var $export = $void.export
  var createClass = $void.createClass
  var isApplicable = $void.isApplicable
  var ownsProperty = $void.ownsProperty

  // a timer is an emitter.
  var timer = createClass().as($Emitter)

  link(timer, 'timeout', function (milliseconds, callback) {
    if (isApplicable(milliseconds)) {
      callback = milliseconds
      milliseconds = 0
    } else {
      milliseconds = safeDelayOf(milliseconds)
      if (!isApplicable(callback)) {
        return milliseconds
      }
    }
    // a simple non-cancellable timeout.
    setTimeout(callback.bind(null, milliseconds), milliseconds)
    return milliseconds
  })

  link(timer, 'countdown', function (milliseconds) {
    milliseconds = safeDelayOf(milliseconds)
    // a cancellable promise-based timeout.
    return promiseOf(function (async) {
      var id = setTimeout(function () {
        if (id !== null) {
          id = null
          async.resolve(milliseconds)
        }
      }, milliseconds)
      return function cancel () {
        if (id !== null) {
          clearTimeout(id)
          id = null
          async.reject(milliseconds)
        }
        return milliseconds
      }
    })
  })

  var proto = timer.proto
  link(proto, 'constructor', function (interval, listener) {
    // call super constructor
    $Emitter.proto.constructor.call(this, Started, Elapsed, Stopped)
    // apply local constructor logic
    this.interval = safeDelayOf(interval, DefaultInterval)
    if (isApplicable(listener)) {
      this.on(Elapsed, listener)
    }
  })

  link(proto, 'activator', function () {
    // call super activator
    $Emitter.proto.activator.apply(this, arguments)

    // apply local activator logic
    this.interval = safeDelayOf(this.interval, DefaultInterval)

    // trying to fix corrupted fields
    var listeners = this.listeners
    var fix = function (event) {
      if (!Array.isArray(listeners[event])) {
        listeners[event] = []
      }
    }
    fix(Started); fix(Elapsed); fix(Stopped)
    if (ownsProperty.call(this, 'stop')) {
      delete this.stop
    }
  })

  link(proto, 'start', function (args) {
    if (this.stop !== stop) {
      return this // the timer is active already.
    }
    if (typeof args === 'undefined') {
      args = this.interval
    }
    // create inner timer.
    var id = setInterval(function () {
      this.emit(Elapsed, args)
    }.bind(this), this.interval)
    // construct the stop function to wrap the native timer.
    this.stop = function () {
      if (id !== null) {
        clearInterval(id)
        id = null
        this.emit(Stopped, args)
      }
    }.bind(this)
    // raise the started event after stop function is ready.
    this.emit(Started, args)
    return this
  })

  link(proto, 'is-elapsing', function () {
    return this.stop !== stop
  })

  var stop = link(proto, 'stop', function () {
    // make this method overridable by an instance method.
    if (this.stop !== stop && isApplicable(this.stop)) {
      this.stop()
      delete this.stop
    }
    return this
  })

  $export($void, '$timer', timer)
}


/***/ }),

/***/ "./sugly/lib/uri.js":
/*!**************************!*\
  !*** ./sugly/lib/uri.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var $Object = $.object
  var link = $void.link
  var $export = $void.export

  var uri = $Object.empty()
  link(uri, 'encode', function (str) {
    return typeof str !== 'string' ? null : encodeURI(str)
  })

  link(uri, 'decode', function (str, defaultValue) {
    if (typeof str !== 'string') {
      return typeof defaultValue === 'undefined' ? null : defaultValue
    }
    if (typeof defaultValue === 'undefined') {
      return decodeURI(str)
    }
    try {
      return decodeURI(str)
    } catch (err) {
      return defaultValue
    }
  })

  link(uri, 'escape', function (str) {
    return typeof str !== 'string' ? null : encodeURIComponent(str)
  })

  link(uri, 'unescape', function (str, defaultValue) {
    if (typeof str !== 'string') {
      return typeof defaultValue === 'undefined' ? null : defaultValue
    }
    if (typeof defaultValue === 'undefined') {
      return decodeURIComponent(str)
    }
    try {
      return decodeURIComponent(str)
    } catch (err) {
      return defaultValue
    }
  })

  $export($, 'uri', uri)
}


/***/ }),

/***/ "./sugly/operators/arithmetic.js":
/*!***************************************!*\
  !*** ./sugly/operators/arithmetic.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function arithmetic ($void) {
  var $ = $void.$
  var $Number = $.number
  var mod = $Number.proto['%']
  var link = $void.link
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var operator = $void.operator
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  staticOperator('++', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) {
      return 1
    }
    var sym = clist[1]
    if (sym instanceof Symbol$) { // (++ symbol)
      var value = space.resolve(sym.key)
      return space.let(sym.key, typeof value === 'number' ? value + 1 : 1)
    }
    // as a normal plus-one operation
    sym = evaluate(sym, space)
    return typeof sym === 'number' ? sym + 1 : 1
  })

  staticOperator('--', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) {
      return -1
    }
    var sym = clist[1]
    if (sym instanceof Symbol$) { // (-- symbol)
      var value = space.resolve(sym.key)
      return space.let(sym.key, typeof value === 'number' ? value - 1 : -1)
    }
    // as a normal minus-one operation
    sym = evaluate(sym, space)
    return typeof sym === 'number' ? sym - 1 : -1
  })

  // increment a value by one and assign it back to the same variable
  link($Number.proto, '++', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'number' || !clause || !clause.$ || !clause.$.length) {
      that = 0
    }
    var sym = clause.$[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that + 1)
    }
    return that
  }))

  // increment a value by one and assign it back to the same variable
  link($Number.proto, '--', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'number' || !clause || !clause.$ || !clause.$.length) {
      that = 0
    }
    var sym = clause.$[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that - 1)
    }
    return that
  }))

  // (num += num ... )
  link($Number.proto, '+=', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'number') {
      that = 0
    }
    var clist = clause.$ && clause.$.length ? clause.$ : []
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'number') {
        that += value
      }
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // (num -= num ... )
  link($Number.proto, '-=', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'number') {
      that = 0
    }
    var clist = clause.$ && clause.$.length ? clause.$ : []
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'number') {
        that -= value
      }
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // (num *= num ... )
  link($Number.proto, '*=', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'number') {
      that = 0
    }
    var clist = clause.$ && clause.$.length ? clause.$ : []
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'number') {
        that *= value
      }
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // (num /= num ...)
  link($Number.proto, '/=', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'number') {
      that = 0
    }
    var clist = clause.$ && clause.$.length ? clause.$ : []
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'number') {
        that /= value
      }
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // (num %= num ...)
  link($Number.proto, '%=', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'number') {
      that = 0
    }
    var clist = clause.$ && clause.$.length ? clause.$ : []
    if (clist.length > 2) {
      that = mod.call(that, evaluate(clist[2], space))
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))
}


/***/ }),

/***/ "./sugly/operators/assignment.js":
/*!***************************************!*\
  !*** ./sugly/operators/assignment.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function assignment ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var symbolAll = $Symbol.all
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator
  var tryToUpdateName = $void.tryToUpdateName

  // 'export' update the variable in most recent context.
  // in function: (export var-name value)), or
  //              (export * object), or
  //              (export (field-name ...) object), or
  //              (export (var-name ...) values)
  // in operator: (export name-expr value-expr)
  staticOperator('export', createOperatorFor('export'))

  // 'var' explicitly declares a local variable in current function's context.
  // in function: (var var-name value)), or
  //              (var * object), or
  //              (var (field-name ...) object), or
  //              (var (var-name ...) values)
  // in operator: (var name-expr value-expr)
  staticOperator('var', createOperatorFor('var'))

  // the once-assignment variable.
  staticOperator('const', createOperatorFor('const'))

  // 'let' update the variable in most recent context.
  // in function: (let var-name value)), or
  //              (let * object), or
  //              (let (field-name ...) object), or
  //              (let (var-name ...) values)
  // in operator: (let name-expr value-expr)
  staticOperator('let', createOperatorFor('let'))

  // 'local' explicitly declares a context variable in and only in current function's context.
  // in function: (local var-name value)), or
  //              (local * object), or
  //              (local (field-name ...) object), or
  //              (local (var-name ...) values)
  // in operator: (local name-expr value-expr)
  staticOperator('local', createOperatorFor('lvar'))

  // the local version of once-assignment variable.
  staticOperator('locon', createOperatorFor('lconst'))

  function createOperatorFor (method) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        return null
      }
      var sym = clist[1]
      var values = length < 3 ? null : evaluate(clist[2], space)
      if (space.inop && clause.inop) { // in operator context, let & var works like a function
        sym = evaluate(sym, space)
        var key = typeof sym === 'string' ? sym
          : sym instanceof Symbol$ ? sym.key : null
        return !key ? null
          : space[method](key, tryToUpdateName(values, key))
      }
      var i, names, name, value
      // (var symbol value)
      if (sym instanceof Symbol$) {
        if (sym !== symbolAll) {
          return space[method](sym.key, tryToUpdateName(values, sym.key))
        }
        // (var * obj)
        if (values instanceof Object$) {
          names = Object.getOwnPropertyNames(values)
          for (i = 0; i < names.length; i++) {
            name = names[i]
            value = values[name]
            space[method](name, space.var(name,
              typeof value === 'undefined' ? null : value
            ))
          }
          return values
        }
        return null
      }
      if (!(sym instanceof Tuple$) || sym.$.length < 1) {
        return null // unrecognized pattern
      }
      // (var (symbol ...) value-or-values).
      var syms = sym.$
      if (Array.isArray(values)) { // assign the value one by one.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            space[method](syms[i].key, i < values.length ? values[i] : null)
          }
        }
      } else if (values instanceof Object$) { // read fields into an array.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            name = syms[i].key
            value = values[name]
            space[method](name, typeof value === 'undefined' ? null : value)
          }
        }
      } else { // assign all symbols the same value.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            space[method](syms[i].key, values)
          }
        }
      }
      return values
    }
  }
}


/***/ }),

/***/ "./sugly/operators/bitwise.js":
/*!************************************!*\
  !*** ./sugly/operators/bitwise.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bitwise ($void) {
  var $ = $void.$
  var $Number = $.number
  var link = $void.link
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var operator = $void.operator
  var staticOperator = $void.staticOperator

  staticOperator('~', function (space, clause) {
    if (clause.$.length > 1) {
      var value = evaluate(clause.$[1], space)
      return typeof value === 'number' ? ~value : ~0
    }
    return ~0
  })

  // bitwise AND and assign it back to the same variable
  link($Number.proto, '&=', operator(function (space, clause, that) {
    var clist = clause.$
    if (typeof that !== 'number' || clist.length < 3) {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var value = evaluate(clist[2], space)
    that &= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise OR and assign it back to the same variable
  link($Number.proto, '|=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var value = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that |= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise XOR and assign it back to the same variable
  link($Number.proto, '^=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var value = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that ^= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise left-shift and assign it back to the same variable
  link($Number.proto, '<<=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var offset = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that <<= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise right-shift and assign it back to the same variable
  link($Number.proto, '>>=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var offset = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that >>= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise zero-fill right-shift and assign it back to the same variable
  link($Number.proto, '>>>=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var offset = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that >>>= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))
}


/***/ }),

/***/ "./sugly/operators/control.js":
/*!************************************!*\
  !*** ./sugly/operators/control.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function control ($void) {
  var Tuple$ = $void.Tuple
  var Signal$ = $void.Signal
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var signalOf = $void.signalOf
  var iterateOf = $void.iterateOf
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator
  var symbolElse = sharedSymbolOf('else')
  var symbolIn = sharedSymbolOf('in')

  // (? sym) - resolve in global scope or original scope (in operator only).
  // (? cond true-branch false-branch)
  staticOperator('?', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) {
      return null // short circuit - the result will be null anyway.
    }
    var cond = clist[1]
    if (length < 3) {
      return cond instanceof Symbol$ ? space.$resolve(cond.key) : null
    }
    cond = evaluate(cond, space)
    if (typeof cond !== 'undefined' && cond !== null && cond !== 0 && cond !== false) {
      return evaluate(clist[2], space)
    }
    return length > 3 ? evaluate(clist[3], space) : null
  })

  // (if cond true-branch else false-branch)
  staticOperator('if', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 3) {
      return null // short circuit - the result will be null anyway.
    }

    var result, i, expr
    var cond = evaluate(clist[1], space)
    if (typeof cond !== 'undefined' && cond !== null && cond !== 0 && cond !== false) { //
      expr = clist[2]
      if (expr === symbolElse) {
        return null // no true branch.
      }
      // otherwise this expr is always taken as part of the true branch.
      result = evaluate(expr, space)
      for (i = 3; i < length; i++) {
        expr = clist[i]
        if (expr === symbolElse) {
          return result
        }
        result = evaluate(expr, space)
      }
      return result
    }
    // else, cond is false
    // skip true branch
    for (i = 2; i < length; i++) {
      if (clist[i] === symbolElse) {
        break
      }
    }
    if (i >= length) { // no else
      return null // no false branch
    }
    result = null // in case of the else is the ending expression.
    for (i += 1; i < length; i++) {
      result = evaluate(clist[i], space)
    }
    return result
  })

  // break current loop and use the argument(s) as result
  staticOperator('break', signalOf('break'))
  // skip the rest expressions in this round of loop.
  staticOperator('continue', signalOf('continue'))

  function loopTest (space, cond) {
    if (cond instanceof Symbol$) {
      return space.resolve.bind(space, cond.key)
    }
    if (cond instanceof Tuple$) {
      return evaluate.bind(null, cond, space)
    }
    return cond === false || cond === null || cond === 0
  }

  // (while cond ... )
  staticOperator('while', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) {
      return null // no condition
    }

    var test = loopTest(space, clist[1])
    var staticCond = typeof test !== 'function'
    var result = null
    while (true) {
      try {
        if (staticCond) {
          if (test) { return null }
        } else { // break/continue can be used in condition expression.
          var cond = test()
          if (cond === false || typeof cond === 'undefined' || cond === null || cond === 0) {
            break
          }
        }
        for (var i = 2; i < length; i++) {
          result = evaluate(clist[i], space)
        }
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'continue') {
            result = signal.value
            continue
          }
          if (signal.id === 'break') {
            result = signal.value
            break
          }
        }
        throw signal
      }
    }
    return result
  })

  // (for value in iterable body) OR
  // (for (value) in iterable body) OR
  // (for (key value) in iterable body)
  function forEach (space, clause) {
    var clist = clause.$
    var length = clist.length
    // find out vars
    var vars
    var fields = clist[1]
    if (fields instanceof Symbol$) {
      vars = [fields.key]
    } else if (fields instanceof Tuple$) {
      vars = []
      var flist = fields.$
      for (var v = 0; v < flist.length; v++) {
        var field = flist[v]
        if (field instanceof Symbol$) {
          vars.push(field.key)
        }
      }
    } else {
      vars = [] // the value is not being caught.
    }
    // evaluate the iterator
    var next = evaluate(clist[3], space)
    next = iterateOf(next)
    if (!next) {
      return null // no iterator.
    }
    // start to loop
    var result = null
    var values = next()
    while (typeof values !== 'undefined' && values !== null) {
      if (!Array.isArray(values)) {
        values = [values]
      }
      for (var i = 0; i < vars.length; i++) {
        space.var(vars[i], i < values.length ? values[i] : null)
      }
      try {
        for (var j = 4; j < length; j++) {
          result = evaluate(clist[j], space)
        }
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'continue') {
            result = signal.value
            values = next()
            continue
          }
          if (signal.id === 'break') {
            result = signal.value
            break
          }
        }
        throw signal
      }
      values = next()
    }
    return result
  }

  // (for init test incremental body)
  staticOperator('for', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 5) {
      return null // short circuit - no loop body
    }
    // prepare test
    var test = clist[2]
    if (test === symbolIn) {
      return forEach(space, clause)
    }
    test = loopTest(space, test)
    var staticCond = typeof test !== 'function'
    // prepare incremental
    var step = clist[3]
    // execute init expression
    var result = evaluate(clist[1], space)
    var cflag
    while (true) {
      try { // test condition
        cflag = false
        if (staticCond) {
          if (test) { return result }
        } else { // break/continue can be used in condition expression.
          var cond = test()
          if (cond === false || typeof cond === 'undefined' || cond === null || cond === 0) {
            break
          }
        }
        // body
        for (var i = 4; i < length; i++) {
          result = evaluate(clist[i], space)
        }
        // incremental
        cflag = true
        evaluate(step, space)
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'continue') {
            result = signal.value
            if (!cflag) {
              // continue can be used in step and incremental. But it will not
              // trigger incremental again even the loop indeed continues.
              evaluate(step, space)
            }
            continue
          }
          if (signal.id === 'break') {
            result = signal.value
            break
          }
        }
        throw signal
      }
    }
    return result
  })
}


/***/ }),

/***/ "./sugly/operators/fetch.js":
/*!**********************************!*\
  !*** ./sugly/operators/fetch.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function load ($void) {
  var $ = $void.$
  var $Promise = $.promise
  var run = $void.$run
  var warn = $void.$warn
  var Tuple$ = $void.Tuple
  var Promise$ = $void.Promise
  var evaluate = $void.evaluate
  var appendExt = $void.appendExt
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var promiseAll = $Promise.all
  var symbolFetch = sharedSymbolOf('fetch')
  var promiseOfResolved = $Promise['of-resolved']

  // fetch: asychronously load a module from source.
  var operator = staticOperator('fetch', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null // at least one file.
    }
    if (!space.app) {
      warn('fetch', 'invalid without an app context.')
      return null
    }
    var loader = $void.loader
    var dirs = space.local['-module'] ? [loader.dir(space.local['-module'])] : []
    var fetching = fetch.bind(null, loader, dirs)
    var tasks = []
    for (var i = 1; i < clist.length; i++) {
      tasks.push(fetching(evaluate(clist[i], space)))
    }
    return promiseAll(tasks)
  })

  function fetch (loader, dirs, source) {
    if (!source || typeof source !== 'string') {
      warn('fetch', 'invalid resource uri to fetch.', source)
      return promiseOfResolved(source)
    }
    source = appendExt(source)
    if (!loader.isResolved(source)) {
      source = loader.resolve(source, dirs)
      if (typeof source !== 'string') {
        warn('fetch', 'failed to resolve ', source)
        return promiseOfResolved(source)
      }
    }
    return source.endsWith('/@.s')
      ? new Promise$(function (resolve, reject) {
        loader.fetch(source).then(function () {
          var result = run(source)
          if (result instanceof Promise$) {
            result.then(resolve, reject)
          }
        }, reject)
      })
      : loader.fetch(source)
  }

  $void.bindOperatorFetch = function (space) {
    return (space.$fetch = function (uris) {
      var clist = Array.isArray(uris) ? uris.slice()
        : Array.prototype.slice.call(arguments)
      clist.unshift(symbolFetch)
      for (var i = 1; i < clist.length; i++) {
        var uri = clist[i]
        if (!uri || typeof uri !== 'string') {
          warn('$fetch', 'invalid source uri:', uri)
          clist[i] = null
        }
      }
      return operator(space, new Tuple$(clist))
    })
  }
}


/***/ }),

/***/ "./sugly/operators/function.js":
/*!*************************************!*\
  !*** ./sugly/operators/function.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function function_ ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var $Lambda = $.lambda
  var $Function = $.function
  var Tuple$ = $void.Tuple
  var evaluate = $void.evaluate
  var signalOf = $void.signalOf
  var lambdaOf = $void.lambdaOf
  var functionOf = $void.functionOf
  var staticLamdaOf = $void.staticLamdaOf
  var staticOperator = $void.staticOperator

  // create lambda operator
  staticOperator('=', createOperator(lambdaOf, $Lambda.noop))

  // create static lambda (pure function) operator - reserved
  staticOperator('->', createOperator(staticLamdaOf, $Lambda.noop))

  // create function operator
  staticOperator('=>', createOperator(functionOf, $Function.noop))

  // call this function by tail-recursion (elimination)
  staticOperator('redo', signalOf('redo'))

  // leave function or module.
  staticOperator('return', signalOf('return'))

  // request to stop the execution of current module.
  staticOperator('exit', signalOf('exit'))

  // create the implementatio
  function createOperator (funcOf, empty) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        return empty
      }
      var params
      var offset
      if (clist[1] === $Symbol.pairing) {
        offset = 2
      } else if (length > 2 && clist[2] === $Symbol.pairing) {
        params = clist[1]
        offset = 3
      } else {
        return funcOf(space, clause, 1)
      }
      // instant evaluation
      if (length <= (offset + 1)) {
        return null // no body
      }
      var func = funcOf(space, clause, offset)
      if (params instanceof Tuple$) {
        var plist = params.$
        if (plist.length < 1) {
          return func()
        }
        var args = []
        for (var i = 0; i < plist.length; i++) {
          args.push(evaluate(plist[i], space))
        }
        return func.apply(null, args)
      } else if (typeof params === 'undefined') {
        return func()
      } else {
        return func(evaluate(params, space))
      }
    }
  }
}


/***/ }),

/***/ "./sugly/operators/general.js":
/*!************************************!*\
  !*** ./sugly/operators/general.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function general ($void) {
  var $ = $void.$
  var $String = $.string
  var link = $void.link
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var operator = $void.operator
  var thisCall = $void.thisCall
  var evaluate = $void.evaluate
  var numberValueOf = $.number.of
  var staticOperator = $void.staticOperator

  staticOperator('+', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length > 1) {
      var base = evaluate(clist[1], space)
      return typeof base === 'number'
        ? sum(space, base, clist)
        : concat(space, base, clist)
    }
    return 0
  })

  function concat (space, str, clist) {
    var length = clist.length
    if (typeof str !== 'string') {
      str = thisCall(str, 'to-string')
    }
    for (var i = 2; i < length; i++) {
      var value = evaluate(clist[i], space)
      str += typeof value === 'string' ? value : thisCall(value, 'to-string')
    }
    return str
  }

  function sum (space, num, clist) {
    var length = clist.length
    for (var i = 2; i < length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'number') {
        num += value
      } else {
        num += numberValueOf(value)
      }
    }
    return num
  }

  // (str += str ... )
  link($String.proto, '+=', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'string') {
      that = ''
    }
    var clist = clause && clause.$ && clause.$.length ? clause.$ : []
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'string') {
        that += value
      } else {
        that += thisCall(value, 'to-string')
      }
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // (str -= str ... ) or (str -= num)
  link($String.proto, '-=', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof that !== 'string') {
      return null
    }
    if (that.length < 1) {
      return that
    }
    var clist = clause && clause.$ && clause.$.length ? clause.$ : []
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'string') {
        if (that.endsWith(value)) {
          that = that.substring(0, that.length - value.length)
        }
      } else if (typeof value === 'number') {
        that = that.substring(0, that.length - value)
      } else {
        value = thisCall(value, 'to-string')
        if (that.endsWith(value)) {
          that = that.substring(0, that.length - value.length)
        }
      }
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))
}


/***/ }),

/***/ "./sugly/operators/import.js":
/*!***********************************!*\
  !*** ./sugly/operators/import.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function import_ ($void) {
  var $ = $void.$
  var compile = $.compile
  var $Object = $.object
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var warn = $void.$warn
  var execute = $void.execute
  var evaluate = $void.evaluate
  var appendExt = $void.appendExt
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var symbolFrom = sharedSymbolOf('from')
  var symbolImport = sharedSymbolOf('import')

  // import: a module from source.
  //   (import src), or
  //   (import field from module), or
  //   (import (fields ...) from module)
  var operator = staticOperator('import', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    if (!space.app) {
      warn('import', 'invalid without an app context.')
      return null
    }
    var src
    if (clist.length < 4 || clist[2] !== symbolFrom) {
      // look into current space to have the base uri.
      src = importModule(space, space.local['-app'], space.local['-module'],
        evaluate(clist[1], space)
      )
      // clone to protect inner exports object.
      return Object.assign($Object.empty(), src)
    }
    // (import field-or-fields from src)
    src = evaluate(clist[3], space)
    var imported = src instanceof Object$ ? src
      : typeof src !== 'string' ? null
        : importModule(space, space.local['-app'], space.local['-module'], src)
    if (typeof imported !== 'object') {
      return null // importing failed.
    }

    // find out fields
    var fields = clist[1]
    if (fields instanceof Symbol$) {
      return imported[fields.key] // import only a single field.
    }
    if (!(fields instanceof Tuple$)) {
      return null // invalid field descriptor
    }

    var i
    var flist = fields.$
    fields = []
    for (i = 0; i < flist.length; i++) {
      if (flist[i] instanceof Symbol$) {
        fields.push(flist[i].key)
      }
    }
    // import fields into an array.
    var values = []
    for (i = 0; i < fields.length; i++) {
      var value = imported[fields[i]]
      values.push(typeof value === 'undefined' ? null : value)
    }
    return values
  })

  function importModule (space, appUri, moduleUri, source) {
    if (typeof source !== 'string') {
      if (source instanceof Symbol$) {
        source = source.key
      } else {
        warn('import', 'invalid module source:', source)
        return null
      }
    }
    var type
    var offset = source.indexOf('$')
    if (offset >= 0) {
      type = source.substring(0, ++offset)
      source = source.substring(offset)
    }
    // try to locate the source in dirs.
    var uri = type ? source : resolve(appUri, moduleUri, appendExt(source))
    if (!uri) {
      return null
    }
    // look up it in cache.
    var module_ = lookupInCache(space.modules, uri, moduleUri)
    if (module_.status) {
      return module_.exports
    }

    module_.status = 100 // indicate loading
    var exporting = (type ? loadNativeModule : loadModule)(
      space, uri, module_, source, moduleUri
    )
    if (!exporting || exporting === module_.exporting) {
      return module_.exports
    }
    module_.exporting = exporting
    var keys = Object.getOwnPropertyNames(exporting)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      if (!/^[-_]/.test(key)) {
        // only expose public fields.
        // private fields are allowed to support hot-reloading
        module_.exports[key] = exporting[key]
      }
    }
    return module_.exports
  }

  function resolve (appUri, moduleUri, source) {
    var loader = $void.loader
    var isResolved = loader.isResolved(source)
    if (!moduleUri && isResolved) {
      warn('import', "It's forbidden to import a module from an absolute uri.")
      return null
    }
    var dirs = isResolved ? [] : dirsOf(source,
      moduleUri && loader.dir(moduleUri),
      loader.dir(appUri) + '/modules',
      $void.$env('home') + '/modules',
      $void.runtime('home') + '/modules'
    )
    var uri = loader.resolve(source, dirs)
    if (typeof uri === 'string') {
      return uri
    }
    warn('import', 'failed to resolve', source, 'in', dirs)
    return null
  }

  function dirsOf (source, moduleDir, appDir, homeDir, runtimeDir) {
    return moduleDir
      ? source.startsWith('./') || source.startsWith('../')
        ? [ moduleDir ]
        : [ appDir, homeDir, runtimeDir, moduleDir ]
      : [ runtimeDir ] // for dynamic or unknown-source code.
  }

  function lookupInCache (modules, uri, moduleUri) {
    var module = modules[uri]
    if (!module) {
      module = modules[uri] = Object.assign(Object.create(null), {
        status: 0, // loading
        exports: $Object.empty(),
        timestamp: Date.now()
      })
    } else if (module.status === 100) {
      warn('import', 'loop dependency when loading', uri, 'from', moduleUri)
    }
    return module
  }

  function loadModule (space, uri, module_, source, moduleUri) {
    try {
      // try to load file
      var doc = $void.loader.load(uri)
      var text = doc[0]
      if (typeof text !== 'string') {
        module_.status = 415 // unspported media type
        warn('import', 'failed to read', source, 'for', doc[1])
        return null
      }
      // compile text
      var code = compile(text, uri, doc[1])
      if (!(code instanceof Tuple$)) {
        module_.status = 400 //
        warn('import', 'failed to compile', source, 'for', code)
        return null
      }
      // to load module
      var scope = execute(space, code, uri, {
        this: module_.exporting // TODO: reserved to support hot-reloading
      })[1]
      if (scope) {
        // TODO: register monitoring tasks for hot-reloading.
        module_.status = 200
        return scope.exporting
      }
      module_.status = 500
      warn('import', 'failed when executing', code)
    } catch (signal) {
      module_.status = 503
      warn('import', 'invalid call to', signal.id,
        'in', code, 'at', uri, 'from', moduleUri)
    }
    return null
  }

  function loadNativeModule (space, uri, module_, source, moduleUri) {
    try {
      // the native module must export a loader function.
      var importing = $void.require(uri)
      if (typeof importing !== 'function') {
        module_.status = 400
        warn('import', 'invalid native module', source, 'at', uri)
        return null
      }
      var scope = $void.createModuleSpace(uri, space)
      var status = importing.call(
        module_.exporting, // TODO: reserved to support hot reloading.
        scope.exporting, scope.context, $void
      )
      if (status === true) { // the loader can report error details
        // TODO?: register monitoring tasks for hot-reloading.
        module_.status = 200
        return scope.exporting
      }
      module_.status = 500 // internal error
      warn('import', 'failed to import native module of', source,
        'for', status, 'at', uri)
    } catch (err) {
      module_.status = 503 // service unavailable
      warn('import', 'failed to import native module of', source,
        'for', err, 'at', uri, 'from', moduleUri)
    }
    return null
  }

  $void.bindOperatorImport = function (space) {
    return (space.$import = function (uri) {
      if (!uri || typeof uri !== 'string') {
        warn('$import', 'invalid source uri:', uri)
        return null
      }
      return operator(space, new Tuple$([symbolImport, uri]))
    })
  }
}


/***/ }),

/***/ "./sugly/operators/literal.js":
/*!************************************!*\
  !*** ./sugly/operators/literal.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function literal ($void) {
  var $ = $void.$
  var $Class = $.class
  var $Object = $.object
  var $Symbol = $.symbol
  var symbolOf = $Symbol.of
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var ClassType$ = $void.ClassType
  var thisCall = $void.thisCall
  var evaluate = $void.evaluate
  var arraySet = $.array.proto.set
  var staticOperator = $void.staticOperator

  var symbolPairing = $Symbol.pairing
  var symbolAll = $Symbol.all
  var symbolLiteral = $Symbol.literal
  var symbolArray = $Symbol.of('array')
  var symbolObject = $Symbol.of('object')
  var symbolClass = $Symbol.of('class')

  // (@ value ...)
  function arrayCreate (space, clist, offset) {
    var result = []
    var index, value
    while (offset < clist.length) {
      value = evaluate(clist[offset++], space)
      if (offset < clist.length && clist[offset] === symbolPairing) {
        offset += 1
        index = typeof value === 'number' ? value >> 0 : result.length
        arraySet.call(result, index, offset >= clist.length ? null
          : evaluate(clist[offset++], space)
        )
      } else {
        result.push(value)
      }
    }
    return result
  }

  // (@ symbol: value ...)
  function objectCreate (space, clist, type, offset) {
    var obj = type.empty()
    var length = clist.length
    while (offset < length) {
      var name = clist[offset++]
      if (name instanceof Symbol$) {
        name = name.key
      } else if (typeof name !== 'string') {
        if (name instanceof Tuple$) {
          name = evaluate(name, space)
        }
        if (name instanceof Symbol$) {
          name = name.key
        } else if (typeof name !== 'string') {
          name = thisCall(name, 'to-string')
        }
      }
      if (clist[offset] === symbolPairing) {
        obj[name] = ++offset < length ? evaluate(clist[offset++], space) : null
      } else {
        obj[name] = evaluate(symbolOf(name), space)
      }
    }
    // activate a typed object
    var activator = type.proto.activator
    if (typeof activator === 'function') {
      activator.call(obj, obj)
    }
    return obj
  }

  staticOperator('@', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) { // (@)
      return []
    }
    var indicator = clist[1]
    if (indicator !== symbolPairing) {
      return length <= 2 || clist[2] !== symbolPairing ||
          typeof indicator === 'number' || indicator instanceof Tuple$
        ? arrayCreate(space, clist, 1) // (@ ...) or (@ offset: value ...)
        : objectCreate(space, clist, $Object, 1) // (@ name: ...) or (@ "name": ...)
    }
    // (@: ...)
    if (length < 3) { // (@:)
      return Object.create($Object.proto)
    }
    // (@:a-type ...)
    var type = clist[2]
    return type === symbolClass
      ? $Class.of(objectCreate(space, clist, $Object, 3)) // (@:class ...)
      : type === symbolLiteral || type === symbolObject
        ? objectCreate(space, clist, $Object, 3) // (@:@ ...) (@:object ...)
        : type === symbolAll || type === symbolArray
          ? arrayCreate(space, clist, 3) // (@:* ...) (@:array ...)
          : objectCreate(space, clist,
            (type = evaluate(type, space)) instanceof ClassType$
              ? type // (@:a-class ...)
              : $Object, // ingore type and treat it as a common object.
            3)
  })
}


/***/ }),

/***/ "./sugly/operators/load.js":
/*!*********************************!*\
  !*** ./sugly/operators/load.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function load ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var warn = $void.$warn
  var execute = $void.execute
  var evaluate = $void.evaluate
  var appendExt = $void.appendExt
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var symbolLoad = sharedSymbolOf('load')

  // load: a module from source.
  var operator = staticOperator('load', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    if (!space.app) {
      warn('load', 'invalid without an app context.')
      return null
    }
    // look into current space to have the base uri.
    return loadData(space, space.local['-app'], space.local['-module'],
      evaluate(clist[1], space),
      clist.length > 2 ? evaluate(clist[2], space) : null
    )
  })

  function loadData (space, appUri, moduleUri, source, args) {
    if (!source || typeof source !== 'string') {
      warn('load', 'invalid source:', source)
      return null
    }
    // try to locate the sourcevar uri
    var uri = resolve(appUri, moduleUri, appendExt(source))
    if (typeof uri !== 'string') {
      return null
    }
    // try to load file
    var doc = $void.loader.load(uri)
    var text = doc[0]
    if (!text) {
      warn('load', 'failed to load', source, 'for', doc[1])
      return null
    }
    // compile text
    var code = compile(text, uri, doc[1])
    if (!(code instanceof Tuple$)) {
      warn('load', 'compiler warnings:', code)
      return null
    }

    try { // to load data
      var result = execute(space, code, uri,
        Array.isArray(args) ? args.slice() : args)
      var scope = result[1]
      return scope && Object.getOwnPropertyNames(scope.exporting).length > 0
        ? scope.exporting : result[0]
    } catch (signal) {
      warn('load', 'invalid call to', signal.id,
        'in', code, 'from', uri, 'on', moduleUri)
      return null
    }
  }

  function resolve (appUri, moduleUri, source) {
    if (!moduleUri) {
      warn('load', "It's forbidden to load a module", 'from an anonymous module.')
      return null
    }
    var loader = $void.loader
    var dirs = loader.isResolved(source) ? [] : dirsOf(source,
      loader.dir(moduleUri),
      loader.dir(appUri),
      $void.$env('home')
    )
    var uri = loader.resolve(source, dirs)
    if (typeof uri !== 'string') {
      warn('load', 'failed to resolve', source, 'in', dirs)
      return null
    }
    if (uri !== moduleUri) {
      return uri
    }
    warn('load', 'a module,', moduleUri, ', cannot load itself by resolving', source, 'in', dirs)
    return null
  }

  function dirsOf (source, moduleDir, appDir, homeDir) {
    return source.startsWith('./') || source.startsWith('../')
      ? [ moduleDir ]
      : [ moduleDir, appDir, homeDir, $void.runtime('home') ]
  }

  $void.bindOperatorLoad = function (space) {
    return (space.$load = function (uri) {
      if (!uri || typeof uri !== 'string') {
        warn('$load', 'invalid source uri:', uri)
        return null
      }
      return operator(space, new Tuple$([symbolLoad, uri]))
    })
  }
}


/***/ }),

/***/ "./sugly/operators/logical.js":
/*!************************************!*\
  !*** ./sugly/operators/logical.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function logical ($void) {
  var $ = $void.$
  var $Type = $.type
  var Null = $void.null
  var link = $void.link
  var Space$ = $void.Space
  var operator = $void.operator
  var evaluate = $void.evaluate
  var thisCall = $void.thisCall
  var symbolSubject = $.symbol.subject
  var staticOperator = $void.staticOperator

  var not = staticOperator('!', function (space, clause) {
    if (clause.$.length < 2) {
      return false
    }
    var value = evaluate(clause.$[1], space)
    return value === false || value === null || value === 0
  })

  staticOperator('not', not)

  // global logical AND operator
  link(Null, '&&', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return null
    }
    var clist = clause.$
    if (typeof that === 'undefined') {
      return null
    }
    if (that === false || that === null || that === 0) {
      return that
    }
    var value = that
    var i = clist[0] === symbolSubject ? 3 : 2
    for (; i < clist.length; i++) {
      value = evaluate(clist[i], space)
      if (value === false || value === null || value === 0) {
        return value
      }
    }
    return value
  }))

  // global logical OR operator
  link(Null, '||', operator(function (space, clause, that) {
    var clist = clause && clause.$
    if (typeof that === 'undefined') {
      that = null
    }
    if (that !== false && that !== null && that !== 0) {
      return that
    }
    if (!(space instanceof Space$)) {
      return null
    }
    var value = that
    var i = clist[0] === symbolSubject ? 3 : 2
    for (; i < clist.length; i++) {
      value = evaluate(clist[i], space)
      if (value !== false && value !== null && value !== 0) {
        return value
      }
    }
    return value
  }))

  // Boolean Test.
  // (x ?) - booleanize, returns true or false.
  // (x ? y) - boolean fallback, returns x itself or returns y if x is equivalent to false.
  // (x ? y z) - boolean switch, returns y if x is equivalent to true, returns z otherwise.
  link(Null, '?', operator(function (space, clause, that) {
    var clist = clause && clause.$
    if (!clist || !clist.length || clist.length < 2) {
      return null // invalid call
    }
    var base = clist[0] === symbolSubject ? 3 : 2
    if (typeof that !== 'undefined' && that !== false && that !== null && that !== 0) {
      switch (clist.length - base) { // true logic
        case 0:
          return true
        case 1:
          return that
        default:
          return space instanceof Space$ ? evaluate(clist[base], space) : null
      }
    }
    switch (clist.length - base) { // false logic
      case 0:
        return false
      case 1:
        return space instanceof Space$ ? evaluate(clist[base], space) : null
      default:
        return space instanceof Space$ ? evaluate(clist[base + 1], space) : null
    }
  }))

  // Emptiness Test.
  // (x ?*) - booleanized emptiness, returns true or false.
  // x ?* y) - empty fallback, returns x itself or returns y if x is empty.
  // (x ?* y z) - empty switch, returns y if x is not an empty value, returns z otherwise.
  link(Null, '?*', operator(function (space, clause, that) {
    var clist = clause && clause.$
    if (!clist || !clist.length || clist.length < 2) {
      return null // invalid call
    }
    var base = clist[0] === symbolSubject ? 3 : 2
    if (thisCall(that, 'not-empty')) {
      switch (clist.length - base) { // true logic
        case 0:
          return true
        case 1:
          return that
        default:
          return space instanceof Space$ ? evaluate(clist[base], space) : null
      }
    }
    switch (clist.length - base) { // false logic
      case 0:
        return false
      case 1:
        return space instanceof Space$ ? evaluate(clist[base], space) : null
      default:
        return space instanceof Space$ ? evaluate(clist[base + 1], space) : null
    }
  }))

  // Null Fallback
  // (null ?? y z ...) returns the first non-null value after it if x is null.
  link(Null, '??', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return null
    }
    var clist = clause.$
    var i = clist[0] === symbolSubject ? 3 : 2
    for (; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (value !== null) {
        return value
      }
    }
    return null
  }))
  // (non-null ?? ...) return non-null.
  link($Type.proto, '??', operator(function (space, clause, that) {
    return that
  }))
}


/***/ }),

/***/ "./sugly/operators/operator.js":
/*!*************************************!*\
  !*** ./sugly/operators/operator.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function operator ($void) {
  var $ = $void.$
  var $Operator = $.operator
  var operatorOf = $void.operatorOf
  var staticOperator = $void.staticOperator

  // create the operator to define an operator
  staticOperator('=?', function (space, clause) {
    return clause.$.length < 2 ? $Operator.noop : operatorOf(space, clause)
  })
}


/***/ }),

/***/ "./sugly/operators/pattern.js":
/*!************************************!*\
  !*** ./sugly/operators/pattern.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function quote ($void) {
  var staticOperator = $void.staticOperator

  // pseudo explicit subject pattern operator '$'.
  staticOperator('$', function () {
    return null // It's implemented in evaluation function.
  })

  // pseudo explicit operation pattern operator ':'.
  staticOperator(':', function () {
    return null // It's implemented in evaluation function.
  })
}


/***/ }),

/***/ "./sugly/operators/quote.js":
/*!**********************************!*\
  !*** ./sugly/operators/quote.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function quote ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var staticOperator = $void.staticOperator

  // (` symbol), (` value) or (` (...))
  staticOperator('`', function (space, clause) {
    return clause.$.length > 1 ? clause.$[1] : $Symbol.empty
  })

  // (quote symbol-or-value ...)
  staticOperator('quote', function (space, clause) {
    return clause._quoted || (
      clause._quoted = clause.$.length < 2 ? $Tuple.empty
        : new Tuple$(clause.$.slice(1), false, clause.source)
    )
  })

  // (unquote symbol-or-value ...)
  staticOperator('unquote', function (space, clause) {
    return clause._quoted || (
      clause._quoted = clause.$.length < 2 ? $Tuple.blank
        : new Tuple$(clause.$.slice(1), true, clause.source)
    )
  })
}


/***/ }),

/***/ "./sugly/runtime/env.js":
/*!******************************!*\
  !*** ./sugly/runtime/env.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function runtime ($void) {
  var $ = $void.$
  var $export = $void.export
  var emptyObject = $.object.empty

  var environment = Object.assign(Object.create(null), {
    'runtime-core': 'js',
    'runtime-host': $void.isNativeHost ? 'native' : 'browser',
    'runtime-version': '0.9.9',
    'is-debugging': true,
    'logging-level': 3
  })

  // this will be put into app space only.
  $export($void, '$env', function (name, defaulue) {
    return typeof name === 'undefined' || name === null
      ? Object.assign(emptyObject(), environment)
      : typeof name !== 'string' ? null
        : typeof environment[name] !== 'undefined' ? environment[name]
          : typeof defaulue !== 'undefined' ? defaulue : null
  })

  $void.env = function (name, value) {
    return typeof value === 'undefined' ? environment[name]
      : (environment[name] = value)
  }

  $void.runtime = function (name, value) {
    name = 'runtime-' + name
    return $void.env(name, value)
  }
}


/***/ }),

/***/ "./sugly/runtime/eval.js":
/*!*******************************!*\
  !*** ./sugly/runtime/eval.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function run ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var warn = $void.$warn
  var $export = $void.export
  var execute = $void.execute

  // evaluate: a string, a symbol or a tuple in a separate space.
  $export($, 'eval', function (expr) {
    var code
    if (typeof expr === 'string') {
      // try to compile & evaluate
      code = compile(expr)
      if (!(code instanceof Tuple$)) {
        warn('eval', 'invalid code', code)
        return null
      }
    } else if (expr instanceof Tuple$) {
      // evauate it
      code = expr
    } else if (expr instanceof Symbol$) {
      // resolve it in global space.
      code = new Tuple$([expr], true)
    } else {
      // a fix-point value.
      return expr
    }
    try {
      return execute(null, code)[0]
    } catch (signal) { // any unexpected signal
      if (code === expr) {
        warn('eval', 'invalid call to', signal.id, 'for', code)
      } else {
        warn('eval', 'invalid call to', signal.id, 'for', code, 'of', expr)
      }
      return null
    }
  })
}


/***/ }),

/***/ "./sugly/runtime/evaluate.js":
/*!***********************************!*\
  !*** ./sugly/runtime/evaluate.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function evaluate ($void) {
  var $ = $void.$
  var $Operator = $.operator
  var Tuple$ = $void.Tuple
  var Signal$ = $void.Signal
  var Symbol$ = $void.Symbol
  var warn = $void.$warn
  var indexerOf = $void.indexerOf
  var symbolPairing = $.symbol.pairing
  var symbolSubject = $.symbol.subject
  var staticOperators = $void.staticOperators

  $void.evaluate = function evaluate (clause, space) {
    if (!(clause instanceof Tuple$)) {
      return clause instanceof Symbol$ ? space.resolve(clause.key) : clause
    }
    var clist = clause.$
    var length = clist.length
    if (length < 1) { // empty clause
      return null
    }
    if (clause.plain) { // a plain expression list (code block)
      var last = null
      for (var i = 0; i < length; i++) {
        last = evaluate(clist[i], space)
      }
      return last
    }
    // The subject and evaluation mode:
    //  implicit: the subject will be invoked if it's a function
    //  explicit: the subject keeps as a subject even it's a function.
    var subject = clist[0]
    var offset = 1
    var implicitSubject = true // by default, use implicit mode.
    if (subject instanceof Symbol$) {
      if (subject === symbolSubject) { // switching to explicit mode.
        switch (length) {
          case 1:
            return null // no subject.
          case 2:
            return evaluate(clist[1], space)
          default:
            subject = evaluate(clist[1], space)
        }
        offset = 2
        implicitSubject = false // explicit mode
      } else if (subject === symbolPairing) { // switching to explicit mode.
        if (length < 2) {
          return null // no predicate.
        }
        subject = evaluate(clist[1], space)
        if (typeof subject !== 'function') {
          return null // invalid operation
        }
        offset = 2
      } else if (staticOperators[subject.key]) { // static operators
        return staticOperators[subject.key](space, clause)
      } else { // a common symbol
        subject = space.resolve(subject.key)
      }
    } else if (subject instanceof Tuple$) { // a statement
      subject = evaluate(subject, space)
    } // else, the subject is a common value.

    // switch subject to predicate if it's apppliable.
    var predicate
    if (typeof subject === 'function' && implicitSubject) {
      if (subject.type === $Operator) {
        return subject(space, clause)
      }
      predicate = subject
      subject = null
    } else {
      predicate = null
    }

    // with only subject, apply evaluation to it.
    if (offset >= length && predicate === null) {
      return evaluate(subject, space) // explicitly calling this function.
    }

    var args = []
    if (predicate === null) { // resolve the predicate if there is not.
      predicate = clist[offset++]
      if (predicate instanceof Tuple$) { // nested clause
        predicate = evaluate(predicate, space)
      }
      // try to find a function as verb
      if (predicate instanceof Symbol$) {
        if (predicate.key === ':') {
          predicate = indexerOf(subject) // explicitly calling the indexer
        } else { // implicitly call the indexer
          var indexer = indexerOf(subject)
          predicate = indexer.get
            ? indexer.get.call(subject, predicate.key)
            : indexer.call(subject, predicate.key)
          if (typeof predicate !== 'function') {
            // interpret to getter if the result is not a function.
            return typeof predicate === 'undefined' ? null : predicate
          }
        }
      } else if (typeof predicate !== 'function') {
        args.push(predicate)
        predicate = indexerOf(subject)
      }
    }

    // pass the original clause if the predicate is an operator.
    if (predicate.type === $Operator) {
      return predicate(space, clause, subject)
    }

    // evaluate arguments.
    for (; offset < length; offset++) {
      args.push(evaluate(clist[offset], space))
    }

    // evaluate the statement.
    try {
      var result = predicate.apply(subject, args)
      return typeof result === 'undefined' ? null : result
    } catch (signal) {
      if (signal instanceof Signal$) {
        throw signal
      }
      warn('evaluate', 'unknown signal:', signal, 'when evaluating', clause)
      return null
    }
  }
}


/***/ }),

/***/ "./sugly/runtime/execute.js":
/*!**********************************!*\
  !*** ./sugly/runtime/execute.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function execute ($void) {
  var Signal$ = $void.Signal
  var warn = $void.$.warn
  var evaluate = $void.evaluate
  var createAppSpace = $void.createAppSpace
  var createModuleSpace = $void.createModuleSpace

  $void.execute = function execute (space, code, uri, args, mainApp) {
    var scope = mainApp ? prepareAppSpace(uri) : createModuleSpace(uri, space)
    scope.populate(args)
    try {
      return [evaluate(code, scope), scope]
    } catch (signal) {
      if (signal instanceof Signal$) {
        if (signal.id === 'exit' || signal.id === 'return') {
          return [signal.value, scope]
        }
        throw signal
      }
      warn('execute', 'unknown error:', signal,
        'with', args, 'for', code, 'from', uri
      )
      return [null, null]
    }
  }

  function prepareAppSpace (uri) {
    var scope = $void.bootstrap
    if (scope && scope['-app'] === uri) { // bootstrap app
      if (scope.modules[uri]) { // re-run the bootstrap app
        scope = createAppSpace(uri)
      } // start to run bootstrap app
    } else { // a new app
      scope = createAppSpace(uri)
    }
    scope.modules[uri] = Object.assign(Object.create(null), {
      status: 201,
      exports: scope.exporting,
      timestamp: Date.now()
    })
    return scope
  }
}


/***/ }),

/***/ "./sugly/runtime/function.js":
/*!***********************************!*\
  !*** ./sugly/runtime/function.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function function_ ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Signal$ = $void.Signal
  var Symbol$ = $void.Symbol
  var warn = $void.$warn
  var lambda = $void.lambda
  var stambda = $void.stambda
  var constambda = $void.constambda
  var evaluate = $void.evaluate
  var function_ = $void.function
  var createLambdaSpace = $void.createLambdaSpace
  var createFunctionSpace = $void.createFunctionSpace
  var createEmptyOperation = $void.createEmptyOperation

  $void.lambdaOf = function lambdaOf (space, clause, offset) {
    // compile code
    var code = [$Symbol.lambda]
    var params = formatParameters(clause.$[offset++], space)
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(offset) || []
    if (body.length > 0) {
      var tbody = new Tuple$(body, true)
      code.push(tbody)
      return lambda(createLambda(
        params, tbody, space.app, space.modules, space.local['-module']
      ), new Tuple$(code))
    } else {
      code.push($Tuple.blank) // empty body
      return params.length < 1 ? $.lambda.noop
        : lambda(createEmptyOperation(), new Tuple$(code))
    }
  }

  function createLambda (params, tbody, app, modules, module_) {
    var createScope = createLambdaSpace.bind(null, app, modules, module_)

    var $lambda = function () {
      var scope = createScope()
      // populate arguments
      for (var i = 0; i < params.length; i++) {
        scope.local[params[i]] = i < arguments.length ? arguments[i] : null
      }
      scope.prepare($lambda, this, Array.prototype.slice.call(arguments))
      // execution
      while (true) { // redo
        try {
          return evaluate(tbody, scope)
        } catch (signal) {
          if (signal instanceof Signal$) {
            if (signal.id === 'redo') { // clear space context
              scope = prepareToRedo(createScope(),
                $lambda, this, params, signal.value, signal.count)
              continue
            } else if (signal.id !== 'exit') {
              // return, break & continue if they're not in loop.
              return signal.value
            }
            throw signal
          }
          warn('lambda:eval', 'unexpected error:', signal)
          return null
        }
      }
    }
    return $lambda
  }

  $void.staticLamdaOf = function staticLamdaOf (space, clause, offset) {
    // compile code
    var code = [$Symbol.stambda]
    var params = formatParameters(clause.$[offset++], space, 1)
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(offset) || []
    if (body.length > 0) {
      var tbody = new Tuple$(body, true)
      code.push(tbody)
      return (params.length > 0 ? stambda : constambda)(
        createStaticLambda(params, tbody), new Tuple$(code)
      )
    } else {
      code.push($Tuple.blank) // empty body
      return params.length < 1 ? $.lambda.static
        : constambda(createEmptyOperation(), new Tuple$(code))
    }
  }

  function createStaticLambda (params, tbody) {
    var key
    if (params.length > 0) {
      key = params[0]
    }
    var $stambda = function () {
      var scope = createLambdaSpace()
      // populate argument
      if (key) {
        scope.local[key] = key === 'this' ? this
          : arguments.length > 0 ? arguments[0] : null
      }
      // execution
      try {
        return evaluate(tbody, scope)
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id !== 'exit') {
            // redo, return, break & continue if they're not in loop.
            return signal.value
          }
          throw signal
        }
        warn('stambda:eval', 'unexpected error:', signal)
        return null
      }
    }
    if (key !== 'this') {
      $stambda = $stambda.bind(null)
      $stambda.this = null
    }
    return $stambda
  }

  $void.functionOf = function functionOf (space, clause, offset) {
    // compile code
    var code = [$Symbol.function]
    var params = formatParameters(clause.$[offset++], space)
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(offset) || []
    if (body.length > 0) {
      var tbody = new Tuple$(body, true)
      code.push(tbody)
      return function_(
        createFunction(params, tbody, space.reserve()),
        new Tuple$(code)
      )
    } else {
      code.push($Tuple.blank) // empty body
      return params.length < 1 ? $.function.noop
        : function_(createEmptyOperation(), new Tuple$(code))
    }
  }

  function createFunction (params, tbody, parent) {
    var $func = function () {
      var scope = createFunctionSpace(parent)
      // populate arguments
      for (var i = 0; i < params.length; i++) {
        scope.local[params[i]] = i < arguments.length ? arguments[i] : null
      }
      scope.prepare($func, this, Array.prototype.slice.call(arguments))
      // execution
      while (true) { // redo
        try {
          return evaluate(tbody, scope)
        } catch (signal) {
          if (signal instanceof Signal$) {
            if (signal.id === 'redo') { // clear space context
              scope = prepareToRedo(createFunctionSpace(parent),
                $func, this, params, signal.value, signal.count)
              continue
            } else if (signal.id !== 'exit') {
              // return, break & continue if they're not in loop.
              return signal.value
            }
            throw signal
          } // for unexpected errors
          warn('function:eval', 'unexpected error:', signal)
          return null
        }
      }
    }
    return $func
  }

  // to prepare a new context for redo
  function prepareToRedo (scope, me, t, params, value, count) {
    var args = count === 0 ? [] : count === 1 ? [value] : value
    scope.prepare(me, t, args)
    for (var i = 0; i < params.length; i++) {
      scope.local[params[i]] = i < args.length ? args[i] : null
    }
    return scope
  }

  // accepts param, (param ...) or ((param default-value) ...)
  // returns [params-list, code]
  function formatParameters (params, space, maxArgs) {
    if (params instanceof Symbol$) {
      return [[params.key], new Tuple$([params])]
    }
    if (!(params instanceof Tuple$) || params.$.length < 1) {
      return [[], $Tuple.empty]
    }
    params = params.$
    maxArgs = maxArgs > 0
      ? maxArgs > params.length ? params.length : maxArgs
      : params.length
    var args = []
    var code = []
    for (var i = 0; i < maxArgs; i++) {
      var param = params[i]
      if (param instanceof Symbol$) {
        args.push(param.key)
        code.push(param)
      }
    }
    return args.length > 0 ? [args, new Tuple$(code)] : [[], $Tuple.empty]
  }
}


/***/ }),

/***/ "./sugly/runtime/interpreter.js":
/*!**************************************!*\
  !*** ./sugly/runtime/interpreter.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function interpreter ($void) {
  var $ = $void.$
  var compiler = $.compiler
  var Signal$ = $void.Signal
  var $export = $void.export
  var evaluate = $void.evaluate
  var isApplicable = $void.isApplicable
  var atomicArrayOf = $void.atomicArrayOf
  var createAppSpace = $void.createAppSpace

  // interactively feed & evaluate
  $export($void, '$interpreter', function (shell, args, appHome) {
    if (!isApplicable(shell)) {
      return null
    }
    // formalize arguments values to separate spaces.
    args = Array.isArray(args) ? atomicArrayOf(args) : []
    if (typeof appHome !== 'string' || appHome.length < 1) {
      appHome = $void.runtime('home')
    }
    // create a module space.
    var scope = createAppSpace(appHome + '/.') // to indicate a directory.
    scope.populate(args)
    // create compiler.
    var compile = compiler(function (expr, status) {
      if (status) {
        shell.apply(null, [null, 'compiler:' + status].concat(
          Array.prototype.slice.call(arguments, 2)))
        return
      }
      var value = expr[0]
      var src = expr[1]
      try {
        shell(evaluate(value, scope))
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'return') {
            shell(signal.value)
          } else if (signal.id === 'exit') {
            shell(signal.value, 'exiting')
          } else {
            shell(null, 'warning', 'invalid call to ' + signal.id, [value, src])
          }
        } else {
          shell(null, 'warning', 'unexpected error in evaluation', [signal, value, src])
        }
      }
    })

    return function interpret (text) {
      if (typeof text === 'string') {
        return compile(text) // push input into compiler
      } else {
        return compile() // reset status.
      }
    }
  })
}


/***/ }),

/***/ "./sugly/runtime/operator.js":
/*!***********************************!*\
  !*** ./sugly/runtime/operator.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function operators$operator ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var operator = $void.operator
  var symbolPairing = $Symbol.pairing
  var symbolSubject = $Symbol.subject
  var createOperatorSpace = $void.createOperatorSpace
  var createEmptyOperation = $void.createEmptyOperation

  $void.operatorOf = function operatorOf (space, clause) {
    // compile code
    var code = [$Symbol.operator]
    var params = formatOperands(clause.$[1])
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(2) || []
    if (body.length > 0) {
      markOperatorClause(body)
      var tbody = new Tuple$(body, true)
      code.push(tbody)
      return operator(createOperator(params, tbody, space.local), new Tuple$(code))
    } else {
      code.push($Tuple.blank) // empty body
      return params.length < 1 ? $.operator.noop
        : operator(createEmptyOperation(), new Tuple$(code))
    }
  }

  function markOperatorClause (statement) {
    for (var i = 0; i < statement.length; i++) {
      var expr = statement[i]
      if (expr instanceof Tuple$ && expr.$.length > 0) {
        expr.inop = true
        markOperatorClause(expr.$)
      }
    }
  }

  function createOperator (params, tbody, origin) {
    return function (space, clause, that) {
      if (!(space instanceof Space$)) {
        return null // invalid call.
      }
      // populate operands
      var clist = clause.$
      var offset = typeof that !== 'undefined'
        ? clist[0] === symbolSubject ? 3 : 2
        : clist[0] === symbolPairing ? 2 : 1
      var scope = createOperatorSpace(space, origin)
      for (var i = 0; i < params.length; i++) {
        var j = i + offset
        scope.context[params[i]] = j < clist.length ? clist[j] : null
      }
      scope.prepareOp(clause, offset, that)
      return evaluate(tbody, scope)
    }
  }

  // accepts operand or (operand ...)
  // returns [operand-list, code]
  function formatOperands (params) {
    if (params instanceof Symbol$) {
      return [[params.key], new Tuple$([params])]
    }
    if (!(params instanceof Tuple$) || params.$.length < 1) {
      return [[], $Tuple.empty]
    }
    var oprs = []
    var code = []
    params = params.$
    for (var i = 0; i < params.length; i++) {
      var param = params[i]
      if (param instanceof Symbol$) {
        oprs.push(param.key)
        code.push(param)
      }
    }
    return oprs.length < 1 ? [[], $Tuple.empty] : [oprs, new Tuple$(code)]
  }
}


/***/ }),

/***/ "./sugly/runtime/run.js":
/*!******************************!*\
  !*** ./sugly/runtime/run.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function run ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var warn = $void.$warn
  var $export = $void.export
  var execute = $void.execute
  var atomicArrayOf = $void.atomicArrayOf

  // run a module from source as an application.
  $export($void, '$run', function (appSource, args, appHome) {
    if (typeof appSource !== 'string') {
      return null
    }
    // formalize arguments values to separate spaces.
    args = Array.isArray(args) ? atomicArrayOf(args) : []
    // try to resolve the base uri of the whole application
    if (typeof appHome !== 'string' || appHome.length < 1) {
      appHome = $void.$env('home')
    }
    if (!appSource.endsWith('.s')) {
      appSource += '.s'
    }
    // try to resolve the uri for source
    var loader = $void.loader
    var uri = loader.resolve(appSource, [
      appHome, $void.runtime('home')
    ])
    if (typeof uri !== 'string') {
      warn('run', 'failed to resolve source for', uri)
      return null
    }
    // try to load file
    var doc = loader.load(uri)
    var text = doc[0]
    if (!text) {
      warn('run', 'failed to read source', appSource, 'for', doc[1])
      return null
    }
    // compile text
    var code = compile(text, uri, doc[1])
    if (!(code instanceof Tuple$)) {
      warn('run', 'compiler warnings:', code)
      return null
    }
    try {
      return execute(null, code, uri, args, true)[0]
    } catch (signal) {
      warn('run', 'invalid call to', signal.id,
        'in', text, 'from', uri, 'with', args)
      return null
    }
  })
}


/***/ }),

/***/ "./sugly/runtime/signal-of.js":
/*!************************************!*\
  !*** ./sugly/runtime/signal-of.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var Signal$ = $void.Signal
  var evaluate = $void.evaluate

  $void.signalOf = function $signalOf (type) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        throw new Signal$(type, 0, null)
      }
      if (length === 2) {
        throw new Signal$(type, 1, evaluate(clist[1], space))
      }
      var result = []
      var i
      for (i = 1; i < length; i++) {
        result.push(evaluate(clist[i], space))
      }
      throw new Signal$(type, i - 1, result)
    }
  }
}


/***/ }),

/***/ "./sugly/runtime/signal.js":
/*!*********************************!*\
  !*** ./sugly/runtime/signal.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  // the signal object to be used in control flow.
  $void.Signal = function Signal$ (id, count, value) {
    this.id = id
    this.count = count
    this.value = value
  }
}


/***/ }),

/***/ "./sugly/runtime/space.js":
/*!********************************!*\
  !*** ./sugly/runtime/space.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function space ($void) {
  var $ = $void.$
  var $Object = $.object
  var ClassInst$ = $void.ClassInst
  var isObject = $void.isObject
  var indexerOf = $void.indexerOf
  var defineConst = $void.defineConst
  var ownsProperty = $void.ownsProperty

  // shared empty array
  var EmptyArray = Object.freeze([])

  var atomOf = $.tuple['atom-of']
  // to be used for safely separating spaces.
  $void.atomicArrayOf = function (src) {
    var values = []
    for (var i = 0; i < src.length; i++) {
      values.push(atomOf(src[i]))
    }
    return values
  }

  $void.Space = Space$
  function Space$ (local, locals, context, export_) {
    this.local = local
    this.context = context || Object.create(local)
    if (locals) {
      this.locals = locals
    }
    if (export_) {
      this.exporting = export_
    }
  }
  Space$.prototype = Object.assign(Object.create(null), {
    resolve: function (key) {
      var value = $[key]
      if (typeof value !== 'undefined') {
        return value
      }
      value = this.context[key]
      if (typeof value !== 'undefined') {
        return value
      }
      var this_ = this.context.this
      return typeof this_ === 'undefined' || this_ === null ? null
        : indexerOf(this_).call(this_, key)
    },
    $resolve: function (key) {
      return typeof $[key] === 'undefined' ? null : $[key]
    },
    var: function (key, value) {
      return (this.local[key] = value)
    },
    const: function (key, value) {
      return defineConst(this.local, key, value)
    },
    lvar: function (key, value) {
      return (this.context[key] = value)
    },
    lconst: function (key, value) {
      return defineConst(this.context, key, value)
    },
    let: function (key, value) {
      if (ownsProperty(this.local, key)) {
        return (this.local[key] = value)
      }
      if (this.locals) {
        for (var i = this.locals.length - 1; i >= 0; i--) {
          if (ownsProperty(this.locals[i], key)) {
            return (this.locals[i][key] = value)
          }
        }
      }
      var this_ = this.context.this
      if (isObject(this_) && (ownsProperty(this_, key) || (
        (this_ instanceof ClassInst$) && key !== 'type' &&
        ownsProperty(this_.type.proto, key)
      ))) {
        // auto field assignment only works for an existing field of an object.
        return indexerOf(this_).call(this_, key, value)
      }
      return (this.local[key] = value)
    },
    export: function (key, value) {
      this.exporting && typeof this.exporting[key] === 'undefined' &&
        (this.exporting[key] = value)
      return this.var(key, value)
    },
    populate: function (ctx) {
      if (Array.isArray(ctx)) {
        this.context.arguments = ctx.length < 1 ? EmptyArray
          : Object.isFrozen(ctx) ? ctx : Object.freeze(ctx)
        return
      }
      if (ctx === null || typeof ctx !== 'object') {
        return
      }

      var keys = Object.getOwnPropertyNames(ctx)
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        switch (key) {
          case 'this':
            this.context.this = ctx.this
            break
          case 'arguments':
            if (Array.isArray(ctx.arguments)) {
              this.context.arguments = ctx.arguments.length < 1 ? EmptyArray
                : Object.isFrozen(ctx.arguments) ? ctx.arguments
                  : Object.freeze(ctx.arguments.slice())
            }
            break
          default:
            this.local[key] = ctx[key]
        }
      }
    },
    prepare: function (do_, this_, args) {
      this.context.do = do_
      this.context.this = typeof this_ === 'undefined' ? null : this_
      this.context.arguments = args.length < 1
        ? EmptyArray : Object.freeze(args)
    },
    prepareOp: function (operation, operand, that) {
      this.context.operation = operation
      this.context.operand = operand
      this.context.that = typeof that !== 'undefined' ? that : null
    },
    reserve: function () {
      return this._reserved || (
        this._reserved = {
          local: this.local,
          locals: this.locals,
          app: this.app,
          modules: this.modules
        }
      )
    },
    bindOperators: function () {
      // convert operators to internal helper functions
      $void.bindOperatorFetch(this)
      $void.bindOperatorImport(this)
      $void.bindOperatorLoad(this)
    }
  })

  $void.createAppSpace = function (uri) {
    var app = Object.create($)
    app['-app'] = uri
    app['-app-dir'] = $void.loader.dir(uri)
    app.env = $void.$env
    app.run = $void.$run
    app.interpreter = $void.$interpreter
    app.print = $void.$print
    app.printf = $void.$printf
    app.warn = $void.$warn
    app.timer = $void.$timer

    var local = Object.create(app)
    local['-module'] = uri
    local['-module-dir'] = $void.loader.dir(uri)

    var exporting = Object.create($Object.proto)
    var space = new Space$(local, null, null, exporting)
    space.app = app
    space.modules = Object.create(null)
    space.export = function (key, value) {
      if (typeof exporting[key] === 'undefined') {
        app[key] = value
        exporting[key] = value
      }
      return space.var(key, value)
    }
    return space
  }

  // a bootstrap app space can be used to fetch app's dependencies.
  $void.createBootstrapSpace = function (appUri) {
    var bootstrap = $void.bootstrap = $void.createAppSpace(appUri)
    bootstrap.bindOperators()
    return bootstrap
  }

  $void.createModuleSpace = function (uri, appSpace) {
    var app = appSpace && appSpace.app
    var local = Object.create(app || $)
    local['-module'] = uri || ''
    local['-module-dir'] = uri ? $void.loader.dir(uri) : ''
    var export_ = Object.create($Object.proto)
    var space = new Space$(local, null, null, export_)
    if (app) {
      space.app = app
      space.modules = appSpace.modules
    }
    return space
  }

  $void.createLambdaSpace = function (app, modules, module_) {
    var space
    if (app) {
      space = new Space$(Object.create(app))
      space.app = app
      space.modules = modules
    } else {
      space = new Space$(Object.create($))
    }
    if (module_) {
      space.local['-module'] = module_ || ''
      space.local['-module-dir'] = module_ ? $void.loader.dir(module_) : ''
    }
    return space
  }

  $void.createFunctionSpace = function (parent) {
    var space = new Space$(Object.create(parent.local),
      parent.locals ? parent.locals.concat(parent.local) : [parent.local]
    )
    if (parent.app) {
      space.app = parent.app
      space.modules = parent.modules
    }
    return space
  }

  // customized the behaviour of the space of an operator
  $void.OperatorSpace = OperatorSpace$
  function OperatorSpace$ (parent, origin) {
    // the original context is preferred over global.
    this.$ = origin
    // operator context is accessible to the context of calling function.
    this.context = Object.create(parent.context)
    // use the same local of calling function.
    this.local = parent.local
    if (parent.locals) {
      this.locals = parent.locals
    }
    // reserve app
    if (parent.app) {
      this.app = parent.app
      this.modules = parent.modules
    }
  }
  OperatorSpace$.prototype = Object.assign(Object.create(Space$.prototype), {
    inop: true, // indicates this is an operator space.
    $resolve: function (key) {
      // global entities are not overridable
      return typeof $[key] !== 'undefined' ? $[key]
        : typeof this.$[key] === 'undefined' ? null : this.$[key]
    }
  })

  $void.createOperatorSpace = function (parent, origin) {
    return new OperatorSpace$(parent, origin)
  }
}


/***/ }),

/***/ "./sugly/start.js":
/*!************************!*\
  !*** ./sugly/start.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function initializeSpace ($void) {
  __webpack_require__(/*! ./generic/void */ "./sugly/generic/void.js")($void)
  __webpack_require__(/*! ./generic/encoding */ "./sugly/generic/encoding.js")($void)

  __webpack_require__(/*! ./generic/null */ "./sugly/generic/null.js")($void)
  __webpack_require__(/*! ./generic/type */ "./sugly/generic/type.js")($void)

  __webpack_require__(/*! ./generic/bool */ "./sugly/generic/bool.js")($void)
  __webpack_require__(/*! ./generic/string */ "./sugly/generic/string.js")($void)
  __webpack_require__(/*! ./generic/number */ "./sugly/generic/number.js")($void)
  __webpack_require__(/*! ./generic/date */ "./sugly/generic/date.js")($void)
  __webpack_require__(/*! ./generic/range */ "./sugly/generic/range.js")($void)

  __webpack_require__(/*! ./generic/symbol */ "./sugly/generic/symbol.js")($void)
  __webpack_require__(/*! ./generic/tuple */ "./sugly/generic/tuple.js")($void)

  __webpack_require__(/*! ./generic/operator */ "./sugly/generic/operator.js")($void)
  __webpack_require__(/*! ./generic/lambda */ "./sugly/generic/lambda.js")($void)
  __webpack_require__(/*! ./generic/function */ "./sugly/generic/function.js")($void)

  __webpack_require__(/*! ./generic/iterator */ "./sugly/generic/iterator.js")($void)
  __webpack_require__(/*! ./generic/promise */ "./sugly/generic/promise.js")($void)

  __webpack_require__(/*! ./generic/array */ "./sugly/generic/array.js")($void)
  __webpack_require__(/*! ./generic/object */ "./sugly/generic/object.js")($void)
  __webpack_require__(/*! ./generic/class */ "./sugly/generic/class.js")($void)

  __webpack_require__(/*! ./generic/global */ "./sugly/generic/global.js")($void)
}

function initializeLib ($void, stdout) {
  __webpack_require__(/*! ./lib/stdout */ "./sugly/lib/stdout.js")($void, stdout)
  __webpack_require__(/*! ./lib/format */ "./sugly/lib/format.js")($void)
  __webpack_require__(/*! ./lib/math */ "./sugly/lib/math.js")($void)
  __webpack_require__(/*! ./lib/uri */ "./sugly/lib/uri.js")($void)
  __webpack_require__(/*! ./lib/json */ "./sugly/lib/json.js")($void)
  __webpack_require__(/*! ./lib/emitter */ "./sugly/lib/emitter.js")($void)
  __webpack_require__(/*! ./lib/timer */ "./sugly/lib/timer.js")($void)
}

function initializeRuntime ($void) {
  __webpack_require__(/*! ./runtime/env */ "./sugly/runtime/env.js")($void)
  __webpack_require__(/*! ./runtime/signal */ "./sugly/runtime/signal.js")($void)
  __webpack_require__(/*! ./runtime/space */ "./sugly/runtime/space.js")($void)
  __webpack_require__(/*! ./runtime/evaluate */ "./sugly/runtime/evaluate.js")($void)
  __webpack_require__(/*! ./runtime/signal-of */ "./sugly/runtime/signal-of.js")($void)
  __webpack_require__(/*! ./runtime/function */ "./sugly/runtime/function.js")($void)
  __webpack_require__(/*! ./runtime/operator */ "./sugly/runtime/operator.js")($void)

  __webpack_require__(/*! ./runtime/execute */ "./sugly/runtime/execute.js")($void)
  __webpack_require__(/*! ./runtime/eval */ "./sugly/runtime/eval.js")($void)

  __webpack_require__(/*! ./runtime/run */ "./sugly/runtime/run.js")($void)
  __webpack_require__(/*! ./runtime/interpreter */ "./sugly/runtime/interpreter.js")($void)
}

function initializeOperators ($void) {
  __webpack_require__(/*! ./operators/pattern */ "./sugly/operators/pattern.js")($void)
  __webpack_require__(/*! ./operators/quote */ "./sugly/operators/quote.js")($void)

  __webpack_require__(/*! ./operators/assignment */ "./sugly/operators/assignment.js")($void)
  __webpack_require__(/*! ./operators/control */ "./sugly/operators/control.js")($void)

  __webpack_require__(/*! ./operators/general */ "./sugly/operators/general.js")($void)
  __webpack_require__(/*! ./operators/logical */ "./sugly/operators/logical.js")($void)
  __webpack_require__(/*! ./operators/bitwise */ "./sugly/operators/bitwise.js")($void)
  __webpack_require__(/*! ./operators/arithmetic */ "./sugly/operators/arithmetic.js")($void)

  __webpack_require__(/*! ./operators/literal */ "./sugly/operators/literal.js")($void)
  __webpack_require__(/*! ./operators/function */ "./sugly/operators/function.js")($void)
  __webpack_require__(/*! ./operators/operator */ "./sugly/operators/operator.js")($void)

  __webpack_require__(/*! ./operators/import */ "./sugly/operators/import.js")($void)
  __webpack_require__(/*! ./operators/load */ "./sugly/operators/load.js")($void)
  __webpack_require__(/*! ./operators/fetch */ "./sugly/operators/fetch.js")($void)
}

module.exports = function start (stdout) {
  // Hello, world.
  var $void = __webpack_require__(/*! ./generic/genesis */ "./sugly/generic/genesis.js")()

  // create generic type system
  initializeSpace($void)

  // prepare primary lib
  initializeLib($void, stdout($void))

  // prepare tokenizer & compiler
  __webpack_require__(/*! ./tokenizer */ "./sugly/tokenizer.js")($void)
  __webpack_require__(/*! ./compiler */ "./sugly/compiler.js")($void)

  // assemble runtime functions
  initializeRuntime($void)

  // assemble & publish operators
  initializeOperators($void)

  return $void
}


/***/ }),

/***/ "./sugly/tokenizer.js":
/*!****************************!*\
  !*** ./sugly/tokenizer.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void) {
  var $ = $void.$
  var symbolOf = $.symbol.of
  var intValueOf = $.number['parse-int']
  var strUnescape = $.string.unescape
  var warn = $void.$warn
  var $export = $void.export
  var isApplicable = $void.isApplicable

  var Constants = $void.constantValues
  var RegexDecimal = $void.regexDecimal
  var RegexSpecialSymbol = $void.regexSpecialSymbol

  var tokenizer = $export($, 'tokenizer', function (parse, srcUri) {
    if (!isApplicable(parse)) {
      return $.tokenize
    }

    var srcText = ''
    if (!srcUri || typeof srcUri !== 'string') {
      srcUri = ''
    }

    var lineNo, lineOffset, lastChar, spacing, indenting, clauseIndent
    var waiter, pendingText, pendingLine, pendingOffset, pendingIndent
    var escaping, stringPadding
    resumeParsing() // initialize context

    function resumeParsing () {
      // general states
      lineNo = 0
      lineOffset = 0
      lastChar = null
      spacing = false
      indenting = 0
      clauseIndent = 0
      // escaping states
      waiter = null
      pendingText = ''
      pendingLine = 0
      pendingOffset = 0
      pendingIndent = -1
      escaping = false
      stringPadding = -1
    }

    var singleQuoteWaiter = createStringWaiter("'", 'format')
    var doubleQuoteWaiter = createStringWaiter('"')

    return function tokenizing (text) {
      if (typeof text !== 'string') {
        srcText = ''
        waiter && waiter() // finalize pending action
        resumeParsing() // clear parsing context
        return false // indicate a reset happened.
      }
      srcText = text
      // start parsing
      for (var i = 0; i < text.length; i++) {
        var c = text[i]
        if (!waiter || !waiter(c)) {
          processChar(c)
        }
        finalizeChar(c)
      }
      return true // keep waiting more code
    }

    function processChar (c) {
      switch (c) {
        case '(':
          parse('punctuation', c, [clauseIndent, lineNo, lineOffset])
          clauseIndent = -1 // clear beginning indent
          break
        case ')':
          parse('punctuation', c, [indenting, lineNo, lineOffset])
          break
        case '\\': // force to start a symbol.
          escaping = true
          beginSymbol('')
          break
        case '`':
        case '@':
        case ':':
        case '$':
        case ',': // logical separator
        case ';': // line-closing
        case '[': // reserved as annotation block beginning.
        case ']': // reserved as annotation block.
        case '{': // reserved as block punctuation
        case '}': // reserved as block punctuation
          parse('symbol', symbolOf(c), [indenting, lineNo, lineOffset])
          break
        case "'":
          // always use double quote internally.
          beginWaiting('"', singleQuoteWaiter)
          break
        case '"':
          beginWaiting('"', doubleQuoteWaiter)
          break
        case '#':
          beginWaiting('', commentWaiter)
          break
        case ' ':
        case '\t': // It may spoil well foramtted code.
          processWhitespace(c)
          break
        default:
          beginSymbol(c)
          break
      }
    }

    function finalizeChar (c) {
      lastChar = c
      spacing = !waiter && /[\s]/.test(c)
      if (c !== ' ' && c !== '\t') {
        indenting = -1
      }
      if (c === '\n') {
        lineNo += 1
        lineOffset = indenting = clauseIndent = 0
      } else {
        lineOffset += 1
      }
    }

    function beginWaiting (c, stateWaiter) {
      waiter = stateWaiter
      pendingText = c
      pendingLine = lineNo
      pendingOffset = lineOffset
      pendingIndent = indenting
    }

    function processWhitespace (c) {
      if (indenting < 0) {
        return raiseSpace(c)
      }
      if (c === '\t') {
        warn('tokenizer', 'TAB-space is not suggested in indention.',
          [srcUri || srcText, lineNo, lineOffset, indenting])
      }
      clauseIndent = ++indenting
    }

    function createStringWaiter (quote, tokenType) {
      function raiseValue () {
        parse(tokenType || 'value', strUnescape(pendingText + '"'),
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset])
        waiter = null
        return true
      }

      return function (c) {
        if (typeof c === 'undefined') { // unexpected ending
          warn('tokenizer', 'a string value is not properly closed.',
            [srcUri || srcText, lineNo, lineOffset, pendingLine, pendingOffset])
          return raiseValue()
        }
        if (c === '\r') { // skip '\r' anyway
          return true
        }
        if (c === '\n') { // multiline string.
          if (escaping) { // trailing escaping char indicates to keep the '\n'
            pendingText += 'n'
            stringPadding = 1 // use the new-line as space padding.
            escaping = false
          } else if (stringPadding < 0) {
            stringPadding = 0 // turn on space padding
          }
          return true
        }
        if (/[\s]/.test(c)) {
          if (stringPadding >= 0) { // padding or padded
            if (stringPadding === 0) { // pading
              pendingText += ' ' // keeps the first space character.
              stringPadding = 1
            }
            return true
          }
          // fallback to common string logic
        } else {
          stringPadding = -1 // turn off string padding
        }
        if (escaping) { // common escaping
          pendingText += c
          escaping = false
          return true
        }
        if (c === quote) {
          return raiseValue()
        }
        pendingText += quote === "'" && c === '"' ? '\\' + c : c
        if (c === '\\') {
          escaping = true
        }
        return true
      }
    }

    function raiseSpace (c) {
      if (!spacing || c === '\n') { // only raise once for common spaces, but
        // raise every new-line in case parser giving it special meanings.
        parse('space', c, [indenting, lineNo, lineOffset])
      }
    }

    function commentWaiter (c) {
      if (typeof c === 'undefined' || c === '\n') {
        parse('comment', pendingText,
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset])
        waiter = null
      } else if (pendingText.length < 1 && c === '(') {
        pendingText = '('
        waiter = blockCommentWaiter // upgrade to block comment
      } else {
        pendingText += c
      }
      return c !== '\n'
    }

    function blockCommentWaiter (c) {
      if (c) {
        if (lastChar !== ')' || c !== '#') {
          pendingText += c
          return true
        } // else, normal ending
      } else {
        pendingText += ')'
        warn('tokenizer', 'a block comment is not properly closed.',
          [srcUri || srcText, lineNo, lineOffset, pendingLine, pendingOffset])
      }
      parse('comment', pendingText,
        [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset])
      waiter = null
      return true
    }

    function beginSymbol (c) {
      /[\s]/.test(c) ? raiseSpace(c) // report space once.
        : beginWaiting(c, symbolWaiter)
    }

    function symbolWaiter (c) {
      if (c && escaping) {
        pendingText += c
        escaping = false
        return true
      }
      if (c === '\\') {
        escaping = true
        return true
      }
      if (c && !RegexSpecialSymbol.test(c)) {
        pendingText += c
        return true
      }
      raiseSymbol()
      escaping = false
      waiter = null
      return false // return the char to tokenizer.
    }

    function raiseSymbol () {
      var type, value
      if (typeof Constants[pendingText] !== 'undefined') { // a constant value
        value = Constants[pendingText]
      } else if (RegexDecimal.test(pendingText)) { // a decimal number
        value = /(\.|e|E|^-0$)/.test(pendingText)
          ? parseFloat(pendingText) : intValueOf(pendingText)
      } else if (pendingText.startsWith('0')) { // a special integer number
        value = intValueOf(pendingText)
      } else { // a common symbol
        type = 'symbol'
        value = symbolOf(pendingText)
      }
      parse(type || 'value', value,
        [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset - 1])
    }
  })

  // a helper function to tokenize a piece of text.
  $export($, 'tokenize', function (text) {
    var tokens = []
    var tokenizing = tokenizer(function collector () {
      tokens.push(Array.prototype.slice.call(arguments))
    })
    tokenizing(text)
    tokenizing() // notify the end of stream.
    return tokens
  })
}


/***/ }),

/***/ "./test/test.js":
/*!**********************!*\
  !*** ./test/test.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var symbols = Object.create(null)
__webpack_require__(/*! ../modules/symbols */ "./modules/symbols.js")(symbols)

module.exports = function ($void) {
  var $ = $void.$
  var print = $void.$print
  var printf = $void.$printf

  var printInColor = function (color) {
    return function (text) {
      printf(text + '\n', color)
    }
  }

  var red = printInColor('red')
  var gray = printInColor('gray')
  var green = printInColor('green')

  var signPassed = function () {
    printf('    ' + symbols.passed + '[PASSED] ', 'green')
  }
  var signFailed = function () {
    printf('    ' + symbols.failed + '[FAILED] ', 'red')
  }

  var passing = 0
  var failing = []

  return function () {
    // check native environment
    print('\n  Checking JavaScript environment')
    checkJavascript()
    checkPolyfill()

    // check sugly runtime.
    checkSuglyRuntime()

    // start to report result
    green('\n  passing: ' + passing)
    if (failing.length < 1) {
      green('\n  Sugly is ready to run.\n')
      return true
    }

    // print failures
    red('  failing: ' + failing.length)
    print('\n  There might be some issues to prevent running sugly')
    for (var i = 0; i < failing.length; i++) {
      red('  - ' + failing[i])
    }
    print()
    return false
  }

  function passed (feature) {
    passing += 1
    signPassed(); gray(feature)
  }

  function failed (feature) {
    failing.push(feature)
    signFailed(); red(feature)
  }

  function checkJavascript () {
    passed('JS is using the space of ' + (global ? 'global.' : 'window.'));
    (typeof Promise === 'undefined' ? failed : passed)('Promise')
  }

  function checkPolyfill () {
    var polyfill = __webpack_require__(/*! ../lib/polyfill */ "./lib/polyfill.js")
    if (polyfill.length > 0) {
      passed('Sugly is using some polyfill functions:')
      var padding = '      - '
      gray(padding + polyfill.join('\n' + padding))
    } else {
      green('      Congratulations! Sugly does not need any polyfill.')
    }
  }

  function checkSuglyRuntime () {
    print('\n  Checking Sugly Runtime ...')
    checkObjects($void, '[Void / Null] ', [
      'null'
    ])

    checkFunctions($void, '[Void / constructors] ', [
      // genesis
      'Type', 'Date', 'Range', 'Symbol', 'Tuple',
      'Iterator', 'Promise',
      'Object', 'ClassType',
      // runtime
      'Signal', 'Space', 'OperatorSpace'
    ])

    checkFunctions($void, '[Void / functions] ', [
      // genesis
      'operator', 'lambda', 'function',
      // runtime
      'createAppSpace', 'createModuleSpace',
      'createLambdaSpace', 'createFunctionSpace', 'createOperatorSpace',
      'signalOf',
      'lambdaOf', 'functionOf', 'operatorOf',
      'evaluate', 'execute'
    ])

    checkStaticOperators('[void / operators] ', [
      '`', 'quote', 'unquote',
      'export', 'var', 'let', 'const', 'local', 'locon',
      '?', 'if', 'while', 'for', 'break', 'continue',
      '+', '++', '--', '!', 'not', '~',
      '@', '=?', '=', '->', '=>', 'redo', 'return', 'exit',
      'import', 'load', 'fetch',
      'debug', 'log'
    ])

    checkObjects($, '[Sugly / types] ', [
      'type',
      'bool', 'string', 'number', 'date', 'range',
      'symbol', 'tuple',
      'operator', 'lambda', 'function',
      'iterator', 'promise',
      'array', 'object', 'class'
    ])

    checkFunctions($, '[Sugly / functions] ', [
      // generic
      'commit', 'commit*', 'commit?',
      // runtime
      'eval',
      // bootstrap
      'tokenizer', 'tokenize', 'compiler', 'compile'
    ])

    checkFunctions($void, '[Sugly / functions] ', [
      // runtime
      '$env', '$run', '$interpreter'
    ])

    checkFunctions($, '[Sugly / lib / functions] ', [
      'max', 'min'
    ])

    checkFunctions($void, '[Sugly / lib / IO functions] ', [
      '$print', '$printf', '$warn'
    ])

    checkObjects($, '[Sugly / lib / objects] ', [
      'uri', 'math', 'json'
    ])

    checkObjects($, '[Sugly / lib / classes] ', [
      'emitter'
    ])

    checkObjects($void, '[Sugly / lib / classes] ', [
      '$timer'
    ])

    // bootstrap tests
    checkTypeOf()
    checkIndexerOf()

    checkTypes()
    checkAssignment()
    checkOperators()
    checkControl()
    checkOperations()
  }

  function checkObjects ($, group, names) {
    print('\n  -', group)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (typeof $[name] === 'object') {
        passed(name)
      } else {
        failed(group + name)
      }
    }
  }

  function checkFunctions ($, group, names) {
    print('\n  -', group)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (typeof $[name] === 'function') {
        passed(name)
      } else {
        failed(group + name)
      }
    }
  }

  function checkStaticOperators (group, names) {
    print('\n  -', group)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (typeof $void.staticOperators[name] === 'function') {
        passed(name)
      } else {
        failed(group + name)
      }
    }
  }

  function check (feature, result, error) {
    result ? passed(feature) : failed(error ? feature + ' - ' + error : feature)
  }

  function checkTypeOf () {
    print('\n  - Static type-of')
    var typeOf = $.type.of

    check('[undefined]', typeOf() === null)
    check('null', typeOf(null) === null)

    check('bool', typeOf(true) === $.bool)
    check('string', typeOf('') === $.string)
    check('number', typeOf(1) === $.number)
    check('date', typeOf($.date.empty) === $.date)
    check('range', typeOf($.range.empty) === $.range)
    check('symbol', typeOf($.symbol.empty) === $.symbol)
    check('tuple', typeOf($.tuple.empty) === $.tuple)

    check('operator', typeOf($.operator.empty()) === $.operator)
    check('lambda', typeOf($.lambda.noop) === $.lambda)
    check('stambda', typeOf($.lambda.static) === $.lambda)
    check('function', typeOf($.function.empty()) === $.function)
    check('function (generic)', typeOf(function () {}) === $.function)

    check('iterator', typeOf($.iterator.empty) === $.iterator)
    check('promise', typeOf($.promise.empty) === $.promise)

    check('array', typeOf($.array.empty()) === $.array)
    check('array (generic)', typeOf([]) === $.array)

    check('object', typeOf($.object.empty()) === $.object)
    check('object (generic)', typeOf({}) === $.object)

    check('class', typeOf($.class.empty()) === $.class)
  }

  function checkIndexerOf () {
    print('\n  - Static indexer-of')
    var indexerOf = $void.indexerOf

    check('undefined', indexerOf() === $void.null[':'])
    check('null', indexerOf(null) === $void.null[':'])
    check('type', indexerOf($.type) === $.type[':'])

    check('bool', indexerOf($.bool) === $.bool[':'])
    check('bool: true', indexerOf(true) === $.bool.proto[':'])
    check('bool: false', indexerOf(false) === $.bool.proto[':'])

    check('string', indexerOf($.string) === $.string[':'])
    check('string: empty', indexerOf('') === $.string.proto[':'])

    check('number', indexerOf($.number) === $.number[':'])
    check('number: 0', indexerOf(0) === $.number.proto[':'])

    check('date', indexerOf($.date) === $.date[':'])
    check('date: empty', indexerOf($.date.empty) === $.date.proto[':'])

    check('range', indexerOf($.range) === $.range[':'])
    check('range: empty', indexerOf($.range.empty) === $.range.proto[':'])

    check('symbol', indexerOf($.symbol) === $.symbol[':'])
    check('symbol: empty', indexerOf($.symbol.empty) === $.symbol.proto[':'])

    check('operator', indexerOf($.operator) === $.operator[':'])
    check('operator.empty', indexerOf($.operator.empty()) === $.operator.proto[':'])

    check('lambda', indexerOf($.lambda) === $.lambda[':'])
    check('lambda: empty', indexerOf($.lambda.empty()) === $.lambda.proto[':'])

    check('function', indexerOf($.function) === $.function[':'])
    check('function: empty', indexerOf($.function.empty()) === $.function.proto[':'])
    check('function: generic', indexerOf(function () {}) === $.function.proto[':'])

    check('array', indexerOf($.iterator.empty) === $.iterator.proto[':'])
    check('array', indexerOf($.promise.empty) === $.promise.proto[':'])

    check('array', indexerOf($.array) === $.array[':'])
    check('array: empty', indexerOf($.array.empty()) === $.array.proto[':'])
    check('array: generic', indexerOf([]) === $.array.proto[':'])

    check('object', indexerOf($.object) === $.object[':'])
    check('object: empty', indexerOf($.object.empty()) === $.object.proto[':'])
    check('object: generic', indexerOf({}) === $.object.proto[':'])
  }

  function seval (expected, expr, desc) {
    var result = $.eval(expr)
    var success = typeof expected === 'function' ? expected(result) : Object.is(result, expected)
    check(expr || desc, success, success || 'evaluated to a value of ' +
      (typeof result) + ': ' + (result ? result.toString() : result))
  }

  function checkTypes () {
    print('\n  - Primary Types')
    seval(null, '', '<empty>')
    seval(null, '()')
    seval(null, 'null')

    seval($.type, 'type')

    seval($.bool, 'bool')
    seval(true, 'true')
    seval(false, 'false')

    seval($.string, 'string')
    seval($.string.empty, '""')
    seval('ABC', '"ABC"')
    seval('ABC', '("ABC")')
    seval(3, '("ABC" length)')
    seval('ABCDEF', '("ABC" + "DEF")')

    seval($.number, 'number')
    seval(3, '(1 + 2)')
    seval(-1, '(1 - 2)')
    seval(2, '(1 * 2)')
    seval(0.5, '(1 / 2)')

    seval($.date, 'date')
    seval(function (d) {
      return d instanceof Date
    }, '(date now)')

    seval($.range, 'range')
    seval(function (r) {
      return r.begin === 0 && r.end === 3 && r.step === 1
    }, '(0 3)')
    seval(function (r) {
      return r.begin === 10 && r.end === 20 && r.step === 2
    }, '(10 20 2)')

    seval($.symbol, 'symbol')
    seval(function (s) {
      return s.key === 'x'
    }, '(` x)')

    seval($.tuple, 'tuple')
    seval(function (t) {
      var l = t.$
      return t instanceof $void.Tuple && l[0].key === 'x' && l[1] === 1 && l[2] === 'y' && l[3] === true
    }, '(` (x 1 "y" true))')

    seval($.operator, 'operator')
    seval(function (s) {
      return s.type === $.operator
    }, '(=? () )')
    seval(function (s) {
      return s.type === $.operator
    }, '(=? (X Y) (+ (X) (Y).')

    seval($.lambda, 'lambda')
    seval(function (s) {
      return s.type === $.lambda
    }, '(= () )')
    seval(function (s) {
      return s.type === $.lambda
    }, '(= (x y) (+ x y).')

    seval($.function, 'function')
    seval(function (s) {
      return s.type === $.function
    }, '(=> () )')
    seval(function (s) {
      return s.type === $.function
    }, '(=> (x y) (+ x y).')

    seval($.array, 'array')
    seval(function (a) {
      return a.length === 2 && a[0] === 1 && a[1] === 2
    }, '(array of 1 2)')
    seval(2, '((@ 10 20) length)')
    seval(20, '((@ 10 20) 1)')

    seval($.object, 'object')
    seval(function (obj) {
      return obj.x === 1 && obj.y === 2
    }, '(@ x: 1 y: 2)')
    seval(10, '((@ x: 10 y: 20) x)')
    seval(20, '((@ x: 10 y: 20) y)')
    seval(200, '((@ x: 10 y: 20) "y" 200)')

    seval($.class, 'class')
    seval(function (c) {
      return c.type === $.class
    }, '(@:class x: 1 y: 0)')
    seval(function (c) {
      return c.type === $.class
    }, '(class of (@: x: 1 y: 0).')
  }

  function checkAssignment () {
    print('\n  - Assignment')
    seval(1, '(let x 1)')
    seval(2, '(let x 1) (let y 2)')
    seval(2, '(let (x y) (@ 1 2). y')
    seval(2, '(let (x y) (@ x: 1 y: 2). y')
    seval(2, '(let * (@ x: 1 y: 2). y')

    seval(1, '(var x 1)')
    seval(2, '(var x 1) (var y 2)')
    seval(2, '(var (x y) (@ 1 2). y')
    seval(2, '(var (x y) (@ x: 1 y: 2). y')
    seval(2, '(var * (@ x: 1 y: 2). y')

    seval(1, '(export x 1)')
    seval(2, '(export x 1) (export y 2)')
    seval(2, '(export (x y) (@ x: 1 y: 2). y')
    seval(2, '(export * (@ x: 1 y: 2). y')
  }

  function checkOperators () {
    print('\n  - Operators')
    seval(1, '(? true 1 0)')
    seval(0, '(? false 1 0)')

    seval(110, '(+ 10 100)')
    seval(-110, '(+ -10 -100)')

    seval('10100', '(+ "10" "100")')
    seval('-10-100', '(+ "-10" "-100")')

    seval(1, '(++)')
    seval(-1, '(--)')

    seval(1, '(++ null)')
    seval(-1, '(-- null)')

    seval(1, '(++ 0)')
    seval(-1, '(-- 0)')

    seval(1, '(let x 0)(++ x)x')
    seval(-1, '(let x 0)(-- x)x')

    seval(true, '(1 ?)')
    seval(false, '(0 ?)')
    seval(false, '(null ?)')

    seval(true, '(true ? 1)')
    seval(1, '(false ? 1)')

    seval(1, '(true ? 1 0)')
    seval(0, '(false ? 1 0)')

    seval(0, '(null ?? 0)')
    seval(false, '(false ?? 0)')
    seval(0, '(0 ?? 1)')
    seval('', '("" ?? 1)')
  }

  function checkControl () {
    print('\n  - Control')
    seval(0, '(if true 1 0)')
    seval(null, '(if false 1 0)')
    seval(1, '(if true 1 else 0)')
    seval(0, '(if false 1 else 0)')

    seval(10, '(for x in (100 110) (++ i).')
    seval(99, '(while ((++ i) < 100) i)')
    seval(100, '(let i 0)(while ((i ++) < 100) i)')
    seval(100, '(while ((++ i) < 100). i')
    seval(101, '(let i 0)(while ((i ++) < 100). i')
    seval('done', '(while ((++ i) < 100) (if (i == 10) (break "done").')
  }

  function checkOperations () {
    print('\n  - Operations')
    seval(21, '(let x 1) (let y 20) (let add (=? (a b) ((a) + (b). (add x y)')

    seval(21, '(let z 100) (let add (= (x y) (x + y z). (add 1 20)')
    seval(21, '(let z 100) (= (1 20): (x y) (x + y z).')

    seval(121, '(let z 100) (let add (=> (x y) (x + y z). (add 1 20)')
    seval(121, '(let z 100) (=> (1 20): (x y) (x + y z).')

    seval(11, '(let summer (@:class add: (= () ((this x) + (this y). (let s (summer of (@ x: 1 y: 10). (s add)')
    seval(11, '(let summer (@:class type: (@ add: (= (x y ) (+ x y). (summer add 1 10)')
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./web/index.js":
/*!**********************!*\
  !*** ./web/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var sugly = __webpack_require__(/*! ../sugly */ "./sugly.js")
var defaultTerm = __webpack_require__(/*! ./lib/term */ "./web/lib/term.js")
var defaultStdout = __webpack_require__(/*! ./lib/stdout */ "./web/lib/stdout.js")
var defaultLoader = __webpack_require__(/*! ../lib/loader */ "./lib/loader.js")

function ensure (factory, alternative) {
  return typeof factory === 'function' ? factory : alternative
}

module.exports = function (term, stdout, loader) {
  term = ensure(term, defaultTerm)()
  stdout = ensure(stdout, defaultStdout)(term)
  loader = ensure(loader, defaultLoader)

  var $void = sugly(stdout, loader)
  $void.env('home', window.location.origin)
  $void.env('user-home', window.location.origin)
  $void.env('os', window.navigator.userAgent)

  var bootstrap = $void.createBootstrapSpace(window.location.origin + '/@')

  function run (app, context) {
    return initialize(context, function () {
      return $void.$run(app)
    })
  }

  function initialize (context, main) {
    var preparing = prepare(context)
    var prepared = preparing(bootstrap, $void)
    return !(prepared instanceof Promise) ? main()
      : new Promise(function (resolve, reject) {
        prepared.then(function () {
          resolve(main())
        }, reject)
      })
  }

  function prepare (context) {
    return typeof context === 'function'
      ? context // a customized initializer function.
      : typeof context === 'string'
        ? executor.bind(null, context) // an initializatoin profile.
        : Array.isArray(context) ? function () {
          // a list of dependency modules
          return bootstrap.$fetch(context)
        } : function () {
          // try to fetch the default root module loader.
          return bootstrap.$fetch('@')
        }
  }

  function executor (profile) {
    return new Promise(function (resolve, reject) {
      bootstrap.$fetch(profile).then(function () {
        resolve(bootstrap.$load(profile))
      }, reject)
    })
  }

  function shell (args, context) {
    // export global shell commands
    $void.$['test-bootstrap'] = __webpack_require__(/*! ../test/test */ "./test/test.js")($void)

    // generate shell agent.
    return initialize(context, function () {
      var reader = __webpack_require__(/*! ./lib/stdin */ "./web/lib/stdin.js")($void, term)
      var agent = __webpack_require__(/*! ../lib/shell */ "./lib/shell.js")($void, reader,
        __webpack_require__(/*! ./lib/process */ "./web/lib/process.js")($void)
      )
      agent(args, term.echo)
      return reader.open()
    })
  }

  return function sugly (context, app) {
    return typeof app === 'string' ? run(app, context)
      : shell(Array.isArray(app) ? app : [], context)
  }
}


/***/ }),

/***/ "./web/lib/process.js":
/*!****************************!*\
  !*** ./web/lib/process.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function safePathname (pathname) {
  var offset = pathname.indexOf('?')
  if (offset >= 0) {
    pathname = pathname.substring(0, offset)
  }
  return pathname || ''
}

function safeDirname (pathname) {
  var offset = pathname.lastIndexOf('/')
  return offset <= 0 ? ''
    : offset === (pathname.length - 1) ? pathname
      : pathname.substring(0, offset) || ''
}

function reload (print) {
  var counter = 3
  setInterval(function () {
    if (counter > 0) {
      print(counter--)
    } else {
      window.location.reload()
    }
  }, 500)
  return 'reloading ...'
}

module.exports = function ($void, environ, exit) {
  environ = Object.assign(Object.create(null), environ)

  var location = window.location
  environ['_'] = location.href

  var origin = location.origin || (location.protocol + '://' + location.host)
  environ['HOME'] = origin

  var pathname = safePathname(location.pathname)
  environ['PATH'] = origin + pathname
  environ['PWD'] = origin + safeDirname(pathname)

  return {
    env: function (name) {
      if (typeof name !== 'string') {
        return null
      }
      var value = environ[name]
      return typeof value === 'string' ? value : null
    },
    exit: function (code) {
      code = typeof code === 'number' ? code >> 0 : 1
      return typeof exit === 'function' ? exit(code) : reload(function (counter) {
        switch (counter) {
          case 1:
            return $void.$printf('.' + counter, 'red')
          case 2:
            return $void.$printf('..' + counter, 'yellow')
          default:
            return $void.$printf('...' + counter, 'blue')
        }
      })
    }
  }
}


/***/ }),

/***/ "./web/lib/shell.js":
/*!**************************!*\
  !*** ./web/lib/shell.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// expose the creator function by default.
window.$void = __webpack_require__(/*! ../index */ "./web/index.js")

window.onload = function () {
  // generate and expose a default runner function.
  window.$sugly = window.$void(/* term, stdout, loader */)

  // start shell and expose the shell's reader function.
  var shell = window.$sugly(/* context, app (to run) or args (for shell) */)
  shell instanceof Promise ? shell.then(function (sh) {
    window.$shell = sh
    console.info('shell is ready now.')
  }) : (window.$shell = shell)

  if (!window.$shell) {
    console.info('waiting shell to be ready ...')
  } else {
    console.info('shell is ready.')
  }
}


/***/ }),

/***/ "./web/lib/stdin.js":
/*!**************************!*\
  !*** ./web/lib/stdin.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function ($void, term) {
  var interpreter = null
  var reader = function (line) {
    return interpreter && interpreter(line)
  }

  return {
    prompt: term.prompt,
    open: function () {
      return term.connect(reader)
    },
    on: function (event, callback) {
      // only allow line event now.
      switch (event) {
        case 'line':
          interpreter = callback
          return event
        default:
          return null
      }
    },
    close: function () {
      term.disconnect()
    }
  }
}


/***/ }),

/***/ "./web/lib/stdout.js":
/*!***************************!*\
  !*** ./web/lib/stdout.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tracer = __webpack_require__(/*! ../../lib/stdout */ "./lib/stdout.js")

function connectTo (term, tracing, type) {
  return function () {
    var trace = tracing[type]
    var text = trace.apply(null, arguments)
    term[type](text)
    return text
  }
}

module.exports = function (term) {
  return function ($void) {
    var tracing = tracer($void, true)
    var connect = connectTo.bind(null, term, tracing)
    var stdout = {}
    for (var type in tracing) {
      stdout[type] = type !== 'printf' ? connect(type)
        : function (value, format) {
          value = tracing.printf(value)
          term.printf(value, format)
          return value
        }
    }
    return stdout
  }
}


/***/ }),

/***/ "./web/lib/term.js":
/*!*************************!*\
  !*** ./web/lib/term.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MaxLines = 4800
var DrainBatch = 300

var KeyEnter = 0x0D
var KeyUpArrow = 0x26
var KeyDownArrow = 0x28

// the key to be used in localStorage
var InputHistoryKey = '~/.sugly_history'

// Firefox, IE and Edge require a non-zero timeout to refresh UI.
var MinimalDelay = 20 // milliseconds

var pool = []
var spooling = false
var panel, input, enter

function enqueue (todo) {
  if (pool.length > MaxLines) {
    pool = pool.slice(MaxLines / 2)
  }
  pool.push(todo)
}

function drain () {
  if (pool.length < 1) { return }
  setTimeout(function () {
    var todos = pool.splice(0, DrainBatch)
    for (var i = 0, len = todos.length; i < len; i++) {
      var todo = todos[i]
      todo[0](todo[1], todo[2], true)
    }
    drain()
  }, MinimalDelay)
}

function updatePanel () {
  if (panel.childElementCount > MaxLines) {
    var half = MaxLines / 2
    while (panel.childElementCount > half) {
      panel.removeChild(panel.firstElementChild)
    }
  }
  window.scrollTo(0, document.body.scrollHeight)
  input.focus()
}

var currentLine = null

function writeTo (panel) {
  function write (text, render, draining) {
    if (!draining && (spooling || pool.length > 0)) {
      return enqueue([write, text, render])
    }
    var lines = text.split('\n')
    var spans = []
    var i = 0
    var len = lines.length
    for (; i < len; i++) {
      var line = lines[i]
      line ? spans.push(
        appendText(currentLine || (currentLine = createNewLine()), line)
      ) : currentLine = currentLine ? null
        : createNewLine(document.createElement('br'))
    }
    if (render && spans.length > 0) {
      for (i = 0, len = spans.length; i < len; i++) { render(spans[i]) }
    }
    updatePanel()
  }
  return write
}

function createNewLine (child) {
  var li = document.createElement('li')
  li.className = 'print'
  if (child) {
    li.appendChild(child)
  }
  panel.appendChild(li)
  return li
}

function appendText (li, text) {
  var span = document.createElement('span')
  span.className = 'text'
  span.appendChild(document.createTextNode(replaceWhitespace(text)))
  li.appendChild(span)
  return span
}

function styleOf (format) {
  var style = ''
  for (var key in format) {
    var value = format[key]
    if (typeof value === 'string') {
      style += key + ': ' + value + ';'
    }
  }
  return style
}

var styleClasses = Object.assign(Object.create(null), {
  red: 'color',
  green: 'color',
  blue: 'color',
  yellow: 'color',
  grey: 'color',
  gray: 'color',
  underline: '*text-decoration',
  overline: '*text-decoration',
  'line-through': '*text-decoration'
})

function applyClass (cls) {
  var values = cls.split(/\s/)
  var style = {}
  for (var i = 0; i < values.length; i++) {
    var value = values[i]
    if (styleClasses[value]) {
      var key = styleClasses[value]
      if (key.startsWith('*')) {
        key = key.substring(1)
        style[key] = style[key] ? style[key] + ' ' + value : value
      } else {
        style[key] = value
      }
    }
  }
  return applyStyle(style)
}

function applyStyle (obj) {
  var style = styleOf(obj)
  return style && function (span) {
    span.style.cssText = style
  }
}

function logTo (panel, type, max) {
  function log (prompt, text, draining) {
    if (!draining && (spooling || pool.length > 0)) {
      return enqueue([log, prompt, text])
    }
    if (max && text.length > max) {
      text = text.substring(0, max - 10) + '... ... ...' +
        text.substring(text.length - 10) +
        ' # use (print ...) to display all text.'
    }
    var lines = text.split('\n')
    for (var i = 0, len = lines.length; i < len; i++) {
      var li = document.createElement('li')
      li.className = type
      lines[i] ? appendLine(li, lines[i], i > 0 ? '' : prompt)
        : li.appendChild(document.createElement('br'))
      panel.appendChild(li)
    }
    updatePanel()
  }
  return log
}

function appendLine (li, text, prompt) {
  var span = document.createElement('span')
  span.className = 'prompt'
  if (prompt) {
    span.appendChild(document.createTextNode(prompt))
  }
  li.appendChild(span)
  span = document.createElement('span')
  span.className = 'text'
  span.appendChild(document.createTextNode(replaceWhitespace(text)))
  li.appendChild(span)
}

function replaceWhitespace (text) {
  var spaces = ''
  for (var i = 0; i < text.length; i++) {
    if (!/\s/.test(text.charAt(i))) {
      return spaces + text.slice(i)
    } else {
      spaces += '\u00A0'
    }
  }
  return text
}

function loadHistory () {
  if (!window.localStorage) {
    return []
  }
  var data = window.localStorage.getItem(InputHistoryKey)
  if (!data) {
    return []
  }
  try {
    var history = JSON.parse(data)
    return Array.isArray(history) ? history : []
  } catch (err) {
    console.warn('failed to load input history:', err)
    return []
  }
}

function updateHistory (records, value) {
  if (records.length > 0 && records[records.length - 1] === value) {
    return records.length
  }
  records.push(value)
  if (records.length > 1000) {
    records = records.slice(-1000)
  }
  if (window.localStorage) {
    try {
      window.localStorage.setItem(InputHistoryKey, JSON.stringify(records))
    } catch (err) {
      console.warn('failed to save input history:', err)
    }
  }
  return records.length
}

function bindInput (term) {
  var inputHistory = loadHistory()
  var inputOffset = inputHistory.length
  var inputValue = ''

  function exec (value) {
    if (term.reader) {
      setTimeout(function () {
        spooling = true
        term.reader(value)
        spooling = false
        drain()
      }, MinimalDelay)
    }
  }

  enter.onclick = function () {
    if (!input.value) {
      return
    }
    var value = input.value
    input.value = ''
    inputValue = ''
    inputOffset = updateHistory(inputHistory, value)
    term.input(value)
    exec(value)
  }
  input.addEventListener('keypress', function (event) {
    if (event.keyCode === KeyEnter) {
      event.preventDefault()
      enter.onclick()
    }
  })
  input.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
      case KeyUpArrow:
        (inputOffset === inputHistory.length) && (inputValue = input.value)
        if (--inputOffset >= 0 && inputOffset < inputHistory.length) {
          input.value = inputHistory[inputOffset]
        } else {
          inputOffset = inputHistory.length
          input.value = inputValue
        }
        break
      case KeyDownArrow:
        (inputOffset === inputHistory.length) && (inputValue = input.value)
        if (++inputOffset < inputHistory.length) {
          input.value = inputHistory[inputOffset]
        } else if (inputOffset > inputHistory.length) {
          inputOffset = 0
          if (inputOffset < inputHistory.length) {
            input.value = inputOffset < inputHistory.length
              ? inputHistory[inputOffset] : ''
          }
        } else {
          input.value = inputValue
        }
        break
      default:
        return
    }
    event.preventDefault()
  })
  input.focus()
}

module.exports = function () {
  var term = {}
  panel = document.getElementById('stdout-panel')
  input = document.getElementById('stdin-input')
  enter = document.getElementById('stdin-enter')

  // serve stdout
  var writerOf = writeTo.bind(null, panel)
  var write = writerOf('print')
  term.print = function (text) {
    write(text.charAt(text.length - 1) === '\n' ? text : text + '\n')
  }
  term.printf = function (text, format) {
    var render = typeof format === 'string' ? applyClass(format)
      : typeof format === 'object' ? applyStyle(format) : null
    write(text, render)
  }

  // serve stderr
  var loggerOf = logTo.bind(null, panel)
  term.verbose = loggerOf('verbose').bind(null, '#V')
  term.info = loggerOf('info').bind(null, '#I')
  term.warn = loggerOf('warn').bind(null, '#W')
  term.error = loggerOf('error').bind(null, '#E')
  term.debug = loggerOf('debug').bind(null, '#D')

  // serve shell
  term.echo = loggerOf('echo', 80).bind(null, '=')

  // serve stdin
  var inputPrompt = '>'
  var prompt = document.getElementById('stdin-prompt')
  term.prompt = function (text) {
    if (text) {
      prompt.innerText = inputPrompt = text
    }
  }
  var writeInput = loggerOf('input')
  term.input = function (text) {
    writeInput(inputPrompt, text)
  }
  bindInput(term)
  term.connect = function (reader) {
    return (term.reader = typeof reader === 'function' ? reader : null)
  }
  term.disconnect = function () {
    term.reader = null
  }
  return term
}


/***/ })

/******/ });
//# sourceMappingURL=sugly.map