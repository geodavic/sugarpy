#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const toml = require('toml');

const filePath = path.resolve(__dirname, 'pyproject.toml');

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const config = toml.parse(fileContent);

  if (config.tool && config.tool.poetry && config.tool.poetry.version) {
    console.log(`${config.tool.poetry.version}`);
  } else {
    console.error('Version not found in the [tool.poetry] section.');
  }
} catch (error) {
  console.error('Error reading or parsing pyproject.toml:', error);
}

