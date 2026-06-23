import { test } from "node:test";
import assert from "node:assert";
import React from "react";
// Usando um renderizador simples caso o react-dom/server ou test-utils nao estejam disponiveis no node nativo,
// Porem, como e um projeto react 19, podemos apenas testar o componente renderizado como objeto React,
// ou montar mock se o ambiente dom estiver indisponivel.
import { renderToString } from "react-dom/server";
import ErrorPage from "../../src/app/error";

test("ErrorPage - renders generic error message", () => {
  const error = new Error("Sensitive database credentials leaked");
  error.digest = "ABC-123-XYZ";

  const resetMock = () => {};

  const element = <ErrorPage error={error} reset={resetMock} />;
  const html = renderToString(element);

  // Nao deve conter a mensagem sensivel na UI
  assert.strictEqual(html.includes("Sensitive database credentials leaked"), false);

  // Deve conter o digest sanitizado
  assert.strictEqual(html.includes("ABC-123-XYZ"), true);

  // Deve conter uma mensagem generica
  assert.strictEqual(html.includes("Ocorreu um erro inesperado"), true);
});
