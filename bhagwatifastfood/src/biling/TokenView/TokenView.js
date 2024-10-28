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
    const [voiceTest, setVoiceTest] = useState()
    const [tokenList, setTokenList] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // const voices = speechSynthesis.getVoices();
    // if (voices.length) {
    //     setVoiceTest(voices.find(voice => voice.name.includes("Google हिन्दी")) || voices[0])
    // }
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
    //     const loadVoice = () => {
    //         const voices = window.speechSynthesis.getVoices();
    //         const selectedVoice = voices.find(voice => voice.name.includes("Google हिन्दी")) || voices[0]

    //         if (selectedVoice) {
    //             setVoiceTest(selectedVoice); // Set voice only once
    //         }
    //     };
    //     loadVoice();
    //     window.speechSynthesis.onvoiceschanged = loadVoice; // Ensure voices are loaded
    // }, []);
    useEffect(() => {
        getTokenNumberList();
        // const keepAliveInterval = setInterval(() => {
        //     const silence = new SpeechSynthesisUtterance("");
        //     window.speechSynthesis.speak(silence);
        //     console.log('speak')
        // }, 2000);
        // return () => clearInterval(keepAliveInterval);
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

    function speakToken(tokenNumber) {

        // const setVoiceAndSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(`Token Number ${tokenNumber}`);
        // const voices = speechSynthesis.getVoices();
        // if (voices.length) {
        // const femaleVoice = voices.find(voice => voice.name.includes("Google हिन्दी")) || voices[0];
        // utterance.voice = voiceTest;
        window.speechSynthesis.speak(utterance);
        // window.speechSynthesis.cancel();
        console.log("Voice selected and speaking");
        // } else {
        //     console.log("No voices available");
        // }
        // };
        // if (speechSynthesis.getVoices().length) {
        //     // Voices already loaded
        //     setVoiceAndSpeak();
        // } else {
        //     // Retry with voiceschanged event
        //     speechSynthesis.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });

        //     // Fallback in case voiceschanged event doesn’t fire
        //     setTimeout(() => {
        //         if (!utterance.voice) {
        //             console.log("Retrying to fetch voices after delay");
        //             setVoiceAndSpeak();
        //         }
        //     }, 500);
        // }
    }


    // function selectFemaleVoice() {
    //     const voices = speechSynthesis.getVoices();
    //     const femaleVoices = voices.filter(voice => voice.name.includes("Google हिन्दी") || voice.name.includes("Google हिन्दी"));
    //     return femaleVoices.length ? femaleVoices[0] : voices[0];
    // }
    // const speakToken = (tokenNumber) => {
    //     window.speechSynthesis.cancel();
    //     const utterance = new SpeechSynthesisUtterance(`Token Number ${tokenNumber}`);
    //     utterance.voice = selectFemaleVoice();
    //     window.speechSynthesis.speak(utterance);
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
