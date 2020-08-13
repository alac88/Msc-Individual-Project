import React from 'react';
import './Card.scss'

interface Props {
    select(): any,
    id: number,
    name: string,
    packageName: string,
    version: string,
    category: string,
    price: number,
    ratings: number

}

function Card(props: Props){

    return (
        // <div className="card">
        <div onClick={() => props.select()} className="card">

            <div className="mainRow">

                <div className="id"> 
                    {props.id}
                </div>

                <div className="info"> 
                    {props.name}
                </div>

                <div className="info"> 
                    {props.packageName}
                </div>

                <div className="info"> 
                    {props.version}
                </div>
                
                <div className="info"> 
                    {props.category}
                </div>
                
                <div className="info"> 
                    {props.price}
                </div>

                <div className="info"> 
                    {props.ratings}
                </div>

                <div className="download"></div>

            </div>

            <div className="hiddenRow"></div>


        </div>
    )


}

export default Card;
