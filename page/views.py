import base64
from django.shortcuts import render
from keras.preprocessing import image
from fastai.vision.all import *
import json
import io
import asyncio
from django.http import HttpResponse
import firebase_admin
from firebase_admin import credentials, firestore
from PIL import Image

names = json.load(open("./file/translate.json"))
model = load_learner("./file/model.pkl")
cred = credentials.Certificate("./file/firebaseKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


def index(request):
    context = {"a": 1}
    return render(request, "index.html", context)


def predictId(request):
    if request.method == "POST":
        try:
            # Get and load the image
            file_obj = request.FILES["gmbr"]
            # Use the uploaded image directly without saving it
            image_data = file_obj.read()

            img = Image.open(io.BytesIO(image_data)).convert('RGB')
            img = img.resize((200, 200))
            img_str = base64.b64encode(img.tobytes())
            # print(image_data)
            # Predict
            pred = model.predict(img)
            # Post values to HTML
            predId = names[pred[0]]["id"]

            data = {
                    "image": img_str,
                    "prediction": predId,
                    "time_added": firestore.SERVER_TIMESTAMP,
            }
            
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(firebase_store_data(data))
            loop.close()
     
            return HttpResponse(predId)

        except Exception as e:
            print(f"Error processing the uploaded file: {e}")

    return HttpResponse(predId)


def predictEn(request):
    if request.method == "POST":
        try:
            # Get and load the image
            file_obj = request.FILES["gmbr"]
            # Use the uploaded image directly without saving it
            image_data = file_obj.read()
            img = Image.open(io.BytesIO(image_data)).convert('RGB')
            img = img.resize((200, 200))
            img_str = base64.b64encode(img.tobytes())
           
            # Predict
            pred = model.predict(img)
            # Post values to HTML
            predEn = names[pred[0]]["en"]

            data = {
                    "image": img_str,
                    "prediction": predEn,
                    "time_added": firestore.SERVER_TIMESTAMP,
            }

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(firebase_store_data(data))
            loop.close()

            return HttpResponse(predEn)

        except Exception as e:
            print(f"Error processing the uploaded file: {e}")

    return HttpResponse(predEn)


async def firebase_store_data(data):
    doc = db.collection("preds")
    doc.add(data)

    return true