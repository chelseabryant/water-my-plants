import React from "react"
import Header from "../../Header"

type Props = {}

const Explore = (props: Props) => {
  return (
    <div>
      <Header />
      <h3>Explore Plants</h3>
      <input placeholder="Search for a plant" />
      <button>Search</button>
    </div>
  )
}

export default Explore
