import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConsignmentForm from "./ConsignmentForm";
import { fetchCountries } from "./api";

describe("ConsignmentForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    return fetchCountries();
  });

  test("renders the form with initial state", () => {
    render(<ConsignmentForm />);

    expect(screen.getByText(/Consignment Form/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weight \(kg\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Dimensions \(cm\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("validates form input fields", async () => {
    render(<ConsignmentForm />);
    await waitFor(() => {
      expect(screen.getAllByText(/Australia/i)).toHaveLength(2);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getAllByText(/New Zealand/i)).toHaveLength(2);
    });
    await fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
      target: { value: "" },
    });
    await fireEvent.change(screen.getByPlaceholderText(/width/i), {
      target: { value: "" },
    });
    await fireEvent.change(screen.getByPlaceholderText(/height/i), {
      target: { value: "" },
    });
    await fireEvent.change(screen.getByPlaceholderText(/depth/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/source is required/i)).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText(/destination is required/i)).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText(/weight is required/i)).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText(/width is required/i)).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText(/height is required/i)).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText(/depth is required/i)).toBeInTheDocument();
    });
  });

  test("populates dropdowns from the mock API", async () => {
    render(<ConsignmentForm />);

    await waitFor(() => {
      expect(screen.getAllByText(/Australia/i)).toHaveLength(2);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getAllByText(/New Zealand/i)).toHaveLength(2);
    });
  });

  test("handles successful submission and displays success message", async () => {
    render(<ConsignmentForm />);

    await waitFor(() => {
      expect(screen.getAllByText(/Australia/i)).toHaveLength(2);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getAllByText(/New Zealand/i)).toHaveLength(2);
    });
    // Fill form fields

    await fireEvent.change(screen.getByLabelText(/Source/i), {
      target: { value: "Australia" },
    });
    await fireEvent.change(screen.getByLabelText(/Destination/i), {
      target: { value: "New Zealand" },
    });
    await fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), {
      target: { value: 5 },
    });
    await fireEvent.change(screen.getByPlaceholderText(/width/i), {
      target: { value: 20 },
    });
    await fireEvent.change(screen.getByPlaceholderText(/height/i), {
      target: { value: 30 },
    });
    await fireEvent.change(screen.getByPlaceholderText(/depth/i), {
      target: { value: 40 },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Wait for the success message
    // Wait for the success message to appear
    await waitFor(
      () => {
        const successMessage = screen.getByTestId("success-message");
        expect(successMessage).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Assert the success message content
    expect(screen.getByTestId("success-message")).toHaveTextContent(
      "Form submitted successfully!"
    );
  });

  test("handles API errors gracefully", async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() =>
        Promise.reject(new Error("Failed to fetch countries"))
      );

    render(<ConsignmentForm />);

    await waitFor(() => {
      expect(screen.queryByText(/Australia/i)).not.toBeInTheDocument();
    });
  });
});
