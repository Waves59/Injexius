"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var TYPES = {
    ServiceA: Symbol('ServiceA'),
    ServiceB: Symbol('ServiceB')
};
var ServiceA = /** @class */ (function () {
    function ServiceA() {
    }
    ServiceA.prototype.sayHello = function () {
        console.log('Hello from ServiceA');
    };
    ServiceA = __decorate([
        (0, _1.Injectable)()
    ], ServiceA);
    return ServiceA;
}());
var ServiceB = /** @class */ (function () {
    function ServiceB() {
    }
    ServiceB.prototype.greet = function () {
        this.serviceA.sayHello();
    };
    __decorate([
        (0, _1.Inject)(TYPES.ServiceA),
        __metadata("design:type", ServiceA)
    ], ServiceB.prototype, "serviceA", void 0);
    ServiceB = __decorate([
        (0, _1.Injectable)()
    ], ServiceB);
    return ServiceB;
}());
// Container configuration
var container = new _1.Container();
container.register(TYPES.ServiceA, function () { return new ServiceA(); });
container.register(TYPES.ServiceB, function () {
    var serviceB = new ServiceB();
    container.injectDependencies(serviceB);
    return serviceB;
});
// Resolve service
var serviceB = container.resolve(TYPES.ServiceB);
serviceB.greet();
// It must be return "Hello from ServiceA"
