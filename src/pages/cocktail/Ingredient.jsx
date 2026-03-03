import { useParams } from "react-router-dom"
import { useApi } from "../hook/apiHook"


export default function Ingredient() {
   const {id}=useParams();
   const{data,load,err}=useApi("lookup.php",{i:id});
  if (load) {
  return <h1>Loading...</h1>
}
 if (err) {
  return <h1 className="text-red-700">{err}</h1>
}




  return (
    
    <div className="p-4 text-white w-3/5 mx-auto">
    
     {data && data.drinks.map((drink)=>{
       const ingredients = [];
        for (let i = 1; i <= 15; i++) {
          const ing = drink[`strIngredient${i}`];
          if (ing!=null) {
            ingredients.push(ing);
          }
        }
      return(
       <div key={drink.idDrink}>
        <h1 className="text-center text-orange-400 p-3">{drink.strDrink}</h1>
        <img src={drink.strDrinkThumb} alt="" />
           <h2 className="text-center text-blue-400">{drink.strAlcoholic} Drink</h2>
          <h2 className="text-yellow-300">Items used for making this</h2>
        {ingredients && ingredients.map((ing,id)=>(
              <ul key={id} className="list-disc ml-6">
              <li>{ing}</li>
            </ul>
        ))}
        <p> <span className="text-green-400">Instruction:</span> {drink.strInstructions}</p>
    
       </div>
     )})}
    </div>
  )
}
