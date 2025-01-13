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

// node_modules/zod/lib/index.mjs
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base642 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base642));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a) {
    return false;
  }
}
function isValidCidr(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
function custom(check, params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      if (!check(data)) {
        const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
        const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
        const p2 = typeof p === "string" ? { message: p } : p;
        ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
      }
    });
  return ZodAny.create();
}
var util, objectUtil, ZodParsedType, getParsedType, ZodIssueCode, quotelessJson, ZodError, errorMap, overrideErrorMap, makeIssue, EMPTY_PATH, ParseStatus, INVALID, DIRTY, OK, isAborted, isDirty, isValid, isAsync, errorUtil, _ZodEnum_cache, _ZodNativeEnum_cache, ParseInputLazyPath, handleResult, ZodType, cuidRegex, cuid2Regex, ulidRegex, uuidRegex, nanoidRegex, jwtRegex, durationRegex, emailRegex, _emojiRegex, emojiRegex, ipv4Regex, ipv4CidrRegex, ipv6Regex, ipv6CidrRegex, base64Regex, base64urlRegex, dateRegexSource, dateRegex, ZodString, ZodNumber, ZodBigInt, ZodBoolean, ZodDate, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodArray, ZodObject, ZodUnion, getDiscriminator, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodFunction, ZodLazy, ZodLiteral, ZodEnum, ZodNativeEnum, ZodPromise, ZodEffects, ZodOptional, ZodNullable, ZodDefault, ZodCatch, ZodNaN, BRAND, ZodBranded, ZodPipeline, ZodReadonly, late, ZodFirstPartyTypeKind, instanceOfType, stringType, numberType, nanType, bigIntType, booleanType, dateType, symbolType, undefinedType, nullType, anyType, unknownType, neverType, voidType, arrayType, objectType, strictObjectType, unionType, discriminatedUnionType, intersectionType, tupleType, recordType, mapType, setType, functionType, lazyType, literalType, enumType, nativeEnumType, promiseType, effectsType, optionalType, nullableType, preprocessType, pipelineType, ostring, onumber, oboolean, coerce, NEVER, z;
var init_lib = __esm({
  "node_modules/zod/lib/index.mjs"() {
    (function(util2) {
      util2.assertEqual = (val) => val;
      function assertIs(_arg) {
      }
      util2.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      util2.assertNever = assertNever;
      util2.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util2.getValidEnumValues = (obj) => {
        const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util2.objectValues(filtered);
      };
      util2.objectValues = (obj) => {
        return util2.objectKeys(obj).map(function(e) {
          return obj[e];
        });
      };
      util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util2.find = (arr2, checker) => {
        for (const item of arr2) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      util2.joinValues = joinValues;
      util2.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util || (util = {}));
    (function(objectUtil2) {
      objectUtil2.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
          // second overwrites first
        };
      };
    })(objectUtil || (objectUtil = {}));
    ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "undefined":
          return ZodParsedType.undefined;
        case "string":
          return ZodParsedType.string;
        case "number":
          return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
          return ZodParsedType.boolean;
        case "function":
          return ZodParsedType.function;
        case "bigint":
          return ZodParsedType.bigint;
        case "symbol":
          return ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return ZodParsedType.array;
          }
          if (data === null) {
            return ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return ZodParsedType.date;
          }
          return ZodParsedType.object;
        default:
          return ZodParsedType.unknown;
      }
    };
    ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    quotelessJson = (obj) => {
      const json = JSON.stringify(obj, null, 2);
      return json.replace(/"([^"]+)":/g, "$1:");
    };
    ZodError = class _ZodError extends Error {
      get errors() {
        return this.issues;
      }
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
          for (const issue of error.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < issue.path.length) {
                const el = issue.path[i];
                const terminal = i === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        };
        processError(this);
        return fieldErrors;
      }
      static assert(value) {
        if (!(value instanceof _ZodError)) {
          throw new Error(`Not a ZodError: ${value}`);
        }
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
    };
    errorMap = (issue, _ctx) => {
      let message;
      switch (issue.code) {
        case ZodIssueCode.invalid_type:
          if (issue.received === ZodParsedType.undefined) {
            message = "Required";
          } else {
            message = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodIssueCode.invalid_literal:
          message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
          break;
        case ZodIssueCode.unrecognized_keys:
          message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodIssueCode.invalid_union:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_union_discriminator:
          message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
          break;
        case ZodIssueCode.invalid_enum_value:
          message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodIssueCode.invalid_arguments:
          message = `Invalid function arguments`;
          break;
        case ZodIssueCode.invalid_return_type:
          message = `Invalid function return type`;
          break;
        case ZodIssueCode.invalid_date:
          message = `Invalid date`;
          break;
        case ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("includes" in issue.validation) {
              message = `Invalid input: must include "${issue.validation.includes}"`;
              if (typeof issue.validation.position === "number") {
                message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
              }
            } else if ("startsWith" in issue.validation) {
              message = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message = `Invalid ${issue.validation}`;
          } else {
            message = "Invalid";
          }
          break;
        case ZodIssueCode.too_small:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.too_big:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "bigint")
            message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.custom:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_intersection_types:
          message = `Intersection results could not be merged`;
          break;
        case ZodIssueCode.not_multiple_of:
          message = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodIssueCode.not_finite:
          message = "Number must be finite";
          break;
        default:
          message = _ctx.defaultError;
          util.assertNever(issue);
      }
      return { message };
    };
    overrideErrorMap = errorMap;
    makeIssue = (params) => {
      const { data, path, errorMaps, issueData } = params;
      const fullPath = [...path, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      if (issueData.message !== void 0) {
        return {
          ...issueData,
          path: fullPath,
          message: issueData.message
        };
      }
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: errorMessage
      };
    };
    EMPTY_PATH = [];
    ParseStatus = class _ParseStatus {
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
          if (s.status === "aborted")
            return INVALID;
          if (s.status === "dirty")
            status.dirty();
          arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value
          });
        }
        return _ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return INVALID;
          if (value.status === "aborted")
            return INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    INVALID = Object.freeze({
      status: "aborted"
    });
    DIRTY = (value) => ({ status: "dirty", value });
    OK = (value) => ({ status: "valid", value });
    isAborted = (x) => x.status === "aborted";
    isDirty = (x) => x.status === "dirty";
    isValid = (x) => x.status === "valid";
    isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
    (function(errorUtil2) {
      errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
    })(errorUtil || (errorUtil = {}));
    ParseInputLazyPath = class {
      constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
      }
      get path() {
        if (!this._cachedPath.length) {
          if (this._key instanceof Array) {
            this._cachedPath.push(...this._path, ...this._key);
          } else {
            this._cachedPath.push(...this._path, this._key);
          }
        }
        return this._cachedPath;
      }
    };
    handleResult = (ctx, result) => {
      if (isValid(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        return {
          success: false,
          get error() {
            if (this._error)
              return this._error;
            const error = new ZodError(ctx.common.issues);
            this._error = error;
            return this._error;
          }
        };
      }
    };
    ZodType = class {
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return getParsedType(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        var _a;
        const ctx = {
          common: {
            issues: [],
            async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
            contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
          },
          path: (params === null || params === void 0 ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      "~validate"(data) {
        var _a, _b;
        const ctx = {
          common: {
            issues: [],
            async: !!this["~standard"].async
          },
          path: [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        if (!this["~standard"].async) {
          try {
            const result = this._parseSync({ data, path: [], parent: ctx });
            return isValid(result) ? {
              value: result.value
            } : {
              issues: ctx.common.issues
            };
          } catch (err) {
            if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
              this["~standard"].async = true;
            }
            ctx.common = {
              issues: [],
              async: true
            };
          }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        });
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
            async: true
          },
          path: (params === null || params === void 0 ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message) {
        const getIssueProperties = (val) => {
          if (typeof message === "string" || typeof message === "undefined") {
            return { message };
          } else if (typeof message === "function") {
            return message(val);
          } else {
            return message;
          }
        };
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = () => ctx.addIssue({
            code: ZodIssueCode.custom,
            ...getIssueProperties(val)
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
          version: 1,
          vendor: "zod",
          validate: (data) => this["~validate"](data)
        };
      }
      optional() {
        return ZodOptional.create(this, this._def);
      }
      nullable() {
        return ZodNullable.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return ZodArray.create(this);
      }
      promise() {
        return ZodPromise.create(this, this._def);
      }
      or(option) {
        return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
        return new ZodEffects({
          ...processCreateParams(this._def),
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(this._def)
        });
      }
      catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: catchValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      readonly() {
        return ZodReadonly.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    cuidRegex = /^c[^\s-]{8,}$/i;
    cuid2Regex = /^[0-9a-z]+$/;
    ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
    uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    nanoidRegex = /^[a-z0-9_-]{21}$/i;
    jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
    _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
    ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
    dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
    dateRegex = new RegExp(`^${dateRegexSource}$`);
    ZodString = class _ZodString extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "email",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "emoji") {
            if (!emojiRegex) {
              emojiRegex = new RegExp(_emojiRegex, "u");
            }
            if (!emojiRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "uuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "nanoid") {
            if (!nanoidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "nanoid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid2",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ulid") {
            if (!ulidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ulid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch (_a) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "regex",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "includes") {
            if (!input.data.includes(check.value, check.position)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { includes: check.value, position: check.position },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "toLowerCase") {
            input.data = input.data.toLowerCase();
          } else if (check.kind === "toUpperCase") {
            input.data = input.data.toUpperCase();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "date") {
            const regex = dateRegex;
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "date",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "time") {
            const regex = timeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "time",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "duration") {
            if (!durationRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ip") {
            if (!isValidIP(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ip",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "jwt") {
            if (!isValidJWT(input.data, check.alg)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "jwt",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cidr") {
            if (!isValidCidr(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cidr",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64") {
            if (!base64Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64url") {
            if (!base64urlRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
          validation,
          code: ZodIssueCode.invalid_string,
          ...errorUtil.errToObj(message)
        });
      }
      _addCheck(check) {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
      }
      url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
      }
      emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
      }
      uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
      }
      nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
      }
      cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
      }
      cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
      }
      ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
      }
      base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
      }
      base64url(message) {
        return this._addCheck({
          kind: "base64url",
          ...errorUtil.errToObj(message)
        });
      }
      jwt(options) {
        return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
      }
      ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
      }
      cidr(options) {
        return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
      }
      datetime(options) {
        var _a, _b;
        if (typeof options === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            local: false,
            message: options
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
          offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
          local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
          ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
      }
      date(message) {
        return this._addCheck({ kind: "date", message });
      }
      time(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "time",
            precision: null,
            message: options
          });
        }
        return this._addCheck({
          kind: "time",
          precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
          ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
      }
      duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
      }
      regex(regex, message) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil.errToObj(message)
        });
      }
      includes(value, options) {
        return this._addCheck({
          kind: "includes",
          value,
          position: options === null || options === void 0 ? void 0 : options.position,
          ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
      }
      startsWith(value, message) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      endsWith(value, message) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      min(minLength, message) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil.errToObj(message)
        });
      }
      max(maxLength, message) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil.errToObj(message)
        });
      }
      length(len, message) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil.errToObj(message)
        });
      }
      /**
       * Equivalent to `.min(1)`
       */
      nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
      }
      trim() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      toLowerCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toLowerCase" }]
        });
      }
      toUpperCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toUpperCase" }]
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
      }
      get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
      }
      get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
      }
      get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
      }
      get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
      }
      get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
      }
      get isBase64url() {
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodString.create = (params) => {
      var _a;
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params)
      });
    };
    ZodNumber = class _ZodNumber extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.number,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message) {
        return this._addCheck({
          kind: "int",
          message: errorUtil.toString(message)
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      finite(message) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil.toString(message)
        });
      }
      safe(message) {
        return this._addCheck({
          kind: "min",
          inclusive: true,
          value: Number.MIN_SAFE_INTEGER,
          message: errorUtil.toString(message)
        })._addCheck({
          kind: "max",
          inclusive: true,
          value: Number.MAX_SAFE_INTEGER,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
      }
      get isFinite() {
        let max = null, min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return Number.isFinite(min) && Number.isFinite(max);
      }
    };
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params)
      });
    };
    ZodBigInt = class _ZodBigInt extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
      }
      _parse(input) {
        if (this._def.coerce) {
          try {
            input.data = BigInt(input.data);
          } catch (_a) {
            return this._getInvalidInput(input);
          }
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
          return this._getInvalidInput(input);
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                type: "bigint",
                minimum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                type: "bigint",
                maximum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (input.data % check.value !== BigInt(0)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.bigint,
          received: ctx.parsedType
        });
        return INVALID;
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodBigInt({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodBigInt({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodBigInt.create = (params) => {
      var _a;
      return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params)
      });
    };
    ZodBoolean = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params)
      });
    };
    ZodDate = class _ZodDate extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.date,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        if (isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_date
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new _ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      max(maxDate, message) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    ZodSymbol = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    ZodUndefined = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    ZodNull = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.null,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    ZodAny = class extends ZodType {
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    ZodUnknown = class extends ZodType {
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    ZodNever = class extends ZodType {
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.never,
          received: ctx.parsedType
        });
        return INVALID;
      }
    };
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    ZodVoid = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.void,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    ZodArray = class _ZodArray extends ZodType {
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            addIssueToContext(ctx, {
              code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all([...ctx.data].map((item, i) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          })).then((result2) => {
            return ParseStatus.mergeArray(status, result2);
          });
        }
        const result = [...ctx.data].map((item, i) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message) {
        return new _ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil.toString(message) }
        });
      }
      max(maxLength, message) {
        return new _ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil.toString(message) }
        });
      }
      length(len, message) {
        return new _ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil.toString(message) }
        });
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodArray.create = (schema, params) => {
      return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    ZodObject = class _ZodObject extends ZodType {
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = this.extend;
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        return this._cached = { shape, keys };
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") ;
          else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
                //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                key,
                value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message) {
        errorUtil.errToObj;
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message !== void 0 ? {
            errorMap: (issue, ctx) => {
              var _a, _b, _c, _d;
              const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
                };
              return {
                message: defaultError
              };
            }
          } : {}
        });
      }
      strip() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      // const AugmentFactory =
      //   <Def extends ZodObjectDef>(def: Def) =>
      //   <Augmentation extends ZodRawShape>(
      //     augmentation: Augmentation
      //   ): ZodObject<
      //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
      //     Def["unknownKeys"],
      //     Def["catchall"]
      //   > => {
      //     return new ZodObject({
      //       ...def,
      //       shape: () => ({
      //         ...def.shape(),
      //         ...augmentation,
      //       }),
      //     }) as any;
      //   };
      extend(augmentation) {
        return new _ZodObject({
          ...this._def,
          shape: () => ({
            ...this._def.shape(),
            ...augmentation
          })
        });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
        const merged = new _ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: () => ({
            ...this._def.shape(),
            ...merging._def.shape()
          }),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      // merge<
      //   Incoming extends AnyZodObject,
      //   Augmentation extends Incoming["shape"],
      //   NewOutput extends {
      //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
      //       ? Augmentation[k]["_output"]
      //       : k extends keyof Output
      //       ? Output[k]
      //       : never;
      //   },
      //   NewInput extends {
      //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
      //       ? Augmentation[k]["_input"]
      //       : k extends keyof Input
      //       ? Input[k]
      //       : never;
      //   }
      // >(
      //   merging: Incoming
      // ): ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"],
      //   NewOutput,
      //   NewInput
      // > {
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      setKey(key, schema) {
        return this.augment({ [key]: schema });
      }
      // merge<Incoming extends AnyZodObject>(
      //   merging: Incoming
      // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
      // ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"]
      // > {
      //   // const mergedShape = objectUtil.mergeShapes(
      //   //   this._def.shape(),
      //   //   merging._def.shape()
      //   // );
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      catchall(index) {
        return new _ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape = {};
        util.objectKeys(mask).forEach((key) => {
          if (mask[key] && this.shape[key]) {
            shape[key] = this.shape[key];
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      omit(mask) {
        const shape = {};
        util.objectKeys(this.shape).forEach((key) => {
          if (!mask[key]) {
            shape[key] = this.shape[key];
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      /**
       * @deprecated
       */
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
          const fieldSchema = this.shape[key];
          if (mask && !mask[key]) {
            newShape[key] = fieldSchema;
          } else {
            newShape[key] = fieldSchema.optional();
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      required(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
          if (mask && !mask[key]) {
            newShape[key] = this.shape[key];
          } else {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        });
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      keyof() {
        return createZodEnum(util.objectKeys(this.shape));
      }
    };
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return Promise.all(options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError(issues2));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
      } else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
      } else if (type instanceof ZodLiteral) {
        return [type.value];
      } else if (type instanceof ZodEnum) {
        return type.options;
      } else if (type instanceof ZodNativeEnum) {
        return util.objectValues(type.enum);
      } else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
      } else if (type instanceof ZodUndefined) {
        return [void 0];
      } else if (type instanceof ZodNull) {
        return [null];
      } else if (type instanceof ZodOptional) {
        return [void 0, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
      } else {
        return [];
      }
    };
    ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator]
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        } else {
          return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        }
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      /**
       * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
       * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
       * have a different value for each object in the union.
       * @param discriminator the name of the discriminator property
       * @param types an array of object schemas
       * @param params
       */
      static create(discriminator, options, params) {
        const optionsMap = /* @__PURE__ */ new Map();
        for (const type of options) {
          const discriminatorValues = getDiscriminator(type.shape[discriminator]);
          if (!discriminatorValues.length) {
            throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
          }
          for (const value of discriminatorValues) {
            if (optionsMap.has(value)) {
              throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
            }
            optionsMap.set(value, type);
          }
        }
        return new _ZodDiscriminatedUnion({
          typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
          discriminator,
          options,
          optionsMap,
          ...processCreateParams(params)
        });
      }
    };
    ZodIntersection = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
          if (isAborted(parsedLeft) || isAborted(parsedRight)) {
            return INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_intersection_types
            });
            return INVALID;
          }
          if (isDirty(parsedLeft) || isDirty(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    ZodTuple = class _ZodTuple extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = [...ctx.data].map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          if (!schema)
            return null;
          return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return ParseStatus.mergeArray(status, results);
          });
        } else {
          return ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new _ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    ZodRecord = class _ZodRecord extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
          pairs.push({
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (ctx.common.async) {
          return ParseStatus.mergeObjectAsync(status, pairs);
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get element() {
        return this._def.valueType;
      }
      static create(first, second, third) {
        if (second instanceof ZodType) {
          return new _ZodRecord({
            keyType: first,
            valueType: second,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(third)
          });
        }
        return new _ZodRecord({
          keyType: ZodString.create(),
          valueType: first,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(second)
        });
      }
    };
    ZodMap = class extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.map,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    ZodSet = class _ZodSet extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.set,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message) {
        return new _ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil.toString(message) }
        });
      }
      max(maxSize, message) {
        return new _ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil.toString(message) }
        });
      }
      size(size, message) {
        return this.min(size, message).max(size, message);
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    ZodFunction = class _ZodFunction extends ZodType {
      constructor() {
        super(...arguments);
        this.validate = this.implement;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.function,
            received: ctx.parsedType
          });
          return INVALID;
        }
        function makeArgsIssue(args, error) {
          return makeIssue({
            data: args,
            path: ctx.path,
            errorMaps: [
              ctx.common.contextualErrorMap,
              ctx.schemaErrorMap,
              getErrorMap(),
              errorMap
            ].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_arguments,
              argumentsError: error
            }
          });
        }
        function makeReturnsIssue(returns, error) {
          return makeIssue({
            data: returns,
            path: ctx.path,
            errorMaps: [
              ctx.common.contextualErrorMap,
              ctx.schemaErrorMap,
              getErrorMap(),
              errorMap
            ].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_return_type,
              returnTypeError: error
            }
          });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
          const me = this;
          return OK(async function(...args) {
            const error = new ZodError([]);
            const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
              error.addIssue(makeArgsIssue(args, e));
              throw error;
            });
            const result = await Reflect.apply(fn, this, parsedArgs);
            const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
              error.addIssue(makeReturnsIssue(result, e));
              throw error;
            });
            return parsedReturns;
          });
        } else {
          const me = this;
          return OK(function(...args) {
            const parsedArgs = me._def.args.safeParse(args, params);
            if (!parsedArgs.success) {
              throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
            }
            const result = Reflect.apply(fn, this, parsedArgs.data);
            const parsedReturns = me._def.returns.safeParse(result, params);
            if (!parsedReturns.success) {
              throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
            }
            return parsedReturns.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...items) {
        return new _ZodFunction({
          ...this._def,
          args: ZodTuple.create(items).rest(ZodUnknown.create())
        });
      }
      returns(returnType) {
        return new _ZodFunction({
          ...this._def,
          returns: returnType
        });
      }
      implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      static create(args, returns, params) {
        return new _ZodFunction({
          args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
          returns: returns || ZodUnknown.create(),
          typeName: ZodFirstPartyTypeKind.ZodFunction,
          ...processCreateParams(params)
        });
      }
    };
    ZodLazy = class extends ZodType {
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    ZodLiteral = class extends ZodType {
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    ZodEnum = class _ZodEnum extends ZodType {
      constructor() {
        super(...arguments);
        _ZodEnum_cache.set(this, void 0);
      }
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
          __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      extract(values, newDef = this._def) {
        return _ZodEnum.create(values, {
          ...this._def,
          ...newDef
        });
      }
      exclude(values, newDef = this._def) {
        return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
          ...this._def,
          ...newDef
        });
      }
    };
    _ZodEnum_cache = /* @__PURE__ */ new WeakMap();
    ZodEnum.create = createZodEnum;
    ZodNativeEnum = class extends ZodType {
      constructor() {
        super(...arguments);
        _ZodNativeEnum_cache.set(this, void 0);
      }
      _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
          __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    _ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    ZodPromise = class extends ZodType {
      unwrap() {
        return this._def.type;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.promise,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    ZodPromise.create = (schema, params) => {
      return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    ZodEffects = class extends ZodType {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
          addIssue: (arg) => {
            addIssueToContext(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          },
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(processed).then(async (processed2) => {
              if (status.value === "aborted")
                return INVALID;
              const result = await this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
              if (result.status === "aborted")
                return INVALID;
              if (result.status === "dirty")
                return DIRTY(result.value);
              if (status.value === "dirty")
                return DIRTY(result.value);
              return result;
            });
          } else {
            if (status.value === "aborted")
              return INVALID;
            const result = this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          }
        }
        if (effect.type === "refinement") {
          const executeRefinement = (acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          };
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!isValid(base))
              return base;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!isValid(base))
                return base;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
            });
          }
        }
        util.assertNever(effect);
      }
    };
    ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    ZodOptional = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
          return OK(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    ZodNullable = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
          return OK(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    ZodDefault = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    ZodCatch = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const newCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          }
        };
        const result = this._def.innerType._parse({
          data: newCtx.data,
          path: newCtx.path,
          parent: {
            ...newCtx
          }
        });
        if (isAsync(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data
              })
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        }
      }
      removeCatch() {
        return this._def.innerType;
      }
    };
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params)
      });
    };
    ZodNaN = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.nan,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    BRAND = Symbol("zod_brand");
    ZodBranded = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    ZodPipeline = class _ZodPipeline extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return DIRTY(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          };
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a, b) {
        return new _ZodPipeline({
          in: a,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    ZodReadonly = class extends ZodType {
      _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
          if (isValid(data)) {
            data.value = Object.freeze(data.value);
          }
          return data;
        };
        return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodReadonly.create = (type, params) => {
      return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params)
      });
    };
    late = {
      object: ZodObject.lazycreate
    };
    (function(ZodFirstPartyTypeKind2) {
      ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
      ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
    })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
    instanceOfType = (cls, params = {
      message: `Input not instance of ${cls.name}`
    }) => custom((data) => data instanceof cls, params);
    stringType = ZodString.create;
    numberType = ZodNumber.create;
    nanType = ZodNaN.create;
    bigIntType = ZodBigInt.create;
    booleanType = ZodBoolean.create;
    dateType = ZodDate.create;
    symbolType = ZodSymbol.create;
    undefinedType = ZodUndefined.create;
    nullType = ZodNull.create;
    anyType = ZodAny.create;
    unknownType = ZodUnknown.create;
    neverType = ZodNever.create;
    voidType = ZodVoid.create;
    arrayType = ZodArray.create;
    objectType = ZodObject.create;
    strictObjectType = ZodObject.strictCreate;
    unionType = ZodUnion.create;
    discriminatedUnionType = ZodDiscriminatedUnion.create;
    intersectionType = ZodIntersection.create;
    tupleType = ZodTuple.create;
    recordType = ZodRecord.create;
    mapType = ZodMap.create;
    setType = ZodSet.create;
    functionType = ZodFunction.create;
    lazyType = ZodLazy.create;
    literalType = ZodLiteral.create;
    enumType = ZodEnum.create;
    nativeEnumType = ZodNativeEnum.create;
    promiseType = ZodPromise.create;
    effectsType = ZodEffects.create;
    optionalType = ZodOptional.create;
    nullableType = ZodNullable.create;
    preprocessType = ZodEffects.createWithPreprocess;
    pipelineType = ZodPipeline.create;
    ostring = () => stringType().optional();
    onumber = () => numberType().optional();
    oboolean = () => booleanType().optional();
    coerce = {
      string: (arg) => ZodString.create({ ...arg, coerce: true }),
      number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
      boolean: (arg) => ZodBoolean.create({
        ...arg,
        coerce: true
      }),
      bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
      date: (arg) => ZodDate.create({ ...arg, coerce: true })
    };
    NEVER = INVALID;
    z = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      defaultErrorMap: errorMap,
      setErrorMap,
      getErrorMap,
      makeIssue,
      EMPTY_PATH,
      addIssueToContext,
      ParseStatus,
      INVALID,
      DIRTY,
      OK,
      isAborted,
      isDirty,
      isValid,
      isAsync,
      get util() {
        return util;
      },
      get objectUtil() {
        return objectUtil;
      },
      ZodParsedType,
      getParsedType,
      ZodType,
      datetimeRegex,
      ZodString,
      ZodNumber,
      ZodBigInt,
      ZodBoolean,
      ZodDate,
      ZodSymbol,
      ZodUndefined,
      ZodNull,
      ZodAny,
      ZodUnknown,
      ZodNever,
      ZodVoid,
      ZodArray,
      ZodObject,
      ZodUnion,
      ZodDiscriminatedUnion,
      ZodIntersection,
      ZodTuple,
      ZodRecord,
      ZodMap,
      ZodSet,
      ZodFunction,
      ZodLazy,
      ZodLiteral,
      ZodEnum,
      ZodNativeEnum,
      ZodPromise,
      ZodEffects,
      ZodTransformer: ZodEffects,
      ZodOptional,
      ZodNullable,
      ZodDefault,
      ZodCatch,
      ZodNaN,
      BRAND,
      ZodBranded,
      ZodPipeline,
      ZodReadonly,
      custom,
      Schema: ZodType,
      ZodSchema: ZodType,
      late,
      get ZodFirstPartyTypeKind() {
        return ZodFirstPartyTypeKind;
      },
      coerce,
      any: anyType,
      array: arrayType,
      bigint: bigIntType,
      boolean: booleanType,
      date: dateType,
      discriminatedUnion: discriminatedUnionType,
      effect: effectsType,
      "enum": enumType,
      "function": functionType,
      "instanceof": instanceOfType,
      intersection: intersectionType,
      lazy: lazyType,
      literal: literalType,
      map: mapType,
      nan: nanType,
      nativeEnum: nativeEnumType,
      never: neverType,
      "null": nullType,
      nullable: nullableType,
      number: numberType,
      object: objectType,
      oboolean,
      onumber,
      optional: optionalType,
      ostring,
      pipeline: pipelineType,
      preprocess: preprocessType,
      promise: promiseType,
      record: recordType,
      set: setType,
      strictObject: strictObjectType,
      string: stringType,
      symbol: symbolType,
      transformer: effectsType,
      tuple: tupleType,
      "undefined": undefinedType,
      union: unionType,
      unknown: unknownType,
      "void": voidType,
      NEVER,
      ZodIssueCode,
      quotelessJson,
      ZodError
    });
  }
});

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
    var coerce2 = (version2, options) => {
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
    module.exports = coerce2;
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
        const cached = cache2.get(memoKey);
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
        cache2.set(memoKey, result);
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
    var cache2 = new LRU();
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
      const z2 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z2} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z2} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z2} <${+M + 1}.0.0-0`;
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
              ret = `>=${M}.${m}.${p}${z2} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z2} <${M}.${+m + 1}.0-0`;
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
    var coerce2 = require_coerce();
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
      coerce: coerce2,
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
function isTraceableFunction(x) {
  return typeof x === "function" && "langsmith:traceable" in x;
}
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
function callbackHandlerPrefersStreaming(x) {
  return "lc_prefer_streaming" in x && x.lc_prefer_streaming;
}
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
function addLangChainErrorFields(error, lc_error_code) {
  error.lc_error_code = lc_error_code;
  error.message = `${error.message}

