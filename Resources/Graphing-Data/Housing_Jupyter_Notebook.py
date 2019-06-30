#%% Change working directory from the workspace root to the ipynb file location. Turn this addition off with the DataScience.changeDirOnImportExport setting
# ms-python.python added
import os
try:
	os.chdir(os.path.join(os.getcwd(), 'Challenges_21st_Century_Growth/Challenges_of_21st_Century_Growth/Resources'))
	print(os.getcwd())
except:
	pass

#%%
# Dependencies and Setup
import pandas as pd
import quandl
import urllib.request, json


#%%
# Token key for accessing Quandl Data
quandl.ApiConfig.api_key = 'Tx8GhHmntW9csEbtjmH_'

#%% [markdown]
# # Indicators for 3 Metro areas: LA, SF, NY
# * Los Angeles-Long Beach-Anaheim, CA
# * San Francisco-Oakland-Hayward, CA
# * New York-Newark-Jersey City, NY
#%% [markdown]
# #### IMP - Inventory Measure (Public)

#%%
# Zillow Home Value Index (Metro): Inventory Measure (Public)

LA_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M436_IMP.json?api_key=Tx8GhHmntW9csEbtjmH_"
SF_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M11_IMP.json?api_key=Tx8GhHmntW9csEbtjmH_"
NY_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M2_IMP.json?api_key=Tx8GhHmntW9csEbtjmH_"

data = urllib.request.urlopen(LA_data).read()
Inventory_Measure_LA = json.loads(data)

data = urllib.request.urlopen(SF_data).read()
Inventory_Measure_SF = json.loads(data)

data = urllib.request.urlopen(NY_data).read()
Inventory_Measure_NY = json.loads(data)

#%% [markdown]
# #### MRPAH - Median Rental Price - All Homes

#%%
# Zillow Home Value Index (Metro): Zillow Rental Index - All Homes

LA_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M436_ZRIAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
SF_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1047_ZRIAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
NY_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1105_ZRIAH.json?api_key=Tx8GhHmntW9csEbtjmH_"

data = urllib.request.urlopen(LA_data).read()
Rental_Index_LA = json.loads(data)

data = urllib.request.urlopen(SF_data).read()
Rental_Index_SF = json.loads(data)

data = urllib.request.urlopen(NY_data).read()
Rental_Index_NY = json.loads(data)

#%% [markdown]
# #### ZHVIAH - Home Value Index - All Homes

#%%
# Zillow Home Value Index (Metro): Zillow Home Value Index - All Homes

LA_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M436_ZHVIAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
SF_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1047_ZHVIAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
NY_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1105_ZHVIAH.json?api_key=Tx8GhHmntW9csEbtjmH_"

data = urllib.request.urlopen(LA_data).read()
home_value_LA = json.loads(data)

data = urllib.request.urlopen(SF_data).read()
home_value_SF = json.loads(data)

data = urllib.request.urlopen(NY_data).read()
home_value_NY = json.loads(data)

#%% [markdown]
# #### PHIVAH - Percent Of Homes Increasing In Values - All Homes

#%%
# Zillow Home Value Index (Metro): Percent Of Homes Increasing In Values - All Homes

LA_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M436_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
SF_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1047_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
NY_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1105_PHIVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"

data = urllib.request.urlopen(LA_data).read()
homes_increasing_value_LA = json.loads(data)

data = urllib.request.urlopen(SF_data).read()
homes_increasing_value_SF = json.loads(data)

data = urllib.request.urlopen(NY_data).read()
homes_increasing_value_NY = json.loads(data)

#%% [markdown]
# #### PHDVAH - Percent Of Homes Decreasing In Values - All Homes

#%%
# Zillow Home Value Index (Metro): Percent Of Homes Decreasing In Values - All Homes

LA_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M436_PHDVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
SF_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1047_PHDVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"
NY_data = "https://www.quandl.com/api/v3/datasets/ZILLOW/M1105_PHDVAH.json?api_key=Tx8GhHmntW9csEbtjmH_"

data = urllib.request.urlopen(LA_data).read()
homes_decreasing_value_LA = json.loads(data)

data = urllib.request.urlopen(SF_data).read()
homes_decreasing_value_SF = json.loads(data)

data = urllib.request.urlopen(NY_data).read()
homes_decreasing_value_NY = json.loads(data)


#%%
homes_decreasing_value_NY


