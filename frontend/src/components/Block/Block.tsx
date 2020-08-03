import React from 'react';
import './Block.scss';

interface Props{
    type: string,
    url: string
}

function Block(props: Props){

    function renderImageSwitch(){
        switch (props.type) {
            case "info":
                return (<img className="imgContainer" src="img/questions.jpg" />);
            case "statistics":
                return (<img className="imgContainer" src="img/stats.jpg"/>);
            case "git":
                return (<img className="imgContainer" src="img/github.png"/>);
            default:
                break;
        }

    }

    function renderTextSwitch(){
        switch (props.type) {
            case "info":
                return (<p>Need some information?</p>);
            case "statistics":
                return (<p>My crawler statistics</p>);                
            case "git":
                return (<p>Check out my GitHub!</p>);                
            default:
                break;
        }

    }

    return (
        <div className="blockContainer">
            <a href={props.url}>
                <div className="topSection">{renderImageSwitch()}</div>
                {/* <div className="topSection"></div> */}
                <div className="bottomSection">{renderTextSwitch()}</div>
            </a>
        </div>
    );
}

export default Block;