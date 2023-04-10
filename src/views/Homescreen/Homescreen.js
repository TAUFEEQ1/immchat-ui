import React from 'react'
import './Homescreen.css'
import Chatbox from '../Chatbox/Chatbox';
import ApplyVisaChatbot from "../Chatbox/ApplyVisaChatbot";

function Homescreen() {
    const [bots, setBots] = React.useState({ applyVisa: false, base: true, current: "base" });

    const handleClose = (bot_name) => {
        setBots({ ...bots, [bot_name]: false });
    }

    const handleOpen = () => {
        setBots({ ...bots, base: true, current: "base" });
    }

    const toggleChatbot = (bot_name) => {
        const current = bots.current;
        handleClose(current);
        setBots({ ...bots, [bot_name]: true, current: bot_name });
    }

    const openLink = () => {
        window.open('https://github.com/TAUFEEQ1/chatbot-ui', '_blank');
    }

    const downloadFolder = () => {
        window.open('https://github.com/neeleshio/chatbot-ui/archive/refs/heads/master.zip', '_blank');
    }

    return (
        <div id="homescreen">
            <div className="project-info">
                <h1 className="welcome">WELCOME</h1>
                <h3>This is a demo bot for Immigrations FAQs</h3>
                <div className="buttons">
                    <button className="view" onClick={openLink}>View on Github</button>
                    <button className="download" onClick={downloadFolder}>Download folder</button>
                </div>
            </div>

            <div className="chat-box">
                {bots.base && <Chatbox handleClose={() => handleClose("base")} open={bots.base} toggleChatbot={toggleChatbot} />}
                {bots.applyVisa && <ApplyVisaChatbot handleClose={() => handleClose("applyVisa")} open={bots.applyVisa} />}
            </div>
            <div className="chat-button">
                <div className="tooltip">
                    Hi, how can I help you?
                </div>
                <button onClick={handleOpen}>
                    <img src="./chat.png" alt="chat-icon" />
                </button>
            </div>

            <h2 className="footer-text">FAQs BOT UI <img src="./chat.png" width="15px" height="15px" alt="chat-png" /></h2>

        </div >
    )
}

export default Homescreen
