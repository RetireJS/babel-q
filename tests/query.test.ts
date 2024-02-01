import { query } from '../src/index';
import * as t from "@babel/types";
import * as babel from "@babel/core";


describe('testing index file', () => {
  const code = `function a(x) { 
    let b = 2;
    let c = 3;
    b = c;
    x.y = 25;
    return b + c;
  }`;

  const ast = babel.parseSync(code);
  test('dummy', () => {})

  
  test('Find FunctionExpression', () => {
    const nodes = query(ast!, "/FunctionDeclaration");
    const expectedNode = ast!.program.body[0] as t.FunctionDeclaration;
    expect(nodes.length).toEqual(1);
    expect(nodes[0]).toBeDefined();
    expect(nodes[0]).toEqual(expectedNode);
  });
  test('Find FunctionExpressions identifier', () => {
    const nodes = query(ast!, "/FunctionDeclaration/Identifier");
    const functionD = ast!.program.body[0] as t.FunctionDeclaration;
    const expectedNode1 = functionD.id as t.Identifier;
    const expectedNode2 = functionD.params[0] as t.Identifier;
    expect(nodes.length).toEqual(2);
    expect(nodes[0]).toBeDefined();
    expect(nodes[0]).toEqual(expectedNode1);
    expect(nodes[1]).toBeDefined();
    expect(nodes[1]).toEqual(expectedNode2);
  });

  test('Find identifiers below FunctionExpression', () => {
    const nodes = query(ast!, "/FunctionDeclaration//Identifier");
    expect(nodes.length).toEqual(10);
  });
  
  test('Find identifiers below FunctionExpression', () => {
    const nodes = query(ast!, "/FunctionDeclaration/:id");
    expect(nodes.length).toEqual(1);
    const identifier = nodes[0] as t.Identifier;
    expect(identifier.name).toEqual("a");
  });
  
  test('Find identifiers below FunctionExpression', () => {
    const nodes = query(ast!, "/FunctionDeclaration/:params/:name");
    expect(nodes.length).toEqual(1);
    expect(nodes[0]).toEqual("x");
  });
  
  
  test('Find named FunctionExpression', () => {
    const nodes = query(ast!, '/FunctionDeclaration[/:id/:name == "a"]');
    const expectedNode = ast!.program.body[0] as t.FunctionDeclaration;
    expect(nodes[0]).toBeDefined();
    expect(nodes[0]).toEqual(expectedNode);
  });
  
  test('Dont find wrongly named FunctionExpression', () => {
    const nodes = query(ast!, '/FunctionDeclaration[/:id/:name == "b"]');
    expect(nodes[0]).toEqual(undefined);
  });
  
  test('Find named FunctionExpression double declaration', () => {
    const nodes = query(ast!, '/FunctionDeclaration[/:id/:name == "b" || /:id/:name == "a"]');
    const expectedNode = ast!.program.body[0] as t.FunctionDeclaration;
    expect(nodes[0]).toBeDefined();
    expect(nodes[0]).toEqual(expectedNode);
  });

  test('Find named FunctionExpression triple declaration', () => {
    const nodes = query(ast!, '/FunctionDeclaration[/:id/:name == "b" || /:id/:name == "a" || /:id/:name == "c"]');
    const expectedNode = ast!.program.body[0] as t.FunctionDeclaration;
    expect(nodes[0]).toBeDefined();
    expect(nodes[0]).toEqual(expectedNode);
  });
  test('Find named FunctionExpression nested', () => {
    const nodes = query(ast!, '/FunctionDeclaration[/:id[/:name == "a"]]');
    const expectedNode = ast!.program.body[0] as t.FunctionDeclaration;
    expect(nodes[0]).toBeDefined();
    expect(nodes[0]).toEqual(expectedNode);
  });
  
  test('Dont find named FunctionExpression nested when wrong name', () => {
    const nodes = query(ast!, '/FunctionDeclaration[/:id[/:name == "b"]]');
    expect(nodes.length).toEqual(0);
  });
  
  test('Find named FunctionExpression as descendant', () => {
    const nodes = query(ast!, "/FunctionDeclaration//AssignmentExpression");
    expect(nodes.length).toEqual(2);
    const assignmentExpression = nodes[0] as t.AssignmentExpression;
    expect(assignmentExpression).toBeDefined();
    expect(assignmentExpression.left.type).toEqual("Identifier");
    expect(assignmentExpression.right.type).toEqual("Identifier");
  }); 

  test('Find named FunctionExpression as descendant', () => {
    const nodes = query(ast!, "//AssignmentExpression[/:left/:name == 'b']/:right/:name");
    expect(nodes.length).toEqual(1);
    expect(nodes[0]).toEqual("c");
  });
  
  
  test('Find named decalartion as descendant', () => {
    const nodes = query(ast!, "//VariableDeclarator[/:id/:name == 'c']/:init/:value");
    expect(nodes[0]).toEqual(3);
  });
  test('Find named decalartion as descendant', () => {
    const nodes = query(ast!, "//VariableDeclarator[/:id/:name == 'k']/:init/:value");
    expect(nodes.length).toEqual(0);
  });
  
  

  test("find assigment to parameter", () => {
    const nodes = query(ast!, "//FunctionDeclaration[/:params/:name == //AssignmentExpression/:left/:object/:name]");
    //const nodes = query(ast!, "//FunctionDeclaration//AssignmentExpression/:left/:object/:name");
    expect(nodes.length).toEqual(1);
  });
  test("find double function expression", () => {
    const ast = babel.parseSync(`function a() { function b() { let b = 2; } }`);
    const nodes = query(ast!, "//FunctionDeclaration[//VariableDeclarator//Identifier/:name == 'b']");
    expect(nodes.length).toEqual(2);
    expect(nodes[0] == nodes[1]).toEqual(false);
    //@ts-expect-error should be right type 
    expect(nodes[0].type).toEqual("FunctionDeclaration");
    //@ts-expect-error should be right type 
    expect(nodes[1].type).toEqual("FunctionDeclaration");
  });
  test("find assigment to named parameter", () => {
    const nodes = query(ast!, `//FunctionDeclaration[
      /:params/:name == //AssignmentExpression/:left/:object/:name && 
      //AssignmentExpression/:left/:property/:name == 'y'
    ]`);
    //const nodes = query(ast!, "//FunctionDeclaration//AssignmentExpression/:left/:object/:name");
    expect(nodes.length).toEqual(1);
  });

  test("find assigment to named parameter", () => {
    const nodes = query(ast!, 
    `//FunctionDeclaration//AssignmentExpression[
      ../../../:params/:name == /:left/:object/:name && 
      /:left/:property/:name == 'y'
    ]`);
    //const nodes = query(ast!, "//FunctionDeclaration//AssignmentExpression/:left/:object/:name");
    expect(nodes.length).toEqual(1);
  });

  test("find assigment to named parameter and get the value", () => {
    const nodes = query(ast!, `//FunctionDeclaration//AssignmentExpression[
      ../../../:params/:name == /:left/:object/:name && 
      /:left/:property/:name == 'y'
    ]/:right/:value`);
    expect(nodes).toEqual([25]);
  });
  test("Should work with wildcards", () => {
    const nodes = query(ast!, `//FunctionDeclaration//AssignmentExpression/*
    /Identifier/:name`);
    expect(nodes).toEqual(['x', 'y']);
  })
  test("should find assigment property of object bound to function parameter", () => {
    const nodes = query(ast!, `//FunctionDeclaration//AssignmentExpression[
      /:left/$:object == ../../../:params 
    ]/:right/:value`);
    expect(nodes).toEqual([25]);
  });
  test("should return binding", () => {
    const nodes = query(ast!, `//FunctionDeclaration//AssignmentExpression/:left/$:object`);
    expect(nodes[0]).toMatchObject({name: "x"});
  });
  test("should return binding value", () => {
    const nodes = query(ast!, `//FunctionDeclaration//AssignmentExpression/$:right/:init/:value`);
    expect(nodes).toEqual([3]);
  });
  test("should return named binding value", () => {
    const nodes = query(ast!, `//FunctionDeclaration//AssignmentExpression[/:left/:name == 'b']/$:right/:init/:value`);
    expect(nodes).toEqual([3]);
  });
  test("should NOT find assigment property of object bound to function parameter", () => {
    const nodes = query(ast!, `//FunctionDeclaration//AssignmentExpression[
      /:left/$:property == ../../../:params 
    ]/:right/:value`);
    expect(nodes).toEqual([]);
  });

  test("should only add double filtered nodes once", () => {
    const ast = babel.parseSync(`function a() { function b() { let c = 2; } }`);
    const nodes = query(ast!, `//FunctionDeclaration[/:id/:name == 'a']//FunctionDeclaration[/:id/:name == 'b']//VariableDeclaration//Identifier/:name`);
    expect(nodes).toEqual(['c']);
  })
});
