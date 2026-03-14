export async function getCars(query:string){

 const res = await fetch(
   `http://localhost:8000/cars?${query}`
 )

 return res.json()
}