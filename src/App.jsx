import { useState } from 'react'
import reactLogo from './assets/react.svg'
import spinner from './assets/spinner.svg'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'

function App() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPEN_AI_KEY,
  })
  const openai = new OpenAIApi(configuration)
  const generateImage = async () => {
    try {
      setLoading(true)
      const res = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: '512x512',
      })
      console.log(res.data)
      setResult(res.data.data[0].url)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h2>AI Image Generator</h2>
      <textarea
        className="app-input"
        placeholder="Oscar the Grouch Surfing on Frozen Lake"
        onChange={(e) => setPrompt(e.target.value)}
        rows="10"
        cols="40"
      />
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