Troubleshooting URL: https://js.langchain.com/docs/troubleshooting/errors/${lc_error_code}/
`;
  return error;
}
var init_errors = __esm({
  "node_modules/@langchain/core/dist/errors/index.js"() {
  }
});

// node_modules/@langchain/core/dist/tools/utils.js
function _isToolCall(toolCall) {
  return !!(toolCall && typeof toolCall === "object" && "type" in toolCall && toolCall.type === "tool_call");
}
var ToolInputParsingException;
var init_utils = __esm({
  "node_modules/@langchain/core/dist/tools/utils.js"() {
    ToolInputParsingException = class extends Error {
      constructor(message, output) {
        super(message);
        Object.defineProperty(this, "output", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.output = output;
      }
    };
  }
});

// node_modules/@langchain/core/dist/utils/json.js
function parsePartialJson(s) {
  if (typeof s === "undefined") {
    return null;
  }
  try {
    return JSON.parse(s);
  } catch (error) {
  }
  let new_s = "";
  const stack = [];
  let isInsideString = false;
  let escaped = false;
  for (let char of s) {
    if (isInsideString) {
      if (char === '"' && !escaped) {
        isInsideString = false;
      } else if (char === "\n" && !escaped) {
        char = "\\n";
      } else if (char === "\\") {
        escaped = !escaped;
      } else {
        escaped = false;
      }
    } else {
      if (char === '"') {
        isInsideString = true;
        escaped = false;
      } else if (char === "{") {
        stack.push("}");
      } else if (char === "[") {
        stack.push("]");
      } else if (char === "}" || char === "]") {
        if (stack && stack[stack.length - 1] === char) {
          stack.pop();
        } else {
          return null;
        }
      }
    }
    new_s += char;
  }
  if (isInsideString) {
    new_s += '"';
  }
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    new_s += stack[i];
  }
  try {
    return JSON.parse(new_s);
  } catch (error) {
    return null;
  }
}
var init_json = __esm({
  "node_modules/@langchain/core/dist/utils/json.js"() {
  }
});

// node_modules/@langchain/core/dist/messages/base.js
function mergeContent(firstContent, secondContent) {
  if (typeof firstContent === "string") {
    if (typeof secondContent === "string") {
      return firstContent + secondContent;
    } else {
      return [{ type: "text", text: firstContent }, ...secondContent];
    }
  } else if (Array.isArray(secondContent)) {
    return _mergeLists(firstContent, secondContent) ?? [
      ...firstContent,
      ...secondContent
    ];
  } else {
    return [...firstContent, { type: "text", text: secondContent }];
  }
}
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
function _mergeDicts(left, right) {
  const merged = { ...left };
  for (const [key, value] of Object.entries(right)) {
    if (merged[key] == null) {
      merged[key] = value;
    } else if (value == null) {
      continue;
    } else if (typeof merged[key] !== typeof value || Array.isArray(merged[key]) !== Array.isArray(value)) {
      throw new Error(`field[${key}] already exists in the message chunk, but with a different type.`);
    } else if (typeof merged[key] === "string") {
      if (key === "type") {
        continue;
      }
      merged[key] += value;
    } else if (typeof merged[key] === "object" && !Array.isArray(merged[key])) {
      merged[key] = _mergeDicts(merged[key], value);
    } else if (Array.isArray(merged[key])) {
      merged[key] = _mergeLists(merged[key], value);
    } else if (merged[key] === value) {
      continue;
    } else {
      console.warn(`field[${key}] already exists in this message chunk and value has unsupported type.`);
    }
  }
  return merged;
}
function _mergeLists(left, right) {
  if (left === void 0 && right === void 0) {
    return void 0;
  } else if (left === void 0 || right === void 0) {
    return left || right;
  } else {
    const merged = [...left];
    for (const item of right) {
      if (typeof item === "object" && "index" in item && typeof item.index === "number") {
        const toMerge = merged.findIndex((leftItem) => leftItem.index === item.index);
        if (toMerge !== -1) {
          merged[toMerge] = _mergeDicts(merged[toMerge], item);
        } else {
          merged.push(item);
        }
      } else if (typeof item === "object" && "text" in item && item.text === "") {
        continue;
      } else {
        merged.push(item);
      }
    }
    return merged;
  }
}
function _isMessageFieldWithRole(x) {
  return typeof x.role === "string";
}
function isBaseMessage(messageLike) {
  return typeof messageLike?._getType === "function";
}
var BaseMessage, BaseMessageChunk;
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
    BaseMessageChunk = class extends BaseMessage {
    };
  }
});

// node_modules/@langchain/core/dist/messages/tool.js
function defaultToolCallParser(rawToolCalls) {
  const toolCalls = [];
  const invalidToolCalls = [];
  for (const toolCall of rawToolCalls) {
    if (!toolCall.function) {
      continue;
    } else {
      const functionName = toolCall.function.name;
      try {
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const parsed = {
          name: functionName || "",
          args: functionArgs || {},
          id: toolCall.id
        };
        toolCalls.push(parsed);
      } catch (error) {
        invalidToolCalls.push({
          name: functionName,
          args: toolCall.function.arguments,
          id: toolCall.id,
          error: "Malformed args."
        });
      }
    }
  }
  return [toolCalls, invalidToolCalls];
}
var ToolMessage;
var init_tool = __esm({
  "node_modules/@langchain/core/dist/messages/tool.js"() {
    init_base3();
    ToolMessage = class extends BaseMessage {
      static lc_name() {
        return "ToolMessage";
      }
      get lc_aliases() {
        return { tool_call_id: "tool_call_id" };
      }
      constructor(fields, tool_call_id, name) {
        if (typeof fields === "string") {
          fields = { content: fields, name, tool_call_id };
        }
        super(fields);
        Object.defineProperty(this, "lc_direct_tool_output", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "status", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "tool_call_id", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "artifact", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.tool_call_id = fields.tool_call_id;
        this.artifact = fields.artifact;
        this.status = fields.status;
      }
      _getType() {
        return "tool";
      }
      static isInstance(message) {
        return message._getType() === "tool";
      }
      get _printableFields() {
        return {
          ...super._printableFields,
          tool_call_id: this.tool_call_id,
          artifact: this.artifact
        };
      }
    };
  }
});

// node_modules/@langchain/core/dist/messages/ai.js
var AIMessage, AIMessageChunk;
var init_ai = __esm({
  "node_modules/@langchain/core/dist/messages/ai.js"() {
    init_json();
    init_base3();
    init_tool();
    AIMessage = class extends BaseMessage {
      get lc_aliases() {
        return {
          ...super.lc_aliases,
          tool_calls: "tool_calls",
          invalid_tool_calls: "invalid_tool_calls"
        };
      }
      constructor(fields, kwargs) {
        let initParams;
        if (typeof fields === "string") {
          initParams = {
            content: fields,
            tool_calls: [],
            invalid_tool_calls: [],
            additional_kwargs: kwargs ?? {}
          };
        } else {
          initParams = fields;
          const rawToolCalls = initParams.additional_kwargs?.tool_calls;
          const toolCalls = initParams.tool_calls;
          if (!(rawToolCalls == null) && rawToolCalls.length > 0 && (toolCalls === void 0 || toolCalls.length === 0)) {
            console.warn([
              "New LangChain packages are available that more efficiently handle",
              "tool calling.\n\nPlease upgrade your packages to versions that set",
              "message tool calls. e.g., `yarn add @langchain/anthropic`,",
              "yarn add @langchain/openai`, etc."
            ].join(" "));
          }
          try {
            if (!(rawToolCalls == null) && toolCalls === void 0) {
              const [toolCalls2, invalidToolCalls] = defaultToolCallParser(rawToolCalls);
              initParams.tool_calls = toolCalls2 ?? [];
              initParams.invalid_tool_calls = invalidToolCalls ?? [];
            } else {
              initParams.tool_calls = initParams.tool_calls ?? [];
              initParams.invalid_tool_calls = initParams.invalid_tool_calls ?? [];
            }
          } catch (e) {
            initParams.tool_calls = [];
            initParams.invalid_tool_calls = [];
          }
        }
        super(initParams);
        Object.defineProperty(this, "tool_calls", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "invalid_tool_calls", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "usage_metadata", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        if (typeof initParams !== "string") {
          this.tool_calls = initParams.tool_calls ?? this.tool_calls;
          this.invalid_tool_calls = initParams.invalid_tool_calls ?? this.invalid_tool_calls;
        }
        this.usage_metadata = initParams.usage_metadata;
      }
      static lc_name() {
        return "AIMessage";
      }
      _getType() {
        return "ai";
      }
      get _printableFields() {
        return {
          ...super._printableFields,
          tool_calls: this.tool_calls,
          invalid_tool_calls: this.invalid_tool_calls,
          usage_metadata: this.usage_metadata
        };
      }
    };
    AIMessageChunk = class _AIMessageChunk extends BaseMessageChunk {
      constructor(fields) {
        let initParams;
        if (typeof fields === "string") {
          initParams = {
            content: fields,
            tool_calls: [],
            invalid_tool_calls: [],
            tool_call_chunks: []
          };
        } else if (fields.tool_call_chunks === void 0) {
          initParams = {
            ...fields,
            tool_calls: fields.tool_calls ?? [],
            invalid_tool_calls: [],
            tool_call_chunks: [],
            usage_metadata: fields.usage_metadata !== void 0 ? fields.usage_metadata : void 0
          };
        } else {
          const toolCalls = [];
          const invalidToolCalls = [];
          for (const toolCallChunk of fields.tool_call_chunks) {
            let parsedArgs = {};
            try {
              parsedArgs = parsePartialJson(toolCallChunk.args || "{}");
              if (parsedArgs === null || typeof parsedArgs !== "object" || Array.isArray(parsedArgs)) {
                throw new Error("Malformed tool call chunk args.");
              }
              toolCalls.push({
                name: toolCallChunk.name ?? "",
                args: parsedArgs,
                id: toolCallChunk.id,
                type: "tool_call"
              });
            } catch (e) {
              invalidToolCalls.push({
                name: toolCallChunk.name,
                args: toolCallChunk.args,
                id: toolCallChunk.id,
                error: "Malformed args.",
                type: "invalid_tool_call"
              });
            }
          }
          initParams = {
            ...fields,
            tool_calls: toolCalls,
            invalid_tool_calls: invalidToolCalls,
            usage_metadata: fields.usage_metadata !== void 0 ? fields.usage_metadata : void 0
          };
        }
        super(initParams);
        Object.defineProperty(this, "tool_calls", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "invalid_tool_calls", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "tool_call_chunks", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "usage_metadata", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.tool_call_chunks = initParams.tool_call_chunks ?? this.tool_call_chunks;
        this.tool_calls = initParams.tool_calls ?? this.tool_calls;
        this.invalid_tool_calls = initParams.invalid_tool_calls ?? this.invalid_tool_calls;
        this.usage_metadata = initParams.usage_metadata;
      }
      get lc_aliases() {
        return {
          ...super.lc_aliases,
          tool_calls: "tool_calls",
          invalid_tool_calls: "invalid_tool_calls",
          tool_call_chunks: "tool_call_chunks"
        };
      }
      static lc_name() {
        return "AIMessageChunk";
      }
      _getType() {
        return "ai";
      }
      get _printableFields() {
        return {
          ...super._printableFields,
          tool_calls: this.tool_calls,
          tool_call_chunks: this.tool_call_chunks,
          invalid_tool_calls: this.invalid_tool_calls,
          usage_metadata: this.usage_metadata
        };
      }
      concat(chunk) {
        const combinedFields = {
          content: mergeContent(this.content, chunk.content),
          additional_kwargs: _mergeDicts(this.additional_kwargs, chunk.additional_kwargs),
          response_metadata: _mergeDicts(this.response_metadata, chunk.response_metadata),
          tool_call_chunks: [],
          id: this.id ?? chunk.id
        };
        if (this.tool_call_chunks !== void 0 || chunk.tool_call_chunks !== void 0) {
          const rawToolCalls = _mergeLists(this.tool_call_chunks, chunk.tool_call_chunks);
          if (rawToolCalls !== void 0 && rawToolCalls.length > 0) {
            combinedFields.tool_call_chunks = rawToolCalls;
          }
        }
        if (this.usage_metadata !== void 0 || chunk.usage_metadata !== void 0) {
          const inputTokenDetails = {
            ...(this.usage_metadata?.input_token_details?.audio !== void 0 || chunk.usage_metadata?.input_token_details?.audio !== void 0) && {
              audio: (this.usage_metadata?.input_token_details?.audio ?? 0) + (chunk.usage_metadata?.input_token_details?.audio ?? 0)
            },
            ...(this.usage_metadata?.input_token_details?.cache_read !== void 0 || chunk.usage_metadata?.input_token_details?.cache_read !== void 0) && {
              cache_read: (this.usage_metadata?.input_token_details?.cache_read ?? 0) + (chunk.usage_metadata?.input_token_details?.cache_read ?? 0)
            },
            ...(this.usage_metadata?.input_token_details?.cache_creation !== void 0 || chunk.usage_metadata?.input_token_details?.cache_creation !== void 0) && {
              cache_creation: (this.usage_metadata?.input_token_details?.cache_creation ?? 0) + (chunk.usage_metadata?.input_token_details?.cache_creation ?? 0)
            }
          };
          const outputTokenDetails = {
            ...(this.usage_metadata?.output_token_details?.audio !== void 0 || chunk.usage_metadata?.output_token_details?.audio !== void 0) && {
              audio: (this.usage_metadata?.output_token_details?.audio ?? 0) + (chunk.usage_metadata?.output_token_details?.audio ?? 0)
            },
            ...(this.usage_metadata?.output_token_details?.reasoning !== void 0 || chunk.usage_metadata?.output_token_details?.reasoning !== void 0) && {
              reasoning: (this.usage_metadata?.output_token_details?.reasoning ?? 0) + (chunk.usage_metadata?.output_token_details?.reasoning ?? 0)
            }
          };
          const left = this.usage_metadata ?? {
            input_tokens: 0,
            output_tokens: 0,
            total_tokens: 0
          };
          const right = chunk.usage_metadata ?? {
            input_tokens: 0,
            output_tokens: 0,
            total_tokens: 0
          };
          const usage_metadata = {
            input_tokens: left.input_tokens + right.input_tokens,
            output_tokens: left.output_tokens + right.output_tokens,
            total_tokens: left.total_tokens + right.total_tokens,
            // Do not include `input_token_details` / `output_token_details` keys in combined fields
            // unless their values are defined.
            ...Object.keys(inputTokenDetails).length > 0 && {
              input_token_details: inputTokenDetails
            },
            ...Object.keys(outputTokenDetails).length > 0 && {
              output_token_details: outputTokenDetails
            }
          };
          combinedFields.usage_metadata = usage_metadata;
        }
        return new _AIMessageChunk(combinedFields);
      }
    };
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
var HumanMessage;
var init_human = __esm({
  "node_modules/@langchain/core/dist/messages/human.js"() {
    init_base3();
    HumanMessage = class extends BaseMessage {
      static lc_name() {
        return "HumanMessage";
      }
      _getType() {
        return "human";
      }
    };
  }
});

// node_modules/@langchain/core/dist/messages/system.js
var SystemMessage;
var init_system = __esm({
  "node_modules/@langchain/core/dist/messages/system.js"() {
    init_base3();
    SystemMessage = class extends BaseMessage {
      static lc_name() {
        return "SystemMessage";
      }
      _getType() {
        return "system";
      }
    };
  }
});

// node_modules/@langchain/core/dist/messages/utils.js
function _coerceToolCall(toolCall) {
  if (_isToolCall(toolCall)) {
    return toolCall;
  } else if (typeof toolCall.id === "string" && toolCall.type === "function" && typeof toolCall.function === "object" && toolCall.function !== null && "arguments" in toolCall.function && typeof toolCall.function.arguments === "string" && "name" in toolCall.function && typeof toolCall.function.name === "string") {
    return {
      id: toolCall.id,
      args: JSON.parse(toolCall.function.arguments),
      name: toolCall.function.name,
      type: "tool_call"
    };
  } else {
    return toolCall;
  }
}
function isSerializedConstructor(x) {
  return typeof x === "object" && x != null && x.lc === 1 && Array.isArray(x.id) && x.kwargs != null && typeof x.kwargs === "object";
}
function _constructMessageFromParams(params) {
  let type;
  let rest;
  if (isSerializedConstructor(params)) {
    const className = params.id.at(-1);
    if (className === "HumanMessage" || className === "HumanMessageChunk") {
      type = "user";
    } else if (className === "AIMessage" || className === "AIMessageChunk") {
      type = "assistant";
    } else if (className === "SystemMessage" || className === "SystemMessageChunk") {
      type = "system";
    } else {
      type = "unknown";
    }
    rest = params.kwargs;
  } else {
    const { type: extractedType, ...otherParams } = params;
    type = extractedType;
    rest = otherParams;
  }
  if (type === "human" || type === "user") {
    return new HumanMessage(rest);
  } else if (type === "ai" || type === "assistant") {
    const { tool_calls: rawToolCalls, ...other } = rest;
    if (!Array.isArray(rawToolCalls)) {
      return new AIMessage(rest);
    }
    const tool_calls = rawToolCalls.map(_coerceToolCall);
    return new AIMessage({ ...other, tool_calls });
  } else if (type === "system") {
    return new SystemMessage(rest);
  } else if (type === "developer") {
    return new SystemMessage({
      ...rest,
      additional_kwargs: {
        ...rest.additional_kwargs,
        __openai_role__: "developer"
      }
    });
  } else if (type === "tool" && "tool_call_id" in rest) {
    return new ToolMessage({
      ...rest,
      content: rest.content,
      tool_call_id: rest.tool_call_id,
      name: rest.name
    });
  } else {
    const error = addLangChainErrorFields(new Error(`Unable to coerce message from array: only human, AI, system, developer, or tool message coercion is currently supported.

Received: ${JSON.stringify(params, null, 2)}`), "MESSAGE_COERCION_FAILURE");
    throw error;
  }
}
function coerceMessageLikeToMessage(messageLike) {
  if (typeof messageLike === "string") {
    return new HumanMessage(messageLike);
  } else if (isBaseMessage(messageLike)) {
    return messageLike;
  }
  if (Array.isArray(messageLike)) {
    const [type, content] = messageLike;
    return _constructMessageFromParams({ type, content });
  } else if (_isMessageFieldWithRole(messageLike)) {
    const { role: type, ...rest } = messageLike;
    return _constructMessageFromParams({ ...rest, type });
  } else {
    return _constructMessageFromParams(messageLike);
  }
}
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
async function getCallbackManagerForConfig(config) {
  return CallbackManager._configureSync(config?.callbacks, void 0, config?.tags, void 0, config?.metadata);
}
function mergeConfigs(...configs) {
  const copy = {};
  for (const options of configs.filter((c) => !!c)) {
    for (const key of Object.keys(options)) {
      if (key === "metadata") {
        copy[key] = { ...copy[key], ...options[key] };
      } else if (key === "tags") {
        const baseKeys = copy[key] ?? [];
        copy[key] = [...new Set(baseKeys.concat(options[key] ?? []))];
      } else if (key === "configurable") {
        copy[key] = { ...copy[key], ...options[key] };
      } else if (key === "timeout") {
        if (copy.timeout === void 0) {
          copy.timeout = options.timeout;
        } else if (options.timeout !== void 0) {
          copy.timeout = Math.min(copy.timeout, options.timeout);
        }
      } else if (key === "signal") {
        if (copy.signal === void 0) {
          copy.signal = options.signal;
        } else if (options.signal !== void 0) {
          if ("any" in AbortSignal) {
            copy.signal = AbortSignal.any([
              copy.signal,
              options.signal
            ]);
          } else {
            copy.signal = options.signal;
          }
        }
      } else if (key === "callbacks") {
        const baseCallbacks = copy.callbacks;
        const providedCallbacks = options.callbacks;
        if (Array.isArray(providedCallbacks)) {
          if (!baseCallbacks) {
            copy.callbacks = providedCallbacks;
          } else if (Array.isArray(baseCallbacks)) {
            copy.callbacks = baseCallbacks.concat(providedCallbacks);
          } else {
            const manager = baseCallbacks.copy();
            for (const callback of providedCallbacks) {
              manager.addHandler(ensureHandler(callback), true);
            }
            copy.callbacks = manager;
          }
        } else if (providedCallbacks) {
          if (!baseCallbacks) {
            copy.callbacks = providedCallbacks;
          } else if (Array.isArray(baseCallbacks)) {
            const manager = providedCallbacks.copy();
            for (const callback of baseCallbacks) {
              manager.addHandler(ensureHandler(callback), true);
            }
            copy.callbacks = manager;
          } else {
            copy.callbacks = new CallbackManager(providedCallbacks._parentRunId, {
              handlers: baseCallbacks.handlers.concat(providedCallbacks.handlers),
              inheritableHandlers: baseCallbacks.inheritableHandlers.concat(providedCallbacks.inheritableHandlers),
              tags: Array.from(new Set(baseCallbacks.tags.concat(providedCallbacks.tags))),
              inheritableTags: Array.from(new Set(baseCallbacks.inheritableTags.concat(providedCallbacks.inheritableTags))),
              metadata: {
                ...baseCallbacks.metadata,
                ...providedCallbacks.metadata
              }
            });
          }
        }
      } else {
        const typedKey = key;
        copy[typedKey] = options[typedKey] ?? copy[typedKey];
      }
    }
  }
  return copy;
}
function ensureConfig(config) {
  const implicitConfig = AsyncLocalStorageProviderSingleton2.getRunnableConfig();
  let empty = {
    tags: [],
    metadata: {},
    recursionLimit: 25,
    runId: void 0
  };
  if (implicitConfig) {
    const { runId, runName, ...rest } = implicitConfig;
    empty = Object.entries(rest).reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (currentConfig, [key, value]) => {
        if (value !== void 0) {
          currentConfig[key] = value;
        }
        return currentConfig;
      },
      empty
    );
  }
  if (config) {
    empty = Object.entries(config).reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (currentConfig, [key, value]) => {
        if (value !== void 0) {
          currentConfig[key] = value;
        }
        return currentConfig;
      },
      empty
    );
  }
  if (empty?.configurable) {
    for (const key of Object.keys(empty.configurable)) {
      if (PRIMITIVES.has(typeof empty.configurable[key]) && !empty.metadata?.[key]) {
        if (!empty.metadata) {
          empty.metadata = {};
        }
        empty.metadata[key] = empty.configurable[key];
      }
    }
  }
  if (empty.timeout !== void 0) {
    if (empty.timeout <= 0) {
      throw new Error("Timeout must be a positive number");
    }
    const timeoutSignal = AbortSignal.timeout(empty.timeout);
    if (empty.signal !== void 0) {
      if ("any" in AbortSignal) {
        empty.signal = AbortSignal.any([empty.signal, timeoutSignal]);
      }
    } else {
      empty.signal = timeoutSignal;
    }
    delete empty.timeout;
  }
  return empty;
}
function patchConfig(config = {}, { callbacks, maxConcurrency, recursionLimit, runName, configurable, runId } = {}) {
  const newConfig = ensureConfig(config);
  if (callbacks !== void 0) {
    delete newConfig.runName;
    newConfig.callbacks = callbacks;
  }
  if (recursionLimit !== void 0) {
    newConfig.recursionLimit = recursionLimit;
  }
  if (maxConcurrency !== void 0) {
    newConfig.maxConcurrency = maxConcurrency;
  }
  if (runName !== void 0) {
    newConfig.runName = runName;
  }
  if (configurable !== void 0) {
    newConfig.configurable = { ...newConfig.configurable, ...configurable };
  }
  if (runId !== void 0) {
    delete newConfig.runId;
  }
  return newConfig;
}
function pickRunnableConfigKeys(config) {
  return config ? {
    configurable: config.configurable,
    recursionLimit: config.recursionLimit,
    callbacks: config.callbacks,
    tags: config.tags,
    metadata: config.metadata,
    maxConcurrency: config.maxConcurrency,
    timeout: config.timeout,
    signal: config.signal
  } : void 0;
}
var DEFAULT_RECURSION_LIMIT, PRIMITIVES;
var init_config = __esm({
  "node_modules/@langchain/core/dist/runnables/config.js"() {
    init_manager();
    init_singletons();
    DEFAULT_RECURSION_LIMIT = 25;
    PRIMITIVES = /* @__PURE__ */ new Set(["string", "number", "boolean"]);
  }
});

// node_modules/@langchain/core/dist/utils/signal.js
async function raceWithSignal(promise, signal) {
  if (signal === void 0) {
    return promise;
  }
  let listener;
  return Promise.race([
    promise.catch((err) => {
      if (!signal?.aborted) {
        throw err;
      } else {
        return void 0;
      }
    }),
    new Promise((_, reject) => {
      listener = () => {
        reject(new Error("Aborted"));
      };
      signal.addEventListener("abort", listener);
      if (signal.aborted) {
        reject(new Error("Aborted"));
      }
    })
  ]).finally(() => signal.removeEventListener("abort", listener));
}
var init_signal = __esm({
  "node_modules/@langchain/core/dist/utils/signal.js"() {
  }
});

