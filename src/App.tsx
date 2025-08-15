import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { PersonColumn } from "./components/PersonColumn";
import { AddPersonForm } from "./components/AddPersonForm";
import { Toaster } from "sonner";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900' 
        : 'bg-gray-50'
    }`}>
      <header className={`sticky top-0 z-10 backdrop-blur-sm h-16 flex justify-between items-center px-6 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900/90' 
          : 'bg-gray-50/90'
      }`}>
        <div className="flex items-center gap-6">
          <h2 className={`text-xl font-bold transition-colors ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}>
            Shared Applause Tracker
          </h2>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isDark
                ? 'bg-blue-400 text-gray-900 hover:bg-blue-300'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isDark ? 'Dark' : 'Light'}
          </button>
        </div>
        <SignOutButton />
      </header>

      <main className="h-[calc(100vh-4rem)]">
        <Content isDark={isDark} />
      </main>
      
      <Toaster />
    </div>
  );
}

function Content({ isDark }: { isDark: boolean }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const people = useQuery(api.applause.listPeople);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          isDark ? 'border-blue-400' : 'border-blue-500'
        }`}></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Authenticated>
        <div className="py-8 text-center">
          <h1 className={`text-3xl font-bold mb-2 transition-colors ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}>
            Welcome, {loggedInUser?.email?.split('@')[0] ?? "friend"}
          </h1>
          <p className={`text-lg transition-colors ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Shared applause tracker - everyone can view and update
          </p>
        </div>

        <AddPersonForm isDark={isDark} />

        {people && people.length > 0 ? (
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-x-auto overflow-y-hidden">
              <div className="h-full flex min-w-max">
                {people.map((person, index) => (
                  <div key={person._id} className="flex h-full">
                    <PersonColumn person={person} isDark={isDark} />
                    {/* Vertical separator - not after the last column */}
                    {index < people.length - 1 && (
                      <div className={`w-px flex-shrink-0 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
                {/* Add some padding at the end */}
                <div className="w-8 flex-shrink-0"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className={`text-center transition-colors ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-medium mb-2">No people added yet</h3>
              <p>Add someone above to start tracking applause</p>
            </div>
          </div>
        )}
      </Authenticated>

      <Unauthenticated>
        <div className="h-full flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-6">
            <div className="mb-8">
              <h1 className={`text-4xl font-bold mb-4 transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Shared Applause Tracker
              </h1>
              <p className={`text-xl transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Track applause with traditional tally marks
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
