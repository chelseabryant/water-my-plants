import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Header from "../../components/Header"
import { IPlant } from "../../interfaces"
import styles from "../../styles/Explore.module.css"
import Footer from "../../components/Footer"
import { useUser } from "../../contexts/UserContext"

type Props = {}

export default function PlantDetails() {
  const [plant, setPlant] = useState<IPlant>({} as IPlant)
  const [addedPlant, setAddedPlant] = useState<boolean>()
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/plants/${
            router.query.id
          }${user.id ? `?user_id=${user.id}` : ""}`,
          { method: "GET" }
        )
        const data = await response.json()
        setPlant(data.plant_details[0])
        setAddedPlant(data.added_plant)
      } catch (e) {
        console.log("HIT CATCH: ", e)
      }
    }
    if (router?.query?.id) {
      fetchData()
    }
  }, [router?.query?.id, user.id])

  /* When clicked, need to make a POST request with the user id and plant id as the body to
add to new table in database (my plants), then before sending back, use the plant ids returned
from the first request to make a get request in the plants table. Send back all the plants 
associated with that user. */
  const onAddClick = async () => {
    setAddedPlant(true)
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/plants/add-plant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: user.id,
            plant: plant.id,
          }),
        }
      )
    } catch (e) {
      console.log("HIT CATCH: ", e)
      setAddedPlant(false)
    }
  }

  const onDeleteClick = async () => {
    setAddedPlant(false)
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/plants/remove-plant`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: user.id,
            plant: plant.id,
          }),
        }
      )
    } catch (e) {
      console.log("HIT CATCH: ", e)
      setAddedPlant(true)
    }
  }

  return (
    <div>
      <Header />
      {plant.id && (
        <>
          <img src={plant.image} alt="" className={styles["plant-image"]} />
          <ul>
            <h2>{plant.name}</h2>
            <p>Botanical name: {plant.botanical}</p>
            <p>Sunlight: {plant.sun}</p>
            <p>Watering: {plant.water}</p>
            <p>Fertilizing: {plant.fertilize}</p>
            <p>Temperature tolerance: {plant.temperature}</p>
            <p>Humidity: {plant.humidity}</p>
            {user.id &&
              (addedPlant ? (
                <button onClick={onDeleteClick}>Remove from my plants</button>
              ) : (
                <button onClick={onAddClick}>Add plant to my plants</button>
              ))}
          </ul>
        </>
      )}
      <Footer />
    </div>
  )
}
