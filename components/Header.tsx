import Link from "next/link"
import React from "react"
import { useUser } from "../contexts/UserContext"
import { IUser } from "../interfaces"

const Header = () => {
  const { user, setUser } = useUser()

  return (
    <div>
      <Link href="/">
        <h1>Water My Plants</h1>
      </Link>
      <ul>
        <li>
          <Link href="/plants/explore">Explore Plants</Link>
        </li>
        <li>
          <Link href="/plants/my-plants">
            {user.id ? `${user.username}'s plants` : "My plants"}
          </Link>
        </li>
        <li>
          <Link href="/calendar">Calendar</Link>
        </li>
        <li>
          {user.id ? (
            <button onClick={() => setUser({} as IUser)}>Log out</button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Header
