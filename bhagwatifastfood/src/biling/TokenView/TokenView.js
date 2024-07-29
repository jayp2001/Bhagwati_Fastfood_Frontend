import React, { useEffect, useRef, useState } from 'react';
import { BACKEND_BASE_URL, SOCKET_URL } from '../../url';
import axios from 'axios';
import io from 'socket.io-client';
import Video from './with_you.mp4';
import FullScreenVideo from './videoPlayer';
import './video.css'

const TokenView = () => {
    const boxStyle = {
        height: '155px',
        width: '155px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '30px',
        backgroundColor: 'red'
    };

    const [tokenList, setTokenList] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("speakToken", (message) => {
            console.log('message', message)
            getTokenNumberList();
            if (message) {
                speakToken(message)
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const videoRef = useRef(null);

    // useEffect(() => {
    //     const videoElement = videoRef.current;
    //     const enterFullScreen = async () => {
    //         if (videoElement && document.fullscreenElement !== videoElement) {
    //             try {
    //                 await videoElement.requestFullscreen();
    //             } catch (err) {
    //                 console.error('Error attempting to enable full-screen mode:', err);
    //             }
    //         }
    //     };

    //     enterFullScreen();
    // }, []);

    useEffect(() => {
        getTokenNumberList();
    }, []);

    const getTokenNumberList = async () => {
        try {
            const res = await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDisplayTokenNumbr`, config);
            console.log('Response Data', res);
            setTokenList(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = (tokenNumber) => {
        speakToken(tokenNumber);
    };
    function selectFemaleVoice() {
        const voices = speechSynthesis.getVoices();
        const femaleVoices = voices.filter(voice => voice.name.includes("Google हिन्दी") || voice.name.includes("Google हिन्दी"));
        return femaleVoices.length ? femaleVoices[0] : voices[0];
    }
    const speakToken = (tokenNumber) => {
        const utterance = new SpeechSynthesisUtterance(`Token Number ${tokenNumber}`);
        utterance.voice = selectFemaleVoice();
        speechSynthesis.speak(utterance);
    };
    // const tokenQueue = [];
    // let isSpeaking = false;

    // const speakToken = (tokenNumber) => {
    //     // Add token to the queue
    //     tokenQueue.push(tokenNumber);
    //     processQueue();
    // };

    // const processQueue = () => {
    //     if (isSpeaking || !tokenQueue.length) {
    //         return;
    //     }

    //     isSpeaking = true;
    //     const tokenNumber = tokenQueue.shift(); // Get the next token from the queue
    //     const utterance = new SpeechSynthesisUtterance(⁠ Token Number ${ tokenNumber } ⁠);

    //     function selectFemaleVoice() {
    //         const voices = speechSynthesis.getVoices();
    //         const femaleVoices = voices.filter(voice => voice.name.includes("Google हिन्दी") || voice.name.includes("Google हिन्दी"));
    //         return femaleVoices.length ? femaleVoices[0] : voices[0];
    //     }

    //     utterance.voice = selectFemaleVoice();

    //     utterance.onend = () => {
    //         isSpeaking = false;
    //         processQueue(); // Process the next token in the queue
    //     };

    //     utterance.onerror = () => {
    //         isSpeaking = false;
    //         processQueue(); // Process the next token in the queue even if there's an error
    //     };

    //     speechSynthesis.speak(utterance);
    // };

    const responce = () => {
        if (tokenList.length) {
            return (
                <div style={{ paddingRight: '40px', paddingLeft: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                        {tokenList.map((val, index) => (
                            <div key={index} style={{ width: 'fit-content', display: 'flex' }}>
                                <div style={boxStyle} onClick={() => handleClick(val.tokenNo)}>
                                    <p style={{ fontSize: '78px', fontWeight: 'bold', color: 'white' }}>{val.tokenNo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{ width: '100%', height: '100%' }}>
                    <video ref={videoRef} src={Video} autoPlay loop muted style={{ width: '100%', height: '100%' }} />
                </div>
            )
        }
    }
    return (
        responce()
        // <div style={{ paddingRight: '40px', paddingLeft: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
        //     {tokenList.length > 0 ? (
        //         <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        //             {tokenList.map((val, index) => (
        //                 <div key={index} style={{ width: 'fit-content', display: 'flex' }}>
        //                     <div style={boxStyle} onClick={() => handleClick(val)}>
        //                         <p style={{ fontSize: '78px', fontWeight: 'bold', color: 'white' }}>{val.tokenNo}</p>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     ) : (
        //         <video ref={videoRef} src={Video} autoPlay loop muted style={{ width: '100%', height: '100%' }} />
        //     )}
        // </div>
    );
}

export default TokenView;
