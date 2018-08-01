import React from "react";
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import robot_image from "../Ressources/robot_image.png"
import { Cookies } from 'react-cookie';

import ActionDelete from 'material-ui/svg-icons/action/delete';

//Importing styles
import "../Styles/dist/Homepage.css";


const cookies_manager = new Cookies();

export default class SurveyPage extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            trainer_infos: {},
            trainer_name_field : {
                is_empty:true,
                error : 'ok'
            }
        }
    }

    componentWillMount(){
        this.load_infos();
    }


    handle_trainer_name_submit() {
        let trainer_name_field = this.refs.trainer_name;
        let trainer_name_field_state = this.state.trainer_name_field;
        if(trainer_name_field)
        {
            let trainer_name = trainer_name_field.input.value;

            if(this.state.trainer_name_field.is_empty) //Si vide
            {
                trainer_name_field_state.error = "empty";
                this.setState({
                    trainer_name_field : trainer_name_field_state
                });
                return;
            }

            let trainer_infos = {
                name:trainer_name
            };
            cookies_manager.set('trainer_infos', trainer_infos);
            this.setState({
                trainer_name_field : trainer_name_field_state
            });
            this.load_infos();
        }
    }

    render(){

        let trainer_infos = this.state.trainer_infos;
        let trainer_name = "!";
        let delete_infos_button = null;
        let input_name_container = null;
        if(trainer_infos)
        {
            trainer_name = trainer_infos.name;
            delete_infos_button = <ActionDelete onClick ={()=>this.delete_infos()}/>
        }
        else //No trainer infos
        {
            let error_message = this.state.trainer_name_field.error;
            let error_text;

            if(error_message === "empty")
            {
                error_text = "Vous devez renseigner un nom d'éleveur ! Comment votre robot connaîtra-t'il ses parents après ?"
            }
            else
            {
                error_text = ""
            }

            input_name_container =
                <div className="name_input_container">
                    <TextField
                        onChange={(e) => this.handle_trainer_name_change(e)}
                        ref = "trainer_name"
                        floatingLabelText="Votre nom d'éleveur"
                        errorText={error_text}
                    />
                    <FlatButton onClick={() => this.handle_trainer_name_submit ()} label="Valider" />
                </div>
        }
        let landing_message = "Salut " + trainer_name;

        let landing_component =
            <div className = "landing_message">
                {landing_message}
                {delete_infos_button}
            </div>;


        return(
            <div className = "landing_page">
                {landing_component}
                {input_name_container}
                <div className="robot_image_container">
                    <img alt = "robot" className="robot_image" src = {robot_image}/>
                </div>
            </div>
        )
    }

    //Called by clicking the trash component, removes trainer info to completely reset
    delete_infos() {
        cookies_manager.remove('trainer_infos');
        this.load_infos();
    }

    //Will get the cookies infos and update, like a refresh with new data
    load_infos() {

        let trainer_infos = cookies_manager.get('trainer_infos');
        let trainer_name_field = {
            is_empty:true,
            error : 'ok'
        };
        this.setState({
            trainer_infos,
            trainer_name_field
        })
    }

    handle_trainer_name_change(e) {
        let trainer_name_field = this.state.trainer_name_field;
        if(e.target.value === "")
        {
            trainer_name_field.is_empty = true;
        }
        else
        {
            trainer_name_field.error = "ok";
            trainer_name_field.is_empty = false;
        }

        this.setState({
            trainer_name_field
        })
    }
}