// node_modules/@langchain/core/dist/utils/stream.js
function atee(iter, length = 2) {
  const buffers = Array.from({ length }, () => []);
  return buffers.map(async function* makeIter(buffer) {
    while (true) {
      if (buffer.length === 0) {
        const result = await iter.next();
        for (const buffer2 of buffers) {
          buffer2.push(result);
        }
      } else if (buffer[0].done) {
        return;
      } else {
        yield buffer.shift().value;
      }
    }
  });
}
function concat(first, second) {
  if (Array.isArray(first) && Array.isArray(second)) {
    return first.concat(second);
  } else if (typeof first === "string" && typeof second === "string") {
    return first + second;
  } else if (typeof first === "number" && typeof second === "number") {
    return first + second;
  } else if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "concat" in first && // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof first.concat === "function"
  ) {
    return first.concat(second);
  } else if (typeof first === "object" && typeof second === "object") {
    const chunk = { ...first };
    for (const [key, value] of Object.entries(second)) {
      if (key in chunk && !Array.isArray(chunk[key])) {
        chunk[key] = concat(chunk[key], value);
      } else {
        chunk[key] = value;
      }
    }
    return chunk;
  } else {
    throw new Error(`Cannot concat ${typeof first} and ${typeof second}`);
  }
}
async function pipeGeneratorWithSetup(to, generator, startSetup, signal, ...args) {
  const gen = new AsyncGeneratorWithSetup({
    generator,
    startSetup,
    signal
  });
  const setup = await gen.setup;
  return { output: to(gen, setup, ...args), setup };
}
var IterableReadableStream, AsyncGeneratorWithSetup;
var init_stream = __esm({
  "node_modules/@langchain/core/dist/utils/stream.js"() {
    init_config();
    init_singletons();
    init_signal();
    IterableReadableStream = class _IterableReadableStream extends ReadableStream {
      constructor() {
        super(...arguments);
        Object.defineProperty(this, "reader", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
      }
      ensureReader() {
        if (!this.reader) {
          this.reader = this.getReader();
        }
      }
      async next() {
        this.ensureReader();
        try {
          const result = await this.reader.read();
          if (result.done) {
            this.reader.releaseLock();
            return {
              done: true,
              value: void 0
            };
          } else {
            return {
              done: false,
              value: result.value
            };
          }
        } catch (e) {
          this.reader.releaseLock();
          throw e;
        }
      }
      async return() {
        this.ensureReader();
        if (this.locked) {
          const cancelPromise = this.reader.cancel();
          this.reader.releaseLock();
          await cancelPromise;
        }
        return { done: true, value: void 0 };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async throw(e) {
        this.ensureReader();
        if (this.locked) {
          const cancelPromise = this.reader.cancel();
          this.reader.releaseLock();
          await cancelPromise;
        }
        throw e;
      }
      [Symbol.asyncIterator]() {
        return this;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Not present in Node 18 types, required in latest Node 22
      async [Symbol.asyncDispose]() {
        await this.return();
      }
      static fromReadableStream(stream) {
        const reader = stream.getReader();
        return new _IterableReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                return pump();
              });
            }
          },
          cancel() {
            reader.releaseLock();
          }
        });
      }
      static fromAsyncGenerator(generator) {
        return new _IterableReadableStream({
          async pull(controller) {
            const { value, done } = await generator.next();
            if (done) {
              controller.close();
            }
            controller.enqueue(value);
          },
          async cancel(reason) {
            await generator.return(reason);
          }
        });
      }
    };
    AsyncGeneratorWithSetup = class {
      constructor(params) {
        Object.defineProperty(this, "generator", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "setup", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "config", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "signal", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "firstResult", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "firstResultUsed", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        this.generator = params.generator;
        this.config = params.config;
        this.signal = params.signal ?? this.config?.signal;
        this.setup = new Promise((resolve, reject) => {
          void AsyncLocalStorageProviderSingleton2.runWithConfig(pickRunnableConfigKeys(params.config), async () => {
            this.firstResult = params.generator.next();
            if (params.startSetup) {
              this.firstResult.then(params.startSetup).then(resolve, reject);
            } else {
              this.firstResult.then((_result) => resolve(void 0), reject);
            }
          }, true);
        });
      }
      async next(...args) {
        this.signal?.throwIfAborted();
        if (!this.firstResultUsed) {
          this.firstResultUsed = true;
          return this.firstResult;
        }
        return AsyncLocalStorageProviderSingleton2.runWithConfig(pickRunnableConfigKeys(this.config), this.signal ? async () => {
          return raceWithSignal(this.generator.next(...args), this.signal);
        } : async () => {
          return this.generator.next(...args);
        }, true);
      }
      async return(value) {
        return this.generator.return(value);
      }
      async throw(e) {
        return this.generator.throw(e);
      }
      [Symbol.asyncIterator]() {
        return this;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Not present in Node 18 types, required in latest Node 22
      async [Symbol.asyncDispose]() {
        await this.return();
      }
    };
  }
});

// node_modules/@langchain/core/dist/tracers/log_stream.js
async function _getStandardizedInputs(run, schemaFormat) {
  if (schemaFormat === "original") {
    throw new Error("Do not assign inputs with original schema drop the key for now. When inputs are added to streamLog they should be added with standardized schema for streaming events.");
  }
  const { inputs } = run;
  if (["retriever", "llm", "prompt"].includes(run.run_type)) {
    return inputs;
  }
  if (Object.keys(inputs).length === 1 && inputs?.input === "") {
    return void 0;
  }
  return inputs.input;
}
async function _getStandardizedOutputs(run, schemaFormat) {
  const { outputs } = run;
  if (schemaFormat === "original") {
    return outputs;
  }
  if (["retriever", "llm", "prompt"].includes(run.run_type)) {
    return outputs;
  }
  if (outputs !== void 0 && Object.keys(outputs).length === 1 && outputs?.output !== void 0) {
    return outputs.output;
  }
  return outputs;
}
function isChatGenerationChunk(x) {
  return x !== void 0 && x.message !== void 0;
}
var RunLogPatch, RunLog, isLogStreamHandler, LogStreamCallbackHandler;
var init_log_stream = __esm({
  "node_modules/@langchain/core/dist/tracers/log_stream.js"() {
    init_fast_json_patch();
    init_base2();
    init_stream();
    init_ai();
    RunLogPatch = class {
      constructor(fields) {
        Object.defineProperty(this, "ops", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.ops = fields.ops ?? [];
      }
      concat(other) {
        const ops = this.ops.concat(other.ops);
        const states = applyPatch({}, ops);
        return new RunLog({
          ops,
          state: states[states.length - 1].newDocument
        });
      }
    };
    RunLog = class _RunLog extends RunLogPatch {
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "state", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.state = fields.state;
      }
      concat(other) {
        const ops = this.ops.concat(other.ops);
        const states = applyPatch(this.state, other.ops);
        return new _RunLog({ ops, state: states[states.length - 1].newDocument });
      }
      static fromRunLogPatch(patch) {
        const states = applyPatch({}, patch.ops);
        return new _RunLog({
          ops: patch.ops,
          state: states[states.length - 1].newDocument
        });
      }
    };
    isLogStreamHandler = (handler) => handler.name === "log_stream_tracer";
    LogStreamCallbackHandler = class extends BaseTracer {
      constructor(fields) {
        super({ _awaitHandler: true, ...fields });
        Object.defineProperty(this, "autoClose", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "includeNames", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "includeTypes", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "includeTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeNames", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeTypes", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "_schemaFormat", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "original"
        });
        Object.defineProperty(this, "rootId", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "keyMapByRunId", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: {}
        });
        Object.defineProperty(this, "counterMapByRunName", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: {}
        });
        Object.defineProperty(this, "transformStream", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "writer", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "receiveStream", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "log_stream_tracer"
        });
        Object.defineProperty(this, "lc_prefer_streaming", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        this.autoClose = fields?.autoClose ?? true;
        this.includeNames = fields?.includeNames;
        this.includeTypes = fields?.includeTypes;
        this.includeTags = fields?.includeTags;
        this.excludeNames = fields?.excludeNames;
        this.excludeTypes = fields?.excludeTypes;
        this.excludeTags = fields?.excludeTags;
        this._schemaFormat = fields?._schemaFormat ?? this._schemaFormat;
        this.transformStream = new TransformStream();
        this.writer = this.transformStream.writable.getWriter();
        this.receiveStream = IterableReadableStream.fromReadableStream(this.transformStream.readable);
      }
      [Symbol.asyncIterator]() {
        return this.receiveStream;
      }
      async persistRun(_run) {
      }
      _includeRun(run) {
        if (run.id === this.rootId) {
          return false;
        }
        const runTags = run.tags ?? [];
        let include = this.includeNames === void 0 && this.includeTags === void 0 && this.includeTypes === void 0;
        if (this.includeNames !== void 0) {
          include = include || this.includeNames.includes(run.name);
        }
        if (this.includeTypes !== void 0) {
          include = include || this.includeTypes.includes(run.run_type);
        }
        if (this.includeTags !== void 0) {
          include = include || runTags.find((tag) => this.includeTags?.includes(tag)) !== void 0;
        }
        if (this.excludeNames !== void 0) {
          include = include && !this.excludeNames.includes(run.name);
        }
        if (this.excludeTypes !== void 0) {
          include = include && !this.excludeTypes.includes(run.run_type);
        }
        if (this.excludeTags !== void 0) {
          include = include && runTags.every((tag) => !this.excludeTags?.includes(tag));
        }
        return include;
      }
      async *tapOutputIterable(runId, output) {
        for await (const chunk of output) {
          if (runId !== this.rootId) {
            const key = this.keyMapByRunId[runId];
            if (key) {
              await this.writer.write(new RunLogPatch({
                ops: [
                  {
                    op: "add",
                    path: `/logs/${key}/streamed_output/-`,
                    value: chunk
                  }
                ]
              }));
            }
          }
          yield chunk;
        }
      }
      async onRunCreate(run) {
        if (this.rootId === void 0) {
          this.rootId = run.id;
          await this.writer.write(new RunLogPatch({
            ops: [
              {
                op: "replace",
                path: "",
                value: {
                  id: run.id,
                  name: run.name,
                  type: run.run_type,
                  streamed_output: [],
                  final_output: void 0,
                  logs: {}
                }
              }
            ]
          }));
        }
        if (!this._includeRun(run)) {
          return;
        }
        if (this.counterMapByRunName[run.name] === void 0) {
          this.counterMapByRunName[run.name] = 0;
        }
        this.counterMapByRunName[run.name] += 1;
        const count = this.counterMapByRunName[run.name];
        this.keyMapByRunId[run.id] = count === 1 ? run.name : `${run.name}:${count}`;
        const logEntry = {
          id: run.id,
          name: run.name,
          type: run.run_type,
          tags: run.tags ?? [],
          metadata: run.extra?.metadata ?? {},
          start_time: new Date(run.start_time).toISOString(),
          streamed_output: [],
          streamed_output_str: [],
          final_output: void 0,
          end_time: void 0
        };
        if (this._schemaFormat === "streaming_events") {
          logEntry.inputs = await _getStandardizedInputs(run, this._schemaFormat);
        }
        await this.writer.write(new RunLogPatch({
          ops: [
            {
              op: "add",
              path: `/logs/${this.keyMapByRunId[run.id]}`,
              value: logEntry
            }
          ]
        }));
      }
      async onRunUpdate(run) {
        try {
          const runName = this.keyMapByRunId[run.id];
          if (runName === void 0) {
            return;
          }
          const ops = [];
          if (this._schemaFormat === "streaming_events") {
            ops.push({
              op: "replace",
              path: `/logs/${runName}/inputs`,
              value: await _getStandardizedInputs(run, this._schemaFormat)
            });
          }
          ops.push({
            op: "add",
            path: `/logs/${runName}/final_output`,
            value: await _getStandardizedOutputs(run, this._schemaFormat)
          });
          if (run.end_time !== void 0) {
            ops.push({
              op: "add",
              path: `/logs/${runName}/end_time`,
              value: new Date(run.end_time).toISOString()
            });
          }
          const patch = new RunLogPatch({ ops });
          await this.writer.write(patch);
        } finally {
          if (run.id === this.rootId) {
            const patch = new RunLogPatch({
              ops: [
                {
                  op: "replace",
                  path: "/final_output",
                  value: await _getStandardizedOutputs(run, this._schemaFormat)
                }
              ]
            });
            await this.writer.write(patch);
            if (this.autoClose) {
              await this.writer.close();
            }
          }
        }
      }
      async onLLMNewToken(run, token, kwargs) {
        const runName = this.keyMapByRunId[run.id];
        if (runName === void 0) {
          return;
        }
        const isChatModel = run.inputs.messages !== void 0;
        let streamedOutputValue;
        if (isChatModel) {
          if (isChatGenerationChunk(kwargs?.chunk)) {
            streamedOutputValue = kwargs?.chunk;
          } else {
            streamedOutputValue = new AIMessageChunk({
              id: `run-${run.id}`,
              content: token
            });
          }
        } else {
          streamedOutputValue = token;
        }
        const patch = new RunLogPatch({
          ops: [
            {
              op: "add",
              path: `/logs/${runName}/streamed_output_str/-`,
              value: token
            },
            {
              op: "add",
              path: `/logs/${runName}/streamed_output/-`,
              value: streamedOutputValue
            }
          ]
        });
        await this.writer.write(patch);
      }
    };
  }
});

// node_modules/@langchain/core/dist/outputs.js
var RUN_KEY, GenerationChunk;
var init_outputs = __esm({
  "node_modules/@langchain/core/dist/outputs.js"() {
    RUN_KEY = "__run";
    GenerationChunk = class _GenerationChunk {
      constructor(fields) {
        Object.defineProperty(this, "text", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "generationInfo", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.text = fields.text;
        this.generationInfo = fields.generationInfo;
      }
      concat(chunk) {
        return new _GenerationChunk({
          text: this.text + chunk.text,
          generationInfo: {
            ...this.generationInfo,
            ...chunk.generationInfo
          }
        });
      }
    };
  }
});

// node_modules/@langchain/core/dist/tracers/event_stream.js
function assignName({ name, serialized }) {
  if (name !== void 0) {
    return name;
  }
  if (serialized?.name !== void 0) {
    return serialized.name;
  } else if (serialized?.id !== void 0 && Array.isArray(serialized?.id)) {
    return serialized.id[serialized.id.length - 1];
  }
  return "Unnamed";
}
var isStreamEventsHandler, EventStreamCallbackHandler;
var init_event_stream = __esm({
  "node_modules/@langchain/core/dist/tracers/event_stream.js"() {
    init_base2();
    init_stream();
    init_ai();
    init_outputs();
    isStreamEventsHandler = (handler) => handler.name === "event_stream_tracer";
    EventStreamCallbackHandler = class extends BaseTracer {
      constructor(fields) {
        super({ _awaitHandler: true, ...fields });
        Object.defineProperty(this, "autoClose", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "includeNames", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "includeTypes", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "includeTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeNames", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeTypes", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "runInfoMap", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: /* @__PURE__ */ new Map()
        });
        Object.defineProperty(this, "tappedPromises", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: /* @__PURE__ */ new Map()
        });
        Object.defineProperty(this, "transformStream", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "writer", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "receiveStream", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "event_stream_tracer"
        });
        Object.defineProperty(this, "lc_prefer_streaming", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        this.autoClose = fields?.autoClose ?? true;
        this.includeNames = fields?.includeNames;
        this.includeTypes = fields?.includeTypes;
        this.includeTags = fields?.includeTags;
        this.excludeNames = fields?.excludeNames;
        this.excludeTypes = fields?.excludeTypes;
        this.excludeTags = fields?.excludeTags;
        this.transformStream = new TransformStream();
        this.writer = this.transformStream.writable.getWriter();
        this.receiveStream = IterableReadableStream.fromReadableStream(this.transformStream.readable);
      }
      [Symbol.asyncIterator]() {
        return this.receiveStream;
      }
      async persistRun(_run) {
      }
      _includeRun(run) {
        const runTags = run.tags ?? [];
        let include = this.includeNames === void 0 && this.includeTags === void 0 && this.includeTypes === void 0;
        if (this.includeNames !== void 0) {
          include = include || this.includeNames.includes(run.name);
        }
        if (this.includeTypes !== void 0) {
          include = include || this.includeTypes.includes(run.runType);
        }
        if (this.includeTags !== void 0) {
          include = include || runTags.find((tag) => this.includeTags?.includes(tag)) !== void 0;
        }
        if (this.excludeNames !== void 0) {
          include = include && !this.excludeNames.includes(run.name);
        }
        if (this.excludeTypes !== void 0) {
          include = include && !this.excludeTypes.includes(run.runType);
        }
        if (this.excludeTags !== void 0) {
          include = include && runTags.every((tag) => !this.excludeTags?.includes(tag));
        }
        return include;
      }
      async *tapOutputIterable(runId, outputStream) {
        const firstChunk = await outputStream.next();
        if (firstChunk.done) {
          return;
        }
        const runInfo = this.runInfoMap.get(runId);
        if (runInfo === void 0) {
          yield firstChunk.value;
          return;
        }
        function _formatOutputChunk(eventType, data) {
          if (eventType === "llm" && typeof data === "string") {
            return new GenerationChunk({ text: data });
          }
          return data;
        }
        let tappedPromise = this.tappedPromises.get(runId);
        if (tappedPromise === void 0) {
          let tappedPromiseResolver;
          tappedPromise = new Promise((resolve) => {
            tappedPromiseResolver = resolve;
          });
          this.tappedPromises.set(runId, tappedPromise);
          try {
            const event = {
              event: `on_${runInfo.runType}_stream`,
              run_id: runId,
              name: runInfo.name,
              tags: runInfo.tags,
              metadata: runInfo.metadata,
              data: {}
            };
            await this.send({
              ...event,
              data: {
                chunk: _formatOutputChunk(runInfo.runType, firstChunk.value)
              }
            }, runInfo);
            yield firstChunk.value;
            for await (const chunk of outputStream) {
              if (runInfo.runType !== "tool" && runInfo.runType !== "retriever") {
                await this.send({
                  ...event,
                  data: {
                    chunk: _formatOutputChunk(runInfo.runType, chunk)
                  }
                }, runInfo);
              }
              yield chunk;
            }
          } finally {
            tappedPromiseResolver();
          }
        } else {
          yield firstChunk.value;
          for await (const chunk of outputStream) {
            yield chunk;
          }
        }
      }
      async send(payload, run) {
        if (this._includeRun(run)) {
          await this.writer.write(payload);
        }
      }
      async sendEndEvent(payload, run) {
        const tappedPromise = this.tappedPromises.get(payload.run_id);
        if (tappedPromise !== void 0) {
          void tappedPromise.then(() => {
            void this.send(payload, run);
          });
        } else {
          await this.send(payload, run);
        }
      }
      async onLLMStart(run) {
        const runName = assignName(run);
        const runType = run.inputs.messages !== void 0 ? "chat_model" : "llm";
        const runInfo = {
          tags: run.tags ?? [],
          metadata: run.extra?.metadata ?? {},
          name: runName,
          runType,
          inputs: run.inputs
        };
        this.runInfoMap.set(run.id, runInfo);
        const eventName = `on_${runType}_start`;
        await this.send({
          event: eventName,
          data: {
            input: run.inputs
          },
          name: runName,
          tags: run.tags ?? [],
          run_id: run.id,
          metadata: run.extra?.metadata ?? {}
        }, runInfo);
      }
      async onLLMNewToken(run, token, kwargs) {
        const runInfo = this.runInfoMap.get(run.id);
        let chunk;
        let eventName;
        if (runInfo === void 0) {
          throw new Error(`onLLMNewToken: Run ID ${run.id} not found in run map.`);
        }
        if (this.runInfoMap.size === 1) {
          return;
        }
        if (runInfo.runType === "chat_model") {
          eventName = "on_chat_model_stream";
          if (kwargs?.chunk === void 0) {
            chunk = new AIMessageChunk({ content: token, id: `run-${run.id}` });
          } else {
            chunk = kwargs.chunk.message;
          }
        } else if (runInfo.runType === "llm") {
          eventName = "on_llm_stream";
          if (kwargs?.chunk === void 0) {
            chunk = new GenerationChunk({ text: token });
          } else {
            chunk = kwargs.chunk;
          }
        } else {
          throw new Error(`Unexpected run type ${runInfo.runType}`);
        }
        await this.send({
          event: eventName,
          data: {
            chunk
          },
          run_id: run.id,
          name: runInfo.name,
          tags: runInfo.tags,
          metadata: runInfo.metadata
        }, runInfo);
      }
      async onLLMEnd(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        let eventName;
        if (runInfo === void 0) {
          throw new Error(`onLLMEnd: Run ID ${run.id} not found in run map.`);
        }
        const generations = run.outputs?.generations;
        let output;
        if (runInfo.runType === "chat_model") {
          for (const generation of generations ?? []) {
            if (output !== void 0) {
              break;
            }
            output = generation[0]?.message;
          }
          eventName = "on_chat_model_end";
        } else if (runInfo.runType === "llm") {
          output = {
            generations: generations?.map((generation) => {
              return generation.map((chunk) => {
                return {
                  text: chunk.text,
                  generationInfo: chunk.generationInfo
                };
              });
            }),
            llmOutput: run.outputs?.llmOutput ?? {}
          };
          eventName = "on_llm_end";
        } else {
          throw new Error(`onLLMEnd: Unexpected run type: ${runInfo.runType}`);
        }
        await this.sendEndEvent({
          event: eventName,
          data: {
            output,
            input: runInfo.inputs
          },
          run_id: run.id,
          name: runInfo.name,
          tags: runInfo.tags,
          metadata: runInfo.metadata
        }, runInfo);
      }
      async onChainStart(run) {
        const runName = assignName(run);
        const runType = run.run_type ?? "chain";
        const runInfo = {
          tags: run.tags ?? [],
          metadata: run.extra?.metadata ?? {},
          name: runName,
          runType: run.run_type
        };
        let eventData = {};
        if (run.inputs.input === "" && Object.keys(run.inputs).length === 1) {
          eventData = {};
          runInfo.inputs = {};
        } else if (run.inputs.input !== void 0) {
          eventData.input = run.inputs.input;
          runInfo.inputs = run.inputs.input;
        } else {
          eventData.input = run.inputs;
          runInfo.inputs = run.inputs;
        }
        this.runInfoMap.set(run.id, runInfo);
        await this.send({
          event: `on_${runType}_start`,
          data: eventData,
          name: runName,
          tags: run.tags ?? [],
          run_id: run.id,
          metadata: run.extra?.metadata ?? {}
        }, runInfo);
      }
      async onChainEnd(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        if (runInfo === void 0) {
          throw new Error(`onChainEnd: Run ID ${run.id} not found in run map.`);
        }
        const eventName = `on_${run.run_type}_end`;
        const inputs = run.inputs ?? runInfo.inputs ?? {};
        const outputs = run.outputs?.output ?? run.outputs;
        const data = {
          output: outputs,
          input: inputs
        };
        if (inputs.input && Object.keys(inputs).length === 1) {
          data.input = inputs.input;
          runInfo.inputs = inputs.input;
        }
        await this.sendEndEvent({
          event: eventName,
          data,
          run_id: run.id,
          name: runInfo.name,
          tags: runInfo.tags,
          metadata: runInfo.metadata ?? {}
        }, runInfo);
      }
      async onToolStart(run) {
        const runName = assignName(run);
        const runInfo = {
          tags: run.tags ?? [],
          metadata: run.extra?.metadata ?? {},
          name: runName,
          runType: "tool",
          inputs: run.inputs ?? {}
        };
        this.runInfoMap.set(run.id, runInfo);
        await this.send({
          event: "on_tool_start",
          data: {
            input: run.inputs ?? {}
          },
          name: runName,
          run_id: run.id,
          tags: run.tags ?? [],
          metadata: run.extra?.metadata ?? {}
        }, runInfo);
      }
      async onToolEnd(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        if (runInfo === void 0) {
          throw new Error(`onToolEnd: Run ID ${run.id} not found in run map.`);
        }
        if (runInfo.inputs === void 0) {
          throw new Error(`onToolEnd: Run ID ${run.id} is a tool call, and is expected to have traced inputs.`);
        }
        const output = run.outputs?.output === void 0 ? run.outputs : run.outputs.output;
        await this.sendEndEvent({
          event: "on_tool_end",
          data: {
            output,
            input: runInfo.inputs
          },
          run_id: run.id,
          name: runInfo.name,
          tags: runInfo.tags,
          metadata: runInfo.metadata
        }, runInfo);
      }
      async onRetrieverStart(run) {
        const runName = assignName(run);
        const runType = "retriever";
        const runInfo = {
          tags: run.tags ?? [],
          metadata: run.extra?.metadata ?? {},
          name: runName,
          runType,
          inputs: {
            query: run.inputs.query
          }
        };
        this.runInfoMap.set(run.id, runInfo);
        await this.send({
          event: "on_retriever_start",
          data: {
            input: {
              query: run.inputs.query
            }
          },
          name: runName,
          tags: run.tags ?? [],
          run_id: run.id,
          metadata: run.extra?.metadata ?? {}
        }, runInfo);
      }
      async onRetrieverEnd(run) {
        const runInfo = this.runInfoMap.get(run.id);
        this.runInfoMap.delete(run.id);
        if (runInfo === void 0) {
          throw new Error(`onRetrieverEnd: Run ID ${run.id} not found in run map.`);
        }
        await this.sendEndEvent({
          event: "on_retriever_end",
          data: {
            output: run.outputs?.documents ?? run.outputs,
            input: runInfo.inputs
          },
          run_id: run.id,
          name: runInfo.name,
          tags: runInfo.tags,
          metadata: runInfo.metadata
        }, runInfo);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async handleCustomEvent(eventName, data, runId) {
        const runInfo = this.runInfoMap.get(runId);
        if (runInfo === void 0) {
          throw new Error(`handleCustomEvent: Run ID ${runId} not found in run map.`);
        }
        await this.send({
          event: "on_custom_event",
          run_id: runId,
          name: eventName,
          tags: runInfo.tags,
          metadata: runInfo.metadata,
          data
        }, runInfo);
      }
      async finish() {
        const pendingPromises = [...this.tappedPromises.values()];
        void Promise.all(pendingPromises).finally(() => {
          void this.writer.close();
        });
      }
    };
  }
});

