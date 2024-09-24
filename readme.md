<img src="./.images/EF850BA7-3E51-4C63-8923-4466F393B21A.webp" alt="Injexius" width="100%">

# Injexius

A simple dependency injection container and inversion of control library for TypeScript.

</br>

### Installation

```bash
> npm install injexius
> yarn add injexius
> pnpm add injexius
```

</br>

### Usage

U can use symbols or strings as keys of the container.

</br>

##### Simple container

```typescript
import { Container } from "injexius";

const container = new Container();

container.registerSingleton("logger", () => console);
container.register("database", () => new Database());
container.register(
  "userRepository",
  () => new UserRepository(container.resolve("database"))
);

const userRepository = container.resolve("userRepository");
```

</br>

##### Inversion of control

```typescript
import { Container, Inject, Injectable } from "injexius";

const TYPES = {
  ServiceA: Symbol("ServiceA"),
  ServiceB: Symbol("ServiceB"),
};

@Injectable()
class ServiceA {
  sayHello() {
    console.log("Hello from ServiceA");
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
```

</br>

### License

MIT
