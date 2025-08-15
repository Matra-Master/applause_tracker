import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { TallyMarks } from "./TallyMarks";
import { Id } from "../../convex/_generated/dataModel";

interface PersonColumnProps {
  person: {
    _id: Id<"people">;
    name: string;
    applauseCount: number;
  };
  isDark: boolean;
}

export function PersonColumn({ person, isDark }: PersonColumnProps) {
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

  const croissantCount = Math.floor(person.applauseCount / 15);

  return (
    <div className="flex-shrink-0 w-48 h-full flex flex-col">
      {/* Name and croissant section */}
      <div className="h-24 flex flex-col justify-center items-center px-4 relative">
        <button
          onClick={handleRemove}
          className={`absolute top-2 right-2 w-5 h-5 rounded-full text-xs font-bold transition-all duration-200 ${
            isRemoving
              ? isDark
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-500 text-white hover:bg-red-600'
              : isDark
                ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/20'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          {isRemoving ? '✓' : '×'}
        </button>
        <h3 className={`text-base font-medium text-center leading-tight mb-1 ${
          isDark ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {person.name}
        </h3>
        {croissantCount > 0 && (
          <button
            onClick={() => handleApplauseChange(-15)}
            className={`text-lg hover:scale-110 transition-transform duration-200 ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            } rounded px-1`}
            title={`Remove 15 applause (${croissantCount} × 15 = ${croissantCount * 15})`}
          >
            {'🥐'.repeat(croissantCount)}
          </button>
        )}
      </div>

      {/* Thick horizontal separator */}
      <div className={`h-1 mx-4 ${
        isDark ? 'bg-blue-400' : 'bg-blue-500'
      }`}></div>

      {/* Tally marks section - scrollable */}
      <div className="flex-1 px-4 py-6 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <TallyMarks count={person.applauseCount} isDark={isDark} />
        </div>
        
        {/* Control buttons - always visible */}
        <div className="mt-4 pt-4 space-y-2 flex-shrink-0">
          <button
            onClick={() => handleApplauseChange(1)}
            className={`w-full py-2 px-3 rounded font-medium transition-all duration-200 ${
              isDark
                ? 'bg-blue-400 text-gray-900 hover:bg-blue-300 active:bg-blue-500'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
            }`}
          >
            +1
          </button>
          <button
            onClick={() => handleApplauseChange(-1)}
            disabled={person.applauseCount === 0}
            className={`w-full py-2 px-3 rounded font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-gray-600 text-gray-200 hover:bg-gray-500 active:bg-gray-700 disabled:bg-gray-700'
                : 'bg-gray-400 text-white hover:bg-gray-500 active:bg-gray-600 disabled:bg-gray-300'
            }`}
          >
            -1
          </button>
        </div>
      </div>
    </div>
  );
}
