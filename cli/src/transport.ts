import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import {
  getDefaultEnvironment,
  StdioClientTransport,
} from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { findActualExecutable } from "spawn-rx";

export type TransportOptions = {
  transportType: "sse" | "stdio" | "http";
  command?: string;
  args?: string[];
  url?: string;
  headers?: Record<string, string>;
  clientCert?: string;
  clientKey?: string;
  clientKeyPassphrase?: string;
  caCert?: string;
};

import https from "node:https";
import fs from "node:fs";

const createHttpsAgent = (
  options: TransportOptions,
): https.Agent | undefined => {
  if (!options.clientCert || !options.clientKey) {
    return undefined;
  }

  try {
    return new https.Agent({
      cert: fs.readFileSync(options.clientCert),
      key: fs.readFileSync(options.clientKey),
      passphrase: options.clientKeyPassphrase,
      ca: options.caCert ? fs.readFileSync(options.caCert) : undefined,
    });
  } catch (error) {
    throw new Error(
      `Failed to load client certificates: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

function createStdioTransport(options: TransportOptions): Transport {
  let args: string[] = [];

  if (options.args !== undefined) {
    args = options.args;
  }

  const processEnv: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      processEnv[key] = value;
    }
  }

  const defaultEnv = getDefaultEnvironment();

  const env: Record<string, string> = {
    ...defaultEnv,
    ...processEnv,
  };

  const { cmd: actualCommand, args: actualArgs } = findActualExecutable(
    options.command ?? "",
    args,
  );

  return new StdioClientTransport({
    command: actualCommand,
    args: actualArgs,
    env,
    stderr: "pipe",
  });
}

export function createTransport(options: TransportOptions): Transport {
  const { transportType } = options;

  try {
    if (transportType === "stdio") {
      return createStdioTransport(options);
    }

    // If not STDIO, then it must be either SSE or HTTP.
    if (!options.url) {
      throw new Error("URL must be provided for SSE or HTTP transport types.");
    }
    const url = new URL(options.url);

    if (transportType === "sse") {
      const agent = createHttpsAgent(options);
      const transportOptions = {
        requestInit: {
          headers: options.headers,
          agent,
        },
      };
      return new SSEClientTransport(url, transportOptions as any);
    }

    if (transportType === "http") {
      const agent = createHttpsAgent(options);
      const transportOptions = {
        requestInit: {
          headers: options.headers,
          agent,
        },
      };
      return new StreamableHTTPClientTransport(url, transportOptions as any);
    }

    throw new Error(`Unsupported transport type: ${transportType}`);
  } catch (error) {
    throw new Error(
      `Failed to create transport: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
