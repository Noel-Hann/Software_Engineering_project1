// DatabaseContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { SQLiteProvider, useSQLiteContext, SQLiteDatabase } from "expo-sqlite";

const DatabaseContext = createContext<SQLiteDatabase | null>(null);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = useSQLiteContext();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
          );
        `);
        console.log("Database initialized");
        setDbReady(true);
      } catch (error) {
        console.log("Error while initializing database:", error);
      }
    };
    initializeDatabase();
  }, [db]);

  return (
    <DatabaseContext.Provider value={dbReady ? db : null}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
