

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
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import styles from "./style.module.css";
import Head from 'next/head';

export default function Home() {
  // State variables
  // const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // Added isLoading state
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          if (prevProgress >= 95) {
            clearInterval(interval);
            return 95;  // Cap at 95% until actual completion
          }
          return prevProgress + 1;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);  

  async function analyzeWithClaude(file, history) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversation_history', JSON.stringify(history));

    try {
      const response = await fetch('https://disputelens-quote-analysis-mvp.onrender.com/analyze_with_claude ', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log('Failed in analyzeWithClaude');
        throw new Error('Failed to analyze with Claude');
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error in analyzeWithClaude:', error);
      throw error;
    }
  }



  // Handle file upload and analysis using Claude
  const handleFileUsingClaude = async (event) => {
    const file = event.target.files[0];
    setIsLoading(true);  // Set loading to true while analyzing with Claude
    try {
      console.log('Calling the api');
      const result = await analyzeWithClaude(file, conversationHistory);
      setAnalysis(result);  // Set the analysis result
      // Update conversation history
      console.log(result);
      setConversationHistory(prev => [...prev, { role: "assistant", content: result }]);
    } catch (error) {
      console.log('Failed in handleFileUsingClaude');
      console.error('Error:', error);
      setAnalysis('Failed to analyze the file.');
    } finally {
      console.log('Completed the api call');
      // setIsLoading(false); // Set loading to false after processing
      setLoadingProgress(100);  // Ensure it reaches 100% on completion
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);  // Short delay to show 100% before resetting
    }
  };

  /********************End integration code**************** */ 

  // Render the UI
  return (
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/Logo.jpg" alt="Site Logo" className={styles.logo} />
        </div>
      </header>
  
      <main className={styles.main}>
      <div className={styles.uploadContainer}>
        <label htmlFor="file-upload" className={styles.uploadButton}>
          Upload Quote
          <input
            id="file-upload"
            className={styles.fileInput}
            type="file"
            onChange={handleFileUsingClaude}
            accept=".pdf,.txt,.jpg,.png"
          />
        </label>
        <div 
          className={styles.refreshImage}
          onClick={() => window.location.reload()}
          role="button"
          tabIndex={0}
          aria-label="Refresh page"
        >
          <Image
            src="./refresh.png"
            alt="Refresh"
            width={24}
            height={24}
          />
        </div>
      </div>
      
  
      {/* Conditional rendering based on loading state */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingProgress}>{loadingProgress}%</div>
          <p>Analyzing... This may take a few seconds</p>
        </div>
      ) : analysis ? (
          <div className={styles.analysisContainer}>
              <h3>Analysis Result:</h3>
              <div className={styles.analysisText}>
              {analysis}
              </div>
          </div>
      ) : null}
      </main>
    </div>
    </>
  );
  }
  // // Handle file upload and extract text
  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   setIsLoading(true);  // Set loading to true while processing
  //   try {
  //     const extractedText = await pdfToText(file);
  //     setText(extractedText);  // Set the extracted text
  //   } catch (error) {
  //     console.error('Error:', error);
  //   } finally {
  //     setIsLoading(false);  // Set loading to false after processing
  //   }
  // };

  // // Handle analyzing text
  // const handleAnalyze = async () => {
  //   setIsLoading(true);  // Set loading to true while analyzing
  //   try {
  //     const result = await analyzeText(text);
  //     setAnalysis(result);  // Set the analysis result
  //   } catch (error) {
  //     console.error('Error:', error);
  //   } finally {
  //     setIsLoading(false);  // Set loading to false after analyzing
  //   }
  // };

/*******************Start of integration code*************** */
  // async function pdfToText(file) {
  //   // Create a new FormData object
  //   const formData = new FormData();
  //   // Append the file to the FormData object
  //   formData.append('file', file);

  //   try {
  //     // Send the PDF file to the server
  //     const response = await fetch('http://localhost:5000/pdf_to_text', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     // Get the extracted text from the server
  //     const data = await response.json();
  //     return data.text;
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  // async function analyzeText(text) {
  //   try {
  //     const response = await fetch('http://localhost:5000/analyze_text', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ text }),
  //     });
  //     const data = await response.json();
  //     return data.analysis;
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }


  // /********************Buttons*************************/
  // const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  // const [showAdditionalButtons2, setShowAdditionalButtons2] = useState(false);
  // const [showAdditionalButtons3, setShowAdditionalButtons3] = useState(false);

  // const handleButtonClick = () => {
  //   setShowAdditionalButtons(true);
  // };

  // const handleButtonClick2 = () => {
  //   setShowAdditionalButtons2(true);
  // };

  // const handleButtonClick3 = () => {
  //   setShowAdditionalButtons3(true);
  // }

  // const closeButtonClick2 = () => {
  //   setShowAdditionalButtons2(false);
  // }

  // const closeButtonClick3 = () => {
  //   setShowAdditionalButtons3(false);
  // }

  // const closeAllButtons = () => {
  //   setShowAdditionalButtons(false);
  //   setShowAdditionalButtons2(false);
  //   setShowAdditionalButtons3(false);
  // }

  // /********************End of buttons*************************/

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