const convertExcel = require('excel-as-json').processFile
convertExcel('teachersinfo.xlsx', 'teachersinfo.json')
convertExcel('studentsinfo.xlsx', 'studentsinfo.json')
