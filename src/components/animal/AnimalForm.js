import { useState, useEffect } from "react"
import { addAnimal, updateAnimal, getAnimalById } from "../../managers/animals"
import { getCustomers } from "../../managers/customers"
import { getLocations } from "../../managers/locations"
import { useParams, useNavigate } from 'react-router-dom'

export const AnimalForm = () => {
  const [locations, setLocations] = useState([])
  const [customers, setCustomers] = useState([])
  const { animalId } = useParams()
  const [animal, setAnimal] = useState({})
  const navigate = useNavigate()

  const handleControlledInputChange = (event) => {
    const newAnimal = Object.assign({}, animal)
    newAnimal[event.target.name] = event.target.value
    setAnimal(newAnimal)
  }

  useEffect(() => {
    getLocations().then(setLocations)
    getCustomers().then(setCustomers)
  }, [])

  useEffect(() => {
    if (animalId) {
      getAnimalById(animalId).then((res) => {
        setAnimal(res)
      })
    }
  }, [animalId])

  const constructNewAnimal = () => {
    const locationId = parseInt(animal.location_id)

    if (locationId === 0) {
      window.alert("Please select a location")
    } else {
      if (animalId) {
        // PUT
        updateAnimal({
          id: animal.id,
          name: animal.name,
          breed: animal.breed,
          locationId: Number(animal.location_id),
          status: animal.status,
          customerId: Number(animal.customer_id)
        })
          .then(() => navigate("/animals"))
      } else {
        // POST
        addAnimal({
          name: animal.name,
          breed: animal.breed,
          locationId: Number(animal.locationId),
          status: animal.status,
          customerId: Number(animal.customer_id)
        })
          .then(() => navigate("/animals"))
      }
    }
  }

  return (
    <form className="animalForm">
      <h2 className="animalForm__title">{animalId ? "Update Animal" : "Admit Animal"}</h2>
      <fieldset>
        <div className="form-group">
          <label htmlFor="name">Animal name: </label>
          <input type="text" name="name" required autoFocus className="form-control"
            placeholder="Animal name"
            defaultValue={animal.name}
            onChange={handleControlledInputChange}
          />
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="breed">Animal breed: </label>
          <input type="text" name="breed" required className="form-control"
            placeholder="Animal breed"
            defaultValue={animal.breed}
            onChange={handleControlledInputChange}
          />
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="locationId">Location: </label>
          <select name="locationId" className="form-control"
            value={animal.location_id}
            onChange={handleControlledInputChange}>

            <option value="0">Select a location</option>
            {
              locations.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))
            }
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="customer_id">Customer: </label>
          <select name="customer_id" className="form-control"
            value={animal.customer_id}
            onChange={handleControlledInputChange}>

            <option value="0">Select a customer</option>
            {
              customers.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))
            }
          </select>
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label htmlFor="treatment">Status: </label>
          <textarea type="text" name="status" className="form-control"
            value={animal.status}
            onChange={handleControlledInputChange}>
          </textarea>
        </div>
      </fieldset>
      <button type="submit"
        onClick={evt => {
          evt.preventDefault()
          constructNewAnimal()
        }}
        className="btn btn-primary">
        {animalId ? "Save Updates" : "Make Reservation"}
      </button>
    </form>
  )
}
