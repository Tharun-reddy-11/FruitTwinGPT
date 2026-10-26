"""Fail-fast validator for the minimum linked-record research contract."""
from __future__ import annotations
import argparse
import pandas as pd

REQUIRED = {"plant_id", "observation_date", "growth_stage", "harvest_date", "brix"}
def main() -> None:
    parser = argparse.ArgumentParser(); parser.add_argument("csv"); args=parser.parse_args()
    df=pd.read_csv(args.csv); missing=REQUIRED-set(df.columns)
    if missing: raise SystemExit(f"Invalid dataset: missing required columns: {sorted(missing)}")
    nulls=df[["plant_id","observation_date","harvest_date","brix"]].isna().sum()
    if nulls.any(): raise SystemExit(f"Invalid dataset: linked fields contain missing values: {nulls[nulls>0].to_dict()}")
    if (pd.to_datetime(df.harvest_date) < pd.to_datetime(df.observation_date)).any(): raise SystemExit("Invalid dataset: harvest date precedes observation date")
    print({"rows":len(df),"plants":df.plant_id.nunique(),"status":"VALIDATED_MINIMUM_CONTRACT"})
if __name__ == "__main__": main()
