import csv
import json

def generate_csv(data):
    with open("server\\exports\\csv\\Selected_papers.csv", "w", newline='', encoding='utf-8') as csvfile:
        f = csv.writer(csvfile)

        # Write CSV Header, If you don't need that, remove this line
        f.writerow(["authors", "title", "url"])

        for x in data:
            f.writerow([x["authors"],
                        x["title"],
                        x["url"],
                       ])
