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
import { ICalendar } from "../interfaces"
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
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg>(
    {} as EventClickArg
  )
  const [dateSelect, setDateSelect] = useState<DateSelectArg>(
    {} as DateSelectArg
  )
  const { user } = useUser()

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
  }, [])

  function renderEventContent(events: EventInput) {
    return (
      <>
        <i>{events.event.title}</i>
        <b>{formatDate(events.event.start)}</b>
      </>
    )
  }

  const onEventClick = (e: EventClickArg) => {
    setSelectedEvent(e)
    setIsOpened(true)
  }

  const onDateSelect = async (e: DateSelectArg) => {
    // const response = await fetch()

    setDateSelect(e)
    setIsOpened(true)
  }

  const onModalClose = () => {
    setIsOpened(false)
    setSelectedEvent({} as EventClickArg)
    setDateSelect({} as DateSelectArg)
  }

  console.log("alllll", allEvents)
  console.log("selected", selectedEvent)

  return (
    <div>
      <Header />
      <h3>Calendar</h3>
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
            {allEvents.map((e) =>
              e.id.toString() === selectedEvent.event.id ? <p>{e.notes}</p> : ""
            )}
            <p>
              {formatDate(selectedEvent.event.start)} -{" "}
              {formatDate(selectedEvent.event.end)}
            </p>
            <p>List of plants here</p>
          </>
        )}
        {dateSelect.start && (
          <>
            <input placeholder="Enter action here" />
            <input placeholder="Start time" />
            <input placeholder="End time" />
            <input placeholder="Notes" />
          </>
        )}
      </Modal>
    </div>
  )
}

export default Calendar