// node_modules/@langchain/core/dist/utils/async_caller.js
var import_p_retry2, import_p_queue3, STATUS_NO_RETRY2, defaultFailedAttemptHandler, AsyncCaller2;
var init_async_caller2 = __esm({
  "node_modules/@langchain/core/dist/utils/async_caller.js"() {
    import_p_retry2 = __toESM(require_p_retry(), 1);
    import_p_queue3 = __toESM(require_dist(), 1);
    STATUS_NO_RETRY2 = [
      400,
      401,
      402,
      403,
      404,
      405,
      406,
      407,
      409
      // Conflict
    ];
    defaultFailedAttemptHandler = (error) => {
      if (error.message.startsWith("Cancel") || error.message.startsWith("AbortError") || error.name === "AbortError") {
        throw error;
      }
      if (error?.code === "ECONNABORTED") {
        throw error;
      }
      const status = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error?.response?.status ?? error?.status
      );
      if (status && STATUS_NO_RETRY2.includes(+status)) {
        throw error;
      }
      if (error?.error?.code === "insufficient_quota") {
        const err = new Error(error?.message);
        err.name = "InsufficientQuotaError";
        throw err;
      }
    };
    AsyncCaller2 = class {
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
        Object.defineProperty(this, "onFailedAttempt", {
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
        this.maxConcurrency = params.maxConcurrency ?? Infinity;
        this.maxRetries = params.maxRetries ?? 6;
        this.onFailedAttempt = params.onFailedAttempt ?? defaultFailedAttemptHandler;
        const PQueue = "default" in import_p_queue3.default ? import_p_queue3.default.default : import_p_queue3.default;
        this.queue = new PQueue({ concurrency: this.maxConcurrency });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      call(callable, ...args) {
        return this.queue.add(() => (0, import_p_retry2.default)(() => callable(...args).catch((error) => {
          if (error instanceof Error) {
            throw error;
          } else {
            throw new Error(error);
          }
        }), {
          onFailedAttempt: this.onFailedAttempt,
          retries: this.maxRetries,
          randomize: true
          // If needed we can change some of the defaults here,
          // but they're quite sensible.
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
        return this.call(() => fetch(...args).then((res) => res.ok ? res : Promise.reject(res)));
      }
    };
  }
});

// node_modules/@langchain/core/dist/tracers/root_listener.js
var RootListenersTracer;
var init_root_listener = __esm({
  "node_modules/@langchain/core/dist/tracers/root_listener.js"() {
    init_base2();
    RootListenersTracer = class extends BaseTracer {
      constructor({ config, onStart, onEnd, onError }) {
        super({ _awaitHandler: true });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "RootListenersTracer"
        });
        Object.defineProperty(this, "rootId", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "config", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "argOnStart", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "argOnEnd", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "argOnError", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.config = config;
        this.argOnStart = onStart;
        this.argOnEnd = onEnd;
        this.argOnError = onError;
      }
      /**
       * This is a legacy method only called once for an entire run tree
       * therefore not useful here
       * @param {Run} _ Not used
       */
      persistRun(_) {
        return Promise.resolve();
      }
      async onRunCreate(run) {
        if (this.rootId) {
          return;
        }
        this.rootId = run.id;
        if (this.argOnStart) {
          await this.argOnStart(run, this.config);
        }
      }
      async onRunUpdate(run) {
        if (run.id !== this.rootId) {
          return;
        }
        if (!run.error) {
          if (this.argOnEnd) {
            await this.argOnEnd(run, this.config);
          }
        } else if (this.argOnError) {
          await this.argOnError(run, this.config);
        }
      }
    };
  }
});

// node_modules/@langchain/core/dist/runnables/utils.js
function isRunnableInterface(thing) {
  return thing ? thing.lc_runnable : false;
}
var _RootEventFilter;
var init_utils3 = __esm({
  "node_modules/@langchain/core/dist/runnables/utils.js"() {
    _RootEventFilter = class {
      constructor(fields) {
        Object.defineProperty(this, "includeNames", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "includeTypes", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "includeTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeNames", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeTypes", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "excludeTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.includeNames = fields.includeNames;
        this.includeTypes = fields.includeTypes;
        this.includeTags = fields.includeTags;
        this.excludeNames = fields.excludeNames;
        this.excludeTypes = fields.excludeTypes;
        this.excludeTags = fields.excludeTags;
      }
      includeEvent(event, rootType) {
        let include = this.includeNames === void 0 && this.includeTypes === void 0 && this.includeTags === void 0;
        const eventTags = event.tags ?? [];
        if (this.includeNames !== void 0) {
          include = include || this.includeNames.includes(event.name);
        }
        if (this.includeTypes !== void 0) {
          include = include || this.includeTypes.includes(rootType);
        }
        if (this.includeTags !== void 0) {
          include = include || eventTags.some((tag) => this.includeTags?.includes(tag));
        }
        if (this.excludeNames !== void 0) {
          include = include && !this.excludeNames.includes(event.name);
        }
        if (this.excludeTypes !== void 0) {
          include = include && !this.excludeTypes.includes(rootType);
        }
        if (this.excludeTags !== void 0) {
          include = include && eventTags.every((tag) => !this.excludeTags?.includes(tag));
        }
        return include;
      }
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/Options.js
var ignoreOverride, defaultOptions2, getDefaultOptions;
var init_Options = __esm({
  "node_modules/zod-to-json-schema/dist/esm/Options.js"() {
    ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
    defaultOptions2 = {
      name: void 0,
      $refStrategy: "root",
      basePath: ["#"],
      effectStrategy: "input",
      pipeStrategy: "all",
      dateStrategy: "format:date-time",
      mapStrategy: "entries",
      removeAdditionalStrategy: "passthrough",
      definitionPath: "definitions",
      target: "jsonSchema7",
      strictUnions: false,
      definitions: {},
      errorMessages: false,
      markdownDescription: false,
      patternStrategy: "escape",
      applyRegexFlags: false,
      emailStrategy: "format:email",
      base64Strategy: "contentEncoding:base64",
      nameStrategy: "ref"
    };
    getDefaultOptions = (options) => typeof options === "string" ? {
      ...defaultOptions2,
      name: options
    } : {
      ...defaultOptions2,
      ...options
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/Refs.js
var getRefs;
var init_Refs = __esm({
  "node_modules/zod-to-json-schema/dist/esm/Refs.js"() {
    init_Options();
    getRefs = (options) => {
      const _options = getDefaultOptions(options);
      const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
      return {
        ..._options,
        currentPath,
        propertyPath: void 0,
        seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [
          def._def,
          {
            def: def._def,
            path: [..._options.basePath, _options.definitionPath, name],
            // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
            jsonSchema: void 0
          }
        ]))
      };
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/errorMessages.js
function addErrorMessage(res, key, errorMessage, refs) {
  if (!refs?.errorMessages)
    return;
  if (errorMessage) {
    res.errorMessage = {
      ...res.errorMessage,
      [key]: errorMessage
    };
  }
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
  res[key] = value;
  addErrorMessage(res, key, errorMessage, refs);
}
var init_errorMessages = __esm({
  "node_modules/zod-to-json-schema/dist/esm/errorMessages.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/any.js
function parseAnyDef() {
  return {};
}
var init_any = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/any.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/array.js
function parseArrayDef(def, refs) {
  const res = {
    type: "array"
  };
  if (def.type?._def && def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
  }
  if (def.maxLength) {
    setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
  }
  if (def.exactLength) {
    setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
    setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
  }
  return res;
}
var init_array = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/array.js"() {
    init_lib();
    init_errorMessages();
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
function parseBigintDef(def, refs) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}
var init_bigint = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js"() {
    init_errorMessages();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js
function parseBooleanDef() {
  return {
    type: "boolean"
  };
}
var init_boolean = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/boolean.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/branded.js
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}
var init_branded = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/branded.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/catch.js
var parseCatchDef;
var init_catch = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/catch.js"() {
    init_parseDef();
    parseCatchDef = (def, refs) => {
      return parseDef(def.innerType._def, refs);
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/date.js
function parseDateDef(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy ?? refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser(def, refs);
  }
}
var integerDateParser;
var init_date = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/date.js"() {
    init_errorMessages();
    integerDateParser = (def, refs) => {
      const res = {
        type: "integer",
        format: "unix-time"
      };
      if (refs.target === "openApi3") {
        return res;
      }
      for (const check of def.checks) {
        switch (check.kind) {
          case "min":
            setResponseValueAndErrors(
              res,
              "minimum",
              check.value,
              // This is in milliseconds
              check.message,
              refs
            );
            break;
          case "max":
            setResponseValueAndErrors(
              res,
              "maximum",
              check.value,
              // This is in milliseconds
              check.message,
              refs
            );
            break;
        }
      }
      return res;
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/default.js
function parseDefaultDef(_def, refs) {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}
var init_default = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/default.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
function parseEffectsDef(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : {};
}
var init_effects = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/effects.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/enum.js
function parseEnumDef(def) {
  return {
    type: "string",
    enum: Array.from(def.values)
  };
}
var init_enum = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/enum.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
function parseIntersectionDef(def, refs) {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0;
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType(schema)) {
      mergedAllOf.push(...schema.allOf);
      if (schema.unevaluatedProperties === void 0) {
        unevaluatedProperties = void 0;
      }
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const { additionalProperties, ...rest } = schema;
        nestedSchema = rest;
      } else {
        unevaluatedProperties = void 0;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? {
    allOf: mergedAllOf,
    ...unevaluatedProperties
  } : void 0;
}
var isJsonSchema7AllOfType;
var init_intersection = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js"() {
    init_parseDef();
    isJsonSchema7AllOfType = (type) => {
      if ("type" in type && type.type === "string")
        return false;
      return "allOf" in type;
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/literal.js
function parseLiteralDef(def, refs) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  if (refs.target === "openApi3") {
    return {
      type: parsedType === "bigint" ? "integer" : parsedType,
      enum: [def.value]
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}
var init_literal = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/literal.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/string.js
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          break;
        case "max":
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern(res, zodPatterns.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern(res, zodPatterns.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern(res, zodPatterns.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
          break;
        case "endsWith":
          addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
          break;
        case "datetime":
          addFormat(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat(res, "date", check.message, refs);
          break;
        case "time":
          addFormat(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat(res, "duration", check.message, refs);
          break;
        case "length":
          setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
          setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
          break;
        case "includes": {
          addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "base64url":
          addPattern(res, zodPatterns.base64url, check.message, refs);
          break;
        case "jwt":
          addPattern(res, zodPatterns.jwt, check.message, refs);
          break;
        case "cidr": {
          if (check.version !== "v6") {
            addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
          }
          if (check.version !== "v4") {
            addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern(res, zodPatterns.emoji(), check.message, refs);
          break;
        case "ulid": {
          addPattern(res, zodPatterns.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
              break;
            }
            case "pattern:zod": {
              addPattern(res, zodPatterns.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern(res, zodPatterns.nanoid, check.message, refs);
        }
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
          /* @__PURE__ */ ((_) => {
          })(check);
      }
    }
  }
  return res;
}
function escapeLiteralCheckValue(literal, refs) {
  return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
function escapeNonAlphaNumeric(source) {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    if (!ALPHA_NUMERIC.has(source[i])) {
      result += "\\";
    }
    result += source[i];
  }
  return result;
}
function addFormat(schema, value, message, refs) {
  if (schema.format || schema.anyOf?.some((x) => x.format)) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push({
        format: schema.format,
        ...schema.errorMessage && refs.errorMessages && {
          errorMessage: { format: schema.errorMessage.format }
        }
      });
      delete schema.format;
      if (schema.errorMessage) {
        delete schema.errorMessage.format;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    setResponseValueAndErrors(schema, "format", value, message, refs);
  }
}
function addPattern(schema, regex, message, refs) {
  if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push({
        pattern: schema.pattern,
        ...schema.errorMessage && refs.errorMessages && {
          errorMessage: { pattern: schema.errorMessage.pattern }
        }
      });
      delete schema.pattern;
      if (schema.errorMessage) {
        delete schema.errorMessage.pattern;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.allOf.push({
      pattern: stringifyRegExpWithFlags(regex, refs),
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    setResponseValueAndErrors(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
  }
}
function stringifyRegExpWithFlags(regex, refs) {
  if (!refs.applyRegexFlags || !regex.flags) {
    return regex.source;
  }
  const flags = {
    i: regex.flags.includes("i"),
    m: regex.flags.includes("m"),
    s: regex.flags.includes("s")
    // `.` matches newlines
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  try {
    new RegExp(pattern);
  } catch {
    console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
    return regex.source;
  }
  return pattern;
}
var emojiRegex2, zodPatterns, ALPHA_NUMERIC;
var init_string = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/string.js"() {
    init_errorMessages();
    emojiRegex2 = void 0;
    zodPatterns = {
      /**
       * `c` was changed to `[cC]` to replicate /i flag
       */
      cuid: /^[cC][^\s-]{8,}$/,
      cuid2: /^[0-9a-z]+$/,
      ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
      /**
       * `a-z` was added to replicate /i flag
       */
      email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
      /**
       * Constructed a valid Unicode RegExp
       *
       * Lazily instantiate since this type of regex isn't supported
       * in all envs (e.g. React Native).
       *
       * See:
       * https://github.com/colinhacks/zod/issues/2433
       * Fix in Zod:
       * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
       */
      emoji: () => {
        if (emojiRegex2 === void 0) {
          emojiRegex2 = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
        }
        return emojiRegex2;
      },
      /**
       * Unused
       */
      uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
      /**
       * Unused
       */
      ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
      ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
      /**
       * Unused
       */
      ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
      ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
      base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
      base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
      nanoid: /^[a-zA-Z0-9_-]{21}$/,
      jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
    };
    ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/record.js
function parseRecordDef(def, refs) {
  if (refs.target === "openAi") {
    console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
  }
  if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      type: "object",
      required: def.keyType._def.values,
      properties: def.keyType._def.values.reduce((acc, key) => ({
        ...acc,
        [key]: parseDef(def.valueType._def, {
          ...refs,
          currentPath: [...refs.currentPath, "properties", key]
        }) ?? {}
      }), {}),
      additionalProperties: false
    };
  }
  const schema = {
    type: "object",
    additionalProperties: parseDef(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? {}
  };
  if (refs.target === "openApi3") {
    return schema;
  }
  if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
    const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  } else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      ...schema,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  } else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.type._def.checks?.length) {
    const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  }
  return schema;
}
var init_record = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/record.js"() {
    init_lib();
    init_parseDef();
    init_string();
    init_branded();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/map.js
function parseMapDef(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }
  const keys = parseDef(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || {};
  const values = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || {};
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}
var init_map = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/map.js"() {
    init_parseDef();
    init_record();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js
function parseNativeEnumDef(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}
var init_nativeEnum = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/nativeEnum.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/never.js
function parseNeverDef() {
  return {
    not: {}
  };
}
var init_never = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/never.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/null.js
function parseNullDef(refs) {
  return refs.target === "openApi3" ? {
    enum: ["null"],
    nullable: true
  } : {
    type: "null"
  };
}
var init_null = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/null.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/union.js
function parseUnionDef(def, refs) {
  if (refs.target === "openApi3")
    return asAnyOf(def, refs);
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce((acc, x) => {
      const type = typeof x._def.value;
      switch (type) {
        case "string":
        case "number":
        case "boolean":
          return [...acc, type];
        case "bigint":
          return [...acc, "integer"];
        case "object":
          if (x._def.value === null)
            return [...acc, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return acc;
      }
    }, []);
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce((acc, x) => {
          return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
        }, [])
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce((acc, x) => [
        ...acc,
        ...x._def.values.filter((x2) => !acc.includes(x2))
      ], [])
    };
  }
  return asAnyOf(def, refs);
}
var primitiveMappings, asAnyOf;
var init_union = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/union.js"() {
    init_parseDef();
    primitiveMappings = {
      ZodString: "string",
      ZodNumber: "number",
      ZodBigInt: "integer",
      ZodBoolean: "boolean",
      ZodNull: "null"
    };
    asAnyOf = (def, refs) => {
      const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", `${i}`]
      })).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
      return anyOf.length ? { anyOf } : void 0;
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    if (refs.target === "openApi3") {
      return {
        type: primitiveMappings[def.innerType._def.typeName],
        nullable: true
      };
    }
    return {
      type: [
        primitiveMappings[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  if (refs.target === "openApi3") {
    const base2 = parseDef(def.innerType._def, {
      ...refs,
      currentPath: [...refs.currentPath]
    });
    if (base2 && "$ref" in base2)
      return { allOf: [base2], nullable: true };
    return base2 && { ...base2, nullable: true };
  }
  const base = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}
var init_nullable = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js"() {
    init_parseDef();
    init_union();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/number.js
function parseNumberDef(def, refs) {
  const res = {
    type: "number"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        addErrorMessage(res, "type", check.message, refs);
        break;
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
          } else {
            setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
        break;
    }
  }
  return res;
}
var init_number = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/number.js"() {
    init_errorMessages();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/object.js
function decideAdditionalProperties(def, refs) {
  if (refs.removeAdditionalStrategy === "strict") {
    return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys !== "strict" : parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? true;
  } else {
    return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys === "passthrough" : parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    }) ?? true;
  }
}
function parseObjectDef(def, refs) {
  const forceOptionalIntoNullable = refs.target === "openAi";
  const result = {
    type: "object",
    ...Object.entries(def.shape()).reduce((acc, [propName, propDef]) => {
      if (propDef === void 0 || propDef._def === void 0)
        return acc;
      let propOptional = propDef.isOptional();
      if (propOptional && forceOptionalIntoNullable) {
        if (propDef instanceof ZodOptional) {
          propDef = propDef._def.innerType;
        }
        if (!propDef.isNullable()) {
          propDef = propDef.nullable();
        }
        propOptional = false;
      }
      const parsedDef = parseDef(propDef._def, {
        ...refs,
        currentPath: [...refs.currentPath, "properties", propName],
        propertyPath: [...refs.currentPath, "properties", propName]
      });
      if (parsedDef === void 0)
        return acc;
      return {
        properties: { ...acc.properties, [propName]: parsedDef },
        required: propOptional ? acc.required : [...acc.required, propName]
      };
    }, { properties: {}, required: [] }),
    additionalProperties: decideAdditionalProperties(def, refs)
  };
  if (!result.required.length)
    delete result.required;
  return result;
}
var init_object = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/object.js"() {
    init_lib();
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/optional.js
var parseOptionalDef;
var init_optional = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/optional.js"() {
    init_parseDef();
    parseOptionalDef = (def, refs) => {
      if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
        return parseDef(def.innerType._def, refs);
      }
      const innerSchema = parseDef(def.innerType._def, {
        ...refs,
        currentPath: [...refs.currentPath, "anyOf", "1"]
      });
      return innerSchema ? {
        anyOf: [
          {
            not: {}
          },
          innerSchema
        ]
      } : {};
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/pipeline.js
var parsePipelineDef;
var init_pipeline = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/pipeline.js"() {
    init_parseDef();
    parsePipelineDef = (def, refs) => {
      if (refs.pipeStrategy === "input") {
        return parseDef(def.in._def, refs);
      } else if (refs.pipeStrategy === "output") {
        return parseDef(def.out._def, refs);
      }
      const a = parseDef(def.in._def, {
        ...refs,
        currentPath: [...refs.currentPath, "allOf", "0"]
      });
      const b = parseDef(def.out._def, {
        ...refs,
        currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
      });
      return {
        allOf: [a, b].filter((x) => x !== void 0)
      };
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/promise.js
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}
var init_promise = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/promise.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/set.js
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
  }
  if (def.maxSize) {
    setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
  }
  return schema;
}
var init_set = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/set.js"() {
    init_errorMessages();
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", `${i}`]
      })).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
      additionalItems: parseDef(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map((x, i) => parseDef(x._def, {
        ...refs,
        currentPath: [...refs.currentPath, "items", `${i}`]
      })).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
    };
  }
}
var init_tuple = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js"() {
    init_parseDef();
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js
function parseUndefinedDef() {
  return {
    not: {}
  };
}
var init_undefined = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js
function parseUnknownDef() {
  return {};
}
var init_unknown = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js"() {
  }
});

// node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js
var parseReadonlyDef;
var init_readonly = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js"() {
    init_parseDef();
    parseReadonlyDef = (def, refs) => {
      return parseDef(def.innerType._def, refs);
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/parseDef.js
function parseDef(def, refs, forceResolution = false) {
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
    if (overrideResult !== ignoreOverride) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchema = selectParser(def, def.typeName, refs);
  if (jsonSchema) {
    addMeta(def, refs, jsonSchema);
  }
  newItem.jsonSchema = jsonSchema;
  return jsonSchema;
}
var get$ref, getRelativePath, selectParser, addMeta;
var init_parseDef = __esm({
  "node_modules/zod-to-json-schema/dist/esm/parseDef.js"() {
    init_lib();
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
    get$ref = (item, refs) => {
      switch (refs.$refStrategy) {
        case "root":
          return { $ref: item.path.join("/") };
        case "relative":
          return { $ref: getRelativePath(refs.currentPath, item.path) };
        case "none":
        case "seen": {
          if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
            console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
            return {};
          }
          return refs.$refStrategy === "seen" ? {} : void 0;
        }
      }
    };
    getRelativePath = (pathA, pathB) => {
      let i = 0;
      for (; i < pathA.length && i < pathB.length; i++) {
        if (pathA[i] !== pathB[i])
          break;
      }
      return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
    };
    selectParser = (def, typeName, refs) => {
      switch (typeName) {
        case ZodFirstPartyTypeKind.ZodString:
          return parseStringDef(def, refs);
        case ZodFirstPartyTypeKind.ZodNumber:
          return parseNumberDef(def, refs);
        case ZodFirstPartyTypeKind.ZodObject:
          return parseObjectDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBigInt:
          return parseBigintDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBoolean:
          return parseBooleanDef();
        case ZodFirstPartyTypeKind.ZodDate:
          return parseDateDef(def, refs);
        case ZodFirstPartyTypeKind.ZodUndefined:
          return parseUndefinedDef();
        case ZodFirstPartyTypeKind.ZodNull:
          return parseNullDef(refs);
        case ZodFirstPartyTypeKind.ZodArray:
          return parseArrayDef(def, refs);
        case ZodFirstPartyTypeKind.ZodUnion:
        case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
          return parseUnionDef(def, refs);
        case ZodFirstPartyTypeKind.ZodIntersection:
          return parseIntersectionDef(def, refs);
        case ZodFirstPartyTypeKind.ZodTuple:
          return parseTupleDef(def, refs);
        case ZodFirstPartyTypeKind.ZodRecord:
          return parseRecordDef(def, refs);
        case ZodFirstPartyTypeKind.ZodLiteral:
          return parseLiteralDef(def, refs);
        case ZodFirstPartyTypeKind.ZodEnum:
          return parseEnumDef(def);
        case ZodFirstPartyTypeKind.ZodNativeEnum:
          return parseNativeEnumDef(def);
        case ZodFirstPartyTypeKind.ZodNullable:
          return parseNullableDef(def, refs);
        case ZodFirstPartyTypeKind.ZodOptional:
          return parseOptionalDef(def, refs);
        case ZodFirstPartyTypeKind.ZodMap:
          return parseMapDef(def, refs);
        case ZodFirstPartyTypeKind.ZodSet:
          return parseSetDef(def, refs);
        case ZodFirstPartyTypeKind.ZodLazy:
          return parseDef(def.getter()._def, refs);
        case ZodFirstPartyTypeKind.ZodPromise:
          return parsePromiseDef(def, refs);
        case ZodFirstPartyTypeKind.ZodNaN:
        case ZodFirstPartyTypeKind.ZodNever:
          return parseNeverDef();
        case ZodFirstPartyTypeKind.ZodEffects:
          return parseEffectsDef(def, refs);
        case ZodFirstPartyTypeKind.ZodAny:
          return parseAnyDef();
        case ZodFirstPartyTypeKind.ZodUnknown:
          return parseUnknownDef();
        case ZodFirstPartyTypeKind.ZodDefault:
          return parseDefaultDef(def, refs);
        case ZodFirstPartyTypeKind.ZodBranded:
          return parseBrandedDef(def, refs);
        case ZodFirstPartyTypeKind.ZodReadonly:
          return parseReadonlyDef(def, refs);
        case ZodFirstPartyTypeKind.ZodCatch:
          return parseCatchDef(def, refs);
        case ZodFirstPartyTypeKind.ZodPipeline:
          return parsePipelineDef(def, refs);
        case ZodFirstPartyTypeKind.ZodFunction:
        case ZodFirstPartyTypeKind.ZodVoid:
        case ZodFirstPartyTypeKind.ZodSymbol:
          return void 0;
        default:
          return /* @__PURE__ */ ((_) => void 0)(typeName);
      }
    };
    addMeta = (def, refs, jsonSchema) => {
      if (def.description) {
        jsonSchema.description = def.description;
        if (refs.markdownDescription) {
          jsonSchema.markdownDescription = def.description;
        }
      }
      return jsonSchema;
    };
  }
});

// node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js
var zodToJsonSchema;
var init_zodToJsonSchema = __esm({
  "node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js"() {
    init_parseDef();
    init_Refs();
    zodToJsonSchema = (schema, options) => {
      const refs = getRefs(options);
      const definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name2, schema2]) => ({
        ...acc,
        [name2]: parseDef(schema2._def, {
          ...refs,
          currentPath: [...refs.basePath, refs.definitionPath, name2]
        }, true) ?? {}
      }), {}) : void 0;
      const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
      const main = parseDef(schema._def, name === void 0 ? refs : {
        ...refs,
        currentPath: [...refs.basePath, refs.definitionPath, name]
      }, false) ?? {};
      const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
      if (title !== void 0) {
        main.title = title;
      }
      const combined = name === void 0 ? definitions ? {
        ...main,
        [refs.definitionPath]: definitions
      } : main : {
        $ref: [
          ...refs.$refStrategy === "relative" ? [] : refs.basePath,
          refs.definitionPath,
          name
        ].join("/"),
        [refs.definitionPath]: {
          ...definitions,
          [name]: main
        }
      };
      if (refs.target === "jsonSchema7") {
        combined.$schema = "http://json-schema.org/draft-07/schema#";
      } else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") {
        combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
      }
      if (refs.target === "openAi" && ("anyOf" in combined || "oneOf" in combined || "allOf" in combined || "type" in combined && Array.isArray(combined.type))) {
        console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
      }
      return combined;
    };
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
function _escapeNodeLabel(nodeLabel) {
  return nodeLabel.replace(/[^a-zA-Z-_0-9]/g, "_");
}
function _generateMermaidGraphStyles(nodeColors) {
  let styles2 = "";
  for (const [className, color2] of Object.entries(nodeColors)) {
    styles2 += `	classDef ${className} ${color2};
`;
  }
  return styles2;
}
function drawMermaid(nodes, edges, config) {
  const { firstNode, lastNode, nodeColors, withStyles = true, curveStyle = "linear", wrapLabelNWords = 9 } = config ?? {};
  let mermaidGraph = withStyles ? `%%{init: {'flowchart': {'curve': '${curveStyle}'}}}%%
graph TD;
` : "graph TD;\n";
  if (withStyles) {
    const defaultClassLabel = "default";
    const formatDict = {
      [defaultClassLabel]: "{0}({1})"
    };
    if (firstNode !== void 0) {
      formatDict[firstNode] = "{0}([{1}]):::first";
    }
    if (lastNode !== void 0) {
      formatDict[lastNode] = "{0}([{1}]):::last";
    }
    for (const [key, node] of Object.entries(nodes)) {
      const nodeName = node.name.split(":").pop() ?? "";
      const label = MARKDOWN_SPECIAL_CHARS.some((char) => nodeName.startsWith(char) && nodeName.endsWith(char)) ? `<p>${nodeName}</p>` : nodeName;
      let finalLabel = label;
      if (Object.keys(node.metadata ?? {}).length) {
        finalLabel += `<hr/><small><em>${Object.entries(node.metadata ?? {}).map(([k, v]) => `${k} = ${v}`).join("\n")}</em></small>`;
      }
      const nodeLabel = (formatDict[key] ?? formatDict[defaultClassLabel]).replace("{0}", _escapeNodeLabel(key)).replace("{1}", finalLabel);
      mermaidGraph += `	${nodeLabel}
`;
    }
  }
  const edgeGroups = {};
  for (const edge of edges) {
    const srcParts = edge.source.split(":");
    const tgtParts = edge.target.split(":");
    const commonPrefix = srcParts.filter((src, i) => src === tgtParts[i]).join(":");
    if (!edgeGroups[commonPrefix]) {
      edgeGroups[commonPrefix] = [];
    }
    edgeGroups[commonPrefix].push(edge);
  }
  const seenSubgraphs = /* @__PURE__ */ new Set();
  function addSubgraph(edges2, prefix) {
    const selfLoop = edges2.length === 1 && edges2[0].source === edges2[0].target;
    if (prefix && !selfLoop) {
      const subgraph = prefix.split(":").pop();
      if (seenSubgraphs.has(subgraph)) {
        throw new Error(`Found duplicate subgraph '${subgraph}' -- this likely means that you're reusing a subgraph node with the same name. Please adjust your graph to have subgraph nodes with unique names.`);
      }
      seenSubgraphs.add(subgraph);
      mermaidGraph += `	subgraph ${subgraph}
`;
    }
    for (const edge of edges2) {
      const { source, target, data, conditional } = edge;
      let edgeLabel = "";
      if (data !== void 0) {
        let edgeData = data;
        const words = edgeData.split(" ");
        if (words.length > wrapLabelNWords) {
          edgeData = Array.from({ length: Math.ceil(words.length / wrapLabelNWords) }, (_, i) => words.slice(i * wrapLabelNWords, (i + 1) * wrapLabelNWords).join(" ")).join("&nbsp;<br>&nbsp;");
        }
        edgeLabel = conditional ? ` -. &nbsp;${edgeData}&nbsp; .-> ` : ` -- &nbsp;${edgeData}&nbsp; --> `;
      } else {
        edgeLabel = conditional ? " -.-> " : " --> ";
      }
      mermaidGraph += `	${_escapeNodeLabel(source)}${edgeLabel}${_escapeNodeLabel(target)};
`;
    }
    for (const nestedPrefix in edgeGroups) {
      if (nestedPrefix.startsWith(`${prefix}:`) && nestedPrefix !== prefix) {
        addSubgraph(edgeGroups[nestedPrefix], nestedPrefix);
      }
    }
    if (prefix && !selfLoop) {
      mermaidGraph += "	end\n";
    }
  }
  addSubgraph(edgeGroups[""] ?? [], "");
  for (const prefix in edgeGroups) {
    if (!prefix.includes(":") && prefix !== "") {
      addSubgraph(edgeGroups[prefix], prefix);
    }
  }
  if (withStyles) {
    mermaidGraph += _generateMermaidGraphStyles(nodeColors ?? {});
  }
  return mermaidGraph;
}
async function drawMermaidPng(mermaidSyntax, config) {
  let { backgroundColor = "white" } = config ?? {};
  const mermaidSyntaxEncoded = btoa(mermaidSyntax);
  if (backgroundColor !== void 0) {
    const hexColorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    if (!hexColorPattern.test(backgroundColor)) {
      backgroundColor = `!${backgroundColor}`;
    }
  }
  const imageUrl = `https://mermaid.ink/img/${mermaidSyntaxEncoded}?bgColor=${backgroundColor}`;
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error([
      `Failed to render the graph using the Mermaid.INK API.`,
      `Status code: ${res.status}`,
      `Status text: ${res.statusText}`
    ].join("\n"));
  }
  const content = await res.blob();
  return content;
}
var MARKDOWN_SPECIAL_CHARS;
var init_graph_mermaid = __esm({
  "node_modules/@langchain/core/dist/runnables/graph_mermaid.js"() {
    MARKDOWN_SPECIAL_CHARS = ["*", "_", "`"];
  }
});

// node_modules/@langchain/core/dist/runnables/graph.js
function nodeDataStr(id, data) {
  if (id !== void 0 && !validate_default(id)) {
    return id;
  } else if (isRunnableInterface(data)) {
    try {
      let dataStr = data.getName();
      dataStr = dataStr.startsWith("Runnable") ? dataStr.slice("Runnable".length) : dataStr;
      return dataStr;
    } catch (error) {
      return data.getName();
    }
  } else {
    return data.name ?? "UnknownSchema";
  }
}
function nodeDataJson(node) {
  if (isRunnableInterface(node.data)) {
    return {
      type: "runnable",
      data: {
        id: node.data.lc_id,
        name: node.data.getName()
      }
    };
  } else {
    return {
      type: "schema",
      data: { ...zodToJsonSchema(node.data.schema), title: node.data.name }
    };
  }
}
function _firstNode(graph, exclude = []) {
  const targets = new Set(graph.edges.filter((edge) => !exclude.includes(edge.source)).map((edge) => edge.target));
  const found = [];
  for (const node of Object.values(graph.nodes)) {
    if (!exclude.includes(node.id) && !targets.has(node.id)) {
      found.push(node);
    }
  }
  return found.length === 1 ? found[0] : void 0;
}
function _lastNode(graph, exclude = []) {
  const sources = new Set(graph.edges.filter((edge) => !exclude.includes(edge.target)).map((edge) => edge.source));
  const found = [];
  for (const node of Object.values(graph.nodes)) {
    if (!exclude.includes(node.id) && !sources.has(node.id)) {
      found.push(node);
    }
  }
  return found.length === 1 ? found[0] : void 0;
}
var Graph;
var init_graph = __esm({
  "node_modules/@langchain/core/dist/runnables/graph.js"() {
    init_esm();
    init_esm_browser();
    init_utils3();
    init_graph_mermaid();
    Graph = class _Graph {
      constructor(params) {
        Object.defineProperty(this, "nodes", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: {}
        });
        Object.defineProperty(this, "edges", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        this.nodes = params?.nodes ?? this.nodes;
        this.edges = params?.edges ?? this.edges;
      }
      // Convert the graph to a JSON-serializable format.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toJSON() {
        const stableNodeIds = {};
        Object.values(this.nodes).forEach((node, i) => {
          stableNodeIds[node.id] = validate_default(node.id) ? i : node.id;
        });
        return {
          nodes: Object.values(this.nodes).map((node) => ({
            id: stableNodeIds[node.id],
            ...nodeDataJson(node)
          })),
          edges: this.edges.map((edge) => {
            const item = {
              source: stableNodeIds[edge.source],
              target: stableNodeIds[edge.target]
            };
            if (typeof edge.data !== "undefined") {
              item.data = edge.data;
            }
            if (typeof edge.conditional !== "undefined") {
              item.conditional = edge.conditional;
            }
            return item;
          })
        };
      }
      addNode(data, id, metadata) {
        if (id !== void 0 && this.nodes[id] !== void 0) {
          throw new Error(`Node with id ${id} already exists`);
        }
        const nodeId = id ?? v4_default();
        const node = {
          id: nodeId,
          data,
          name: nodeDataStr(id, data),
          metadata
        };
        this.nodes[nodeId] = node;
        return node;
      }
      removeNode(node) {
        delete this.nodes[node.id];
        this.edges = this.edges.filter((edge) => edge.source !== node.id && edge.target !== node.id);
      }
      addEdge(source, target, data, conditional) {
        if (this.nodes[source.id] === void 0) {
          throw new Error(`Source node ${source.id} not in graph`);
        }
        if (this.nodes[target.id] === void 0) {
          throw new Error(`Target node ${target.id} not in graph`);
        }
        const edge = {
          source: source.id,
          target: target.id,
          data,
          conditional
        };
        this.edges.push(edge);
        return edge;
      }
      firstNode() {
        return _firstNode(this);
      }
      lastNode() {
        return _lastNode(this);
      }
      /**
       * Add all nodes and edges from another graph.
       * Note this doesn't check for duplicates, nor does it connect the graphs.
       */
      extend(graph, prefix = "") {
        let finalPrefix = prefix;
        const nodeIds = Object.values(graph.nodes).map((node) => node.id);
        if (nodeIds.every(validate_default)) {
          finalPrefix = "";
        }
        const prefixed = (id) => {
          return finalPrefix ? `${finalPrefix}:${id}` : id;
        };
        Object.entries(graph.nodes).forEach(([key, value]) => {
          this.nodes[prefixed(key)] = { ...value, id: prefixed(key) };
        });
        const newEdges = graph.edges.map((edge) => {
          return {
            ...edge,
            source: prefixed(edge.source),
            target: prefixed(edge.target)
          };
        });
        this.edges = [...this.edges, ...newEdges];
        const first = graph.firstNode();
        const last = graph.lastNode();
        return [
          first ? { id: prefixed(first.id), data: first.data } : void 0,
          last ? { id: prefixed(last.id), data: last.data } : void 0
        ];
      }
      trimFirstNode() {
        const firstNode = this.firstNode();
        if (firstNode && _firstNode(this, [firstNode.id])) {
          this.removeNode(firstNode);
        }
      }
      trimLastNode() {
        const lastNode = this.lastNode();
        if (lastNode && _lastNode(this, [lastNode.id])) {
          this.removeNode(lastNode);
        }
      }
      /**
       * Return a new graph with all nodes re-identified,
       * using their unique, readable names where possible.
       */
      reid() {
        const nodeLabels = Object.fromEntries(Object.values(this.nodes).map((node) => [node.id, node.name]));
        const nodeLabelCounts = /* @__PURE__ */ new Map();
        Object.values(nodeLabels).forEach((label) => {
          nodeLabelCounts.set(label, (nodeLabelCounts.get(label) || 0) + 1);
        });
        const getNodeId = (nodeId) => {
          const label = nodeLabels[nodeId];
          if (validate_default(nodeId) && nodeLabelCounts.get(label) === 1) {
            return label;
          } else {
            return nodeId;
          }
        };
        return new _Graph({
          nodes: Object.fromEntries(Object.entries(this.nodes).map(([id, node]) => [
            getNodeId(id),
            { ...node, id: getNodeId(id) }
          ])),
          edges: this.edges.map((edge) => ({
            ...edge,
            source: getNodeId(edge.source),
            target: getNodeId(edge.target)
          }))
        });
      }
      drawMermaid(params) {
        const { withStyles, curveStyle, nodeColors = {
          default: "fill:#f2f0ff,line-height:1.2",
          first: "fill-opacity:0",
          last: "fill:#bfb6fc"
        }, wrapLabelNWords } = params ?? {};
        const graph = this.reid();
        const firstNode = graph.firstNode();
        const lastNode = graph.lastNode();
        return drawMermaid(graph.nodes, graph.edges, {
          firstNode: firstNode?.id,
          lastNode: lastNode?.id,
          withStyles,
          curveStyle,
          nodeColors,
          wrapLabelNWords
        });
      }
      async drawMermaidPng(params) {
        const mermaidSyntax = this.drawMermaid(params);
        return drawMermaidPng(mermaidSyntax, {
          backgroundColor: params?.backgroundColor
        });
      }
    };
  }
});

// node_modules/@langchain/core/dist/runnables/wrappers.js
function convertToHttpEventStream(stream) {
  const encoder = new TextEncoder();
  const finalStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(`event: data
data: ${JSON.stringify(chunk)}

`));
      }
      controller.enqueue(encoder.encode("event: end\n\n"));
      controller.close();
    }
  });
  return IterableReadableStream.fromReadableStream(finalStream);
}
var init_wrappers = __esm({
  "node_modules/@langchain/core/dist/runnables/wrappers.js"() {
    init_stream();
  }
});

// node_modules/@langchain/core/dist/runnables/iter.js
function isIterableIterator(thing) {
  return typeof thing === "object" && thing !== null && typeof thing[Symbol.iterator] === "function" && // avoid detecting array/set as iterator
  typeof thing.next === "function";
}
function isAsyncIterable(thing) {
  return typeof thing === "object" && thing !== null && typeof thing[Symbol.asyncIterator] === "function";
}
function* consumeIteratorInContext(context, iter) {
  while (true) {
    const { value, done } = AsyncLocalStorageProviderSingleton2.runWithConfig(pickRunnableConfigKeys(context), iter.next.bind(iter), true);
    if (done) {
      break;
    } else {
      yield value;
    }
  }
}
async function* consumeAsyncIterableInContext(context, iter) {
  const iterator = iter[Symbol.asyncIterator]();
  while (true) {
    const { value, done } = await AsyncLocalStorageProviderSingleton2.runWithConfig(pickRunnableConfigKeys(context), iterator.next.bind(iter), true);
    if (done) {
      break;
    } else {
      yield value;
    }
  }
}
var isIterator;
var init_iter = __esm({
  "node_modules/@langchain/core/dist/runnables/iter.js"() {
    init_singletons();
    init_config();
    isIterator = (x) => x != null && typeof x === "object" && "next" in x && typeof x.next === "function";
  }
});

// node_modules/@langchain/core/dist/runnables/base.js
function _coerceToDict2(value, defaultKey) {
  return value && !Array.isArray(value) && // eslint-disable-next-line no-instanceof/no-instanceof
  !(value instanceof Date) && typeof value === "object" ? value : { [defaultKey]: value };
}
function assertNonTraceableFunction(func) {
  if (isTraceableFunction(func)) {
    throw new Error("RunnableLambda requires a function that is not wrapped in traceable higher-order function. This shouldn't happen.");
  }
}
function _coerceToRunnable(coerceable) {
  if (typeof coerceable === "function") {
    return new RunnableLambda({ func: coerceable });
  } else if (Runnable.isRunnable(coerceable)) {
    return coerceable;
  } else if (!Array.isArray(coerceable) && typeof coerceable === "object") {
    const runnables = {};
    for (const [key, value] of Object.entries(coerceable)) {
      runnables[key] = _coerceToRunnable(value);
    }
    return new RunnableMap({
      steps: runnables
    });
  } else {
    throw new Error(`Expected a Runnable, function or object.
Instead got an unsupported type.`);
  }
}
function convertRunnableToTool(runnable, fields) {
  const name = fields.name ?? runnable.getName();
  const description = fields.description ?? fields.schema?.description;
  if (fields.schema.constructor === z.ZodString) {
    return new RunnableToolLike({
      name,
      description,
      schema: z.object({
        input: z.string()
      }).transform((input) => input.input),
      bound: runnable
    });
  }
  return new RunnableToolLike({
    name,
    description,
    schema: fields.schema,
    bound: runnable
  });
}
var import_p_retry3, Runnable, RunnableBinding, RunnableEach, RunnableRetry, RunnableSequence, RunnableMap, RunnableTraceable, RunnableLambda, RunnableWithFallbacks, RunnableAssign, RunnablePick, RunnableToolLike;
var init_base4 = __esm({
  "node_modules/@langchain/core/dist/runnables/base.js"() {
    init_lib();
    import_p_retry3 = __toESM(require_p_retry(), 1);
    init_esm_browser();
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
    Runnable = class extends Serializable {
      constructor() {
        super(...arguments);
        Object.defineProperty(this, "lc_runnable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
      }
      getName(suffix) {
        const name = (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.name ?? this.constructor.lc_name() ?? this.constructor.name
        );
        return suffix ? `${name}${suffix}` : name;
      }
      /**
       * Bind arguments to a Runnable, returning a new Runnable.
       * @param kwargs
       * @returns A new RunnableBinding that, when invoked, will apply the bound args.
       */
      bind(kwargs) {
        return new RunnableBinding({ bound: this, kwargs, config: {} });
      }
      /**
       * Return a new Runnable that maps a list of inputs to a list of outputs,
       * by calling invoke() with each input.
       */
      map() {
        return new RunnableEach({ bound: this });
      }
      /**
       * Add retry logic to an existing runnable.
       * @param kwargs
       * @returns A new RunnableRetry that, when invoked, will retry according to the parameters.
       */
      withRetry(fields) {
        return new RunnableRetry({
          bound: this,
          kwargs: {},
          config: {},
          maxAttemptNumber: fields?.stopAfterAttempt,
          ...fields
        });
      }
      /**
       * Bind config to a Runnable, returning a new Runnable.
       * @param config New configuration parameters to attach to the new runnable.
       * @returns A new RunnableBinding with a config matching what's passed.
       */
      withConfig(config) {
        return new RunnableBinding({
          bound: this,
          config,
          kwargs: {}
        });
      }
      /**
       * Create a new runnable from the current one that will try invoking
       * other passed fallback runnables if the initial invocation fails.
       * @param fields.fallbacks Other runnables to call if the runnable errors.
       * @returns A new RunnableWithFallbacks.
       */
      withFallbacks(fields) {
        const fallbacks = Array.isArray(fields) ? fields : fields.fallbacks;
        return new RunnableWithFallbacks({
          runnable: this,
          fallbacks
        });
      }
      _getOptionsList(options, length = 0) {
        if (Array.isArray(options) && options.length !== length) {
          throw new Error(`Passed "options" must be an array with the same length as the inputs, but got ${options.length} options for ${length} inputs`);
        }
        if (Array.isArray(options)) {
          return options.map(ensureConfig);
        }
        if (length > 1 && !Array.isArray(options) && options.runId) {
          console.warn("Provided runId will be used only for the first element of the batch.");
          const subsequent = Object.fromEntries(Object.entries(options).filter(([key]) => key !== "runId"));
          return Array.from({ length }, (_, i) => ensureConfig(i === 0 ? options : subsequent));
        }
        return Array.from({ length }, () => ensureConfig(options));
      }
      async batch(inputs, options, batchOptions) {
        const configList = this._getOptionsList(options ?? {}, inputs.length);
        const maxConcurrency = configList[0]?.maxConcurrency ?? batchOptions?.maxConcurrency;
        const caller2 = new AsyncCaller2({
          maxConcurrency,
          onFailedAttempt: (e) => {
            throw e;
          }
        });
        const batchCalls = inputs.map((input, i) => caller2.call(async () => {
          try {
            const result = await this.invoke(input, configList[i]);
            return result;
          } catch (e) {
            if (batchOptions?.returnExceptions) {
              return e;
            }
            throw e;
          }
        }));
        return Promise.all(batchCalls);
      }
      /**
       * Default streaming implementation.
       * Subclasses should override this method if they support streaming output.
       * @param input
       * @param options
       */
      async *_streamIterator(input, options) {
        yield this.invoke(input, options);
      }
      /**
       * Stream output in chunks.
       * @param input
       * @param options
       * @returns A readable stream that is also an iterable.
       */
      async stream(input, options) {
        const config = ensureConfig(options);
        const wrappedGenerator = new AsyncGeneratorWithSetup({
          generator: this._streamIterator(input, config),
          config
        });
        await wrappedGenerator.setup;
        return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
      }
      _separateRunnableConfigFromCallOptions(options) {
        let runnableConfig;
        if (options === void 0) {
          runnableConfig = ensureConfig(options);
        } else {
          runnableConfig = ensureConfig({
            callbacks: options.callbacks,
            tags: options.tags,
            metadata: options.metadata,
            runName: options.runName,
            configurable: options.configurable,
            recursionLimit: options.recursionLimit,
            maxConcurrency: options.maxConcurrency,
            runId: options.runId,
            timeout: options.timeout,
            signal: options.signal
          });
        }
        const callOptions = { ...options };
        delete callOptions.callbacks;
        delete callOptions.tags;
        delete callOptions.metadata;
        delete callOptions.runName;
        delete callOptions.configurable;
        delete callOptions.recursionLimit;
        delete callOptions.maxConcurrency;
        delete callOptions.runId;
        delete callOptions.timeout;
        delete callOptions.signal;
        return [runnableConfig, callOptions];
      }
      async _callWithConfig(func, input, options) {
        const config = ensureConfig(options);
        const callbackManager_ = await getCallbackManagerForConfig(config);
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict2(input, "input"), config.runId, config?.runType, void 0, void 0, config?.runName ?? this.getName());
        delete config.runId;
        let output;
        try {
          const promise = func.call(this, input, config, runManager);
          output = await raceWithSignal(promise, options?.signal);
        } catch (e) {
          await runManager?.handleChainError(e);
          throw e;
        }
        await runManager?.handleChainEnd(_coerceToDict2(output, "output"));
        return output;
      }
      /**
       * Internal method that handles batching and configuration for a runnable
       * It takes a function, input values, and optional configuration, and
       * returns a promise that resolves to the output values.
       * @param func The function to be executed for each input value.
       * @param input The input values to be processed.
       * @param config Optional configuration for the function execution.
       * @returns A promise that resolves to the output values.
       */
      async _batchWithConfig(func, inputs, options, batchOptions) {
        const optionsList = this._getOptionsList(options ?? {}, inputs.length);
        const callbackManagers = await Promise.all(optionsList.map(getCallbackManagerForConfig));
        const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i) => {
          const handleStartRes = await callbackManager?.handleChainStart(this.toJSON(), _coerceToDict2(inputs[i], "input"), optionsList[i].runId, optionsList[i].runType, void 0, void 0, optionsList[i].runName ?? this.getName());
          delete optionsList[i].runId;
          return handleStartRes;
        }));
        let outputs;
        try {
          const promise = func.call(this, inputs, optionsList, runManagers, batchOptions);
          outputs = await raceWithSignal(promise, optionsList?.[0]?.signal);
        } catch (e) {
          await Promise.all(runManagers.map((runManager) => runManager?.handleChainError(e)));
          throw e;
        }
        await Promise.all(runManagers.map((runManager) => runManager?.handleChainEnd(_coerceToDict2(outputs, "output"))));
        return outputs;
      }
      /**
       * Helper method to transform an Iterator of Input values into an Iterator of
       * Output values, with callbacks.
       * Use this to implement `stream()` or `transform()` in Runnable subclasses.
       */
      async *_transformStreamWithConfig(inputGenerator, transformer, options) {
        let finalInput;
        let finalInputSupported = true;
        let finalOutput;
        let finalOutputSupported = true;
        const config = ensureConfig(options);
        const callbackManager_ = await getCallbackManagerForConfig(config);
        async function* wrapInputForTracing() {
          for await (const chunk of inputGenerator) {
            if (finalInputSupported) {
              if (finalInput === void 0) {
                finalInput = chunk;
              } else {
                try {
                  finalInput = concat(finalInput, chunk);
                } catch {
                  finalInput = void 0;
                  finalInputSupported = false;
                }
              }
            }
            yield chunk;
          }
        }
        let runManager;
        try {
          const pipe = await pipeGeneratorWithSetup(transformer.bind(this), wrapInputForTracing(), async () => callbackManager_?.handleChainStart(this.toJSON(), { input: "" }, config.runId, config.runType, void 0, void 0, config.runName ?? this.getName()), options?.signal, config);
          delete config.runId;
          runManager = pipe.setup;
          const streamEventsHandler = runManager?.handlers.find(isStreamEventsHandler);
          let iterator = pipe.output;
          if (streamEventsHandler !== void 0 && runManager !== void 0) {
            iterator = streamEventsHandler.tapOutputIterable(runManager.runId, iterator);
          }
          const streamLogHandler = runManager?.handlers.find(isLogStreamHandler);
          if (streamLogHandler !== void 0 && runManager !== void 0) {
            iterator = streamLogHandler.tapOutputIterable(runManager.runId, iterator);
          }
          for await (const chunk of iterator) {
            yield chunk;
            if (finalOutputSupported) {
              if (finalOutput === void 0) {
                finalOutput = chunk;
              } else {
                try {
                  finalOutput = concat(finalOutput, chunk);
                } catch {
                  finalOutput = void 0;
                  finalOutputSupported = false;
                }
              }
            }
          }
        } catch (e) {
          await runManager?.handleChainError(e, void 0, void 0, void 0, {
            inputs: _coerceToDict2(finalInput, "input")
          });
          throw e;
        }
        await runManager?.handleChainEnd(finalOutput ?? {}, void 0, void 0, void 0, { inputs: _coerceToDict2(finalInput, "input") });
      }
      getGraph(_) {
        const graph = new Graph();
        const inputNode = graph.addNode({
          name: `${this.getName()}Input`,
          schema: z.any()
        });
        const runnableNode = graph.addNode(this);
        const outputNode = graph.addNode({
          name: `${this.getName()}Output`,
          schema: z.any()
        });
        graph.addEdge(inputNode, runnableNode);
        graph.addEdge(runnableNode, outputNode);
        return graph;
      }
      /**
       * Create a new runnable sequence that runs each individual runnable in series,
       * piping the output of one runnable into another runnable or runnable-like.
       * @param coerceable A runnable, function, or object whose values are functions or runnables.
       * @returns A new runnable sequence.
       */
      pipe(coerceable) {
        return new RunnableSequence({
          first: this,
          last: _coerceToRunnable(coerceable)
        });
      }
      /**
       * Pick keys from the dict output of this runnable. Returns a new runnable.
       */
      pick(keys) {
        return this.pipe(new RunnablePick(keys));
      }
      /**
       * Assigns new fields to the dict output of this runnable. Returns a new runnable.
       */
      assign(mapping) {
        return this.pipe(
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          new RunnableAssign(
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            new RunnableMap({ steps: mapping })
          )
        );
      }
      /**
       * Default implementation of transform, which buffers input and then calls stream.
       * Subclasses should override this method if they can start producing output while
       * input is still being generated.
       * @param generator
       * @param options
       */
      async *transform(generator, options) {
        let finalChunk;
        for await (const chunk of generator) {
          if (finalChunk === void 0) {
            finalChunk = chunk;
          } else {
            finalChunk = concat(finalChunk, chunk);
          }
        }
        yield* this._streamIterator(finalChunk, ensureConfig(options));
      }
      /**
       * Stream all output from a runnable, as reported to the callback system.
       * This includes all inner runs of LLMs, Retrievers, Tools, etc.
       * Output is streamed as Log objects, which include a list of
       * jsonpatch ops that describe how the state of the run has changed in each
       * step, and the final state of the run.
       * The jsonpatch ops can be applied in order to construct state.
       * @param input
       * @param options
       * @param streamOptions
       */
      async *streamLog(input, options, streamOptions) {
        const logStreamCallbackHandler = new LogStreamCallbackHandler({
          ...streamOptions,
          autoClose: false,
          _schemaFormat: "original"
        });
        const config = ensureConfig(options);
        yield* this._streamLog(input, logStreamCallbackHandler, config);
      }
      async *_streamLog(input, logStreamCallbackHandler, config) {
        const { callbacks } = config;
        if (callbacks === void 0) {
          config.callbacks = [logStreamCallbackHandler];
        } else if (Array.isArray(callbacks)) {
          config.callbacks = callbacks.concat([logStreamCallbackHandler]);
        } else {
          const copiedCallbacks = callbacks.copy();
          copiedCallbacks.addHandler(logStreamCallbackHandler, true);
          config.callbacks = copiedCallbacks;
        }
        const runnableStreamPromise = this.stream(input, config);
        async function consumeRunnableStream() {
          try {
            const runnableStream = await runnableStreamPromise;
            for await (const chunk of runnableStream) {
              const patch = new RunLogPatch({
                ops: [
                  {
                    op: "add",
                    path: "/streamed_output/-",
                    value: chunk
                  }
                ]
              });
              await logStreamCallbackHandler.writer.write(patch);
            }
          } finally {
            await logStreamCallbackHandler.writer.close();
          }
        }
        const runnableStreamConsumePromise = consumeRunnableStream();
        try {
          for await (const log of logStreamCallbackHandler) {
            yield log;
          }
        } finally {
          await runnableStreamConsumePromise;
        }
      }
      streamEvents(input, options, streamOptions) {
        let stream;
        if (options.version === "v1") {
          stream = this._streamEventsV1(input, options, streamOptions);
        } else if (options.version === "v2") {
          stream = this._streamEventsV2(input, options, streamOptions);
        } else {
          throw new Error(`Only versions "v1" and "v2" of the schema are currently supported.`);
        }
        if (options.encoding === "text/event-stream") {
          return convertToHttpEventStream(stream);
        } else {
          return IterableReadableStream.fromAsyncGenerator(stream);
        }
      }
      async *_streamEventsV2(input, options, streamOptions) {
        const eventStreamer = new EventStreamCallbackHandler({
          ...streamOptions,
          autoClose: false
        });
        const config = ensureConfig(options);
        const runId = config.runId ?? v4_default();
        config.runId = runId;
        const callbacks = config.callbacks;
        if (callbacks === void 0) {
          config.callbacks = [eventStreamer];
        } else if (Array.isArray(callbacks)) {
          config.callbacks = callbacks.concat(eventStreamer);
        } else {
          const copiedCallbacks = callbacks.copy();
          copiedCallbacks.addHandler(eventStreamer, true);
          config.callbacks = copiedCallbacks;
        }
        const outerThis = this;
        async function consumeRunnableStream() {
          try {
            const runnableStream = await outerThis.stream(input, config);
            const tappedStream = eventStreamer.tapOutputIterable(runId, runnableStream);
            for await (const _ of tappedStream) {
            }
          } finally {
            await eventStreamer.finish();
          }
        }
        const runnableStreamConsumePromise = consumeRunnableStream();
        let firstEventSent = false;
        let firstEventRunId;
        try {
          for await (const event of eventStreamer) {
            if (!firstEventSent) {
              event.data.input = input;
              firstEventSent = true;
              firstEventRunId = event.run_id;
              yield event;
              continue;
            }
            if (event.run_id === firstEventRunId && event.event.endsWith("_end")) {
              if (event.data?.input) {
                delete event.data.input;
              }
            }
            yield event;
          }
        } finally {
          await runnableStreamConsumePromise;
        }
      }
      async *_streamEventsV1(input, options, streamOptions) {
        let runLog;
        let hasEncounteredStartEvent = false;
        const config = ensureConfig(options);
        const rootTags = config.tags ?? [];
        const rootMetadata = config.metadata ?? {};
        const rootName = config.runName ?? this.getName();
        const logStreamCallbackHandler = new LogStreamCallbackHandler({
          ...streamOptions,
          autoClose: false,
          _schemaFormat: "streaming_events"
        });
        const rootEventFilter = new _RootEventFilter({
          ...streamOptions
        });
        const logStream = this._streamLog(input, logStreamCallbackHandler, config);
        for await (const log of logStream) {
          if (!runLog) {
            runLog = RunLog.fromRunLogPatch(log);
          } else {
            runLog = runLog.concat(log);
          }
          if (runLog.state === void 0) {
            throw new Error(`Internal error: "streamEvents" state is missing. Please open a bug report.`);
          }
          if (!hasEncounteredStartEvent) {
            hasEncounteredStartEvent = true;
            const state3 = { ...runLog.state };
            const event = {
              run_id: state3.id,
              event: `on_${state3.type}_start`,
              name: rootName,
              tags: rootTags,
              metadata: rootMetadata,
              data: {
                input
              }
            };
            if (rootEventFilter.includeEvent(event, state3.type)) {
              yield event;
            }
          }
          const paths = log.ops.filter((op) => op.path.startsWith("/logs/")).map((op) => op.path.split("/")[2]);
          const dedupedPaths = [...new Set(paths)];
          for (const path of dedupedPaths) {
            let eventType;
            let data = {};
            const logEntry = runLog.state.logs[path];
            if (logEntry.end_time === void 0) {
              if (logEntry.streamed_output.length > 0) {
                eventType = "stream";
              } else {
                eventType = "start";
              }
            } else {
              eventType = "end";
            }
            if (eventType === "start") {
              if (logEntry.inputs !== void 0) {
                data.input = logEntry.inputs;
              }
            } else if (eventType === "end") {
              if (logEntry.inputs !== void 0) {
                data.input = logEntry.inputs;
              }
              data.output = logEntry.final_output;
            } else if (eventType === "stream") {
              const chunkCount = logEntry.streamed_output.length;
              if (chunkCount !== 1) {
                throw new Error(`Expected exactly one chunk of streamed output, got ${chunkCount} instead. Encountered in: "${logEntry.name}"`);
              }
              data = { chunk: logEntry.streamed_output[0] };
              logEntry.streamed_output = [];
            }
            yield {
              event: `on_${logEntry.type}_${eventType}`,
              name: logEntry.name,
              run_id: logEntry.id,
              tags: logEntry.tags,
              metadata: logEntry.metadata,
              data
            };
          }
          const { state: state2 } = runLog;
          if (state2.streamed_output.length > 0) {
            const chunkCount = state2.streamed_output.length;
            if (chunkCount !== 1) {
              throw new Error(`Expected exactly one chunk of streamed output, got ${chunkCount} instead. Encountered in: "${state2.name}"`);
            }
            const data = { chunk: state2.streamed_output[0] };
            state2.streamed_output = [];
            const event = {
              event: `on_${state2.type}_stream`,
              run_id: state2.id,
              tags: rootTags,
              metadata: rootMetadata,
              name: rootName,
              data
            };
            if (rootEventFilter.includeEvent(event, state2.type)) {
              yield event;
            }
          }
        }
        const state = runLog?.state;
        if (state !== void 0) {
          const event = {
            event: `on_${state.type}_end`,
            name: rootName,
            run_id: state.id,
            tags: rootTags,
            metadata: rootMetadata,
            data: {
              output: state.final_output
            }
          };
          if (rootEventFilter.includeEvent(event, state.type))
            yield event;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      static isRunnable(thing) {
        return isRunnableInterface(thing);
      }
      /**
       * Bind lifecycle listeners to a Runnable, returning a new Runnable.
       * The Run object contains information about the run, including its id,
       * type, input, output, error, startTime, endTime, and any tags or metadata
       * added to the run.
       *
       * @param {Object} params - The object containing the callback functions.
       * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
       * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
       * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
       */
      withListeners({ onStart, onEnd, onError }) {
        return new RunnableBinding({
          bound: this,
          config: {},
          configFactories: [
            (config) => ({
              callbacks: [
                new RootListenersTracer({
                  config,
                  onStart,
                  onEnd,
                  onError
                })
              ]
            })
          ]
        });
      }
      /**
       * Convert a runnable to a tool. Return a new instance of `RunnableToolLike`
       * which contains the runnable, name, description and schema.
       *
       * @template {T extends RunInput = RunInput} RunInput - The input type of the runnable. Should be the same as the `RunInput` type of the runnable.
       *
       * @param fields
       * @param {string | undefined} [fields.name] The name of the tool. If not provided, it will default to the name of the runnable.
       * @param {string | undefined} [fields.description] The description of the tool. Falls back to the description on the Zod schema if not provided, or undefined if neither are provided.
       * @param {z.ZodType<T>} [fields.schema] The Zod schema for the input of the tool. Infers the Zod type from the input type of the runnable.
       * @returns {RunnableToolLike<z.ZodType<T>, RunOutput>} An instance of `RunnableToolLike` which is a runnable that can be used as a tool.
       */
      asTool(fields) {
        return convertRunnableToTool(this, fields);
      }
    };
    RunnableBinding = class _RunnableBinding extends Runnable {
      static lc_name() {
        return "RunnableBinding";
      }
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "bound", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "config", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "kwargs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "configFactories", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.bound = fields.bound;
        this.kwargs = fields.kwargs;
        this.config = fields.config;
        this.configFactories = fields.configFactories;
      }
      getName(suffix) {
        return this.bound.getName(suffix);
      }
      async _mergeConfig(...options) {
        const config = mergeConfigs(this.config, ...options);
        return mergeConfigs(config, ...this.configFactories ? await Promise.all(this.configFactories.map(async (configFactory) => await configFactory(config))) : []);
      }
      bind(kwargs) {
        return new this.constructor({
          bound: this.bound,
          kwargs: { ...this.kwargs, ...kwargs },
          config: this.config
        });
      }
      withConfig(config) {
        return new this.constructor({
          bound: this.bound,
          kwargs: this.kwargs,
          config: { ...this.config, ...config }
        });
      }
      withRetry(fields) {
        return new this.constructor({
          bound: this.bound.withRetry(fields),
          kwargs: this.kwargs,
          config: this.config
        });
      }
      async invoke(input, options) {
        return this.bound.invoke(input, await this._mergeConfig(ensureConfig(options), this.kwargs));
      }
      async batch(inputs, options, batchOptions) {
        const mergedOptions = Array.isArray(options) ? await Promise.all(options.map(async (individualOption) => this._mergeConfig(ensureConfig(individualOption), this.kwargs))) : await this._mergeConfig(ensureConfig(options), this.kwargs);
        return this.bound.batch(inputs, mergedOptions, batchOptions);
      }
      async *_streamIterator(input, options) {
        yield* this.bound._streamIterator(input, await this._mergeConfig(ensureConfig(options), this.kwargs));
      }
      async stream(input, options) {
        return this.bound.stream(input, await this._mergeConfig(ensureConfig(options), this.kwargs));
      }
      async *transform(generator, options) {
        yield* this.bound.transform(generator, await this._mergeConfig(ensureConfig(options), this.kwargs));
      }
      streamEvents(input, options, streamOptions) {
        const outerThis = this;
        const generator = async function* () {
          yield* outerThis.bound.streamEvents(input, {
            ...await outerThis._mergeConfig(ensureConfig(options), outerThis.kwargs),
            version: options.version
          }, streamOptions);
        };
        return IterableReadableStream.fromAsyncGenerator(generator());
      }
      static isRunnableBinding(thing) {
        return thing.bound && Runnable.isRunnable(thing.bound);
      }
      /**
       * Bind lifecycle listeners to a Runnable, returning a new Runnable.
       * The Run object contains information about the run, including its id,
       * type, input, output, error, startTime, endTime, and any tags or metadata
       * added to the run.
       *
       * @param {Object} params - The object containing the callback functions.
       * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
       * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
       * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
       */
      withListeners({ onStart, onEnd, onError }) {
        return new _RunnableBinding({
          bound: this.bound,
          kwargs: this.kwargs,
          config: this.config,
          configFactories: [
            (config) => ({
              callbacks: [
                new RootListenersTracer({
                  config,
                  onStart,
                  onEnd,
                  onError
                })
              ]
            })
          ]
        });
      }
    };
    RunnableEach = class _RunnableEach extends Runnable {
      static lc_name() {
        return "RunnableEach";
      }
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "bound", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.bound = fields.bound;
      }
      /**
       * Binds the runnable with the specified arguments.
       * @param kwargs The arguments to bind the runnable with.
       * @returns A new instance of the `RunnableEach` class that is bound with the specified arguments.
       */
      bind(kwargs) {
        return new _RunnableEach({
          bound: this.bound.bind(kwargs)
        });
      }
      /**
       * Invokes the runnable with the specified input and configuration.
       * @param input The input to invoke the runnable with.
       * @param config The configuration to invoke the runnable with.
       * @returns A promise that resolves to the output of the runnable.
       */
      async invoke(inputs, config) {
        return this._callWithConfig(this._invoke.bind(this), inputs, config);
      }
      /**
       * A helper method that is used to invoke the runnable with the specified input and configuration.
       * @param input The input to invoke the runnable with.
       * @param config The configuration to invoke the runnable with.
       * @returns A promise that resolves to the output of the runnable.
       */
      async _invoke(inputs, config, runManager) {
        return this.bound.batch(inputs, patchConfig(config, { callbacks: runManager?.getChild() }));
      }
      /**
       * Bind lifecycle listeners to a Runnable, returning a new Runnable.
       * The Run object contains information about the run, including its id,
       * type, input, output, error, startTime, endTime, and any tags or metadata
       * added to the run.
       *
       * @param {Object} params - The object containing the callback functions.
       * @param {(run: Run) => void} params.onStart - Called before the runnable starts running, with the Run object.
       * @param {(run: Run) => void} params.onEnd - Called after the runnable finishes running, with the Run object.
       * @param {(run: Run) => void} params.onError - Called if the runnable throws an error, with the Run object.
       */
      withListeners({ onStart, onEnd, onError }) {
        return new _RunnableEach({
          bound: this.bound.withListeners({ onStart, onEnd, onError })
        });
      }
    };
    RunnableRetry = class extends RunnableBinding {
      static lc_name() {
        return "RunnableRetry";
      }
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "maxAttemptNumber", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 3
        });
        Object.defineProperty(this, "onFailedAttempt", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: () => {
          }
        });
        this.maxAttemptNumber = fields.maxAttemptNumber ?? this.maxAttemptNumber;
        this.onFailedAttempt = fields.onFailedAttempt ?? this.onFailedAttempt;
      }
      _patchConfigForRetry(attempt, config, runManager) {
        const tag = attempt > 1 ? `retry:attempt:${attempt}` : void 0;
        return patchConfig(config, { callbacks: runManager?.getChild(tag) });
      }
      async _invoke(input, config, runManager) {
        return (0, import_p_retry3.default)((attemptNumber) => super.invoke(input, this._patchConfigForRetry(attemptNumber, config, runManager)), {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onFailedAttempt: (error) => this.onFailedAttempt(error, input),
          retries: Math.max(this.maxAttemptNumber - 1, 0),
          randomize: true
        });
      }
      /**
       * Method that invokes the runnable with the specified input, run manager,
       * and config. It handles the retry logic by catching any errors and
       * recursively invoking itself with the updated config for the next retry
       * attempt.
       * @param input The input for the runnable.
       * @param runManager The run manager for the runnable.
       * @param config The config for the runnable.
       * @returns A promise that resolves to the output of the runnable.
       */
      async invoke(input, config) {
        return this._callWithConfig(this._invoke.bind(this), input, config);
      }
      async _batch(inputs, configs, runManagers, batchOptions) {
        const resultsMap = {};
        try {
          await (0, import_p_retry3.default)(async (attemptNumber) => {
            const remainingIndexes = inputs.map((_, i) => i).filter((i) => resultsMap[i.toString()] === void 0 || // eslint-disable-next-line no-instanceof/no-instanceof
            resultsMap[i.toString()] instanceof Error);
            const remainingInputs = remainingIndexes.map((i) => inputs[i]);
            const patchedConfigs = remainingIndexes.map((i) => this._patchConfigForRetry(attemptNumber, configs?.[i], runManagers?.[i]));
            const results = await super.batch(remainingInputs, patchedConfigs, {
              ...batchOptions,
              returnExceptions: true
            });
            let firstException;
            for (let i = 0; i < results.length; i += 1) {
              const result = results[i];
              const resultMapIndex = remainingIndexes[i];
              if (result instanceof Error) {
                if (firstException === void 0) {
                  firstException = result;
                  firstException.input = remainingInputs[i];
                }
              }
              resultsMap[resultMapIndex.toString()] = result;
            }
            if (firstException) {
              throw firstException;
            }
            return results;
          }, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onFailedAttempt: (error) => this.onFailedAttempt(error, error.input),
            retries: Math.max(this.maxAttemptNumber - 1, 0),
            randomize: true
          });
        } catch (e) {
          if (batchOptions?.returnExceptions !== true) {
            throw e;
          }
        }
        return Object.keys(resultsMap).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map((key) => resultsMap[parseInt(key, 10)]);
      }
      async batch(inputs, options, batchOptions) {
        return this._batchWithConfig(this._batch.bind(this), inputs, options, batchOptions);
      }
    };
    RunnableSequence = class _RunnableSequence extends Runnable {
      static lc_name() {
        return "RunnableSequence";
      }
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "first", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "middle", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: []
        });
        Object.defineProperty(this, "last", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "omitSequenceTags", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        this.first = fields.first;
        this.middle = fields.middle ?? this.middle;
        this.last = fields.last;
        this.name = fields.name;
        this.omitSequenceTags = fields.omitSequenceTags ?? this.omitSequenceTags;
      }
      get steps() {
        return [this.first, ...this.middle, this.last];
      }
      async invoke(input, options) {
        const config = ensureConfig(options);
        const callbackManager_ = await getCallbackManagerForConfig(config);
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict2(input, "input"), config.runId, void 0, void 0, void 0, config?.runName);
        delete config.runId;
        let nextStepInput = input;
        let finalOutput;
        try {
          const initialSteps = [this.first, ...this.middle];
          for (let i = 0; i < initialSteps.length; i += 1) {
            const step = initialSteps[i];
            const promise = step.invoke(nextStepInput, patchConfig(config, {
              callbacks: runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:${i + 1}`)
            }));
            nextStepInput = await raceWithSignal(promise, options?.signal);
          }
          if (options?.signal?.aborted) {
            throw new Error("Aborted");
          }
          finalOutput = await this.last.invoke(nextStepInput, patchConfig(config, {
            callbacks: runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:${this.steps.length}`)
          }));
        } catch (e) {
          await runManager?.handleChainError(e);
          throw e;
        }
        await runManager?.handleChainEnd(_coerceToDict2(finalOutput, "output"));
        return finalOutput;
      }
      async batch(inputs, options, batchOptions) {
        const configList = this._getOptionsList(options ?? {}, inputs.length);
        const callbackManagers = await Promise.all(configList.map(getCallbackManagerForConfig));
        const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i) => {
          const handleStartRes = await callbackManager?.handleChainStart(this.toJSON(), _coerceToDict2(inputs[i], "input"), configList[i].runId, void 0, void 0, void 0, configList[i].runName);
          delete configList[i].runId;
          return handleStartRes;
        }));
        let nextStepInputs = inputs;
        try {
          for (let i = 0; i < this.steps.length; i += 1) {
            const step = this.steps[i];
            const promise = step.batch(nextStepInputs, runManagers.map((runManager, j) => {
              const childRunManager = runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:${i + 1}`);
              return patchConfig(configList[j], { callbacks: childRunManager });
            }), batchOptions);
            nextStepInputs = await raceWithSignal(promise, configList[0]?.signal);
          }
        } catch (e) {
          await Promise.all(runManagers.map((runManager) => runManager?.handleChainError(e)));
          throw e;
        }
        await Promise.all(runManagers.map((runManager) => runManager?.handleChainEnd(_coerceToDict2(nextStepInputs, "output"))));
        return nextStepInputs;
      }
      async *_streamIterator(input, options) {
        const callbackManager_ = await getCallbackManagerForConfig(options);
        const { runId, ...otherOptions } = options ?? {};
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict2(input, "input"), runId, void 0, void 0, void 0, otherOptions?.runName);
        const steps = [this.first, ...this.middle, this.last];
        let concatSupported = true;
        let finalOutput;
        async function* inputGenerator() {
          yield input;
        }
        try {
          let finalGenerator = steps[0].transform(inputGenerator(), patchConfig(otherOptions, {
            callbacks: runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:1`)
          }));
          for (let i = 1; i < steps.length; i += 1) {
            const step = steps[i];
            finalGenerator = await step.transform(finalGenerator, patchConfig(otherOptions, {
              callbacks: runManager?.getChild(this.omitSequenceTags ? void 0 : `seq:step:${i + 1}`)
            }));
          }
          for await (const chunk of finalGenerator) {
            options?.signal?.throwIfAborted();
            yield chunk;
            if (concatSupported) {
              if (finalOutput === void 0) {
                finalOutput = chunk;
              } else {
                try {
                  finalOutput = concat(finalOutput, chunk);
                } catch (e) {
                  finalOutput = void 0;
                  concatSupported = false;
                }
              }
            }
          }
        } catch (e) {
          await runManager?.handleChainError(e);
          throw e;
        }
        await runManager?.handleChainEnd(_coerceToDict2(finalOutput, "output"));
      }
      getGraph(config) {
        const graph = new Graph();
        let currentLastNode = null;
        this.steps.forEach((step, index) => {
          const stepGraph = step.getGraph(config);
          if (index !== 0) {
            stepGraph.trimFirstNode();
          }
          if (index !== this.steps.length - 1) {
            stepGraph.trimLastNode();
          }
          graph.extend(stepGraph);
          const stepFirstNode = stepGraph.firstNode();
          if (!stepFirstNode) {
            throw new Error(`Runnable ${step} has no first node`);
          }
          if (currentLastNode) {
            graph.addEdge(currentLastNode, stepFirstNode);
          }
          currentLastNode = stepGraph.lastNode();
        });
        return graph;
      }
      pipe(coerceable) {
        if (_RunnableSequence.isRunnableSequence(coerceable)) {
          return new _RunnableSequence({
            first: this.first,
            middle: this.middle.concat([
              this.last,
              coerceable.first,
              ...coerceable.middle
            ]),
            last: coerceable.last,
            name: this.name ?? coerceable.name
          });
        } else {
          return new _RunnableSequence({
            first: this.first,
            middle: [...this.middle, this.last],
            last: _coerceToRunnable(coerceable),
            name: this.name
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      static isRunnableSequence(thing) {
        return Array.isArray(thing.middle) && Runnable.isRunnable(thing);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      static from([first, ...runnables], nameOrFields) {
        let extra = {};
        if (typeof nameOrFields === "string") {
          extra.name = nameOrFields;
        } else if (nameOrFields !== void 0) {
          extra = nameOrFields;
        }
        return new _RunnableSequence({
          ...extra,
          first: _coerceToRunnable(first),
          middle: runnables.slice(0, -1).map(_coerceToRunnable),
          last: _coerceToRunnable(runnables[runnables.length - 1])
        });
      }
    };
    RunnableMap = class _RunnableMap extends Runnable {
      static lc_name() {
        return "RunnableMap";
      }
      getStepsKeys() {
        return Object.keys(this.steps);
      }
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "steps", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.steps = {};
        for (const [key, value] of Object.entries(fields.steps)) {
          this.steps[key] = _coerceToRunnable(value);
        }
      }
      static from(steps) {
        return new _RunnableMap({ steps });
      }
      async invoke(input, options) {
        const config = ensureConfig(options);
        const callbackManager_ = await getCallbackManagerForConfig(config);
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), {
          input
        }, config.runId, void 0, void 0, void 0, config?.runName);
        delete config.runId;
        const output = {};
        try {
          const promises = Object.entries(this.steps).map(async ([key, runnable]) => {
            output[key] = await runnable.invoke(input, patchConfig(config, {
              callbacks: runManager?.getChild(`map:key:${key}`)
            }));
          });
          await raceWithSignal(Promise.all(promises), options?.signal);
        } catch (e) {
          await runManager?.handleChainError(e);
          throw e;
        }
        await runManager?.handleChainEnd(output);
        return output;
      }
      async *_transform(generator, runManager, options) {
        const steps = { ...this.steps };
        const inputCopies = atee(generator, Object.keys(steps).length);
        const tasks = new Map(Object.entries(steps).map(([key, runnable], i) => {
          const gen = runnable.transform(inputCopies[i], patchConfig(options, {
            callbacks: runManager?.getChild(`map:key:${key}`)
          }));
          return [key, gen.next().then((result) => ({ key, gen, result }))];
        }));
        while (tasks.size) {
          const promise = Promise.race(tasks.values());
          const { key, result, gen } = await raceWithSignal(promise, options?.signal);
          tasks.delete(key);
          if (!result.done) {
            yield { [key]: result.value };
            tasks.set(key, gen.next().then((result2) => ({ key, gen, result: result2 })));
          }
        }
      }
      transform(generator, options) {
        return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
      }
      async stream(input, options) {
        async function* generator() {
          yield input;
        }
        const config = ensureConfig(options);
        const wrappedGenerator = new AsyncGeneratorWithSetup({
          generator: this.transform(generator(), config),
          config
        });
        await wrappedGenerator.setup;
        return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
      }
    };
    RunnableTraceable = class _RunnableTraceable extends Runnable {
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "func", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        if (!isTraceableFunction(fields.func)) {
          throw new Error("RunnableTraceable requires a function that is wrapped in traceable higher-order function");
        }
        this.func = fields.func;
      }
      async invoke(input, options) {
        const [config] = this._getOptionsList(options ?? {}, 1);
        const callbacks = await getCallbackManagerForConfig(config);
        const promise = this.func(patchConfig(config, { callbacks }), input);
        return raceWithSignal(promise, config?.signal);
      }
      async *_streamIterator(input, options) {
        const [config] = this._getOptionsList(options ?? {}, 1);
        const result = await this.invoke(input, options);
        if (isAsyncIterable(result)) {
          for await (const item of result) {
            config?.signal?.throwIfAborted();
            yield item;
          }
          return;
        }
        if (isIterator(result)) {
          while (true) {
            config?.signal?.throwIfAborted();
            const state = result.next();
            if (state.done)
              break;
            yield state.value;
          }
          return;
        }
        yield result;
      }
      static from(func) {
        return new _RunnableTraceable({ func });
      }
    };
    RunnableLambda = class _RunnableLambda extends Runnable {
      static lc_name() {
        return "RunnableLambda";
      }
      constructor(fields) {
        if (isTraceableFunction(fields.func)) {
          return RunnableTraceable.from(fields.func);
        }
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "func", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        assertNonTraceableFunction(fields.func);
        this.func = fields.func;
      }
      static from(func) {
        return new _RunnableLambda({
          func
        });
      }
      async _invoke(input, config, runManager) {
        return new Promise((resolve, reject) => {
          const childConfig = patchConfig(config, {
            callbacks: runManager?.getChild(),
            recursionLimit: (config?.recursionLimit ?? DEFAULT_RECURSION_LIMIT) - 1
          });
          void AsyncLocalStorageProviderSingleton2.runWithConfig(pickRunnableConfigKeys(childConfig), async () => {
            try {
              let output = await this.func(input, {
                ...childConfig
              });
              if (output && Runnable.isRunnable(output)) {
                if (config?.recursionLimit === 0) {
                  throw new Error("Recursion limit reached.");
                }
                output = await output.invoke(input, {
                  ...childConfig,
                  recursionLimit: (childConfig.recursionLimit ?? DEFAULT_RECURSION_LIMIT) - 1
                });
              } else if (isAsyncIterable(output)) {
                let finalOutput;
                for await (const chunk of consumeAsyncIterableInContext(childConfig, output)) {
                  config?.signal?.throwIfAborted();
                  if (finalOutput === void 0) {
                    finalOutput = chunk;
                  } else {
                    try {
                      finalOutput = concat(finalOutput, chunk);
                    } catch (e) {
                      finalOutput = chunk;
                    }
                  }
                }
                output = finalOutput;
              } else if (isIterableIterator(output)) {
                let finalOutput;
                for (const chunk of consumeIteratorInContext(childConfig, output)) {
                  config?.signal?.throwIfAborted();
                  if (finalOutput === void 0) {
                    finalOutput = chunk;
                  } else {
                    try {
                      finalOutput = concat(finalOutput, chunk);
                    } catch (e) {
                      finalOutput = chunk;
                    }
                  }
                }
                output = finalOutput;
              }
              resolve(output);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
      async invoke(input, options) {
        return this._callWithConfig(this._invoke.bind(this), input, options);
      }
      async *_transform(generator, runManager, config) {
        let finalChunk;
        for await (const chunk of generator) {
          if (finalChunk === void 0) {
            finalChunk = chunk;
          } else {
            try {
              finalChunk = concat(finalChunk, chunk);
            } catch (e) {
              finalChunk = chunk;
            }
          }
        }
        const childConfig = patchConfig(config, {
          callbacks: runManager?.getChild(),
          recursionLimit: (config?.recursionLimit ?? DEFAULT_RECURSION_LIMIT) - 1
        });
        const output = await new Promise((resolve, reject) => {
          void AsyncLocalStorageProviderSingleton2.runWithConfig(pickRunnableConfigKeys(childConfig), async () => {
            try {
              const res = await this.func(finalChunk, {
                ...childConfig,
                config: childConfig
              });
              resolve(res);
            } catch (e) {
              reject(e);
            }
          });
        });
        if (output && Runnable.isRunnable(output)) {
          if (config?.recursionLimit === 0) {
            throw new Error("Recursion limit reached.");
          }
          const stream = await output.stream(finalChunk, childConfig);
          for await (const chunk of stream) {
            yield chunk;
          }
        } else if (isAsyncIterable(output)) {
          for await (const chunk of consumeAsyncIterableInContext(childConfig, output)) {
            config?.signal?.throwIfAborted();
            yield chunk;
          }
        } else if (isIterableIterator(output)) {
          for (const chunk of consumeIteratorInContext(childConfig, output)) {
            config?.signal?.throwIfAborted();
            yield chunk;
          }
        } else {
          yield output;
        }
      }
      transform(generator, options) {
        return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
      }
      async stream(input, options) {
        async function* generator() {
          yield input;
        }
        const config = ensureConfig(options);
        const wrappedGenerator = new AsyncGeneratorWithSetup({
          generator: this.transform(generator(), config),
          config
        });
        await wrappedGenerator.setup;
        return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
      }
    };
    RunnableWithFallbacks = class extends Runnable {
      static lc_name() {
        return "RunnableWithFallbacks";
      }
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "runnable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "fallbacks", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.runnable = fields.runnable;
        this.fallbacks = fields.fallbacks;
      }
      *runnables() {
        yield this.runnable;
        for (const fallback of this.fallbacks) {
          yield fallback;
        }
      }
      async invoke(input, options) {
        const config = ensureConfig(options);
        const callbackManager_ = await getCallbackManagerForConfig(config);
        const { runId, ...otherConfigFields } = config;
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict2(input, "input"), runId, void 0, void 0, void 0, otherConfigFields?.runName);
        const childConfig = patchConfig(otherConfigFields, {
          callbacks: runManager?.getChild()
        });
        const res = await AsyncLocalStorageProviderSingleton2.runWithConfig(childConfig, async () => {
          let firstError;
          for (const runnable of this.runnables()) {
            config?.signal?.throwIfAborted();
            try {
              const output = await runnable.invoke(input, childConfig);
              await runManager?.handleChainEnd(_coerceToDict2(output, "output"));
              return output;
            } catch (e) {
              if (firstError === void 0) {
                firstError = e;
              }
            }
          }
          if (firstError === void 0) {
            throw new Error("No error stored at end of fallback.");
          }
          await runManager?.handleChainError(firstError);
          throw firstError;
        });
        return res;
      }
      async *_streamIterator(input, options) {
        const config = ensureConfig(options);
        const callbackManager_ = await getCallbackManagerForConfig(config);
        const { runId, ...otherConfigFields } = config;
        const runManager = await callbackManager_?.handleChainStart(this.toJSON(), _coerceToDict2(input, "input"), runId, void 0, void 0, void 0, otherConfigFields?.runName);
        let firstError;
        let stream;
        for (const runnable of this.runnables()) {
          config?.signal?.throwIfAborted();
          const childConfig = patchConfig(otherConfigFields, {
            callbacks: runManager?.getChild()
          });
          try {
            const originalStream = await runnable.stream(input, childConfig);
            stream = consumeAsyncIterableInContext(childConfig, originalStream);
            break;
          } catch (e) {
            if (firstError === void 0) {
              firstError = e;
            }
          }
        }
        if (stream === void 0) {
          const error = firstError ?? new Error("No error stored at end of fallback.");
          await runManager?.handleChainError(error);
          throw error;
        }
        let output;
        try {
          for await (const chunk of stream) {
            yield chunk;
            try {
              output = output === void 0 ? output : concat(output, chunk);
            } catch (e) {
              output = void 0;
            }
          }
        } catch (e) {
          await runManager?.handleChainError(e);
          throw e;
        }
        await runManager?.handleChainEnd(_coerceToDict2(output, "output"));
      }
      async batch(inputs, options, batchOptions) {
        if (batchOptions?.returnExceptions) {
          throw new Error("Not implemented.");
        }
        const configList = this._getOptionsList(options ?? {}, inputs.length);
        const callbackManagers = await Promise.all(configList.map((config) => getCallbackManagerForConfig(config)));
        const runManagers = await Promise.all(callbackManagers.map(async (callbackManager, i) => {
          const handleStartRes = await callbackManager?.handleChainStart(this.toJSON(), _coerceToDict2(inputs[i], "input"), configList[i].runId, void 0, void 0, void 0, configList[i].runName);
          delete configList[i].runId;
          return handleStartRes;
        }));
        let firstError;
        for (const runnable of this.runnables()) {
          configList[0].signal?.throwIfAborted();
          try {
            const outputs = await runnable.batch(inputs, runManagers.map((runManager, j) => patchConfig(configList[j], {
              callbacks: runManager?.getChild()
            })), batchOptions);
            await Promise.all(runManagers.map((runManager, i) => runManager?.handleChainEnd(_coerceToDict2(outputs[i], "output"))));
            return outputs;
          } catch (e) {
            if (firstError === void 0) {
              firstError = e;
            }
          }
        }
        if (!firstError) {
          throw new Error("No error stored at end of fallbacks.");
        }
        await Promise.all(runManagers.map((runManager) => runManager?.handleChainError(firstError)));
        throw firstError;
      }
    };
    RunnableAssign = class extends Runnable {
      static lc_name() {
        return "RunnableAssign";
      }
      constructor(fields) {
        if (fields instanceof RunnableMap) {
          fields = { mapper: fields };
        }
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "mapper", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.mapper = fields.mapper;
      }
      async invoke(input, options) {
        const mapperResult = await this.mapper.invoke(input, options);
        return {
          ...input,
          ...mapperResult
        };
      }
      async *_transform(generator, runManager, options) {
        const mapperKeys = this.mapper.getStepsKeys();
        const [forPassthrough, forMapper] = atee(generator);
        const mapperOutput = this.mapper.transform(forMapper, patchConfig(options, { callbacks: runManager?.getChild() }));
        const firstMapperChunkPromise = mapperOutput.next();
        for await (const chunk of forPassthrough) {
          if (typeof chunk !== "object" || Array.isArray(chunk)) {
            throw new Error(`RunnableAssign can only be used with objects as input, got ${typeof chunk}`);
          }
          const filtered = Object.fromEntries(Object.entries(chunk).filter(([key]) => !mapperKeys.includes(key)));
          if (Object.keys(filtered).length > 0) {
            yield filtered;
          }
        }
        yield (await firstMapperChunkPromise).value;
        for await (const chunk of mapperOutput) {
          yield chunk;
        }
      }
      transform(generator, options) {
        return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
      }
      async stream(input, options) {
        async function* generator() {
          yield input;
        }
        const config = ensureConfig(options);
        const wrappedGenerator = new AsyncGeneratorWithSetup({
          generator: this.transform(generator(), config),
          config
        });
        await wrappedGenerator.setup;
        return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
      }
    };
    RunnablePick = class extends Runnable {
      static lc_name() {
        return "RunnablePick";
      }
      constructor(fields) {
        if (typeof fields === "string" || Array.isArray(fields)) {
          fields = { keys: fields };
        }
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "runnables"]
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "keys", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.keys = fields.keys;
      }
      async _pick(input) {
        if (typeof this.keys === "string") {
          return input[this.keys];
        } else {
          const picked = this.keys.map((key) => [key, input[key]]).filter((v) => v[1] !== void 0);
          return picked.length === 0 ? void 0 : Object.fromEntries(picked);
        }
      }
      async invoke(input, options) {
        return this._callWithConfig(this._pick.bind(this), input, options);
      }
      async *_transform(generator) {
        for await (const chunk of generator) {
          const picked = await this._pick(chunk);
          if (picked !== void 0) {
            yield picked;
          }
        }
      }
      transform(generator, options) {
        return this._transformStreamWithConfig(generator, this._transform.bind(this), options);
      }
      async stream(input, options) {
        async function* generator() {
          yield input;
        }
        const config = ensureConfig(options);
        const wrappedGenerator = new AsyncGeneratorWithSetup({
          generator: this.transform(generator(), config),
          config
        });
        await wrappedGenerator.setup;
        return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
      }
    };
    RunnableToolLike = class extends RunnableBinding {
      constructor(fields) {
        const sequence = RunnableSequence.from([
          RunnableLambda.from(async (input) => {
            let toolInput;
            if (_isToolCall(input)) {
              try {
                toolInput = await this.schema.parseAsync(input.args);
              } catch (e) {
                throw new ToolInputParsingException(`Received tool input did not match expected schema`, JSON.stringify(input.args));
              }
            } else {
              toolInput = input;
            }
            return toolInput;
          }).withConfig({ runName: `${fields.name}:parse_input` }),
          fields.bound
        ]).withConfig({ runName: fields.name });
        super({
          bound: sequence,
          config: fields.config ?? {}
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "description", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "schema", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.name = fields.name;
        this.description = fields.description;
        this.schema = fields.schema;
      }
      static lc_name() {
        return "RunnableToolLike";
      }
    };
  }
});

// node_modules/@langchain/core/dist/prompt_values.js
var BasePromptValue, StringPromptValue, ChatPromptValue;
var init_prompt_values = __esm({
  "node_modules/@langchain/core/dist/prompt_values.js"() {
    init_serializable();
    init_human();
    init_utils2();
    BasePromptValue = class extends Serializable {
    };
    StringPromptValue = class extends BasePromptValue {
      static lc_name() {
        return "StringPromptValue";
      }
      constructor(value) {
        super({ value });
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "prompt_values"]
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "value", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.value = value;
      }
      toString() {
        return this.value;
      }
      toChatMessages() {
        return [new HumanMessage(this.value)];
      }
    };
    ChatPromptValue = class extends BasePromptValue {
      static lc_name() {
        return "ChatPromptValue";
      }
      constructor(fields) {
        if (Array.isArray(fields)) {
          fields = { messages: fields };
        }
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "prompt_values"]
        });
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "messages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.messages = fields.messages;
      }
      toString() {
        return getBufferString(this.messages);
      }
      toChatMessages() {
        return this.messages;
      }
    };
  }
});

