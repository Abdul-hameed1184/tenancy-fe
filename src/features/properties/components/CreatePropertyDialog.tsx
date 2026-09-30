import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, Link2, UploadCloud, X } from "lucide-react";
import { Controller, useFieldArray, useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/features/auth/hooks/useSession";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import { cn } from "@/lib/utils";
import { useCreateProperty } from "../hooks/useCreateProperty";
import {
  createPropertySchema,
  NIGERIAN_STATES,
  type CreatePropertyFormInput,
  type CreatePropertyFormValues,
} from "../schemas";

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function PhotoTile({
  control,
  index,
  onRemove,
}: {
  control: Control<CreatePropertyFormInput>;
  index: number;
  onRemove: () => void;
}) {
  const url = useWatch({ control, name: `photos.${index}.url` });
  if (!url) return null;

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-navy-700 bg-navy-900">
      <img src={url} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full bg-navy-950/90 p-2 text-white transition-colors hover:bg-red-500/90"
          aria-label="Remove photo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function CreatePropertyDialog() {
  const user = useSession();
  const openDialogId = useDashboardDialogStore((s) => s.openDialogId);
  const closeDialog = useDashboardDialogStore((s) => s.closeDialog);
  const open = openDialogId === "create-property";

  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreatePropertyFormInput, unknown, CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { photos: [] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "photos" });
  const { mutate, isPending, isError, error } = useCreateProperty();

  const addFiles = (files: FileList | File[]) => {
    Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .forEach((file) => append({ url: URL.createObjectURL(file) }));
  };

  const removePhoto = (index: number) => {
    const url = fields[index]?.url;
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    remove(index);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleClose = () => {
    closeDialog();
    fields.forEach((field) => {
      if (field.url?.startsWith("blob:")) URL.revokeObjectURL(field.url);
    });
    reset({ photos: [] });
    setShowUrlInput(false);
    setUrlDraft("");
  };

  const onSubmit = (values: CreatePropertyFormValues) => {
    if (!user) return;
    mutate(
      {
        title: values.title,
        address: values.address,
        city: values.city,
        state: values.state,
        neighborhood: values.neighborhood,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        sqft: values.sqft,
        priceAnnual: values.priceAnnual,
        photos: values.photos.map((p) => p.url),
        landlordId: user.id,
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List a new property</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Photos</p>
              <button
                type="button"
                onClick={() => setShowUrlInput((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300"
              >
                <Link2 className="h-3.5 w-3.5" /> Add via URL
              </button>
            </div>

            {showUrlInput && (
              <div className="mb-3 flex gap-2">
                <Input
                  placeholder="https://…"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (!urlDraft.trim()) return;
                    append({ url: urlDraft.trim() });
                    setUrlDraft("");
                  }}
                >
                  Add
                </Button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {fields.map((field, index) => (
                <PhotoTile key={field.id} control={control} index={index} onRemove={() => removePhoto(index)} />
              ))}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-center transition-colors",
                  isDragging
                    ? "border-brand-500 bg-brand-500/10 text-brand-400"
                    : "border-navy-700 text-navy-400 hover:border-navy-500 hover:text-navy-300",
                )}
              >
                {isDragging ? <UploadCloud className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
                <p className="px-2 text-xs font-medium">Add photos</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            {errors.photos?.message && <p className="mt-2 text-xs text-red-400">{errors.photos.message}</p>}
          </div>

          <FieldGroup label="Basic Info">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="The Eko Sky Terrace" {...register("title")} />
              {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="12 Ocean Parade Close" {...register("address")} />
              {errors.address && <p className="text-xs text-red-400">{errors.address.message}</p>}
            </div>
          </FieldGroup>

          <FieldGroup label="Location">
            <div className="space-y-1.5">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input id="neighborhood" placeholder="Banana Island" {...register("neighborhood")} />
              {errors.neighborhood && <p className="text-xs text-red-400">{errors.neighborhood.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Lagos" {...register("city")} />
              {errors.city && <p className="text-xs text-red-400">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.state && <p className="text-xs text-red-400">{errors.state.message}</p>}
            </div>
          </FieldGroup>

          <FieldGroup label="Specs &amp; Pricing">
            <div className="space-y-1.5">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input id="bedrooms" type="number" step="1" min="0" {...register("bedrooms")} />
              {errors.bedrooms && <p className="text-xs text-red-400">{errors.bedrooms.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input id="bathrooms" type="number" step="0.5" min="0" {...register("bathrooms")} />
              {errors.bathrooms && <p className="text-xs text-red-400">{errors.bathrooms.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input id="sqft" type="number" step="1" min="0" {...register("sqft")} />
              {errors.sqft && <p className="text-xs text-red-400">{errors.sqft.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priceAnnual">Annual Rent (NGN)</Label>
              <Input id="priceAnnual" type="number" step="1" min="0" {...register("priceAnnual")} />
              {errors.priceAnnual && <p className="text-xs text-red-400">{errors.priceAnnual.message}</p>}
            </div>
          </FieldGroup>

          {isError && <p className="text-sm text-red-400">{error.message}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Listing..." : "List Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
