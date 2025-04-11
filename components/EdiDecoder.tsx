"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

type Props = {
  onDecode: (result: any[]) => void;
  onInputChange?: () => void;
};

const EdiDecoder = forwardRef(function EdiDecoder({ onDecode, onInputChange }: Props, ref) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDecode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/decode-edi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ edi: input }),
      });
      if (!res.ok) throw new Error("Failed to decode EDI");
      const data = await res.json();
      onDecode(data.cargo_items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleDecode,
    handleClear: () => setInput("")
  }));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (onInputChange) onInputChange();
  };

  return (
    <div className="bg-transparent rounded-lg mb-1 space-y-2">
      <textarea
        ref={textareaRef}
        className="w-full min-h-135 border border-gray-200 p-3 text-sm font-mono rounded-md resize-none overflow-auto"
        placeholder="Paste existing EDI here to parse it"
        value={input}
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default EdiDecoder;
