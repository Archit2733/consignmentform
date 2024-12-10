import React from "react";
import { useFormContext } from "react-hook-form";

interface SelectProps {
  id: string;
  label: string;
  options: string[];
  validationRules?: Record<string, any>;
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
  validationRules,
}) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const inputError: any = errors?.[id];
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        disabled={isSubmitting}
        {...register(id, validationRules)}
        className={`mt-1 block w-full rounded-md border px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          !!errors?.id ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {!!inputError?.message && (
        <p className="mt-2 text-sm text-red-600">
          {(typeof inputError?.message === "string"
            ? inputError?.message
            : "") || ""}
        </p>
      )}
    </div>
  );
};

export default Select;
