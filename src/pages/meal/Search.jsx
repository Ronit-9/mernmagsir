import { useSearchParams } from 'react-router-dom';
import { useApi } from "../../hooks/apiHook.js";
import { useNavigate } from "react-router-dom";

export default function Search() {
   const [searchParams , setSearchParams] = useSearchParams();
 const nav= useNavigate();

   const { data, load, err } = useApi("search.php", { s:  searchParams.get('s') });
   if (load) {
    return <h1>Loading...</h1>
  }
  if (err) {
    return <h1 className="text-red-700">{err}</h1>
  }
  return (
    <div className='grid grid-cols-3'>
      {  data?.meals?.map((meal) => {
        return (
          <div key={meal.idMeal} className='text-white p-4 cursor-pointer hover:bg-gray-800 rounded-lg' onClick={() => nav(`/meal/${meal.idMeal}`)}>
            <h1>{meal.strMeal}</h1>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h2>{meal.strCategory}</h2>
            <h2>{meal.strArea}</h2>
           
      
          </div>
        )
      })}
    </div>
  )
}
