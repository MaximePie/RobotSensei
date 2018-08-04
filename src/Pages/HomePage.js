import React from "react";
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Modal} from 'react-bootstrap';
import { Cookies } from 'react-cookie';
import robot_image from "../Ressources/robot_image.png"
import pastecat from "../Ressources/pastecat.png"

import ActionDelete from 'material-ui/svg-icons/action/delete';
//Importing styles
import "../Styles/dist/Homepage.css";
import quest_data from "../Ressources/quest_list";


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
            quest:{},
            active_quest_step : 0,

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
            let landing_message = <span className="landing_message_wording">{"Salut " + trainer_name}</span>;
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
                    {this.set_speaker_image()}
                    <Modal.Body className = "robot">
                        <div className = "robot_message">
                            <div className = "speaking_character_name">
                                {this.set_speaker_name()}
                            </div>
                            <div className = "quest_speech">
                                {this.state.quest.quest_speech}
                            </div>
                            <div className="modal_navigation_buttons">
                                <i className="material-icons" onClick = {() => this.previous_text()}>
                                    keyboard_arrow_left
                                </i>
                                <i className="material-icons" onClick = {() => this.next_text()}>
                                    keyboard_arrow_right
                                </i>
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
        let quest = {};
        quest.quest_speech = quest_data["0"]["steps"][0]["quest_speech"];
        quest.speaker = quest_data["0"]["steps"][0]["speaker"];
        this.setState({
            trainer_infos,
            trainer_name_field,
            active_quest_step : 0,
            quest
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



    //Sets the modal content to the previous step
    previous_text() {

        //Can't go lower than 0
        if(this.state.active_quest_step === 0)
            return;

        let active_quest_step = this.state.active_quest_step - 1;
        this.setState({active_quest_step}, ()=>this.refresh_quest_interface())
    }

    //Sets the modal content to the previous step
    next_text() {
        //Can't go higher than max quest step
        if(this.state.active_quest_step === quest_data["0"]["max_step"])
            return;

        let active_quest_step = this.state.active_quest_step + 1;
        this.setState({active_quest_step}, ()=>this.refresh_quest_interface())
    }

    //Setting speaker image depending on who's speaking
    set_speaker_image() {

        if(this.state.quest.speaker === 'robot')
        {
            return <img alt = "robot" className="robot_image_quest" src = {robot_image}/>
        }
        else if (this.state.quest.speaker === 'pastecat')
        {
            return <img alt = "pastecat" className="pastecat_image_quest" src = {pastecat}/>
        }
        else
        {
            return null;
        }
    }

    set_speaker_name() {
        if(this.state.quest.speaker === 'robot')
        {
            return "Mister Good Bot"
        }
        else if (this.state.quest.speaker === 'pastecat')
        {
            return "Pastècat"
        }
        else
        {
            return null;
        }
    }

    //Set the quest content from the new quest step id
    refresh_quest_interface() {
        let active_quest_step = this.state.active_quest_step;
        let quest = this.state.quest;
        quest.speaker = quest_data["0"]["steps"][active_quest_step]["speaker"];
        quest.quest_speech = quest_data["0"]["steps"][active_quest_step]["quest_speech"];
        this.setState({
            quest
        })

    }
}