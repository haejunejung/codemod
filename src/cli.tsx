#!/usr/bin/env node

import { render } from "ink";
import meow from "meow";
import App from "./App.js";

const cli = meow(
  `
    Usage:
        $ codemod

    Options:
        --dryRun, -d  Run the migration without making changes
	`,
  {
    importMeta: import.meta,
    flags: {
      dryRun: {
        type: "boolean",
        shortFlag: "d",
        default: false,
        description: "Run the migration without making changes",
      },
    },
  },
);

render(<App dryRun={cli.flags.dryRun} />);
