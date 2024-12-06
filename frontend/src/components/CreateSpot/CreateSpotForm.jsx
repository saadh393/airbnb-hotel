import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createSpot } from "../../store/createspot"
import styles from "./CreateSpotForm.module.css"

function CreateSpotForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sessionUser = useSelector(state => state.session.user)

  useEffect(() => {
    if (!sessionUser) {
      navigate("/login")
    }
  }, [sessionUser, navigate])

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    lat: "",
    lng: "",
    name: "",
    description: "",
    price: "",
    previewImage: ""
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // const validateForm = () => {
  //   const newErrors = {}
  //   if (!formData.address) newErrors.address = "Street address is required"
  //   if (!formData.city) newErrors.city = "City is required"
  //   if (!formData.state) newErrors.state = "State is required"
  //   if (!formData.country) newErrors.country = "Country is required"
  //   if (!formData.lat || formData.lat < -90 || formData.lat > 90)
  //     newErrors.lat = "Latitude must be between -90 and 90"
  //   if (!formData.lng || formData.lng < -180 || formData.lng > 180)
  //     newErrors.lng = "Longitude must be between -180 and 180"
  //   if (!formData.name || formData.name.length > 50)
  //     newErrors.name = "Name must be less than 50 characters"
  //   if (!formData.description) newErrors.description = "Description is required"
  //   if (!formData.price || formData.price <= 0)
  //     newErrors.price = "Price must be a positive number"

  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log("Form Submitted!") // Debug: Check if form is submitted
    console.log("Form Data:", formData) // Debug: Verify form data

    setErrors({}) // Reset errors before validation

    const result = await dispatch(createSpot(formData))
    console.log("Result after Dispatch:", result) // Debug: Log result from createSpot

    if (result.errors) {
      setErrors(result.errors) // Show errors on the form
    } else {
      console.log("Redirecting to:", `/spots/${result.id}`)
      navigate(`/spots/${result.id}`) // Redirect to the new spot details page
    }
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Create a New Spot</h1>

      <label className={styles.label}>
        Street Address
        <input
          className={styles.input}
          name="address"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleInputChange}
        />
      </label>
      {errors.address && <p className={styles.error}>{errors.address}</p>}

      <label className={styles.label}>
        City
        <input
          className={styles.input}
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
        />
      </label>
      {errors.city && <p className={styles.error}>{errors.city}</p>}

      <label className={styles.label}>
        State
        <input
          className={styles.input}
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleInputChange}
        />
      </label>
      {errors.state && <p className={styles.error}>{errors.state}</p>}

      <label className={styles.label}>
        Country
        <input
          className={styles.input}
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleInputChange}
        />
      </label>
      {errors.country && <p className={styles.error}>{errors.country}</p>}

      <label className={styles.label}>
        Latitude
        <input
          className={styles.input}
          type="number"
          name="lat"
          placeholder="Latitude"
          value={formData.lat}
          onChange={handleInputChange}
        />
      </label>
      {errors.lat && <p className={styles.error}>{errors.lat}</p>}

      <label className={styles.label}>
        Longitude
        <input
          className={styles.input}
          type="number"
          name="lng"
          placeholder="Longitude"
          value={formData.lng}
          onChange={handleInputChange}
        />
      </label>
      {errors.lng && <p className={styles.error}>{errors.lng}</p>}

      <label className={styles.label}>
        Name
        <input
          className={styles.input}
          name="name"
          placeholder="Name of your spot"
          value={formData.name}
          onChange={handleInputChange}
        />
      </label>
      {errors.name && <p className={styles.error}>{errors.name}</p>}

      <label className={styles.label}>
        Description
        <textarea
          className={styles.textarea}
          name="description"
          placeholder="Please write at least 30 characters"
          value={formData.description}
          onChange={handleInputChange}
        />
      </label>
      {errors.description && (
        <p className={styles.error}>{errors.description}</p>
      )}

      <label className={styles.label}>
        Price per Night (USD)
        <input
          className={styles.input}
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
        />
      </label>
      {errors.price && <p className={styles.error}>{errors.price}</p>}

      <label className={styles.label}>
        Preview Image URL
        <input
          className={styles.input}
          name="previewImage"
          placeholder="Preview Image URL"
          value={formData.previewImage}
          onChange={handleInputChange}
        />
      </label>
      {errors.previewImage && (
        <p className={styles.error}>{errors.previewImage}</p>
      )}

      <button className={styles.submitButton} type="submit">
        Create Spot
      </button>
    </form>
  )
}

export default CreateSpotForm
