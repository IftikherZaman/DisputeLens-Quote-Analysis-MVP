

// export default function Home() {
//   return (
//     <main className={styles.main}>
//       <div className={styles.description}>
//         <p>
//           Get started by editing&nbsp;
//           <code className={styles.code}>src/app/page.js</code>
//         </p>
//         <div>
//           <a
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{" "}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className={styles.vercelLogo}
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className={styles.center}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className={styles.grid}>
//         <a
//           href= "/hello"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Docs <span>-&gt;</span>
//           </h2>
//           <p>Find in-depth information about Next.js features and API.</p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Learn <span>-&gt;</span>
//           </h2>
//           <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Templates <span>-&gt;</span>
//           </h2>
//           <p>Explore starter templates for Next.js.</p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Deploy <span>-&gt;</span>
//           </h2>
//           <p>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   );
// }

'use client'; 
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { useState } from "react";

export default function Home() {

  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');

  /********************Buttons*************************/
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const [showAdditionalButtons2, setShowAdditionalButtons2] = useState(false);
  const [showAdditionalButtons3, setShowAdditionalButtons3] = useState(false);

  const handleButtonClick = () => {
    setShowAdditionalButtons(true);
  };

  const handleButtonClick2 = () => {
    setShowAdditionalButtons2(true);
  };

  const handleButtonClick3 = () => {
    setShowAdditionalButtons3(true);
  }

  const closeButtonClick2 = () => {
    setShowAdditionalButtons2(false);
  }

  const closeButtonClick3 = () => {
    setShowAdditionalButtons3(false);
  }

  const closeAllButtons = () => {
    setShowAdditionalButtons(false);
    setShowAdditionalButtons2(false);
    setShowAdditionalButtons3(false);
  }

  /********************End of buttons*************************/

  /*******************Start of integration code*************** */
  async function pdfToText(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:5000/pdf_to_text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function analyzeText(text) {
    try {
      const response = await fetch('http://localhost:5000/analyze_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleFileUpload =async (event) => {
    const file = event.target.files[0];
    const extractedText = await pdfToText(file);
    setText(extractedText);
  };

  const handleAnalyze = async () => {
    const result = await analyzeText(text);
    setAnalysis(result);
  }
  /********************End integration code**************** */ 

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".pdf"/>
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Extracted text will appear here"
      />

      <button onClick={handleAnalyze}>Analyze</button>

      <div>
        <h3> Analysis Result: </h3>
        <div>
          <pre>{analysis}</pre>
        </div>
      </div>
    </div>
    // <div>
    //   <button onClick={handleButtonClick}>Upload Quote</button>
    //   <div>
    //     {showAdditionalButtons && (
    //       <>
    //         <button onClick={handleButtonClick3}>View Rubric</button>
    //         <button onClick={handleButtonClick2}>Generate Checklist</button>
    //       </>
    //     )}
    //     <div>
    //       {showAdditionalButtons2 && (
    //         <button onClick={() => { closeButtonClick2(); closeButtonClick3(); }}>Upload New Quote</button>
    //       )}
    //     </div>
    //     <div>
    //       {showAdditionalButtons3 && (
    //         <>
    //           <button onClick={closeButtonClick3}>Return to issues</button>
    //           <button onClick={closeButtonClick3}>Generate Checklist</button>
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}