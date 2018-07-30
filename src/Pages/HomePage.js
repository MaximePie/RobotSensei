import React from "react";

import robot_image from "../Ressources/robot_image.png"

//Importing styles
import "../Styles/dist/Homepage.css";

export default class SurveyPage extends React.Component {
    render(){
        return(
            <div>
                <div className = "landing_message">
                    Salut !
                </div>
                <div>
                    <img alt = "robot" className="robot_image" src = {robot_image}/>
                </div>
            </div>
        )
    }
}