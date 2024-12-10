import React from "react";
import { useFormContext } from "react-hook-form";

interface InputProps {
  id: string;
  label?: string;
  type: string;
  error?: string;
  palaceholder?: string;
  validationRules?: Record<string, any>;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  palaceholder,
  validationRules,
}) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const inputError: any = errors?.[id];

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        disabled={isSubmitting}
        {...register(id, validationRules)}
        {...(type === "number"
          ? { onWheel: (e) => e.currentTarget.blur() }
          : {})} // Prevent scroll increment
        className={`mt-1 block w-full rounded-md border px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          errors?.id?.message ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={palaceholder}
      />
      {inputError?.message && (
        <p className="mt-2 text-sm text-red-600">
          {(typeof inputError?.message === "string" ? inputError?.message : "") ||
            ""}
        </p>
      )}
    </div>
  );
};

export default Input;
