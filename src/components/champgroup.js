import React from "react"
import PropTypes from "prop-types"
import Image from "./image"
import champgroupStyles from "./champgroup.module.css"

const ChampGroup = props => {
  return (
    <div className={champgroupStyles.container}>
      <span>{props.name}</span>
      <div className={champgroupStyles.champGroupContainer}>
        {props.champs.map(({ node }, i) => (
          <div
            key={i}
            className={champgroupStyles.champImage}
            onClick={e => props.clickEvent(node)}
          >
            <Image src={node.name + ".png"}></Image>
          </div>
        ))}
      </div>
    </div>
  )
}

Image.propTypes = {
  name: PropTypes.string,
  champs: PropTypes.array,
  clickEvent: PropTypes.func,
}

export default ChampGroup
