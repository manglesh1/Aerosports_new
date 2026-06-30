#!/usr/bin/env bash
# Verify /windsor (and any location) loads cleanly at www.
#
# Model: ALL locations are served by the `default` App Engine service, which
# resolves each location_slug to its group at runtime (see
# docs/location-group-architecture.md). There is NO per-location dispatch/Worker
# split, so every /_next/* asset must resolve same-origin at www.
#
# Usage:  bash scripts/verify-windsor.sh [location_slug]   (default: windsor)
#
# Pass criteria: page 200, and every referenced _next/static asset returns 200.

set -u
SITE="${SITE:-https://www.aerosportsparks.ca}"
LOC="${1:-windsor}"
TMP="$(mktemp)"; fail=0

echo "== Fetch ${SITE}/${LOC} (cache-busted) =="
code=$(curl -sS -H "Cache-Control: no-cache" -o "$TMP" -w "%{http_code}" "${SITE}/${LOC}?cb=$RANDOM$RANDOM")
echo "   page status = ${code}"; [ "$code" = "200" ] || { echo "   FAIL: page != 200"; fail=1; }

echo "== Asset checks =="
for kind in 'chunks/[A-Za-z0-9/_%.\-]+\.js' 'css/[a-f0-9]+\.css'; do
  for u in $(grep -oiE "/_next/static/${kind}" "$TMP" | sort -u); do
    s=$(curl -sS -o /dev/null -w "%{http_code}" "${SITE}${u}")
    if [ "$s" = "200" ]; then echo "   OK  ${u##*/}"; else echo "   FAIL ${s}  ${u}"; fail=1; fi
  done
done

# A stray absolute origin (group3/oakville-group) means the old split has crept back in.
stray=$(grep -ciE 'group3-dot|oakville-group-dot' "$TMP")
[ "$stray" = "0" ] || { echo "   FAIL: ${stray} stray service-origin asset refs (path-split regression)"; fail=1; }

echo ""
[ "$fail" = "0" ] && echo "RESULT: PASS — /${LOC} loads cleanly from the default service." \
                  || echo "RESULT: FAIL — see above."
exit "$fail"
