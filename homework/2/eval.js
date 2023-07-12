const acorn = require("acorn");

function evaluate(node, env) {
  switch (node.type) {
    // TODO: 补全作业代码
    case "Program":
      return evaluate(node.body, env);
    case "Literal":
      return node.value;
    case "Identifier":
      return node.name in env ? env[node.name] : node.name;
    case "BinaryExpression":
      switch (node.operator) {
        case "+":
          return evaluate(node.left, env) + evaluate(node.right, env);
        case "-":
          return evaluate(node.left, env) - evaluate(node.right, env);
        case "*":
          return evaluate(node.left, env) * evaluate(node.right, env);
        case "/":
          return evaluate(node.left, env) / evaluate(node.right, env);
        case "<=":
          return evaluate(node.left, env) <= evaluate(node.right, env);
      }
    case "ExpressionStatement":
      return evaluate(node.expression, env);
    case "LogicalExpression":
      switch (node.operator) {
        case "&&":
          return evaluate(node.left, env) && evaluate(node.right, env);
        case "||":
          return evaluate(node.left, env) || evaluate(node.right, env);
      }
    case "CallExpression":
      const callee = evaluate(node.callee, env);
      const args = node.arguments.map((arg) => evaluate(arg, env));
      return callee(...args);
    case "ConditionalExpression":
      if (evaluate(node.test, env)) {
        return evaluate(node.consequent, env);
      } else {
        return evaluate(node.alternate, env);
      }
    case "ObjectExpression":
      return node.properties.reduce(
        (acc, property) => ({
          ...acc,
          [property.key.name]: evaluate(property.value, env),
        }),
        {}
      );
    case "ArrayExpression":
      return node.elements.map((element) => evaluate(element, env));
    case "ArrowFunctionExpression":
      return (...args) =>
        evaluate(node.body, {
          ...env,
          ...node.params.reduce(
            (acc, param, index) => ({ ...acc, [param.name]: args[index] }),
            {}
          ),
        });
    case "SequenceExpression":
      return node.expressions.reduce(
        (acc, expression) => evaluate(expression, env),
        undefined
      );
    case "AssignmentExpression":
      let left = evaluate(node.left, env);
      const right = evaluate(node.right, env);
      return (left = right);
  }

  throw new Error(
    `Unsupported Syntax ${node.type} at Location ${node.start}:${node.end}`
  );
}

function customerEval(code, env = {}) {
  const node = acorn.parseExpressionAt(code, 0, {
    ecmaVersion: 6,
  });
  return evaluate(node, env);
}

module.exports = customerEval;
