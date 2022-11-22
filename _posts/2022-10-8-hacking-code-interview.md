
#### You should wirte on paper first, even a brut force algorithm 

### Technical questions 
Five algorithms approaches
- Examplify: the clock example 
- Pattern matching: rotated sorted array
- Simplify and generalize: we solve new simplified version of the problem; like ransom note ( sentence from magazine)
- Base case and build: we first solve the problem for base case(eg n=1) then we solve for n=2, so you build algorithm compute result of N if we know N-1, like permutation of a string 
- Data structure brainstorm: en example of keep track of the median with extendable array



##### optimize, and solve technique 1 : look for BUD

What BUD means ? 
Buttlenecks, Unnecessary work, Duplicate work
a^3 + b^3 == c^3 + d^3 is a good example, page 68

##### optimize, and solve technique 2 : DIY
given small string s, big string b, find all permutations of s in b 
s: abbc 
b: cbabadcbbabbcbabaabccbabc

##### Optimize & Solve Technique 3: Simplify and Generalize 
ransom note

##### Optimize & Solve Technique #4: Base Case and Build 
we solve the problem first for a base case (e.g., n = 1) and then try to build up 
from there. When we get to more complex/interesting cases (often n = 3 or n = 4)

Design an algorithm to print all permutations of a string. For simplicity, assume all characters are unique.
Consider a test string abcdefg. 
Case "a" --> {"a"} 
Case "ab" - -> {"ab", "ba"} 
Case "abc" --> ?
P("abc") = insert "c" into all locations of all strings in P("ab") 
P("abc") = insert "c" into all locations of all strings in {"ab","ba"} 
P("abc") = merge({"cab", ""acb", "abc"}, {"cba", abca", bac"})
P("abc") = {"cab", "acb", "abc", "cba", "bca", bac"}

##### Optimize & Solve Technique #5: Data Structure Brainstorm 


#### Examples
Page 90, 1.2: Given two strings, write a method to decide if one is a permutation of the 
other.

is it case sensitive ? is whitespace is significant ? 


---

### This is a header

#### Some T-SQL Code

```tsql
SELECT This, [Is], A, Code, Block -- Using SSMS style syntax highlighting
    , REVERSE('abc')
FROM dbo.SomeTable s
    CROSS JOIN dbo.OtherTable o;
```

#### Some PowerShell Code

```powershell
Write-Host "This is a powershell Code block";

# There are many other languages you can use, but the style has to be loaded first

ForEach ($thing in $things) {
    Write-Output "It highlights it using the GitHub style"
}
```
