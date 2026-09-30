import { z } from "zod";

export const fileReportSchema = z.object({
  type: z.enum(["listing", "user"]),
  targetId: z.string().min(1, "Select what you're reporting"),
  reason: z.string().min(10, "Give at least a few words of detail"),
});
export type FileReportFormValues = z.infer<typeof fileReportSchema>;
