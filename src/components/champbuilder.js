import React, { useState } from "react"
import ChampGroup from "../components/champgroup"
import { useStaticQuery, graphql } from "gatsby"
import champbuilderStyles from "./champbuilder.module.css"
import { synergies } from "./synergies"
import Image from "./image"

const ChampBuilder = () => {
  const [champs, setChamps] = useState([])
  const [buffs, setBuffs] = useState([])
  const [pBuffs, setPBuffs] = useState([])

  const data = useStaticQuery(graphql`
    query {
      allChampsJson {
        edges {
          node {
            name
            origin
            class
            id
          }
        }
      }
    }
  `)

  const allChamps = data.allChampsJson.edges
  const origins = [
    "Demon",
    "Dragon",
    "Exile",
    "Glacial",
    "Hextech",
    "Imperial",
    "Ninja",
    "Noble",
    "Phantom",
    "Pirate",
    "Robot",
    "Void",
    "Wild",
    "Yordle",
  ]
  const classes = [
    "Assassin",
    "Blademaster",
    "Brawler",
    "Elementalist",
    "Guardian",
    "Gunslinger",
    "Knight",
    "Ranger",
    "Shapeshifter",
    "Sorcerer",
  ]

  function updateBuffs(updatedChamps) {
    // get unique champs
    const uniqueChamps = []
    const mymap = new Map()
    updatedChamps.forEach(({ node }) => {
      if (!mymap.has(node.id)) {
        mymap.set(node.id, 1)
        uniqueChamps.push(node)
      }
    })

    // count classes
    const classes = new Map()
    uniqueChamps.forEach(champ => {
      champ.class.forEach(c => {
        if (classes.has(c)) {
          classes.set(c, classes.get(c) + 1)
        } else {
          classes.set(c, 1)
        }
      })
    })

    //count origins
    const origins = new Map()
    uniqueChamps.forEach(champ => {
      champ.origin.forEach(c => {
        if (origins.has(c)) {
          origins.set(c, origins.get(c) + 1)
        } else {
          origins.set(c, 1)
        }
      })
    })

    // possible synergies
    const pClassBuffs = getPossibleBuffs(classes)
    const pOriginBuffs = getPossibleBuffs(origins)
    const allPossibleBuffs = pClassBuffs.concat(pOriginBuffs)

    // actual synergies
    const originBuffs = getActiveBuffs(origins)
    const classBuffs = getActiveBuffs(classes)
    const updatedBuffs = originBuffs.concat(classBuffs)

    // diff
    updatedBuffs.forEach((cb, i) => {
      for (var j = 0; j < allPossibleBuffs.length; j++) {
        if (allPossibleBuffs[j].name === cb.name) {
          allPossibleBuffs.splice(j, 1)
          break
        }
      }
    })
    setPBuffs(allPossibleBuffs)
    return updatedBuffs
  }

  function getPossibleBuffs(toSearch) {
    const pBuffs = []
    for (var [key, value] of toSearch.entries()) {
      const buff = synergies[key]
      pBuffs.push({
        name: key,
        icon: buff.icon,
        total: value,
        desc: buff.desc,
        rank: "",
        max: buff.max
      })
    }
    return pBuffs
  }

  function getActiveBuffs(toSearch) {
    const buffs = []
    for (var [key, value] of toSearch.entries()) {
      const buff = synergies[key]
      if (value % buff.min >= 0) {
        const rank = value / buff.min
        const buffMax = floorMax(rank, buff.max / buff.min)
        if (buff.ranks[buffMax]) {
          buffs.push({
            name: key,
            icon: buff.icon,
            total: value,
            desc: buff.desc,
            rank: buff.ranks[buffMax],
            max: buff.max
          })
        }
        if (key === "Ninja") {
          if (value === 4) {
            buffs.push({
              name: key,
              icon: buff.icon,
              total: value,
              desc: buff.desc,
              rank: buff.ranks[buffMax],
              max: buff.max
            })
          }
        }
      }
    }
    return buffs
  }

  function floorMax(rank, max) {
    const floor = Math.floor(rank)
    if (floor > max) {
      return max
    }
    return floor
  }

  function addChamp(champNode) {
    const updatedChamps = [...champs, { node: champNode }]
    setChamps(updatedChamps)
    setBuffs(updateBuffs(updatedChamps))
  }

  function removeChamp(champNode) {
    let copy = [...champs]
    for (var i = 0; i < copy.length; i++) {
      if (copy[i].node.id === champNode.id) {
        copy.splice(i, 1)
        break
      }
    }
    setChamps(copy)
    setBuffs(updateBuffs(copy))
  }

  return (
    <div className={champbuilderStyles.container}>
      <div className={champbuilderStyles.originGroups}>
        <h2>Origin</h2>
        {origins.map((o, index) => (
          <ChampGroup
            key={index}
            name={o}
            champs={allChamps.filter(({ node }) => node.origin.includes(o))}
            clickEvent={addChamp}
          ></ChampGroup>
        ))}
      </div>
      <div className={champbuilderStyles.classGroups}>
        <h2>Class</h2>
        {classes.map((c, index) => (
          <ChampGroup
            key={index}
            name={c}
            champs={allChamps.filter(({ node }) => node.class.includes(c))}
            clickEvent={addChamp}
          ></ChampGroup>
        ))}
      </div>
      <div className={champbuilderStyles.buffGroups}>
        <div className={champbuilderStyles.fixedGroup}>
          <h2>Synergies</h2>
          <ChampGroup
            name="Your Team"
            champs={champs}
            clickEvent={removeChamp}
          ></ChampGroup>
          <h2>Buffs</h2>
          {buffs.map((b, i) => (
            <div className={champbuilderStyles.buffGroup} key={i}>
              <div className={champbuilderStyles.buffDisplay}>
                <div className={champbuilderStyles.buffIcons}>
                  <Image src={b.icon}></Image>
                </div>
                <div className={champbuilderStyles.buffName}>{b.name}</div>
                <div className={champbuilderStyles.totals}>({b.total} / {b.max})</div>
              </div>
              {/* <div className={champbuilderStyles.desc}>{b.desc}</div> */}
            </div>
          ))}
          {pBuffs.map((b, i) => (
            <div className={champbuilderStyles.pbuffGroup} key={i}>
              <div className={champbuilderStyles.buffDisplay}>
                <div className={champbuilderStyles.buffIcons}>
                  <Image src={b.icon}></Image>
                </div>
                <div className={champbuilderStyles.buffName}>{b.name}</div>
                <div className={champbuilderStyles.totals}>({b.total} / {b.max})</div>
              </div>
              {/* <div className={champbuilderStyles.desc}>{b.desc}</div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChampBuilder
