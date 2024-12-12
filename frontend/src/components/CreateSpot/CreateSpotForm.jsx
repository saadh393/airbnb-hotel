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
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    description: "",
    name: "",
    price: "",
    previewImage: "",
    image1: "",
    image2: "",
    image3: "",
    image4: ""
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.country) newErrors.country = "Country is required"
    if (!formData.streetAddress)
      newErrors.streetAddress = "Street Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"

    if (!formData.description || formData.description.length < 30) {
      newErrors.description = "Description needs 30 or more characters"
    }

    if (!formData.name) newErrors.name = "Name is required"

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price per night is required"
    }

    if (!formData.previewImage) {
      newErrors.previewImage = "Preview Image URL is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (validateForm()) {
      const result = await dispatch(
        createSpot({
          ...formData,
          images: [
            formData.image1,
            formData.image2,
            formData.image3,
            formData.image4
          ].filter(Boolean)
        })
      )

      if (result.errors) {
        setErrors(result.errors)
      } else {
        navigate(`/spots/${result.id}`)
      }
    }
  }

  const isSubmitDisabled = () => {
    return (
      !formData.country ||
      !formData.streetAddress ||
      !formData.city ||
      !formData.state ||
      !formData.description ||
      !formData.name ||
      !formData.price ||
      !formData.previewImage
    )
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Create a New Spot</h1>

      {/* Location Section */}
      <section className={styles.formSection}>
        <h2>Where's your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>

        {errors.formError && (
          <div className={styles.formLevelError}>{errors.formError}</div>
        )}

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            Country
            <input
              className={styles.input}
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
            />
            {errors.country && (
              <span className={styles.error}>{errors.country}</span>
            )}
          </label>

          <label className={styles.label}>
            Street Address
            <input
              className={styles.input}
              name="streetAddress"
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={handleInputChange}
            />
            {errors.streetAddress && (
              <span className={styles.error}>{errors.streetAddress}</span>
            )}
          </label>

          <div className={styles.cityStateRow}>
            <label className={styles.label}>
              City
              <input
                className={styles.input}
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
              />
              {errors.city && (
                <span className={styles.error}>{errors.city}</span>
              )}
            </label>

            <label className={styles.label}>
              State
              <input
                className={styles.input}
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
              />
              {errors.state && (
                <span className={styles.error}>{errors.state}</span>
              )}
            </label>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className={styles.formSection}>
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>

        <textarea
          className={styles.textarea}
          name="description"
          placeholder="Please write at least 30 characters"
          value={formData.description}
          onChange={handleInputChange}
        />
        {errors.description && (
          <span className={styles.error}>{errors.description}</span>
        )}
      </section>

      {/* Spot Name Section */}
      <section className={styles.formSection}>
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>

        <input
          className={styles.input}
          name="name"
          placeholder="Name of your spot"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </section>

      {/* Price Section */}
      <section className={styles.formSection}>
        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>

        <input
          className={styles.input}
          type="number"
          name="price"
          placeholder="Price per night (USD)"
          value={formData.price}
          onChange={handleInputChange}
        />
        {errors.price && <span className={styles.error}>{errors.price}</span>}
      </section>

      {/* Photos Section */}
      <section className={styles.formSection}>
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>

        <div className={styles.photoInputs}>
          <label className={styles.label}>
            Preview Image URL
            <input
              className={styles.input}
              name="previewImage"
              placeholder="Preview Image URL"
              value={formData.previewImage}
              onChange={handleInputChange}
            />
            {errors.previewImage && (
              <span className={styles.error}>{errors.previewImage}</span>
            )}
          </label>

          {["image1", "image2", "image3", "image4"].map((imageName, index) => (
            <label key={imageName} className={styles.label}>
              Image URL {index + 1}
              <input
                className={styles.input}
                name={imageName}
                placeholder="Image URL"
                value={formData[imageName]}
                onChange={handleInputChange}
              />
            </label>
          ))}
        </div>
      </section>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isSubmitDisabled()}
      >
        Create Spot
      </button>
    </form>
  )
}

export default CreateSpotForm
