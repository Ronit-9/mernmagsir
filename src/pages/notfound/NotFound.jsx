import { NavLink } from "react-router-dom"

export default function NotFound() {
  return (
    <div>
         <h1>Go back to home page</h1>
         <NavLink to={'/'}>Go back</NavLink>
    </div>
  )
}
