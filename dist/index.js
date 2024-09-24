"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
exports.Inject = Inject;
exports.Injectable = Injectable;
var INJECTABLE_KEY = Symbol('injectable');
var INJECT_KEY = Symbol('inject');
// Container for dependency injection
var Container = /** @class */ (function () {
    function Container() {
        this.instances = new Map();
        this.singletons = new Map();
    }
    Container.prototype.registerSingleton = function (name, resolver) {
        var _this = this;
        // If singleton already created, do nothing
        if (!this.instances.has(name)) {
            // Register resolver if it's the first time
            this.instances.set(name, function () {
                var _a;
                console.log("Creating singleton for ".concat(name));
                var instance = (_a = _this.singletons.get(name)) !== null && _a !== void 0 ? _a : resolver();
                _this.singletons.set(name, instance);
                return instance;
            });
        }
        else {
            console.log("".concat(name, " is already registered as a singleton."));
        }
    };
    Container.prototype.register = function (name, resolver) {
        this.instances.set(name, resolver);
    };
    Container.prototype.resolve = function (name) {
        var resolver = this.instances.get(name);
        if (!resolver) {
            throw new Error("Cannot found instance");
        }
        return resolver();
    };
    Container.prototype.injectDependencies = function (target) {
        var _this = this;
        var injections = target.constructor.__injections || [];
        injections.forEach(function (injection) {
            target[injection.propertyKey] = _this.resolve(injection.name);
        });
    };
    return Container;
}());
exports.Container = Container;
// Decorator for class
function Injectable() {
    return function (target) {
        target[INJECTABLE_KEY] = true;
    };
}
// Decorator for property
function Inject(name) {
    return function (target, propertyKey) {
        var constructor = target.constructor;
        if (!constructor[INJECT_KEY]) {
            constructor[INJECT_KEY] = [];
        }
        constructor[INJECT_KEY].push({ propertyKey: propertyKey, name: name });
    };
}
