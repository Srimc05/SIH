from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
from PIL import Image
import io

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the model and tokenizer
model_id = "vikhyatk/moondream2"
revision = "2024-07-23"
model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True, revision=revision)
tokenizer = AutoTokenizer.from_pretrained(model_id, revision=revision)

def recognize_and_answer(image, question):
    enc_image = model.encode_image(image)
    answer = model.answer_question(enc_image, question, tokenizer)
    return answer

@app.route('/recognize_and_answer', methods=['POST'])
def recognize_and_answer_endpoint():
    # Check if a file was uploaded
    if 'image' not in request.files or 'question' not in request.form:
        return jsonify({'error': 'No image or question provided'}), 400

    # Get the uploaded file
    image_file = request.files['image']
    question = request.form['question']
    
    # Open the image file
    image = Image.open(io.BytesIO(image_file.read()))
    
    # Get the answer
    answer = recognize_and_answer(image, question)
    
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)