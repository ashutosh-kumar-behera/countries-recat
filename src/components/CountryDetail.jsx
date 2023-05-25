import React, { useContext, useEffect, useState } from "react";
import { useParams,useNavigate, Link, useLocation} from "react-router-dom";
import './CountryDetail.css'
import { UserContext } from "../App";
import CountryDetailShimmer from "./CountryDetailShimmer";

export const CountryDetail = () => {

    // const countryName = new URLSearchParams(window.location.search).get('name');
    const params = useParams();
    const countryName = params.country
    const[countryData, setCountryData]=useState(null);
    const[notFound, setNotFound]=useState(false);
    const {state} = useLocation()
    const navigate = useNavigate();
    const [isDark] =useContext(UserContext)

    const updateCountryData = (data)=>{
        setCountryData({
            flags: data.flags.svg,
            name: data.name.common,
            nativeName: data.name.nativeName && Object.values(data.name.nativeName)[0].common,
            population: data.population && data.population,
            region: data.region && data.region,
            subregion: data.subregion && data.subregion,
            capital: data.capital && data.capital.join(', '),
            currencies:data.currencies &&  Object.values(data.currencies)
                .map((currency) => currency.name)
                .join(', '),
            languages: data.languages && Object.values(data.languages).join(', '),
            // borders: data.borders && data.borders,
            borders: []
        });
        
        if(!data.borders){
            data.borders = []
        }

        Promise.all(
            data.borders.map((border)=>{
                return fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                .then((res)=> res.json())
                .then(([borderCountry])=> borderCountry.name.common)
            })
        ).then((borders)=>{
            setTimeout(() => setCountryData((prevState) => ({ ...prevState, borders })))
        })

    }

    useEffect(()=>{
        if(state){
            updateCountryData(state.data);
            return;
        }
        fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then((res)=> res.json())
        .then(([data])=> {
            updateCountryData(data);
        })
        .catch((error)=>{
            console.log(error);
            setNotFound(true)
        })
    }, [countryName,state])
    
    if(notFound){
        return(
            <h2>Country Not Found</h2>
        )
    }

    return(
        countryData === null ? <h1>Loading...</h1> : (
            <main className={`${isDark?"dark":""}`}>
                <div className="country-details-container">
                    <span className="back-button" 
                        // onClick={()=> window.history.back()}
                        onClick={()=> navigate(-1)}
                        >
                        <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
                    </span>
                    {countryData === null ? (
                        <CountryDetailShimmer/>
                    ) : (
                    <div className="country-details">
                        <img src={countryData.flags} alt="flags"/>
                        <div className="details-text-container">
                            <h1>{countryData.name}</h1>
                            <div className="details-text">
                                <p><b>Native Name: </b><span className="native-name">{countryData.nativeName}</span></p>
                                <p><b>Population: </b><span className="population">{countryData.population.toLocaleString('en-IN')}</span></p>
                                <p><b>Region: </b><span className="region">{countryData.region}</span></p>
                                <p><b>Sub Region: </b><span className="sub-region">{countryData.subregion}</span></p>
                                <p><b>Capital: </b><span className="capital">{countryData.capital}</span></p>
                                <p>
                                    <b>Top Level Domain: </b><span className="top-level-domain">{countryData.tld}</span>
                                </p>
                                <p><b>Currencies: </b><span className="currencies">{countryData.currencies}</span></p>

                                <p><b>Languages: </b><span className="languages">{countryData.languages}</span></p>
                            </div>
                            {
                                countryData.borders.length !==0 &&
                                <div className="border-countries"><b>Border Countries: </b>&nbsp;{
                                countryData.borders.map((border)=> <Link to={`/${border}`} key={border}>{border}</Link>)
                            }</div>}
                        </div>
                    </div>
                    )}
                </div>
            </main>
        )
    )
}
