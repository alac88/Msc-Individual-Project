import React from 'react';
import {
    PieChart, Pie, ComposedChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend,
  } from 'recharts';
import './Graphs.scss'

function Graphs(props : any){
    
    return (
        <div className="graphs">
            
            <ResponsiveContainer height={750} width="100%">
                <PieChart style={{width: "100%"}}>
                    <Pie dataKey="value" data={props.data} fill="#8884d8" label={(entry) => entry.name} />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer height={750} width="100%">
                <ComposedChart data={props.data}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" barSize={20} fill="#413ea0" />
                </ComposedChart>
            </ResponsiveContainer>

        </div> 
       
    )


}

export default Graphs;
