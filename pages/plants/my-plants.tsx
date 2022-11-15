import Link from "next/link"
import React from "react"
import Header from "../../components/Header"
import { IPlant } from "../../interfaces"

type Props = {}

const MyPlants = ({}: Props) => {
  return (
    <div>
      <Header />
      <h3>My Plants</h3>
    </div>
  )
}

export default MyPlants
