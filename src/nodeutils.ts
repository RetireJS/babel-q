import { ESTree } from "meriyah";
import { ASTNode, NodePath } from ".";
import { PrimitiveValue } from ".";

export const isNode = (candidate: unknown) : candidate is ASTNode => {
  return typeof candidate === "object" && candidate != null && "type" in candidate;
}

export const isNodePath = (candidate: unknown) : candidate is NodePath => {
  return typeof candidate === "object" && candidate != null && "node" in candidate;
}

export const isLiteral = (candidate: unknown) : candidate is ESTree.Literal => {
  return isNode(candidate) && candidate.type === "Literal";
}

export const isPrimitive = (value: unknown) : value is PrimitiveValue => {
  return typeof value == "string" || typeof value == "number" || typeof value == "boolean";
}

export const isUpdateExpression = (value: unknown) : value is ESTree.UpdateExpression => {
  return isNode(value) && value.type === "UpdateExpression";
}

export const isAssignmentExpression = (node: ESTree.Node): node is ESTree.AssignmentExpression => {
  return node.type === "AssignmentExpression";
}

export const isMemberExpression = (node: ESTree.Node): node is ESTree.MemberExpression => {
  return node.type === "MemberExpression";
}

export const isIdentifier = (node: ESTree.Node): node is ESTree.Identifier => {
  return node.type === "Identifier";
}

export const isFunctionDeclaration = (node: ESTree.Node): node is ESTree.FunctionDeclaration => {
  return node.type === "FunctionDeclaration";
}
export const isFunctionExpression = (node: ESTree.Node): node is ESTree.FunctionExpression => {
  return node.type === "FunctionExpression";
}

export const isVariableDeclarator = (node: ESTree.Node): node is ESTree.VariableDeclarator => {
  return node.type === "VariableDeclarator";
}
export const isVariableDeclaration = (node: ESTree.Node): node is ESTree.VariableDeclaration => {
  return node.type === "VariableDeclaration";
}
export const isBinding = (node: ESTree.Node, parentNode: ESTree.Node, grandParentNode: ESTree.Node | undefined): boolean => {
  if (
    grandParentNode &&
    node.type === "Identifier" &&
    parentNode.type === "Property" &&
    grandParentNode.type === "ObjectExpression"
  ) {
    return false;
  }

  const keys: string[] = bindingIdentifiersKeys[parentNode.type] ?? [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val =
      // @ts-expect-error key must present in parent
      parentNode[key];
    if (Array.isArray(val)) {
      if (val.indexOf(node) >= 0) return true;
    } else {
      if (val === node) return true;
    }
  }

  return false;
}


const bindingIdentifiersKeys: Record<string, string[]> = {
  DeclareClass: ["id"],
  DeclareFunction: ["id"],
  DeclareModule: ["id"],
  DeclareVariable: ["id"],
  DeclareInterface: ["id"],
  DeclareTypeAlias: ["id"],
  DeclareOpaqueType: ["id"],
  InterfaceDeclaration: ["id"],
  TypeAlias: ["id"],
  OpaqueType: ["id"],

  CatchClause: ["param"],
  LabeledStatement: ["label"],
  UnaryExpression: ["argument"],
  AssignmentExpression: ["left"],

  ImportSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportDefaultSpecifier: ["local"],
  ImportDeclaration: ["specifiers"],

  ExportSpecifier: ["exported"],
  ExportNamespaceSpecifier: ["exported"],
  ExportDefaultSpecifier: ["exported"],

  FunctionDeclaration: ["id", "params"],
  FunctionExpression: ["id", "params"],
  ArrowFunctionExpression: ["params"],
  ObjectMethod: ["params"],
  ClassMethod: ["params"],
  ClassPrivateMethod: ["params"],

  ForInStatement: ["left"],
  ForOfStatement: ["left"],

  ClassDeclaration: ["id"],
  ClassExpression: ["id"],

  RestElement: ["argument"],
  UpdateExpression: ["argument"],

  ObjectProperty: ["value"],

  AssignmentPattern: ["left"],
  ArrayPattern: ["elements"],
  ObjectPattern: ["properties"],

  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id"],
};

