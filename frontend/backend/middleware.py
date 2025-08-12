import time
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict

class LogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        t0 = time.time()
        resp: Response = await call_next(request)
        dt = int((time.time() - t0) * 1000)
        print(f"[{request.method}] {request.url.path} -> {resp.status_code} ({dt}ms)")
        return resp

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_per_min: int = 60):
        super().__init__(app)
        self.max = max_per_min
        self.bucket = defaultdict(list)  # ip -> [timestamps]

    async def dispatch(self, request: Request, call_next: Callable):
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        window = now - 60
        q = self.bucket[ip]
        # drop old
        while q and q[0] < window: q.pop(0)
        if len(q) >= self.max:
            from fastapi.responses import JSONResponse
            return JSONResponse({"error":"rate limit exceeded"}, status_code=429)
        q.append(now)
        return await call_next(request)
