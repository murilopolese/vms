function evaluate(exp, env) {
  if (is_atom(exp)) {
    if (exp[0] === `'`) {
      return evaluate(['quote', exp.slice(1)], env)
    } else {
      return lookup(exp, env)
    }
  } else if (is_atom(exp[0])) {
    switch(exp[0]) {
      case 'quote': return quote(exp, env); break;
      case 'atom': return atom(exp, env); break;
      case 'eq': return eq(exp, env); break;
      case 'car': return car(exp, env); break;
      case 'cdr': return cdr(exp, env); break;
      case 'cons': return cons(exp, env); break;
      case 'cond': return cond(exp, env); break;
      case 'defun': return defun(exp, env); break;

      case 'selectAll': return selectAll(exp, env); break;
      case 'selectOne': return selectOne(exp, env); break;
      case 'setStyle': return setStyle(exp, env); break;
      case 'setInterval': return _setInterval(exp, env); break;
      case 'setTimeout': return _setTimeout(exp, env); break;

      default: return call_named_fn(exp, env);
    }
  } else if (exp[0][0] === "lambda") {
    return apply(exp, env)
  } else if (exp[0][0] === "label") {
    return label(exp, env)
  }
}

function parse(program) {
  return parser(tokenizer(rules))(program)
}

function unparse() {
  let ast = ['something', ['something', 'else', ['and', ['more']]]]

}

function interpret(program, env) {
  let ast = parse(program)
  let result = evaluate(ast, env || [])
  return JSON.stringify(result)
}

function zip() {
    // https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
    var args = [].slice.call(arguments);
    var shortest = args.length==0 ? [] : args.reduce(function(a,b){
        return a.length<b.length ? a : b
    });

    return shortest.map(function(_,i){
        return args.map(function(array){return array[i]})
    });
}

function is_atom(exp) {
  return typeof exp === 'string'
}

function lookup(atom, env) {
  let entry = env.find(([x, value]) => x === atom)
  if (entry) {
    let [x, value] = entry
    return value
  }
}

function quote(exp) {
  // (quote e1)
  return exp[1]
}

function atom(exp, env) {
  // (atom e1)
  let val = evaluate(exp[1], env)
  return is_atom(val) ? 't' : 'f'
}

function eq(exp, env) {
  // (eq e1 e2)
  let v1 = evaluate(exp[1], env)
  let v2 = evaluate(exp[2], env)
  return (is_atom(v1) && v1 == v2) ? 't' : 'f'
}

function car(exp, env) {
  // (car e1)
  return evaluate(exp[1], env)[0]
}

function cdr(exp, env) {
  // (cdr e1)
  let lst = evaluate(exp[1], env)
  return (lst.length === 1) ? 'nil' : lst.slice(1)
}

function cons(exp, env) {
  // (cons e1 e2)
  let rest = evaluate(exp[2], env)
  if (rest === 'nil') {
    rest = []
  }
  return [ evaluate(exp[1], env) ].concat(rest)
}

function cond(exp, env) {
  let entries = exp.slice(1)
  for (let i = 0; i < entries.length; i++) {
    let [ p, e ] = entries[i]
    if (evaluate(p, env) === 't') {
      return evaluate(e, env)
    }
  }
}

function defun(exp, env) {
  // (defun my-fun (a1 ...) body)
  let [ name, params, body ] = exp.slice(1)
  let label = [ "label", name, [ "lambda", params, body ] ]
  env.push([name, label])
  return name
}

function call_named_fn(exp, env) {
  // (my-fun e1 …)
  let fn = lookup(exp[0], env)
  return evaluate([fn].concat(exp.slice(1)), env)
}

function apply(exp, env) {
  // ((lambda (a1 …) body) e1 …)
  let fn = exp[0]
  let args = exp.slice(1)
  let [ _, params, body ] = fn
  let evaluated_args = args.map((e) => evaluate(e, env))
  let new_env = zip(params, evaluated_args)
  new_env = new_env.concat(env)
  return evaluate(body, new_env)
}

function label(e, a) {
  // ((label name (lambda (p1 …) body)) arg1 …)
  [ _, f, fn ] = e[0]
  args = e.slice(1)
  return evaluate([fn].concat(args), [(f, e[0])].concat(a))
}

// =====

function selectAll(exp, env) {
  // (selectAll cssQuery)
  return Array.from(
    document.querySelectorAll(
      evaluate(exp[1], env)
    )
  )
}

function selectOne(exp, env) {
  // (selectOne cssQuery)
  return document.querySelector(
    evaluate(exp[1], env)
  )
}

function setStyle(exp, env) {
  // (selectAll select (key value))
  let [ key, value ] = exp[2]
  let k = evaluate(key, env)
  let v = evaluate(value, env)
  if (v) {
    v = v.replace(/_/g, ' ')
  }
  switch(exp[1][0]) {
    case 'selectAll':
      let elements = evaluate(exp[1], env)
      elements.forEach((el) => {
        el.style[k] = v
      })
      return elements.map(el => el.id || el.tagName)
    break;
    case 'selectOne':
      let el = evaluate(exp[1], env)
      el.style[k] = v
      return el.id || el.tagName
    break;
  }
}

function _setInterval(exp, env) {
  // (setInterval lambda interval_ms)
  return setInterval(() => {
    evaluate(exp[1], env)
  }, exp[2])
}

function _setTimeout(exp, env) {
  // (setTimeout lambda interval_ms)
  return setTimeout(() => {
    evaluate(exp[1], env)
  }, exp[2])
}
