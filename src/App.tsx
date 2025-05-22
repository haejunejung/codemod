import { type Option, Select, Spinner, TextInput } from "@inkjs/ui";
import { Box, Text, useApp } from "ink";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import type { SourceFile } from "ts-morph";
import { project } from "./project.js";
import { transformGqlToGraphql } from "./transforms/gql-to-graphql/transform.js";

type MigrationStep =
  | "ChooseTransformer"
  | "Input"
  | "ApplyTransform"
  | "Complete";

const migrationSteps: MigrationStep[] = [
  "ChooseTransformer",
  "Input",
  "ApplyTransform",
  "Complete",
];

type Transformer = "gql-to-graphql";

const transformerMapping: Record<
  Transformer,
  (sourceFile: SourceFile, dryRun: boolean) => Promise<void>
> = { "gql-to-graphql": transformGqlToGraphql };

const options: Option[] = Object.keys(transformerMapping).map((key) => ({
  label: key,
  value: key,
}));

const useStep = () => {
  const [step, setStep] = useState<MigrationStep>("ChooseTransformer");

  const nextStep = useCallback(() => {
    const currentIndex = migrationSteps.indexOf(step);
    if (currentIndex >= 0 && currentIndex < migrationSteps.length - 1) {
      setStep(migrationSteps[currentIndex + 1]);
    }
  }, [step]);

  return [step, nextStep] as const;
};

const SwitchCase = <Case extends string>({
  value,
  caseBy,
}: {
  value: Case;
  caseBy: Record<Case, ReactNode>;
}) => {
  return <>{caseBy[value] ?? null}</>;
};

const App = ({ dryRun }: { dryRun: boolean }) => {
  const { exit } = useApp();
  const [step, nextStep] = useStep();
  const [transformer, setTransformer] = useState<Transformer>();
  const [input, setInput] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleTransformerChange = (value: string) => {
    setTransformer(value as Transformer);
    nextStep();
  };

  const handleInputSubmit = (value: string) => {
    setInput(value);
    nextStep();
  };

  useEffect(() => {
    if (step !== "ApplyTransform" || loading) return;

    const handleTransform = async () => {
      if (!transformer || !input) {
        exit();
        return;
      }

      setLoading(true);

      try {
        project.addSourceFilesAtPaths(input);
        const files = project.getSourceFiles();

        await Promise.all(
          files.map((file) => transformerMapping[transformer](file, dryRun)),
        );

        setLoading(false);
        nextStep();
      } catch (error) {
        setLoading(false);
        exit();
      }
    };

    handleTransform();
  }, [dryRun, transformer, input, step, loading, exit, nextStep]);

  return (
    <SwitchCase
      value={step}
      caseBy={{
        ChooseTransformer: (
          <Box flexDirection="column">
            <Text bold>Select the transformer:</Text>
            <Select options={options} onChange={handleTransformerChange} />
          </Box>
        ),
        Input: (
          <Box flexDirection="column">
            <Text bold>Input the file path, it can be glob patterns</Text>
            <TextInput placeholder="src/**/*.ts" onSubmit={handleInputSubmit} />
          </Box>
        ),
        ApplyTransform: (
          <Box flexDirection="column">
            <Spinner label="Applying transform..." />
          </Box>
        ),
        Complete: (
          <Box flexDirection="column">
            <Text bold>Completed</Text>
          </Box>
        ),
      }}
    />
  );
};

export default App;
