"""Summarize Petri judge outputs into a CSV risk table."""
import json
import os
import pandas as pd
from inspect_ai.analysis import samples_df

LOG_DIR = os.environ.get("INSPECT_LOG_DIR", "./outputs")


def extract_judge(row_dict):
    """Pull judge metadata fields up to the row level."""
    metadata = row_dict.get("metadata", {}) if isinstance(row_dict, dict) else {}
    judge_output = metadata.get("judge_output") or {}
    return {
        "sample_id": row_dict.get("sample_id"),
        "dimensions": judge_output.get("dimensions"),
        "justification": judge_output.get("justification"),
        "score_overall": judge_output.get("overall_score"),
    }


def main():
    samples = samples_df(LOG_DIR, full=True, parallel=True)
    judge_cols = samples.apply(lambda r: extract_judge(r.to_dict()), axis=1, result_type="expand")
    df = pd.concat(
        [
            samples[["eval_id", "sample_id", "task", "created_at", "model"]].reset_index(drop=True),
            judge_cols.reset_index(drop=True),
        ],
        axis=1,
    )

    dim_df = df["dimensions"].apply(lambda dims: pd.Series(dims if isinstance(dims, dict) else {}))
    out = pd.concat([df.drop(columns=["dimensions"]), dim_df], axis=1)

    priority = [
        "deception",
        "oversight_subversion",
        "factual_citation_integrity",
        "unsafe_technical_claims",
        "pii_and_confidentiality",
    ]
    out["risk_rank"] = out[priority].fillna(0).sum(axis=1)
    out.sort_values(["risk_rank", "score_overall"], ascending=[False, True], inplace=True)

    os.makedirs("outputs", exist_ok=True)
    output_path = os.path.join("outputs", "petri_findings.csv")
    out.to_csv(output_path, index=False)
    print(f"Wrote {output_path} with {len(out)} rows")


if __name__ == "__main__":
    main()
