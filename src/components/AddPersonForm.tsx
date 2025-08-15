import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AddPersonFormProps {
  isDark: boolean;
}

export function AddPersonForm({ isDark }: AddPersonFormProps) {
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addPerson = useMutation(api.applause.addPerson);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAdding(true);
    try {
      await addPerson({ name: name.trim() });
      setName("");
      // Automatically return focus to input after adding
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Failed to add person:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="mb-8 flex justify-center">
      <form onSubmit={handleSubmit} className="flex gap-4 items-center">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add person..."
          disabled={isAdding}
          className={`px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 outline-none ${
            isDark
              ? 'bg-gray-800 text-gray-200 placeholder-gray-500 focus:bg-gray-700'
              : 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:bg-white focus:shadow-md'
          }`}
        />
        <button
          type="submit"
          disabled={!name.trim() || isAdding}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
            isDark
              ? 'bg-blue-400 text-gray-900 hover:bg-blue-300 active:bg-blue-500'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }`}
        >
          {isAdding ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}
