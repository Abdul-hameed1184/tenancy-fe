import { z } from "zod";

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export const NIGERIAN_STATES_API = "https://nga-states-lga.onrender.com/fetch";

export const createPropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  bedrooms: z.coerce.number().positive("Must be at least 1"),
  bathrooms: z.coerce.number().positive("Must be at least 1"),
  sqft: z
    .union([
      z.literal("").transform(() => undefined),
      z.coerce.number().positive("Must be greater than 0"),
    ])
    .optional(),
  priceAnnual: z.coerce.number().positive("Must be greater than 0"),
  photos: z
    .array(
      z.object({
        url: z.string().min(1, "Enter a photo URL").url("Enter a valid URL"),
      }),
    )
    .min(1, "Add at least one photo"),
  videos: z
    .array(z.object({ url: z.string().min(1).url("Enter a valid URL") }))
    .default([]),
});
export type CreatePropertyFormInput = z.input<typeof createPropertySchema>;
export type CreatePropertyFormValues = z.output<typeof createPropertySchema>;
