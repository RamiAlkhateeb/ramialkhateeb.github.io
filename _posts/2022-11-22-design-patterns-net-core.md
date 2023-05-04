

#### Single Responsibility Principle p4
Imagine you have a journal of your most intimate thoughts
<br>
Now, you could add functionality for adding an entry to the journal
<br>
Now, suppose you decide to make the journal persist by saving it to a file. You add 
this code to the Journal class, We therefore state that persistence is a separate concern,
<br>
And this is precisely what we mean by Single Responsibility: each class has only one 
responsibility and therefore has only one reason to change. Journal would need to 
change only if there’s something more that needs to be done with respect to in-memory 
storage of entries; for example, you might want each entry prefixed by a timestamp, so 
you would change the Add() method to do exactly that. On the other hand, if you wanted 
to change the persistence mechanic, this would be changed in PersistenceManager.

#### Open-Closed Principle
Suppose we have an (entirely hypothetical) range of products in a database. Each 
product has a color and size
<br>
Now, we want to provide certain filtering capabilities for a given set of products. 
We make a ProductFilter service class. To support filtering products by color, we 
implement it as follows

<br> 
![alt text](https://github.com/RamiAlkhateeb/ramialkhateeb.github.io/blob/main/assets/OCP.png?raw=true)


#### Liskov Substitution Principle
So the problem here is that although UseIt() is happy to take any Rectangle class, 
it fails to take a Square because the behaviors inside Square break its operation. So, 
how would you fix this issue? Well, one approach would be to simply deprecate the 
Square class and start treating some Rectangles as special case. For example, you could 
introduce an IsSquare property.

#### Interface Segregation Principle

the idea here is to segregate parts of a complicated interface into 
separate interfaces so as to avoid forcing clients to implement functionality that they do 
not really need. Anytime when you write a plug-in for some complicated application and 
you’re given an interface with 20 confusing methods to implement with various no-ops 
and return nulls, more likely than not the API authors have violated the ISP

#### Dependency Inversion Principle
a. High-level modules should not depend on low-level modules. Both 
should depend on abstractions
b. Abstractions should not depend on details. Details should depend 
on abstractions.


### Creational Patterns
#### Builder
Let’s imagine that we are building a component that renders web pages. A page might 
consist of just a single paragraph
<br>
The Builder pattern simply tries to outsource the piecewise construction of an object into a separate class. 

<br>

##### Composite Builder P 43
There are two aspects to Person: their address and employment information. What 
if we want to have separate builders for each – how can we provide the most convenient 
API? To do this, we’ll construct a composite builder. This construction is not trivial, 
so pay attention: even though we want two separate builders for job and address 
information, we’ll spawn no fewer than three distinct classes.

<br>

![alt text](https://github.com/RamiAlkhateeb/ramialkhateeb.github.io/blob/main/assets/composite.png?raw=true)


<br>

#### Builder Parameter

#### Factory
basicly, when creating a Point with with two corrdinates systems, you can use Factory


### Prototype
Deep vs. Shallow Copying

### Singleton


## Structural Patterns
### Adapter

Drawing a vector using pixel interface