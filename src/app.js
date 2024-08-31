import React, { useState } from 'react';
import axios from 'axios';
import RobotImage from './logo.png'; // Update with the correct path

const App = () => {
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState(1); // 1: Initial, 2: After image and question submission

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);

    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image || !question) {
      alert('Please provide both an image and a question.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('question', question);

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/recognize_and_answer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnswer(response.data.answer);
      setStage(2); // Update to the next stage after getting the answer
    } catch (error) {
      setError('Failed to get the answer. Please try again.');
      console.error('Error fetching the answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="bg-orange-600 text-white p-5 w-1/5 flex flex-col items-center justify-center">
        <img src={RobotImage} alt="Robot" className="max-w-[100px] mb-4" />
        <div className="text-center">
          <h1 className="text-2xl m-0">Vision Dialog</h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-5">
        {stage === 1 ? (
          <div className="text-center">
            <h1 className="text-orange-600 text-2xl">Hello,</h1>
            <p className="text-gray-600 text-lg">How can I help you today?</p>
            <div className="bg-gray-200 p-5 rounded-lg text-center my-3 w-full max-h-[200px] flex justify-center items-center overflow-hidden">
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Uploaded" className="w-full max-h-[200px] object-contain rounded-lg" />
              ) : (
                <div className="flex flex-col items-center">
                  <input type="file" onChange={handleImageUpload} className="mt-2" />
                  <p className="text-orange-600">Add your image here</p>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Ask me anything!"
              value={question}
              onChange={handleQuestionChange}
              className="mt-2 p-2 w-full rounded-lg border border-gray-300"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-2 p-2 bg-orange-600 text-white rounded-lg transition-colors ${
                loading ? 'bg-gray-300' : 'hover:bg-orange-700'
              }`}
            >
              {loading ? 'Processing...' : 'Ask me Anything!'}
            </button>
          </div>
        ) : (
          <div className="text-left bg-white p-4 rounded-xl shadow-md w-full h-full">
            <h2 className="text-orange-600 text-lg mb-1">VisionDialog</h2>
            <p className="text-green-600 mb-4">• Online</p>
            {imagePreviewUrl && <img src={imagePreviewUrl} alt="Uploaded" className="w-full max-h-[150px] object-contain rounded-lg mb-3" />}
            <div className="flex flex-col gap-2 mt-5">
              <div className="max-w-[60%] p-3 rounded-2xl bg-orange-600 text-white self-end">
                <p>{question}</p>
              </div>
              <div className="max-w-[60%] p-3 rounded-2xl bg-gray-200 text-gray-800 self-start">
                <p>{answer}</p>
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-red-600 font-bold mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default App;