export const VISITOR_KEYS: Record<ESTree.Node["type"], string[]> = {
  ArrayExpression: ["elements"],
  ArrayPattern: ["elements"],
  ArrowFunctionExpression: ["params", "body"],
  AssignmentExpression: ["left", "right"],
  AssignmentPattern: ["left", "right"],
  AwaitExpression: ["argument"],
  BinaryExpression: ["left", "right"],
  BlockStatement: ["body"],
  BreakStatement: [],
  CallExpression: ["callee", "arguments"],
  CatchClause: ["param", "body"],
  ChainExpression: ["expression"],
  ClassBody: ["body"],
  ClassDeclaration: ["id", "superClass", "body"],
  ClassExpression: ["id", "superClass", "body"],
  ConditionalExpression: ["test", "consequent", "alternate"],
  ContinueStatement: [],
  DebuggerStatement: [],
  DoWhileStatement: ["body", "test"],
  EmptyStatement: [],
  ExportAllDeclaration: ["source"],
  ExportDefaultDeclaration: ["declaration"],
  ExportNamedDeclaration: ["declaration", "specifiers", "source"],
  ExportSpecifier: ["local", "exported"],
  ExpressionStatement: ["expression"],
  ForInStatement: ["left", "right", "body"],
  ForOfStatement: ["left", "right", "body"],
  ForStatement: ["init", "test", "update", "body"],
  FunctionDeclaration: ["id", "params", "body"],
  FunctionExpression: ["id", "params", "body"],
  Identifier: [],
  IfStatement: ["test", "consequent", "alternate"],
  ImportAttribute: ["key", "value"],
  ImportDeclaration: ["specifiers", "source"],
  ImportDefaultSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportSpecifier: ["local", "imported"],
  LabeledStatement: ["label", "body"],
  Literal: [],
  LogicalExpression: ["left", "right"],
  MemberExpression: ["object", "property"],
  MetaProperty: ["meta", "property"],
  MethodDefinition: ["key", "value"],
  NewExpression: ["callee", "arguments"],
  ObjectExpression: ["properties"],
  ObjectPattern: ["properties"],
  Program: ["body"],
  Property: ["key", "value"],
  RestElement: ["argument"],
  ReturnStatement: ["argument"],
  SequenceExpression: ["expressions"],
  SpreadElement: ["argument"],
  Super: [],
  SwitchCase: ["test", "consequent"],
  SwitchStatement: ["discriminant", "cases"],
  TaggedTemplateExpression: ["tag", "quasi"],
  TemplateElement: [],
  TemplateLiteral: ["quasis", "expressions"],
  ThisExpression: [],
  ThrowStatement: ["argument"],
  TryStatement: ["block", "handler", "finalizer"],
  UnaryExpression: ["argument"],
  UpdateExpression: ["argument"],
  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id", "init"],
  WhileStatement: ["test", "body"],
  WithStatement: ["object", "body"],
  YieldExpression: ["argument"],
  ImportExpression: ["source"],
  Decorator: ["expression"],
  PropertyDefinition: ["key", "value"],
  Import: ["source"],
  JSXAttribute: ["name", "value"],
  JSXNamespacedName: ["namespace", "name"],
  JSXElement: ["openingElement", "closingElement", "children"],
  JSXClosingElement: ["name"],
  JSXOpeningElement: ["name", "attributes"],
  JSXFragment: ["openingFragment", "closingFragment", "children"],
  JSXOpeningFragment: [],
  JSXClosingFragment: [],
  JSXText: [],
  JSXExpressionContainer: ["expression"],
  JSXSpreadChild: ["expression"],
  JSXEmptyExpression: [],
  JSXSpreadAttribute: ["argument"],
  JSXIdentifier: [],
  PrivateIdentifier: [],
  JSXMemberExpression: ["object", "property"],
  ParenthesizedExpression: ["expression"],
  StaticBlock: ["body"],
};



function isBlockStatement(node: ESTree.Node): node is ESTree.BlockStatement { return node.type === "BlockStatement"; }

function isFunction(node: ESTree.Node): boolean {
  return node.type === "FunctionDeclaration" || node.type === "FunctionExpression";
}
function isCatchClause(node: ESTree.Node): node is ESTree.CatchClause { return node.type === "CatchClause"; }

function isPattern(node: ESTree.Node): boolean {
  switch (node.type) {
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
      return true;
  }
  return false;
}

export function isScope(node: ESTree.Node, parentNode: ESTree.Node): boolean {
  if (isBlockStatement(node) && (isFunction(parentNode) || isCatchClause(parentNode))) {
    return false;
  }
  if (isPattern(node) && (isFunction(parentNode) || isCatchClause(parentNode))) {
    return true;
  }

  return isFunctionDeclaration(parentNode) || isFunctionExpression(parentNode) || isScopable(node);
}

export function isScopable(node: ESTree.Node): boolean {
  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "MethodDefinition":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ForOfStatement":
    case "StaticBlock":
      return true;
  }
  return false;
}

export function isExportSpecifier(node: ESTree.Node): node is ESTree.ExportSpecifier {
  return node.type === "ExportSpecifier";
}


