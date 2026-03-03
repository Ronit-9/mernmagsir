
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hook/apiHook';
import NonAlcoholic from './NonAlcoholic';

export default function Alcoholic() {
     const { data, load, err } = useApi("filter.php?a=Alcoholic");
     const nav =useNavigate();

 if (load) {
  return <h1>Loading...</h1>
}
 if (err) {
  return <h1 className="text-red-700">{err}</h1>
}

 
  return (
    <div>
        <h1 className='text-center'>Alcoholic</h1>
    <div className='grid grid-cols-4 gap-4 p-4 text-white w-4/5 mx-auto '>
      {data?.drinks?.slice(0, 8).map(drink => (
        <div key={drink.idDrink} className=" rounded p-2 cursor-pointer  hover-effect"  onClick={()=> nav(`/item/${drink.idDrink}`)}>
          <img
            src={drink.strDrinkThumb}
            alt={drink.strDrink}
            className="w-full h-auto rounded"
          />
          <h2 className="mt-2 font-semibold text-center">{drink.strDrink}</h2>
        </div>
      ))}
      
    </div>
   <hr className="border-t-2 w-4/5 mx-auto mb-7 mt-5" /> 
   <NonAlcoholic/>
</div>


  );
}

