FROM python:3.14.3-alpine3.23

RUN apk add --no-cache postgresql-dev gcc python3-dev musl-dev

WORKDIR /usr/src/app

COPY requirements.txt .

RUN pip install --upgrade pip && \
  pip install --no-cache-dir -r requirements.txt && \
  pip list

COPY . .
