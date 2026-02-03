from fastapi import FastAPI, HTTPException
import uvicorn
import os

app = FastAPI()

@app.get('/api/test')
def test_endpoint():
    return 'ok'

if __name__ == "__main__":
    
    port = int(os.getenv("PORT", 3004))
    uvicorn.run(app, host="0.0.0.0", port=port)