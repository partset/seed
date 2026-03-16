type ContactFieldProps = {
    id: string;
    name: string;
    label: string;
    type?: "text" | "email" | "tel";
    value: string;
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  export default function ContactField({
    id,
    name,
    label,
    type = "text",
    value,
    placeholder,
    required = false,
    onChange,
  }: ContactFieldProps) {
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-primary">*</span>}
        </label>
  
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:bg-white/10"
        />
      </div>
    );
  }