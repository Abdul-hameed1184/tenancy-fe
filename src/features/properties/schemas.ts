import { z } from "zod";

export const NIGERIAN_STATES = [
  "Lagos",
  "Abuja",
  "Rivers",
  "Ogun",
  "Oyo",
  "Kano",
  "Enugu",
  "Delta",
  "Kaduna",
  "Anambra",
] as const;

export const createPropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  bedrooms: z.coerce.number().positive("Must be at least 1"),
  bathrooms: z.coerce.number().positive("Must be at least 1"),
  sqft: z.coerce.number().positive("Must be greater than 0"),
  priceAnnual: z.coerce.number().positive("Must be greater than 0"),
  photos: z
    .array(z.object({ url: z.string().min(1, "Enter a photo URL").url("Enter a valid URL") }))
    .min(1, "Add at least one photo"),
});
export type CreatePropertyFormInput = z.input<typeof createPropertySchema>;
export type CreatePropertyFormValues = z.output<typeof createPropertySchema>;
