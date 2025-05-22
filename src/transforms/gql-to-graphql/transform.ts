import type {
  ImportDeclaration,
  SourceFile,
  TaggedTemplateExpression,
} from "ts-morph";

import { Node } from "ts-morph";

const gqlModules = ["@apollo/client"];

const findGqlImport = (sourceFile: SourceFile) => {
  const allImportDeclarations = sourceFile.getImportDeclarations();

  for (const apolloImportDeclaration of allImportDeclarations) {
    const moduleSpecifier = apolloImportDeclaration.getModuleSpecifierValue();
    const namedImports = apolloImportDeclaration.getNamedImports();

    if (gqlModules.includes(moduleSpecifier)) {
      const containGqlImport = namedImports.some(
        (namedImport) => namedImport.getName() === "gql",
      );

      if (containGqlImport) {
        return apolloImportDeclaration;
      }
    }
  }

  return null;
};

const transformGqlImport = (
  sourceFile: SourceFile,
  gqlImport: ImportDeclaration,
) => {
  try {
    const gqlNamedImport = gqlImport.getNamedImports();

    if (gqlNamedImport.length === 1) {
      // Case 1: import { gql } from "@apollo/client";
      gqlImport.remove();
    } else {
      // Case 2: import { gql, useQuery } from "@apollo/client";
      for (const namedImport of gqlNamedImport) {
        namedImport.getName() === "gql" && namedImport.remove();
      }
    }

    const hasExistingGraphqlImport = sourceFile
      .getImportDeclarations()
      .some(
        (importDeclartion) =>
          importDeclartion.getModuleSpecifierValue() ===
            "@/gql/__generated__" &&
          importDeclartion
            .getNamedImports()
            .some((namedImport) => namedImport.getName() === "graphql"),
      );

    if (!hasExistingGraphqlImport) {
      sourceFile.insertImportDeclaration(0, {
        moduleSpecifier: "@/gql/__generated__",
        namedImports: ["graphql"],
      });
    }
  } catch (error) {
    console.error(
      `Error transforming gql import in file ${sourceFile.getFilePath()}: ${error}`,
    );
  }
};

type GqlTemplateUsage = {
  templateNode: TaggedTemplateExpression;
  lineNumber: number;
  templateType: "simple" | "complex";
};

const findGqlUsages = (sourceFile: SourceFile) => {
  const foundGqlUsages: GqlTemplateUsage[] = [];

  sourceFile.forEachDescendant((currentNode) => {
    if (Node.isTaggedTemplateExpression(currentNode)) {
      const templateTag = currentNode.getTag();

      if (Node.isIdentifier(templateTag) && templateTag.getText() === "gql") {
        const templateLiteral = currentNode.getTemplate();
        const currentLineNumber = currentNode.getStartLineNumber();

        if (Node.isNoSubstitutionTemplateLiteral(templateLiteral)) {
          foundGqlUsages.push({
            templateNode: currentNode,
            lineNumber: currentLineNumber,
            templateType: "simple",
          });
        } else if (Node.isTemplateExpression(templateLiteral)) {
          foundGqlUsages.push({
            templateNode: currentNode,
            lineNumber: currentLineNumber,
            templateType: "complex",
          });
        }
      }
    }
  });

  return foundGqlUsages;
};

export const transformGqlUsages = (
  sourceFile: SourceFile,
  gqlUsages: GqlTemplateUsage[],
) => {
  try {
    for (const gqlUsage of gqlUsages) {
      const gqlTemplateNode = gqlUsage.templateNode;
      const gqlTemplate = gqlTemplateNode.getTemplate();

      if (gqlUsage.templateType === "simple") {
        // Case 1: Simple gql template
        // gql`query { ... }`
        if (Node.isNoSubstitutionTemplateLiteral(gqlTemplate)) {
          const content = gqlTemplate.getLiteralText();
          gqlTemplateNode.replaceWithText(`graphql(\`${content}\`)`);
        }
      } else {
        // Case 2: Complex gql template
        // gql`query { ... } ${Fragment}`
        if (Node.isTemplateExpression(gqlTemplate)) {
          const content = gqlTemplate
            .getHead()
            .getLiteralText()
            .replace(/\s+$/, "\n");

          gqlTemplateNode.replaceWithText(`graphql(\`${content}\`)`);
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Error transforming gql usages in file ${sourceFile.getFilePath()}: ${error}`,
    );
  }
};

export const transformGqlToGraphql = async (
  sourceFile: SourceFile,
  dryRun = false,
) => {
  const original = sourceFile.getFullText();
  const gqlImport = findGqlImport(sourceFile);
  const gqlUsages = findGqlUsages(sourceFile);

  try {
    if (!gqlImport) {
      return;
    }

    if (!gqlUsages || gqlUsages.length === 0) {
      return;
    }

    transformGqlImport(sourceFile, gqlImport);
    transformGqlUsages(sourceFile, gqlUsages);

    if (!dryRun) {
      await sourceFile.save();
    }
  } catch (error) {
    sourceFile.replaceWithText(original);
    throw new Error(
      `Error transforming file ${sourceFile.getFilePath()}: ${error}`,
    );
  }
};
