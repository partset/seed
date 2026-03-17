type ContactTextareaProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  };
  
  export default function ContactTextarea({
    id,
    name,
    label,
    value,
    placeholder,
    required = false,
    rows = 6,
    onChange,
  }: ContactTextareaProps) {
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-1 text-primary">*</span>}
        </label>
  
        <textarea
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          rows={rows}
          onChange={onChange}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:bg-white/10 resize-none"
        />
      </div>
    );
  }