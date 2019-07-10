from selenium import webdriver

from bs4 import BeautifulSoup
import requests
import json

url = "https://leagueoflegends.fandom.com/wiki/Teamfight_Tactics:Champions"

# driver = webdriver.Chrome("C:\\Users\\Kevin\\Downloads\\chromedriver_win32\\chromedriver.exe")
# driver.get(url)

# with open('raw.html', 'w', encoding="utf-8") as f:
#     f.write(driver.page_source)

def downloadImages(soup):
    tables = soup.find_all("table", {"class": "article-table"})
    # should interate over all tables rather than just [0]
    tabbertab = soup.find_all("div", {"class": "tabbertab"})
    new_tables = tabbertab[0].find_all("table", {"class": "article-table"})

    for table in new_tables:
        champ_row = table.find_all("tr")[2]
        champion_spans = champ_row.find_all("span", {"class": "tft-icon tooltips-init-complete"})

        for cps in champion_spans:
            r = requests.get(cps.img.get('data-src'))
            with open('images/' + cps.get('data-param') + '.png', 'wb') as f:
                f.write(r.content)

def generateSynergies(soup):
    tables = soup.find_all("table", {"class": "article-table"})

    synergies = {}

    for table in tables:
        table_rows = table.find_all("tr")
        origin_name = table_rows[0]
        origin_desc = table_rows[1]
        desc = origin_desc.td.get_text().split('\n')
        synergies[origin_name.span.get("data-param")] = {
            'min': '',
            'max': '',
            'desc': desc[0],
            'ranks': {},
            'icon': '',
        }
        # print(origin_name.span.get("data-param"))
        # print(origin_desc.td.get_text().split('\n'))
        break

    with open('json/synergies.json', 'w') as f:
        f.write(json.dumps(synergies, indent=4))
    # for od in origin_desc:
    #     print(od)

def generateChampJson(soup):
    champ_table = soup.find_all("table", {"class": "sortable article-table sticky-header jquery-tablesorter"})
    tbody = champ_table[0].find_all("tbody")
    trs = tbody[0].find_all("tr")
    tds = trs[0].find_all("td")
    champs = []
    for tr in trs:
        tds = tr.find_all("td")
        origins = []
        origins_spans = tds[2].find_all("span", {"class": "tft-icon tooltips-init-complete"})
        if (len(origins_spans) > 1):
            for os in origins_spans:
                origins.append(os.get('data-param'))
        else:
            origins = [tds[2].get('data-sort-value')]

        classes = []
        classes_spans = tds[3].find_all("span", {"class": "tft-icon tooltips-init-complete"})
        if (len(classes_spans) > 1):
            for cs in classes_spans:
                classes.append(cs.get('data-param'))
        else:
            classes = [tds[3].get('data-sort-value')]

        champs.append({
            'name': tds[0].get('data-sort-value'),
            'tier': tds[1].get('data-sort-value'),
            'origin': origins,
            'class': classes
        })

    with open('json/champs.json', 'w') as f:
        f.write(json.dumps(champs, indent=4))

if __name__ == '__main__':
    with open('raw.html', 'r', encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, features="html.parser")
    # downloading images
    # downloadImages(soup)

    # generate syngergies
    # generateSynergies(soup)

    # generating champ - origin - class associations
    generateChampJson(soup)
