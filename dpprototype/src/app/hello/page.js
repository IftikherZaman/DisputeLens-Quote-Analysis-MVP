// Components in the App directory are server components by default
// client components run in the browser which is suitable for handling user input, managing state and interactive elements
'use client'; 

import styles from "./hello.css"; 
import { useState } from 'react'; // Import useState

export default function Hello() {
    // useState always returns an array with two elements: the current state and a function that updates it
    const [count, setCount] = useState(0); 

    const [str_name, setName] = useState(""); // Initialize a state variable to hold the user's name

    const [greeting, setGreeting] = useState("");

    // Set count is a defined by the useState hook in React
    function handleClick() {
        setCount(count + 1); 
    }

    function handleNameInput(event) {
        setName(event.target.value); // Update the name state variable with the value of the input field
    }

    function handleSubmit() {
        setGreeting("Hello, " + str_name + "!"); 
    }

    return (
        // JSX needs a parent element, so we wrap everything in <></>
        <> 
            <section id="first">
                <div id="test">
                    <p id="test_title_text">
                        Hello World
                    </p>
                    <button 
                        onClick={handleClick} 
                        id="test_button"
                    >
                        Hi {count} 
                    </button>
                </div>
            </section>

            <section id="second">
                <div id="test_get_name">
                    <input 
                        type="text" 
                        id="test_name_input" 
                        placeholder="Enter your name" 
                        value={str_name} // Have to put JS in {}
                        onChange={handleNameInput}
                    />
                    <button 
                        id="test_name_button"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </section>

            <section id="third">
                <div id="test_greeting">
                    {greeting}
                </div>
            </section>
        </>
    );
}