FROM python:3-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade --no-cache-dir -r requirements.txt

COPY app/ .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--port", "8000", "--log-config", "conf/log_conf.yaml", "--host","0.0.0.0", "--reload"]
# CMD ["fastapi", "run", "app/main.py", "--port", "8000"]