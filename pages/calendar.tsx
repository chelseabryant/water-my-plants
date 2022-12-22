import FullCalendar, {
  DateSelectArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/react"
import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { stringify } from "querystring"
import { start } from "repl"
import { ICalendar, IMyPlant, IPlant } from "../interfaces"
import Modal from "../components/modal/Modal"
import { formatDate } from "../utils/formatDate"
import { useUser } from "../contexts/UserContext"

type Props = {}

const Calendar = (props: Props) => {
  const end = new Date()
  end.setHours(end.getHours() + 1)
  const initialEvents: EventInput[] = [
    {
      id: "1",
      title: "MY FIRST EVENT",
      start: new Date(),
      end: end,
    },
  ]
  // const [events, setEvents] = useState<EventInput[]>(initialEvents)
  const [allEvents, setAllEvents] = useState<ICalendar[]>([])
  const [events, setEvents] = useState<EventInput[]>([])
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [myPlants, setMyPlants] = useState<IMyPlant[]>([])
  const [addPlantIds, setAddPlantIds] = useState<number[]>([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [notes, setNotes] = useState("")
  const [eventAction, setEventAction] = useState("")
  const [newEvent, setNewEvent] = useState(0)
  const [eventPlantIds, setEventPlantIds] = useState<number[] | undefined>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editInput, setEditInput] = useState<string | undefined>("")
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg>(
    {} as EventClickArg
  )
  const [dateSelect, setDateSelect] = useState<DateSelectArg>(
    {} as DateSelectArg
  )
  const { user } = useUser()
  const calendarAction = ["Water", "Fertilize", "Humidify", "Clean my plants!"]

  interface databaseCalendarRowExample {
    id: number //primary key serial
    user_id: number // id of the user who posted a new event
    title: string // Title of event user sees on calendar. Might not need this column, can just use the action_type as the title that appears on calendar events
    start: Date // A Date object that includes the time const start = new Date("Fri Nov 11 2022 00:00:00 GMT-0800")
    end: Date // A Date object that includes the time
    action_type: string // i.e. Water, Fertilize, Repot, Humidify, Clean
    description: string // This column will be like a VARCHAR(500) so the user can describe the task
  }

  // DO FIRST: Make the calendar table with the columns above.
  // DO SECOND: insert a row of dummy data (make sure the user_id is the main user you will be logged in as)
  // DO THIRD: GET the row from the database (You'll need to pass the correct user_id from the frontend when doing this)
  // DO FOURTH: Create a modal for POSTing an event
  // DO FIFTH: Set up backend for POSTing an event
  // DO SIXTH: Create a modal for when a user clicks an event
  // DO SEVENTH: Set up backend for DELETEing an event

  // When user arrives on page, make a GET request passing the user_id as a parameter. This will get all rows associated to a user from the Calendar table
  // We will then set those rows returned like so setEvents(returnedData). This will update the "events" stateful variable which will render the events on the Calendar

  // When a user clicks on a date to add an event, pop up a different modal that provides fields to add an event in the database. This is a POST request, send everything about the event in the body of the request
  // After inserting the row into the database, return all rows associated to user like so:

  // `insert into table
  // I am data being inserted;

  //  SELECT * from table
  //  where user_id = ${user_id}` MAKE SURE YOU HAVE A ; AT THE VERY END OF YOUR INSERT STATEMENT.

  // Things to note: If user clicks date from month view, you will need to add a time selector in the modal. WEEK and DAY view will default the event to be 30 minutes, also need a time selector here so they can change how long the event is.

  // When a user clicks on an event, pop up a modal that shows the details of the event. Part of the details should be a button that will delete the event from the database, after deleting
  // return all rows associated to user (Just like the GET request above does). WARNING can't send a body with delete request. You'll need to use query parameters for the endpoint and send up the following
  // ?event_id={id}&user_id={user_id}

  // After each network request, make sure to setEvents(returnedData)

  useEffect(() => {
    if (user.id) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/calendar?user_id=${user.id}`,
            {
              method: "GET",
            }
          )
          const data: ICalendar[] = await response.json()
          setAllEvents(data)
          const newEvents: EventInput[] = data.map((event) => {
            const eachEvent = {
              id: event.id.toString(),
              title: event.title,
              start: new Date(event.start_date),
              end: new Date(event.end_date),
            }
            return eachEvent
          })
          setEvents(newEvents)
        } catch (e) {
          console.log("HIT CATCH: ", e)
        }
      }
      fetchData()
    }
  }, [newEvent, isEditing, user.id])
  // TODO : Change dependency at array [0]

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

  function renderEventContent(events: EventInput) {
    return (
      <>
        <i>{events.event.title}</i>
        <b>{formatDate(events.event.start)}</b>
      </>
    )
  }

  const onEventClick = async (e: EventClickArg) => {
    const findEvent = allEvents.find((event) => {
      return event.id.toString() === e.event.id
    })
    const plantIds = findEvent?.plant_ids.split(",").map((i) => parseInt(i))

    setSelectedEvent(e)
    setEventPlantIds(plantIds)
    setEditInput(findEvent?.notes)
    setIsOpened(true)
  }

  const onEventPlantClick = async (plant: IMyPlant) => {
    if (eventPlantIds) {
      const newPlantIdString = [...eventPlantIds, plant.id].join()
      setEventPlantIds([...eventPlantIds, plant.id])

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/calendar/update-plant-ids`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: user.id,
              event: selectedEvent.event.id,
              plant_ids: newPlantIdString,
            }),
          }
        )
        const data = await response.json()
        const updatedEvents = allEvents.map((event) =>
          event.id === data.id ? data : event
        )
        setAllEvents(updatedEvents)
      } catch (e) {
        console.log("HIT CATCH: ", e)
      }
    }
  }
  // Idk if this is the correct way to handle this!! also below when rendering the buttons
  // do i need to do an "else" for if there were no plants selected in the first place?

  const onEditClick = async () => {
    if (isEditing) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/calendar/update-notes`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: user.id,
              event: selectedEvent.event.id,
              notes: editInput,
            }),
          }
        )
      } catch (e) {
        console.log("HIT CATCH: ", e)
      }
    }
    setIsEditing(!isEditing)
  }

  const onEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInput(e.target.value)
  }

  const onDateSelect = (e: DateSelectArg) => {
    setDateSelect(e)
    setIsOpened(true)
  }

  const onActionClick = (action: string) => {
    setEventAction(action)
  }

  const startInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value)
  }

  const endInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value)
  }

  const notesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value)
  }

  const onAddPlantClick = (plant: IMyPlant) => {
    setAddPlantIds([...addPlantIds, plant.id])
  }

  const onAddEventClick = async () => {
    const plants = addPlantIds.join()
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REQUEST_BASE_URL}/a/calendar/post-event`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: user.id,
            action: eventAction,
            start: startTime,
            end: endTime,
            notes: notes,
            plants: plants,
          }),
        }
      )
    } catch (e) {
      console.log("HIT CATCH: ", e)
    }
    setNewEvent(newEvent + 1)
    setDateSelect({} as DateSelectArg)
  }

  const onModalClose = () => {
    setIsOpened(false)
    setSelectedEvent({} as EventClickArg)
    setDateSelect({} as DateSelectArg)
    setEventAction("")
    setStartTime("")
    setEndTime("")
    setNotes("")
    setAddPlantIds([])
    setEventPlantIds([])
  }

  return (
    <div>
      <Header />
      <h3>Calendar</h3>
      {user.id ? (
        <>
          <div style={{ width: "80%" }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              editable={true}
              // Set below to false to turn off drag and dropo
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends
              events={events}
              // --------------- DONT TOUCH ANYTHING ABOVE HERE ------------- //
              // fire a function here when the user clicks on any date without an event or on a date with an event but not clicking the actual event
              select={onDateSelect}
              // Render JSX from the function provided, use the argument caught in the function to get the event's info
              eventContent={renderEventContent}
              // When an event is clicked
              eventClick={onEventClick}
              // --------- Probably don't need these below ------ //
              // you can update a remote database when these fire:
              eventAdd={function () {}}
              eventChange={function () {}}
              eventRemove={function () {}}
              eventsSet={(e) => console.log("eventsSet", e)} // called after events are initialized/added/changed/removed
            />
          </div>
          <Modal isOpened={isOpened} onClose={onModalClose}>
            {selectedEvent.event && (
              <>
                <h2>{selectedEvent.event.title}</h2>
                <p>
                  {formatDate(selectedEvent.event.start)} -{" "}
                  {formatDate(selectedEvent.event.end)}
                </p>

                <input
                  value={editInput}
                  disabled={!isEditing}
                  onChange={onEditInput}
                />

                <button onClick={onEditClick}>
                  {isEditing ? "Save" : "Edit"}
                </button>
                <br />
                <br />
                {eventPlantIds &&
                  myPlants.map((plant) => (
                    <button
                      key={plant.id}
                      disabled={eventPlantIds.includes(plant.id)}
                      onClick={() => onEventPlantClick(plant)}
                    >
                      {plant.name}
                    </button>
                  ))}
              </>
            )}
            {dateSelect.start && (
              <>
                <p>New calendar event</p>
                {calendarAction.map((action) => (
                  <button
                    key={action}
                    onClick={() => onActionClick(action)}
                    disabled={eventAction === action}
                  >
                    {action}
                  </button>
                ))}
                <input placeholder="Start time" onChange={startInput} />
                <input placeholder="End time" onChange={endInput} />
                <input placeholder="Notes" onChange={notesInput} />
                <p>Click on plant to add to event!</p>
                {myPlants.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => onAddPlantClick(plant)}
                    disabled={addPlantIds.includes(plant.id)}
                  >
                    {plant.name}
                  </button>
                ))}
                <br />
                <br />
                <button
                  onClick={() => {
                    onAddEventClick()
                    setIsOpened(false)
                  }}
                >
                  Add Event
                </button>
              </>
            )}
          </Modal>
        </>
      ) : (
        <p>Please login to use this page</p>
      )}
    </div>
  )
}

export default Calendar
