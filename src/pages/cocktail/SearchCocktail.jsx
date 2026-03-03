import { useNavigate, useSearchParams } from "react-router-dom"
import { useApi } from "../hook/apiHook"


export default function SearchCocktail() {
  const nav=useNavigate();
    const [searchParams , setSearchParams]=useSearchParams();
    const s=searchParams.get('s');


    const {data,load,err}=useApi("search.php",{s})


  return (
          <div>
        <h1 className='text-center'>Alcoholic</h1>
    <div className=' grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-white w-4/5 mx-auto'>
      {data?.drinks?.slice(0, 8).map(drink => (
        <div key={drink.idDrink} className=" rounded p-2 cursor-pointer  hover-effect" onClick={()=> nav(`/item/${drink.idDrink}`)}>
          <img
            src={drink.strDrinkThumb}
            alt={drink.strDrink}
            className="w-full h-auto rounded "
          />
          <h2 className="mt-2 font-semibold text-center">{drink.strDrink}</h2>
        </div>
      ))}
      
    </div>
    </div>
  )
}
