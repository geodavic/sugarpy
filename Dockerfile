from python:3.9

RUN apt-get update

RUN apt-get -y install python3-dev

RUN python3 -m pip install poetry

RUN mkdir /app

COPY . /app/

WORKDIR /app

RUN python3 -m pip install .

# download spacy model
RUN python3 -m spacy download en_core_web_sm

EXPOSE 5000

CMD ["python3","main.py"]
