/**
 *  @license
 *    Copyright 2018 Brigham Young University
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 **/
'use strict';
const Exception = require('./exception');
const Result    = require('./result');
const Swagger   = require('./definition-validators/open-api');
const util      = require('./util');

const rxExtension = /^x-.+/;

module.exports = function(definition) {
    const exception = Exception('One or more errors exist in the OpenAPI definition');
    const warn = Exception('One or more warnings exist in the OpenAPI definition');
    const hasSwagger = definition.hasOwnProperty('swagger');
    if (!hasSwagger && !definition.hasOwnProperty('openapi')) {
        return new Result(exception('Missing required "openapi" or "swagger" property'), null);
    } else {
        const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(definition.swagger || definition.openapi);
        if (match) {
            const map = new Map();
            const major = +match[1];
            const minor = +match[2];
            const patch = +(match[3] || 0);
            const result = {};
            const validator = Swagger;
            const value = util.copy(definition);
            const key = undefined;

            const root = { exception, key, major, map, minor, parent, patch, validator, value, warn };
            root.root = root;
            normalize(root);
            return new Result(exception, result.value, warn);
        } else {
            return new Result(exception('Invalid value for property: ' + (hasSwagger ? 'swagger' : 'openapi')), null);
        }
    }
};

module.exports.normalize = function(version, validator, definition) {
    if (version === 2) version = '2.0';
    if (version === 3) version = '3.0.0';
    const exception = Exception('One or more errors exist in the definition');
    const warn = Exception('One or more warnings exist in the definition');
    const match = /^(\d+)(?:\.(\d+))(?:\.(\d+))?$/.exec(version);
    const map = new Map();
    const major = +match[1];
    const minor = +match[2];
    const patch = +(match[3] || 0);
    const parent = null;
    const result = {};
    const value = util.copy(definition);
    const key = undefined;

    const root = { exception, key, major, map, minor, parent, patch, result, validator, value, warn };
    root.root = root;
    normalize(root);
    return new Result(exception, result.value, warn);
};

/**
 *
 * @param {object} data
 * @param {Exception} data.exception
 * @param {string|number} data.key
 * @param {number} data.major
 * @param {Map} data.map
 * @param {number} data.minor
 * @param {object} data.parent
 * @param {number} data.patch
 * @param {*} data.root
 * @param {object} data.validator
 * @param {*} data.value
 * @param {Exception} data.warn
 * @returns {*}
 */
