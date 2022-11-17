import * as React from "react"
import { useState, useContext } from "react"
import { IUser } from "../interfaces"

type userProviderProps = { children: React.ReactNode }

/* Context: Primarily used to store state. Additionally used to handle logic through
useEffects and functions. */
const UserContext = React.createContext<
  | { user: IUser; setUser: React.Dispatch<React.SetStateAction<IUser>> }
  | undefined
>(undefined)
/* Line 10 is the only line that will change when I create context in other places.
The typescript object on line 10 needs to reflect each key within the value object
provided by the provider.*/

/* Prrovider: This context provider component is exported so it can wrap any page, component,
or the global app component to provide the context data and functions provided*/
function UserProvider({ children }: userProviderProps) {
  const [user, setUser] = useState<IUser>({} as IUser)
  const value = { user, setUser }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

/* We export the useUser hook so the context object is easily consumable by components wrapped
in the provider.*/
function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export { UserProvider, useUser }
