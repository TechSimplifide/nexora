import { z } from "zod";

export const createProjectAccessRequestSchema = z.object({
  resourceType: z.enum(["github", "deployedLink", "supportingDocument"]),
});
