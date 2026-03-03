import { baseUrl } from "@/lib/constant";
import axios from "axios";
import { useEffect, useState } from "react";

export const useApi =(endPoint,params={})=>{

    const [data, setData] =useState();
    const [load, setLoad] =useState(false);
    const [err, setErr] =useState(null);
    
    const getData=async()=>{
        try{
            setLoad(true);
            const response = await axios.get(`${baseUrl}/${endPoint}`,{params});
            setData(response.data);
            console.log(response.data);
            setLoad(false);
        }
        catch(err){
            setErr(err.message);
            setLoad(false);
        }
       
    }
    useEffect(()=>{
        getData();
    },[]);
    return{data,load,err};
}