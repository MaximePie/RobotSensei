import React from "react";
import TextField from 'material-ui/TextField';

import robot_image from "../Ressources/robot_image.png"

//Importing styles
import "../Styles/dist/Homepage.css";

export default class SurveyPage extends React.Component {
    render(){
        return(
            <div className = "landing_page">
                <div className = "landing_message">
                    Salut !
                </div>
                <div className="name_input_container">
                    <TextField/>
                </div>
                <div className="robot_image_container">
                    <img alt = "robot" className="robot_image" src = {robot_image}/>
                </div>
            </div>
        )
    }
}