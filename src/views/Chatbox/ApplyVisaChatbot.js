import React, { useState, useEffect } from "react";
import "./Chatbox.css";
import bot from "./bot";

function Chatbox({ handleClose, open }) {
  const [list, setList] = useState([{isbot:true,text:"Please enter your application type (visa or permit):"}]);
  const [faq, setFaq] = useState(false);
  const [startBtn, setStartBtn] = useState(false);
  const [botImg, setBotImg] = useState(true);
  const [inputValue, setInputValue] = useState("");
  
  bot.setExit(handleClose);
  bot.setHost(process.env.REACT_APP_API_URL);
  useEffect(() => {
    setTimeout(() => {
      setFaq(true);
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setBotImg(!botImg);
    }, 2000);
  }, [botImg, open]);

  const handleStartConvo = () => {
    setList([]);
    setStartBtn(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  const handleSubmit = () => {
    if (inputValue) {
      // send the input value to the Flask API
      const resp = bot.run(inputValue);
      if(typeof resp === 'string'){
        const newlist = [...list,{isbot:true,text:resp}]; 
        setList(newlist.slice(-3));
        setInputValue("");
      }else{
        const newlist = [...list,{isbot:true,text:"Please wait..."}];
        setList(newlist.slice(-3));
        setInputValue("");
        resp.then((res)=>{
          newlist.push({isbot:true,text:"click to view application",link:res.data["link"]});
          setList(newlist.slice(-3));
          bot.reset();
        });
      }
    }
  };;

  const handleLinkClick = (lnk)=>{
    if(lnk){
      window.open(lnk,"_blank");
    }
  }

  return (
    <div id="chatbox">
      <div className="chatbox-wrapper">
        <div className="chatbox-top">
          <h1>Visa Bot</h1>
          <h2>Hello 👋</h2>
          <div className="chatbox-intro">
            <p>
              I will guide you through visa application process.
            </p>
          </div>
        </div>

        <div className="faq-wrapper">
          {/* <div className="bot-img-back">
                        <img src="./bot.svg" alt="bot" />
                    </div> */}
          <div className="bot-img">
            <img src="./bot.svg" alt="bot" />
          </div>
          <div className="faq-lists">
            {faq && (
              <ul>
                {list.length > 0 &&
                  list.map((message, key) => (
                    <li key={key} className="chat-qn" onClick={()=>handleLinkClick(message.link)}>
                      {message.isbot ? <span>⦿</span> : null}
                      {message.text}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          {startBtn ? (
            <div className="start-btn">
              <button onClick={handleStartConvo}>
                <img src="./speech.svg" alt="speech ballon" />{" "}
                <p>Start a New Conversation</p>
              </button>
            </div>
          ) : (
            <div className="chatbox-input">
              <input
                type="text"
                placeholder="Type your question here"
                value={inputValue}
                onChange={handleInputChange}
                className="form-control"
              />
              &nbsp;
              <button onClick={handleSubmit} className="btn-send">
                Send
              </button>
            </div>
          )}
        </div>
        <button className="close-btn" onClick={handleClose}>
          close
        </button>
      </div>
    </div>
  );
}

export default Chatbox;
