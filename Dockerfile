from python:3.9

RUN apt-get update

RUN apt-get -y install python3-dev

RUN python3 -m pip install poetry

RUN mkdir /app

COPY . /app/

WORKDIR /app

# Install sugarpy
RUN python3 -m pip install .

# Install API requirements
RUN python3 -m pip install api_requirements.txt

# download spacy model
RUN python3 -m spacy download en_core_web_lg

EXPOSE 5000

ENV PORT=5000

CMD ["python3","api/main.py"]
