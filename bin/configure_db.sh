#!/bin/bash

echo 'Configuring dragonstackdb'

dropdb -U node_user
createdb -U node_user dragonstackdb

psql -U node_use dragonstackdb < ./bin/sql/generation.sql
psql -U node_use dragonstackdb < ./bin/sql/dragon.sql
psql -U node_use dragonstackdb < ./bin/sql/trait.sql
psql -U node_use dragonstackdb < ./bin/sql/dragonTrait.sql

node ./bin/insertTraits.js

echo 'dragonstackdb configuring'