// node_modules/@langchain/core/dist/prompts/string.js
var BaseStringPromptTemplate;
var init_string2 = __esm({
  "node_modules/@langchain/core/dist/prompts/string.js"() {
    init_prompt_values();
    init_base5();
    BaseStringPromptTemplate = class extends BasePromptTemplate {
      /**
       * Formats the prompt given the input values and returns a formatted
       * prompt value.
       * @param values The input values to format the prompt.
       * @returns A Promise that resolves to a formatted prompt value.
       */
      async formatPromptValue(values) {
        const formattedPrompt = await this.format(values);
        return new StringPromptValue(formattedPrompt);
      }
    };
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
var objectToString, isArray, regExpTest, nonSpaceRe, entityMap, whiteRe, spaceRe, equalsRe, curlyRe, tagRe, mustache, defaultWriter, mustache_default;
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
      var cache2 = this.cache;
      var value;
      if (cache2.hasOwnProperty(name)) {
        value = cache2[name];
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
        cache2[name] = value;
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
      var cache2 = this.templateCache;
      var cacheKey = template + ":" + (tags || mustache.tags).join(":");
      var isCacheEnabled = typeof cache2 !== "undefined";
      var tokens = isCacheEnabled ? cache2.get(cacheKey) : void 0;
      if (tokens == void 0) {
        tokens = parseTemplate(template, tags);
        isCacheEnabled && cache2.set(cacheKey, tokens);
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
      set templateCache(cache2) {
        defaultWriter.templateCache = cache2;
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
    mustache_default = mustache;
  }
});

// node_modules/@langchain/core/dist/prompts/template.js
function configureMustache() {
  mustache_default.escape = (text) => text;
}
var parseFString, mustacheTemplateToNodes, parseMustache, interpolateFString, interpolateMustache, DEFAULT_FORMATTER_MAPPING, DEFAULT_PARSER_MAPPING, renderTemplate, parseTemplate2, checkValidTemplate;
var init_template = __esm({
  "node_modules/@langchain/core/dist/prompts/template.js"() {
    init_mustache();
    init_errors();
    parseFString = (template) => {
      const chars = template.split("");
      const nodes = [];
      const nextBracket = (bracket, start) => {
        for (let i2 = start; i2 < chars.length; i2 += 1) {
          if (bracket.includes(chars[i2])) {
            return i2;
          }
        }
        return -1;
      };
      let i = 0;
      while (i < chars.length) {
        if (chars[i] === "{" && i + 1 < chars.length && chars[i + 1] === "{") {
          nodes.push({ type: "literal", text: "{" });
          i += 2;
        } else if (chars[i] === "}" && i + 1 < chars.length && chars[i + 1] === "}") {
          nodes.push({ type: "literal", text: "}" });
          i += 2;
        } else if (chars[i] === "{") {
          const j = nextBracket("}", i);
          if (j < 0) {
            throw new Error("Unclosed '{' in template.");
          }
          nodes.push({
            type: "variable",
            name: chars.slice(i + 1, j).join("")
          });
          i = j + 1;
        } else if (chars[i] === "}") {
          throw new Error("Single '}' in template.");
        } else {
          const next = nextBracket("{}", i);
          const text = (next < 0 ? chars.slice(i) : chars.slice(i, next)).join("");
          nodes.push({ type: "literal", text });
          i = next < 0 ? chars.length : next;
        }
      }
      return nodes;
    };
    mustacheTemplateToNodes = (template) => template.map((temp) => {
      if (temp[0] === "name") {
        const name = temp[1].includes(".") ? temp[1].split(".")[0] : temp[1];
        return { type: "variable", name };
      } else if (["#", "&", "^", ">"].includes(temp[0])) {
        return { type: "variable", name: temp[1] };
      } else {
        return { type: "literal", text: temp[1] };
      }
    });
    parseMustache = (template) => {
      configureMustache();
      const parsed = mustache_default.parse(template);
      return mustacheTemplateToNodes(parsed);
    };
    interpolateFString = (template, values) => {
      return parseFString(template).reduce((res, node) => {
        if (node.type === "variable") {
          if (node.name in values) {
            const stringValue = typeof values[node.name] === "string" ? values[node.name] : JSON.stringify(values[node.name]);
            return res + stringValue;
          }
          throw new Error(`(f-string) Missing value for input ${node.name}`);
        }
        return res + node.text;
      }, "");
    };
    interpolateMustache = (template, values) => {
      configureMustache();
      return mustache_default.render(template, values);
    };
    DEFAULT_FORMATTER_MAPPING = {
      "f-string": interpolateFString,
      mustache: interpolateMustache
    };
    DEFAULT_PARSER_MAPPING = {
      "f-string": parseFString,
      mustache: parseMustache
    };
    renderTemplate = (template, templateFormat, inputValues) => {
      try {
        return DEFAULT_FORMATTER_MAPPING[templateFormat](template, inputValues);
      } catch (e) {
        const error = addLangChainErrorFields(e, "INVALID_PROMPT_INPUT");
        throw error;
      }
    };
    parseTemplate2 = (template, templateFormat) => DEFAULT_PARSER_MAPPING[templateFormat](template);
    checkValidTemplate = (template, templateFormat, inputVariables) => {
      if (!(templateFormat in DEFAULT_FORMATTER_MAPPING)) {
        const validFormats = Object.keys(DEFAULT_FORMATTER_MAPPING);
        throw new Error(`Invalid template format. Got \`${templateFormat}\`;
                         should be one of ${validFormats}`);
      }
      try {
        const dummyInputs = inputVariables.reduce((acc, v) => {
          acc[v] = "foo";
          return acc;
        }, {});
        if (Array.isArray(template)) {
          template.forEach((message) => {
            if (message.type === "text") {
              renderTemplate(message.text, templateFormat, dummyInputs);
            } else if (message.type === "image_url") {
              if (typeof message.image_url === "string") {
                renderTemplate(message.image_url, templateFormat, dummyInputs);
              } else {
                const imageUrl = message.image_url.url;
                renderTemplate(imageUrl, templateFormat, dummyInputs);
              }
            } else {
              throw new Error(`Invalid message template received. ${JSON.stringify(message, null, 2)}`);
            }
          });
        } else {
          renderTemplate(template, templateFormat, dummyInputs);
        }
      } catch (e) {
        throw new Error(`Invalid prompt schema: ${e.message}`);
      }
    };
  }
});

// node_modules/@langchain/core/dist/prompts/prompt.js
var prompt_exports = {};
__export(prompt_exports, {
  PromptTemplate: () => PromptTemplate
});
var PromptTemplate;
var init_prompt = __esm({
  "node_modules/@langchain/core/dist/prompts/prompt.js"() {
    init_string2();
    init_template();
    PromptTemplate = class _PromptTemplate extends BaseStringPromptTemplate {
      static lc_name() {
        return "PromptTemplate";
      }
      constructor(input) {
        super(input);
        Object.defineProperty(this, "template", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "templateFormat", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "f-string"
        });
        Object.defineProperty(this, "validateTemplate", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "additionalContentFields", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        if (input.templateFormat === "mustache" && input.validateTemplate === void 0) {
          this.validateTemplate = false;
        }
        Object.assign(this, input);
        if (this.validateTemplate) {
          if (this.templateFormat === "mustache") {
            throw new Error("Mustache templates cannot be validated.");
          }
          let totalInputVariables = this.inputVariables;
          if (this.partialVariables) {
            totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
          }
          checkValidTemplate(this.template, this.templateFormat, totalInputVariables);
        }
      }
      _getPromptType() {
        return "prompt";
      }
      /**
       * Formats the prompt template with the provided values.
       * @param values The values to be used to format the prompt template.
       * @returns A promise that resolves to a string which is the formatted prompt.
       */
      async format(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        return renderTemplate(this.template, this.templateFormat, allValues);
      }
      /**
       * Take examples in list format with prefix and suffix to create a prompt.
       *
       * Intended to be used a a way to dynamically create a prompt from examples.
       *
       * @param examples - List of examples to use in the prompt.
       * @param suffix - String to go after the list of examples. Should generally set up the user's input.
       * @param inputVariables - A list of variable names the final prompt template will expect
       * @param exampleSeparator - The separator to use in between examples
       * @param prefix - String that should go before any examples. Generally includes examples.
       *
       * @returns The final prompt template generated.
       */
      static fromExamples(examples, suffix, inputVariables, exampleSeparator = "\n\n", prefix = "") {
        const template = [prefix, ...examples, suffix].join(exampleSeparator);
        return new _PromptTemplate({
          inputVariables,
          template
        });
      }
      static fromTemplate(template, options) {
        const { templateFormat = "f-string", ...rest } = options ?? {};
        const names = /* @__PURE__ */ new Set();
        parseTemplate2(template, templateFormat).forEach((node) => {
          if (node.type === "variable") {
            names.add(node.name);
          }
        });
        return new _PromptTemplate({
          // Rely on extracted types
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputVariables: [...names],
          templateFormat,
          template,
          ...rest
        });
      }
      /**
       * Partially applies values to the prompt template.
       * @param values The values to be partially applied to the prompt template.
       * @returns A new instance of PromptTemplate with the partially applied values.
       */
      async partial(values) {
        const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
        const newPartialVariables = {
          ...this.partialVariables ?? {},
          ...values
        };
        const promptDict = {
          ...this,
          inputVariables: newInputVariables,
          partialVariables: newPartialVariables
        };
        return new _PromptTemplate(promptDict);
      }
      serialize() {
        if (this.outputParser !== void 0) {
          throw new Error("Cannot serialize a prompt template with an output parser");
        }
        return {
          _type: this._getPromptType(),
          input_variables: this.inputVariables,
          template: this.template,
          template_format: this.templateFormat
        };
      }
      static async deserialize(data) {
        if (!data.template) {
          throw new Error("Prompt template must have a template");
        }
        const res = new _PromptTemplate({
          inputVariables: data.input_variables,
          template: data.template,
          templateFormat: data.template_format
        });
        return res;
      }
    };
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

// node_modules/@langchain/core/dist/prompts/image.js
var init_image = __esm({
  "node_modules/@langchain/core/dist/prompts/image.js"() {
    init_prompt_values();
    init_base5();
    init_template();
  }
});

// node_modules/@langchain/core/dist/prompts/chat.js
var BaseChatPromptTemplate;
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
    BaseChatPromptTemplate = class extends BasePromptTemplate {
      constructor(input) {
        super(input);
      }
      async format(values) {
        return (await this.formatPromptValue(values)).toString();
      }
      async formatPromptValue(values) {
        const resultMessages = await this.formatMessages(values);
        return new ChatPromptValue(resultMessages);
      }
    };
  }
});

// node_modules/@langchain/core/dist/prompts/few_shot.js
var few_shot_exports = {};
__export(few_shot_exports, {
  FewShotChatMessagePromptTemplate: () => FewShotChatMessagePromptTemplate,
  FewShotPromptTemplate: () => FewShotPromptTemplate
});
var FewShotPromptTemplate, FewShotChatMessagePromptTemplate;
var init_few_shot = __esm({
  "node_modules/@langchain/core/dist/prompts/few_shot.js"() {
    init_string2();
    init_template();
    init_prompt();
    init_chat2();
    FewShotPromptTemplate = class _FewShotPromptTemplate extends BaseStringPromptTemplate {
      constructor(input) {
        super(input);
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: false
        });
        Object.defineProperty(this, "examples", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "exampleSelector", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "examplePrompt", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "suffix", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ""
        });
        Object.defineProperty(this, "exampleSeparator", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "\n\n"
        });
        Object.defineProperty(this, "prefix", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ""
        });
        Object.defineProperty(this, "templateFormat", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "f-string"
        });
        Object.defineProperty(this, "validateTemplate", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.assign(this, input);
        if (this.examples !== void 0 && this.exampleSelector !== void 0) {
          throw new Error("Only one of 'examples' and 'example_selector' should be provided");
        }
        if (this.examples === void 0 && this.exampleSelector === void 0) {
          throw new Error("One of 'examples' and 'example_selector' should be provided");
        }
        if (this.validateTemplate) {
          let totalInputVariables = this.inputVariables;
          if (this.partialVariables) {
            totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
          }
          checkValidTemplate(this.prefix + this.suffix, this.templateFormat, totalInputVariables);
        }
      }
      _getPromptType() {
        return "few_shot";
      }
      static lc_name() {
        return "FewShotPromptTemplate";
      }
      async getExamples(inputVariables) {
        if (this.examples !== void 0) {
          return this.examples;
        }
        if (this.exampleSelector !== void 0) {
          return this.exampleSelector.selectExamples(inputVariables);
        }
        throw new Error("One of 'examples' and 'example_selector' should be provided");
      }
      async partial(values) {
        const newInputVariables = this.inputVariables.filter((iv) => !(iv in values));
        const newPartialVariables = {
          ...this.partialVariables ?? {},
          ...values
        };
        const promptDict = {
          ...this,
          inputVariables: newInputVariables,
          partialVariables: newPartialVariables
        };
        return new _FewShotPromptTemplate(promptDict);
      }
      /**
       * Formats the prompt with the given values.
       * @param values The values to format the prompt with.
       * @returns A promise that resolves to a string representing the formatted prompt.
       */
      async format(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        const examples = await this.getExamples(allValues);
        const exampleStrings = await Promise.all(examples.map((example) => this.examplePrompt.format(example)));
        const template = [this.prefix, ...exampleStrings, this.suffix].join(this.exampleSeparator);
        return renderTemplate(template, this.templateFormat, allValues);
      }
      serialize() {
        if (this.exampleSelector || !this.examples) {
          throw new Error("Serializing an example selector is not currently supported");
        }
        if (this.outputParser !== void 0) {
          throw new Error("Serializing an output parser is not currently supported");
        }
        return {
          _type: this._getPromptType(),
          input_variables: this.inputVariables,
          example_prompt: this.examplePrompt.serialize(),
          example_separator: this.exampleSeparator,
          suffix: this.suffix,
          prefix: this.prefix,
          template_format: this.templateFormat,
          examples: this.examples
        };
      }
      static async deserialize(data) {
        const { example_prompt } = data;
        if (!example_prompt) {
          throw new Error("Missing example prompt");
        }
        const examplePrompt = await PromptTemplate.deserialize(example_prompt);
        let examples;
        if (Array.isArray(data.examples)) {
          examples = data.examples;
        } else {
          throw new Error("Invalid examples format. Only list or string are supported.");
        }
        return new _FewShotPromptTemplate({
          inputVariables: data.input_variables,
          examplePrompt,
          examples,
          exampleSeparator: data.example_separator,
          prefix: data.prefix,
          suffix: data.suffix,
          templateFormat: data.template_format
        });
      }
    };
    FewShotChatMessagePromptTemplate = class _FewShotChatMessagePromptTemplate extends BaseChatPromptTemplate {
      _getPromptType() {
        return "few_shot_chat";
      }
      static lc_name() {
        return "FewShotChatMessagePromptTemplate";
      }
      constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "examples", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "exampleSelector", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "examplePrompt", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "suffix", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ""
        });
        Object.defineProperty(this, "exampleSeparator", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "\n\n"
        });
        Object.defineProperty(this, "prefix", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ""
        });
        Object.defineProperty(this, "templateFormat", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "f-string"
        });
        Object.defineProperty(this, "validateTemplate", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        this.examples = fields.examples;
        this.examplePrompt = fields.examplePrompt;
        this.exampleSeparator = fields.exampleSeparator ?? "\n\n";
        this.exampleSelector = fields.exampleSelector;
        this.prefix = fields.prefix ?? "";
        this.suffix = fields.suffix ?? "";
        this.templateFormat = fields.templateFormat ?? "f-string";
        this.validateTemplate = fields.validateTemplate ?? true;
        if (this.examples !== void 0 && this.exampleSelector !== void 0) {
          throw new Error("Only one of 'examples' and 'example_selector' should be provided");
        }
        if (this.examples === void 0 && this.exampleSelector === void 0) {
          throw new Error("One of 'examples' and 'example_selector' should be provided");
        }
        if (this.validateTemplate) {
          let totalInputVariables = this.inputVariables;
          if (this.partialVariables) {
            totalInputVariables = totalInputVariables.concat(Object.keys(this.partialVariables));
          }
          checkValidTemplate(this.prefix + this.suffix, this.templateFormat, totalInputVariables);
        }
      }
      async getExamples(inputVariables) {
        if (this.examples !== void 0) {
          return this.examples;
        }
        if (this.exampleSelector !== void 0) {
          return this.exampleSelector.selectExamples(inputVariables);
        }
        throw new Error("One of 'examples' and 'example_selector' should be provided");
      }
      /**
       * Formats the list of values and returns a list of formatted messages.
       * @param values The values to format the prompt with.
       * @returns A promise that resolves to a string representing the formatted prompt.
       */
      async formatMessages(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        let examples = await this.getExamples(allValues);
        examples = examples.map((example) => {
          const result = {};
          this.examplePrompt.inputVariables.forEach((inputVariable) => {
            result[inputVariable] = example[inputVariable];
          });
          return result;
        });
        const messages = [];
        for (const example of examples) {
          const exampleMessages = await this.examplePrompt.formatMessages(example);
          messages.push(...exampleMessages);
        }
        return messages;
      }
      /**
       * Formats the prompt with the given values.
       * @param values The values to format the prompt with.
       * @returns A promise that resolves to a string representing the formatted prompt.
       */
      async format(values) {
        const allValues = await this.mergePartialAndUserVariables(values);
        const examples = await this.getExamples(allValues);
        const exampleMessages = await Promise.all(examples.map((example) => this.examplePrompt.formatMessages(example)));
        const exampleStrings = exampleMessages.flat().map((message) => message.content);
        const template = [this.prefix, ...exampleStrings, this.suffix].join(this.exampleSeparator);
        return renderTemplate(template, this.templateFormat, allValues);
      }
      /**
       * Partially formats the prompt with the given values.
       * @param values The values to partially format the prompt with.
       * @returns A promise that resolves to an instance of `FewShotChatMessagePromptTemplate` with the given values partially formatted.
       */
      async partial(values) {
        const newInputVariables = this.inputVariables.filter((variable) => !(variable in values));
        const newPartialVariables = {
          ...this.partialVariables ?? {},
          ...values
        };
        const promptDict = {
          ...this,
          inputVariables: newInputVariables,
          partialVariables: newPartialVariables
        };
        return new _FewShotChatMessagePromptTemplate(promptDict);
      }
    };
  }
});