function normalize(data) {
    const { exception, major, map, minor, parent, patch, result, root, value, warn } = data = Object.assign({}, data);

    // if this definition has already been processed then return result
    if (value && typeof value === 'object') {
        const existing = map.get(value);
        if (existing) return existing;
        map.set(value, result);
    }

    const validator = getValidator(data);
    let message;

    try {
        // check that type matches
        const type = getValueType(value);
        if (validator.type && (message = checkType(data))) {
            exception('Value must be ' + message + '. Received: ' + util.smart(value));

        // check if enum matches
        } else if (validator.enum && (message = checkEnum(data))) {
            message.length === 1
                ? exception('Value must be ' + util.smart(message[0]) + '. Received: ' + util.smart(value))
                : exception('Value must be one of: ' + message.join(', ') + '. Received: ' + util.smart(value));

        } else if (type === 'array') {
            result.value = value.map((v, i) => {
                const r = {};
                normalize({
                    exception: exception.at(i),
                    key: i,
                    major,
                    map,
                    minor,
                    parent: data,
                    patch,
                    result: r,
                    root,
                    validator: validator.items,
                    value: v,
                    warn: warn.at(i)
                });
                return r.value;
            });

        } else if (type === 'object') {
            result.value = {};
            if (validator.additionalProperties) {
                const additionalPropertiesValidator = validator.additionalProperties;
                Object.keys(value).forEach(key => {
                    const r = {};
                    const param = {
                        exception: exception.at(key),
                        key,
                        major,
                        map,
                        minor,
                        parent: data,
                        patch,
                        result: r,
                        root,
                        validator: additionalPropertiesValidator,
                        value: value[key],
                        warn: warn.at(key)
                    };
                    const validator = getValidator(param);

                    const allowed = validator.hasOwnProperty('allowed')
                        ? fn(validator.allowed, param)
                        : true;
                    const ignore = validator.ignore && fn(validator.ignore, param);

                    if (allowed === true) {
                        if (!ignore) {
                            normalize(param);
                            result.value[key] = r.value;
                        }
                    } else {
                        let message = 'Property not allowed: ' + key;
                        if (typeof allowed === 'string') message += '. ' + allowed;
                        exception(message)
                    }
                });

            } else if (!validator.properties) {
                Object.keys(value).forEach(key => {
                    result.value[key] = value[key];
                });

            } else {
                const allowed = {};
                const ignores = {};
                const missingRequired = [];
                const properties = validator.properties;

                // check for missing required and set defaults
                Object.keys(properties).forEach(key => {
                    const param = {
                        exception: exception.at(key),
                        key,
                        major,
                        minor,
                        parent: data,
                        patch,
                        root,
                        validator: properties[key],
                        value: value[key],
                        warn: warn.at(key)
                    };
                    const validator = getValidator(param);

                    // check whether this property is allowed
                    allowed[key] = validator.hasOwnProperty('allowed')
                        ? fn(validator.allowed, param)
                        : true;

                    // check if this property is ignored
                    ignores[key] = validator.ignore && fn(validator.ignore, param);

                    // if it doesn't have the property and it is allowed then check if it is required or has a default
                    if (!value.hasOwnProperty(key) && allowed[key]) {
                        if (validator.required && fn(validator.required, param)) {
                            missingRequired.push(key);
                        } else if (validator.hasOwnProperty('default') && !ignores[key]) {
                            const defaultValue = fn(validator.default, param);
                            if (defaultValue !== undefined) value[key] = defaultValue;
                        }
                    }
                });

                // validate each property and copy to the result object
                Object.keys(value).forEach(key => {

                    // check if the key is an extension property
                    if (rxExtension.test(key)) {
                        result.value[key] = value[key];

                        // check if property allowed
                    } else if (allowed[key] !== true) {
                        let message = 'Property not allowed: ' + key;
                        if (typeof allowed[key] === 'string') message += '. ' + allowed[key];
                        exception(message)

                    } else if (!ignores[key]) {
                        const r = {};
                        normalize({
                            exception: exception.at(key),
                            key,
                            major,
                            map,
                            minor,
                            parent: data,
                            patch,
                            result: r,
                            root,
                            value: value[key],
                            validator: validator.properties[key],
                            warn: warn.at(key)
                        });
                        result.value[key] = r.value;
                    }
                });

                // report missing required properties
                if (missingRequired.length) {
                    missingRequired.sort();
                    exception('Missing required propert' + (missingRequired.length === 1 ? 'y' : 'ies') + ': ' + missingRequired.join(', '));
                }
            }

        } else {
            result.value = validator.deserialize
                ? fn(validator.deserialize, {
                    exception,
                    key: undefined,
                    major,
                    minor,
                    parent,
                    patch,
                    root,
                    validator,
                    value,
                    warn
                })
                : value;
        }

        if (result.value !== undefined) {

            if (validator.errors) {
                fn(validator.errors, {
                    exception,
                    key: undefined,
                    major,
                    minor,
                    parent,
                    patch,
                    root,
                    validator,
                    value: result.value,
                    warn
                });
            }

            if (validator.component && !exception.hasException) {
                result.value = new validator.component({
                    definition: result.value,
                    hierarchy: { parent, root },
                    version: { major, minor, patch }
                });
            }
        }

    } catch (err) {
        exception('Unexpected error encountered, likely due to malformed definition: ' + err.stack);
    }
}

function fn(value, params) {
    if (typeof value === 'function') {
        try {
            return value(params);
        } catch (err) {
            params.exception('Unexpected error encountered, likely due to malformed definition: ' + err.stack);
        }
    } else {
        return value;
    }
}

function checkType(params) {
    const { validator, value } = params;
    if (!validator.type) return;

    // get the value type
    const type = getValueType(value);

    // get valid types
    let matches = fn(validator.type, params);
    if (!Array.isArray(matches)) matches = [ matches ];

    // check if types match
    let valid = false;
    const length = matches.length;
    for (let i = 0; i < length; i++) {
        if (matches[i] === type) {
            valid = true;
            break;
        }
    }

    if (!valid) {
        const suffixes = matches.map(type => {
            let suffix = 'a ' + type;
            if (type === 'array') suffix = 'an array';
            if (type === 'object') suffix = 'a plain object';
            return suffix;
        });

        if (suffixes.length === 1) return suffixes[0];
        if (suffixes.length === 2) return suffixes[0] + ' or ' + suffixes[1];

        const last = suffixes.pop();
        return suffixes.join(', ') + ', or ' + last;
    }
}

function checkEnum(params) {
    const { validator, value } = params;
    if (!validator.enum) return false;
    const matches = fn(validator.enum, params);
    return matches.indexOf(value) !== -1
        ? false
        : matches;
}

function getValidator(data) {
    const type = typeof data.validator;
    if (type === 'function') {
        data.validator = new data.validator(data);
    } else if (type === 'string') {
        data.validator = { type: data.validator };
    }
    return data.validator;
}

/**
 * @param value
 * @returns {string|undefined}
 */
function getValueType(value) {
    let type = typeof value;
    if (Array.isArray(value)) type = 'array';
    if (type === 'object' && !util.isPlainObject(value)) type = undefined;
    return type;
}