import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TallyMarks } from "./TallyMarks";
import { Id } from "../../convex/_generated/dataModel";

interface PersonCardProps {
  person: {
    _id: Id<"people">;
    name: string;
    applauseCount: number;
  };
  isDark: boolean;
}

export function PersonCard({ person, isDark }: PersonCardProps) {
  const updateApplause = useMutation(api.applause.updateApplause);
  const removePerson = useMutation(api.applause.removePerson);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleApplauseChange = async (change: number) => {
    try {
      await updateApplause({ personId: person._id, change });
    } catch (error) {
      console.error("Failed to update applause:", error);
    }
  };

  const handleRemove = async () => {
    if (!isRemoving) {
      setIsRemoving(true);
      return;
    }
    
    try {
      await removePerson({ personId: person._id });
    } catch (error) {
      console.error("Failed to remove person:", error);
      setIsRemoving(false);
    }
  };

  return (
    <div className={`rounded-xl p-6 transition-all duration-200 ${
      isDark 
        ? 'bg-green-800/30 border border-green-600/30 shadow-lg' 
        : 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
    }`}>
      {/* Header with name and remove button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold truncate ${
          isDark ? 'text-green-100' : 'text-gray-800'
        }`}>
          {person.name}
        </h3>
        <button
          onClick={handleRemove}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            isRemoving
              ? isDark
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-500 text-white hover:bg-red-600'
              : isDark
                ? 'text-green-300 hover:text-red-400 hover:bg-red-900/20'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          {isRemoving ? 'Confirm' : '×'}
        </button>
      </div>

      {/* Tally marks display */}
      <TallyMarks count={person.applauseCount} isDark={isDark} />

      {/* Control buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleApplauseChange(1)}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
            isDark
              ? 'bg-green-600 text-white hover:bg-green-500 active:bg-green-700'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }`}
        >
          +1
        </button>
        <button
          onClick={() => handleApplauseChange(5)}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
            isDark
              ? 'bg-green-500 text-white hover:bg-green-400 active:bg-green-600'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          +5
        </button>
        <button
          onClick={() => handleApplauseChange(-1)}
          disabled={person.applauseCount === 0}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 disabled:bg-red-800'
              : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300'
          }`}
        >
          -1
        </button>
      </div>
    </div>
  );
}
