import { initTRPC, TRPCError } from "@trpc/server";
import z from "zod";
import { unlink } from "fs/promises";
import { processAndAnalyzeFiles } from "./analyzer";

const t = initTRPC.create();
const router = t.router;
const procedure = t.procedure;

export const appRouter = router({
  analyze: procedure
    .input(
      z.object({
        jobDescription: z.string(),
        cv: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { jobDescription, cv } = input;

      try {
        const analysis = await processAndAnalyzeFiles(jobDescription, cv);

        return analysis;
      } catch (error) {
        console.error("Error processing and analyzing files:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process and analyze the files.",
        });
      } finally {
        await Promise.all([unlink(jobDescription), unlink(cv)]);
      }
    }),
});
