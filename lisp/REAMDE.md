# Implementing LISP


http://kjetilvalle.com/posts/original-lisp.html

The basic semantics

When evaluating an s-expression e, the following rules apply.

    If e is an atom its value is looked up in the environment.
    Otherwise, the expression is a list like (<e0> <e1> … <en>), which is evaluated as a function application. How this is handled depends on the first element of the list, e0.
        If e0 is the name of one of the builtin (axiomatic) forms, it is evaluated as described below.
        If e0 is any other atom, its value is looked up. A new list, with the value of e0 replacing the first element is then evaluated.
        If e0 is not an atom, but a list of the form (lambda (<a1> … <an>) <body>), then e1 through en is first evaluated. Then body is evaluated in an environment where each of a1 through an points to the value of the corresponding en. This constitutes a call to an anonymous function (i.e. a lambda function).
        If e0 is of form (label <name> <lambda>) where lambda is a lambda expression like the one above, then a new list with e0 replaced by just the lambda is constructed. This list is then evaluated in an environment where name points to e. The label notation is how we solve the problem of defining recursive functions.

The axiomatic forms

The axiomatic forms are the basis on which the rest of the language rests. They behave as follows:

(quote e)
    returns e without evaluating it first.
(atom e)
    evaluates e and returns the atom t if the resulting value is an atom, otherwise f is returned. (Since we have no boolean type in our language, these two atoms are treated as true and false, respectively.)
(eq e1 e2)
    evaluates to t if both e1 and e2 evaluates to the same atom, otherwise f.
(car e)
    evaluates e, which is expected to give a list, and returns the first element of this list.
(cdr e)
    is the opposite of car. It returns all but the first element of the list gotten by evaluating e. If the list only holds only one element, cdr instead returns the atom nil.
(cons e1 e2)
    evaluates both e1 and e2, and returns a list constructed with the value of e1 as the first element and the value of e2 as the rest. If e2 evaluates to the atom nil, the list (e1) is returned.
(cond (p1 e1) … (pn en))
    is the conditional operator. It will evaluate predicates p1 to pn in order, until one of them evaluates to t, at which time it will evaluate the corresponding en and return its value.

The evaluation rules above are, surprisingly, all we need to implement Lisp. In addition, however, I'd like to include another form that isn't explicitly described by McCarthy, but which is included in Graham's article. It could strictly speaking be replaced by doing a lot of nested labels but, but this would make things a lot less readable.

(defun name (a1 … an) <body>)
    is a way to define functions and then later use them outside of the define expression. It does this by adding a new binding to the environment it is itself evluated in: name→(lambda (a1 … an) <body>). 
