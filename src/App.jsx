import { useState } from 'react'
import reactLogo from './assets/react.svg'
import spinner from './assets/spinner.svg'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'

function App() {
  let apiKey
  if (import.meta.env.MODE == 'development') {
    apiKey = import.meta.env.VITE_OPEN_AI_KEY
  } else {
    apiKey = process.env.VITE_OPEN_AI_KEY
  }
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  const generateImage = async () => {
    setResult('')
    if (prompt.length == 0) {
      setError('You need to give me a prompt!')
      return
    }
    try {
      setLoading(true)
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(apiKey)
        },
        body: JSON.stringify({
          'prompt': prompt,
          'n': 1,
          'size': '512x512',
          
        })
      };

      const response = await fetch(
        'https://api.openai.com/v1/images/generations',
        requestOptions
      )
      const data = await response.json()
      setResult(data.data[0].url)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setPrompt(e.target.value)
    setError('')
  }

  return (
    <div className="App">
      <h2>AI Image Generator</h2>
      <textarea
        className="app-input"
        placeholder="An antique bust of a Greek philosopher wearing a VR headset, realistic, photography."
        onChange={(e) => handleChange(e)}
        rows="10"
        cols="40"
      />
      {error && <span className="error">{error}</span>}
      <button disabled={loading} onClick={generateImage}>
        Generate an Image
      </button>
      {loading && (
        <div className="loading">
          <span>Your image is loading...</span>
          <img className="spinner" src={spinner} alt="Spinner" />
        </div>
      )}
      {result.length > 0 ? (
        <img className="result-image" src={result} alt="Result" />
      ) : (
        <></>
      )}
    </div>
  )
}

export default App
