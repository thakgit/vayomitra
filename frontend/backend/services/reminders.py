from __future__ import annotations
from datetime import datetime, time, timedelta
from typing import Optional, List
from sqlmodel import SQLModel, Field, Session, create_engine, select
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from zoneinfo import ZoneInfo

DB_URL = "sqlite:///./journal.db"  # reuse one DB file for simplicity
_engine = create_engine(DB_URL)

class Reminder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    medicine: str
    time_local: str  # "HH:MM"
    tz: str = "America/Chicago"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_triggered: Optional[datetime] = None

class ReminderEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    reminder_id: int
    fired_at: datetime
    message: str

scheduler: Optional[AsyncIOScheduler] = None

def init_db():
    SQLModel.metadata.create_all(_engine)

def _fire(rem_id: int):
    """Job called by scheduler—record an event."""
    with Session(_engine) as sess:
        r = sess.get(Reminder, rem_id)
        if not r or not r.is_active:
            return
        r.last_triggered = datetime.utcnow()
        evt = ReminderEvent(
            reminder_id=r.id,
            fired_at=datetime.utcnow(),
            message=f"Time to take {r.medicine}."
        )
        sess.add(evt)
        sess.add(r)
        sess.commit()

def _parse_hhmm(s: str) -> time:
    hh, mm = s.split(":")
    return time(hour=int(hh), minute=int(mm))

def _schedule_job(r: Reminder):
    """Create/replace a daily APScheduler job for this reminder."""
    global scheduler
    if not scheduler:
        return
    job_id = f"rem_{r.id}"
    # Remove any existing job for this reminder
    try:
        old = scheduler.get_job(job_id)
        if old:
            scheduler.remove_job(job_id)
    except Exception:
        pass
    if not r.is_active:
        return
    hhmm = _parse_hhmm(r.time_local)
    # Use a cron trigger at local time
    trigger = CronTrigger(hour=hhmm.hour, minute=hhmm.minute, timezone=ZoneInfo(r.tz))
    scheduler.add_job(_fire, trigger=trigger, id=job_id, args=[r.id], replace_existing=True)

def start_scheduler():
    """Start scheduler and schedule all active reminders."""
    global scheduler
    if scheduler:
        return scheduler
    scheduler = AsyncIOScheduler(timezone=ZoneInfo("America/Chicago"))
    scheduler.start()
    # schedule existing reminders
    with Session(_engine) as sess:
        rows = sess.exec(select(Reminder).where(Reminder.is_active == True)).all()
        for r in rows:
            _schedule_job(r)
    return scheduler

# ----- CRUD -----

def add_reminder(medicine: str, time_local: str, tz: str = "America/Chicago") -> Reminder:
    r = Reminder(medicine=medicine, time_local=time_local, tz=tz)
    with Session(_engine) as sess:
        sess.add(r); sess.commit(); sess.refresh(r)
    _schedule_job(r)
    return r

def list_reminders() -> List[Reminder]:
    with Session(_engine) as sess:
        return list(sess.exec(select(Reminder).order_by(Reminder.created_at.desc())))

def delete_reminder(rem_id: int) -> bool:
    with Session(_engine) as sess:
        r = sess.get(Reminder, rem_id)
        if not r:
            return False
        sess.delete(r); sess.commit()
    # remove job if any
    global scheduler
    if scheduler:
        job = scheduler.get_job(f"rem_{rem_id}")
        if job:
            scheduler.remove_job(job.id)
    return True

def toggle_reminder(rem_id: int, active: bool) -> Optional[Reminder]:
    with Session(_engine) as sess:
        r = sess.get(Reminder, rem_id)
        if not r:
            return None
        r.is_active = active
        sess.add(r); sess.commit(); sess.refresh(r)
    _schedule_job(r)
    return r

def test_fire(rem_id: int) -> bool:
    _fire(rem_id)
    return True

def recent_events(since_utc: Optional[datetime] = None, limit: int = 50) -> List[ReminderEvent]:
    with Session(_engine) as sess:
        q = select(ReminderEvent).order_by(ReminderEvent.fired_at.desc())
        rows = sess.exec(q).all()
        out = []
        for e in rows:
            if since_utc and e.fired_at <= since_utc:
                continue
            out.append(e)
            if len(out) >= limit:
                break
        return out
