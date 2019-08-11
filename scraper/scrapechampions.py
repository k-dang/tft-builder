from selenium import webdriver

from bs4 import BeautifulSoup
import requests
import json

# url = "https://leagueoflegends.fandom.com/wiki/Teamfight_Tactics:Champions"
# item_url = "https://leagueoflegends.fandom.com/wiki/Teamfight_Tactics:Items"

# driver = webdriver.Chrome("C:\\Users\\Kevin\\Downloads\\chromedriver_win32\\chromedriver.exe")
# driver.get(url)

# with open('raw_item.html', 'w', encoding="utf-8") as f:
#     f.write(driver.page_source)

def downloadImages(soup):
    # should interate over all tables rather than just [0]
    tables = soup.find_all("table", {"style": "display:inline-table; text-align:center; width:47%;"})

    for table in tables:
        champ_row = table.find_all("tr")[2]
        champion_spans = champ_row.find_all("span", {"class": "tft-icon"})
        for cps in champion_spans:
            r = requests.get(cps.img.get('data-src'))
            with open('images/' + cps.get('data-param') + '.png', 'wb') as f:
                f.write(r.content)

def generateSynergies(soup):
    tables = soup.find_all("table", {"class": "article-table"})

    synergies = {}

    for table in tables:
        table_rows = table.find_all("tr")
        if table_rows:
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


    with open('json/synergies.json', 'w') as f:
        f.write(json.dumps(synergies, indent=4))
    # for od in origin_desc:
    #     print(od)

def generateChampJson(soup):
    champ_table = soup.find_all("table", {"class": "sortable article-table sticky-header"})
    trs = champ_table[0].find_all("tr")
    trs.pop(0)
    champs = []
    for tr in trs:
        tds = tr.find_all("td")
        origins = []
        origins_spans = tds[2].find_all("span", {"class": "tft-icon"})
        if (len(origins_spans) > 1):
            for os in origins_spans:
                origins.append(os.get('data-param'))
        else:
            origins = [tds[2].get('data-sort-value')]

        classes = []
        classes_spans = tds[3].find_all("span", {"class": "tft-icon"})
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

def downloadSynergyImages():
    r = requests.get('https://na.leagueoflegends.com/en/news/game-updates/gameplay/teamfight-tactics-gameplay-guide?utm_source=web&utm_medium=web&utm_campaign=tft-microsite-2019#patch-quick-champion-reference')

    soup = BeautifulSoup(r.text, features="html.parser")

    divs = soup.find_all("div", {'class': 'tft-icon-container'})

    for div in divs:
        r = requests.get(div.img.get('src'))
        with open('images/icons/' + div.text.strip() + '-icon.png', 'wb') as f:
            f.write(r.content)

def downloadItemImages(soup):
    item_table = soup.find_all("table", {"class": "article-table hover-row hover-column"})
    
    item_rows = item_table[0].find_all("tr")

    items = item_rows[0].find_all("th")

    for td in item_rows[1].find_all("td"):
        print(td)
        break

    # for items in item_rows:
    #     it = items.find_all("td")
    #     for item in it:
    #         itd = item.find_all("span")
    #         print(item)
    #         break
            # print(item.span.get('data-param'))
            # r = requests.get(item.img.get('src'))
            # with open('images/items/' + item.span.get('data-param') + '.png', 'wb') as f:
            #     f.write(r.content)

def downloadImagesSinglePage(soup):
    table = soup.find_all("table", {"class": "navbox"})
    trs = table[0].find_all("tr")

    for i in range(1, 3):
        td = trs[i].find_all("td")[0]
        spans = td.find_all("span", {"class": "tft-icon"})
        for sp in spans:
            r = requests.get(sp.img.get('data-src'))
            with open('images/icons/' + sp.img.get('data-image-key'), 'wb') as f:
                f.write(r.content)
        # break

if __name__ == '__main__':
    with open('raw.html', 'r', encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, features="html.parser")
    # downloading images
    # downloadImages(soup)

    # generate syngergies
    # generateSynergies(soup)

    # generating champ - origin - class associations
    # generateChampJson(soup)

    # generate synergy images
    # downloadSynergyImages()

    # with open('raw_item.html', 'r', encoding="utf-8") as f:
    #     html = f.read()

    # soup = BeautifulSoup(html, features="html.parser")

    ## download item images
    # downloadItemImages(soup)

    # single page image downloads
    with open('better_raw.html', 'r', encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, features="html.parser")
    downloadImagesSinglePage(soup)
