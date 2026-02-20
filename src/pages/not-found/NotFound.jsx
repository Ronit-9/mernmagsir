import { NavLink } from "react-router";

export default function NotFound() {
  return (
    <div>

      <h1>Page Not Found</h1>
      <NavLink to={'/'}>Go back</NavLink>
    </div>
  )
}