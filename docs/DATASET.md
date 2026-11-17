# Dataset and provenance

Source: deterministic synthetic dataset authored locally for this project on 17 November 2026. No dataset was scraped, purchased or taken from an employer. No personal, banking, invoice or customer records are included. Dataset is released under CC0-1.0; code is MIT.

The fictional industrial portfolio covers packaging-line upgrade, warehouse automation, energy metering, quality traceability, a supplier portal and plant-network refresh. These names describe invented scenarios, not claims about a named business.

This project's `data/dataset.json` contains 18 independently reviewable assessment records. Its CSV contains the same source fields, with JSON used for nested activity networks. IDs are stable PPC keys. Project keys are logical labels, not database foreign keys into another project.

Amounts are integer INR paise. Remaining commitments are a subset of ETC, so they are not added twice. Indices with zero denominators are null. Baseline values cannot exceed budget. Current ServiceNow money input columns are 32-bit integers; the synthetic values fit. These are distinct assessment scenarios for six projects, not 18 independent investments; do not add the scenarios together.

The policies are deterministic. Matching synthetic outputs proves arithmetic/workflow agreement for these fixtures; it does not prove real-world savings, investment value, project delivery success or production readiness.
