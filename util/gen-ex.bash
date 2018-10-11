#!/bin/bash

set -e
set -x

for x in subjects/*
do
    EX_DIR="${x}/exercise"
    rm -rf "${EX_DIR}"
    cp -a "${x}/master" "${EX_DIR}"
    find ${EX_DIR} -type f -exec sed \
         -e '/SOLUTION_START/,/SOLUTION_END/ d' \
         -e '/EXERCISE_START/ d' -e '/EXERCISE_END/ d' \
         -i '' {} \;

    SOL_DIR="${x}/solution"
    rm -rf "${SOL_DIR}"
    cp -a "${x}/master" "${SOL_DIR}"
    find ${SOL_DIR} -type f -exec sed \
         -e '/EXERCISE_START/,/EXERCISE_END/ d' \
         -e '/SOLUTION_START/ d' -e '/SOLUTION_END/ d' \
         -i '' {} \;
done
