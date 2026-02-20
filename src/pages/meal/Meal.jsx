import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { baseUrl } from "../../lib/constant"
export default function Meal() {
   const{id} = useParams();
    console.log(id);

  const [data, setData] = useState();
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState();



  const getData = async () => {
    try {
      setLoad(true);
      const response = await axios.get(`${baseUrl}/lookup.php`, {
        params: {
          i: id
        }
      });

      setData(response.data);
      console.log(response.data);
      setLoad(false);

    } catch (err) {
      setErr(err.message);
      setLoad(false);

    }
  }


  useEffect(() => {
    getData();

  }, []);

  if (load) {
    return <h1>Loading...</h1>
  }
  if (err) {
    return <h1 className="text-red-700">{err}</h1>
  }

   
  return (
    <div className=" text-white gap-5">
      {data && data.meals.map((meal) => {
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
