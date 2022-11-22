
#### How do you authenticate ? 

#### Difference between rest api and web api ? 
bot statless, one on Soap, other on http

#### What to do if the request is slow

#### What the feature of azure components

#### Main oop features
* Inheritance
In object-oriented programming, inheritance is the mechanism by which an object or class (referred to as a child) is created using the definition of another object or class (referred to as a parent).
* Encapsulation
Encapsulation is the process of binding data members and methods of a program together to do a specific job, without revealing unnecessary details.
* Polymorphism
Polymorphism is composed of two words - “poly” which means “many”, and “morph” which means “shapes”. Therefore Polymorphism refers to something that has many shapes.
In OOPs, Polymorphism refers to the process by which some code, data, method, or object behaves differently under different circumstances or contexts. Compile-time polymorphism and Run time polymorphism are the two types of polymorphisms in OOPs languages.
* Data Abstraction
Abstraction is the method of hiding unnecessary details from the necessary ones. It is one of the main features of OOPs


#### What is Compile time Polymorphism and how is it different from Runtime Polymorphism

#### What is the difference between overloading and overriding?
Overloading is a compile-time polymorphism feature in which an entity has multiple implementations with the same name. For example, Method overloading and Operator overloading.

Whereas Overriding is a runtime polymorphism feature in which an entity has the same name, but its implementation changes during execution. For example, Method overriding.
Image

#### Can you explain the SOLID design principles?
The SOLID design principles are a set of guidelines that aim to help developers create more robust and maintainable software. The acronym stands for 
S - Single Responsibility Principle (SRP): The single responsibility principle ensures that every class or module should be accountable and responsible for only one functionality. There should be one and only one reason for changing any class.
O - Open Closed Principle (OCP): Every class is open for extension but closed for modification. Here, we are allowed to extend the entities behaviour by not modifying anything in the existing source code.
L - Liskov Substitution Principle(LSP): LSP principle states that the objects can be replaced by the subtype instances without affecting the correctness of the program.
I - Interface Segregation Principle (ISP): The ISP principle states that we can use as many interfaces specific to the client’s requirements instead of creating only one general interface. Clients should not be forced to implement the functionalities that they do not require.
D - Dependency Inversion Principle: Here, the high-level modules should not be dependent on the lower level modules or concrete implementations. Instead, they should be dependent on the abstractions.

#### What are the types of design patterns in Java?
There are three types of design patterns. They are:

Creational Patterns: These patterns provide freedom of choice between creating objects by hiding the logic. The objects constructed are decoupled from the implemented system. Some of the examples of creational patterns are - Factory design pattern, Builder design, Prototype design, Singleton design, Abstract Factory design.
Structural Patterns: These patterns help in defining how the structures of classes and objects should be like for defining the composition between classes, interfaces and objects. Some of the examples of structural patterns are - Adaptor design, Facade design, Decorator design, proxy design etc.
Behavioural Patterns: These patterns help to define how the objects should communicate and interact with one another. Some of the examples of behavioural patterns are - Command pattern, Iterator pattern, Observer pattern, Strategy pattern, etc.

https://www.interviewbit.com/design-patterns-interview-questions/
##### Factory Design Pattern : 
Creational Design
Let’s consider 3 classes Square, Rectangle and Triangle. 
##### Adapter Design Pattern : 
Structural design
Let us consider that we have a MediaPlayer Interface which is implemented by the AudioPlayer class. The AudioPlayer can play mp3 format by default. Consider another interface AdvancedPlayer that is being implemented by MP4Player class that plays mp4 formats and WAVPlayer that plays wav formats.

##### Proxy Design Pattern: 
structural design

##### What is middleware
It is software that is injected into the application pipeline to handle requests and responses. They are just like chained to each other and form as a pipeline. The incoming requests are passed through this pipeline where all middleware is configured, and middleware can perform some action on the request before passing it to the next middleware. Same as for the responses, they are also passing through the middleware but in reverse order.

#### How to specify the service life for a registered service that is added as a dependency?
There are three types of lifetimes.
###### Singleton
ASP.NET Core will create and share a single instance of the service through the application life. The service can be added as a singleton using the AddSingleton method of IServiceCollection. ASP.NET Core creates a service instance at the time of registration and subsequence requests use this service instance. Here, we do not require to implement the Singleton design pattern and single instance maintained by the ASP.NET Core itself.

###### Transient
ASP.NET Core will create and share an instance of the service every time to the application </b> when we ask for it.<b> The service can be added as Transient using the AddTransient method of IServiceCollection. This lifetime can be used in stateless service. It is a way to add lightweight service.

###### Scoped
ASP.NET Core will create and share an instance of the service <b>per request to the application.</b> It means that a single instance of service is available per request. It will create a new instance in the new request. The service can be added as scoped using an AddScoped method of IServiceCollection. We need to take care while the service registered via Scoped in middleware and inject the service in the Invoke or InvokeAsync methods. If we inject dependency via the constructor, it behaves like a singleton object.