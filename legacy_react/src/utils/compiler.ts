import { Token, ASTNode, CompilerResult, CompilerError, ExecutionStep } from '../core/types';

export class Compiler {
  static compile(source: string): CompilerResult {
    const tokens = this.tokenize(source);
    const errors: CompilerError[] = [];

    // Check for lexical errors
    const lexicalErrors = tokens.filter(t => t.type === 'ERROR');
    lexicalErrors.forEach(token => {
      errors.push({
        type: 'lexical',
        message: `Invalid token: ${token.value}`,
        line: token.line,
        column: token.column,
      });
    });

    const validTokens = tokens.filter(t => t.type !== 'ERROR');
    let ast: ASTNode | null = null;
    let executionTrace: ExecutionStep[] = [];

    if (errors.length === 0) {
      try {
        ast = this.parse(validTokens);
        executionTrace = this.execute(ast);
      } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        errors.push({
          type: error.type || 'syntax',
          message: error.message || 'Parse error',
          line: error.line || 1,
          column: error.column || 1,
        });
      }
    }

    return {
      tokens: validTokens,
      ast,
      errors,
      executionTrace,
    };
  }

  private static tokenize(source: string): Token[] {
    const tokens: Token[] = [];
    const lines = source.split('\n');
    let line = 1;
    const column = 1;

    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      let currentColumn = 1;
      let currentToken = '';

      for (let j = 0; j < lineText.length; j++) {
        const char = lineText[j];

        if (/\s/.test(char)) {
          if (currentToken) {
            tokens.push(this.createToken(currentToken, line, currentColumn - currentToken.length));
            currentToken = '';
          }
          currentColumn++;
          continue;
        }

        if (/[+\-*/=(){};]/.test(char)) {
          if (currentToken) {
            tokens.push(this.createToken(currentToken, line, currentColumn - currentToken.length));
            currentToken = '';
          }
          tokens.push(this.createToken(char, line, currentColumn));
          currentColumn++;
          continue;
        }

        currentToken += char;
        currentColumn++;
      }

      if (currentToken) {
        tokens.push(this.createToken(currentToken, line, currentColumn - currentToken.length));
      }

      line++;
    }

    return tokens;
  }

  private static createToken(value: string, line: number, column: number): Token {
    // Keywords
    if (['let', 'if', 'else', 'while', 'print', 'return'].includes(value)) {
      return { type: 'KEYWORD', value, line, column };
    }

    // Numbers
    if (/^\d+$/.test(value)) {
      return { type: 'NUMBER', value, line, column };
    }

    // Operators
    if (['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>='].includes(value)) {
      return { type: 'OPERATOR', value, line, column };
    }

    // Delimiters
    if (['(', ')', '{', '}', ';'].includes(value)) {
      return { type: 'DELIMITER', value, line, column };
    }

    // Identifiers
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
      return { type: 'IDENTIFIER', value, line, column };
    }

    // Error token
    return { type: 'ERROR', value, line, column };
  }

  private static parse(tokens: Token[]): ASTNode {
    let index = 0;

    const parseExpression = (): ASTNode => {
      return parseAdditive();
    };

    const parseAdditive = (): ASTNode => {
      let left = parseMultiplicative();

      while (index < tokens.length && ['+', '-'].includes(tokens[index]?.value)) {
        const operator = tokens[index++].value;
        const right = parseMultiplicative();
        left = {
          type: 'BINARY_OP',
          value: operator,
          children: [left, right],
        };
      }

      return left;
    };

    const parseMultiplicative = (): ASTNode => {
      let left = parsePrimary();

      while (index < tokens.length && ['*', '/'].includes(tokens[index]?.value)) {
        const operator = tokens[index++].value;
        const right = parsePrimary();
        left = {
          type: 'BINARY_OP',
          value: operator,
          children: [left, right],
        };
      }

      return left;
    };

    const parsePrimary = (): ASTNode => {
      if (index >= tokens.length) {
        throw { type: 'syntax', message: 'Unexpected end of input', line: 1, column: 1 };
      }

      const token = tokens[index++];

      if (token.type === 'NUMBER') {
        return { type: 'NUMBER', value: parseFloat(token.value), line: token.line, column: token.column };
      }

      if (token.type === 'IDENTIFIER') {
        return { type: 'IDENTIFIER', value: token.value, line: token.line, column: token.column };
      }

      if (token.value === '(') {
        const expr = parseExpression();
        if (index >= tokens.length || tokens[index++].value !== ')') {
          throw { type: 'syntax', message: 'Expected )', line: token.line, column: token.column };
        }
        return expr;
      }

      throw { type: 'syntax', message: `Unexpected token: ${token.value}`, line: token.line, column: token.column };
    };

    const statements: ASTNode[] = [];
    while (index < tokens.length) {
      if (tokens[index].value === 'let' && tokens[index].type === 'KEYWORD') {
        index++; // consume 'let'
        const name = tokens[index++];
        if (name.type !== 'IDENTIFIER') {
          throw { type: 'syntax', message: 'Expected identifier', line: name.line, column: name.column };
        }
        if (tokens[index++].value !== '=') {
          throw { type: 'syntax', message: 'Expected =', line: tokens[index - 1].line, column: tokens[index - 1].column };
        }
        const expr = parseExpression();
        statements.push({
          type: 'ASSIGNMENT',
          value: name.value,
          children: [expr],
          line: name.line,
          column: name.column,
        });
        if (index < tokens.length && tokens[index].value === ';') {
          index++;
        }
      } else if (tokens[index].value === 'print' && tokens[index].type === 'KEYWORD') {
        index++; // consume 'print'
        const expr = parseExpression();
        statements.push({
          type: 'PRINT',
          children: [expr],
          line: tokens[index - 1].line,
          column: tokens[index - 1].column,
        });
        if (index < tokens.length && tokens[index].value === ';') {
          index++;
        }
      } else {
        const expr = parseExpression();
        statements.push(expr);
        if (index < tokens.length && tokens[index].value === ';') {
          index++;
        }
      }
    }

    return {
      type: 'PROGRAM',
      children: statements,
    };
  }

  private static execute(ast: ASTNode): ExecutionStep[] {
    const trace: ExecutionStep[] = [];
    const variables: Record<string, number> = {};
    let step = 0;

    const evaluate = (node: ASTNode): number => {
      step++;
      trace.push({
        step,
        instruction: this.nodeToString(node),
        state: { ...variables },
      });

      switch (node.type) {
        case 'NUMBER':
          return node.value as number;

        case 'IDENTIFIER':
          if (!(node.value as string in variables)) {
            throw { type: 'runtime', message: `Undefined variable: ${node.value}`, line: node.line || 1, column: node.column || 1 };
          }
          return variables[node.value as string];

        case 'BINARY_OP': {
          const left = evaluate(node.children![0]);
          const right = evaluate(node.children![1]);
          switch (node.value) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return right !== 0 ? left / right : (() => { throw { type: 'runtime', message: 'Division by zero', line: node.line || 1, column: node.column || 1 }; })();
            default: return 0;
          }
        }

        case 'ASSIGNMENT': {
          const value = evaluate(node.children![0]);
          variables[node.value as string] = value;
          return value;
        }

        case 'PRINT': {
          const printValue = evaluate(node.children![0]);
          trace.push({
            step: step + 0.5,
            instruction: `PRINT: ${printValue}`,
            state: { ...variables },
          });
          return printValue;
        }

        default:
          return 0;
      }
    };

    if (ast.type === 'PROGRAM' && ast.children) {
      for (const statement of ast.children) {
        evaluate(statement);
      }
    } else {
      evaluate(ast);
    }

    return trace;
  }

  private static nodeToString(node: ASTNode): string {
    switch (node.type) {
      case 'NUMBER':
        return String(node.value);
      case 'IDENTIFIER':
        return String(node.value);
      case 'BINARY_OP':
        return `(${this.nodeToString(node.children![0])} ${node.value} ${this.nodeToString(node.children![1])})`;
      case 'ASSIGNMENT':
        return `${node.value} = ${this.nodeToString(node.children![0])}`;
      case 'PRINT':
        return `print(${this.nodeToString(node.children![0])})`;
      case 'PROGRAM':
        return 'PROGRAM';
      default:
        return 'UNKNOWN';
    }
  }
}
