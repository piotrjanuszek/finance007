FROM python:3.11-alpine

# Set working directory
WORKDIR /app

# Install dependencies
RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy your Flask app
COPY *.py .

# Expose the port for Flask app (adjust if needed)
EXPOSE 5000

# Run the Flask app as the main process
CMD ["python", "main.py"]