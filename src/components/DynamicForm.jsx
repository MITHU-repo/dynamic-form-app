import { useState } from "react";

/* eslint-disable no-unused-vars */
export default function DynamicForm({ fields, onSubmit }) {
  const buildInitialState = () =>
    fields.reduce((acc, field) => {
      acc[field.name] = field.value ?? (field.type === "checkbox" ? false : "");
      return acc;
    }, {});

  const [formData, setFormData] = useState(buildInitialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name, event, type) => {
    const value =
      type === "checkbox" ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitted(false);
  };

  const validate = () => {
    const nextErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        nextErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    onSubmit?.(formData);
  };

  const renderField = (field) => {
    const { type, name, label, options, placeholder } = field;

    const commonProps = {
      id: name,
      name,
      value: type === "checkbox" ? undefined : formData[name],
      checked: type === "checkbox" ? formData[name] : undefined,
      onChange: (e) => handleChange(name, e, type),
      placeholder,
      className: "df-input",
    };

    switch (type) {
      case "textarea":
        return <textarea {...commonProps} rows={4}></textarea>;

      case "select":
        return (
          <select {...commonProps}>
            <option value="" disabled>
              Select {label.toLowerCase()}
            </option>
            {options?.map((opt) => {
              <option key={opt.value} value={opt.value}>
                {opt.value}
              </option>;
            })}
          </select>
        );

      case "radio":
        return (
          <div className="df-radio-group">
            {options?.map((opt) => (
              <label key={opt.value} className="df-radio-label">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={formData[name] === opt.value}
                  onChange={(e) => handleChange(name, e, type)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label className="df-checkbox-label">
            <input type="checkbox" {...commonProps} />
            {label}
          </label>
        );

      default:
        // text, email, password, number, date, etc. — the native <input> covers these
        return <input type={type} {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="df-form" noValidate>
      {fields.map((field) => (
        <div className="df-field" key={field.name}>
          {field.type !== "checkbox" && (
            <label htmlFor={field.name} className="df-label">
              {field.label}
              {field.required && <span className="df-required">*</span>}
            </label>
          )}
          {renderField(field)}
          {errors[field.name] && (
            <p className="df-error">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <button type="submit" className="df-submit">
        Submit
      </button>

      {submitted && (
        <div className="df-result">
          <p className="df-result-title">Submitted data</p>
          <pre className="df-result-pre">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}
