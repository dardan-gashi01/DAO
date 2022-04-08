import React, { useState } from 'react'

const MessageForm = ({messageFunc}) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        messageFunc(message);
        setMessage("");
    }

    return (
        <form className='flex flex-col mt-4' onSubmit={handleSubmit}>
            <label className='sr-only' htmlFor='message'>Message</label>
            <textarea
                id="message"
                className='rounded px-3 py-1 bg-slate-200 text-slate-900 focus:outline-none'
                placeholder='Leave a message...'
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
            />

            <button type='submit'>Submit</button>
        </form>
    )
}

export default MessageForm