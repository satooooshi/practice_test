#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function
import time
from flask import Flask
app = Flask(__name__)
@app.route("/")



import pandas as pd

one_row_start_num=2
one_col_num=5
one_end_row_num=57
two_row_start_num=2
two_col_num=6
two_end_row_num=55

exfileOne='want.xls'
exfileTwo='want.xlsx'
dataA='1Unnamed: 4'
dataB='Sheet1本币'
outputFile='CompareData.xlsx'

def parseExcelToDf(fileName,row_start):
    excel = pd.ExcelFile(fileName)
    print("--Sheet names--")
    print(excel.sheet_names)
    # まとめ用DataFrame
    df = pd.DataFrame()
# シートから一つずつデータを取り出す
    for sheet in excel.sheet_names:
        sheetdf = excel.parse(sheetname=sheet, skiprows=[0,row_start])
        print("--Column names--")
        print(sheetdf.columns)
    # 各列名にシート名をつけておく
        sheetdf.columns = sheet + sheetdf.columns
        df = pd.concat([df, sheetdf])
        return df


print("-----------------------------------------------")

print(exfileOne+":")

#iloc[rowstart:rowend,colstart:colend]
dfone=parseExcelToDf(exfileOne,one_row_start_num)
print(dfone.iloc[:,one_col_num-1:one_col_num])
df_for_write_one=dfone[dfone.duplicated(subset=dataA,keep=False)]
#print(df_for_write_one)
#print(dfone[dfone.duplicated(subset='1Unnamed: 4',keep=False)].iloc[:,4:5])

print(exfileOne+":")
dftwo=parseExcelToDf(exfileTwo,two_row_start_num)
#print(dftwo.duplicated(subset='Sheet1本币',keep=False))#True or False
print(dftwo.iloc[0:two_end_row_num,two_col_num-1:two_col_num])
df_for_write_two=dftwo[dftwo.duplicated(subset=dataB,keep=False)]
#print(df_for_write_two)
#print(dftwo[dftwo.duplicated(subset='Sheet1本币',keep=False)].iloc[:,5:6])

excel_writer = pd.ExcelWriter(outputFile)
df_for_write_one.to_excel(excel_writer, sheet_name='dataA')
df_for_write_two.to_excel(excel_writer, sheet_name='dataB')
excel_writer.save()



if __name__ == "__main__":
    print('on hello')
    app.run(host="127.0.0.1", port=5000)
