import React, { useState, useEffect } from 'react';
import messageService from '../services/messageService';

const Messages = ({ userRole }) => {
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newMessage, setNewMessage] = useState({
        receiver_id: '',
        content: '',
    });

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const received = await messageService.getReceivedMessages();
                const sent = await messageService.getSentMessages();
                const teamId = localStorage.getItem('team_id');
                const contactsData = await messageService.getContacts(userRole, teamId);

                setReceivedMessages(received || []);
                setSentMessages(sent || []);
                setContacts(contactsData || []);
            } catch (err) {
                console.error('Error fetching messages:', err.response?.data || err.message);
                setError(err.response?.data?.error || 'Failed to fetch messages.');
            }
        };

        fetchMessages();
    }, [userRole]);

    const handleSendMessage = async () => {
        if (!newMessage.receiver_id || !newMessage.content) {
            setError('Please select a recipient and enter a message.');
            return;
        }

        try {
            await messageService.sendMessage(newMessage);
            setSuccess('Message sent successfully!');
            setNewMessage({ receiver_id: '', content: '' });
        } catch (err) {
            console.error('Error sending message:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Failed to send message.');
        }
    };

    return (
        <div className="messages-container">
            <h2>Messages</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            {/* Section d'envoi de message */}
            {/* Section d'envoi de message */}
            <div className="message-send">
                <h3>Send a New Message</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <select
                        value={newMessage.receiver_id}
                        onChange={(e) => setNewMessage({ ...newMessage, receiver_id: e.target.value })}
                        style={{ padding: '10px', width: '200px' }}
                    >
                        <option value="">Select Recipient</option>
                        {contacts.map((contact) => (
                            <option key={contact.id} value={contact.id}>
                                {contact.name}
                            </option>
                        ))}
                    </select>
                    <textarea
                        placeholder="Enter your message"
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                        style={{ padding: '10px', flex: 1, resize: 'none', height: '40px' }}
                    ></textarea>
                    <button
                        onClick={handleSendMessage}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>


            {/* Section des messages reçus */}
            <h3>Received Messages</h3>
            <table>
                <thead>
                <tr>
                    <th>From</th>
                    <th>Message</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {receivedMessages.length > 0 ? (
                    receivedMessages.map((msg) => (
                        <tr key={msg.id}>
                            <td style={{width: '20%', textAlign: 'center'}}>{msg.sender_name}</td>
                            <td
                                style={{
                                    width: '60%',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                onClick={() => alert(msg.message)} // Affiche le message complet en cliquant
                                title={msg.message} // Astuce pour survoler et lire
                            >
                                {msg.message}
                            </td>
                            <td style={{width: '20%', textAlign: 'center'}}>
                                {new Date(msg.timestamp).toLocaleString()}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" style={{textAlign: 'center'}}>No messages received.</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Section des messages envoyés */}
            <h3>Sent Messages</h3>
            <table>
                <thead>
                <tr>
                    <th style={{width: '20%', textAlign: 'center'}}>To</th>
                    <th style={{width: '60%', textAlign: 'center'}}>Message</th>
                    <th style={{width: '20%', textAlign: 'center'}}>Date</th>
                </tr>
                </thead>
                <tbody>
                {sentMessages.length > 0 ? (
                    sentMessages.map((msg) => (
                        <tr key={msg.id}>
                            <td style={{width: '20%', textAlign: 'center'}}>{msg.receiver_name}</td>
                            <td
                                style={{
                                    width: '60%',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                onClick={() => alert(msg.message)} // Affiche le message complet en cliquant
                                title={msg.message} // Astuce pour survoler et lire
                            >
                                {msg.message}
                            </td>
                            <td style={{width: '20%', textAlign: 'center'}}>
                                {new Date(msg.timestamp).toLocaleString()}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" style={{textAlign: 'center'}}>No messages sent.</td>
                    </tr>
                )}
                </tbody>

            </table>
        </div>
    );
};

export default Messages;
