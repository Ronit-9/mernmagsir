
import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/apiHook.js";

export default function Meal() {
   const{id} = useParams();
    const { data, load, err } = useApi("lookup.php", { i: id });



  if (load) {
    return <h1>Loading...</h1>
  }
  if (err) {
    return <h1 className="text-red-700">{err}</h1>
  }

   
  return (
    <div className=" text-white gap-5">
      {data?.meals?.map((meal) => {
        return (
          <div key={meal.idMeal}>
            <h1>{meal.strMeal}</h1>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h2>{meal.strCategory}</h2>
            <h2>{meal.strArea}</h2> 
            <p>{meal.strInstructions}</p>
       <iframe width="420" height="315"
              src={`https://www.youtube.com/embed/${meal.strYoutube.split('=')[1]}`}>
            </iframe>

          </div>
        )
      })}
    </div>  
  )
}
