import React, { useState, useEffect } from "react";
import "./Chatbox.css";
import { questions } from "./questions";
import axios from "axios"

function Chatbox({ handleClose, open }) {
  const [list, setList] = useState([]);
  const [ques, setQues] = useState(0);
  const [faq, setFaq] = useState(false);
  const [startBtn, setStartBtn] = useState(false);
  const [botImg, setBotImg] = useState(true);
  const [inputValue, setInputValue] = useState("");
  
  useEffect(() => {
    if (faq && ques < questions.length) {
      setTimeout(() => {
        setQues((prev) => prev + 1);
        setList([...list, questions[ques]]);
      }, 1500);
    } else if (ques === questions.length) {
      setStartBtn(true);
    }
  }, [list, faq, ques]);

  useEffect(() => {
    setTimeout(() => {
      setFaq(true);
    }, 2000);
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
      axios.post(process.env.REACT_APP_API_URL+'/similar_qns', {
        input_qn: inputValue
      })
      .then(response => {
        // handle the response from the Flask API
        const newlist = [...list,...response.data]; 
        setList(newlist.slice(-3));
        setInputValue("");

      })
      .catch(error => {
        // handle any errors
        console.error(error);
      });
  
    }
  };;
  const handleLinkClink = (link)=>{
    window.open(link,"_blank");
  }

  return (
    <div id="chatbox">
      <div className="chatbox-wrapper">
        <div className="chatbox-top">
          <h1>FAQ Bot</h1>
          <h2>Hello 👋</h2>
          <div className="chatbox-intro">
            <p>
              Ask me any question you have and I'll try to find an answer for
              you from our FAQ.
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
                  list.map((question, key) => (
                    <li key={key} onClick={()=>handleLinkClink(question.link)} className="chat-qn">
                      <span>⦿</span>
                      {question.qn}
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
