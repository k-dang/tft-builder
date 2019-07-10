import React from "react"
import ChampGroup from "../components/champgroup"
import { useStaticQuery, graphql } from "gatsby"
import champbuilderStyles from "./champbuilder.module.css"

const ChampBuilder = () => {
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
  const origins = ["Demon", "Dragon", "Glacial"]
  const classes = ["Assassin", "Blademaster", "Brawler", "Elementalist", "Gunslinger"]

  function addChamp(champNode) {
  console.log(champNode)
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
            addChamp={addChamp}
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
            addChamp={addChamp}
          ></ChampGroup>
        ))}
      </div>
      <div className={champbuilderStyles.buffGroups}>
        <h2>Synergies</h2>
      </div>
    </div>
  )
}

export default ChampBuilder
