import { IndentationText, NewLineKind, Project, QuoteKind } from "ts-morph";

/**
 * Creates a memory project.
 * It is useful when the test does not need to write to the file system.
 */
export const memoryProject = new Project({
  useInMemoryFileSystem: true,
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
    insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
    newLineKind: NewLineKind.LineFeed,
    quoteKind: QuoteKind.Double,
    usePrefixAndSuffixTextForRename: true,
    useTrailingCommas: true,
  },
});
