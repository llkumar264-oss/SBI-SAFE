from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from ..database import get_db, FraudReport
from ..schemas import FraudReportCreate, FraudReportResponse

router = APIRouter(prefix="/report-fraud", tags=["Fraud Reports"])


@router.post("", response_model=FraudReportResponse)
def report_fraud(report: FraudReportCreate, db: Session = Depends(get_db)):
    valid_types = ["sms", "link", "app", "call", "whatsapp", "email"]
    if report.report_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid type. Use one of: {valid_types}")
    if len(report.content.strip()) < 10:
        raise HTTPException(status_code=400, detail="Content too short. Provide more details.")

    new_report = FraudReport(
        report_type=report.report_type,
        content=report.content,
        location=report.location,
        latitude=report.latitude,
        longitude=report.longitude,
        severity=report.severity or "medium",
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return FraudReportResponse(
        id=new_report.id,
        report_type=new_report.report_type,
        content=new_report.content,
        location=new_report.location,
        latitude=new_report.latitude,
        longitude=new_report.longitude,
        severity=new_report.severity,
        verified=new_report.verified,
        reported_at=new_report.reported_at.isoformat(),
        upvotes=new_report.upvotes,
    )


@router.get("", response_model=List[FraudReportResponse])
def list_reports(
    report_type: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(FraudReport)
    if report_type:
        query = query.filter(FraudReport.report_type == report_type)
    if severity:
        query = query.filter(FraudReport.severity == severity)
    reports = query.order_by(FraudReport.reported_at.desc()).limit(limit).all()

    return [
        FraudReportResponse(
            id=r.id,
            report_type=r.report_type,
            content=r.content,
            location=r.location,
            latitude=r.latitude,
            longitude=r.longitude,
            severity=r.severity,
            verified=r.verified,
            reported_at=r.reported_at.isoformat(),
            upvotes=r.upvotes,
        )
        for r in reports
    ]


@router.post("/{report_id}/upvote")
def upvote_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(FraudReport).filter(FraudReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.upvotes += 1
    db.commit()
    return {"id": report_id, "upvotes": report.upvotes}
