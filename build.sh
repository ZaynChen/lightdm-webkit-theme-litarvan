#!/usr/bin/env bash

echo Building Webkit theme Litarvan v$(cat version)...
echo

rm -f webkit-theme-litarvan-$(cat version).tar.gz
npm ci
rm -rf dist/
npm run-script build
cp LICENSE dist/
pushd dist && tar zcvf ../webkit-theme-litarvan-$(cat ../version).tar.gz ./* && popd
