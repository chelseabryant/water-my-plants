import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Header from "../../components/Header"
import { IPlant } from "../../interfaces"
import styles from "../../styles/Explore.module.css"
import Footer from "../../components/Footer"
import MyPlants from "./my-plants"

type Props = {}

export default function PlantDetails() {
  const [plant, setPlant] = useState<IPlant>({} as IPlant)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/plants/${router.query.id}`,
        { method: "GET" }
      )
      const data = await response.json()
      setPlant(data[0])
    }
    fetchData()
  }, [])

  const onAddClick = () => {
    /* When clicked, need to make a POST request with the user id and plant id as the body to
add to new table in database (my plants), then before sending back, use the plant ids returned
from the first request to make a get request in the plants table. Send back all the plants 
associated with that user. */
  }

  return (
    <div>
      <Header />
      <img src={plant.image} alt="" className={styles["plant-image"]} />
      <ul>
        <h2>{plant.name}</h2>
        <p>Botanical name: {plant.botanical}</p>
        <p>Sunlight: {plant.sun}</p>
        <p>Watering: {plant.water}</p>
        <p>Fertilizing: {plant.fertilize}</p>
        <p>Temperature tolerance: {plant.temperature}</p>
        <p>Humidity: {plant.humidity}</p>
        <button onClick={onAddClick}>Add plant to my plants</button>
      </ul>
      <Footer />
    </div>
  )
}
