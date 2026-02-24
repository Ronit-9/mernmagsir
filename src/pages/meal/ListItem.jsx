

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useApi } from "../../hooks/apiHook.js";

export default function ListItem() {
  const nav= useNavigate();

  const { label } = useParams();

  const { data, load, err } = useApi("filter.php", { c: label });

  if (load) {
    return <h1>Loading...</h1>
  }
  if (err) {
    return <h1 className="text-red-700">{err}</h1>
  }





  return (
    <div className="grid grid-cols-4 text-white gap-5">

      {data && data.meals.map((meal) => {
        return (
          <div key={meal.idMeal} className="flex flex-col justify-center items-center cursor-pointer" onClick={() => nav(`/meal/${meal.idMeal}`)}>  
            <img src={meal.strMealThumb} alt="" />
            <h1>{meal.strMeal}</h1>
          </div>
        )
      })}




    </div>
  )
}