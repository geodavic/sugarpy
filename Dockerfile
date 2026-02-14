FROM python:3.11

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN mkdir /app

COPY ./ /app

WORKDIR /app

# Install sugarpy and API requirements
RUN uv sync
RUN uv pip install -r api_requirements.txt

EXPOSE 5000

ENV PORT=5000

CMD ["uv","run","python3","api/main.py"]
