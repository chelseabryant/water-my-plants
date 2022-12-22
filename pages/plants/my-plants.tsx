import Link from "next/link"
import { useEffect, useState } from "react"
import Header from "../../components/Header"
import { useUser } from "../../contexts/UserContext"
import styles from "../../styles/Explore.module.css"
import { IMyPlant } from "../../interfaces"

type Props = {}

const MyPlants = ({}: Props) => {
  const { user } = useUser()
  const [myPlants, setMyPlants] = useState<IMyPlant[]>([])

  useEffect(() => {
    if (user.id) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/plants/my-plants?user_id=${user.id}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          )
          const data = await response.json()
          setMyPlants(data)
        } catch (e) {
          console.log("HIT CATCH: ", e)
        }
      }
      fetchData()
    }
  }, [])

  return (
    <div>
      <Header />
      <h3>My Plants</h3>
      {user.id ? (
        myPlants.map((plant) => (
          <Link href={`/plants/${plant.id}`} key={plant.id}>
            <div>
              <img src={plant.image} alt="" className={styles["plant-image"]} />
              <span>{plant.name}</span>
            </div>
          </Link>
        ))
      ) : (
        <p>Please login to use this page</p>
      )}
    </div>
  )
}

export default MyPlants
