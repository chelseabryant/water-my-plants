import { useState } from "react"
import Header from "../components/Header"

type Props = {}

const Login = (props: Props) => {
  const [isCreating, setIsCreating] = useState<boolean>(true)
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<boolean>(false)
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  const nameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
  }

  const emailInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }

  const passwordInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
  }

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isCreating) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/users`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name,
              email: email,
              password: password,
            }),
          }
        )
        const data = await response.json()
        console.log(data)
      } catch (e) {
        console.log("HIT CATCH: ", e)
      }
    }
  }

  return (
    <div>
      <Header />
      <div>
        {authenticated ? (
          "Thank you for logging in!"
        ) : (
          <form onSubmit={login}>
            <h3>{isCreating ? "Create an account" : "Login"}</h3>
            <p>{errorMessage ? "Email or password incorrect" : ""}</p>
            <input placeholder="Enter first name here" onChange={nameInput} />
            <input placeholder="Enter email here" onChange={emailInput} />
            <input placeholder="Enter password here" onChange={passwordInput} />
            <button type="button" onClick={() => setIsCreating(!isCreating)}>
              {isCreating
                ? "Already have an account?"
                : "Need to create an acccount?"}
            </button>
            <button>{isCreating ? "Create account" : "Login"}</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login