// node_modules/@langchain/core/dist/prompts/base.js
var BasePromptTemplate;
var init_base5 = __esm({
  "node_modules/@langchain/core/dist/prompts/base.js"() {
    init_base4();
    BasePromptTemplate = class extends Runnable {
      get lc_attributes() {
        return {
          partialVariables: void 0
          // python doesn't support this yet
        };
      }
      constructor(input) {
        super(input);
        Object.defineProperty(this, "lc_serializable", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: true
        });
        Object.defineProperty(this, "lc_namespace", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: ["langchain_core", "prompts", this._getPromptType()]
        });
        Object.defineProperty(this, "inputVariables", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "outputParser", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "partialVariables", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
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
        const { inputVariables } = input;
        if (inputVariables.includes("stop")) {
          throw new Error("Cannot have an input variable named 'stop', as it is used internally, please rename.");
        }
        Object.assign(this, input);
      }
      /**
       * Merges partial variables and user variables.
       * @param userVariables The user variables to merge with the partial variables.
       * @returns A Promise that resolves to an object containing the merged variables.
       */
      async mergePartialAndUserVariables(userVariables) {
        const partialVariables = this.partialVariables ?? {};
        const partialValues = {};
        for (const [key, value] of Object.entries(partialVariables)) {
          if (typeof value === "string") {
            partialValues[key] = value;
          } else {
            partialValues[key] = await value();
          }
        }
        const allKwargs = {
          ...partialValues,
          ...userVariables
        };
        return allKwargs;
      }
      /**
       * Invokes the prompt template with the given input and options.
       * @param input The input to invoke the prompt template with.
       * @param options Optional configuration for the callback.
       * @returns A Promise that resolves to the output of the prompt template.
       */
      async invoke(input, options) {
        const metadata = {
          ...this.metadata,
          ...options?.metadata
        };
        const tags = [...this.tags ?? [], ...options?.tags ?? []];
        return this._callWithConfig((input2) => this.formatPromptValue(input2), input, { ...options, tags, metadata, runType: "prompt" });
      }
      /**
       * Return a json-like object representing this prompt template.
       * @deprecated
       */
      serialize() {
        throw new Error("Use .toJSON() instead");
      }
      /**
       * @deprecated
       * Load a prompt template from a json-like object describing it.
       *
       * @remarks
       * Deserializing needs to be async because templates (e.g. {@link FewShotPromptTemplate}) can
       * reference remote resources that we read asynchronously with a web
       * request.
       */
      static async deserialize(data) {
        switch (data._type) {
          case "prompt": {
            const { PromptTemplate: PromptTemplate2 } = await Promise.resolve().then(() => (init_prompt(), prompt_exports));
            return PromptTemplate2.deserialize(data);
          }
          case void 0: {
            const { PromptTemplate: PromptTemplate2 } = await Promise.resolve().then(() => (init_prompt(), prompt_exports));
            return PromptTemplate2.deserialize({ ...data, _type: "prompt" });
          }
          case "few_shot": {
            const { FewShotPromptTemplate: FewShotPromptTemplate2 } = await Promise.resolve().then(() => (init_few_shot(), few_shot_exports));
            return FewShotPromptTemplate2.deserialize(data);
          }
          default:
            throw new Error(`Invalid prompt type in config: ${data._type}`);
        }
      }
    };
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
var insecureHash = (message) => {
  return new Sha1(true).update(message)["hex"]();
};

// node_modules/@langchain/core/dist/caches/base.js
init_utils2();
var getCacheKey = (...strings) => insecureHash(strings.join("_"));
var BaseCache = class {
};
var GLOBAL_MAP = /* @__PURE__ */ new Map();
var InMemoryCache = class _InMemoryCache extends BaseCache {
  constructor(map) {
    super();
    Object.defineProperty(this, "cache", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.cache = map ?? /* @__PURE__ */ new Map();
  }
  /**
   * Retrieves data from the cache using a prompt and an LLM key. If the
   * data is not found, it returns null.
   * @param prompt The prompt used to find the data.
   * @param llmKey The LLM key used to find the data.
   * @returns The data corresponding to the prompt and LLM key, or null if not found.
   */
  lookup(prompt, llmKey) {
    return Promise.resolve(this.cache.get(getCacheKey(prompt, llmKey)) ?? null);
  }
  /**
   * Updates the cache with new data using a prompt and an LLM key.
   * @param prompt The prompt used to store the data.
   * @param llmKey The LLM key used to store the data.
   * @param value The data to be stored.
   */
  async update(prompt, llmKey, value) {
    this.cache.set(getCacheKey(prompt, llmKey), value);
  }
  /**
   * Returns a global instance of InMemoryCache using a predefined global
   * map as the initial cache.
   * @returns A global instance of InMemoryCache.
   */
  static global() {
    return new _InMemoryCache(GLOBAL_MAP);
  }
};

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
function getEncodingNameForModel(model) {
  switch (model) {
    case "gpt2": {
      return "gpt2";
    }
    case "code-cushman-001":
    case "code-cushman-002":
    case "code-davinci-001":
    case "code-davinci-002":
    case "cushman-codex":
    case "davinci-codex":
    case "davinci-002":
    case "text-davinci-002":
    case "text-davinci-003": {
      return "p50k_base";
    }
    case "code-davinci-edit-001":
    case "text-davinci-edit-001": {
      return "p50k_edit";
    }
    case "ada":
    case "babbage":
    case "babbage-002":
    case "code-search-ada-code-001":
    case "code-search-babbage-code-001":
    case "curie":
    case "davinci":
    case "text-ada-001":
    case "text-babbage-001":
    case "text-curie-001":
    case "text-davinci-001":
    case "text-search-ada-doc-001":
    case "text-search-babbage-doc-001":
    case "text-search-curie-doc-001":
    case "text-search-davinci-doc-001":
    case "text-similarity-ada-001":
    case "text-similarity-babbage-001":
    case "text-similarity-curie-001":
    case "text-similarity-davinci-001": {
      return "r50k_base";
    }
    case "gpt-3.5-turbo-instruct-0914":
    case "gpt-3.5-turbo-instruct":
    case "gpt-3.5-turbo-16k-0613":
    case "gpt-3.5-turbo-16k":
    case "gpt-3.5-turbo-0613":
    case "gpt-3.5-turbo-0301":
    case "gpt-3.5-turbo":
    case "gpt-4-32k-0613":
    case "gpt-4-32k-0314":
    case "gpt-4-32k":
    case "gpt-4-0613":
    case "gpt-4-0314":
    case "gpt-4":
    case "gpt-3.5-turbo-1106":
    case "gpt-35-turbo":
    case "gpt-4-1106-preview":
    case "gpt-4-vision-preview":
    case "gpt-3.5-turbo-0125":
    case "gpt-4-turbo":
    case "gpt-4-turbo-2024-04-09":
    case "gpt-4-turbo-preview":
    case "gpt-4-0125-preview":
    case "text-embedding-ada-002":
    case "text-embedding-3-small":
    case "text-embedding-3-large": {
      return "cl100k_base";
    }
    case "gpt-4o":
    case "gpt-4o-2024-05-13":
    case "gpt-4o-2024-08-06":
    case "gpt-4o-mini-2024-07-18":
    case "gpt-4o-mini":
    case "o1-2024-12-17":
    case "o1-mini":
    case "o1-preview":
    case "o1-preview-2024-09-12":
    case "o1-mini-2024-09-12":
    case "chatgpt-4o-latest":
    case "gpt-4o-realtime":
    case "gpt-4o-realtime-preview-2024-10-01": {
      return "o200k_base";
    }
    default:
      throw new Error("Unknown model");
  }
}

// node_modules/@langchain/core/dist/utils/tiktoken.js
init_async_caller2();
var cache = {};
var caller = /* @__PURE__ */ new AsyncCaller2({});
async function getEncoding(encoding) {
  if (!(encoding in cache)) {
    cache[encoding] = caller.fetch(`https://tiktoken.pages.dev/js/${encoding}.json`).then((res) => res.json()).then((data) => new Tiktoken(data)).catch((e) => {
      delete cache[encoding];
      throw e;
    });
  }
  return await cache[encoding];
}
async function encodingForModel(model) {
  return getEncoding(getEncodingNameForModel(model));
}

// node_modules/@langchain/core/dist/language_models/base.js
init_base4();
var getModelNameForTiktoken = (modelName) => {
  if (modelName.startsWith("gpt-3.5-turbo-16k")) {
    return "gpt-3.5-turbo-16k";
  }
  if (modelName.startsWith("gpt-3.5-turbo-")) {
    return "gpt-3.5-turbo";
  }
  if (modelName.startsWith("gpt-4-32k")) {
    return "gpt-4-32k";
  }
  if (modelName.startsWith("gpt-4-")) {
    return "gpt-4";
  }
  if (modelName.startsWith("gpt-4o")) {
    return "gpt-4o";
  }
  return modelName;
};
var getVerbosity = () => false;
var BaseLangChain = class extends Runnable {
  get lc_attributes() {
    return {
      callbacks: void 0,
      verbose: void 0
    };
  }
  constructor(params) {
    super(params);
    Object.defineProperty(this, "verbose", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "callbacks", {
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
    Object.defineProperty(this, "metadata", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.verbose = params.verbose ?? getVerbosity();
    this.callbacks = params.callbacks;
    this.tags = params.tags ?? [];
    this.metadata = params.metadata ?? {};
  }
};
var BaseLanguageModel = class extends BaseLangChain {
  /**
   * Keys that the language model accepts as call options.
   */
  get callKeys() {
    return ["stop", "timeout", "signal", "tags", "metadata", "callbacks"];
  }
  constructor({ callbacks, callbackManager, ...params }) {
    const { cache: cache2, ...rest } = params;
    super({
      callbacks: callbacks ?? callbackManager,
      ...rest
    });
    Object.defineProperty(this, "caller", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cache", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_encoding", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    if (typeof cache2 === "object") {
      this.cache = cache2;
    } else if (cache2) {
      this.cache = InMemoryCache.global();
    } else {
      this.cache = void 0;
    }
    this.caller = new AsyncCaller2(params ?? {});
  }
  async getNumTokens(content) {
    if (typeof content !== "string") {
      return 0;
    }
    let numTokens = Math.ceil(content.length / 4);
    if (!this._encoding) {
      try {
        this._encoding = await encodingForModel("modelName" in this ? getModelNameForTiktoken(this.modelName) : "gpt2");
      } catch (error) {
        console.warn("Failed to calculate number of tokens, falling back to approximate count", error);
      }
    }
    if (this._encoding) {
      try {
        numTokens = this._encoding.encode(content).length;
      } catch (error) {
        console.warn("Failed to calculate number of tokens, falling back to approximate count", error);
      }
    }
    return numTokens;
  }
  static _convertInputToPromptValue(input) {
    if (typeof input === "string") {
      return new StringPromptValue(input);
    } else if (Array.isArray(input)) {
      return new ChatPromptValue(input.map(coerceMessageLikeToMessage));
    } else {
      return input;
    }
  }
  /**
   * Get the identifying parameters of the LLM.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _identifyingParams() {
    return {};
  }
  /**
   * Create a unique cache key for a specific call to a specific language model.
   * @param callOptions Call options for the model
   * @returns A unique cache key.
   */
  _getSerializedCacheKeyParametersForCall({ config, ...callOptions }) {
    const params = {
      ...this._identifyingParams(),
      ...callOptions,
      _type: this._llmType(),
      _model: this._modelType()
    };
    const filteredEntries = Object.entries(params).filter(([_, value]) => value !== void 0);
    const serializedEntries = filteredEntries.map(([key, value]) => `${key}:${JSON.stringify(value)}`).sort().join(",");
    return serializedEntries;
  }
  /**
   * @deprecated
   * Return a json-like object representing this LLM.
   */
  serialize() {
    return {
      ...this._identifyingParams(),
      _type: this._llmType(),
      _model: this._modelType()
    };
  }
  /**
   * @deprecated
   * Load an LLM from a json-like object describing it.
   */
  static async deserialize(_data) {
    throw new Error("Use .toJSON() instead");
  }
};

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
var BaseLLM = class _BaseLLM extends BaseLanguageModel {
  constructor({ concurrency, ...rest }) {
    super(concurrency ? { maxConcurrency: concurrency, ...rest } : rest);
    Object.defineProperty(this, "lc_namespace", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ["langchain", "llms", this._llmType()]
    });
  }
  /**
   * This method takes an input and options, and returns a string. It
   * converts the input to a prompt value and generates a result based on
   * the prompt.
   * @param input Input for the LLM.
   * @param options Options for the LLM call.
   * @returns A string result based on the prompt.
   */
  async invoke(input, options) {
    const promptValue = _BaseLLM._convertInputToPromptValue(input);
    const result = await this.generatePrompt([promptValue], options, options?.callbacks);
    return result.generations[0][0].text;
  }
  // eslint-disable-next-line require-yield
  async *_streamResponseChunks(_input, _options, _runManager) {
    throw new Error("Not implemented.");
  }
  _separateRunnableConfigFromCallOptionsCompat(options) {
    const [runnableConfig, callOptions] = super._separateRunnableConfigFromCallOptions(options);
    callOptions.signal = runnableConfig.signal;
    return [runnableConfig, callOptions];
  }
  async *_streamIterator(input, options) {
    if (this._streamResponseChunks === _BaseLLM.prototype._streamResponseChunks) {
      yield this.invoke(input, options);
    } else {
      const prompt = _BaseLLM._convertInputToPromptValue(input);
      const [runnableConfig, callOptions] = this._separateRunnableConfigFromCallOptionsCompat(options);
      const callbackManager_ = await CallbackManager.configure(runnableConfig.callbacks, this.callbacks, runnableConfig.tags, this.tags, runnableConfig.metadata, this.metadata, { verbose: this.verbose });
      const extra = {
        options: callOptions,
        invocation_params: this?.invocationParams(callOptions),
        batch_size: 1
      };
      const runManagers = await callbackManager_?.handleLLMStart(this.toJSON(), [prompt.toString()], runnableConfig.runId, void 0, extra, void 0, void 0, runnableConfig.runName);
      let generation = new GenerationChunk({
        text: ""
      });
      try {
        for await (const chunk of this._streamResponseChunks(prompt.toString(), callOptions, runManagers?.[0])) {
          if (!generation) {
            generation = chunk;
          } else {
            generation = generation.concat(chunk);
          }
          if (typeof chunk.text === "string") {
            yield chunk.text;
          }
        }
      } catch (err) {
        await Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMError(err)));
        throw err;
      }
      await Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMEnd({
        generations: [[generation]]
      })));
    }
  }
  /**
   * This method takes prompt values, options, and callbacks, and generates
   * a result based on the prompts.
   * @param promptValues Prompt values for the LLM.
   * @param options Options for the LLM call.
   * @param callbacks Callbacks for the LLM call.
   * @returns An LLMResult based on the prompts.
   */
  async generatePrompt(promptValues, options, callbacks) {
    const prompts = promptValues.map((promptValue) => promptValue.toString());
    return this.generate(prompts, options, callbacks);
  }
  /**
   * Get the parameters used to invoke the model
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invocationParams(_options) {
    return {};
  }
  _flattenLLMResult(llmResult) {
    const llmResults = [];
    for (let i = 0; i < llmResult.generations.length; i += 1) {
      const genList = llmResult.generations[i];
      if (i === 0) {
        llmResults.push({
          generations: [genList],
          llmOutput: llmResult.llmOutput
        });
      } else {
        const llmOutput = llmResult.llmOutput ? { ...llmResult.llmOutput, tokenUsage: {} } : void 0;
        llmResults.push({
          generations: [genList],
          llmOutput
        });
      }
    }
    return llmResults;
  }
  /** @ignore */
  async _generateUncached(prompts, parsedOptions, handledOptions) {
    const callbackManager_ = await CallbackManager.configure(handledOptions.callbacks, this.callbacks, handledOptions.tags, this.tags, handledOptions.metadata, this.metadata, { verbose: this.verbose });
    const extra = {
      options: parsedOptions,
      invocation_params: this?.invocationParams(parsedOptions),
      batch_size: prompts.length
    };
    const runManagers = await callbackManager_?.handleLLMStart(this.toJSON(), prompts, handledOptions.runId, void 0, extra, void 0, void 0, handledOptions?.runName);
    const hasStreamingHandler = !!runManagers?.[0].handlers.find(callbackHandlerPrefersStreaming);
    let output;
    if (hasStreamingHandler && prompts.length === 1 && this._streamResponseChunks !== _BaseLLM.prototype._streamResponseChunks) {
      try {
        const stream = await this._streamResponseChunks(prompts[0], parsedOptions, runManagers?.[0]);
        let aggregated;
        for await (const chunk of stream) {
          if (aggregated === void 0) {
            aggregated = chunk;
          } else {
            aggregated = concat(aggregated, chunk);
          }
        }
        if (aggregated === void 0) {
          throw new Error("Received empty response from chat model call.");
        }
        output = { generations: [[aggregated]], llmOutput: {} };
        await runManagers?.[0].handleLLMEnd(output);
      } catch (e) {
        await runManagers?.[0].handleLLMError(e);
        throw e;
      }
    } else {
      try {
        output = await this._generate(prompts, parsedOptions, runManagers?.[0]);
      } catch (err) {
        await Promise.all((runManagers ?? []).map((runManager) => runManager?.handleLLMError(err)));
        throw err;
      }
      const flattenedOutputs = this._flattenLLMResult(output);
      await Promise.all((runManagers ?? []).map((runManager, i) => runManager?.handleLLMEnd(flattenedOutputs[i])));
    }
    const runIds = runManagers?.map((manager) => manager.runId) || void 0;
    Object.defineProperty(output, RUN_KEY, {
      value: runIds ? { runIds } : void 0,
      configurable: true
    });
    return output;
  }
  async _generateCached({ prompts, cache: cache2, llmStringKey, parsedOptions, handledOptions, runId }) {
    const callbackManager_ = await CallbackManager.configure(handledOptions.callbacks, this.callbacks, handledOptions.tags, this.tags, handledOptions.metadata, this.metadata, { verbose: this.verbose });
    const extra = {
      options: parsedOptions,
      invocation_params: this?.invocationParams(parsedOptions),
      batch_size: prompts.length,
      cached: true
    };
    const runManagers = await callbackManager_?.handleLLMStart(this.toJSON(), prompts, runId, void 0, extra, void 0, void 0, handledOptions?.runName);
    const missingPromptIndices = [];
    const results = await Promise.allSettled(prompts.map(async (prompt, index) => {
      const result = await cache2.lookup(prompt, llmStringKey);
      if (result == null) {
        missingPromptIndices.push(index);
      }
      return result;
    }));
    const cachedResults = results.map((result, index) => ({ result, runManager: runManagers?.[index] })).filter(({ result }) => result.status === "fulfilled" && result.value != null || result.status === "rejected");
    const generations = [];
    await Promise.all(cachedResults.map(async ({ result: promiseResult, runManager }, i) => {
      if (promiseResult.status === "fulfilled") {
        const result = promiseResult.value;
        generations[i] = result;
        if (result.length) {
          await runManager?.handleLLMNewToken(result[0].text);
        }
        return runManager?.handleLLMEnd({
          generations: [result]
        });
      } else {
        await runManager?.handleLLMError(promiseResult.reason);
        return Promise.reject(promiseResult.reason);
      }
    }));
    const output = {
      generations,
      missingPromptIndices
    };
    Object.defineProperty(output, RUN_KEY, {
      value: runManagers ? { runIds: runManagers?.map((manager) => manager.runId) } : void 0,
      configurable: true
    });
    return output;
  }
  /**
   * Run the LLM on the given prompts and input, handling caching.
   */
  async generate(prompts, options, callbacks) {
    if (!Array.isArray(prompts)) {
      throw new Error("Argument 'prompts' is expected to be a string[]");
    }
    let parsedOptions;
    if (Array.isArray(options)) {
      parsedOptions = { stop: options };
    } else {
      parsedOptions = options;
    }
    const [runnableConfig, callOptions] = this._separateRunnableConfigFromCallOptionsCompat(parsedOptions);
    runnableConfig.callbacks = runnableConfig.callbacks ?? callbacks;
    if (!this.cache) {
      return this._generateUncached(prompts, callOptions, runnableConfig);
    }
    const { cache: cache2 } = this;
    const llmStringKey = this._getSerializedCacheKeyParametersForCall(callOptions);
    const { generations, missingPromptIndices } = await this._generateCached({
      prompts,
      cache: cache2,
      llmStringKey,
      parsedOptions: callOptions,
      handledOptions: runnableConfig,
      runId: runnableConfig.runId
    });
    let llmOutput = {};
    if (missingPromptIndices.length > 0) {
      const results = await this._generateUncached(missingPromptIndices.map((i) => prompts[i]), callOptions, runnableConfig);
      await Promise.all(results.generations.map(async (generation, index) => {
        const promptIndex = missingPromptIndices[index];
        generations[promptIndex] = generation;
        return cache2.update(prompts[promptIndex], llmStringKey, generation);
      }));
      llmOutput = results.llmOutput ?? {};
    }
    return { generations, llmOutput };
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   * Convenience wrapper for {@link generate} that takes in a single string prompt and returns a single string output.
   */
  async call(prompt, options, callbacks) {
    const { generations } = await this.generate([prompt], options, callbacks);
    return generations[0][0].text;
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * This method is similar to `call`, but it's used for making predictions
   * based on the input text.
   * @param text Input text for the prediction.
   * @param options Options for the LLM call.
   * @param callbacks Callbacks for the LLM call.
   * @returns A prediction based on the input text.
   */
  async predict(text, options, callbacks) {
    return this.call(text, options, callbacks);
  }
  /**
   * @deprecated Use .invoke() instead. Will be removed in 0.2.0.
   *
   * This method takes a list of messages, options, and callbacks, and
   * returns a predicted message.
   * @param messages A list of messages for the prediction.
   * @param options Options for the LLM call.
   * @param callbacks Callbacks for the LLM call.
   * @returns A predicted message based on the list of messages.
   */
  async predictMessages(messages, options, callbacks) {
    const text = getBufferString(messages);
    const prediction = await this.call(text, options, callbacks);
    return new AIMessage(prediction);
  }
  /**
   * Get the identifying parameters of the LLM.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _identifyingParams() {
    return {};
  }
  /**
   * @deprecated
   * Return a json-like object representing this LLM.
   */
  serialize() {
    return {
      ...this._identifyingParams(),
      _type: this._llmType(),
      _model: this._modelType()
    };
  }
  _modelType() {
    return "base_llm";
  }
};
var LLM = class extends BaseLLM {
  async _generate(prompts, options, runManager) {
    const generations = await Promise.all(prompts.map((prompt, promptIndex) => this._call(prompt, { ...options, promptIndex }, runManager).then((text) => [{ text }])));
    return { generations };
  }
};

// node_modules/@langchain/ollama/dist/llms.js
var Ollama2 = class extends LLM {
  static lc_name() {
    return "Ollama";
  }
  constructor(fields) {
    super(fields ?? {});
    Object.defineProperty(this, "lc_serializable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: true
    });
    Object.defineProperty(this, "model", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "llama3"
    });
    Object.defineProperty(this, "baseUrl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "http://localhost:11434"
    });
    Object.defineProperty(this, "keepAlive", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "embeddingOnly", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "f16KV", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "frequencyPenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "logitsAll", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "lowVram", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mainGpu", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mirostat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mirostatEta", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mirostatTau", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numBatch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numCtx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numGpu", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numKeep", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numPredict", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numThread", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "penalizeNewline", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "presencePenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "repeatLastN", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "repeatPenalty", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "temperature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tfsZ", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "topK", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "topP", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "typicalP", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "useMLock", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "useMMap", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "vocabOnly", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "format", {
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
    this.model = fields?.model ?? this.model;
    this.baseUrl = fields?.baseUrl?.endsWith("/") ? fields?.baseUrl.slice(0, -1) : fields?.baseUrl ?? this.baseUrl;
    this.client = new Ollama$1({
      host: this.baseUrl,
      headers: fields?.headers
    });
    this.keepAlive = fields?.keepAlive;
    this.embeddingOnly = fields?.embeddingOnly;
    this.f16KV = fields?.f16Kv;
    this.frequencyPenalty = fields?.frequencyPenalty;
    this.logitsAll = fields?.logitsAll;
    this.lowVram = fields?.lowVram;
    this.mainGpu = fields?.mainGpu;
    this.mirostat = fields?.mirostat;
    this.mirostatEta = fields?.mirostatEta;
    this.mirostatTau = fields?.mirostatTau;
    this.numBatch = fields?.numBatch;
    this.numCtx = fields?.numCtx;
    this.numGpu = fields?.numGpu;
    this.numKeep = fields?.numKeep;
    this.numPredict = fields?.numPredict;
    this.numThread = fields?.numThread;
    this.penalizeNewline = fields?.penalizeNewline;
    this.presencePenalty = fields?.presencePenalty;
    this.repeatLastN = fields?.repeatLastN;
    this.repeatPenalty = fields?.repeatPenalty;
    this.temperature = fields?.temperature;
    this.stop = fields?.stop;
    this.tfsZ = fields?.tfsZ;
    this.topK = fields?.topK;
    this.topP = fields?.topP;
    this.typicalP = fields?.typicalP;
    this.useMLock = fields?.useMlock;
    this.useMMap = fields?.useMmap;
    this.vocabOnly = fields?.vocabOnly;
    this.format = fields?.format;
  }
  _llmType() {
    return "ollama";
  }
  invocationParams(options) {
    return {
      model: this.model,
      format: this.format,
      keep_alive: this.keepAlive,
      images: options?.images,
      options: {
        embedding_only: this.embeddingOnly,
        f16_kv: this.f16KV,
        frequency_penalty: this.frequencyPenalty,
        logits_all: this.logitsAll,
        low_vram: this.lowVram,
        main_gpu: this.mainGpu,
        mirostat: this.mirostat,
        mirostat_eta: this.mirostatEta,
        mirostat_tau: this.mirostatTau,
        num_batch: this.numBatch,
        num_ctx: this.numCtx,
        num_gpu: this.numGpu,
        num_keep: this.numKeep,
        num_predict: this.numPredict,
        num_thread: this.numThread,
        penalize_newline: this.penalizeNewline,
        presence_penalty: this.presencePenalty,
        repeat_last_n: this.repeatLastN,
        repeat_penalty: this.repeatPenalty,
        temperature: this.temperature,
        stop: options?.stop ?? this.stop,
        tfs_z: this.tfsZ,
        top_k: this.topK,
        top_p: this.topP,
        typical_p: this.typicalP,
        use_mlock: this.useMLock,
        use_mmap: this.useMMap,
        vocab_only: this.vocabOnly
      }
    };
  }
  async *_streamResponseChunks(prompt, options, runManager) {
    const stream = await this.caller.call(async () => this.client.generate({
      ...this.invocationParams(options),
      prompt,
      stream: true
    }));
    for await (const chunk of stream) {
      if (options.signal?.aborted) {
        throw new Error("This operation was aborted");
      }
      if (!chunk.done) {
        yield new GenerationChunk({
          text: chunk.response,
          generationInfo: {
            ...chunk,
            response: void 0
          }
        });
        await runManager?.handleLLMNewToken(chunk.response ?? "");
      } else {
        yield new GenerationChunk({
          text: "",
          generationInfo: {
            model: chunk.model,
            total_duration: chunk.total_duration,
            load_duration: chunk.load_duration,
            prompt_eval_count: chunk.prompt_eval_count,
            prompt_eval_duration: chunk.prompt_eval_duration,
            eval_count: chunk.eval_count,
            eval_duration: chunk.eval_duration
          }
        });
      }
    }
  }
  /** @ignore */
  async _call(prompt, options, runManager) {
    const chunks = [];
    for await (const chunk of this._streamResponseChunks(prompt, options, runManager)) {
      chunks.push(chunk.text);
    }
    return chunks.join("");
  }
};

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
  if (request.action === "askLLM") {
    const webpageContent = request.document;
    const question = request.question;
    const llm = new Ollama2({
      model: "llama3.2",
      // Default value
      temperature: 0,
      maxRetries: 2
      // other params...
    });
    const prompt = new PromptTemplate({
      template: "You are helpful assistant. Given following document: {document} ,  Answer the question: {question}",
      inputVariables: ["document", "question"]
    });
    const chain = prompt.pipe(llm);
    const result = chain.invoke({ "document": webpageContent, "question": question });
    sendResponse({ translation: result });
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