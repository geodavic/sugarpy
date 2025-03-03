from python:3.11

RUN apt-get update

RUN python3 -m pip install poetry

RUN mkdir /app

COPY ./ /app

WORKDIR /app

# Install sugarpy
RUN python3 -m poetry install 

# Install API requirements
RUN poetry run python3 -m pip install -r api_requirements.txt

# download spacy model
RUN poetry run python3 -m spacy download en_core_web_lg

EXPOSE 5000

ENV PORT=5000

CMD ["poetry","run","python3","api/main.py"]
