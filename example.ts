import { Container, Inject, Injectable } from ".";

const TYPES = {
  ServiceA: Symbol('ServiceA'),
  ServiceB: Symbol('ServiceB')
}

@Injectable()
class ServiceA {
  sayHello() {
    console.log('Hello from ServiceA');
  }
}

@Injectable()
class ServiceB {
  @Inject(TYPES.ServiceA)
  private serviceA!: ServiceA;

  greet() {
    this.serviceA.sayHello();
  }
}

// Container configuration
const container = new Container();
container.register<ServiceA>(TYPES.ServiceA, () => new ServiceA());
container.register<ServiceB>(TYPES.ServiceB, () => {
  const serviceB = new ServiceB();
  container.injectDependencies(serviceB);
  return serviceB;
});

// Resolve service
const serviceB = container.resolve<ServiceB>(TYPES.ServiceB);
serviceB.greet();
// It must be return "Hello from ServiceA"