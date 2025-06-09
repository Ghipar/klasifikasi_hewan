import base64
from django.shortcuts import render
from fastai.vision.all import *
import json
import io
import asyncio
from django.http import HttpResponse
from django.http import JsonResponse
import firebase_admin
from firebase_admin import credentials, firestore
from PIL import Image

# Load model and Firebase
names = json.load(open("./file/translate.json"))
model = load_learner("./file/model.pkl")
cred = credentials.Certificate("./file/firebaseKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def index(request):
    return render(request, "index.html")

def predictId(request):
    if request.method == "POST":
        try:
            # Get uploaded image
            file_obj = request.FILES.get("gmbr")
            if not file_obj:
                return HttpResponse("No image uploaded", status=400)

            image_data = file_obj.read()
            img = Image.open(io.BytesIO(image_data)).convert("RGB")
            img = img.resize((200, 200))

            # Convert image to Base64
            img_buffer = io.BytesIO()
            img.save(img_buffer, format="PNG")  # Convert image to bytes
            img_str = base64.b64encode(img_buffer.getvalue()).decode("utf-8")

            # Predict using the model
            pred_class, pred_idx, pred_probs = model.predict(img)
            predId = names.get(pred_class, {}).get("id", "Unknown")
            pred_percentage = round(float(pred_probs[pred_idx]) * 100, 2)  # Convert to percentage

            # **Tampilkan error di console jika prediksi tidak ditemukan**
            if predId == "Unknown":
                print(
                    f"⚠️ WARNING: Predicted class '{pred_class}' not found in 'translate.json'!"
                )

            data = {
                "image": img_str,
                "prediction": predId,
                "confidence": f"{pred_percentage}%",
                "time_added": firestore.SERVER_TIMESTAMP,
            }

            # Store in Firebase
            asyncio.run(firebase_store_data(data))

            return HttpResponse(json.dumps({"prediction": predId, "confidence": f"{pred_percentage}%"}), content_type="application/json")
            # return HttpResponse(predId,)

        except Exception as e:
            print(
                f"❌ ERROR processing the uploaded file: {e}"
            )  # Print error in console
            return HttpResponse(f"Error processing the uploaded file: {e}", status=500)

    return HttpResponse("Invalid request", status=400)

def predictEn(request):
    if request.method == "POST":
        try:
            # Get uploaded image
            file_obj = request.FILES.get("gmbr")
            if not file_obj:
                return HttpResponse("No image uploaded", status=400)

            image_data = file_obj.read()
            img = Image.open(io.BytesIO(image_data)).convert("RGB")
            img = img.resize((200, 200))

            # Convert image to Base64
            img_buffer = io.BytesIO()
            img.save(img_buffer, format="PNG")
            img_str = base64.b64encode(img_buffer.getvalue()).decode("utf-8")

            # Predict using the model
            pred_class, pred_idx, pred_probs = model.predict(img)
            predEn = names.get(pred_class, {}).get("en", "Unknown")
            pred_percentage = round(float(pred_probs[pred_idx]) * 100, 2)  # Convert to percentage

            # **Tampilkan error di console jika prediksi tidak ditemukan**
            if predEn == "Unknown":
                print(
                    f"⚠️ WARNING: Predicted class '{pred_class}' not found in 'translate.json'!"
                )

            data = {
                "image": img_str,
                "prediction": predEn,
                "confidence": f"{pred_percentage}%",
                "time_added": firestore.SERVER_TIMESTAMP,
            }

            # Store in Firebase
            asyncio.run(firebase_store_data(data))

            return HttpResponse(json.dumps({"prediction": predEn, "confidence": f"{pred_percentage}%"}), content_type="application/json")

        except Exception as e:
            print(
                f"❌ ERROR processing the uploaded file: {e}"
            )  # Print error in console
            return HttpResponse(f"Error processing the uploaded file: {e}", status=500)

    return HttpResponse("Invalid request", status=400)

async def firebase_store_data(data):
    try:
        db.collection("preds").add(data)
        return True
    except Exception as e:
        print(f"🔥 ERROR saving to Firebase: {e}")  # Print error in console
        return False
