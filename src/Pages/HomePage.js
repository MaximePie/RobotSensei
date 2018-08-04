import React from "react";
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Modal} from 'react-bootstrap';
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
            },
            open_modal : false
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
        let landing_component = null;
        let robot_component = null;
        let modal_content = null;
        if(trainer_infos)
        {
            trainer_name = trainer_infos.name;
            delete_infos_button = <ActionDelete className = "trash_icon" onClick ={()=>this.delete_infos()}/>;
            let landing_message = <span className="landing_message_wording">{"Salut " + trainer_name}</span>
            landing_component =
                <div className = "landing_message">
                    {landing_message}
                    {delete_infos_button}
                </div>;
            robot_component =
                <div className="robot_container">
                    <i className="material-icons md-light quest_button" onClick={() => this.open_quest_interface()}>error</i>
                    <img alt = "robot" className="robot_image" src = {robot_image}/>

                </div>;

            modal_content =
                <Modal style={{ top: "38%" }} show={this.state.open_modal} onHide = {this.close_quest_interface} onClose={this.close_quest_interface}>
                    <Modal.Body className = "robot">
                        <div className = "robot_message">
                            <div className = "speaking_character_name">
                                Mister Good Bot :
                            </div>
                            <div className = "quest_speech">
                                01001010 00100111 01100001 01101001 00100000 01100110 01100001 01101001 01101101 00100000 00100001
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
        }
        else //No trainer infos
        {
            landing_component = this.set_input_name_container();
        }




        return(
            <div className = "landing_page">
                {landing_component}
                {robot_component}
                {modal_content}
            </div>
        )
    }

    //Modal relative functions
    open_quest_interface = () => {
        this.setState({ open_modal: true });
    };

    close_quest_interface = () => {
        this.setState({ open_modal: false });
    };

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

    //Called when there are no info about the user yet
    //Returns a component with a TextField and a Validate button
    set_input_name_container() {
        let error_message = this.state.trainer_name_field.error;
        let error_text;
        let input_name_container;

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
            </div>;

        return input_name_container;
    }
}