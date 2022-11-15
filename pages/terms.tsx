import { useState } from "react"

export default function terms() {
  const fetchData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/taco`,
      {
        method: "GET",
      }
    )
    const data = await response.json()
    // console.log("data: ", data)
  }

  return (
    <div>
      <button onClick={fetchData}>Click Here</button>
      <p></p>
    </div>
  )
}
