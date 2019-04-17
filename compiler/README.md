# Compiler

This is a compiler that will take a subset of JavaScript, parse into an Abstract Syntax Tree and feed into a code generator that will output bytecode.

Alternatively the Abstract Syntax Tree can be generated from other languages.

The pipeline would look something like this:

```

========= PARSER ==========             === CODEGEN ===
 JavaScript      Esprima     Abstract        Code
  Subset     ->   parse   ->  Syntax   ->  Generator  ->  Bytecode
                               Tree

```
