import styles from "./LoginFormModal.module.css"
import { useState } from "react"
import * as sessionActions from "../../store/session"
import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"

function LoginFormModal() {
  const dispatch = useDispatch()
  const [credential, setCredential] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()

  const handleSubmit = e => {
    e.preventDefault()
    setErrors({})
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async res => {
        const data = await res.json()
        if (data && data.errors) {
          setErrors(data.errors)
        }
      })
  }

  const handleDemoLogin = () => {
    // Use predefined demo user credentials
    const demoCredential = "demo@user.io"
    const demoPassword = "password"

    setErrors({})
    return dispatch(
      sessionActions.login({
        credential: demoCredential,
        password: demoPassword
      })
    )
      .then(closeModal)
      .catch(async res => {
        const data = await res.json()
        if (data && data.errors) {
          setErrors(data.errors)
        }
      })
  }

  return (
    <>
      <h1 className={styles.heading}>Log In</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={e => setCredential(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        {errors.credential && (
          <p className={styles.error}>{errors.credential}</p>
        )}
        <button
          disabled={credential.length < 4}
          type="submit"
          className={styles.button}
        >
          Log In
        </button>
      </form>
      <button
        type="submit"
        onClick={() => handleDemoLogin()}
        className={styles.loginDemo}
      >
        Log In as Demo
      </button>
    </>
  )
}

export default LoginFormModal
