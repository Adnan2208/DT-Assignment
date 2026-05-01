import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InputPage() {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!transcript.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      navigate('/results', { state: { result: data.result, transcript } });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="input-page">
      <h1 className="title">Please Enter the Transcript</h1>

      <div className="textarea-container">
        <textarea
          className="transcript-input"
          placeholder="Paste the supervisor transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <button
          className="send-button"
          onClick={handleSubmit}
          disabled={!transcript.trim() || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Send'}
        </button>
      </div>
    </div>
  );
}