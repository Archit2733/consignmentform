import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Select from "./components/Select";
import Input from "./components/Input";

interface FormData {
  source: string;
  destination: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
}

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Custom hook to fetch data
async function fetchCountries() {
  const response = await fetch(
    "https://restcountries.com/v3.1/subregion/australia/?fields=name"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  return response.json();
}

const ConsignmentForm: React.FC = () => {
  const method = useForm<FormData>({
    defaultValues: { weight: 1, height: 10, width: 10, depth: 10 },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const [locations, setLocations] = useState<string[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  useEffect(() => {
    // Mock API call to fetch locations
    (async () => {
      try {
        const loc = await fetchCountries();
        setLocations(loc?.map((l: any) => l?.name?.common));
      } catch (err) {
        setLocations([]);
      }
    })();
  }, []);

  const onSubmit = async (data: FormData) => {
    // Generate a unique consignment ID
    const consignmentId = `CON-${Date.now()}`;

    // Simulate an API call
    await delay(2000);
    console.log("submitted data", { ...data, id: consignmentId });
    // try {
    //     const res = fetch('/mockEndpointendpoint', {
    //         method: 'POST',
    //         body: JSON.stringify({...data, id: consignmentId})
    //     })
    // } catch (err: any) {
    //     method.setError(err)
    // }
    setSubmissionStatus("success");
  };

  // Validation helpers
  const validateDestination = (value: string) =>
    value !== method?.watch("source") ||
    "Source and destination cannot be the same";
  const validatePositiveNumber = (value: number) =>
    value > 0 || "Value must be positive";
  const validateWeight = (value: number) =>
    (value >= 1 && value <= 1000) || "Weight must be between 1 and 1000 kg";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <FormProvider {...method}>
        <form
          onSubmit={method?.handleSubmit(onSubmit)}
          className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6"
        >
          <h1 className="text-2xl font-bold text-gray-800">Consignment Form</h1>

          {/* Source Field */}
          <Select
            id="source"
            label="Source"
            options={locations}
            validationRules={{ required: "source is required" }}
          />

          {/* Destination Field */}
          <Select
            id="destination"
            label="destination"
            options={locations}
            validationRules={{
              required: "destination is required",
              validate: validateDestination,
            }}
          />

          {/* Weight Field */}
          <div>
            <Input
              id="weight"
              label="Weight (kg)"
              type="number"
              palaceholder="weight"
              validationRules={{
                required: "Weight is required",
                validate: validateWeight,
              }}
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dimensions (cm)
            </label>
            <div className="grid grid-cols-3 gap-4 mt-1">
              {["width", "height", "depth"].map((dimension) => (
                <Input
                  key={dimension}
                  id={dimension}
                  type="number"
                  palaceholder={dimension}
                  validationRules={{
                    required: `${dimension} is required`,
                    validate: validatePositiveNumber,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={method?.formState?.isSubmitting}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring focus:ring-indigo-300 ${
              method?.formState?.isSubmitting
                ? "bg-indigo-300 cursor-not-allowed"
                : ""
            }`}
          >
            Submit
          </button>

          {/* Submission Status */}
          {submissionStatus === "success" && (
            <div className="mt-4 text-center text-green-600">
              Form submitted successfully!
            </div>
          )}
          {submissionStatus === "error" && (
            <div className="mt-4 text-center text-red-600">
              Error submitting the form. Please try again.
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default ConsignmentForm;
