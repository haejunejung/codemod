import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { memoryProject } from "../../utils/memoryProject";
import { transformGqlToGraphql } from "./transform";

describe("gql-to-graphql", () => {
  it("should transform GraphQL fragments correctly", async () => {
    const sourceFilePath = path.resolve(
      __dirname,
      "fixtures",
      "inputs",
      "fragment.ts",
    );

    const outputFilePath = path.resolve(
      __dirname,
      "fixtures",
      "outputs",
      "fragment.ts",
    );

    const sourceCode = await fs.readFile(sourceFilePath, "utf-8");
    const outputCode = await fs.readFile(outputFilePath, "utf-8");

    const sourceFile = memoryProject.createSourceFile(
      "virtual-fragment.ts",
      sourceCode,
      { overwrite: true },
    );

    await transformGqlToGraphql(sourceFile);

    const actualCode = sourceFile.getFullText();
    expect(actualCode).toBe(outputCode);
  });

  it("should transform GraphQL queries correctly", async () => {
    const sourceFilePath = path.resolve(
      __dirname,
      "fixtures",
      "inputs",
      "query.ts",
    );

    const outputFilePath = path.resolve(
      __dirname,
      "fixtures",
      "outputs",
      "query.ts",
    );

    const sourceCode = await fs.readFile(sourceFilePath, "utf-8");
    const outputCode = await fs.readFile(outputFilePath, "utf-8");

    const sourceFile = memoryProject.createSourceFile(
      "virtual-query.ts",
      sourceCode,
      { overwrite: true },
    );

    await transformGqlToGraphql(sourceFile);

    const actualCode = sourceFile.getFullText();
    expect(actualCode).toBe(outputCode);
  });

  it("should transform GraphQL mutations correctly", async () => {
    const sourceFilePath = path.resolve(
      __dirname,
      "fixtures",
      "inputs",
      "mutation.ts",
    );

    const outputFilePath = path.resolve(
      __dirname,
      "fixtures",
      "outputs",
      "mutation.ts",
    );

    const sourceCode = await fs.readFile(sourceFilePath, "utf-8");
    const outputCode = await fs.readFile(outputFilePath, "utf-8");

    const sourceFile = memoryProject.createSourceFile(
      "virtual-mutation.ts",
      sourceCode,
      { overwrite: true },
    );

    await transformGqlToGraphql(sourceFile);

    const actualCode = sourceFile.getFullText();
    expect(actualCode).toBe(outputCode);
  });
});
