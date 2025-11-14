# Adapted from https://github.com/astral-sh/uv-docker-example/blob/5748835918ec293d547bbe0e42df34e140aca1eb/Dockerfile
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

WORKDIR /app

ENV PYSTOW_HOME=/tmp
ENV TQDM_MININTERVAL=5
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV UV_TOOL_BIN_DIR=/usr/local/bin

RUN chmod 777 /app

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev

COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

ENV PATH="/app/.venv/bin:$PATH"

ENTRYPOINT ["python", "main.py"]
CMD ["--help"]
