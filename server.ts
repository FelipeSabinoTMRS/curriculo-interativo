import { createRequestHandler, type ServerBuild } from "@remix-run/cloudflare";
import type { ExecutionContext } from "@cloudflare/workers-types";
import type { Env } from "./load-context";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This file won't exist if it hasn't yet been built
import * as build from "./build/server"; // eslint-disable-line import/no-unresolved
import { getLoadContext } from "./load-context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRemixRequest = createRequestHandler(build as any as ServerBuild);

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    try {
      const loadContext = getLoadContext({
        request,
        context: {
          cloudflare: {
            // This object matches the return value from Wrangler's
            // `getPlatformProxy` used during development via Remix's
            // `cloudflareDevProxyVitePlugin`:
            // https://developers.cloudflare.com/workers/wrangler/api/#getplatformproxy
            cf: request.cf,
            ctx: {
              waitUntil: ctx.waitUntil.bind(ctx),
              passThroughOnException: ctx.passThroughOnException.bind(ctx),
            },
            caches,
            env: env as Env,
          },
        },
      });
      return await handleRemixRequest(request, loadContext);
    } catch (error) {
      console.log(error);
      return new Response("An unexpected error occurred", { status: 500 });
    }
  },
};