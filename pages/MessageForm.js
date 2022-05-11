//message form so the user can send messages on the blockchain
import React, { useState } from 'react'

//styling the button
const styles = {
    button:'bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-1 rounded-full w-64 my-3',
}

const MessageForm = ({messageFunc}) => {

    
    const [message, setMessage] = useState('');
    //handling the subit so if the user clicks the submit button it calls the function 
    const handleSubmit = (event) => {
        event.preventDefault();
        messageFunc(message);
        setMessage("");
    }

    return (
        <form className='flex flex-col mt-4' onSubmit={handleSubmit}>
            <label className='sr-only' htmlFor='message'>Message</label>
            {/* this is the text area the user can type in for the message and its stored as message*/}
            <textarea
                id="message"
                className='rounded px-3 py-1 bg-slate-200 text-slate-900 focus:outline-none'
                placeholder='Leave a message...'
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
            />
            {/* button to submite the message */}
            <center><button className={styles.button} type='submit'>Submit</button></center>
        </form>
    )
}
//exporting to use it in the chat.jsx page
export default MessageForm