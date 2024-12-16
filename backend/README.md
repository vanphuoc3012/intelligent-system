How to run:

Install depenency:
```bash
pip install -r backend/requirements.txt
```

```bash
cd backend/app
```

```bash
uvicorn main:app --reload --log-config conf/log_conf.yaml --use-colors
```

Xem API docs tại: localhost:8000/docs

# Train model:
Mở file backend/app/training/bank_customer_classification_training.ipynb

Thực hiện điều chỉnh
Save lại ở bước gần cuối