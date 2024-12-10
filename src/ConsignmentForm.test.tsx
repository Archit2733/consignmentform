import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConsignmentForm from "./ConsignmentForm";
import userEvent from "@testing-library/user-event";
// Mock the fetchCountries function only
jest.mock("./ConsignmentForm", () => {
    const originalModule = jest.requireActual("./ConsignmentForm");
    return {
      __esModule: true, // Ensures the default export remains intact
      ...originalModule,
      fetchCountries: jest.fn(),
    };
  });
  
  // Get the mocked function for use in tests
  const mockFetchCountries = require("./ConsignmentForm").fetchCountries;

describe("ConsignmentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Form rendering and initial state", () => {
    render(<ConsignmentForm />);

    // Check if the form title is present
    expect(
      screen.getByRole("heading", { name: /Consignment Form/i })
    ).toBeInTheDocument();

    // Check if fields are rendered with default values
    expect(screen.getByLabelText(/Weight \(kg\)/i)).toHaveValue(1);
    expect(screen.getByPlaceholderText("width")).toHaveValue(10);
    expect(screen.getByPlaceholderText("height")).toHaveValue(10);
    expect(screen.getByPlaceholderText("depth")).toHaveValue(10);
  });

  describe("ConsignmentForm - Dropdown population", () => {
    beforeEach(() => {
      // Mock implementation of fetchCountries
      mockFetchCountries.mockResolvedValue([
        { name: { common: "Australia" } },
        { name: { common: "New Zealand" } },
      ]);
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    test("Populates dropdown with data from mock API", async () => {
      render(<ConsignmentForm />);
  
      // Wait for the dropdown to populate
      await waitFor(() => {
        expect(mockFetchCountries).toHaveBeenCalledTimes(1);
      });
  
      // Check if dropdown options are rendered
      const sourceDropdown = screen.getByLabelText(/source/i);
      expect(sourceDropdown).toBeInTheDocument();
  
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3); // Two from the mock + one default empty option
      expect(options[1]).toHaveTextContent("Australia");
      expect(options[2]).toHaveTextContent("New Zealand");
    });
  
    test("Displays empty dropdown if the mock API fails", async () => {
      mockFetchCountries.mockRejectedValue(new Error("API Error"));
  
      render(<ConsignmentForm />);
  
      // Wait for the component to handle the API error
      await waitFor(() => {
        expect(mockFetchCountries).toHaveBeenCalledTimes(1);
      });
  
      const sourceDropdown = screen.getByLabelText(/source/i);
      expect(sourceDropdown).toBeInTheDocument();
  
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1); // Only the default empty option
      expect(options[0]).toHaveTextContent("-- Select --");
    });
  });

  test("Form validation logic", async () => {
    render(<ConsignmentForm />);

    // Attempt to submit without filling required fields
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Check for validation messages
    await screen.findByText("source is required");
    expect(
      screen.getByText("destination is required")
    ).toBeInTheDocument();

    // Enter invalid data
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
      target: { value: 2000 },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Check for validation messages
    await screen.findByText("Weight must be between 1 and 1000 kg");
  });

  test("Displays success message on successful form submission", async () => {
    render(<ConsignmentForm />);
  
    // Fill out the form fields using the correct label text
    userEvent.type(screen.getByLabelText(/source/i), "Australia");
    userEvent.type(screen.getByLabelText(/destination/i), "New Zealand");
    userEvent.type(screen.getByLabelText(/Weight \(kg\)/i), "10");
  
  // Submit the form
  userEvent.click(screen.getByRole("button", { name: /submit/i }));

  // Wait for the success message
  await waitFor(() => {
    expect(screen.getByText((content) => content.includes("Form submitted successfully!"))).toBeInTheDocument();
  });
  });

  test("Handling of API errors", async () => {
    mockFetchCountries.mockRejectedValue(new Error("API error"));

    render(<ConsignmentForm />);

    // Check that locations remain empty
    await waitFor(() => expect(screen.queryAllByRole("option").length).toBe(0));
  });
});
