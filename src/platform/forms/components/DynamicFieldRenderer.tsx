"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { FieldDefinition } from "../application/build-zod-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DynamicFieldRendererProps {
  field: FieldDefinition;
}

export function DynamicFieldRenderer({ field }: DynamicFieldRendererProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[field.key];

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label} {field.isRequired && <span className="text-destructive">*</span>}
      </Label>

      {field.type === "textarea" ? (
        <Textarea
          id={field.key}
          {...register(field.key)}
          placeholder={field.config.placeholder as string}
        />
      ) : (
        <Input
          id={field.key}
          type={field.type === "number" ? "number" : "text"}
          {...register(field.key, { valueAsNumber: field.type === "number" })}
          placeholder={field.config.placeholder as string}
        />
      )}

      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
