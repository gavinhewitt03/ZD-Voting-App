from pandas import read_csv

# actives = read_csv('./actives.csv')

# actives = actives.drop(columns=['PC', 'Roll Number', 'Position', 'Little?', 'Phone', 'Email', 'Major', 'Minor(s)'])
# actives = actives.drop(range(68, 75))

from datetime import date
from supabase import create_client, Client

SUPABASE_URL = "https://yedwgvmcpvhsaymgmvsz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZHdndm1jcHZoc2F5bWdtdnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwOTMzNzQsImV4cCI6MjA1MTY2OTM3NH0.WBdLSQkoZMPTAY9Wn415blFYvPO9cZz_cs-5aCNBvmQ"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# data = supabase.table("user_customuser").select("*").execute()

# for index, row in actives.iterrows():
#     grad = row['Graduation']
#     if type(grad) != str:
#         continue

#     grad_split = grad.split()

#     if grad_split[0] == 'Autumn':
#         row['Graduation'] = date(int(grad_split[1]), 12, 31)
#     else:
#         row['Graduation'] = date(int(grad_split[1]), 5, 31)
    
#     name_split = row['Name'].split()
    
#     #data = supabase.table("user_customuser").select("*").eq("first_name", name_split[0]).eq("last_name", name_split[1]).execute()
#     #print(data.data)

#     supabase.table("user_customuser").update({'grad_year': row['Graduation'].isoformat()}).eq('first_name', name_split[0]).eq('last_name', name_split[1]).execute()

emails = supabase.table("user_customuser").select("email").execute().data

for email_obj in emails:
    email = email_obj['email']
    supabase.table("user_customuser").update({'email': email.lower()}).eq("email", email).execute()