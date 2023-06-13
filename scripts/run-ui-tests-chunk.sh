#!/bin/bash

CYPRESS_TESTS=$(find ./cypress/e2e -name "*.cy.ts")

declare -i LENGTH=$(find ./cypress/e2e -name "*.cy.ts" | wc -l | xargs)
declare -i CHUNK_SIZE=LENGTH/TOTAL_CHUNKS
declare -i START_INDEX=$(echo "$CHUNK_SIZE*$CHUNK_NUMBER")
declare -i ACTUAL_CHUNK_NUMBER=CHUNK_NUMBER+1
declare -i END_INDEX=START_INDEX+CHUNK_SIZE
declare -i INDEX=1

printf "Chunk ${ACTUAL_CHUNK_NUMBER} of $TOTAL_CHUNKS\n\n"

FILES_TO_TEST=""
while read -r file_to_test
do
    if [[ ("$INDEX" -gt "$START_INDEX") && (("$INDEX" -le "$END_INDEX") || ("${ACTUAL_CHUNK_NUMBER}" -eq "$TOTAL_CHUNKS")) ]]; then
      FILES_TO_TEST="$FILES_TO_TEST $file_to_test"
      printf "\x1B[32m%-6s\e[m\n"  "✓ $file_to_test"
    else
      echo "  $file_to_test"
    fi

    INDEX=INDEX+1
done < <(printf '%s\n' "$CYPRESS_TESTS")

if [[ -z "$FILES_TO_TEST" ]]; then
  echo "No files to test"
  exit 0
fi

npx cypress run --config baseUrl='https://localhost:4443' --spec $FILES_TO_TEST
