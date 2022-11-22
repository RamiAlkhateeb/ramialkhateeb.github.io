

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