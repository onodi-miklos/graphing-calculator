function evaluateExpression(
  expression: string,
  variables: Record<string, number> = {}
): number 
{
  // ^ operátor JS-kompatibilissé alakítása (**)
  let expr = expression.replace(/\^/g, "**");

  // Math függvények támogatása
  const allowedFunctions = [
    "sin",
    "cos",
    "tan",
    "sqrt",
    "log",
    "abs",
    "floor",
    "ceil",
    "round",
    "pow",
    "exp",
    "max",
    "min",
  ];

  for (const fn of allowedFunctions) {
    expr = expr.replace(
      new RegExp(`\\b${fn}\\b`, "g"),
      `Math.${fn}`
    );
  }

  // Változók behelyettesítése
  for (const [key, value] of Object.entries(variables)) {
    expr = expr.replace(
      new RegExp(`\\b${key}\\b`, "g"),
      value.toString()
    );
  }

  // Biztonsági ellenőrzés
  if (!/^[0-9+\-*/().,\s*Matha-zA-Z]*$/.test(expr)) {
    throw new Error("Érvénytelen karakter a kifejezésben");
  }

  // Kiértékelés
  return Function(`"use strict"; return (${expr})`)();
}

export {evaluateExpression}