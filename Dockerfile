FROM python:3.11

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install Chrome dependencies for Kaleido
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 libatk-bridge2.0-0 libcups2 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libxkbcommon0 libpango-1.0-0 \
    libcairo2 libasound2 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /app

COPY ./ /app

WORKDIR /app

# Install sugarpy and API requirements
RUN uv sync
RUN uv pip install -r api_requirements.txt
RUN uv run kaleido_get_chrome

EXPOSE 5000

ENV PORT=5000

CMD ["uv","run","python3","api/main.py"]
