# data2sql

CLI tool to generate SQL from dataset in a CSV or Excel file.

## Installation

```bash
npm i -g https://github.com/arisjulio/data2sql.git
```

## Usage

```
data2sql [options] <file ...>

Options:

-t, --table [tableName]      Specify a table name. (default: default)
-c, --create                 Specify if CREATE TABLE statement must be added to output.
-o, --output [file]          Specify a file to write the SQL. (default: [TIMESTAMP].sql)
-s, --separator [separator]  Specify a separator string. (default: ;)
-l, --collation [collation]  Specify a  collation for table. (default: utf8)
-h, --help                   output usage information
```
