interface TallyMarksProps {
  count: number;
  isDark: boolean;
}

export function TallyMarks({ count, isDark }: TallyMarksProps) {
  const groups = Math.floor(count / 5);
  const remainder = count % 5;
  
  const groupElements = [];
  
  // Create complete groups of 5
  for (let i = 0; i < groups; i++) {
    groupElements.push(
      <div key={`group-${i}`} className="mb-3">
        <svg width="28" height="36" viewBox="0 0 28 36" className="block mx-auto">
          {/* Four vertical lines forming a square */}
          <line x1="5" y1="5" x2="5" y2="31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="5" x2="10" y2="31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="15" y1="5" x2="15" y2="31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="5" x2="20" y2="31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Diagonal line crossing through */}
          <line x1="2" y1="10" x2="23" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Add remaining individual marks
  if (remainder > 0) {
    groupElements.push(
      <div key="remainder" className="mb-3">
        <svg width="28" height="36" viewBox="0 0 28 36" className="block mx-auto">
          {Array.from({ length: remainder }, (_, i) => (
            <line
              key={i}
              x1={5 + i * 5}
              y1="5"
              x2={5 + i * 5}
              y2="31"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-start ${
      isDark ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {count === 0 ? (
        <div className="text-center py-6">
          <div className={`text-3xl mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            ∅
          </div>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No applause
          </span>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center">
            {groupElements}
          </div>
          <div className={`mt-3 text-xs font-medium px-2 py-1 rounded-full ${
            isDark 
              ? 'bg-blue-400 text-gray-900' 
              : 'bg-blue-500 text-white'
          }`}>
            {count}
          </div>
        </>
      )}
    </div>
  );
}
