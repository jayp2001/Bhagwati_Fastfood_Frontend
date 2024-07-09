import React, { useEffect, useState } from 'react';
import { BACKEND_BASE_URL, SOCKET_URL } from '../../url';
import axios from 'axios';
import io from 'socket.io-client';
import Video from './with_you.mp4'

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

    const speakToken = (tokenNumber) => {
        const utterance = new SpeechSynthesisUtterance(`Token Number ${tokenNumber}`);
        speechSynthesis.speak(utterance);
    };


    return (
        <div style={{ paddingRight: '40px', paddingLeft: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
            {tokenList.length > 0 ? (
                <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                    {tokenList.map((val, index) => (
                        <div key={index} style={{ width: 'fit-content', display: 'flex' }}>
                            <div style={boxStyle} onClick={() => handleClick(val)}>
                                <p style={{ fontSize: '78px', fontWeight: 'bold', color: 'white' }}>{val.tokenNo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <video autoPlay playsInline style={{ width: '100%', height: 'auto' }}>
                    <source src={Video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
}

export default TokenView;
