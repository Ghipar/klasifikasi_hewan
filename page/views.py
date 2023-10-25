from django.shortcuts import render
import base64
from io import BytesIO

import firebase_admin
import numpy as np
from fastai.vision.all import *
import json
from firebase_admin import credentials, firestore
import pathlib


temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

cred = credentials.Certificate("file/firebaseKey.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()

learn = load_learner("model.pkl")
names = json.load(open("translate.json"))
# Create your views here.
def index(request):
    context = {
        'nama': 'hello world'
    }
    return render(request, 'index.html', context)
def cek(request):
      buffered = BytesIO()
      request.GET['gmbr'].save(buffered, format="JPEG")
      img_str = base64.b64encode(buffered.getvalue())
      pred, idx, probs = learn.predict(np.asarray(request.GET['gmbr']))
      db.collection("preds").add(  # inilo db
          {
              "image": img_str,
              "prediction": pred.title(),
              "time_added": firestore.SERVER_TIMESTAMP,
          }
      )
      id_fruit_name_col = gr.Textbox(visible=True)
      en_fruit_name_col = gr.Textbox(visible=False)
      return [
          names[pred]["id"],
          f"./audios/Id/" + names[pred]["id"] + ".mp3",
          id_fruit_name_col,
          en_fruit_name_col,
      ]
  
    #   val1 = request.GET['gmbr']
    #   val2 = request.GET['gmbr']

    # return render(request, 'index.html', {'logic':val1, 'logic2':val2,})