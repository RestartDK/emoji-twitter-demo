
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";

import { db } from "~/server/db";

export default function generateServerSideHelper() {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: { db, userId: null },
        transformer: SuperJSON, // optional - adds superjson serialization
      });
    
    return helpers;
}