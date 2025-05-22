import { IndentationText, NewLineKind, Project, QuoteKind } from "ts-morph";

export const project = new Project({
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
    insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
    newLineKind: NewLineKind.LineFeed,
    quoteKind: QuoteKind.Double,
    usePrefixAndSuffixTextForRename: true,
    useTrailingCommas: true,
  },
});
