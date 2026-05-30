"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildZodSchema, FieldDefinition } from "../application/build-zod-schema";
import { Button } from "@/components/ui/button";
import { DynamicFieldRenderer } from "./DynamicFieldRenderer";

interface DynamicFormRendererProps {
  fields: FieldDefinition[];
  defaultValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export function DynamicFormRenderer({
  fields,
  defaultValues = {},
  onSubmit,
  submitLabel = "Salvar",
  isLoading = false,
}: DynamicFormRendererProps) {
  const schema = buildZodSchema(fields);
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field: any) => (
            <DynamicFieldRenderer key={field.id} field={field} />
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
