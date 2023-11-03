from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from keras.models import load_model
from keras.preprocessing import image
from fastai.vision.all import *
import json
import tensorflow as tf
from tensorflow import Graph
import numpy as np
import io
from django.http import HttpResponse

names = json.load(open("./file/translate.json"))
model= load_learner('./file/model.pkl')

def index(request):
    context = {'a':1}
    return render(request, 'index.html', context)
def predictId(request):
    if request.method == 'POST':
        try:
            print(request.FILES['gmbr'])
            # Get and load the image
            file_obj = request.FILES['gmbr']
            # Use the uploaded image directly without saving it
            image_data = file_obj.read()
            img = image.load_img(io.BytesIO(image_data), target_size=(200, 200))
            # Predict
            pred = model.predict(img)
            # Post values to HTML
            predId = names[pred[0]]["id"]
           
            return HttpResponse(predId)

        except Exception as e:
            print(f"Error processing the uploaded file: {e}")
     
    return HttpResponse(predId)

def predictEn(request):
    if request.method == 'POST':
        try:
            # Get and load the image
            file_obj = request.FILES['gmbr']
            # Use the uploaded image directly without saving it
            image_data = file_obj.read()
            img = image.load_img(io.BytesIO(image_data), target_size=(200, 200))
            # Predict
            pred = model.predict(img)
            # Post values to HTML
            predEn = names[pred[0]]["en"]
           
            return HttpResponse(predEn)

        except Exception as e:
            print(f"Error processing the uploaded file: {e}")
     
    return HttpResponse(predEn)
    