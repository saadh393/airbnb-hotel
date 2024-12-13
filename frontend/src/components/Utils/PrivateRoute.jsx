import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

function PrivateRoute({ children }) {
  const currentUser = useSelector(state => state.session.user)

  return currentUser ? children : <Navigate to="/" replace />
}

export default PrivateRoute
