// Fully AI Generated Code


const CONSTANTS: Readonly<Record<string, number>> = {
  pi: Math.PI,
  e: Math.E,
};

const UNARY_FUNCTIONS: Readonly<Record<string, (x: number) => number>> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  exp: Math.exp,
  ln: Math.log,
  log: (x) => Math.log10(x),
};

const BINARY_FUNCTIONS: Readonly<Record<string, (a: number, b: number) => number>> = {
  pow: Math.pow,
  max: Math.max,
  min: Math.min,
  atan2: Math.atan2,
};

type TokenType = "number" | "ident" | "op" | "eof";

interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

function tokenize(source: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      const start = i;
      let hasDot = ch === ".";
      i++;
      while (i < source.length) {
        const c = source[i];
        if (c === ".") {
          if (hasDot) return null;
          hasDot = true;
        } else if (!/[0-9]/.test(c)) {
          break;
        }
        i++;
      }
      const raw = source.slice(start, i);
      if (raw === "." || raw.endsWith(".")) return null;
      tokens.push({ type: "number", value: raw, pos: start });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      const start = i;
      i++;
      while (i < source.length && /[a-zA-Z0-9_]/.test(source[i])) i++;
      tokens.push({
        type: "ident",
        value: source.slice(start, i).toLowerCase(),
        pos: start,
      });
      continue;
    }

    if ("+-*/^(),".includes(ch)) {
      tokens.push({ type: "op", value: ch, pos: i });
      i++;
      continue;
    }

    return null;
  }

  tokens.push({ type: "eof", value: "", pos: source.length });
  return tokens;
}

class Parser {
  private index = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly variables: Record<string, number>,
  ) {}

  parse(): number {
    const value = this.parseExpression();
    if (!this.isAtEnd()) return NaN;
    return value;
  }

  private parseExpression(): number {
    return this.parseAddSub();
  }

  private parseAddSub(): number {
    let left = this.parseMulDiv();
    while (this.match("+", "-")) {
      const op = this.previous().value;
      const right = this.parseMulDiv();
      if (!Number.isFinite(left) || !Number.isFinite(right)) return NaN;
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  private parseMulDiv(): number {
    let left = this.parsePower();
    while (true) {
      if (this.match("*", "/")) {
        const op = this.previous().value;
        const right = this.parsePower();
        if (!Number.isFinite(left) || !Number.isFinite(right)) return NaN;
        left = op === "*" ? left * right : left / right;
        continue;
      }
      if (this.canStartFactor()) {
        const right = this.parsePower();
        if (!Number.isFinite(left) || !Number.isFinite(right)) return NaN;
        left = left * right;
        continue;
      }
      break;
    }
    return left;
  }

  private parsePower(): number {
    let left = this.parseUnary();
    if (this.match("^")) {
      const right = this.parseUnary();
      if (!Number.isFinite(left) || !Number.isFinite(right)) return NaN;
      return Math.pow(left, right);
    }
    return left;
  }

  private parseUnary(): number {
    if (this.match("-", "+")) {
      const op = this.previous().value;
      const value = this.parseUnary();
      return op === "-" ? -value : value;
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    if (this.match("(")) {
      const value = this.parseExpression();
      if (!this.match(")")) return NaN;
      return value;
    }

    if (this.check("number")) {
      const token = this.advance();
      const value = Number(token.value);
      return Number.isFinite(value) ? value : NaN;
    }

    if (this.check("ident")) {
      const name = this.advance().value;

      if (this.match("(")) {
        return this.parseFunctionCall(name);
      }

      if (name in this.variables) return this.variables[name];
      if (name in CONSTANTS) return CONSTANTS[name];

      return NaN;
    }

    return NaN;
  }

  private parseFunctionCall(name: string): number {
    if (name in UNARY_FUNCTIONS && !this.check("op", ")")) {
      const arg = this.parseExpression();
      if (!this.match(")")) return NaN;
      if (!Number.isFinite(arg)) return NaN;
      try {
        return UNARY_FUNCTIONS[name](arg);
      } catch {
        return NaN;
      }
    }

    if (name in BINARY_FUNCTIONS) {
      const first = this.parseExpression();
      if (!this.match(",")) return NaN;
      const second = this.parseExpression();
      if (!this.match(")")) return NaN;
      if (!Number.isFinite(first) || !Number.isFinite(second)) return NaN;
      try {
        return BINARY_FUNCTIONS[name](first, second);
      } catch {
        return NaN;
      }
    }

    return NaN;
  }

  private canStartFactor(): boolean {
    return this.check("number") || this.check("ident") || this.check("op", "(");
  }

  private match(...ops: string[]): boolean {
    if (!this.check("op")) return false;
    if (!ops.includes(this.peek().value)) return false;
    this.index++;
    return true;
  }

  private check(type: TokenType, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (token.type !== type) return false;
    return value === undefined || token.value === value;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.index++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === "eof";
  }

  private peek(): Token {
    return this.tokens[this.index];
  }

  private previous(): Token {
    return this.tokens[this.index - 1];
  }
}

/**
 * Evaluates a math expression for graphing (e.g. `x^2`, `sin(x)`, `2x + 1`).
 * Returns `NaN` for invalid input instead of throwing, so plotting can skip bad points.
 */
function evaluateExpression(
  expression: string,
  variables: Record<string, number> = {},
): number {
  const trimmed = expression.trim();
  if (!trimmed) return NaN;

  const normalizedVars: Record<string, number> = {};
  for (const [key, value] of Object.entries(variables)) {
    normalizedVars[key.toLowerCase()] = value;
  }

  const tokens = tokenize(trimmed);
  if (!tokens) return NaN;

  return new Parser(tokens, normalizedVars).parse();
}

export { evaluateExpression };
