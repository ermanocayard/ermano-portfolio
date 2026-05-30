# Dashboard Specification

## Dashboard Goal
The recreated dashboard should summarize mock ITSM ticket audit results in a clear operational view that supports daily reporting, technician-level review, and process improvement tracking.

## KPI Summary
- Total tickets audited
- Pass rate
- Average documentation score
- Average resolution time
- Tickets missing documentation
- Tickets with categorization issues
- Tickets with routing issues
- Tickets needing better escalation evidence

## Suggested Sections

### Daily Audit Summary
A compact table showing audit date, tickets audited, pass count, issue count, pass rate, average documentation score, and top opportunity for improvement.

### Audit Results by Technician
A technician-level table or bar chart comparing pass, not enough information, improper handling, improper categorization, routing issue, escalation or priority issue, and other outcomes.

### Audit Results by Ticket Category
A category-level chart showing which ticket categories produce the most audit issues. Suggested categories include account access, MFA, printer, Citrix / VDI, Microsoft 365, hardware, software, network connectivity, EHR access, and other.

### Opportunity-for-Improvement Trends
A ranked table or horizontal bar chart showing the most common improvement categories, such as missing resolution details, incomplete troubleshooting notes, incorrect category, incorrect subcategory, routing mismatch, weak escalation evidence, and unclear user impact.

### Resolution Time View
A table or chart comparing average resolution time by ticket type, priority, technician, or category. This should be interpreted alongside ticket complexity rather than as a standalone quality measure.

### Documentation Quality View
A score distribution showing documentation quality bands, such as 90-100, 80-89, 70-79, and below 70. Conditional formatting can highlight low documentation scores.

### Exception Review
A filtered table for tickets that need follow-up, including not enough information, improper handling, routing issues, categorization issues, and escalation or priority issues.

## Filters
Useful dashboard filters include audit date, technician, team, ticket type, category, priority, status, audit result, and opportunity for improvement.

## Public Screenshot Plan
Any future screenshots should be recreated from mock data only. Screenshots should not include private workbooks, real system exports, real ticket records, employee information, internal comments, or proprietary tool views.
