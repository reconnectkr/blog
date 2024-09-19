#!/usr/bin/env bash
docker run --name postgres-myorg \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=randompassword \
    -e POSTGRES_USER=johndoe \
    -e POSTGRES_DB=mydb \
    -e POSTGRES_INITDB_ARGS="--lc-collate=C --lc-ctype=C" \
    -d postgres
