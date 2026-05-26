import os
from typing import Any

import requests
from fastapi import Header, HTTPException


def supabase_is_configured() -> bool:
    return bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_ANON_KEY"))


async def get_optional_user(authorization: str | None = Header(default=None)) -> dict[str, Any] | None:
    if not supabase_is_configured():
        return None

    if not authorization or not authorization.lower().startswith("bearer "):
        return None

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        return None

    response = requests.get(
        f"{os.environ['SUPABASE_URL'].rstrip('/')}/auth/v1/user",
        headers={
            "apikey": os.environ["SUPABASE_ANON_KEY"],
            "Authorization": f"Bearer {token}",
        },
        timeout=10,
    )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Supabase session.")

    return response.json()


async def get_required_gmail_user(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    if not supabase_is_configured():
        raise HTTPException(status_code=503, detail="Supabase authentication is not configured.")

    user = await get_optional_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required.")

    email = str(user.get("email", "")).lower()
    if not email.endswith("@gmail.com"):
        raise HTTPException(status_code=403, detail="Only verified Gmail accounts are allowed.")

    return user
