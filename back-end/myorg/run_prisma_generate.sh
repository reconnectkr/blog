#!/usr/bin/env bash
PWD=$(pwd)
MONOREPO_ROOT="$(dirname "$(realpath "$0")")"
PRISMA_DIR="$MONOREPO_ROOT/libs/common/prisma-repository-common"

cd $MONOREPO_ROOT
npm install

cd $PRISMA_DIR
npx prisma migrate deploy
npx prisma generate
cd $PWD