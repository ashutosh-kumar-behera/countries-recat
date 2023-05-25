import { useEffect, useState } from 'react'
import { CountryCard } from './CountryCard'
import { CountriesListShimmer } from './CountriesListShimmer';

export const CountriesList = ({query}) => {

  const[countriesData,setCountriesData]=useState([]);

  useEffect(()=>{
    fetch('https://restcountries.com/v3.1/all')
    .then((res)=>res.json())
    .then((data) => setCountriesData(data))
  },[])

  if(!countriesData.length){
    return(
      <CountriesListShimmer/>
    )
  }

  return (
      <div className='countries-container'>
        {countriesData.filter((country) =>
            country.name.common.toLowerCase().includes(query) || country.region.toLowerCase().includes(query)
          )
          .map((country)=>{
            return <CountryCard 
              key={country.name.common}
              flags={country.flags.svg}
              name={country.name.common}
              population={country.population.toLocaleString('en-IN')}
              region={country.region}
              capital={country.capital?.[0]}
              data={country}
            />
          })
        }
      </div>
  )
}
