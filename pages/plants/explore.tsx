import Link from "next/link"
import { useState, useEffect } from "react"
import Header from "../../components/Header"
import { IPlant } from "../../interfaces"
import styles from "../../styles/Explore.module.css"
import PlantDetails from "./[id]"
type Props = {}

const Explore = (props: Props) => {
  const [plants, setPlants] = useState<IPlant[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/plants`,
          {
            method: "GET",
          }
        )
        const data = await response.json()
        setPlants(data)
      } catch (e) {
        console.log("HIT CATCH: ", e)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Header />
      <h3>Explore Plants</h3>
      <input placeholder="Search for a plant" />
      <button>Search</button>
      {plants.map((plant) => (
        <Link href={`/plants/${plant.id}`} key={plant.id}>
          <div>
            <img src={plant.image} alt="" className={styles["plant-image"]} />
            <span>{plant.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Explore
