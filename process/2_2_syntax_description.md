# Syntax description

This part should be first by i was 
really want to write some code to have 
real check of TypeScript and tests configuration.

Anyway previous part was pretty easy and abstract so
i can describe future language here. Let's call it JF (just fun)
and create files with extension `*.jf` 

Here is a listing with examples:

```jf
# comment
# Other comment will be ignored
print("some text"); # function call
print(3 < 1 * 2 / 13); # passing epression to the function call

factorial = f(x) { # functions is a data too, we can declare function by `f` keyword
    if x <= 1 then
        1
    else
        n * factorial(x - 1)
};

if (1 > 2) {
    print("Really?");
} else {
    print("Right");
}
    
print(factorial(12));

sum-of-2and2 = {
    12 + 13;
    2 + 2 # can be without last semicolumn
};
```

I general everything are expressions, without statements.
You can create functions and definitions, in this languages we
have no variables because it's immutable language.
We a using `;` to separate expressions.
The curly brackets `{` and `}` will create expressions sequence.

You even can create one-line function:

```jf
less = f(a, b) a < b;
func = f(x, y) if (less(x, y)) print("X less than Y") else print("More");
```

Maybe it's not a final version so it can be changed.

In general everything will work like on the diagram
```
     ┌───────────┐          ┌───────────┐          ┌──────┐     
     │InputStream│          │TokenStream│          │Parser│     
     └─────┬─────┘          └─────┬─────┘          └──┬───┘     
   code    │                      │                   │         
 ─────────>│                      │                   │         
           │                      │                   │         
           │       symbols        │                   │         
           │─────────────────────>│                   │         
           │                      │                   │         
           │                      │      tokens       │         
           │                      │──────────────────>│         
           │                      │                   │         
           │                      │                   │   AST   
           │                      │                   │ ───────>
     ┌─────┴─────┐          ┌─────┴─────┐          ┌──┴───┐     
     │InputStream│          │TokenStream│          │Parser│     
     └───────────┘          └───────────┘          └──────┘     
```
![image](http:#www.plantuml.com/plantuml/proxy?src=./diagrams/2_2_basic.puml)

At the start we have only source codes, then InputStream
will read it by symbol and pass to the TokenStream.
TokenStream will decide what to do with symbols and generate tokens,
for example if TokenStream receive `#` it will ignore rest of string.
Then tokens list should be processed by Parser and as a result will
be created AST (Abstract Syntax Tree).
AST is the most important think, it's a code representation 
to processed in any way. You can optimize it, transform, compile or interpret.

So in general case it can be like

```
     ┌───────────┐          ┌───────────┐          ┌──────┐          ┌───────────┐          ┌────────┐          ┌───────────┐
     │InputStream│          │TokenStream│          │Parser│          │Transformer│          │Compiler│          │Interpreter│
     └─────┬─────┘          └─────┬─────┘          └──┬───┘          └─────┬─────┘          └───┬────┘          └─────┬─────┘
   code    │                      │                   │                    │                    │                     │      
 ─────────>│                      │                   │                    │                    │                     │      
           │                      │                   │                    │                    │                     │      
           │       symbols        │                   │                    │                    │                     │      
           │─────────────────────>│                   │                    │                    │                     │      
           │                      │                   │                    │                    │                     │      
           │                      │      tokens       │                    │                    │                     │      
           │                      │──────────────────>│                    │                    │                     │      
           │                      │                   │                    │                    │                     │      
           │                      │                   │        AST         │                    │                     │      
           │                      │                   │ ──────────────────>│                    │                     │      
           │                      │                   │                    │                    │                     │      
           │                      │                   │                    │        AST         │                     │      
           │                      │                   │                    │───────────────────>│                     │      
           │                      │                   │                    │                    │                     │      
           │                      │                   │                    │                   AST                    │      
           │                      │                   │                    │─────────────────────────────────────────>│      
     ┌─────┴─────┐          ┌─────┴─────┐          ┌──┴───┐          ┌─────┴─────┐          ┌───┴────┐          ┌─────┴─────┐
     │InputStream│          │TokenStream│          │Parser│          │Transformer│          │Compiler│          │Interpreter│
     └───────────┘          └───────────┘          └──────┘          └───────────┘          └────────┘          └───────────┘
```

Here is described one-file processing, but if we want to
create language with possibility to import files 
we need to add `Composer` somewhere between `InputStream`, `TokenStream`
and `Parser`. I will leave it to the "better times"=).

In the next time we will create `TokenStream`. See you. 
